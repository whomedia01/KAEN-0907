import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticleBySlug, getPublishedArticles } from '@/lib/data/public';
import { formatDate } from '@/lib/utils/format';
import { getArticleImageForDisplay } from '@/lib/images/article-images';
import { ArticleInteractiveBody } from '@/components/public/article-interactive-body';
import { SidebarAd } from '@/components/ads/SidebarAd';
import { ShieldCheck, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

export async function generateStaticParams() {
  const articles = await getPublishedArticles();
  return articles.slice(0, 100).map((article) => ({ slug: article.slug }));
}

type Article = Awaited<ReturnType<typeof getPublishedArticles>>[number];

function cleanParagraphs(content: string) {
  return content
    .split('\n\n')
    .map((block) => block.trim())
    .filter((block) => block && !block.startsWith('※') && !block.startsWith('!'));
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  const all = await getPublishedArticles();

  if (!article) {
    notFound();
  }

  const imageInfo = getArticleImageForDisplay(article);
  const paragraphs = cleanParagraphs(article.content ?? article.summary ?? '');
  const related = all.filter((item) => item.slug !== article.slug && item.categories?.slug === article.categories?.slug).slice(0, 6);
  const popular = all.filter((item) => item.slug !== article.slug).slice(0, 8);
  const tags = Array.isArray(article.tags) ? article.tags : [];

  return (
    <main className="bg-white text-slate-950">
      {/* Breadcrumbs */}
      <div className="border-b border-slate-100 bg-slate-50/50 py-2.5 px-4 text-xs font-semibold text-slate-500">
        <div className="mx-auto max-w-[1140px] flex items-center gap-2">
          <Link href="/" className="hover:text-blue-600">한국AI교육신문</Link>
          <span>&gt;</span>
          <Link href="/articles" className="hover:text-blue-600">전체기사</Link>
          <span>&gt;</span>
          <span className="text-slate-800 font-bold">{article.categories?.name ?? '교육뉴스'}</span>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1140px] gap-8 px-4 py-6 md:py-8 lg:grid-cols-[minmax(0,760px)_320px]">
        <article className="min-w-0">
          {/* Article Header */}
          <header className="border-b border-slate-200 pb-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                {article.categories?.name ?? '교육뉴스'}
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-xs text-slate-500">
                {article.article_type === 'press_release' ? '공지·보도' : '기획취재'}
              </span>
            </div>

            <h1 className="news-headline text-[30px] sm:text-[38px] md:text-[42px] text-slate-950 font-black leading-tight tracking-tight">
              {article.title}
            </h1>

            {article.subtitle && (
              <p className="news-subhead mt-4 text-[18px] sm:text-[20px] font-semibold text-slate-600 leading-relaxed">
                {article.subtitle}
              </p>
            )}

            {/* Byline & Dates - 신문법 및 언론사 표준 양식 */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-y-2 border-t border-slate-200 pt-3 text-xs text-slate-500">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">
                  {article.author_name || '취재팀'} 기자
                </span>
                {article.author_role && (
                  <span className="text-slate-500 text-xs">· {article.author_role}</span>
                )}
              </div>
              <div className="flex items-center gap-3 text-slate-500 font-mono text-[11px] sm:text-xs">
                <span>입력 {formatDate(article.published_at)}</span>
                {article.updated_at && article.updated_at !== article.published_at && (
                  <span className="hidden sm:inline">수정 {formatDate(article.updated_at)}</span>
                )}
              </div>
            </div>
          </header>

          {/* Matched Image with Verified Attribution */}
          <figure className="my-6">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-slate-100 shadow-xs border border-slate-200/80">
              <img
                src={imageInfo.url}
                alt={article.title}
                className="h-full w-full object-cover"
              />
            </div>
            <figcaption className="mt-2 text-xs leading-relaxed text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 pb-2">
              <span className="font-medium text-slate-600">{imageInfo.caption}</span>
              <span className="shrink-0 text-slate-400 font-normal">
                [사진={imageInfo.sourceName || '한국AI교육신문 DB'}]
              </span>
            </figcaption>
          </figure>

          {/* Article Body with Lead Summary, Closing Byline & Copyright */}
          <ArticleInteractiveBody
            title={article.title}
            summary={article.summary}
            paragraphs={paragraphs}
            authorName={article.author_name}
          />

          {/* Tags */}
          {tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2 border-t border-slate-200 pt-4">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 text-xs font-semibold transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Legal & Copyright Compliance Disclaimer (언론윤리 및 저작권 준수) */}
          <section className="rounded-lg border border-slate-200 bg-slate-50/70 p-4 text-xs text-slate-600 space-y-2 no-print my-6">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>한국AI교육신문 저작권 및 언론 윤리 강령 준수 안내</span>
            </div>
            <p className="leading-relaxed text-slate-600">
              본 기사는 저작권법 및 한국인터넷신문윤리강령을 엄격히 준수하며, 현장 취재 및 공공 보도자료를 바탕으로 철저한 사실 확인을 거쳐 작성되었습니다. (주)후미디어 및 한국AI교육신문의 사전 서면 동의 없는 무단 전재, 복제, 재배포 및 AI 학습용 무단 크롤링을 금지합니다.
            </p>
            <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
              <span>기사 제보 및 정정보도·반론권 청구: 편집국 (02-6443-4222 / whomedia03@gmail.com)</span>
              <Link href="/correction" className="text-blue-600 font-semibold hover:underline">
                정정보도 신청 절차 &rarr;
              </Link>
            </div>
          </section>

          {/* Bottom Related Articles Grid */}
          <section className="mt-10 border-t-2 border-slate-900 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-extrabold text-slate-900">함께 읽는 주요 교육 기사</h2>
              <Link href="/articles" className="text-xs font-bold text-blue-600 hover:underline">
                전체 기사 보기 &rarr;
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {popular.slice(0, 4).map((item) => {
                const img = getArticleImageForDisplay(item);
                return (
                  <Link key={item.id} href={`/articles/${item.slug}`} className="group block">
                    <div className="aspect-[16/10] w-full overflow-hidden rounded bg-slate-100 mb-2">
                      <img
                        src={img.url}
                        alt={item.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <p className="line-clamp-2 text-sm font-bold leading-snug group-hover:text-blue-600 text-slate-900">
                      {item.title}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400 font-mono">
                      {formatDate(item.published_at)}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        </article>

        {/* Sticky Sidebar Right Rail with Ad Slot and Popular List */}
        <aside className="space-y-6 lg:block">
          {/* 300x250 Medium Rectangle / Half page ad */}
          <SidebarAd variant="halfpage" />

          {/* Related Articles in Same Category */}
          <div className="border border-slate-200 bg-white rounded-lg shadow-xs overflow-hidden">
            <div className="bg-slate-900 text-white px-4 py-2.5">
              <h3 className="text-sm font-bold">{article.categories?.name ?? '분야'} 관련 기사</h3>
            </div>
            <div className="divide-y divide-slate-100 p-2">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/articles/${item.slug}`}
                  className="block p-2.5 hover:bg-slate-50 transition-colors rounded"
                >
                  <p className="line-clamp-2 text-xs font-bold text-slate-900 leading-snug hover:text-blue-600">
                    {item.title}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    {formatDate(item.published_at)}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Secondary Medium Rectangle Ad */}
          <SidebarAd variant="rectangle" />
        </aside>
      </div>
    </main>
  );
}
