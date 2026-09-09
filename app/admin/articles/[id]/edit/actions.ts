'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { requireAdminUser } from '@/lib/admin/auth';
import type { ArticleStatus, ArticleType } from '@/types/database';

function splitList(value: FormDataEntryValue | null) {
  return String(value ?? '')
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function updateArticle(articleId: string, formData: FormData): Promise<void> {
  const user = await requireAdminUser();
  const supabase = createSupabaseAdminClient();

  const title = String(formData.get('title') ?? '').trim();
  const rawSlug = String(formData.get('slug') ?? '').trim();
  const slug = rawSlug || articleId;
  const categorySlug = String(formData.get('category_slug') ?? 'lifelong-education');
  const status = String(formData.get('status') ?? 'draft') as ArticleStatus;
  const articleType = String(formData.get('article_type') ?? 'normal') as ArticleType;
  const authorName = String(formData.get('author_name') ?? '').trim() || '취재팀';
  const content = String(formData.get('content') ?? '').trim();
  const now = new Date().toISOString();

  if (!title || title.length < 2) {
    throw new Error('기사 제목을 최소 2자 이상 입력해야 합니다.');
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

  const updates = {
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
    author_name: authorName,
    tags,
    source_urls: sourceUrls,
    source_note: String(formData.get('source_note') ?? '').trim() || null,
    fact_checked: formData.get('fact_checked') === 'on',
    compliance_checked: formData.get('compliance_checked') === 'on',
    scheduled_at: scheduledAt || null,
    published_at: publishedAt,
    updated_at: now
  };

  const { error } = await supabase.from('articles').update(updates).eq('id', articleId);

  if (error) {
    throw new Error(error.message);
  }

  await supabase.from('admin_activity_logs').insert({
    actor_email: user.email,
    action: 'article.update',
    target_table: 'articles',
    target_id: articleId,
    details: { title, slug, status },
    created_at: now
  });

  revalidatePath('/');
  revalidatePath('/articles');
  revalidatePath(`/articles/${slug}`);
  revalidatePath(`/category/${categorySlug}`);
  revalidatePath('/admin/articles');

  redirect('/admin/articles');
}
