export type OriginalArticleSeed = {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  summary: string;
  content: string;
  categorySlug: string;
  articleType?: 'normal' | 'brand_interview' | 'sponsored' | 'advertorial' | 'press_release';
  isSponsored?: boolean;
  sponsoredNotice?: string;
  tags: string[];
  publishedAt: string;
  author?: string;
  thumbnailUrl: string;
  imageCaption: string;
  imageSourceName: string;
};

const safeImage = '/media/edu-lifelong.svg';
const classroom = safeImage;
const study = safeImage;
const senior = safeImage;
const ai = safeImage;
const campus = safeImage;
const lecture = safeImage;

function body(topic: string, image: string) {
  return `${topic}을 둘러싼 교육 수요가 확대되면서 학습자와 교육기관 모두 정보의 신뢰성을 중요한 기준으로 보고 있다. 직무 전환, 자격증 취득, 디지털 역량 강화, 시니어 학습 등 성인 교육 영역이 세분화되면서 단순한 홍보 문구보다 실제 운영 기준과 학습 지원 체계를 확인하려는 흐름이 뚜렷해지고 있다.

교육기관도 이 변화에 맞춰 과정 소개 방식을 다시 정비하고 있다. 수강료와 수료증만 안내하는 방식으로는 충분하지 않으며, 강사 전문성, 학습 목표, 상담 기준, 환불 안내, 사후 관리 체계를 함께 제시해야 신뢰를 얻을 수 있다는 분석이다.

![${topic} 관련 교육 현장 자료사진.](${image} "에듀저널")

전문가들은 평생교육 시장이 양적 확대에서 질적 검증 단계로 이동하고 있다고 본다. 온라인 교육과 원격 강의가 보편화되면서 누구나 교육 과정을 만들 수 있게 됐지만, 학습자는 더 이상 강의 수만으로 기관을 판단하지 않는다. 학습 경험과 운영 투명성이 함께 평가되는 구조가 강화되고 있다.

에듀저널은 교육 정책과 자격증, 시니어 교육, 에듀테크, 교육기관 운영 사례를 지속적으로 기록하며 학습자에게 필요한 정보를 제공할 계획이다. 교육 콘텐츠를 단순 광고가 아니라 생활형 학습 정보로 정리하는 것이 교육 전문 매체의 중요한 역할이라는 판단이다.`;
}

export const originalArticleSeeds: OriginalArticleSeed[] = [
  {
    id: 'edu-main-001',
    title: '성인학습 수요 확대…교육 정보의 신뢰성이 중요해졌다',
    slug: 'adult-learning-trust-education-news',
    subtitle: '평생학습과 직무교육 수요가 늘면서 교육 전문 정보의 역할이 커지고 있다',
    summary: '성인학습과 직무교육 수요가 확대되면서 학습자는 과정명보다 운영 기준과 학습 지원 체계를 더 꼼꼼히 확인하고 있다.',
    content: body('성인학습', classroom),
    categorySlug: 'lifelong-education',
    tags: ['교육', '평생학습', '성인학습'],
    publishedAt: '2026-06-18T09:20:00+09:00',
    thumbnailUrl: classroom,
    imageCaption: '성인학습 관련 교육 현장 자료사진.',
    imageSourceName: '에듀저널'
  },
  {
    id: 'edu-career-002',
    title: '직장인 자격증 준비, 단기 취득보다 실무 전환성이 핵심 기준으로',
    slug: 'career-certificate-practical-shift',
    subtitle: '자격증 시장이 스펙 중심에서 직무 활용 중심으로 이동하고 있다',
    summary: '직장인 자기계발 시장에서 자격증 선택 기준이 빠른 취득보다 실제 업무 활용성과 전직 가능성으로 이동하고 있다.',
    content: body('직장인 자격증 교육', study),
    categorySlug: 'career-dev',
    tags: ['자격증', '자기계발', '직무교육'],
    publishedAt: '2026-06-17T11:10:00+09:00',
    thumbnailUrl: study,
    imageCaption: '직무교육과 자격증 학습 자료사진.',
    imageSourceName: '에듀저널'
  },
  {
    id: 'edu-senior-003',
    title: '시니어 디지털 교육 확대…스마트폰 활용 넘어 생활 역량 교육으로',
    slug: 'senior-digital-learning-life-skills',
    subtitle: '고령층 교육이 기기 사용법에서 생활 문제 해결형 학습으로 넓어지고 있다',
    summary: '시니어 교육 프로그램은 단순한 스마트폰 사용법을 넘어 금융, 건강, 소통, 행정 서비스 활용 역량으로 확장되고 있다.',
    content: body('시니어 디지털 교육', senior),
    categorySlug: 'senior-education',
    tags: ['시니어교육', '디지털문해', '평생학습'],
    publishedAt: '2026-06-16T10:40:00+09:00',
    thumbnailUrl: senior,
    imageCaption: '시니어 교육 관련 자료사진.',
    imageSourceName: '에듀저널'
  },
  {
    id: 'edu-ai-004',
    title: 'AI 활용 교육 과정 증가…학습자에게 필요한 것은 도구보다 문제해결력',
    slug: 'ai-education-problem-solving',
    subtitle: '에듀테크 교육이 도구 사용법을 넘어 실무 적용 역량으로 전환되고 있다',
    summary: 'AI 교육 과정이 늘면서 학습자들은 단순한 사용법보다 실제 문제 해결에 적용할 수 있는 학습 구조를 요구하고 있다.',
    content: body('AI 활용 교육', ai),
    categorySlug: 'edutech-ai',
    tags: ['AI교육', '에듀테크', '원격교육'],
    publishedAt: '2026-06-15T14:00:00+09:00',
    thumbnailUrl: ai,
    imageCaption: 'AI와 에듀테크 관련 자료사진.',
    imageSourceName: '에듀저널'
  },
  {
    id: 'edu-campus-005',
    title: '교육기관 탐방 콘텐츠 주목…수강 전 확인할 정보가 많아졌다',
    slug: 'education-institution-review-content',
    subtitle: '교육 선택 과정에서 시설보다 운영 철학과 사후 관리 정보가 중요해지고 있다',
    summary: '학습자는 교육기관을 선택할 때 강의명과 가격뿐 아니라 운영 방식, 상담 절차, 학습 관리 체계를 함께 확인하고 있다.',
    content: body('교육기관 탐방', campus),
    categorySlug: 'edu-institution',
    tags: ['교육기관', '탐방', '수강상담'],
    publishedAt: '2026-06-14T09:30:00+09:00',
    thumbnailUrl: campus,
    imageCaption: '교육기관 현장 관련 자료사진.',
    imageSourceName: '에듀저널'
  },
  {
    id: 'edu-opinion-006',
    title: '[오피니언] 평생교육은 복지가 아니라 미래 사회의 기본 인프라다',
    slug: 'opinion-lifelong-learning-infrastructure',
    subtitle: '직업 전환과 고령사회 대응을 위해 평생학습 체계의 공공성이 강조되고 있다',
    summary: '평생교육은 특정 세대의 선택형 학습이 아니라 변화하는 노동시장과 고령사회에 대응하기 위한 사회 인프라로 봐야 한다.',
    content: body('평생교육 정책', lecture),
    categorySlug: 'opinion',
    tags: ['오피니언', '평생교육', '교육정책'],
    publishedAt: '2026-06-13T15:20:00+09:00',
    thumbnailUrl: lecture,
    imageCaption: '강연과 학습 현장 자료사진.',
    imageSourceName: '에듀저널'
  }
];
