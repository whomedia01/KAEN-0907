import { ArticleCard } from '@/components/public/article-card';
import { getPublishedArticles } from '@/lib/data/public';

export const metadata = { title: '전체기사' };

export default async function ArticlesPage() {
  const allArticles = await getPublishedArticles(200);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="border-b-2 border-slate-900 pb-5">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-700">
          All Articles
        </p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-black text-slate-900">
          한국AI교육신문 전체기사
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600">
          한국AI교육신문의 인공지능 교육 뉴스, 심층 정책 분석, 전문가 인터뷰 및 보도자료를 신속하게 전합니다.
        </p>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {allArticles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </main>
  );
}
