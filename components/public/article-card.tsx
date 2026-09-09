import Link from 'next/link';
import type { Article } from '@/types/database';
import { formatDate } from '@/lib/utils/format';
import { getArticleImageForDisplay } from '@/lib/images/article-images';

function getTypeLabel(article: Article) {
  if (article.article_type === 'brand_interview') return '인터뷰';
  if (article.article_type === 'press_release') return '보도자료';
  return '일반 기사';
}

export function ArticleCard({ article, compact = false }: { article: Article; compact?: boolean }) {
  const typeLabel = getTypeLabel(article);
  const categoryName = article.categories?.name ?? '한국AI교육신문';
  const img = getArticleImageForDisplay(article);

  return (
    <Link
      href={`/articles/${article.slug || article.id}`}
      className="group block border-b pb-4 transition last:border-b-0 hover:text-blue-700 md:border md:bg-white md:p-4 md:hover:border-blue-600 rounded-lg shadow-2xs"
    >
      <div className="flex gap-4 md:block">
        <div className={`relative ${compact ? 'h-20 w-28 md:h-28 md:w-full' : 'h-28 w-36 md:h-44 md:w-full'} shrink-0 overflow-hidden rounded bg-slate-100`}>
          <img
            src={img.url}
            alt={article.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="min-w-0 flex-1 md:mt-3">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="font-extrabold text-blue-700">{categoryName}</span>
            <span>·</span>
            <span className="font-mono text-[11px]">{formatDate(article.published_at)}</span>
          </div>
          <h3 className={`${compact ? 'text-sm sm:text-base' : 'text-base sm:text-lg'} mt-1.5 line-clamp-2 font-black leading-snug text-slate-950 group-hover:text-blue-700`}>
            {article.title}
          </h3>
          {!compact && article.summary && (
            <p className="mt-2 line-clamp-2 text-xs sm:text-sm leading-relaxed text-slate-600">
              {article.summary}
            </p>
          )}
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span className="font-semibold text-slate-800">{article.author_name}</span>
            <span className="text-slate-400 font-medium">{typeLabel}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
