'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { requireAdminUser } from '@/lib/admin/auth';
import { fallbackCategories } from '@/lib/data/public';
import { commitArticleSnapshot } from '@/lib/github/content-commit';
import type { ArticleStatus, ArticleType } from '@/types/database';

function safeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^가-힣a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function splitList(value: FormDataEntryValue | null) {
  return String(value ?? '')
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

async function ensureDefaultCategories() {
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase.from('categories').select('id, slug');
  const existing = new Set((data ?? []).map((item) => item.slug));

  const missing = fallbackCategories.filter((item) => !existing.has(item.slug));
  if (missing.length) {
    await supabase.from('categories').insert(
      missing.map((item) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        description: item.description,
        sort_order: item.sort_order
      }))
    );
  }
}

export async function createArticle(formData: FormData): Promise<void> {
  const user = await requireAdminUser();
  const supabase = createSupabaseAdminClient();

  await ensureDefaultCategories();

  const title = String(formData.get('title') ?? '').trim();
  const rawSlug = String(formData.get('slug') ?? '').trim();
  const slug = safeSlug(rawSlug || title);
  const categorySlug = String(formData.get('category_slug') ?? 'lifelong-education');
  const status = String(formData.get('status') ?? 'draft') as ArticleStatus;
  const articleType = String(formData.get('article_type') ?? 'normal') as ArticleType;
  const shouldCommitToGit = formData.get('commit_to_git') === 'on';
  const now = new Date().toISOString();

  if (!title || !slug) {
    throw new Error('제목과 슬러그가 필요합니다.');
  }

  const { data: category } = await supabase
    .from('categories')
    .select('id, slug, name')
    .eq('slug', categorySlug)
    .maybeSingle();

  const scheduledAt = String(formData.get('scheduled_at') ?? '').trim();
  const publishedAt = status === 'published' ? now : null;

  const sourceUrls = splitList(formData.get('source_urls'));
  const tags = splitList(formData.get('tags'));

  const article = {
    title,
    slug,
    subtitle: String(formData.get('subtitle') ?? '').trim() || null,
    summary: String(formData.get('summary') ?? '').trim() || null,
    content: String(formData.get('content') ?? '').trim() || null,
    category_id: category?.id ?? null,
    category_slug: category?.slug ?? categorySlug,
    category_name: category?.name ?? null,
    article_type: articleType,
    status,
    editorial_status: status === 'published' ? 'published' : status === 'scheduled' ? 'scheduled' : 'writing',
    thumbnail_url: String(formData.get('thumbnail_url') ?? '').trim() || null,
    image_caption: String(formData.get('image_caption') ?? '').trim() || null,
    image_source_name: String(formData.get('image_source_name') ?? '').trim() || null,
    image_source_url: String(formData.get('image_source_url') ?? '').trim() || null,
    image_author: String(formData.get('image_author') ?? '').trim() || null,
    image_license: String(formData.get('image_license') ?? '').trim() || null,
    visual_mode: 'photo',
    author_name: String(formData.get('author_name') ?? '').trim() || user.email || '에듀저널 편집부',
    is_sponsored: ['brand_interview', 'sponsored', 'advertorial'].includes(articleType),
    tags,
    source_urls: sourceUrls,
    source_note: String(formData.get('source_note') ?? '').trim() || null,
    fact_checked: formData.get('fact_checked') === 'on',
    compliance_checked: formData.get('compliance_checked') === 'on',
    scheduled_at: scheduledAt || null,
    published_at: publishedAt,
    created_at: now,
    updated_at: now
  };

  const { data, error } = await supabase.from('articles').insert(article).select('id, slug').single();

  if (error) {
    throw new Error(error.message);
  }

  let githubCommitResult: Awaited<ReturnType<typeof commitArticleSnapshot>> | null = null;

  if (shouldCommitToGit) {
    githubCommitResult = await commitArticleSnapshot({
      id: data.id,
      title,
      slug,
      status,
      article: {
        ...article,
        id: data.id
      },
      actorEmail: user.email
    });
  }

  await supabase.from('admin_activity_logs').insert({
    actor_email: user.email,
    action: 'article.create',
    target_table: 'articles',
    target_id: data.id,
    details: { title, slug, status, git: githubCommitResult },
    created_at: now
  });

  await supabase.from('article_revisions').insert({
    article_id: data.id,
    editor_email: user.email,
    revision_data: {
      ...article,
      git: githubCommitResult
    },
    created_at: now
  });

  revalidatePath('/');
  revalidatePath('/articles');
  revalidatePath(`/articles/${data.slug}`);
  revalidatePath(`/category/${categorySlug}`);

  redirect('/admin/articles');
}
