export type EduArticleSeed = {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  summary: string;
  content: string;
  categorySlug: string;
  articleType?: 'normal' | 'brand_interview' | 'sponsored' | 'advertorial' | 'press_release';
  tags: string[];
  publishedAt: string;
  author?: string;
  thumbnailUrl: string;
  imageCaption: string;
  imageSourceName: string;
};

type CategorySeed = {
  slug: string;
  prefix: string;
  label: string;
  tags: string[];
  focus: string;
  subjects: string[];
  angles: string[];
};

const START_DATE = '2026-05-15';
const END_DATE = '2026-06-24';

const categories: CategorySeed[] = [
  {
    slug: 'lifelong-education',
    prefix: 'life',
    label: '평생교육·HRD',
    tags: ['평생교육', 'HRD', '성인학습'],
    focus: '성인학습 지원 체계',
    subjects: ['평생학습 바우처', '지역 평생학습관', '직무 전환 교육', '성인 문해교육', '야간·주말 과정', '재직자 학습지원'],
    angles: ['정책 중심으로 이동', '운영 투명성 요구 확대', '상담 체계 중요성 부각', '학습 지속률 관리 필요', '지역 교육기관 경쟁력 강화', '수료 이후 연계 과제']
  },
  {
    slug: 'career-dev',
    prefix: 'career',
    label: '자격증·자기계발',
    tags: ['자격증', '자기계발', '직무교육'],
    focus: '자격증과 직무역량 교육',
    subjects: ['AI 활용 실무 과정', '전직 준비 과정', '직장인 야간 자격증반', '데이터 문해력 교육', '디지털 문서 자동화', '부업 준비 과정'],
    angles: ['실무형 교육 선호 증가', '과정 선택 기준 변화', '수료증보다 활용성 중시', '단기 과정 문의 증가', '직무 전환 수요 확대', '학습비 대비 효과 검토']
  },
  {
    slug: 'senior-education',
    prefix: 'senior',
    label: '시니어·실버교육',
    tags: ['시니어교육', '실버교육', '디지털문해'],
    focus: '시니어 디지털 생활역량',
    subjects: ['스마트폰 활용 교육', '금융앱 안전 교육', '건강정보 접근 교육', '은퇴 후 강사 과정', '중장년 커뮤니티 학습', '디지털 민원 서비스 교육'],
    angles: ['생활역량 중심으로 확장', '사회참여 교육 수요 증가', '안전 교육 필요성 부각', '강사양성 관심 확대', '가족 돌봄 부담 완화 기대', '지역 복지기관 연계 강화']
  },
  {
    slug: 'edutech-ai',
    prefix: 'ai',
    label: '에듀테크·AI',
    tags: ['에듀테크', 'AI교육', '원격교육'],
    focus: 'AI 기반 학습관리',
    subjects: ['AI 튜터', '학습분석 대시보드', '원격 강의 운영', '자동 피드백 도구', '디지털 교재', '학습자 이탈 예측'],
    angles: ['개인화 학습 관리 강화', '운영 설계가 성패 좌우', '기술보다 학습지원 중요', '교강사 업무 부담 완화', '데이터 기반 상담 확산', '교육 품질 관리 기준 변화']
  },
  {
    slug: 'wellness-life',
    prefix: 'well',
    label: '웰니스·인문학',
    tags: ['웰니스', '인문학', '교양교육'],
    focus: '생활습관과 인문교양 교육',
    subjects: ['마음건강 강좌', '수면·식습관 교육', '관계 회복 프로그램', '인문교양 독서모임', '명상과 글쓰기', '생애설계 교양 과정'],
    angles: ['실천형 과정으로 진화', '중장년 수요 증가', '회복 중심 교육 주목', '커뮤니티형 학습 확대', '일상 관리 교육 필요', '교육과 상담의 경계 확장']
  },
  {
    slug: 'edu-institution',
    prefix: 'inst',
    label: '교육기관 탐방',
    tags: ['교육기관탐방', '교육원운영', '교육기관'],
    focus: '교육기관 운영 사례',
    subjects: ['평생교육원 운영 사례', '원격교육기관 상담 체계', '교육원 환불 기준', '학습지원 시스템', '수료 관리 프로세스', '교육기관 홍보 콘텐츠'],
    angles: ['운영 신뢰 설명이 핵심', '콘텐츠보다 관리체계 평가', '수강 전 확인 정보 증가', '상담 응대 품질 중요', '기관 소개 콘텐츠 변화', '학습자 관리 기준 강화']
  },
  {
    slug: 'interview-people',
    prefix: 'people',
    label: '명사 인터뷰',
    tags: ['인터뷰', '교육전문가', '현장강사'],
    focus: '교육 현장 인물 인터뷰',
    subjects: ['평생교육 강사', 'HRD 컨설턴트', '시니어 교육 전문가', '에듀테크 기획자', '교육기관 운영자', '학습상담 전문가'],
    angles: ['지식 전달보다 지속 지원 강조', '현장 경험의 콘텐츠화', '학습자 이해가 경쟁력', '교육자의 역할 재정의', '지역 기반 교육 가치 조명', '실무형 교육 철학 소개']
  },
  {
    slug: 'opinion',
    prefix: 'opinion',
    label: '오피니언',
    tags: ['오피니언', '교육칼럼', '기고'],
    focus: '교육 현안과 칼럼',
    subjects: ['성인학습 정책', '자격증 시장', '시니어 학습권', 'AI 교육 윤리', '지역 교육 격차', '교육기관 신뢰'],
    angles: ['제도보다 실행이 중요', '학습자 관점 전환 필요', '시장 확대와 품질 관리 병행', '공공성과 수익성 균형 요구', '지역 교육 생태계 재정비', '신뢰 가능한 정보 축적 필요']
  },
  {
    slug: 'press-release',
    prefix: 'press',
    label: '공지·보도',
    tags: ['보도자료', '공지', '교육소식'],
    focus: '교육 관련 공지와 보도자료',
    subjects: ['교육과정 모집 안내', '기관 업무협약', '세미나 개최', '신규 강좌 개설', '교육지원 사업 공고', '수강생 모집 소식'],
    angles: ['지역 학습자 대상 안내', '운영 일정 공개', '신규 프로그램 확대', '참여기관 모집', '교육 정보 접근성 개선', '학습자 편의 강화']
  }
];

function dateRangeDescending(start: string, end: string) {
  const dates: string[] = [];
  const cursor = new Date(`${end}T00:00:00+09:00`);
  const first = new Date(`${start}T00:00:00+09:00`);

  while (cursor >= first) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor.setDate(cursor.getDate() - 1);
  }

  return dates;
}

function yyyymmdd(date: string) {
  return date.replace(/-/g, '');
}

function dateLabel(date: string) {
  const [, month, day] = date.split('-');
  return `${Number(month)}월 ${Number(day)}일`;
}

function pick<T>(items: T[], index: number) {
  return items[index % items.length]!;
}

function articleBody(category: CategorySeed, subject: string, angle: string, date: string) {
  return `${dateLabel(date)} 기준 ${category.label} 분야에서는 ${subject}을 둘러싼 관심이 이어지고 있다. 현장에서는 ${angle} 흐름이 뚜렷해지면서 학습자와 교육기관 모두 과정 선택 기준을 다시 점검하는 분위기다.

이번 흐름의 핵심은 ${category.focus}이 단순한 홍보 문구가 아니라 실제 운영 품질을 판단하는 기준이 되고 있다는 점이다. 과정명과 수강료만 비교하던 방식에서 벗어나 강사 전문성, 학습 목표, 상담 응대, 수료 후 활용 가능성까지 함께 확인하는 사례가 늘고 있다.

학습자가 먼저 살펴볼 부분은 과정의 대상과 목표가 자신의 상황과 맞는지다. 같은 ${subject}이라도 입문자용 과정인지, 실무 적용을 전제로 한 과정인지, 자격 취득을 목표로 한 과정인지에 따라 학습 방식과 필요한 시간이 달라진다.

교육기관 입장에서는 정보 공개 방식이 중요해졌다. 단순 모집 공고보다 운영 일정, 환불 기준, 출석 관리, 과제 피드백, 상담 절차를 구체적으로 제시해야 신뢰를 얻을 수 있다. 특히 성인 학습자는 시간을 쪼개 참여하는 경우가 많아 중도 이탈을 줄이는 관리 체계가 중요하게 평가된다.

짧은 문구로 성과를 과장하거나 수료 이후 활용 가능성을 모호하게 설명하는 과정은 실제 만족도가 낮아질 수 있다. 학습자는 신청 전 공식 안내문과 상담 내용을 함께 확인하고, 필요하면 수강 기간·비용·지원 범위를 별도로 기록해 두는 것이 좋다.

결국 ${category.label} 시장의 경쟁력은 콘텐츠 양보다 검증 가능한 운영 정보에서 갈린다. 에듀저널은 관련 정책, 교육기관 운영 사례, 학습자 관점의 확인 포인트를 지속적으로 정리해 교육 정보의 신뢰도를 높이는 데 초점을 맞출 계획이다.`;
}

function makeArticle(category: CategorySeed, date: string, dateIndex: number, categoryIndex: number): EduArticleSeed {
  const subject = pick(category.subjects, dateIndex + categoryIndex);
  const angle = pick(category.angles, dateIndex * 2 + categoryIndex);
  const id = `${category.prefix}-${yyyymmdd(date)}`;
  const isOpinion = category.slug === 'opinion';
  const isPress = category.slug === 'press-release';

  return {
    id,
    slug: id,
    categorySlug: category.slug,
    title: `${subject}, ${angle}`,
    subtitle: `${category.label} 현장에서 확인한 ${dateLabel(date)} 교육 이슈`,
    summary: `${category.label} 분야에서 ${subject}을 둘러싼 관심이 이어지고 있다. 교육기관은 운영 기준과 학습지원 체계를 더 구체적으로 제시해야 한다는 평가가 나온다.`,
    content: articleBody(category, subject, angle, date),
    articleType: isPress ? 'press_release' : 'normal',
    tags: category.tags,
    publishedAt: `${date}T${String(9 + categoryIndex).padStart(2, '0')}:00:00+09:00`,
    author: isOpinion ? '에듀저널 칼럼니스트' : '에듀저널 편집부',
    thumbnailUrl: '',
    imageCaption: `${category.label} 관련 교육 현장 자료사진.`,
    imageSourceName: '자료사진'
  };
}

const dates = dateRangeDescending(START_DATE, END_DATE);

export const eduArticleSeeds: EduArticleSeed[] = dates.flatMap((date, dateIndex) =>
  categories.map((category, categoryIndex) => makeArticle(category, date, dateIndex, categoryIndex))
);
