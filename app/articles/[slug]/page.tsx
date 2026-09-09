import Link from 'next/link';
import { getArticleBySlug, getPublishedArticles } from '@/lib/data/public';
import { formatDate } from '@/lib/utils/format';

export async function generateStaticParams() {
  const articles = await getPublishedArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

const SECTION_LABELS = new Set([
  '현장에서 달라진 점',
  '학습자가 확인할 기준',
  '교육기관의 과제',
  '주의할 대목',
  '정리',
  '기사 요약',
  '핵심 요약',
  '현장 맥락',
  '독자 영향',
  '전망과 과제',
  '마무리'
]);

function isSectionLabel(line: string) {
  const text = line.trim().replace(/^[-•#\s]+/, '').replace(/[:：]$/, '').trim();
  if (SECTION_LABELS.has(text)) return true;
  if (text.length <= 16 && /^(현장|학습자|교육기관|주의|정리|마무리|전망|배경|핵심)/.test(text) && !/[.!?。다]$/.test(text)) return true;
  return false;
}

function cleanLines(content: string) {
  return content
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && line.charAt(0) !== '!' && line.charAt(0) !== '(')
    .filter((line) => !/^#{1,6}\s/.test(line))
    .map((line) => line.replace(/^[-•]\s*/, ''))
    .filter((line) => !isSectionLabel(line));
}

type Article = Awaited<ReturnType<typeof getPublishedArticles>>[number];

function ArticleImage({ article }: { article: Article }) {
  const src = article.thumbnail_url || '/media/edu-lifelong.svg';
  return (
    <figure className="mt-7">
      <img src={src} alt={article.title} className="aspect-[16/9] w-full rounded-sm bg-slate-100 object-cover" />
      <figcaption className="mt-2 border-l-2 border-slate-300 pl-3 text-[14px] leading-6 text-slate-500 md:text-[14px]">
        {article.image_caption || `${article.categories?.name ?? '교육'} 관련 교육 현장 자료사진.`}
      </figcaption>
    </figure>
  );
}

function LeadSummary({ article }: { article: Article }) {
  return (
    <p className="mt-7 text-[22px] font-semibold leading-10 text-slate-800 md:text-[23px] md:leading-10">
      {article.summary}
    </p>
  );
}

function BodyContent({ article }: { article: Article }) {
  const lines = cleanLines(article.content ?? article.summary ?? '');

  return (
    <div className="mt-8 space-y-6 text-[20px] leading-[2.1] text-slate-900 md:text-[20px] md:leading-[2.15]">
      {lines.map((line, index) => (
        <p key={index}>{line}</p>
      ))}
    </div>
  );
}

function RelatedLinks({ title, articles }: { title: string; articles: Article[] }) {
  return (
    <section className="border border-slate-200 bg-white">
      <div className="border-b border-slate-900 px-4 py-2.5">
        <h2 className="text-[16px] font-black">{title}</h2>
      </div>
      <div className="divide-y divide-slate-100 px-4">
        {articles.slice(0, 6).map((item) => (
          <Link key={item.id} href={`/articles/${item.slug}`} className="block py-3 hover:text-brand-blue">
            <p className="line-clamp-2 text-[15px] font-bold leading-7">{item.title}</p>
            <p className="mt-1 text-[13px] text-slate-500">{item.categories?.name ?? '교육뉴스'} · {formatDate(item.published_at)}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function BottomNewsGrid({ articles }: { articles: Article[] }) {
  return (
    <section className="mt-14 border-t-2 border-slate-900 pt-5">
      <div className="flex items-center justify-between">
        <h2 className="text-[22px] font-black">함께 읽을 교육뉴스</h2>
        <Link href="/articles" className="text-[13px] font-bold text-brand-blue">전체기사 보기</Link>
      </div>
      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {articles.slice(0, 8).map((item) => (
          <Link key={item.id} href={`/articles/${item.slug}`} className="group block">
            <img src={item.thumbnail_url || '/media/edu-lifelong.svg'} alt="" className="aspect-[4/3] w-full bg-slate-100 object-cover" />
            <p className="mt-2 line-clamp-2 text-[16px] font-black leading-7 group-hover:text-brand-blue">{item.title}</p>
            <p className="mt-1 text-[13px] text-slate-500">{formatDate(item.published_at)}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  const all = await getPublishedArticles();

  if (!article) return <main className="mx-auto max-w-[820px] px-4 py-10 text-[17px]">기사를 찾을 수 없습니다.</main>;

  const related = all.filter((item) => item.slug !== article.slug && item.categories?.slug === article.categories?.slug);
  const popular = all.filter((item) => item.slug !== article.slug).slice(0, 10);
  const tags = Array.isArray(article.tags) ? article.tags : [];

  return (
    <main className="bg-white text-slate-950">
      <div className="mx-auto grid max-w-[1120px] gap-8 px-4 py-7 md:py-9 lg:grid-cols-[minmax(0,760px)_300px]">
        <article>
          <nav className="text-[14px] font-bold leading-6 text-slate-500">
            <Link href="/" className="hover:text-brand-blue">에듀저널</Link>
            <span className="mx-2">/</span>
            <Link href="/articles" className="hover:text-brand-blue">전체기사</Link>
            <span className="mx-2">/</span>
            <span className="text-slate-800">{article.categories?.name ?? '교육뉴스'}</span>
          </nav>

          <header className="mt-7 border-b border-slate-200 pb-6 md:mt-8">
            <p className="text-[15px] font-black text-brand-blue">{article.categories?.name ?? '교육뉴스'} · 일반기사</p>
            <h1 className="mt-3 text-[36px] font-black leading-[1.24] tracking-[-0.055em] md:text-[46px] md:leading-tight">{article.title}</h1>
            <p className="mt-4 text-[20px] font-semibold leading-9 text-slate-600 md:text-[21px] md:leading-9">{article.subtitle || article.summary}</p>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-slate-200 pt-4 text-[15px] leading-6 text-slate-500">
              <span><strong className="text-slate-900">{article.author_name ?? '에듀저널 편집부'}</strong> 기자</span>
              <span>입력 {formatDate(article.published_at)}</span>
              <span>수정 {formatDate(article.updated_at ?? article.published_at)}</span>
            </div>
          </header>

          <ArticleImage article={article} />
          <LeadSummary article={article} />
          <BodyContent article={article} />

          <p className="mt-9 border-y border-slate-200 py-5 text-[18px] leading-9 text-slate-700 md:text-[19px]">
            에듀저널은 교육 현장에서 확인되는 제도 변화와 학습자 선택 기준을 계속 점검하고, 관련 기관의 운영 정보와 실제 활용 사례를 함께 보도할 예정이다.
          </p>

          {tags.length ? (
            <section className="mt-6 flex flex-wrap gap-2">
              {tags.map((tag) => <span key={tag} className="rounded-full border border-slate-200 px-3.5 py-1.5 text-[15px] font-bold text-slate-600">#{tag}</span>)}
            </section>
          ) : null}

          <section className="mt-10 rounded-sm bg-slate-50 p-5">
            <p className="text-[17px] font-black text-slate-800">제보·정정 안내</p>
            <p className="mt-2 text-[17px] leading-8 text-slate-600">교육 현장 제보, 사실 정정 요청, 보도자료 접수는 기사제보 페이지를 통해 보낼 수 있습니다.</p>
            <Link href="/report" className="mt-3 inline-flex text-[16px] font-black text-brand-blue">기사제보 바로가기 ›</Link>
          </section>

          <BottomNewsGrid articles={popular} />
        </article>

        <aside className="hidden space-y-6 lg:block">
          <RelatedLinks title="관련 기사" articles={related.length ? related : popular} />
          <RelatedLinks title="많이 본 뉴스" articles={popular} />
        </aside>
      </div>
    </main>
  );
}
