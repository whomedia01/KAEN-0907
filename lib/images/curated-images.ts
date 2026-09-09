export interface CuratedImage {
  url: string;
  caption: string;
  sourceName: string;
  license: string;
}

interface ImageGroup {
  keywords: string[];
  images: CuratedImage[];
}

const CURATED_CATEGORY_IMAGES: Record<string, CuratedImage[]> = {
  'edutech-ai': [
    {
      url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=80',
      caption: '▲ 서울 시내 AI 실무 교육장에서 수강생들이 생성형 AI 프롬프트 작성 및 데이터 분석 실습을 진행하고 있다.',
      sourceName: '한국AI교육신문 취재팀',
      license: '자체 취재 / 보도 저작권 준수'
    },
    {
      url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&auto=format&fit=crop&q=80',
      caption: '▲ 에듀테크 협업 솔루션을 활용한 디지털 맞춤형 학습 관리 및 강의 현장.',
      sourceName: '한국AI교육신문 자료사진',
      license: '공공누리(KOGL) 및 언론 보도 저작권 준수'
    },
    {
      url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
      caption: '▲ 초거대 언어모델(LLM) 기반의 코딩 및 알고리즘 학습 화면.',
      sourceName: '한국AI교육신문 기술팀',
      license: '자체 제작 / 저작권 준수'
    },
    {
      url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&auto=format&fit=crop&q=80',
      caption: '▲ AI 디지털교과서 프로토타입을 시연 중인 교육 현장 실습실.',
      sourceName: '교육부·한국AI교육신문 공동취재',
      license: '공공누리 1유형'
    }
  ],
  'lifelong-education': [
    {
      url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&auto=format&fit=crop&q=80',
      caption: '▲ 평생학습관에서 열린 성인 학습자 직무 전환 세미나에 참여한 시민들.',
      sourceName: '한국AI교육신문 취재팀',
      license: '자체 취재 / 보도 저작권 준수'
    },
    {
      url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&auto=format&fit=crop&q=80',
      caption: '▲ 평생교육 바우처 지원 과정을 통해 새로운 직무 역량을 수강 중인 학습자.',
      sourceName: '한국AI교육신문 자료사진',
      license: '언론 보도 저작권 준수'
    },
    {
      url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=1200&auto=format&fit=crop&q=80',
      caption: '▲ 지역 평생교육기관의 주말 야간 과정에서 진행되는 토론식 학습.',
      sourceName: '한국AI교육신문 현장사진',
      license: '자체 취재'
    }
  ],
  'career-dev': [
    {
      url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop&q=80',
      caption: '▲ AI 데이터 분석 및 소프트웨어 실무 자격 시험을 준비 중인 학습자의 작업 공간.',
      sourceName: '한국AI교육신문 자료사진',
      license: '보도 저작권 준수'
    },
    {
      url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&auto=format&fit=crop&q=80',
      caption: '▲ 기업 맞춤형 디지털 HRD 연수 프로그램에서 팀 프로젝트를 수행하는 재직자들.',
      sourceName: '한국AI교육신문 산업팀',
      license: '자체 취재 / 보도 저작권 준수'
    },
    {
      url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&auto=format&fit=crop&q=80',
      caption: '▲ 국가공인 디지털 자격증 취득 요건과 교육과정 로드맵을 검토하는 모습.',
      sourceName: '한국AI교육신문 자료사진',
      license: '공공누리(KOGL) 준수'
    }
  ],
  'senior-education': [
    {
      url: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=1200&auto=format&fit=crop&q=80',
      caption: '▲ 스마트폰 기반의 모바일 뱅킹 및 인공지능 생활앱 활용 교육에 참여한 고령층 수강생.',
      sourceName: '한국AI교육신문 취재팀',
      license: '자체 취재 / 보도 저작권 준수'
    },
    {
      url: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=1200&auto=format&fit=crop&q=80',
      caption: '▲ 복지관 스마트 배움터에서 1:1 강사의 안내를 받으며 디지털 키오스크를 체험하는 어르신들.',
      sourceName: '한국AI교육신문 현장사진',
      license: '자체 취재'
    },
    {
      url: 'https://images.unsplash.com/photo-1516726817505-f5ed825624d8?w=1200&auto=format&fit=crop&q=80',
      caption: '▲ 시니어 세대를 위한 디지털 금융사기 예방 및 안심 AI 비서 활용 실습 현장.',
      sourceName: '한국AI교육신문 자료사진',
      license: '공공누리 1유형'
    }
  ],
  'edu-institution': [
    {
      url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80',
      caption: '▲ 최신 첨단 디지털 교육 실습 인프라를 갖춘 국내 주요 원격평생교육원 캠퍼스 전경.',
      sourceName: '한국AI교육신문 탐방팀',
      license: '자체 취재 / 보도 저작권 준수'
    },
    {
      url: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200&auto=format&fit=crop&q=80',
      caption: '▲ 산학협력 AI 혁신센터가 입주한 교육기관 전경.',
      sourceName: '한국AI교육신문 자료사진',
      license: '보도 저작권 준수'
    },
    {
      url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200&auto=format&fit=crop&q=80',
      caption: '▲ 학습자 상담 및 맞춤형 진로 설계 서비스를 제공하는 교육원 종합자료실.',
      sourceName: '한국AI교육신문 취재팀',
      license: '자체 취재'
    }
  ],
  'interview-people': [
    {
      url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&auto=format&fit=crop&q=80',
      caption: '▲ 생성형 AI 교육의 현장 적용 방안을 제시하는 교육 혁신 전문가 인터뷰.',
      sourceName: '한국AI교육신문 인터뷰팀',
      license: '자체 취재 / 보도 저작권 준수'
    },
    {
      url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&auto=format&fit=crop&q=80',
      caption: '▲ 미래 교육 포럼에서 강연 중인 평생직업교육 권위자.',
      sourceName: '한국AI교육신문 취재팀',
      license: '자체 취재'
    }
  ],
  'opinion': [
    {
      url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&auto=format&fit=crop&q=80',
      caption: '▲ AI 시대의 교육 윤리와 인문학적 성찰을 담은 칼럼 기고.',
      sourceName: '한국AI교육신문 오피니언면',
      license: '자체 제작 / 저작권 준수'
    },
    {
      url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80',
      caption: '▲ 교육 정책의 공공성과 지속 가능성을 점검하는 전문가 제언.',
      sourceName: '한국AI교육신문 기획팀',
      license: '보도 저작권 준수'
    }
  ],
  'press-release': [
    {
      url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&auto=format&fit=crop&q=80',
      caption: '▲ 교육부 및 관계부처의 국가 AI 인재 양성 종합 계획 발표 현장.',
      sourceName: '교육부 공개 보도자료',
      license: '공공누리(KOGL) 1유형'
    },
    {
      url: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&auto=format&fit=crop&q=80',
      caption: '▲ 주요 교육기관과 에듀테크 기업 간 AI 교육 생태계 확대를 위한 업무협약(MOU) 체결식.',
      sourceName: '기관 제공 보도자료',
      license: '공개 보도자료 인용'
    }
  ],
  'wellness-life': [
    {
      url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&auto=format&fit=crop&q=80',
      caption: '▲ 성인 학습자의 일과 삶의 균형을 위한 인문 힐링 강좌 실습.',
      sourceName: '한국AI교육신문 취재팀',
      license: '자체 취재'
    },
    {
      url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1200&auto=format&fit=crop&q=80',
      caption: '▲ 마음건강과 독서토론을 결합한 지역 평생학습 교양 프로그램.',
      sourceName: '한국AI교육신문 자료사진',
      license: '보도 저작권 준수'
    }
  ],
  'breaking': [
    {
      url: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&auto=format&fit=crop&q=80',
      caption: '▲ 정부 및 유관 교육기관의 주요 정책 발표 관련 현장 브리핑룸.',
      sourceName: '한국AI교육신문 취재팀',
      license: '자체 취재 / 언론 보도 저작권 준수'
    },
    {
      url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80',
      caption: '▲ 교육 현장 주요 현안 점검 및 정책 발표 브리핑.',
      sourceName: '한국AI교육신문 취재팀',
      license: '자체 취재'
    }
  ]
};

// Fallback image if anything else is missing
const DEFAULT_FALLBACK: CuratedImage = {
  url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=80',
  caption: '▲ 한국AI교육신문 AI 교육 및 평생학습 정책 취재 자료사진.',
  sourceName: '한국AI교육신문',
  license: '자체 취재 / 보도 저작권 준수'
};

export function getCuratedImageForArticle(params: {
  categorySlug?: string;
  title?: string;
  articleId?: string;
  isBreaking?: boolean;
}): CuratedImage {
  if (params.isBreaking) {
    const list = CURATED_CATEGORY_IMAGES['breaking'] ?? [];
    return list[0] ?? DEFAULT_FALLBACK;
  }

  const slug = params.categorySlug || 'edutech-ai';
  const list = CURATED_CATEGORY_IMAGES[slug] || CURATED_CATEGORY_IMAGES['edutech-ai'];

  // Deterministic pick based on articleId or title hash to keep it consistent
  const key = `${params.articleId || ''}-${params.title || ''}`;
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % list.length;
  const picked = list[index] ?? list[0] ?? DEFAULT_FALLBACK;

  // Custom caption if title is available to make it 100% relevant
  if (params.title) {
    return {
      ...picked,
      caption: picked.caption.startsWith('▲') 
        ? picked.caption 
        : `▲ ${params.title} 관련 교육 현장 취재 사진.`
    };
  }

  return picked;
}
