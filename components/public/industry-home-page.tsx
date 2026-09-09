import Link from 'next/link';
import { getPublishedArticles } from '@/lib/data/public';
import { formatDate } from '@/lib/utils/format';
import { getArticleImageForDisplay } from '@/lib/images/article-images';
import { SidebarAd } from '@/components/ads/SidebarAd';
import { ShieldCheck, Newspaper, Award, ChevronRight } from 'lucide-react';

type Article = Awaited<ReturnType<typeof getPublishedArticles>>[number];

function Thumb({ article, wide = false }: { article?: Article; wide?: boolean }) {
  if (!article) return <div className="aspect-[16/9] w-full bg-slate-100" />;
  const img = getArticleImageForDisplay(article);
  return (
    <div className={`relative overflow-hidden rounded ${wide ? 'aspect-[16/9]' : 'aspect-[4/3]'} w-full bg-slate-100`}>
      <img
        src={img.url}
        alt={article.title}
        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
    </div>
  );
}

function Head({ title, href }: { title: string; href?: string }) {
  return (
    <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
      <h2 className="news-headline text-[20px] sm:text-[22px] font-black text-slate-900 tracking-tight">
        {title}
      </h2>
      {href ? (
        <Link href={href} className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center">
          <span>더보기</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      ) : null}
    </div>
  );
}

function TopIssue({ article }: { article?: Article }) {
  if (!article) return null;
  return (
    <article className="group">
      <Link href={`/articles/${article.slug}`} className="block">
        <Thumb article={article} wide />
        <div className="mt-4">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
            {article.categories?.name ?? '헤드라인'}
          </span>
          <h1 className="news-headline mt-1.5 text-xl sm:text-2xl font-black text-slate-950 leading-snug group-hover:text-blue-700">
            {article.title}
          </h1>
          <p className="mt-2.5 text-sm text-slate-600 line-clamp-3 leading-relaxed">
            {article.summary}
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span>{article.author_name}</span>
            <span>·</span>
            <span>{formatDate(article.published_at)}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}

function TopSide({ articles }: { articles: Article[] }) {
  return (
    <div className="divide-y divide-slate-100">
      {articles.map((article) => (
        <Link
          key={article.id}
          href={`/articles/${article.slug}`}
          className="flex gap-3 py-3 hover:text-blue-700 group items-start"
        >
          <div className="w-24 shrink-0">
            <Thumb article={article} />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-bold text-blue-600">
              {article.categories?.name ?? '교육'}
            </span>
            <h3 className="line-clamp-2 text-xs sm:text-sm font-bold leading-snug text-slate-900 group-hover:text-blue-700 mt-0.5">
              {article.title}
            </h3>
            <p className="mt-1 text-[11px] text-slate-400 font-mono">
              {formatDate(article.published_at)}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

function Ranking({ articles }: { articles: Article[] }) {
  return (
    <section className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
      <Head title="많이 본 뉴스" />
      <div className="mt-3 divide-y divide-slate-100">
        {articles.slice(0, 8).map((article, index) => (
          <Link
            key={article.id}
            href={`/articles/${article.slug}`}
            className="flex items-start gap-3 py-2.5 hover:text-blue-700 group"
          >
            <span className="w-5 shrink-0 text-center text-lg font-black text-blue-700">
              {index + 1}
            </span>
            <div className="min-w-0">
              <p className="line-clamp-2 text-xs sm:text-sm font-bold leading-snug text-slate-900 group-hover:text-blue-700">
                {article.title}
              </p>
              <p className="mt-1 text-[11px] text-slate-400 font-mono">
                {formatDate(article.published_at)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function TextList({ title, articles, href }: { title: string; articles: Article[]; href?: string }) {
  return (
    <section className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
      <Head title={title} href={href} />
      <div className="mt-3 divide-y divide-slate-100">
        {articles.slice(0, 6).map((article) => (
          <Link
            key={article.id}
            href={`/articles/${article.slug}`}
            className="block py-2.5 hover:text-blue-700 group"
          >
            <p className="line-clamp-2 text-xs sm:text-sm font-bold leading-snug text-slate-900 group-hover:text-blue-700">
              {article.title}
            </p>
            <p className="mt-1 text-[11px] text-slate-400">
              {article.categories?.name ?? '교육뉴스'} · {formatDate(article.published_at)}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Feature({ title, articles, href }: { title: string; articles: Article[]; href?: string }) {
  const lead = articles[0];
  if (!lead) return null;
  return (
    <section className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
      <Head title={title} href={href} />
      <div className="mt-4 grid gap-5 md:grid-cols-2">
        <Link href={`/articles/${lead.slug}`} className="group block">
          <Thumb article={lead} wide />
          <h3 className="line-clamp-2 text-base font-black text-slate-950 group-hover:text-blue-700 leading-snug mt-3">
            {lead.title}
          </h3>
          <p className="line-clamp-2 text-xs text-slate-500 leading-relaxed mt-1.5">
            {lead.summary}
          </p>
        </Link>
        <div className="divide-y divide-slate-100">
          {articles.slice(1, 5).map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.slug}`}
              className="flex items-center gap-3 py-2.5 hover:text-blue-700 group"
            >
              <div className="w-16 h-12 shrink-0 overflow-hidden rounded bg-slate-100">
                <img
                  src={getArticleImageForDisplay(article).url}
                  alt={article.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <p className="line-clamp-2 text-xs font-bold text-slate-900 group-hover:text-blue-700 leading-snug flex-1">
                {article.title}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryBlock({ title, slug, articles }: { title: string; slug: string; articles: Article[] }) {
  const filtered = articles.filter((a) => a.categories?.slug === slug).slice(0, 5);
  const lead = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between">
      <div>
        <Head title={title} href={`/category/${slug}`} />
        {lead && (
          <Link href={`/articles/${lead.slug}`} className="group block mt-3">
            <Thumb article={lead} wide />
            <h3 className="line-clamp-2 text-sm font-extrabold text-slate-950 group-hover:text-blue-700 leading-snug mt-2">
              {lead.title}
            </h3>
          </Link>
        )}
        <div className="mt-3 divide-y divide-slate-100">
          {rest.map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.slug}`}
              className="block py-2 hover:text-blue-700 group"
            >
              <p className="line-clamp-1 text-xs font-semibold text-slate-800 group-hover:text-blue-700">
                · {article.title}
              </p>
            </Link>
          ))}
        </div>
      </div>
      <Link
        href={`/category/${slug}`}
        className="mt-4 block text-center text-xs font-bold text-slate-600 hover:text-blue-700 bg-slate-50 py-2 rounded transition-colors"
      >
        {title} 더보기 &rarr;
      </Link>
    </div>
  );
}

export async function IndustryHomePage() {
  const articles = await getPublishedArticles(160);

  const spotlight = articles.filter((a) => ['edutech-ai', 'edu-institution', 'lifelong-education'].includes(a.categories?.slug ?? '')).slice(0, 6);
  const interviews = articles.filter((a) => a.categories?.slug === 'interview-people').slice(0, 6);
  const seminar = articles.filter((a) => ['lifelong-education', 'career-dev', 'senior-education'].includes(a.categories?.slug ?? '')).slice(0, 8);
  const categories = [
    ['AI·에듀테크', 'edutech-ai'],
    ['정책·보도', 'press-release'],
    ['자격증·직무교육', 'career-dev'],
    ['평생교육·HRD', 'lifelong-education'],
    ['시니어교육', 'senior-education'],
    ['교육기관 탐방', 'edu-institution'],
    ['인터뷰', 'interview-people'],
    ['오피니언', 'opinion']
  ] as const;

  return (
    <main className="bg-slate-100 text-slate-950 min-h-screen">
      <div className="max-w-[1180px] mx-auto px-4 py-4 space-y-6">
        {/* Top Hero Section: Main Lead + Top Side list + Right rail */}
        <section className="grid grid-cols-12 gap-5">
          <div className="col-span-12 lg:col-span-8 bg-white p-5 sm:p-6 rounded-lg border border-slate-200 shadow-xs">
            <div className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
              <TopIssue article={articles[0]} />
              <TopSide articles={articles.slice(1, 5)} />
            </div>
          </div>

          <aside className="col-span-12 lg:col-span-4 space-y-5">
            <Ranking articles={articles} />
            <SidebarAd variant="rectangle" />
          </aside>
        </section>

        {/* Features Row 1 */}
        <section className="grid gap-5 lg:grid-cols-2">
          <Feature
            title="스포트라이트 심층기획"
            articles={spotlight.length ? spotlight : articles.slice(10, 16)}
          />
          <Feature
            title="명사 인터뷰"
            articles={interviews.length ? interviews : articles.slice(16, 22)}
            href="/category/interview-people"
          />
        </section>

        {/* Features Row 2 */}
        <section className="grid gap-5 lg:grid-cols-[2fr_1fr]">
          <Feature
            title="교육·세미나·자격증"
            articles={seminar.length ? seminar : articles.slice(22, 30)}
            href="/category/career-dev"
          />
          <TextList
            title="최신 교육뉴스"
            articles={articles.slice(5, 15)}
            href="/articles"
          />
        </section>

        {/* Categories Bento Grid */}
        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 pb-8">
          {categories.map(([title, slug]) => (
            <CategoryBlock
              key={slug}
              title={title}
              slug={slug}
              articles={articles}
            />
          ))}
        </section>
      </div>
    </main>
  );
}
