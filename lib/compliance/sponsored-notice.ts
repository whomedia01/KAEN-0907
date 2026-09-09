import type { ArticleType } from '@/types/database';

export function getSponsoredNotice(articleType: ArticleType, customNotice?: string | null) {
  if (customNotice?.trim()) return customNotice;
  if (articleType === 'advertorial') return '[광고/제휴] 본 콘텐츠는 광고주와의 제휴를 통해 제작되었습니다.';
  if (articleType === 'press_release') return '[보도자료] 본 콘텐츠는 외부에서 제공한 자료를 바탕으로 작성되었습니다.';
  if (articleType === 'brand_interview' || articleType === 'sponsored') {
    return '[브랜드 인터뷰 · 제휴 콘텐츠] 본 콘텐츠는 업체 제공 자료와 인터뷰를 바탕으로 제작된 브랜드 인터뷰 콘텐츠입니다.';
  }
  return null;
}

export function requiresSponsoredNotice(articleType: ArticleType, isSponsored?: boolean) {
  return isSponsored || ['brand_interview', 'sponsored', 'advertorial', 'press_release'].includes(articleType);
}
