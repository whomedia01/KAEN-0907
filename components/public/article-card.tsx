import Link from 'next/link';
import type { Article } from '@/types/database';
import { formatDate } from '@/lib/utils/format';

const defaultImage = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80';

function getTypeLabel(article: Article) {
  if (article.article_type === 'brand_interview') return '인터뷰';
  if (article.article_type === 'press_release') return '보도자료';
  return '일반 기사';
}

function getImage(article: Article) {
  return article.thumbnail_url || defaultImage;
}

export function ArticleCard({ article, compact = false }: { article: Article; compact?: boolean }) {
  const typeLabel = getTypeLabel(article);
  const categoryName = article.categories?.name ?? '에듀저널';

  return (
    <Link href={`/articles/${article.slug}`} className="group block border-b pb-4 transition last:border-b-0 hover:text-brand-blue md:border md:bg-white md:p-4 md:hover:border-brand-blue">
      <div className="flex gap-4 md:block">
        <div className={`${compact ? 'h-20 w-28 md:h-28 md:w-full' : 'h-28 w-36 md:h-40 md:w-full'} shrink-0 overflow-hidden border bg-slate-100`}>
          <img src={getImage(article)} alt={article.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
        </div>
        <div className="min-w-0 flex-1 md:mt-3">
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
            <span className="font-bold text-brand-gold">{categoryName}</span>
            <span>{formatDate(article.published_at)}</span>
          </div>
          <h3 className={`${compact ? 'text-base' : 'text-lg'} mt-2 line-clamp-2 font-black leading-snug text-gray-950 group-hover:text-brand-blue`}>{article.title}</h3>
          {!compact && article.summary && <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600">{article.summary}</p>}
          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className="font-semibold text-gray-500">{article.author_name}</span>
            <span className="text-gray-400">{typeLabel}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
