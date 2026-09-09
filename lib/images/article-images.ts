import type { Article } from '@/types/database';
import { getCuratedImageForArticle, type CuratedImage } from './curated-images';

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
  'lifelong-education': '평생교육·HRD',
  'career-dev': '자격증·자기계발',
  'senior-education': '시니어·실버교육',
  'edutech-ai': '에듀테크·AI',
  'wellness-life': '웰니스·인문학',
  'edu-institution': '교육기관 탐방',
  'interview-people': '명사 인터뷰',
  opinion: '오피니언',
  'press-release': '공지·보도'
};

export function getFallbackArticleImage(categorySlug?: string | null, categoryName?: string | null): ArticleImageDisplay {
  const curated = getCuratedImageForArticle({
    categorySlug: categorySlug ?? 'edutech-ai'
  });

  return {
    url: curated.url || LOCAL_EDU_IMAGE,
    caption: curated.caption,
    sourceName: curated.sourceName,
    license: curated.license,
    isFallback: true
  };
}

export function getArticleImageForDisplay(article: Article): ArticleImageDisplay {
  // If the article has an explicit valid thumbnail_url that is not placeholder
  if (article.thumbnail_url && !article.thumbnail_url.includes('seed/edujournal')) {
    return {
      url: article.thumbnail_url,
      caption: article.image_caption || `▲ ${article.title} 관련 한국AI교육신문 자료사진.`,
      sourceName: article.image_source_name || '한국AI교육신문 취재팀',
      license: article.image_license || '자체 취재 / 보도 저작권 준수',
      sourceUrl: article.image_source_url || undefined,
      isFallback: false
    };
  }

  // Content-matched curated image based on article category and title
  const curated = getCuratedImageForArticle({
    categorySlug: article.categories?.slug ?? undefined,
    title: article.title,
    articleId: article.id,
    isBreaking: false
  });

  return {
    url: curated.url,
    caption: article.image_caption || curated.caption,
    sourceName: article.image_source_name || curated.sourceName,
    license: article.image_license || curated.license,
    sourceUrl: curated.url,
    isFallback: false
  };
}
