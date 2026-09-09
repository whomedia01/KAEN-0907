export interface Journalist {
  id: string;
  name: string;
  title: string;
  department: string;
  email?: string;
  avatarUrl: string;
  bio: string;
  phone: string;
  beats: string[];
}

export const JOURNALISTS: Journalist[] = [
  {
    id: 'jinwoo-kim',
    name: '김진우',
    title: '전문기자',
    department: '인공지능·에듀테크팀',
    avatarUrl: '/media/reporters/kim_jinwoo.svg',
    phone: '02-6443-4222 (내선 101)',
    bio: '생성형 AI 기술의 교육 현장 도입과 초거대 언어모델(LLM) 활용 교육, AI 디지털교과서 정책 및 에듀테크 솔루션의 현장 효용성을 심층 취재합니다.',
    beats: ['생성형 AI', 'AI 디지털교과서', '에듀테크 솔루션', '초·중·고 및 대학 SW교육']
  },
  {
    id: 'seoyun-lee',
    name: '이서윤',
    title: '전문기자',
    department: '교육정책·평생학습팀',
    avatarUrl: '/media/reporters/lee_seoyun.svg',
    phone: '02-6443-4222 (내선 102)',
    bio: '국가 평생교육 진흥 정책과 평생학습 바우처 제도, 고령층을 위한 시니어 디지털 문해력 교육, 전국 평생교육기관의 현장 운영 사례를 발굴·보도합니다.',
    beats: ['교육부 정책', '평생학습 바우처', '시니어 디지털 문해', '평생교육원 운영혁신']
  },
  {
    id: 'hyunmin-park',
    name: '박현민',
    title: '전문기자',
    department: '산업인재·직무역량팀',
    avatarUrl: '/media/reporters/park_hyunmin.svg',
    phone: '02-6443-4222 (내선 103)',
    bio: '산업계의 실무 AI 역량 요구와 기업 HRD 재교육 현장, 국가공인 디지털 자격제도, 대학-기업 산학협력 인재 양성 과정을 객관적으로 검증하고 전달합니다.',
    beats: ['기업 HRD', 'AI·디지털 자격증', '재직자 전직·업스킬링', '산학연계 프로젝트']
  }
];

export function getJournalistById(id: string): Journalist | undefined {
  return JOURNALISTS.find((j) => j.id === id);
}

export function getJournalistByName(name: string): Journalist | undefined {
  const cleanName = name.replace(/기자|전문기자|칼럼니스트|\s+/g, '').trim();
  return JOURNALISTS.find((j) => j.name === cleanName || name.includes(j.name));
}

export function getJournalistForCategory(categorySlug: string, index = 0): Journalist {
  if (['edutech-ai', 'breaking'].includes(categorySlug)) {
    return JOURNALISTS[0]; // 김진우 (AI·에듀테크)
  }
  if (['lifelong-education', 'senior-education', 'edu-institution', 'press-release'].includes(categorySlug)) {
    return JOURNALISTS[1]; // 이서윤 (정책·평생교육)
  }
  if (['career-dev', 'wellness-life', 'interview-people', 'opinion'].includes(categorySlug)) {
    return JOURNALISTS[2]; // 박현민 (직무·산업인재)
  }
  return JOURNALISTS[index % JOURNALISTS.length];
}
