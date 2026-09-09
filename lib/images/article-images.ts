import type { Article } from '@/types/database';

export type ArticleImageDisplay = {
  url: string;
  caption: string;
  sourceName: string;
  sourceUrl?: string;
  license?: string;
  isFallback: boolean;
};

const LOCAL_EDU_IMAGE = '/media/edu-lifelong.svg';

const categoryLabels: Record<string, string> = {
  'lifelong-education': '평생교육',
  'career-dev': '자격증·자기계발',
  'senior-education': '시니어·실버교육',
  'edutech-ai': '에듀테크·AI',
  'wellness-life': '웰니스·인문학',
  'edu-institution': '교육기관 탐방',
  'interview-people': '명사 인터뷰',
  opinion: '오피니언',
  'press-release': '공지·보도'
};

function localImage(label: string): ArticleImageDisplay {
  return {
    url: LOCAL_EDU_IMAGE,
    caption: `▲ ${label} 관련 에듀저널 자료 이미지.`,
    sourceName: '에듀저널',
    license: '자체 제작',
    isFallback: true
  };
}

export function getFallbackArticleImage(categorySlug?: string | null, categoryName?: string | null): ArticleImageDisplay {
  const label = (categorySlug && categoryLabels[categorySlug]) || categoryName || '교육 기사';
  return localImage(label);
}

export function getArticleImageForDisplay(article: Article): ArticleImageDisplay {
  const isLocal = article.thumbnail_url?.startsWith('/');
  if (isLocal) {
    const image: ArticleImageDisplay = {
      url: article.thumbnail_url!,
      caption: article.image_caption || `▲ ${article.title} 관련 에듀저널 자료 이미지.`,
      sourceName: article.image_source_name || '에듀저널',
      license: article.image_license || '자체 제작',
      isFallback: false
    };
    if (article.image_source_url) image.sourceUrl = article.image_source_url;
    return image;
  }

  return getFallbackArticleImage(article.categories?.slug, article.categories?.name);
}
