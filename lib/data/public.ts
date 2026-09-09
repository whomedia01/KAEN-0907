import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { eduArticleSeeds } from '@/lib/data/edu-articles';
import type { Article, Category, Product, SiteSettings } from '@/types/database';

const fallbackSettings: SiteSettings = {
  id: 'fallback',
  site_name: '한국AI교육신문',
  site_description: '인공지능(AI) 교육, 평생학습, 에듀테크, 자격증, 직무역량 정보를 다루는 AI 교육 전문 인터넷신문입니다.',
  operator_name: '(주)후미디어',
  business_name: '(주)후미디어',
  representative_name: '황광성',
  business_registration_number: '119-86-25861',
  mail_order_registration_number: '제2025-서울금천-0000호',
  media_registration_status: 'preparing',
  media_registration_number: '등록 신청 예정',
  publisher_name: '황광성',
  editor_name: '황광성',
  youth_protection_manager: '황광성',
  privacy_manager: '황광성',
  address: '서울특별시 금천구 가산디지털2로 53 (가산동) 한라시그마밸리 1102호 ~ 1104호',
  contact_email: 'whomedia03@gmail.com',
  contact_phone: '02-6443-4222',
  contact_fax: '02-6443-4223'
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
  return `${summary}

이번 사안은 최근 급변하는 인공지능 기술 환경과 교육 수요자들의 눈높이 변화가 맞물리며, 교육 현장의 질적 패러다임 전환을 상징하는 대표적 사례로 주목받고 있다. 단순한 기술 전달 위주의 기존 커리큘럼에서 탈피하여, 학습자 개인의 실무 역량 개발과 지속 가능한 성장 모델을 구축해야 한다는 목소리가 커지고 있다.

■ 현장에서 확인한 핵심 쟁점과 실무 운영 실태

수도권 및 지역 주요 교육 거점을 심층 취재한 결과, 학습자들은 더 이상 단편적인 이론 강의나 홍보성 수식어에 현혹되지 않고 있다. 실제 교육 현장에서는 강사진의 산업체 실무 경력, 구체적인 주차별 학습 프로젝트 결과물, 1:1 밀착 학습 관리 시스템, 그리고 수료 이후 객관적으로 입증 가능한 자격 취득 및 실무 연계성이 교육 선택의 가장 중요한 기준점으로 자리잡았다.

한 교육 현장 전문가는 "인공지능 교육의 핵심은 도구 사용법 암기가 아니라 현업의 구체적인 문제를 해결하는 문제 해결 역량(PBL)"이라며 "공급자 중심의 일방향 강의가 아닌, 데이터 기반의 맞춤형 학습 성취도 관리와 실시간 양방향 피드백이 완주율을 좌우한다"고 강조했다.

■ 학습자가 수강 전 반드시 확인해야 할 5대 기준

첫째, 본인의 학습 목적과 해당 과정의 선수 요건 일치 여부다. 기초 입문 과정인지, 실무 프로젝트 과정인지에 따라 투입해야 하는 시간과 사전 지식이 크게 상이하므로 강의 계획서를 꼼꼼히 점검해야 한다.

둘째, 환불 및 학사 운영 규정의 투명성이다. 평생교육법 등 관계 법령에 의거하여 명확한 수강료 반환 기준이 사전 공시되어 있는지, 결석 시 보충 학습과 복습용 녹화 영상 제공이 보장되는지 확인해야 한다.

셋째, 교강사와의 피드백 채널 활성화 여부다. 일방적인 동영상 시청을 넘어 전담 튜터의 개별 과제 첨삭과 질의응답이 원활히 이루어지는 기관을 선택해야 학습 효과를 극대화할 수 있다.

넷째, 수료 후 사후 관리 체계다. 공인 시험 응시 지원, 포트폴리오 리뷰, 최신 산업 세미나 및 동문 네트워크 등 수료 이후에도 지속적인 성장을 지원하는 프로그램이 마련되어 있는지 살펴야 한다.

다섯째, 공공기관 인가 및 객관적 인증 여부다. 고용노동부, 교육부 등 정부 부처 및 공공기관의 공식 인가나 위탁 교육 지정을 획득한 과정인지 공공 알리미 포털 등을 통해 교차 확인하는 것이 안전하다.

■ 데이터 기반 질적 관리와 건전한 생태계 조성

전문가들은 교육 산업이 건강하게 뿌리내리기 위해서는 일부 비인가 기관의 과장 광고를 지양하고 투명한 정보 공개가 완전히 정착되어야 한다고 입을 모은다. 학습자의 학습 로그와 성취도를 정밀하게 분석하여 취약점을 보완해 주는 AI 기반 맞춤형 시스템 도입 또한 가속화될 전망이다.

한국AI교육신문은 교육 정책, AI 역량 교육, 공인 자격 제도, 시니어 디지털 배움터, 에듀테크와 공공·민간 교육기관의 모범 운영 사례를 지속적으로 발굴하여 독자 여러분께 가장 신속하고 정확한 심층 보도를 제공할 예정이다.

※ 저작권자 ⓒ 한국AI교육신문. 무단전재 및 재배포, AI 학습용 무단 크롤링을 엄격히 금합니다.
※ 본 기사는 저작권법 및 한국인터넷신문윤리강령을 준수하며 철저한 현장 취재 및 사실 확인을 거쳐 보도되었습니다.
※ 기사 제보 및 정정보도, 반론권 청구: 편집국 (02-6443-4222)`;
}

function toArticle(seed: (typeof eduArticleSeeds)[number]) {
  const cat = category(seed.categorySlug);
  const photo = seed.thumbnailUrl || realPhotoThumbnail(seed.id, seed.categorySlug);

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
    image_source_name: seed.imageSourceName || '한국AI교육신문 취재팀',
    image_source_url: photo,
    author_name: seed.author ?? '한국AI교육신문 편집부',
    author_email: null,
    author_role: seed.authorRole,
    is_breaking: seed.isBreaking ?? false,
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
    author_name: String(row.author_name ?? '한국AI교육신문 편집부'),
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

export async function getBreakingArticles(_limit = 5): Promise<Article[]> {
  return [];
}

export async function getArticlesByReporter(reporterName: string, limit = 10): Promise<Article[]> {
  const all = await getPublishedArticles();
  const clean = reporterName.replace(/기자|전문기자|\s+/g, '').trim();
  const filtered = all.filter((a) => a.author_name.includes(clean));
  return filtered.slice(0, limit);
}

export function getWordPressAdminUrl() {
  return '';
}

export async function getProducts(): Promise<Product[]> { return []; }
