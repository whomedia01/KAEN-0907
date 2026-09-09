export type Severity = 'forbidden' | 'warning';
export type EthicsCategory = 
  | 'exaggeration' // 단정·과장
  | 'sensational'  // 선정·낚시·어뷰징
  | 'discrimination' // 차별·혐오·비하
  | 'advertorial'   // 기사형 광고·상업홍보
  | 'unverified'    // 출처 불명·추측
  | 'ai_hype';      // AI/에듀테크 과장 왜곡

export interface ForbiddenRule {
  id: string;
  pattern: RegExp | string;
  keyword: string;
  severity: Severity;
  category: EthicsCategory;
  categoryName: string;
  reason: string;
  suggestions: string[];
  clause?: string;
}

export interface DetectedIssue {
  id: string;
  keyword: string;
  severity: Severity;
  category: EthicsCategory;
  categoryName: string;
  reason: string;
  suggestions: string[];
  field: 'title' | 'subtitle' | 'summary' | 'content';
  fieldName: string;
  matchedText: string;
  index: number;
  clause?: string;
}

export const FORBIDDEN_RULES: ForbiddenRule[] = [
  // 1. 단정적 허위·과장 표현 (신문윤리강령 제4조 객관성 위반)
  {
    id: 'exag-100-percent',
    pattern: /100%|백프로|완벽히|완벽한/i,
    keyword: '100% / 완벽한',
    severity: 'forbidden',
    category: 'exaggeration',
    categoryName: '단정·과장',
    reason: '절대적 수치나 완벽을 단정하는 표현은 사실 왜곡 및 독자 오인 소지가 높습니다.',
    suggestions: ['높은 수준의', '상당한', '대부분의', '체계적인'],
    clause: '한국인터넷신문윤리강령 제4조(객관성)',
  },
  {
    id: 'exag-unconditional',
    pattern: /무조건|반드시 성공|절대 보장|확실한 수익/i,
    keyword: '무조건 / 절대 보장',
    severity: 'forbidden',
    category: 'exaggeration',
    categoryName: '단정·과장',
    reason: '결과를 단언하는 무조건적 보장 표현은 언론 보도의 객관성과 신뢰성을 훼손합니다.',
    suggestions: ['가능성이 높은', '주목받는', '기대를 모으는', '분석되는'],
    clause: '신문윤리실천요강 제3조(보도기준)',
  },
  {
    id: 'exag-world-first',
    pattern: /세계 최초|국내 유일|독보적 1위|비교 불가/i,
    keyword: '세계 최초 / 국내 유일',
    severity: 'warning',
    category: 'exaggeration',
    categoryName: '단정·과장',
    reason: '공인된 제3자 인증이나 공적 통계 근거 없는 최상급 표현은 보도 윤리에 어긋납니다.',
    suggestions: ['업계 선도적인', '주요 사례로 꼽히는', '관계자는 ~라고 설명했다'],
    clause: '한국인터넷신문윤리강령 제4조(객관성)',
  },
  {
    id: 'exag-miracle',
    pattern: /기적의|만병통치|마법 같은|혁명적 대반전/i,
    keyword: '기적의 / 혁명적 대반전',
    severity: 'forbidden',
    category: 'exaggeration',
    categoryName: '단정·과장',
    reason: '감정적이고 과장된 수식어는 기사의 팩트 전달력을 떨어뜨립니다.',
    suggestions: ['획기적인', '주목할 만한 변화', '새로운 시도'],
    clause: '신문윤리실천요강 제3조(보도기준)',
  },

  // 2. 선정성 및 포털 어뷰징 낚시성 표제어 (한국인터넷신문윤리강령 제10조)
  {
    id: 'clickbait-shock',
    pattern: /충격|경악|발칵|숨멎|멘붕|소름/i,
    keyword: '충격 / 경악 / 발칵',
    severity: 'forbidden',
    category: 'sensational',
    categoryName: '선정·낚시',
    reason: '독자의 감정을 자극하는 선정적 감탄사는 낚시성 어뷰징 금지 규정에 위배됩니다.',
    suggestions: ['주목', '파장 확산', '논란 일어', '이례적 반응'],
    clause: '한국인터넷신문윤리강령 제10조(선정보도 및 낚시성 제목 금지)',
  },
  {
    id: 'clickbait-disaster',
    pattern: /대참사|초토화|눈물바다|경악을 금치 못/i,
    keyword: '대참사 / 초토화',
    severity: 'forbidden',
    category: 'sensational',
    categoryName: '선정·낚시',
    reason: '사안을 지나치게 비극화하거나 자극적으로 묘사하여 객관적 실체 파악을 방해합니다.',
    suggestions: ['심각한 우려', '차질 빚어져', '어려움 가중'],
    clause: '신문윤리실천요강 제10조(표제의 원칙)',
  },
  {
    id: 'clickbait-revealed',
    pattern: /알고보니|알고 보니 충격|이럴 수가|뒤집어졌다/i,
    keyword: '알고보니 / 이럴 수가',
    severity: 'warning',
    category: 'sensational',
    categoryName: '선정·낚시',
    reason: '본문 내용을 은폐하고 호기심만 유발하는 전형적인 포털 클릭 유도형 문구입니다.',
    suggestions: ['확인 결과', '조사 결과', '공식 발표에 따르면'],
    clause: '한국인터넷신문윤리강령 제10조(낚시성 제목 금지)',
  },

  // 3. 차별·편견·혐오·비하 표현 (신문윤리강령 제3조 인권존중)
  {
    id: 'discrim-disabled',
    pattern: /장님|귀머거리|벙어리|외눈박이|불구|정신병자/i,
    keyword: '장애인 비하 용어',
    severity: 'forbidden',
    category: 'discrimination',
    categoryName: '차별·비하',
    reason: '신체적·정신적 장애를 비하하거나 편견을 조장하는 차별적 어휘입니다.',
    suggestions: ['시각장애인', '청각장애인', '언어장애인', '장애인', '정신건강 질환자'],
    clause: '한국신문윤리위원회 인권보호 준칙 제3조',
  },
  {
    id: 'discrim-normal',
    pattern: /정상인/i,
    keyword: '정상인 (장애인 대비)',
    severity: 'warning',
    category: 'discrimination',
    categoryName: '차별·비하',
    reason: '장애인에 대비하여 \'정상인\'을 사용할 경우 장애인을 비정상으로 낙인찍는 차별이 됩니다.',
    suggestions: ['비장애인'],
    clause: '장애인복지법 및 인권보도준칙',
  },
  {
    id: 'discrim-family',
    pattern: /결손가정|편부모/i,
    keyword: '결손가정 / 편부모',
    severity: 'forbidden',
    category: 'discrimination',
    categoryName: '차별·비하',
    reason: '특정 가족 형태에 부정적 낙인을 부여하는 표현입니다.',
    suggestions: ['한부모 가족', '다양한 형태의 가족'],
    clause: '여성가족부 차별 개선 권고안',
  },
  {
    id: 'discrim-hate-slang',
    pattern: /지잡대|틀딱|급식충|한남|김치녀|맘충/i,
    keyword: '학벌·세대·성별 비하 은어',
    severity: 'forbidden',
    category: 'discrimination',
    categoryName: '차별·비하',
    reason: '인터넷 혐오 표현 및 특정 계층 비하 은어는 정규 언론 기사에서 전면 금지됩니다.',
    suggestions: ['지방 소재 대학', '고령층', '청소년/학생', '학부모'],
    clause: '한국인터넷신문윤리강령 제3조(인권존중)',
  },

  // 4. 기사형 광고 및 상업적 판촉 표현 (신문윤리강령 제12조)
  {
    id: 'ad-buy-now',
    pattern: /지금 바로 구매|초특가 할인|선착순 마감|최저가 이벤트/i,
    keyword: '지금 바로 구매 / 초특가 할인',
    severity: 'forbidden',
    category: 'advertorial',
    categoryName: '기사형 광고',
    reason: '노골적인 구매 촉구 및 판촉 문구는 기사와 광고 분리 원칙에 위배됩니다.',
    suggestions: ['프로모션을 진행한다', '할인 행사를 마련했다', '신규 출시했다'],
    clause: '한국인터넷신문윤리강령 제12조(기사와 광고의 구분)',
  },
  {
    id: 'ad-recommend',
    pattern: /강력 추천합니다|놓치면 후회|원조 맛집|돈 버는 비결/i,
    keyword: '강력 추천합니다 / 돈 버는 비결',
    severity: 'forbidden',
    category: 'advertorial',
    categoryName: '기사형 광고',
    reason: '기자의 개인적 호객성 추천 문구는 상업적 기사형 광고로 판정될 위험이 높습니다.',
    suggestions: ['업계의 관심을 받고 있다', '소비자 반응이 긍정적이다'],
    clause: '신문윤리실천요강 제12조(상업성 보도 지양)',
  },

  // 5. 출처 미확인 및 무책임한 추측 (신문윤리강령 제2조 취재보도 원칙)
  {
    id: 'rumor-kadera',
    pattern: /~카더라|라 카더라|소문에 따르면|아니 땐 굴뚝/i,
    keyword: '~카더라 / 소문에 따르면',
    severity: 'forbidden',
    category: 'unverified',
    categoryName: '출처 미확인',
    reason: '출처가 불명확한 풍문을 사실인 것처럼 기사화하는 것은 보도 신뢰성을 심각하게 훼손합니다.',
    suggestions: ['공식 확인을 거쳐야 할 대목이다', '관계자는 ~라고 설명했다'],
    clause: '한국인터넷신문윤리강령 제2조(취재 및 보도 원칙)',
  },
  {
    id: 'rumor-anonymous',
    pattern: /측근에 따르면|정통한 소식통에 따르면/i,
    keyword: '측근에 따르면 (익명 취재원 남발)',
    severity: 'warning',
    category: 'unverified',
    categoryName: '출처 미확인',
    reason: '익명 취재원의 모호한 인용은 최소화하고 공식 확인된 기관 및 실명 취재원 인용이 권장됩니다.',
    suggestions: ['공식 대변인은', '담당 부서 관계자는', '해당 기관에 따르면'],
    clause: '신문윤리실천요강 제2조(익명보도의 제한)',
  },

  // 6. AI 및 에듀테크 특화 과장·왜곡 표현 (AI 교육 전문지 정체성 보호)
  {
    id: 'ai-hype-replace',
    pattern: /인간 교사 완전 무용론|교사 전면 퇴출|AI가 인간 완벽 대체/i,
    keyword: '교사 전면 대체 단언',
    severity: 'forbidden',
    category: 'ai_hype',
    categoryName: 'AI 과장 왜곡',
    reason: '기술 만능주의적 극단론이나 검증되지 않은 교사 대체 주장은 교육 현장의 혼란을 초래합니다.',
    suggestions: ['교사의 역할을 보조하는 AI', '맞춤형 학습 지원 도구로서의 AI 활용'],
    clause: '한국AI교육신문 보도 가이드라인',
  },
  {
    id: 'ai-hype-omnipotent',
    pattern: /완벽한 AI 과외|성적 수직 상승 보장|공부 안 해도 1등급/i,
    keyword: '성적 보장 AI 과외',
    severity: 'forbidden',
    category: 'ai_hype',
    categoryName: 'AI 과장 왜곡',
    reason: '학습 효과를 과장하거나 결과를 담보하는 사교육형 판촉성 허위 주장은 금지됩니다.',
    suggestions: ['자기주도 학습 지원', '개인별 취약점 보완 기능'],
    clause: '공정거래위원회 부당 표시·광고 심사지침',
  }
];

/**
 * 실시간 금지어 및 주의 표현 스캔 함수 (클라이언트/서버 공용)
 */
export function scanArticleForForbiddenWords(
  title: string,
  subtitle: string,
  summary: string,
  content: string
): DetectedIssue[] {
  const issues: DetectedIssue[] = [];
  const fields: Array<{ field: 'title' | 'subtitle' | 'summary' | 'content'; name: string; text: string }> = [
    { field: 'title', name: '기사 제목', text: title || '' },
    { field: 'subtitle', name: '부제', text: subtitle || '' },
    { field: 'summary', name: '전문 / 요약', text: summary || '' },
    { field: 'content', name: '기사 본문', text: content || '' }
  ];

  for (const field of fields) {
    if (!field.text) continue;

    for (const rule of FORBIDDEN_RULES) {
      if (typeof rule.pattern === 'string') {
        const idx = field.text.indexOf(rule.pattern);
        if (idx !== -1) {
          const start = Math.max(0, idx - 15);
          const end = Math.min(field.text.length, idx + rule.pattern.length + 15);
          const matchedText = field.text.slice(start, end);

          issues.push({
            id: `${field.field}-${rule.id}-${idx}`,
            keyword: rule.keyword,
            severity: rule.severity,
            category: rule.category,
            categoryName: rule.categoryName,
            reason: rule.reason,
            suggestions: rule.suggestions,
            field: field.field,
            fieldName: field.name,
            matchedText: `…${matchedText}…`,
            index: idx,
            clause: rule.clause
          });
        }
      } else {
        const regex = new RegExp(rule.pattern.source, rule.pattern.flags.includes('g') ? rule.pattern.flags : rule.pattern.flags + 'g');
        let match: RegExpExecArray | null;
        while ((match = regex.exec(field.text)) !== null) {
          const idx = match.index;
          const matchStr = match[0];
          const start = Math.max(0, idx - 15);
          const end = Math.min(field.text.length, idx + matchStr.length + 15);
          const matchedText = field.text.slice(start, end);

          issues.push({
            id: `${field.field}-${rule.id}-${idx}`,
            keyword: matchStr,
            severity: rule.severity,
            category: rule.category,
            categoryName: rule.categoryName,
            reason: rule.reason,
            suggestions: rule.suggestions,
            field: field.field,
            fieldName: field.name,
            matchedText: `…${matchedText}…`,
            index: idx,
            clause: rule.clause
          });

          // 무한루프 방지
          if (matchStr.length === 0) {
            regex.lastIndex++;
          }
        }
      }
    }
  }

  return issues;
}
