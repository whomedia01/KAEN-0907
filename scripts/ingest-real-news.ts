import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs/promises';
import path from 'node:path';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DRY_RUN = process.env.DRY_RUN !== 'false';
const MAX_ITEMS_PER_SOURCE = Number(process.env.MAX_ITEMS_PER_SOURCE ?? 5);

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.');
}

type FeedSource = {
  name: string;
  url: string;
  defaultCategory: string;
  kind: 'rss';
};

type RssItem = {
  title: string;
  link: string;
  description: string;
  pubDate?: string;
  sourceName: string;
};

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  '생활경제': ['물가', '소비', '가계', '민생', '금리', '세금', '지원금', '소득', '장바구니', '생활비'],
  '지역상권': ['상권', '골목', '지역', '소상공인', '자영업', '전통시장', '지자체', '상생'],
  '교육·학원': ['교육', '학원', '입시', '수능', '학교', '학생', 'AI 교육', '직무교육'],
  '시니어·요양': ['고령', '시니어', '요양', '돌봄', '노인', '실버', '복지', '장기요양'],
  '건강·뷰티': ['건강', '의료', '웰니스', '뷰티', '피부', '운동', '무더위', '질병'],
  '창업·프랜차이즈': ['창업', '프랜차이즈', '무인', '가맹', '사업자', '스타트업'],
  '보도자료': ['발표', '지원', '추진', '모집', '공고', '정책', '시행']
};

function stripTags(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractTag(block: string, tag: string) {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return match ? stripTags(match[1] ?? '') : '';
}

function parseRss(xml: string, sourceName: string): RssItem[] {
  const blocks = xml.match(/<item[\s\S]*?<\/item>/gi) ?? [];
  return blocks.map((block) => ({
    title: extractTag(block, 'title'),
    link: extractTag(block, 'link'),
    description: extractTag(block, 'description'),
    pubDate: extractTag(block, 'pubDate'),
    sourceName
  })).filter((item) => item.title && item.link);
}

function classifyCategory(item: RssItem, fallback: string) {
  const haystack = `${item.title} ${item.description}`;
  let best = fallback;
  let bestScore = 0;

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const score = keywords.reduce((sum, keyword) => sum + (haystack.includes(keyword) ? 1 : 0), 0);
    if (score > bestScore) {
      best = category;
      bestScore = score;
    }
  }

  return best;
}

function createSlug(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80) || crypto.randomUUID();
}

function toKoreanDate(value?: string) {
  if (!value) return new Date().toISOString();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function createDraftArticle(item: RssItem, categoryName: string) {
  const issue = item.title.replace(/["“”]/g, '').trim();
  const base = item.description || `${item.sourceName}가 전한 주요 이슈다.`;

  return [
    `${issue}와 관련한 생활경제 현장의 관심이 커지고 있다. 이번 사안은 단순한 개별 이슈를 넘어 소비자, 지역 사업자, 정책 수요자에게 영향을 줄 수 있는 흐름으로 읽힌다.`,
    `관련 내용은 ${item.sourceName} 보도를 통해 확인됐다. 보도에서 제시된 핵심은 ${base} 생활경제저널은 해당 사안을 생활경제 관점에서 다시 정리해 독자가 확인해야 할 쟁점과 현장 영향을 중심으로 살폈다.`,
    `우선 이번 이슈는 비용 부담, 정보 접근성, 제도 변화, 소비 심리와 맞물려 있다. 특히 생활서비스와 지역 상권 분야에서는 작은 제도 변화나 시장 신호도 고객 유입, 상담 전환, 운영 비용에 직접적인 영향을 줄 수 있다.`,
    `지역 사업자 입장에서는 단순히 소식을 확인하는 데 그치지 않고 자신의 업종과 고객층에 어떤 변화가 생기는지 점검할 필요가 있다. 가격, 예약, 상담, 사후관리, 정보 제공 방식은 소비자가 업체를 비교할 때 확인하는 기본 요소가 되고 있다.`,
    `소비자에게도 이번 흐름은 선택 기준을 다시 정리하게 만드는 계기가 될 수 있다. 같은 상품이나 서비스라도 제공 조건, 책임 범위, 접근성, 후기, 운영자의 설명 방식에 따라 체감 만족도는 달라질 수 있다.`,
    `다만 단일 보도나 발표만으로 시장 전체의 변화를 단정하기는 어렵다. 실제 현장에서는 지역, 업종, 고객층, 소득 수준에 따라 반응이 다르게 나타날 수 있어 추가 자료와 후속 발표를 함께 확인해야 한다.`,
    `전문가들은 생활경제 영역에서 정보의 신뢰도가 갈수록 중요해질 것으로 보고 있다. 비용 부담이 이어지는 환경에서는 과장된 홍보보다 구체적인 기준과 절차를 설명하는 콘텐츠가 고객 신뢰를 높이는 역할을 할 수 있다는 분석이다.`,
    `생활경제저널은 이번 사안을 ${categoryName} 분야의 주요 이슈로 분류하고, 후속 자료가 확인되는 대로 관련 내용을 계속 정리할 계획이다. 독자는 원문 출처와 향후 발표를 함께 확인하면서 자신의 생활권과 업종에 맞는 영향을 판단할 필요가 있다.`
  ].join('\n\n');
}

async function getCategoryMap() {
  const { data, error } = await supabase.from('categories').select('id, name');
  if (error) throw error;
  return new Map((data ?? []).map((category) => [category.name, category.id]));
}

async function alreadyExists(link: string, title: string) {
  const { data, error } = await supabase
    .from('articles')
    .select('id')
    .or(`source_urls.cs.{${link}},title.eq.${title.replace(/,/g, ' ')}`)
    .limit(1);

  if (error) {
    // Older schemas may not have source_urls yet. Fall back to title-only duplicate check.
    const fallback = await supabase.from('articles').select('id').eq('title', title).limit(1);
    if (fallback.error) throw fallback.error;
    return Boolean(fallback.data?.length);
  }

  return Boolean(data?.length);
}

async function main() {
  const sourcePath = path.join(process.cwd(), 'seeds', 'rss-sources.json');
  const sources = JSON.parse(await fs.readFile(sourcePath, 'utf8')) as FeedSource[];
  const categoryMap = await getCategoryMap();
  const inserts: unknown[] = [];

  for (const source of sources) {
    const response = await fetch(source.url, { headers: { 'user-agent': 'Everyday Economy Journal source monitor' } });
    if (!response.ok) {
      console.warn(`Skipping ${source.name}: ${response.status}`);
      continue;
    }

    const xml = await response.text();
    const items = parseRss(xml, source.name).slice(0, MAX_ITEMS_PER_SOURCE);

    for (const item of items) {
      if (await alreadyExists(item.link, item.title)) continue;
      const categoryName = classifyCategory(item, source.defaultCategory);
      const categoryId = categoryMap.get(categoryName) ?? categoryMap.values().next().value;
      const publishedAt = toKoreanDate(item.pubDate);
      const slug = `${createSlug(item.title)}-${Date.now().toString(36)}`;

      inserts.push({
        title: item.title,
        slug,
        subtitle: `${categoryName} 관점에서 다시 정리한 주요 이슈`,
        summary: stripTags(item.description).slice(0, 180),
        content: createDraftArticle(item, categoryName),
        category_id: categoryId,
        article_type: 'normal',
        status: 'review',
        author_name: '생활경제저널 편집부',
        is_sponsored: false,
        tags: [categoryName, '생활경제', '이슈정리'],
        seo_title: item.title,
        seo_description: stripTags(item.description).slice(0, 160),
        editorial_status: 'review',
        source_urls: [item.link],
        source_note: `${source.name} RSS 메타데이터를 바탕으로 생성한 편집부 검수용 초안. 원문 본문 복제 없이 작성됐으며 발행 전 사실관계 확인이 필요하다.`,
        fact_checked: false,
        scheduled_at: null,
        published_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
  }

  console.log(`Prepared ${inserts.length} review drafts.`);
  if (DRY_RUN) {
    console.log(JSON.stringify(inserts.slice(0, 3), null, 2));
    console.log('DRY_RUN=true. Set DRY_RUN=false to insert into Supabase.');
    return;
  }

  if (!inserts.length) return;
  const { error } = await supabase.from('articles').insert(inserts);
  if (error) throw error;
  console.log(`Inserted ${inserts.length} review drafts.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
