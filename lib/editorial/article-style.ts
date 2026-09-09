export type EditorialSection = {
  heading: string;
  body: string[];
  toneHint?: string;
};

const EXPLICIT_SECTION_RE = /^\s*(?:#{2,3}\s*)?(?:\[)?(본문|기사 본문|리드|핵심 요약|핵심 쟁점|배경|현장 맥락|현장 반응|독자 영향|소비자 영향|업계 영향|전망|정리|전망과 과제|브랜드 배경|운영 철학|독자 체크포인트|발표 내용|사업 배경|향후 계획|편집자 주|문답|인터뷰|보도자료)(?:\])?\s*$/;

const MARKDOWN_HEADING_RE = /^\s*#{2,3}\s+(.+?)\s*$/;

const ARTICLE_CONNECTORS = ['다만', '특히', '이에', '한편', '따라서', '반면', '업계', '현장', '관계자', '소비자', '보호자', '학부모', '이용자', '사업자'];

const CATEGORY_CONTEXT: Record<string, { subject: string; reader: string; field: string; closing: string }> = {
  '생활경제': {
    subject: '생활비 부담과 소비 방식의 변화',
    reader: '가계와 소상공인',
    field: '외식비, 생필품, 교육비, 생활서비스 지출이 함께 움직이는 생활 현장',
    closing: '가격 부담을 줄이는 대책과 함께 소비자가 신뢰할 수 있는 정보 제공이 중요하다는 지적이 나온다.'
  },
  '지역상권': {
    subject: '지역 상권의 고객 접점 변화',
    reader: '지역 사업자와 동네 소비자',
    field: '골목상권, 예약제 매장, 생활서비스 업종이 맞닿아 있는 현장',
    closing: '단기 이벤트보다 반복 방문을 만드는 운영 기준과 지역 내 신뢰 관리가 과제로 꼽힌다.'
  },
  '교육·학원': {
    subject: '학부모와 학습자의 선택 기준 변화',
    reader: '학부모와 교육기관',
    field: '학원가, 직무교육, AI 활용 교육 수요가 동시에 확대되는 교육 현장',
    closing: '성과를 단정적으로 내세우기보다 수업 과정과 관리 체계를 투명하게 설명하는 방식이 요구된다.'
  },
  '시니어·요양': {
    subject: '초고령사회 진입에 따른 돌봄 수요 변화',
    reader: '보호자와 시니어 서비스 운영자',
    field: '방문요양, 주야간보호, 실버타운, 재가돌봄 서비스가 연결된 돌봄 현장',
    closing: '서비스 품질과 비용, 보호자 소통 방식에 대한 기준을 더 명확히 제시해야 한다는 목소리가 커지고 있다.'
  },
  '건강·뷰티': {
    subject: '웰니스와 자기관리 소비의 확산',
    reader: '소비자와 건강·뷰티 업종 운영자',
    field: '피부관리, 체형관리, 건강관리, 웰니스 서비스가 만나는 생활 서비스 현장',
    closing: '효과를 과장하기보다 상담 기준, 위생 관리, 사후 안내를 구체적으로 설명하는 것이 중요하다는 분석이다.'
  },
  '창업·프랜차이즈': {
    subject: '소자본 창업과 1인 운영 모델의 변화',
    reader: '예비창업자와 소상공인',
    field: '무인 매장, 소규모 프랜차이즈, 온라인 판매, 지역 기반 서비스가 경쟁하는 창업 현장',
    closing: '초기 비용보다 운영 지속성, 고객 관리, 차별화된 콘텐츠 전략을 함께 검토해야 한다는 지적이다.'
  },
  '브랜드 인터뷰': {
    subject: '지역 브랜드의 운영 철학과 현장성',
    reader: '소비자와 지역 브랜드 운영자',
    field: '지역 고객과 직접 만나는 생활서비스·교육·건강·창업 현장',
    closing: '브랜드의 신뢰는 화려한 홍보 문구가 아니라 운영자가 반복해온 기준과 고객 응대의 축적에서 드러난다.'
  },
  '오피니언': {
    subject: '생활경제 이슈에 대한 해석과 전망',
    reader: '독자와 현장 관계자',
    field: '정책, 소비, 지역상권, 고령화, 교육 변화가 맞물리는 생활경제 현장',
    closing: '단기적 현상만 볼 것이 아니라 독자의 선택과 현장 운영에 어떤 변화를 남길지 살펴볼 필요가 있다.'
  },
  '보도자료': {
    subject: '기관·기업 발표 자료의 생활경제적 의미',
    reader: '정책 수요자와 일반 독자',
    field: '공공 지원, 기업 발표, 지역 행사, 민생 정책이 실제 현장에 전달되는 과정',
    closing: '발표 내용의 취지와 함께 실제 신청 조건, 적용 대상, 후속 일정을 확인하는 절차가 필요하다.'
  }
};

export function splitParagraphs(content: string | null | undefined) {
  return String(content ?? '')
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export function hasExplicitEditorialSections(content: string | null | undefined) {
  return String(content ?? '')
    .split('\n')
    .some((line) => EXPLICIT_SECTION_RE.test(line.trim()));
}

function normalizeHeading(raw: string) {
  const line = raw.trim();
  const internalMatch = line.match(EXPLICIT_SECTION_RE);
  if (internalMatch) return internalMatch[1] ?? null;

  const markdownMatch = line.match(MARKDOWN_HEADING_RE);
  if (markdownMatch) return markdownMatch[1] ?? null;

  return null;
}

function pickCategoryContext(categoryName?: string | null) {
  return CATEGORY_CONTEXT[categoryName ?? ''] ?? CATEGORY_CONTEXT['생활경제'];
}

function stripInternalLabelPrefix(paragraph: string) {
  return paragraph
    .replace(/^\s*(?:#{2,3}\s*)?(?:\[)?(?:본문|기사 본문|리드|핵심 요약|핵심 쟁점|배경|현장 맥락|현장 반응|독자 영향|소비자 영향|업계 영향|전망|정리|전망과 과제)(?:\])?\s*/g, '')
    .trim();
}

function mergeShortParagraphs(paragraphs: string[]) {
  const cleaned = paragraphs.map(stripInternalLabelPrefix).filter(Boolean);
  if (!cleaned.length) return [];

  const merged: string[] = [];
  let buffer = '';

  cleaned.forEach((paragraph) => {
    if (!buffer) {
      buffer = paragraph;
      return;
    }

    if (buffer.length < 170) {
      buffer = `${buffer} ${paragraph}`;
      return;
    }

    merged.push(buffer);
    buffer = paragraph;
  });

  if (buffer) merged.push(buffer);
  return merged;
}

function shapeLongFormArticle(input: {
  title?: string | null;
  summary?: string | null;
  paragraphs: string[];
  categoryName?: string | null;
  articleType?: string | null;
}) {
  const context = pickCategoryContext(input.categoryName);
  const title = input.title?.trim() || '생활경제 현장의 변화';
  const original = mergeShortParagraphs(input.paragraphs);
  const lead = input.summary?.trim() || original[0] || `${context.subject}가 생활경제 현장의 주요 변수로 떠오르고 있다.`;

  const sourceParagraphs = original.length ? original : [lead];
  const body = [
    `${lead} ${title}와 관련한 흐름은 특정 업종의 일시적 현상이라기보다 ${context.field}에서 함께 확인되는 변화로 풀이된다.`,
    sourceParagraphs[0] ?? lead,
    `최근 현장에서는 ${context.reader} 모두 이전보다 더 구체적인 정보를 요구하는 분위기가 나타나고 있다. 가격이나 위치처럼 눈에 보이는 조건뿐 아니라 서비스가 제공되는 절차, 책임 범위, 사후 안내 방식까지 비교하는 사례가 늘고 있다는 설명이다.`,
    sourceParagraphs[1] ?? `특히 ${context.subject}는 온라인 검색과 지역 기반 평판이 결합되면서 더 빠르게 확산되고 있다. 이용자는 여러 채널에서 정보를 확인한 뒤 실제 방문이나 상담 여부를 결정하고, 사업자는 이 과정에서 자신의 기준을 얼마나 명확하게 설명하는지가 중요해졌다.`,
    `업계에서는 이 같은 변화가 단순한 홍보 방식의 문제가 아니라고 본다. 생활경제 영역의 서비스는 한 번의 구매로 끝나기보다 상담, 이용, 재방문, 소개로 이어지는 경우가 많아 초기 정보 제공의 신뢰도가 전체 고객 경험에 영향을 미친다는 분석이다.`,
    sourceParagraphs[2] ?? `관계자들은 현장 운영자가 제공하는 정보가 지나치게 짧거나 광고 문구에 머물 경우 오히려 소비자의 판단을 어렵게 만들 수 있다고 지적한다. 이용자가 실제로 확인하려는 것은 과장된 장점보다 서비스 범위, 이용 조건, 비용 구조, 운영자의 대응 기준이다.`,
    `다만 모든 업체가 같은 방식으로 대응하기는 어렵다. 지역, 업종, 고객층에 따라 요구되는 정보의 우선순위가 다르고, 작은 사업장일수록 콘텐츠 제작과 고객 응대를 동시에 수행해야 하는 부담도 적지 않다. 따라서 처음부터 거창한 캠페인을 설계하기보다 기본 정보와 자주 묻는 질문을 정리하는 작업부터 시작할 필요가 있다.`,
    `전문가들은 앞으로 ${context.reader} 사이에서 신뢰를 확인하는 방식이 더 세분화될 것으로 보고 있다. 리뷰나 가격 비교만으로는 충분하지 않고, 운영 철학과 실제 절차를 확인하려는 수요가 커지면서 기사형 콘텐츠와 인터뷰형 설명 자료의 역할도 확대될 가능성이 있다.`,
    context.closing
  ];

  return body.filter(Boolean);
}

export function buildEditorialSections(input: {
  title?: string | null;
  content: string | null | undefined;
  summary?: string | null;
  articleType?: string | null;
  categoryName?: string | null;
}): EditorialSection[] {
  const paragraphs = splitParagraphs(input.content);
  if (!paragraphs.length && input.summary) {
    return [{ heading: '리드', body: shapeLongFormArticle({ title: input.title, summary: input.summary, paragraphs: [], categoryName: input.categoryName, articleType: input.articleType }) }];
  }

  const hasAnyHeading = String(input.content ?? '')
    .split('\n')
    .some((line) => normalizeHeading(line));

  if (hasAnyHeading) {
    const sections: EditorialSection[] = [];
    let current: EditorialSection | null = null;

    String(input.content ?? '')
      .split('\n')
      .forEach((line) => {
        const heading = normalizeHeading(line);
        if (heading) {
          current = { heading, body: [] };
          sections.push(current);
          return;
        }

        const text = line.trim();
        if (!text) return;
        if (!current) {
          current = { heading: '리드', body: [] };
          sections.push(current);
        }
        current.body.push(stripInternalLabelPrefix(text));
      });

    const cleanedSections = sections
      .map((section) => ({ ...section, body: section.body.map(stripInternalLabelPrefix).filter(Boolean) }))
      .filter((section) => section.body.length);

    const totalLength = cleanedSections.flatMap((section) => section.body).join('\n\n').length;
    if (totalLength < 900) {
      return [{ heading: '리드', body: shapeLongFormArticle({ title: input.title, summary: input.summary, paragraphs: cleanedSections.flatMap((section) => section.body), categoryName: input.categoryName, articleType: input.articleType }) }];
    }

    return cleanedSections;
  }

  const source = input.summary ? [input.summary, ...paragraphs] : paragraphs;
  const shaped = source.join('\n\n').length < 900
    ? shapeLongFormArticle({ title: input.title, summary: input.summary, paragraphs, categoryName: input.categoryName, articleType: input.articleType })
    : mergeShortParagraphs(source);

  return [{ heading: '리드', body: shaped }];
}

export function analyzeArticleStructure(input: {
  title: string;
  summary?: string | null;
  content: string;
  articleType?: string | null;
}) {
  const paragraphs = splitParagraphs(input.content);
  const connectorCount = ARTICLE_CONNECTORS.filter((word) => input.content.includes(word)).length;
  const warnings: string[] = [];

  if (!input.summary || input.summary.trim().length < 70) {
    warnings.push('요약문이 짧습니다. 기사 핵심, 배경, 독자 영향을 2문장 안팎으로 보강하세요.');
  }

  if (paragraphs.length < 8) {
    warnings.push('본문 문단 수가 부족합니다. 캡처 샘플처럼 도입, 배경, 쟁점, 현장 맥락, 영향, 반론/제약, 전망, 마무리까지 8문단 이상으로 작성하세요.');
  }

  if (input.content.trim().length < 1500) {
    warnings.push('본문 분량이 짧습니다. 인터넷신문 기사로 보이려면 최소 1,500자 이상을 권장합니다.');
  }

  if (connectorCount < 4) {
    warnings.push('문장 간 연결어와 맥락 전환이 부족합니다. 다만/특히/이에/한편/반면/따라서 등으로 흐름을 보강하세요.');
  }

  if (!/(왜|배경|이유|흐름|변화|영향|과제|전망|기준|확인|관계자|업계|소비자|현장|다만|한편)/.test(input.content)) {
    warnings.push('사실 나열에 그칠 수 있습니다. 변화의 배경, 독자 영향, 향후 과제를 한 단락 이상 넣으세요.');
  }

  if (/\[(리드|배경|현장 맥락|독자 영향|전망과 과제|정리)\]/.test(input.content)) {
    warnings.push('본문에 관리자용 구조 라벨이 포함되어 있습니다. 공개 기사에서는 자연스러운 문단형 보도문으로 정리하세요.');
  }

  return {
    ok: warnings.length === 0,
    paragraphCount: paragraphs.length,
    hasSections: hasExplicitEditorialSections(input.content),
    connectorCount,
    warnings
  };
}

export function getArticleWritingTemplate(articleType = 'normal') {
  if (articleType === 'brand_interview') {
    return `지역 브랜드가 주목받는 배경을 첫 문단에서 설명한다. 광고 문구가 아니라 해당 업종의 변화, 고객 수요, 지역 현장의 맥락 속에서 이 업체를 살펴볼 이유를 제시한다. 첫 문단은 3문장 안팎으로 쓰고, 독자가 기사의 방향을 바로 이해할 수 있어야 한다.\n\n이어 업체의 설립 배경과 운영자가 중요하게 보는 기준을 설명한다. 대표자의 발언을 사용할 경우 한두 문장만 직접 인용하고, 나머지는 기자가 객관적인 기사체로 풀어 쓴다.\n\n중간부에서는 실제 고객이 확인할 만한 절차, 상담 방식, 서비스 범위, 현장 운영 기준을 구체적으로 다룬다. 단순히 친절하다거나 전문적이라고 쓰지 말고, 어떤 방식으로 운영되는지를 설명한다.\n\n마지막 부분에서는 해당 업종의 변화와 독자가 업체를 선택할 때 확인할 기준을 정리한다. 제휴 콘텐츠라면 과장된 추천이 아니라 정보 제공형 기사로 마무리한다.`;
  }

  if (articleType === 'press_release') {
    return `발표 주체와 핵심 내용을 첫 문단에서 육하원칙에 맞춰 정리한다. 제공 자료를 그대로 옮기지 말고, 독자가 알아야 할 일정, 대상, 배경을 기자 문장으로 재구성한다.\n\n두 번째와 세 번째 문단에서는 발표가 나온 배경과 적용 대상을 설명한다. 정책이나 지원 사업이라면 신청 조건, 대상자, 지역 또는 업종별 영향을 구체적으로 다룬다.\n\n중간부에서는 기대 효과와 현장에 미칠 영향을 설명하되, 발표 기관의 홍보성 표현은 줄이고 확인 가능한 사실 중심으로 정리한다.\n\n마지막 문단에서는 후속 일정, 유의 사항, 독자가 추가로 확인해야 할 지점을 담담하게 마무리한다.`;
  }

  return `첫 문단은 기사 핵심을 바로 제시한다. 무엇이 달라졌고, 왜 독자가 알아야 하는지 3문장 안팎으로 압축한다. 캡처 샘플처럼 독자가 첫 문단만 읽어도 사건이나 이슈의 방향을 이해할 수 있어야 한다.\n\n두 번째 문단부터는 배경을 차분하게 설명한다. 정책, 시장 흐름, 소비자 변화, 지역 상권의 반응처럼 이 사안이 나오게 된 이유를 근거 중심으로 풀어 쓴다.\n\n중간부는 4~6개 문단으로 구성한다. 각 문단은 하나의 쟁점만 다루고, 다만/특히/한편/이에/반면 같은 연결어로 문맥을 이어 간다. 단문만 나열하지 말고 사실, 해석, 현장 의미가 순서대로 드러나야 한다.\n\n후반부에는 독자에게 미치는 영향을 설명한다. 소비자, 보호자, 학부모, 소상공인, 예비창업자 등 독자군을 의식해 비용, 절차, 선택 기준, 유의점을 정리한다.\n\n마지막 문단은 결론이 아니라 전망과 과제로 마무리한다. 단정적 예측이나 광고성 표현은 피하고, 앞으로 확인할 점과 현장에서 필요한 대응을 담담한 보도체로 정리한다.`;
}
