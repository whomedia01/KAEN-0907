import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { eduArticleSeeds } from '@/lib/data/edu-articles';
import type { Article, Category, Product, SiteSettings } from '@/types/database';

const fallbackSettings: SiteSettings = {
  id: 'fallback',
  site_name: '에듀저널',
  site_description: '평생교육, 자격증, 시니어 학습, 에듀테크, 교육기관 정보를 다루는 교육 전문 인터넷매체입니다.',
  operator_name: '알고파트너스',
  business_name: '알고파트너스',
  representative_name: '박예준',
  business_registration_number: '450-07-03104',
  mail_order_registration_number: '제2025-인천서구-3321호',
  media_registration_status: 'preparing',
  media_registration_number: '등록 신청 예정',
  publisher_name: '박예준',
  editor_name: '박예준',
  youth_protection_manager: '박예준',
  privacy_manager: '박예준',
  address: '인천광역시 서구 청라커낼로 270, 커낼힐스빌 2층 2498호',
  contact_email: 'contact@edujournal.kr',
  contact_phone: '확인 후 표기'
};

export const fallbackCategories = [
  { id: 'cat-lifelong-education', name: '평생교육·HRD', slug: 'lifelong-education', description: '평생교육 정책과 성인학습 현장', sort_order: 1 },
  { id: 'cat-career-dev', name: '자격증·자기계발', slug: 'career-dev', description: '자격증과 직무역량 교육', sort_order: 2 },
  { id: 'cat-senior-education', name: '시니어·실버교육', slug: 'senior-education', description: '시니어 학습과 디지털 문해 교육', sort_order: 3 },
  { id: 'cat-edutech-ai', name: '에듀테크·AI', slug: 'edutech-ai', description: 'AI 교육과 원격교육 기술', sort_order: 4 },
  { id: 'cat-wellness-life', name: '웰니스·인문학', slug: 'wellness-life', description: '마음건강과 교양 교육', sort_order: 5 },
  { id: 'cat-edu-institution', name: '교육기관 탐방', slug: 'edu-institution', description: '교육기관 운영 사례', sort_order: 6 },
  { id: 'cat-interview-people', name: '명사 인터뷰', slug: 'interview-people', description: '교육 전문가 인터뷰', sort_order: 7 },
  { id: 'cat-opinion', name: '오피니언', slug: 'opinion', description: '교육 칼럼과 기고', sort_order: 8 },
  { id: 'cat-press-release', name: '공지·보도', slug: 'press-release', description: '교육 관련 공지와 보도자료', sort_order: 9 }
] as Category[];

function createOptionalCmsClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return null;
  try {
    return createSupabaseAdminClient();
  } catch {
    return null;
  }
}

function category(slug: string) {
  return fallbackCategories.find((item) => item.slug === slug) ?? fallbackCategories[0]!;
}

function realPhotoThumbnail(articleId: string, categorySlug: string) {
  const seed = encodeURIComponent(`edujournal-photo-${categorySlug}-${articleId}`);
  return `https://picsum.photos/seed/${seed}/1600/900`;
}

function text(summary: string) {
  return `${summary}\n\n교육기관과 학습자는 과정 선택 기준을 더 세밀하게 살펴보고 있다. 운영 기준, 상담 체계, 수료 이후 활용 가능성, 학습 관리 방식이 함께 검토된다.\n\n에듀저널은 교육 정책, 자격제도, 시니어 교육, 에듀테크와 교육기관 운영 사례를 지속적으로 다룬다.`;
}

function toArticle(seed: (typeof eduArticleSeeds)[number]) {
  const cat = category(seed.categorySlug);
  const photo = realPhotoThumbnail(seed.id, seed.categorySlug);

  return {
    id: seed.id,
    title: seed.title,
    slug: seed.id,
    subtitle: seed.subtitle,
    summary: seed.summary,
    content: seed.content || text(seed.summary),
    article_type: seed.articleType ?? 'normal',
    status: 'published',
    thumbnail_url: photo,
    image_caption: seed.imageCaption || `${cat.name} 관련 교육 현장 자료사진.`,
    image_source_name: seed.imageSourceName || '공개 사진 자료',
    image_source_url: photo,
    author_name: seed.author ?? '에듀저널 편집부',
    is_sponsored: ['brand_interview', 'sponsored', 'advertorial'].includes(seed.articleType ?? 'normal'),
    tags: seed.tags,
    published_at: seed.publishedAt,
    created_at: seed.publishedAt,
    updated_at: seed.publishedAt,
    categories: cat
  } as Article;
}

export const fallbackArticles = eduArticleSeeds.map(toArticle);

function normalizeCategory(row: Record<string, unknown>, index = 0): Category {
  return {
    id: String(row.id),
    name: String(row.name ?? '분류 없음'),
    slug: String(row.slug ?? row.id),
    description: row.description ? String(row.description) : null,
    sort_order: Number(row.sort_order ?? index + 1)
  };
}

async function getCmsCategories(): Promise<Category[] | null> {
  const supabase = createOptionalCmsClient();
  if (!supabase) return null;

  const { data, error } = await supabase.from('categories').select('*').order('sort_order', { ascending: true });
  if (error || !data?.length) return null;
  return data.map((row, index) => normalizeCategory(row as Record<string, unknown>, index));
}

function categoryMap(categories: Category[]) {
  return new Map(categories.map((item) => [item.id, item]));
}

function normalizeArticle(row: Record<string, unknown>, categories: Category[]): Article {
  const byId = categoryMap(categories);
  const categoryId = row.category_id ? String(row.category_id) : null;
  const categoryItem = (categoryId && byId.get(categoryId)) || fallbackCategories[0]!;
  const publishedAt = row.published_at ? String(row.published_at) : String(row.created_at ?? new Date().toISOString());
  const updatedAt = row.updated_at ? String(row.updated_at) : publishedAt;
  const slug = String(row.slug ?? row.id);
  const thumbnail = row.thumbnail_url ? String(row.thumbnail_url) : realPhotoThumbnail(String(row.id), categoryItem.slug);

  return {
    id: String(row.id),
    title: String(row.title ?? '제목 없음'),
    slug,
    subtitle: row.subtitle ? String(row.subtitle) : null,
    summary: row.summary ? String(row.summary) : null,
    content: row.content ? String(row.content) : null,
    category_id: categoryId,
    article_type: (row.article_type as Article['article_type']) ?? 'normal',
    status: (row.status as Article['status']) ?? 'draft',
    editorial_status: (row.editorial_status as Article['editorial_status']) ?? null,
    thumbnail_url: thumbnail,
    image_caption: row.image_caption ? String(row.image_caption) : `${categoryItem.name} 관련 대표 이미지.`,
    image_source_name: row.image_source_name ? String(row.image_source_name) : '관리자 등록 이미지',
    image_source_url: row.image_source_url ? String(row.image_source_url) : thumbnail,
    image_author: row.image_author ? String(row.image_author) : null,
    image_license: row.image_license ? String(row.image_license) : null,
    image_license_url: row.image_license_url ? String(row.image_license_url) : null,
    visual_mode: (row.visual_mode as Article['visual_mode']) ?? 'photo',
    author_name: String(row.author_name ?? '에듀저널 편집부'),
    client_id: row.client_id ? String(row.client_id) : null,
    is_sponsored: Boolean(row.is_sponsored),
    sponsored_notice: row.sponsored_notice ? String(row.sponsored_notice) : null,
    tags: Array.isArray(row.tags) ? (row.tags as string[]) : [],
    seo_title: row.seo_title ? String(row.seo_title) : null,
    seo_description: row.seo_description ? String(row.seo_description) : null,
    source_urls: Array.isArray(row.source_urls) ? (row.source_urls as string[]) : [],
    source_note: row.source_note ? String(row.source_note) : null,
    fact_checked: typeof row.fact_checked === 'boolean' ? row.fact_checked : false,
    scheduled_at: row.scheduled_at ? String(row.scheduled_at) : null,
    compliance_checked: typeof row.compliance_checked === 'boolean' ? row.compliance_checked : false,
    forbidden_terms_detected: Array.isArray(row.forbidden_terms_detected) ? (row.forbidden_terms_detected as string[]) : [],
    published_at: publishedAt,
    created_at: String(row.created_at ?? publishedAt),
    updated_at: updatedAt,
    categories: categoryItem
  };
}

async function getCmsArticles(limit?: number): Promise<Article[] | null> {
  const supabase = createOptionalCmsClient();
  if (!supabase) return null;

  const categories = (await getCmsCategories()) ?? fallbackCategories;
  let query = supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error || !data?.length) return null;
  return data.map((row) => normalizeArticle(row as Record<string, unknown>, categories));
}

async function getCmsArticlesByCategory(slug: string, limit?: number): Promise<Article[] | null> {
  const supabase = createOptionalCmsClient();
  if (!supabase) return null;

  const categories = (await getCmsCategories()) ?? fallbackCategories;
  const categoryItem = categories.find((item) => item.slug === slug);
  if (!categoryItem) return null;

  let query = supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .eq('category_id', categoryItem.id)
    .order('published_at', { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error || !data?.length) return null;
  return data.map((row) => normalizeArticle(row as Record<string, unknown>, categories));
}

async function getCmsArticleBySlug(slug: string): Promise<Article | null> {
  const supabase = createOptionalCmsClient();
  if (!supabase) return null;

  const categories = (await getCmsCategories()) ?? fallbackCategories;
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .eq('slug', slug)
    .maybeSingle();

  if (error || !data) return null;
  return normalizeArticle(data as Record<string, unknown>, categories);
}

async function getCmsSettings(): Promise<SiteSettings | null> {
  const supabase = createOptionalCmsClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  return { ...fallbackSettings, ...(data as Partial<SiteSettings>) } as SiteSettings;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  return (await getCmsSettings()) ?? fallbackSettings;
}

export async function getCategories(): Promise<Category[]> {
  return (await getCmsCategories()) ?? fallbackCategories;
}

export async function getArticles(limit?: number): Promise<Article[]> {
  return (await getCmsArticles(limit)) ?? fallbackArticles.slice(0, limit ?? fallbackArticles.length);
}

export async function getPublishedArticles(limit?: number): Promise<Article[]> {
  return getArticles(limit);
}

export async function getArticlesByCategory(slug: string, limit?: number): Promise<Article[]> {
  const cmsItems = await getCmsArticlesByCategory(slug, limit);
  if (cmsItems?.length) return cmsItems;

  const items = fallbackArticles.filter((article) => article.categories?.slug === slug);
  return items.slice(0, limit ?? items.length);
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const cmsItem = await getCmsArticleBySlug(slug);
  if (cmsItem) return cmsItem;
  return fallbackArticles.find((article) => article.slug === slug || article.id === slug) ?? null;
}

export function getWordPressAdminUrl() {
  return '';
}

export async function getProducts(): Promise<Product[]> { return []; }
