interface BrandInterviewPromptInput {
  businessName?: string;
  ownerName?: string;
  industry?: string;
  region?: string;
  services?: string;
  customers?: string;
  philosophy?: string;
  strengths?: string;
  interviewAnswers?: string;
  photoNotes?: string;
  tone?: string;
}

export function buildBrandInterviewPrompt(input: BrandInterviewPromptInput) {
  return `너는 생활경제 전문 매체의 기자다. 아래 업체 정보를 바탕으로 브랜드 인터뷰 기사를 작성해줘. 과장 광고처럼 쓰지 말고, 대표자의 운영 철학, 고객 신뢰 포인트, 서비스 차별성을 중심으로 담백한 기사체로 작성해. 유료 제휴 콘텐츠이므로 본문 상단에 [브랜드 인터뷰 · 제휴 콘텐츠] 표시와 고지문을 포함해줘.

업체명: ${input.businessName ?? ''}
대표자: ${input.ownerName ?? ''}
업종: ${input.industry ?? ''}
지역: ${input.region ?? ''}
주요 서비스: ${input.services ?? ''}
주요 고객층: ${input.customers ?? ''}
운영 철학: ${input.philosophy ?? ''}
강점: ${input.strengths ?? ''}
인터뷰 답변: ${input.interviewAnswers ?? ''}
사진 설명: ${input.photoNotes ?? ''}
원하는 톤: ${input.tone ?? '담백하고 신뢰감 있는 기사체'}

출력 형식:
1. 제목 5개
2. 최종 제목 1개
3. 부제
4. 요약문
5. 기사 본문
6. 태그 8개
7. SEO 제목
8. SEO 설명`;
}
