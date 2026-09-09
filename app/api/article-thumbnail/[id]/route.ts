const categoryThemes: Record<string, { label: string; from: string; to: string; accent: string; mark: string }> = {
  life: { label: '평생교육', from: '#0f172a', to: '#2563eb', accent: '#f59e0b', mark: 'HRD' },
  career: { label: '자격증', from: '#111827', to: '#6d28d9', accent: '#38bdf8', mark: 'CERT' },
  senior: { label: '시니어교육', from: '#064e3b', to: '#0f766e', accent: '#fde68a', mark: 'DIGI' },
  ai: { label: '에듀테크·AI', from: '#020617', to: '#1d4ed8', accent: '#22d3ee', mark: 'AI' },
  well: { label: '웰니스·인문학', from: '#3f2f1f', to: '#a16207', accent: '#fef3c7', mark: 'LIFE' },
  inst: { label: '교육기관', from: '#1e293b', to: '#475569', accent: '#93c5fd', mark: 'EDU' },
  people: { label: '인터뷰', from: '#312e81', to: '#4f46e5', accent: '#fbbf24', mark: 'VIEW' },
  opinion: { label: '오피니언', from: '#1f2937', to: '#334155', accent: '#60a5fa', mark: 'OP' },
  press: { label: '보도자료', from: '#7f1d1d', to: '#b91c1c', accent: '#facc15', mark: 'NEWS' }
};

function escapeXml(value: string) {
  return value.replace(/[<>&"']/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[char] ?? char));
}

function hash(value: string) {
  let output = 0;
  for (let index = 0; index < value.length; index += 1) {
    output = (output << 5) - output + value.charCodeAt(index);
    output |= 0;
  }
  return Math.abs(output);
}

function themeFromId(id: string) {
  const prefix = id.split('-')[0] ?? 'life';
  return categoryThemes[prefix] ?? categoryThemes.life;
}

function buildSvg(id: string) {
  const theme = themeFromId(id);
  const seed = hash(id);
  const a = 120 + (seed % 260);
  const b = 620 + (seed % 180);
  const c = 950 + (seed % 260);
  const label = escapeXml(theme.label);
  const safeId = escapeXml(id);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900" role="img" aria-label="${label} 기사 썸네일">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${theme.from}"/>
      <stop offset="1" stop-color="${theme.to}"/>
    </linearGradient>
    <radialGradient id="glow" cx="28%" cy="18%" r="72%">
      <stop offset="0" stop-color="${theme.accent}" stop-opacity="0.52"/>
      <stop offset="0.52" stop-color="#ffffff" stop-opacity="0.09"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="24" stdDeviation="24" flood-color="#000" flood-opacity="0.25"/>
    </filter>
  </defs>
  <rect width="1600" height="900" fill="url(#bg)"/>
  <rect width="1600" height="900" fill="url(#glow)"/>
  <circle cx="${a}" cy="${a}" r="250" fill="#fff" opacity="0.08"/>
  <circle cx="${c}" cy="${b}" r="360" fill="#fff" opacity="0.07"/>
  <path d="M0 690 C280 560 450 760 750 610 C1020 475 1230 540 1600 395 L1600 900 L0 900 Z" fill="#ffffff" opacity="0.08"/>
  <g filter="url(#shadow)">
    <rect x="108" y="118" width="1384" height="664" rx="34" fill="#ffffff" opacity="0.13"/>
    <rect x="145" y="155" width="1310" height="590" rx="26" fill="#ffffff" opacity="0.08" stroke="#ffffff" stroke-opacity="0.28"/>
  </g>
  <g transform="translate(210 232)">
    <rect x="0" y="0" width="410" height="284" rx="20" fill="#ffffff" opacity="0.92"/>
    <rect x="36" y="46" width="338" height="28" rx="14" fill="${theme.to}" opacity="0.22"/>
    <rect x="36" y="103" width="254" height="20" rx="10" fill="#0f172a" opacity="0.18"/>
    <rect x="36" y="144" width="310" height="18" rx="9" fill="#0f172a" opacity="0.13"/>
    <rect x="36" y="184" width="232" height="18" rx="9" fill="#0f172a" opacity="0.12"/>
    <circle cx="326" cy="215" r="45" fill="${theme.accent}" opacity="0.95"/>
  </g>
  <g transform="translate(725 220)">
    <rect x="0" y="0" width="520" height="330" rx="24" fill="#0f172a" opacity="0.58" stroke="#ffffff" stroke-opacity="0.28"/>
    <circle cx="104" cy="110" r="48" fill="${theme.accent}" opacity="0.85"/>
    <circle cx="260" cy="110" r="48" fill="#ffffff" opacity="0.22"/>
    <circle cx="416" cy="110" r="48" fill="#ffffff" opacity="0.16"/>
    <path d="M104 110 L260 110 L416 110" stroke="#ffffff" stroke-width="7" opacity="0.4" stroke-linecap="round"/>
    <rect x="72" y="214" width="366" height="22" rx="11" fill="#ffffff" opacity="0.18"/>
    <rect x="72" y="258" width="258" height="18" rx="9" fill="#ffffff" opacity="0.13"/>
  </g>
  <text x="145" y="112" font-family="Arial, sans-serif" font-size="24" font-weight="800" letter-spacing="8" fill="#fff" opacity="0.75">EDU JOURNAL</text>
  <text x="145" y="675" font-family="Arial, sans-serif" font-size="44" font-weight="900" fill="#fff">${label}</text>
  <text x="145" y="728" font-family="Arial, sans-serif" font-size="23" font-weight="700" fill="#fff" opacity="0.76">교육 현장과 정책 흐름을 전하는 에듀저널 자료 이미지</text>
  <text x="1260" y="705" text-anchor="middle" font-family="Arial, sans-serif" font-size="86" font-weight="900" fill="#fff" opacity="0.92">${escapeXml(theme.mark)}</text>
  <text x="1455" y="112" text-anchor="end" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="#fff" opacity="0.48">${safeId}</text>
</svg>`;
}

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const svg = buildSvg(decodeURIComponent(id));

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=31536000, immutable'
    }
  });
}
