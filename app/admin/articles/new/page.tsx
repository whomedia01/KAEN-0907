import Link from 'next/link';
import { createArticle } from './actions';
import { getCategories } from '@/lib/data/public';
import { ArticleEditor } from '@/components/admin/article-editor';

export default async function NewArticlePage() {
  const categories = await getCategories();

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">ARTICLE CMS & ETHICS DESK</p>
          <h1 className="mt-2 text-3xl font-black text-slate-900 tracking-tight">새 기사 작성</h1>
          <p className="mt-2 text-xs leading-relaxed text-slate-600 max-w-3xl">
            실시간 금지어·주의 표현 감지 및 Gemini AI 보도 윤리 데스크가 작동합니다. 기사 작성 즉시 윤리성을 점검하고 표준 저널리즘 표현으로 교정할 수 있습니다.
          </p>
        </div>
        <Link 
          href="/admin/articles" 
          className="self-start sm:self-auto rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
        >
          &larr; 기사 목록으로
        </Link>
      </div>

      <ArticleEditor categories={categories} action={createArticle} />
    </main>
  );
}
