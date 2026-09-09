import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCategories } from '@/lib/data/public';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { ArticleEditor } from '@/components/admin/article-editor';
import { updateArticle } from './actions';

interface EditArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params;
  const categories = await getCategories();
  const supabase = createSupabaseAdminClient();

  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (!article) {
    notFound();
  }

  const boundUpdateAction = updateArticle.bind(null, id);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">ARTICLE CMS & ETHICS DESK</p>
          <h1 className="mt-2 text-3xl font-black text-slate-900 tracking-tight">기사 수정 및 윤리 심의</h1>
          <p className="mt-2 text-xs leading-relaxed text-slate-600 max-w-3xl">
            기사 내용 수정 중 실시간으로 금지어와 주의 표현을 감지하며, 우측 패널에서 Gemini AI의 보도 윤리 교정을 즉시 적용할 수 있습니다.
          </p>
        </div>
        <Link 
          href="/admin/articles" 
          className="self-start sm:self-auto rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
        >
          &larr; 기사 목록으로
        </Link>
      </div>

      <ArticleEditor
        categories={categories}
        action={boundUpdateAction}
        initialData={{
          id: article.id,
          title: article.title,
          slug: article.slug,
          subtitle: article.subtitle || '',
          summary: article.summary || '',
          content: article.content || '',
          category_slug: article.category_slug || undefined,
          status: article.status || 'draft',
          article_type: article.article_type || 'normal',
          scheduled_at: article.scheduled_at || '',
          author_name: article.author_name || '한국AI교육신문 취재팀',
          tags: Array.isArray(article.tags) ? article.tags.join(', ') : '',
          thumbnail_url: article.thumbnail_url || '',
          image_source_url: article.image_source_url || '',
          image_source_name: article.image_source_name || '',
          image_author: article.image_author || '',
          image_caption: article.image_caption || '',
          image_license: article.image_license || '',
          source_urls: Array.isArray(article.source_urls) ? article.source_urls.join('\n') : '',
          source_note: article.source_note || '',
          fact_checked: article.fact_checked ?? true,
          compliance_checked: article.compliance_checked ?? true
        }}
      />
    </main>
  );
}
