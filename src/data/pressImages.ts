export interface PressImageItem {
  id: string;
  title: string;
  category: string;
  keywords: string[];
  url: string;
  caption: string;
  copyright: string;
}

export const PRESS_IMAGE_DATABASE: PressImageItem[] = [
  // ==========================================
  // 1. AI 정책·행정 (cat_policy)
  // ==========================================
  {
    id: "img_policy_gov_briefing",
    title: "정부합동 브리핑 및 종합 로드맵 발표",
    category: "cat_policy",
    keywords: ["교육부", "과기정통부", "브리핑", "기본계획", "2026", "확정", "발표", "로드맵"],
    url: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=1200",
    caption: "정부서울청사 합동 브리핑룸에서 열린 AI 공교육 종합 기본계획 2026 확정 발표 현장.",
    copyright: "한국AI교육신문 DB"
  },
  {
    id: "img_policy_cloud_datacenter",
    title: "학내 고속 클라우드망 서버 및 데이터센터",
    category: "cat_policy",
    keywords: ["클라우드", "사설클라우드", "서버", "데이터센터", "KERIS", "초고속", "트래픽"],
    url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200",
    caption: "전국 초·중·고교 AI 교과서 전용 고속 클라우드망 메인 서버 데이터센터 및 트래픽 분산 시스템.",
    copyright: "한국AI교육신문 DB"
  },
  {
    id: "img_policy_cyber_security",
    title: "AI 교과서 개인정보 보안 및 사이버 보안 관제",
    category: "cat_policy",
    keywords: ["개인정보", "보안", "사이버보안", "최고등급", "암호화", "관제", "CSAP", "안전망"],
    url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1200",
    caption: "교육 정보 보안 통합 관제 센터에서 AI 디지털 교과서 학생 개인정보 암호화 및 무단 침입 차단 시스템을 점검하고 있다.",
    copyright: "한국AI교육신문 DB"
  },
  {
    id: "img_policy_budget_1trillion",
    title: "시·도교육청 1조 2,300억 규모 디지털 인프라 예산",
    category: "cat_policy",
    keywords: ["1조", "2300억", "예산", "인프라", "확충", "집행", "시도교육청", "추경"],
    url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1200",
    caption: "전국 시·도교육청이 편성한 1조 2,300억 원 규모의 AI 교육 디지털 인프라 확충 예산 집행 협의 현장.",
    copyright: "한국AI교육신문 DB"
  },
  {
    id: "img_policy_local_board",
    title: "전국 17개 시·도교육청 교육감 정책 협의회",
    category: "cat_policy",
    keywords: ["교육감", "시도교육청", "협의회", "정책협의", "전국17개", "지자체"],
    url: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&q=80&w=1200",
    caption: "전국 17개 시·도교육청 교육감 정책 협의회에서 AI 디지털 교육 전환 가속화 방안을 논의하고 있다.",
    copyright: "한국AI교육신문 DB"
  },
  {
    id: "img_policy_national_standards",
    title: "2026 AI 공교육 국가 표준 보안·운영 체계",
    category: "cat_policy",
    keywords: ["국가표준", "운영체계", "보안운영", "공표", "가이드라인", "제도화"],
    url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200",
    caption: "정부 청사 회의실에서 확정 발표된 '2026 AI 공교육 국가 표준 보안 및 학교 운영 가이드라인' 실무 회의.",
    copyright: "한국AI교육신문 DB"
  },
  {
    id: "img_policy_highspeed_network",
    title: "초·중·고 학내 기가급 광통신 무선망 인프라 점검",
    category: "cat_policy",
    keywords: ["광통신", "무선망", "WiFi", "초고속망", "기가급", "네트워크", "개통"],
    url: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=1200",
    caption: "교육 정보화 네트워크 기술팀이 전국 학교 현장에 기가급 고속 무선 통신망을 설치·점검하고 있다.",
    copyright: "한국AI교육신문 DB"
  },
  {
    id: "img_policy_mou_agreement",
    title: "정부-공공기관-지자체 AI 공교육 발전 협약식",
    category: "cat_policy",
    keywords: ["협약", "MOU", "체결", "공공기관", "파트너십", "디지털교육"],
    url: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=1200",
    caption: "정부 부처와 공공 교육기관 대표들이 AI 디지털 공교육 활성화를 위한 상호 업무협약(MOU)을 맺고 있다.",
    copyright: "한국AI교육신문 DB"
  },

  // ==========================================
  // 2. AI 학교·교육 (cat_school)
  // ==========================================
  {
    id: "img_school_tablet_classroom",
    title: "초·중·고 1인 1스마트기기 AI 디지털 교과서 수업",
    category: "cat_school",
    keywords: ["교과서", "AI교과서", "디지털교과서", "스마트기기", "1인1기기", "태블릿", "초등학교", "실증"],
    url: "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&q=80&w=1200",
    caption: "디지털 선도 초등학교에서 학생들이 1인 1디지털 기기로 AI 디지털 교과서 실시간 맞춤 학습을 진행하고 있다.",
    copyright: "한국AI교육신문 DB"
  },
  {
    id: "img_school_adaptive_tutoring",
    title: "AI 맞춤형 학습 튜터링 및 오답 자동 보완",
    category: "cat_school",
    keywords: ["튜터링", "맞춤형", "오답", "기초학력", "미달률", "개념이해", "35%감소", "보완"],
    url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200",
    caption: "학생이 AI 맞춤형 튜터링 플랫폼을 활용하여 수학 오답 취약점을 실시간 피드백으로 보완하고 있다.",
    copyright: "한국AI교육신문 DB"
  },
  {
    id: "img_school_teacher_training_prompt",
    title: "전국 교원 10만 명 대상 생성형 AI 수업 실습 연수",
    category: "cat_school",
    keywords: ["교원연수", "10만명", "프롬프트", "연수", "교사연수", "지도법", "하반기", "교원"],
    url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200",
    caption: "전국 시·도교육청 교원 연수원에서 현장 교사들이 생성형 AI 프롬프트 지도법과 수업 설계안을 연구하고 있다.",
    copyright: "한국AI교육신문 DB"
  },
  {
    id: "img_school_concept_95percent",
    title: "학생 개념 이해도 95% 달성 AI 실증 교실",
    category: "cat_school",
    keywords: ["개념이해도", "95%", "달성", "맞춤형수업", "가동", "성취도", "실증완료"],
    url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=1200",
    caption: "AI 맞춤형 학습 피드백 수업을 통해 학생들의 단원 개념 이해도가 95%에 도달한 교실 수업 현장.",
    copyright: "한국AI교육신문 DB"
  },
  {
    id: "img_school_science_lab",
    title: "AI 기반 수학·과학 탐구형 디지털 실험 수업",
    category: "cat_school",
    keywords: ["수학", "과학", "탐구형", "실험", "실험수업", "개학", "센서"],
    url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=1200",
    caption: "중학교 과학실에서 학생들이 AI 기반 데이터 센서와 시뮬레이션을 활용해 과학 탐구 실험을 진행하고 있다.",
    copyright: "한국AI교육신문 DB"
  },
  {
    id: "img_school_sw_coding",
    title: "초·중·고 미래 인재 양성 SW·AI 코딩 실습",
    category: "cat_school",
    keywords: ["코딩", "SW", "알고리즘", "소프트웨어", "프로그래밍", "컴퓨팅"],
    url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1200",
    caption: "컴퓨터 실습실에서 학생들이 인공지능 기반 블록 코딩 및 파이썬 알고리즘 기초를 학습하고 있다.",
    copyright: "한국AI교육신문 DB"
  },
  {
    id: "img_school_smart_board",
    title: "대화형 전자칠판과 AI 디지털 협업 수업",
    category: "cat_school",
    keywords: ["전자칠판", "상호작용", "선도학교", "협업수업", "스마트보드"],
    url: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&q=80&w=1200",
    caption: "디지털 선도학교 교사가 대형 전자칠판에 AI 분석 대시보드를 띄우고 학생들과 토의형 수업을 진행하고 있다.",
    copyright: "한국AI교육신문 DB"
  },
  {
    id: "img_school_creative_robotics",
    title: "방과후 및 늘봄학교 AI 피지컬 컴퓨팅 창의 실습",
    category: "cat_school",
    keywords: ["늘봄학교", "방과후", "로봇", "피지컬컴퓨팅", "창의체험", "교구"],
    url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1200",
    caption: "초등학교 늘봄학교 교실에서 학생들이 인공지능 자율주행 모듈 교구를 조립하며 창의력을 키우고 있다.",
    copyright: "한국AI교육신문 DB"
  },

  // ==========================================
  // 3. AI 산업·에듀테크 (cat_edtech)
  // ==========================================
  {
    id: "img_edtech_lesson_copilot",
    title: "생성형 AI 수업 코파일럿 솔루션 개발 대시보드",
    category: "cat_edtech",
    keywords: ["코파일럿", "수업코파일럿", "생성형AI", "지도안", "학습자료", "솔루션", "보조교사"],
    url: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=1200",
    caption: "국내 에듀테크 개발진이 구축한 생성형 AI 수업 코파일럿 플랫폼의 맞춤형 교안 생성 인터페이스.",
    copyright: "한국AI교육신문 DB"
  },
  {
    id: "img_edtech_global_export_300m",
    title: "K-에듀테크 글로벌 수출 3억 달러 돌파 및 해외 계약",
    category: "cat_edtech",
    keywords: ["수출", "3억", "달러", "글로벌", "해외수출", "독주", "계약성과", "B2G"],
    url: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=1200",
    caption: "해외 교육 전시회 현장에서 K-에듀테크 대표단이 글로벌 공교육 기관과 3억 달러 규모의 기술 수출 계약을 체결하고 있다.",
    copyright: "한국AI교육신문 DB"
  },
  {
    id: "img_edtech_smart_feedback",
    title: "서·논술형 정밀 평가 AI 스마트 피드백 엔진",
    category: "cat_edtech",
    keywords: ["서논술형", "평가", "스마트피드백", "채점", "피드백엔진", "정밀평가", "글쓰기"],
    url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1200",
    caption: "인공지능 정밀 자연어 처리(NLP) 기술로 학생의 서술형 답안을 문맥별로 자동 분석하고 정밀 첨삭 피드백을 제공하는 모습.",
    copyright: "한국AI교육신문 DB"
  },
  {
    id: "img_edtech_standard_consortium",
    title: "K-에듀테크 융합 연합회 생성형 AI 기술 표준안 의결",
    category: "cat_edtech",
    keywords: ["표준안", "연합회", "의결", "융합연합회", "기술표준", "협의체", "학업보조"],
    url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200",
    caption: "K-에듀테크 융합 연합회 정기총회에서 국내 주요 AI 기업 대표들이 '2026 생성형 AI 학업 보조 엔진 표준안'을 의결하고 있다.",
    copyright: "한국AI교육신문 DB"
  },
  {
    id: "img_edtech_verified_seal_50",
    title: "한국에듀테크산업협회 '팩트 기반 검증 필증' 부여 50선",
    category: "cat_edtech",
    keywords: ["검증필증", "50선", "에듀테크산업협회", "팩트기반", "선정", "품질인증", "공인"],
    url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1200",
    caption: "한국에듀테크산업협회가 공교육 안전성과 팩트 정확성을 충족한 우수 AI 학습 도구 50선에 공식 검증 필증을 수여했다.",
    copyright: "한국AI교육신문 DB"
  },
  {
    id: "img_edtech_startup_ir",
    title: "국내 AI 에듀테크 유망 스타트업 투자 유치 및 IR",
    category: "cat_edtech",
    keywords: ["스타트업", "IR", "투자유치", "시리즈", "벤처", "기술시연"],
    url: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1200",
    caption: "에듀테크 데모데이 행사에서 유망 AI 스타트업이 교육 특화 거대언어모델 엔진 기술을 발표하고 있다.",
    copyright: "한국AI교육신문 DB"
  },
  {
    id: "img_edtech_global_summit_booth",
    title: "아시아 에듀테크 서밋 글로벌 솔루션 전시",
    category: "cat_edtech",
    keywords: ["서밋", "박람회", "부스", "솔루션", "전시", "해외진출"],
    url: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1200",
    caption: "국제 에듀테크 서밋 전시 부스에서 각국 교육 바이어들이 최신 AI 학습 플랫폼 시연에 참여하고 있다.",
    copyright: "한국AI교육신문 DB"
  },

  // ==========================================
  // 4. AI 리터러시·인재 (cat_literacy)
  // ==========================================
  {
    id: "img_literacy_senior_education",
    title: "정부·지자체 시니어 맞춤형 AI 리터러시 평생교육",
    category: "cat_literacy",
    keywords: ["시니어", "노인", "어르신", "평생교육", "연수", "대폭확대", "식별연수"],
    url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1200",
    caption: "지역 평생학습관에서 어르신들이 스마트폰과 AI 음성 비서 실생활 활용법 및 디지털 리터러시 교육을 받고 있다.",
    copyright: "한국AI교육신문 DB"
  },
  {
    id: "img_literacy_deepfake_signature",
    title: "전 국민 AI 리터러시 10만 서명운동 및 딥페이크 방지",
    category: "cat_literacy",
    keywords: ["10만", "서명운동", "개시", "딥페이크", "크롤링", "서명", "방지", "시민사회"],
    url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1200",
    caption: "시민단체와 학부모 연합회가 '딥페이크 악용 근절 및 전 국민 AI 리터러시 10만 서명운동'을 선포하고 있다.",
    copyright: "한국AI교육신문 DB"
  },
  {
    id: "img_literacy_library_citizen",
    title: "전국 150개 공공도서관 '주민 참여형 AI 윤리 교실'",
    category: "cat_literacy",
    keywords: ["공공도서관", "도서관", "150개", "주민", "시민", "참여형", "개강"],
    url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200",
    caption: "서울 시립 공공도서관 디지털 문화실에서 열린 주민 대상 생성형 AI 활용 및 팩트체크 리터러시 실습 강좌.",
    copyright: "한국AI교육신문 DB"
  },
  {
    id: "img_literacy_keris_guideline",
    title: "KERIS 학생용 '생성형 AI 올바른 이용 및 저작권 지침'",
    category: "cat_literacy",
    keywords: ["한국교육학술정보원", "KERIS", "지침", "공표", "저작권", "올바른이용", "학생용"],
    url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200",
    caption: "한국교육학술정보원(KERIS)이 전국 초·중·고교에 배포한 '학생용 생성형 AI 올바른 이용 및 저작권 준수 지침서' 발표회.",
    copyright: "한국AI교육신문 DB"
  },
  {
    id: "img_literacy_youth_camp",
    title: "전국 17개 교육청 청소년 AI 윤리·언론 리터러시 캠프",
    category: "cat_literacy",
    keywords: ["캠프", "청소년", "언론리터러시", "윤리캠프", "동시개최", "학생기자단"],
    url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=1200",
    caption: "시·도교육청 주최 청소년 미디어 캠프에서 참가 학생들이 AI 생성 콘텐츠의 진위 판별과 팩트체크 기사 작성을 실습하고 있다.",
    copyright: "한국AI교육신문 DB"
  },
  {
    id: "img_literacy_digital_divide_safe",
    title: "디지털 격차 없는 사회... 전 국민 AI 리터러시 인프라",
    category: "cat_literacy",
    keywords: ["디지털격차", "격차없는", "전국민대상", "본격가동", "포용", "디지털배움터"],
    url: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1200",
    caption: "디지털 배움터 거점 센터에서 남녀노소 시민들이 1대1 튜터의 지도를 받으며 안전한 AI 활용법을 익히고 있다.",
    copyright: "한국AI교육신문 DB"
  },
  {
    id: "img_literacy_deepfake_defense",
    title: "AI 딥페이크 탐지 알고리즘 및 위변조 방지 기술 세미나",
    category: "cat_literacy",
    keywords: ["딥페이크식별", "탐지", "위변조", "식별", "알고리즘", "방지"],
    url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200",
    caption: "디지털 포렌식 전문가들이 이미지·음성 딥페이크 위변조 탐지 기술과 대응 방안을 강연하고 있다.",
    copyright: "한국AI교육신문 DB"
  },

  // ==========================================
  // 5. 오피니언·기획 (cat_opinion)
  // ==========================================
  {
    id: "img_opinion_teacher_designer",
    title: "지식 전달 넘어선 AI 시대 교원… ‘배움의 디자이너’",
    category: "cat_opinion",
    keywords: ["배움의디자이너", "감성멘토", "체질개선", "지식전달", "교원역할", "선생님"],
    url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1200",
    caption: "단순 지식 주입을 넘어 학생 개개인의 창의성과 정서적 성장을 세심하게 설계하는 '배움의 디자이너' 교사의 모습.",
    copyright: "한국AI교육신문 DB"
  },
  {
    id: "img_opinion_editorial_promise",
    title: "한국AI교육신문의 약속: 정론직필과 24시간 팩트검증",
    category: "cat_opinion",
    keywords: ["정론직필", "24시간", "팩트검증", "표준정립", "약속", "한국AI교육신문의약속"],
    url: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=1200",
    caption: "한국AI교육신문 데스크에서 사실 검증 보고서와 공교육 취재 원고를 대조하며 정론직필 보도를 검수하고 있다.",
    copyright: "한국AI교육신문 DB"
  },
  {
    id: "img_opinion_autonomy_human_touch",
    title: "공교육 AI 혁신의 핵심: 교사의 자율권과 인간적 교감",
    category: "cat_opinion",
    keywords: ["교사의자율권", "인간적교감", "혁신의핵심", "따뜻한교육", "상담", "멘토링"],
    url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=1200",
    caption: "교사와 학생이 마주 앉아 진로와 학업 고민을 나누며 진정한 인간적 교감의 교육적 가치를 실현하고 있다.",
    copyright: "한국AI교육신문 DB"
  },
  {
    id: "img_opinion_role_change_warmth",
    title: "AI 시대, 교사의 역할 변화와 공교육의 온기 있는 가치",
    category: "cat_opinion",
    keywords: ["역할변화", "온기있는", "공교육의가치", "인성교육", "공감", "따뜻함"],
    url: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=1200",
    caption: "기술이 고도화될수록 더욱 빛을 발하는 인간 교사의 따뜻한 온기와 전인적 인성 교육의 현장.",
    copyright: "한국AI교육신문 DB"
  },
  {
    id: "img_opinion_global_field_uk_us",
    title: "글로벌 AI 교육 혁신 현장을 가다: 미국·영국의 디지털 교과서",
    category: "cat_opinion",
    keywords: ["글로벌혁신", "미국영국", "해외현장", "영국", "미국", "디지털교과서도입", "해외탐방"],
    url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200",
    caption: "미국 및 영국의 선진 스마트 교육 시범 학교에서 학생들이 AI 융합 토론 수업에 참여하고 있는 현장.",
    copyright: "한국AI교육신문 DB"
  },
  {
    id: "img_opinion_legal_ethics_mission",
    title: "AI 공교육 시대의 개막... 법적 윤리와 팩트 보도의 막중한 사명",
    category: "cat_opinion",
    keywords: ["법적윤리", "팩트보도", "막중한사명", "개막", "사명", "정론", "저널리즘"],
    url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200",
    caption: "인공지능 대전환기 속에서 언론 윤리 준수와 정직한 팩트 보도의 사회적 사명을 되새기는 보도국 현장.",
    copyright: "한국AI교육신문 DB"
  },
  {
    id: "img_opinion_hwang_column_thought",
    title: "황광성 칼럼: 기술과 인간이 공존하는 백년대계 미래 교육",
    category: "cat_opinion",
    keywords: ["황광성칼럼", "황광성", "칼럼", "시론", "백년대계", "공존", "사설"],
    url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=1200",
    caption: "한국AI교육신문 황광성 발행인 겸 편집인이 대한민국 미래 교육의 백년대계를 고찰하며 칼럼을 집필하고 있다.",
    copyright: "한국AI교육신문 DB"
  }
];

/**
 * 기사의 제목, 본문, 카테고리를 정밀 분석하여 내용과 가장 일치하는 보도사진을 반환
 * usedUrls가 주어지면 이미 사용된 URL을 배제하여 고유한 사진이 배정되도록 지원
 */
export function matchArticleImage(
  title: string,
  content: string,
  categoryId?: string,
  usedUrls?: Set<string>
): PressImageItem {
  const fullText = `${title || ""} ${content || ""}`.toLowerCase();

  // 1차 후보군 점수 계산
  const scoredItems = PRESS_IMAGE_DATABASE.map((item) => {
    let score = 0;

    // 카테고리 일치 가산점 (3점)
    if (categoryId && item.category === categoryId) {
      score += 3;
    }

    // 키워드 일치 점수 산출
    for (const kw of item.keywords) {
      const lowerKw = kw.toLowerCase();
      // 제목에 키워드가 있으면 5점 부여 (제목 일치도 최우선)
      if (title && title.toLowerCase().includes(lowerKw)) {
        score += 5;
      }
      // 본문에 키워드가 있으면 1점 부여
      if (fullText.includes(lowerKw)) {
        score += 1;
      }
    }

    return { item, score };
  });

  // 점수 내림차순 정렬
  scoredItems.sort((a, b) => b.score - a.score);

  // usedUrls가 있는 경우, 이미 사용되지 않은 이미지 중 최고 점수 선택
  if (usedUrls && usedUrls.size > 0) {
    const unusedMatch = scoredItems.find((candidate) => !usedUrls.has(candidate.item.url));
    if (unusedMatch) {
      return unusedMatch.item;
    }
  }

  // fallback: 가장 점수가 높은 항목 반환
  return scoredItems[0]?.item || PRESS_IMAGE_DATABASE[0];
}

/**
 * 기사 본문 내 삽입용 고품질 보도사진 HTML 블록 생성
 */
export function createInlineFigureHtml(item: PressImageItem): string {
  return `\n<figure class="my-6 p-2 bg-neutral-50 border border-neutral-200 rounded text-center">
  <img src="${item.url}" alt="${item.title}" class="w-full h-auto max-h-96 object-cover rounded shadow-sm mx-auto" referrerPolicy="no-referrer" />
  <figcaption class="text-xs text-neutral-600 mt-2 font-medium">▲ [보도사진] ${item.caption} (출처: ${item.copyright})</figcaption>
</figure>\n`;
}

