export const FORBIDDEN_TERMS = [
  '네이버 뉴스 노출 보장',
  '포털 뉴스 송출 보장',
  '공식 우수업체 선정',
  '무료 선정',
  '언론 보도 보장',
  '검색 상위노출 보장',
  '1위 업체',
  '최고 업체',
  '유일한 업체',
  '무조건 매출 상승',
  '100% 효과',
  '정부 인증',
  '공공기관 인증',
  '검증 완료',
  '소비자 만족도 1위',
  '국내 최고',
  '확실한 효과',
  '매출 보장'
];

export function detectForbiddenTerms(text: string) {
  const normalized = text.replace(/\s+/g, ' ').trim();
  return FORBIDDEN_TERMS.filter((term) => normalized.includes(term));
}
