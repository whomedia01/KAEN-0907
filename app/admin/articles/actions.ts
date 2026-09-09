'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createSlug } from '@/lib/utils/format';
import { detectForbiddenTerms } from '@/lib/forbidden-terms';
import { analyzeArticleStructure } from '@/lib/editorial/article-style';

function optionalText(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? '').trim();
  return value || null;
}

function optionalDateTime(formData: FormData, key: string) {
  const value = optionalText(formData, key);
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function parseSourceUrls(formData: FormData) {
  const value = optionalText(formData, 'source_urls');
  if (!value) return null;
  const items = value.split(/[\n,]+/).map((item) => item.trim()).filter(Boolean);
  return items.length ? items : null;
}

async function resolveCategoryId(categorySlug: string | null) {
  if (!categorySlug) return null;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', categorySlug)
    .maybeSingle();
  return data?.id ?? null;
}

export async function createArticle(formData: FormData) {
  const title = String(formData.get('title') ?? '').trim();
  const content = String(formData.get('content') ?? '').trim();
  const article_type = String(formData.get('article_type') ?? 'normal');
  const requestedStatus = String(formData.get('status') ?? 'draft');
  const summary = optionalText(formData, 'summary');
  const thumbnail_url = optionalText(formData, 'thumbnail_url');
  const image_source_name = optionalText(formData, 'image_source_name');
  const image_license = optionalText(formData, 'image_license');
  const categorySlug = optionalText(formData, 'category_slug');
  const category_id = await resolveCategoryId(categorySlug);
  const imageRightsConfirmed = formData.get('image_rights_confirmed') === 'true';
  const hasImageRisk = formData.get('image_contains_people_or_trademarks') === 'true';
  const isImportedArchive = formData.get('is_imported_archive') === 'true';
  const factChecked = formData.get('fact_checked') === 'true';
  const scheduledAt = optionalDateTime(formData, 'scheduled_at');
  const originalPublishedAt = optionalDateTime(formData, 'original_published_at');
  const urls = parseSourceUrls(formData);
  const forbidden = detectForbiddenTerms(`${title}\n${content}`);
  const structure = analyzeArticleStructure({ title, summary, content, articleType: article_type });

  const warnings: string[] = [];
  if (!title || !content) warnings.push('제목과 본문 확인 필요');
  if (!category_id) warnings.push('카테고리 연결 확인 필요');
  if (thumbnail_url && (!image_source_name || !image_license)) warnings.push('대표 이미지 출처/라이선스 확인 필요');
  if (thumbnail_url && !imageRightsConfirmed) warnings.push('이미지 권리 확인 체크 필요');
  if (hasImageRisk) warnings.push('인물/상표 포함 이미지 수동 검수 필요');
  if (!urls?.length) warnings.push('기사 참고 출처 URL 확인 필요');
  if (!factChecked) warnings.push('팩트체크 확인 필요');
  if (isImportedArchive && !originalPublishedAt) warnings.push('이관 기사 원문 일시 확인 필요');
  warnings.push(...structure.warnings);

  const status = requestedStatus === 'published' ? 'published' : scheduledAt ? 'review' : requestedStatus;
  const editorial_status = requestedStatus === 'published' ? 'published' : scheduledAt ? 'scheduled' : requestedStatus === 'review' ? 'review' : 'writing';

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from('articles').insert({
    title,
    slug: createSlug(String(formData.get('slug') || title)) || crypto.randomUUID(),
    subtitle: optionalText(formData, 'subtitle'),
    summary,
    content,
    category_id,
    article_type,
    status,
    editorial_status,
    thumbnail_url,
    image_caption: optionalText(formData, 'image_caption'),
    image_source_name,
    image_source_url: optionalText(formData, 'image_source_url'),
    image_author: optionalText(formData, 'image_author'),
    image_license,
    image_license_url: optionalText(formData, 'image_license_url'),
    visual_mode: thumbnail_url ? 'photo' : 'auto',
    is_sponsored: ['brand_interview', 'sponsored', 'advertorial'].includes(article_type),
    sponsored_notice: optionalText(formData, 'sponsored_notice'),
    source_urls: urls,
    source_note: optionalText(formData, 'source_note'),
    fact_checked: factChecked,
    is_imported_archive: isImportedArchive,
    archive_source_label: optionalText(formData, 'archive_source_label'),
    original_published_at: originalPublishedAt,
    imported_at: isImportedArchive ? new Date().toISOString() : null,
    scheduled_at: scheduledAt,
    forbidden_terms_detected: [...forbidden, ...warnings],
    compliance_checked: structure.ok && forbidden.length === 0 && warnings.length === 0,
    published_at: requestedStatus === 'published' ? new Date().toISOString() : null
  });

  revalidatePath('/admin/articles');
  revalidatePath('/articles');
  revalidatePath('/');
  if (categorySlug) revalidatePath(`/category/${categorySlug}`);

  if (error) return { ok: false, message: error.message };

  const notices = [...forbidden, ...warnings];
  return { ok: true, message: notices.length ? `저장되었습니다. 확인 필요: ${notices.join(', ')}` : '저장되었습니다.' };
}
