/**
 * 한국AI교육신문 - AI 언론사 표준 인포그래픽 & 시각자료 SVG 생성기
 * 고해상도(1200x675, 16:9) 벡터 인포그래픽 카드를 자체 렌더링하여 Data URI로 변환합니다.
 */

export interface SvgChecklistItem {
  num: string;
  title: string;
  desc: string;
}

export interface SvgStatItem {
  label: string;
  value: number; // 0 ~ 100
  subtext: string;
}

export interface SvgRoadmapItem {
  step: string;
  title: string;
  desc: string;
}

export interface SvgComparisonRow {
  aspect: string;
  traditional: string;
  aiPowered: string;
}

// 1. 체크리스트 / 핵심 기준 인포그래픽
export function generateChecklistSvg({
  category = '에듀테크·AI',
  title = 'AI 교육 현장 안착을 위한 5대 핵심 점검 기준',
  subtitle = '학습자 권익 보호와 실무 검증 중심의 체계적 평가 가이드',
  items = [
    { num: '01', title: '학습 목적 일치성', desc: '기초 입문 vs 실무 심화 과정 요건 정밀 대조' },
    { num: '02', title: '학사 규정 투명성', desc: '환불 규정 및 결석 시 보충 학습 체계 완비' },
    { num: '03', title: '양방향 피드백', desc: '전담 튜터 및 교강사의 1:1 실시간 밀착 질의응답' },
    { num: '04', title: '사후 관리 인프라', desc: '수료 후 자격 취득 및 포트폴리오 연계 지원' },
    { num: '05', title: '공인 인증 검증', desc: '공공기관 인가 및 공식 위탁 교육 여부 확인' }
  ],
  source = '한국AI교육신문 취재팀 종합분석'
}: {
  category?: string;
  title: string;
  subtitle?: string;
  items: SvgChecklistItem[];
  source?: string;
}): string {
  const displayItems = items.slice(0, 5);
  const cardHeight = displayItems.length <= 4 ? 80 : 64;
  const startY = 190;
  const gapY = displayItems.length <= 4 ? 96 : 78;

  const itemsSvg = displayItems.map((item, idx) => {
    const y = startY + idx * gapY;
    const accentColors = ['#2563eb', '#0284c7', '#0d9488', '#10b981', '#6366f1'];
    const accentColor = accentColors[idx % accentColors.length];

    return `
      <g transform="translate(80, ${y})">
        <!-- Card Background -->
        <rect width="1040" height="${cardHeight}" rx="12" fill="#1e293b" stroke="#334155" stroke-width="1.5" />
        <rect x="0" y="0" width="6" height="${cardHeight}" rx="3" fill="${accentColor}" />
        
        <!-- Number Badge -->
        <rect x="24" y="${cardHeight / 2 - 18}" width="40" height="36" rx="8" fill="${accentColor}" opacity="0.15" />
        <text x="44" y="${cardHeight / 2 + 6}" font-family="-apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif" font-size="16" font-weight="900" fill="${accentColor}" text-anchor="middle">${item.num}</text>
        
        <!-- Item Title -->
        <text x="80" y="${cardHeight / 2 + 5}" font-family="-apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif" font-size="18" font-weight="800" fill="#f8fafc">${escapeXml(item.title)}</text>
        
        <!-- Divider -->
        <line x1="280" y1="${cardHeight / 2 - 12}" x2="280" y2="${cardHeight / 2 + 12}" stroke="#475569" stroke-width="1" />
        
        <!-- Item Description -->
        <text x="300" y="${cardHeight / 2 + 5}" font-family="-apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif" font-size="14.5" font-weight="500" fill="#94a3b8">${escapeXml(item.desc)}</text>
        
        <!-- Checkmark Icon -->
        <circle cx="1000" cy="${cardHeight / 2}" r="14" fill="#0f172a" stroke="${accentColor}" stroke-width="2" />
        <path d="M994 ${cardHeight / 2} l4 4 l8 -8" fill="none" stroke="${accentColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
      </g>
    `;
  }).join('');

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675">
      <defs>
        <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#090d16" />
          <stop offset="100%" stop-color="#0f172a" />
        </linearGradient>
        <linearGradient id="titleGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#38bdf8" />
          <stop offset="100%" stop-color="#818cf8" />
        </linearGradient>
      </defs>

      <!-- Background Canvas -->
      <rect width="1200" height="675" fill="url(#bgGrad)" />

      <!-- Subtle Grid Dots Pattern -->
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1" fill="#334155" opacity="0.3" />
      </pattern>
      <rect width="1200" height="675" fill="url(#grid)" />

      <!-- Header Border Accent -->
      <rect x="80" y="50" width="1040" height="2" fill="#1e293b" />
      <rect x="80" y="50" width="120" height="2" fill="#38bdf8" />

      <!-- Press Logo & Category Pill -->
      <g transform="translate(80, 68)">
        <rect width="150" height="26" rx="13" fill="#1e293b" stroke="#38bdf8" stroke-width="1" />
        <circle cx="16" cy="13" r="4" fill="#38bdf8" />
        <text x="28" y="18" font-family="-apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif" font-size="11.5" font-weight="800" fill="#38bdf8">한국AI교육신문</text>

        <rect x="160" y="0" width="110" height="26" rx="13" fill="#0f172a" stroke="#475569" stroke-width="1" />
        <text x="215" y="17" font-family="-apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif" font-size="11" font-weight="700" fill="#cbd5e1" text-anchor="middle">[${escapeXml(category)}]</text>
      </g>

      <!-- Main Headline -->
      <text x="80" y="132" font-family="-apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif" font-size="28" font-weight="900" fill="#ffffff" letter-spacing="-0.5">${escapeXml(title)}</text>

      <!-- Subtitle -->
      ${subtitle ? `<text x="80" y="162" font-family="-apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif" font-size="15" font-weight="500" fill="#94a3b8">${escapeXml(subtitle)}</text>` : ''}

      <!-- Items List -->
      ${itemsSvg}

      <!-- Footer Source / Attribution Bar -->
      <line x1="80" y1="615" x2="1120" y2="615" stroke="#1e293b" stroke-width="1.5" />
      <text x="80" y="640" font-family="-apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif" font-size="11.5" font-weight="600" fill="#64748b">자료: ${escapeXml(source)}</text>
      <text x="1120" y="640" font-family="-apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif" font-size="11.5" font-weight="700" fill="#64748b" text-anchor="end">[그래픽 = 한국AI교육신문 AI비주얼팀]</text>
    </svg>
  `.trim();
}

// 2. 통계 / 지표 비교 인포그래픽
export function generateStatsSvg({
  category = '에듀테크·AI',
  title = 'AI 교육 도입 전후 핵심 교육 성과 지표',
  subtitle = '현장 교강사 및 학습자 대상 정량 실태 조사 결과',
  stats = [
    { label: '실무 프로젝트(PBL) 문제 해결력 향상', value: 88, subtext: '기존 42% 대비 2.1배 상승' },
    { label: 'AI 보조교사 1:1 맞춤 피드백 만족도', value: 92, subtext: '응답자 10명 중 9명 이상 긍정' },
    { label: '학습 과정 완주 및 자격 취득 성공률', value: 84, subtext: '전년 동기 대비 28%p 개선' },
    { label: '교강사 행정 및 교수설계 업무 경감 체감', value: 76, subtext: '주당 평균 6.4시간 절감' }
  ],
  source = '한국AI교육신문·에듀테크협의회 공동 설문조사'
}: {
  category?: string;
  title: string;
  subtitle?: string;
  stats: SvgStatItem[];
  source?: string;
}): string {
  const displayStats = stats.slice(0, 4);

  const statsSvg = displayStats.map((stat, idx) => {
    const y = 200 + idx * 95;
    const barWidth = Math.round((stat.value / 100) * 600);
    const accentColors = ['#38bdf8', '#34d399', '#818cf8', '#f472b6'];
    const color = accentColors[idx % accentColors.length];

    return `
      <g transform="translate(80, ${y})">
        <!-- Label and Subtext -->
        <text x="0" y="16" font-family="-apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif" font-size="16.5" font-weight="800" fill="#f1f5f9">${escapeXml(stat.label)}</text>
        <text x="0" y="38" font-family="-apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif" font-size="13" font-weight="500" fill="#94a3b8">${escapeXml(stat.subtext)}</text>

        <!-- Value Number -->
        <text x="420" y="32" font-family="-apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif" font-size="28" font-weight="900" fill="${color}">${stat.value}<tspan font-size="18" font-weight="700">%</tspan></text>

        <!-- Progress Track -->
        <rect x="490" y="14" width="550" height="20" rx="10" fill="#1e293b" />
        <rect x="490" y="14" width="${Math.max(10, Math.round((stat.value / 100) * 550))}" height="20" rx="10" fill="${color}" />
      </g>
    `;
  }).join('');

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675">
      <defs>
        <linearGradient id="statBgGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#0a0f1d" />
          <stop offset="100%" stop-color="#111827" />
        </linearGradient>
      </defs>

      <rect width="1200" height="675" fill="url(#statBgGrad)" />

      <!-- Grid lines -->
      <line x1="80" y1="50" x2="1120" y2="50" stroke="#1f2937" stroke-width="1.5" />
      <rect x="80" y="50" width="140" height="2" fill="#34d399" />

      <!-- Press Logo -->
      <g transform="translate(80, 68)">
        <rect width="150" height="26" rx="13" fill="#1f2937" stroke="#34d399" stroke-width="1" />
        <circle cx="16" cy="13" r="4" fill="#34d399" />
        <text x="28" y="18" font-family="-apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif" font-size="11.5" font-weight="800" fill="#34d399">한국AI교육신문</text>

        <rect x="160" y="0" width="110" height="26" rx="13" fill="#111827" stroke="#374151" stroke-width="1" />
        <text x="215" y="17" font-family="-apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif" font-size="11" font-weight="700" fill="#cbd5e1" text-anchor="middle">[${escapeXml(category)}]</text>
      </g>

      <text x="80" y="132" font-family="-apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif" font-size="28" font-weight="900" fill="#ffffff" letter-spacing="-0.5">${escapeXml(title)}</text>
      ${subtitle ? `<text x="80" y="162" font-family="-apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif" font-size="15" font-weight="500" fill="#9ca3af">${escapeXml(subtitle)}</text>` : ''}

      ${statsSvg}

      <line x1="80" y1="615" x2="1120" y2="615" stroke="#1f2937" stroke-width="1.5" />
      <text x="80" y="640" font-family="-apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif" font-size="11.5" font-weight="600" fill="#6b7280">조사: ${escapeXml(source)}</text>
      <text x="1120" y="640" font-family="-apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif" font-size="11.5" font-weight="700" fill="#6b7280" text-anchor="end">[그래픽 = 한국AI교육신문 데이터팀]</text>
    </svg>
  `.trim();
}

// 3. 단계별 로드맵 인포그래픽
export function generateRoadmapSvg({
  category = '에듀테크·AI',
  title = 'AI 디지털 교육 역량 강화 3단계 추진 로드맵',
  subtitle = '기초 리터러시부터 실무 프로젝트 완수까지 체계적 이수 체계',
  steps = [
    { step: 'STEP 01', title: '진단 및 기초 문해력', desc: '개인별 AI 역량 수준 진단 및 생성형 도구 윤리·프롬프트 기본기 습득' },
    { step: 'STEP 02', title: '실무 PBL 융합 실습', desc: '현업 문제 해결 중심의 데이터 분석 및 AI 에이전트 실전 개발' },
    { step: 'STEP 03', title: '공인 인증 및 성과 검증', desc: '국가공인 디지털 자격 취득 및 산학협력 포트폴리오 산출물 완성' }
  ],
  source = '교육부·한국AI교육신문 종합 가이드라인'
}: {
  category?: string;
  title: string;
  subtitle?: string;
  steps: SvgRoadmapItem[];
  source?: string;
}): string {
  const displaySteps = steps.slice(0, 3);
  const cardWidth = 320;
  const cardHeight = 360;
  const startX = 80;
  const gapX = 360;

  const stepsSvg = displaySteps.map((s, idx) => {
    const x = startX + idx * gapX;
    const colors = ['#2563eb', '#0d9488', '#7c3aed'];
    const accentColor = colors[idx % colors.length];

    return `
      <g transform="translate(${x}, 200)">
        <rect width="${cardWidth}" height="${cardHeight}" rx="16" fill="#1e293b" stroke="#334155" stroke-width="1.5" />
        <rect x="0" y="0" width="${cardWidth}" height="8" rx="4" fill="${accentColor}" />

        <!-- Step Pill -->
        <rect x="24" y="28" width="90" height="28" rx="14" fill="${accentColor}" opacity="0.15" />
        <text x="69" y="47" font-family="-apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif" font-size="12" font-weight="900" fill="${accentColor}" text-anchor="middle">${s.step}</text>

        <!-- Title -->
        <text x="24" y="98" font-family="-apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif" font-size="20" font-weight="900" fill="#f8fafc">${escapeXml(s.title)}</text>
        <line x1="24" y1="120" x2="296" y2="120" stroke="#334155" stroke-width="1" />

        <!-- Description with multiline wrapping simulation -->
        <foreignObject x="24" y="140" width="272" height="180">
          <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: -apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif; font-size: 14.5px; line-height: 1.7; color: #94a3b8; font-weight: 500;">
            ${escapeXml(s.desc)}
          </div>
        </foreignObject>

        <!-- Footer Icon/Number -->
        <circle cx="280" cy="320" r="16" fill="#0f172a" stroke="${accentColor}" stroke-width="1.5" />
        <text x="280" y="325" font-family="-apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif" font-size="12" font-weight="900" fill="${accentColor}" text-anchor="middle">${idx + 1}</text>
      </g>
      ${idx < displaySteps.length - 1 ? `
        <!-- Arrow Connector -->
        <g transform="translate(${x + cardWidth + 8}, 360)">
          <line x1="0" y1="0" x2="24" y2="0" stroke="#475569" stroke-width="2" stroke-dasharray="4 3" />
          <path d="M20 -5 l6 5 l-6 5" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </g>
      ` : ''}
    `;
  }).join('');

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675">
      <defs>
        <linearGradient id="roadmapBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#0a0e1a" />
          <stop offset="100%" stop-color="#131b2e" />
        </linearGradient>
      </defs>

      <rect width="1200" height="675" fill="url(#roadmapBg)" />

      <line x1="80" y1="50" x2="1120" y2="50" stroke="#1e293b" stroke-width="1.5" />
      <rect x="80" y="50" width="140" height="2" fill="#7c3aed" />

      <g transform="translate(80, 68)">
        <rect width="150" height="26" rx="13" fill="#1e293b" stroke="#a78bfa" stroke-width="1" />
        <circle cx="16" cy="13" r="4" fill="#a78bfa" />
        <text x="28" y="18" font-family="-apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif" font-size="11.5" font-weight="800" fill="#a78bfa">한국AI교육신문</text>

        <rect x="160" y="0" width="110" height="26" rx="13" fill="#0f172a" stroke="#475569" stroke-width="1" />
        <text x="215" y="17" font-family="-apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif" font-size="11" font-weight="700" fill="#cbd5e1" text-anchor="middle">[${escapeXml(category)}]</text>
      </g>

      <text x="80" y="132" font-family="-apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif" font-size="28" font-weight="900" fill="#ffffff" letter-spacing="-0.5">${escapeXml(title)}</text>
      ${subtitle ? `<text x="80" y="162" font-family="-apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif" font-size="15" font-weight="500" fill="#94a3b8">${escapeXml(subtitle)}</text>` : ''}

      ${stepsSvg}

      <line x1="80" y1="615" x2="1120" y2="615" stroke="#1e293b" stroke-width="1.5" />
      <text x="80" y="640" font-family="-apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif" font-size="11.5" font-weight="600" fill="#64748b">출처: ${escapeXml(source)}</text>
      <text x="1120" y="640" font-family="-apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif" font-size="11.5" font-weight="700" fill="#64748b" text-anchor="end">[그래픽 = 한국AI교육신문 AI비주얼팀]</text>
    </svg>
  `.trim();
}

/**
 * SVG 문자열을 브라우저에서 즉시 렌더링 가능한 data URI로 변환
 */
export function svgToDataUri(svgString: string): string {
  // UTF-8 인코딩
  const encoded = encodeURIComponent(svgString)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');
  return `data:image/svg+xml;charset=utf-8,${encoded}`;
}

function escapeXml(unsafe?: string): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
