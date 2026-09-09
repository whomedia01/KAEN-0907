import { JOURNALISTS, type Journalist } from './journalists';
import { getCuratedImageForArticle } from '@/lib/images/curated-images';

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
  author: string;
  authorEmail?: string;
  authorRole?: string;
  isBreaking?: boolean;
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
  reporterIndex: number;
};

const categories: CategorySeed[] = [
  {
    slug: 'edutech-ai',
    prefix: 'ai',
    label: '에듀테크·AI',
    tags: ['에듀테크', 'AI교육', '생성형AI', '디지털교과서'],
    focus: 'AI 기반 맞춤형 학습 플랫폼과 실무 생성형 AI 역량',
    subjects: [
      '생성형 AI 프롬프트 실무 역량 교육',
      'AI 디지털 교과서 학교 현장 실증',
      '초거대 언어모델 기반 맞춤형 튜터링',
      '학습 데이터 분석 및 이탈 예측 시스템',
      '원격 화상 강의와 자동 피드백 에이전트',
      '교원 및 강사용 AI 교수설계 도구'
    ],
    angles: [
      '현장 도입 가속화로 실무 기준 재정립',
      '단순 기술 시연 넘어 실제 교육 효과성 검증 돌입',
      '교강사 업무 경감과 개별 맞춤 지도 양립 과제',
      '학습 윤리 및 데이터 보호 가이드라인 필수화',
      '교육청·지자체 지원 모델의 질적 고도화',
      '공교육-민간 에듀테크 상생 협력 모델 급부상'
    ],
    reporterIndex: 0 // 김진우 기자
  },
  {
    slug: 'lifelong-education',
    prefix: 'life',
    label: '평생교육·HRD',
    tags: ['평생교육', 'HRD', '성인학습', '평생학습바우처'],
    focus: '국가 평생학습 지원 체계와 성인 학습권 보장',
    subjects: [
      '2026 하반기 평생학습 바우처 사용 지원',
      '지역 거점 평생학습관 직무 전환 특별반',
      '직장인 야간 및 주말 마이크로디그리 과정',
      '디지털 소외계층 대상 성인 문해학습 확대',
      '대학 평생교육원-지역 산업체 연계 강좌',
      '중장년 제2 인생 설계를 위한 생애경력 재설계'
    ],
    angles: [
      '수혜 대상 중심에서 학습 이수율 관리 중심으로 전환',
      '과정 개설 투명성과 환불 규정 공시 의무화',
      '상담 및 학습 설계 멘토링 체계 중요성 대두',
      '수료 후 실제 취업 및 지역사회 기여도 평가 강화',
      '소외 계층 밀착형 이동식 교육 서비스 호평',
      '단순 교양을 넘어 경제적 자립 연계 모델 각광'
    ],
    reporterIndex: 1 // 이서윤 기자
  },
  {
    slug: 'career-dev',
    prefix: 'career',
    label: '자격증·자기계발',
    tags: ['자격증', '직무역량', '자기계발', '데이터분석'],
    focus: '국가공인 AI·데이터 자격제도와 기업 맞춤형 업스킬링',
    subjects: [
      '국가공인 AI 데이터 프롬프트 엔지니어링 자격',
      '비전공자를 위한 파이썬·업무 자동화 자격 검정',
      '재직자 AI 직무 전환 국비지원 훈련 과정',
      '금융·제조업 특화 도메인 AI 실무 인증제',
      '디지털 마케팅 및 노코드 툴 응용능력 평가',
      '공인 데이터 아키텍트 및 머신러닝 준전문가 시험'
    ],
    angles: [
      '이론 암기식 시험 탈피하고 실무 프로젝트 검증으로 전환',
      '기업 채용 시 포트폴리오 연계 인증제 가산점 부여',
      '단기 속성 수료증보다 검증된 실무 인증 수요 급증',
      '주요 대기업 및 공공기관 필수 역량 채택 잇따라',
      '재직자 퇴근 후 라이브 온라인 코딩 캠프 인기',
      '학습 비용 대비 실무 효용성 꼼꼼히 따지는 학습자들'
    ],
    reporterIndex: 2 // 박현민 기자
  },
  {
    slug: 'senior-education',
    prefix: 'senior',
    label: '시니어·실버교육',
    tags: ['시니어교육', '실버디지털', '스마트폰교육', '키오스크'],
    focus: '고령층 디지털 포용과 생활밀착형 안전 교육',
    subjects: [
      '시니어 맞춤형 음성 AI 비서 및 스마트폰 생활 활용',
      '어르신 대상 모바일 금융사기·스미싱 완벽 예방 교육',
      '병원 예약 및 주민센터 무인 키오스크 현장 실습반',
      '은퇴 액티브 시니어 디지털 전문강사 양성 과정',
      '스마트 경로당 및 복지관 디지털 배움터 연계망',
      '시니어 유튜브 크리에이터 및 디지털 자서전 강좌'
    ],
    angles: [
      '단순 기기 조작 넘어 생활 속 독립성 회복에 초점',
      '눈높이 1:1 맞춤형 보조강사 배치로 만족도 대폭 향상',
      '지역 복지관과 지자체의 선도적 지원 체계 호평',
      '가족 간 소통 증진 및 고립감 해소 효과 입증',
      '동년배 시니어 강사가 직접 가르치는 공감형 수업 확산',
      '안전한 디지털 금융 생활을 위한 단계별 모의 실습 필수화'
    ],
    reporterIndex: 1 // 이서윤 기자
  },
  {
    slug: 'edu-institution',
    prefix: 'inst',
    label: '교육기관 탐방',
    tags: ['교육기관탐방', '평생교육원', '캠퍼스혁신', '우수기관'],
    focus: '전국 우수 교육기관의 현장 운영 철학과 학습 지원 혁신',
    subjects: [
      '첨단 AI 실습실 완비한 수도권 원격평생교육원 현장',
      '지역 청년·성인 맞춤형 거점 평생직업교육센터',
      '산업체 맞춤형 계약학과 운영 지방 우수 대학',
      '취업률 90% 달성한 직업능력개발 훈련기관 운영 모델',
      '학습자 중심 24시간 온라인 튜터링 지원 체계',
      '공정한 학사관리와 투명한 등록금 공시제 선도 기관'
    ],
    angles: [
      '시설과 장비 자랑보다 철저한 학생 관리 시스템으로 승부',
      '수강생 중도 탈락 방지하는 밀착형 담임 코칭제 주목',
      '투명한 정보 공개가 교육 소비자 신뢰의 1차 척도',
      '기업 현장 실무자가 직접 멘토로 참여하는 커리큘럼',
      '지역사회 공헌 프로그램과 성인 재교육 동시 달성',
      '학습자 권익 보호와 사전 상담 서비스의 표준 확립'
    ],
    reporterIndex: 1 // 이서윤 기자
  },
  {
    slug: 'interview-people',
    prefix: 'people',
    label: '명사 인터뷰',
    tags: ['명사인터뷰', '교육전문가', '혁신리더', '현장교수'],
    focus: '대한민국 미래 교육을 이끄는 현장 교육자와 혁신가들의 철학',
    subjects: [
      'AI 시대 교육의 본질을 묻다: 미래학회 석좌교수',
      '현장에서 답을 찾는 평생교육 30년 베테랑 관장',
      '비전공자 1만 명을 SW 엔지니어로 양성한 교육기업 대표',
      '은퇴 후 제2의 인생을 시니어 강사로 개척한 학습자',
      '에듀테크 스타트업을 이끄는 청년 혁신 창업가',
      '공교육 교실에 생성형 AI를 선도 도입한 수석교사'
    ],
    angles: [
      '기술은 도구일 뿐, 핵심은 스스로 질문하는 인간의 비판적 사고',
      '평생학습은 복지가 아니라 국가의 가장 확실한 미래 투자',
      '실패를 두려워하지 않는 실험적 교육 환경 구축이 급선무',
      '배움에는 정년이 없으며, 나눔으로써 비로소 완성된다',
      '수요자가 원하는 실무 지식을 발 빠르게 공급하는 민첩성 강조',
      '교사는 지식 전달자에서 맞춤형 멘토이자 학습 촉진자로 진화'
    ],
    reporterIndex: 2 // 박현민 기자
  },
  {
    slug: 'opinion',
    prefix: 'opinion',
    label: '오피니언',
    tags: ['오피니언', '전문가칼럼', '사설', '교육시론'],
    focus: '대한민국 교육 생태계의 현주소와 냉철한 정책 비판 및 제언',
    subjects: [
      '[시론] AI 디지털교과서, 인프라 속도보다 교원 역량이 먼저다',
      '[칼럼] 평생학습 바우처의 사각지대, 어떻게 메울 것인가',
      '[기고] 범람하는 무늬만 AI 자격증, 국가 차원의 품질 인증 시급',
      '[데스크 칼럼] 고령화 사회의 진정한 해법은 시니어 디지털 권리 보장',
      '[현장 목소리] 직업훈련 현장의 규제 완화와 자율성 보장 촉구',
      '[교육 진단] 지방 대학과 지역 평생교육원의 공생 생태계 만들기'
    ],
    angles: [
      '화려한 구호보다 교실 현장의 작은 변화를 세심하게 살펴야',
      '예산 투입 규모보다 실제 소외계층 도달률을 지표로 삼아야',
      '소비자를 현혹하는 과대 광고성 교육 상품에 엄정한 철퇴 필요',
      '디지털 격차는 곧 생존의 격차, 국가 기본권으로 접근해야',
      '경직된 행정 규제가 현장의 자율적 교육 혁신을 가로막아선 안 돼',
      '지역 소멸 위기, 주민 중심의 평생 배움터가 든든한 방파제 역할'
    ],
    reporterIndex: 2 // 박현민 기자
  },
  {
    slug: 'press-release',
    prefix: 'press',
    label: '공지·보도',
    tags: ['보도자료', '정책공지', '교육부발표', '사업공고'],
    focus: '정부 부처 및 공공기관, 유관 단체의 공식 교육 정책과 사업 공고',
    subjects: [
      '교육부, 2026 대한민국 AI·디지털 인재 양성 종합 계획 발표',
      '국가평생교육진흥원, 2026 하반기 바우처 신규 참여자 접수 개시',
      '한국지능정보사회진흥원(NIA), 전 국민 디지털 역량 강화 추진 계획',
      '고용노동부·직업능력심사평가원, K-디지털 트레이닝 우수기관 선정',
      '전국 시·도 교육청, 2학기 AI 코딩 교육 주간 일제 운영 공고',
      '한국AI교육신문-한국에듀테크산업협회, 미래 인재 육성 업무협약 체결'
    ],
    angles: [
      '신청 자격 요건 및 지원 한도, 일정 등 핵심 세부 가이드 안내',
      '참여 기관 및 수혜 학습자를 위한 유의사항과 서류 준비 팁',
      '선정 평가 기준과 현장 심사 강화 방침 동시 안내',
      '국고 지원 사업의 투명한 집행과 사후 점검 체계 가동',
      '지역별 균등 배분 및 소외 계층 우선 선발 원칙 적용',
      '산·학·관 거버넌스 구축을 통한 실질적 교육 성과 창출 목표'
    ],
    reporterIndex: 1 // 이서윤 기자
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

// 1일 시간 간격을 두고 하루 4~5개 기사가 시간대별로 발행되도록 타임스탬프 스케줄링
const TIME_INTERVALS = [
  '08:30:00', // 아침 기획/정책
  '11:45:00', // 점심 에듀테크/AI
  '14:20:00', // 오후 직무/자격증
  '16:50:00', // 늦은 오후 평생/시니어
  '18:30:00'  // 저녁 인터뷰/오피니언
];

function articleBody(
  category: CategorySeed,
  subject: string,
  angle: string,
  date: string,
  journalist: Journalist
) {
  return `[한국AI교육신문 = ${journalist.name} ${journalist.title}] 최근 ${category.label} 분야에서 '${subject}'을 둘러싼 사회적 논의와 현장 참여 열기가 뜨겁게 고조되고 있다. 이번 동향은 '${angle}'이라는 정책적·산업적 전환점과 맞물리며, 교육 공급자와 수요자 모두에게 실질적인 혁신과 체질 개선을 강하게 요구하고 있다.

특히 최근 디지털 전환 가속화와 인공지능(AI) 기술의 대중화로 인해 학습자들의 정보 접근성과 안목이 과거와 비교할 수 없을 만큼 높아졌다. 이에 따라 일선 교육 현장에서는 단순한 지식 전달 위주의 커리큘럼으로는 학습자들의 실질적인 니즈를 충족하기 어렵다는 인식이 빠르게 확산되고 있으며, 교육 기관들 역시 체계적인 교수설계와 엄격한 학습 성취도 관리 체계를 도입하는 등 자구책 마련에 분주한 모양새다.

■ 현장에서 확인한 핵심 쟁점과 실무 운영 실태

교육 현장 관계자들은 이번 이슈가 단순한 일회성 유행이나 단기 테마에 그치지 않고, 포스트 AI 시대의 지속 가능한 교육 패러다임으로 확고히 자리잡고 있다고 한목소리로 진단한다. 특히 ${category.focus} 측면에서 기존의 공급자 일방형 강의 전달 방식에서 벗어나, 학습자의 실질적인 참여와 데이터 기반의 맞춤형 성취 관리가 핵심 평가 잣대로 부상했다.

실제로 수도권 및 주요 거점 교육기관들을 직접 방문 취재한 결과, 과거 과정명이나 수강료 할인 프로모션만을 앞세우던 자극적인 홍보 관행은 현저히 줄어든 것으로 확인됐다. 대신 강사진의 실제 산업 현장 실무 경력, 구체적인 주차별 학습 목표와 프로젝트 결과물, 중도 탈락 방지를 위한 1:1 학습 상담 및 밀착 케어 프로토콜, 그리고 수료 후 공신력 있는 자격증 취득 및 실무 연계 가능 여부를 투명하게 전면에 내세우는 기관들이 학습자들로부터 압도적인 지지를 얻고 있다.

현장에서 만난 한 교육 운영 책임자는 "학습자들의 수준이 매우 정밀해져서 실효성이 떨어지는 이론 나열식 강의는 개설 초기에 외면받기 십상"이라며 "실제 현업의 문제를 해결할 수 있는 프로젝트 기반 학습(PBL)과 AI 보조 도구를 결합한 하이브리드 교육 모델을 구축하는 데 역량을 집중하고 있다"고 전했다.

■ 교육 공급자와 현장 학습자 간 시각차 및 구조적 과제

하지만 이러한 긍정적인 변화 이면에는 여전히 교육 공급자와 수요자 간의 시각차와 구조적인 한계가 상존하고 있다. 대다수 교육기관이 양질의 커리큘럼을 표방하고 있으나, 실제 강사진의 전문성 격차나 실습 기자재·소프트웨어 라이선스 지원 수준에 따라 교육 결과물의 편차가 크게 벌어지고 있는 실정이다.

특히 급변하는 AI 신기술 트렌드를 커리큘럼에 즉각 반영할 수 있는 역량 있는 전문 강사진의 수급난이 심화되면서, 일부 기관에서는 검증되지 않은 외부 강사를 무리하게 투입하거나 부실한 교재를 사용하는 사례도 포착된다. 이로 인해 학습자가 기대했던 교육 수준과 실제 수강 경험 사이의 괴리가 발생하고, 이는 곧 수강 포기나 환불 분쟁 등 사회적 비용으로 이어지는 악순환을 낳고 있다는 지적이다.

■ 학습자가 수강 및 참여 전 반드시 점검해야 할 5대 기준

성인 및 직장인 학습자, 또는 학부모와 시니어 학습자가 해당 과정을 선택할 때 가장 먼저 점검해야 할 지점은 본인의 학습 목적과의 일치성이다. 같은 '${subject}'이라 할지라도 기초 입문 단계인지, 심화 프로젝트 수행 과정인지, 혹은 공인 자격증 취득을 목표로 한 특화반인지에 따라 요구되는 학습 시간과 사전 지식이 크게 달라지므로, 강의 계획서와 선수 학습 요건을 면밀히 대조해야 한다.

두 번째로는 환불 규정과 학사 운영 규정의 투명성이다. 평생교육법 및 관련 소비자보호 법령에 따라 수강료 반환 기준이 명확하게 공시되어 있는지, 부득이한 사정으로 출석이 어려울 경우 보충 학습이나 온라인 녹화본 다시보기 서비스가 차질 없이 제공되는지를 꼼꼼히 확인해야 불필요한 금전적·시간적 피해를 예방할 수 있다.

세 번째는 강사진과의 양방향 질의응답 및 피드백 채널의 활성화 여부다. 일방적인 동영상 시청만으로는 복잡한 실무 개념이나 코딩, 데이터 분석을 온전히 소화하기 어려운 만큼, 전담 튜터나 교강사가 학습자의 과제에 대해 개별 첨삭과 피드백을 적시에 제공하는지가 학습 완주율을 좌우하는 결정적 요인으로 꼽힌다.

네 번째는 수료 후 제공되는 후속 지원 및 사후 관리 체계다. 공인 시험 응시 지원, 포트폴리오 첨삭, 최신 산업 트렌드 세미나 초대, 동문 커뮤니티 연결 등 일회성 수료로 끝나지 않고 지속적인 역량 개발을 뒷받침하는 인프라가 갖추어져 있는지를 따져보아야 한다.

다섯 번째는 국가 공인 인증 및 공식 인가 여부다. 고용노동부, 교육부, 국가평생교육진흥원 등 공공기관의 인가나 위탁 교육 지정을 받은 과정인지, 혹은 객관적인 인증 절차를 통과한 교육 프로그램인지를 공공 알리미 포털 등을 통해 교차 검증하는 지혜가 요구된다.

■ 산·학·연 협력 거버넌스와 데이터 기반 질적 관리 모델

전문가들은 ${category.label} 생태계가 한 단계 도약하기 위해서는 민간 교육기관과 공공 플랫폼, 산업체가 긴밀히 협력하는 '산·학·연 교육 거버넌스'가 확립되어야 한다고 강조한다. 기업 현장에서 실제로 요구하는 직무 역량 지표(Skill Taxonomy)를 실시간으로 교육 과정에 반영하고, 학습자의 학습 로그와 진도율, 프로젝트 결과물을 객관적으로 인증하는 오픈 배지(Open Badge) 시스템의 도입이 시급한 과제로 떠올랐다.

실제로 최근 선도적인 교육기관들을 중심으로 LMS(학습관리시스템)에 AI 분석 엔진을 결합하여, 학습자가 취약한 단원을 사전에 감지하고 맞춤형 보충 문제를 자동으로 추천하는 지능형 학습 환경이 속속 구축되고 있다. 이러한 데이터 기반의 질적 관리가 정착될 때 비로소 진정한 의미의 평생 맞춤 교육이 실현될 수 있다는 평가다.

■ 법적·윤리적 신뢰성 제고와 향후 제도적 과제

아울러 건전한 교육 시장 형성을 위해서는 과장 광고를 엄단하고 사실에 입각한 정보 공개가 완전히 정착되어야 한다. 일부 비인가 기관의 '취업 100% 보장'이나 '단기 속성 자격증 발급'과 같은 부당 표시·광고 행위에 현혹되지 않도록 규제 당국의 상시 모니터링이 강화되어야 하며, 소비자 스스로도 공식 등록 인가 여부를 꼼꼼히 대조해야 한다.

${journalist.name} 기자는 "교육은 단순한 상품 소비가 아니라 인간의 내면적 성장과 사회적 생존 역량을 기르는 숭고하고 중대한 과정"이라며 "한국AI교육신문은 앞으로도 교육 현장의 생생한 목소리와 공신력 있는 정책 정보를 신속하고 정확하게 전달하여 독자 여러분의 현명하고 합리적인 선택을 돕는 정론직필의 나침반 역할을 충실히 다하겠다"고 밝혔다.

[기자 수첩 / 심층 취재 후기]

이번 취재 현장에서 만난 다양한 연령대의 학습자들에게서 배움에 대한 뜨거운 열정과 절박함을 동시에 느낄 수 있었다. 급변하는 기술의 파고 속에서 뒤처지지 않기 위해 밤낮없이 학습에 매진하는 이들의 땀방울이야말로 우리 사회를 지탱하는 가장 큰 원동력이다. 교육기관들이 단기적인 상업적 이익에 매몰되지 않고, 학습자의 인생을 변화시킨다는 사명감과 진정성 있는 교육 품질로 화답할 때 비로소 대한민국 AI 교육의 미래가 활짝 열릴 것이다.

※ 저작권자 ⓒ 한국AI교육신문. 무단전재 및 재배포, AI 학습용 무단 크롤링을 엄격히 금합니다.
※ 본 기사는 저작권법 및 한국인터넷신문윤리강령을 준수하며 철저한 현장 취재 및 사실 검증을 거쳐 보도되었습니다.
※ 기사 제보 및 정정보도, 반론권 청구: 편집국 (02-6443-4222)`;
}

function makeArticle(
  category: CategorySeed,
  date: string,
  dateIndex: number,
  categoryIndex: number
): EduArticleSeed {
  const subject = pick(category.subjects, dateIndex + categoryIndex);
  const angle = pick(category.angles, dateIndex * 2 + categoryIndex);
  const id = `${category.prefix}-${yyyymmdd(date)}-${categoryIndex + 1}`;
  const isOpinion = category.slug === 'opinion';
  const isPress = category.slug === 'press-release';

  // 3인의 기자 중 전문분야에 맞게 배정
  const journalist = JOURNALISTS[category.reporterIndex % JOURNALISTS.length]!;

  // 1일 시간 간격을 두고 3개 이상 분산 발행
  const timeSlot = TIME_INTERVALS[categoryIndex % TIME_INTERVALS.length]!;
  const publishedAt = `${date}T${timeSlot}+09:00`;

  // 기사 내용과 정확히 일치하는 이미지 매칭
  const curatedImage = getCuratedImageForArticle({
    categorySlug: category.slug,
    title: subject,
    articleId: id
  });

  return {
    id,
    slug: id,
    categorySlug: category.slug,
    title: subject,
    subtitle: angle,
    summary: `${category.label} 분야에서 '${subject}'을 둘러싼 관심이 뜨겁게 확산되고 있다. 교육기관과 학습자 모두 실무 운영 기준과 검증 가능한 학습 성과를 꼼꼼히 점검해야 한다는 현장 분석이 나온다.`,
    content: articleBody(category, subject, angle, date, journalist),
    articleType: isPress ? 'press_release' : 'normal',
    tags: category.tags,
    publishedAt,
    author: `${journalist.name} 기자`,
    authorEmail: undefined,
    authorRole: `${journalist.department} ${journalist.title}`,
    thumbnailUrl: curatedImage.url,
    imageCaption: curatedImage.caption,
    imageSourceName: curatedImage.sourceName
  };
}

// 당일 주요 정책 발표 기사 씨드 생성 함수
export function generateBreakingNews(currentDateStr: string): EduArticleSeed[] {
  const reporter = JOURNALISTS[0]; // 김진우 AI전문기자
  const breakingItems = [
    {
      id: `policy-${yyyymmdd(currentDateStr)}-1`,
      title: '교육부, 2026 AI 디지털교과서 학교 현장 안착 지원 방안 발표',
      subtitle: '초·중·고 교원 대상 1:1 맞춤형 연수 전면 확대 및 학교 무선 인프라 특별 점검',
      time: '17:15:00',
      summary: '교육부가 2026학년도 AI 디지털교과서의 성공적인 교실 안착을 위해 교원 직무연수 및 예산 추가 배정을 포함한 전면 지원 로드맵을 발표했다.',
      curated: getCuratedImageForArticle({ isBreaking: false, categorySlug: 'edutech-ai', title: 'AI 디지털교과서 발표' })
    },
    {
      id: `policy-${yyyymmdd(currentDateStr)}-2`,
      title: '과기정통부·교육부, 공공·교육기관 초거대 AI 실무 인증제 공동 신설 합의',
      subtitle: '국가 공인 프롬프트 및 데이터 활용 역량 평가 기준 2학기 내 표준화 고시',
      time: '14:30:00',
      summary: '과기정통부와 교육부가 손잡고 공공 교육 현장의 생성형 AI 오남용을 방지하고 교강사의 실무 활용성을 검증하는 국가 공인 AI 인증제를 도입하기로 합의했다.',
      curated: getCuratedImageForArticle({ isBreaking: false, categorySlug: 'career-dev', title: '공공 교육 AI 인증제 신설' })
    },
    {
      id: `policy-${yyyymmdd(currentDateStr)}-3`,
      title: '국가평생교육진흥원, 2026년도 하반기 평생학습 바우처 5만 명 추가 지원',
      subtitle: '취약계층 및 중장년 구직자 대상 1인당 연 35만 원 카드 바우처 추가 접수 개시',
      time: '10:10:00',
      summary: '국가평생교육진흥원이 디지털 격차 해소를 위해 하반기 평생학습 바우처 대상자 5만 명을 추가 선발한다고 밝혔다.',
      curated: getCuratedImageForArticle({ isBreaking: false, categorySlug: 'lifelong-education', title: '평생학습 바우처 추가' })
    }
  ];

  return breakingItems.map((item) => ({
    id: item.id,
    slug: item.id,
    categorySlug: 'edutech-ai',
    title: item.title,
    subtitle: item.subtitle,
    summary: item.summary,
    content: `[한국AI교육신문 = ${reporter.name} 전문기자] ${item.summary} 이번 종합 대책은 급변하는 글로벌 인공지능 기술 패권 경쟁과 디지털 교육 전환 흐름에 선제적으로 대응하고, 일선 학교 및 평생 교육 현장의 실질적인 정책 안착을 강력하게 견인하기 위해 마련되었다.

특히 주무 부처와 유관 공공기관들은 과거 단순 예산 분배나 단발성 시범 사업 형태에서 벗어나, 현장 교원과 학습자, 교육 공급자가 유기적으로 상호작용하는 지속 가능한 디지털 교육 인프라를 확충하는 데 역량을 집중한다는 방침이다.

■ 세부 실행 로드맵 및 중점 추진 과제

관계 당국에 따르면 이번 조치는 크게 세 가지 핵심 축으로 추진된다. 첫째는 일선 학교 현장의 인프라 및 전담 지원 인력의 획기적 확충이다. 무선 네트워크 품질 고도화와 노후 기기 교체, 1교 1디지털 튜터 배치 등을 통해 교육 현장의 물리적 병목 현상을 해소한다는 계획이다.

둘째는 교원 및 강사진의 실무 역량 강화를 위한 맞춤형 1:1 집중 연수 프로그램의 전면 가동이다. 이론 중심의 연수를 탈피하여 실제 수업 지도안 설계, 생성형 AI 도구 활용법, 학생 데이터 분석 및 피드백 실습 등 현업 밀착형 커리큘럼이 정규 연수 과정에 대거 포함된다.

셋째는 취약계층 및 디지털 소외 계층을 위한 바우처 및 무상 지원 체계의 전면 확대다. 경제적 여건이나 거주 지역에 구애받지 않고 모든 학습자가 양질의 인공지능 교육 혜택을 누릴 수 있도록 제도적 안전망을 한층 강화한다.

■ 학교 현장 및 교육계의 즉각적인 반응과 기대

교육 현장에서는 이번 정부 발표에 대해 일제히 환영의 뜻을 표하면서도, 실효성 있는 집행에 만전을 기해줄 것을 주문하고 있다. 전국 교원단체 관계자는 본지와의 인터뷰에서 "그동안 현장에서 가장 큰 애로사항으로 지적되어 온 인프라 격차와 교원 업무 과중 문제가 일정 부분 해소될 전기가 마련됐다"고 평가했다.

다만 "현장 안착의 핵심은 전시성 행정이 아닌 교실 내 실질적인 수업 변화에 있다"며 "일선 교사들이 자발적으로 혁신을 시도할 수 있도록 제도적 유연성과 자율성을 폭넓게 보장해야 한다"고 덧붙였다.

■ 향후 추진 일정 및 모니터링 체계

정부는 이번 발표를 기점으로 전국 시·도 교육청 및 지자체와 합동 점검단을 구성하고, 분기별 이행 실적을 국민에게 투명하게 공개할 예정이다. 아울러 현장 모니터링단을 상시 운영하여 예산 집행 과정에서 발생할 수 있는 부작용을 사전에 차단한다는 구상이다.

주무 부처 핵심 관계자는 "이번 종합 대책은 단순한 기술 도입을 넘어 대한민국 공교육과 평생학습의 질적 체질을 혁신하는 중대한 분기점이 될 것"이라며 "현장과의 끊임없는 소통을 바탕으로 정책의 완성도를 높여가겠다"고 강조했다.

한국AI교육신문은 본 정책의 세부 실행 지침 및 학교 현장의 실제 적용 사례, 후속 예산 배정 현황을 지속적으로 심층 취재하여 독자 여러분께 신속하고 정확하게 보도할 예정이다.

※ 저작권자 ⓒ 한국AI교육신문. 무단전재 및 재배포, AI 학습용 무단 크롤링을 엄격히 금합니다.
※ 본 기사는 언론윤리강령을 준수하며 정부 및 공공기관의 공식 발표를 바탕으로 철저한 현장 확인 및 사실 검증 후 보도되었습니다.
※ 기사 제보 및 정정보도, 반론권 청구: 편집국 (02-6443-4222)`,
    articleType: 'press_release' as const,
    tags: ['교육부', 'AI교육', '정책발표'],
    publishedAt: `${currentDateStr}T${item.time}+09:00`,
    author: `${reporter.name} 전문기자`,
    authorEmail: undefined,
    authorRole: `${reporter.department} ${reporter.title}`,
    isBreaking: false,
    thumbnailUrl: item.curated.url,
    imageCaption: item.curated.caption,
    imageSourceName: item.curated.sourceName
  }));
}

// 2026-07-01부터 현재 날짜(2026-09-09)까지 매일 1일 시간 간격으로 하루 4~5개 기사 자동 발행
const START_DATE = '2026-07-01';
const TODAY_DATE = '2026-09-09';

const dates = dateRangeDescending(START_DATE, TODAY_DATE);

// 매일 1일 간격으로 4~5개 기사 정밀 스케줄링 발행
const standardArticleSeeds: EduArticleSeed[] = dates.flatMap((date, dateIndex) => {
  // 매일 최소 4~5개 기사가 시간대별로 균등 발행되도록 4~5개 카테고리 선정
  return categories.slice(0, 5).map((category, categoryIndex) =>
    makeArticle(category, date, dateIndex, categoryIndex)
  );
});

// 당일 주요 정책 기사 결합
const breakingSeeds = generateBreakingNews(TODAY_DATE);

export const eduArticleSeeds: EduArticleSeed[] = [
  ...breakingSeeds,
  ...standardArticleSeeds
];
