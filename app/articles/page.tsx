import { ArticleCard } from '@/components/public/article-card';
import { getPublishedArticles } from '@/lib/data/public';

export const metadata = { title: '전체기사' };

export default async function ArticlesPage() {
  const articles = await getPublishedArticles(200);
  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <div className="border-b-2 border-brand-navy pb-5">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-brand-gold">All Articles</p>
        <h1 className="mt-2 text-4xl font-black text-brand-navy">전체기사</h1>
        <p className="mt-3 text-gray-600">에듀저널의 교육 뉴스, 인터뷰, 오피니언, 공지·보도 자료를 확인하세요.</p>
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {articles.map((article) => <ArticleCard key={article.id} article={article} />)}
      </div>
    </main>
  );
}
