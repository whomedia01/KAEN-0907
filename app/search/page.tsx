import Link from 'next/link';
import { getPublishedArticles } from '@/lib/data/public';
import { formatDate } from '@/lib/utils/format';

const quickLinks = [
  ['평생교육', '/category/lifelong-education'],
  ['자격증', '/category/career-dev'],
  ['시니어교육', '/category/senior-education'],
  ['에듀테크', '/category/edutech-ai'],
  ['교육기관', '/category/edu-institution'],
  ['오피니언', '/category/opinion']
] as const;

export const metadata = { title: '기사검색' };

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string }> }) {
  const params = await searchParams;
  const query = (params?.q || '').trim();
  const articles = await getPublishedArticles(200);
  const normalized = query.toLowerCase();
  const results = normalized
    ? articles.filter((article) => [article.title, article.summary, article.content, article.categories?.name].filter(Boolean).join(' ').toLowerCase().includes(normalized)).slice(0, 30)
    : articles.slice(0, 20);

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <p className="text-sm font-black tracking-[0.22em] text-brand-gold">ARTICLE SEARCH</p>
      <h1 className="mt-2 text-4xl font-black text-brand-navy">기사검색</h1>
      <p className="mt-5 text-lg leading-9 text-gray-700">에듀저널에 게재된 교육 관련 기사를 제목, 요약, 본문 키워드 기준으로 확인할 수 있습니다.</p>

      <form className="mt-8 flex gap-2 border bg-white p-3" action="/search">
        <input name="q" defaultValue={query} placeholder="검색어를 입력하세요" className="min-w-0 flex-1 px-3 py-3 text-sm outline-none" />
        <button className="bg-brand-navy px-5 py-3 text-sm font-black text-white">검색</button>
      </form>

      <section className="mt-8">
        <h2 className="text-xl font-black text-brand-navy">주제별 바로가기</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {quickLinks.map(([label, href]) => <Link key={href} href={href} className="border bg-white p-4 text-sm font-black text-gray-800 hover:border-brand-blue hover:text-brand-blue">{label}</Link>)}
        </div>
      </section>

      <section className="mt-10 border-t-2 border-brand-navy pt-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-xl font-black text-brand-navy">{query ? `검색 결과: ${query}` : '최근 기사'}</h2>
          <p className="text-sm text-gray-500">총 {results.length}건</p>
        </div>
        <div className="mt-5 divide-y border bg-white">
          {results.map((article) => (
            <Link key={article.id} href={`/articles/${article.slug}`} className="block p-5 hover:bg-gray-50">
              <p className="text-sm font-black text-brand-blue">{article.categories?.name || '교육뉴스'} · {formatDate(article.published_at)}</p>
              <h3 className="mt-2 text-xl font-black leading-8 text-gray-950">{article.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm leading-7 text-gray-600">{article.summary}</p>
            </Link>
          ))}
          {!results.length ? <p className="p-6 text-sm leading-7 text-gray-600">검색 결과가 없습니다. 다른 검색어를 입력하거나 주제별 바로가기를 이용해 주세요.</p> : null}
        </div>
      </section>
    </main>
  );
}
