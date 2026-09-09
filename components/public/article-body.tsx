import { buildEditorialSections } from '@/lib/editorial/article-style';

const INTERNAL_LABELS = new Set([
  '기사',
  '본문',
  '기사 본문',
  '리드',
  '핵심 요약',
  '핵심 쟁점',
  '배경',
  '현장 맥락',
  '현장 반응',
  '독자 영향',
  '소비자 영향',
  '업계 영향',
  '전망',
  '정리',
  '전망과 과제',
  '브랜드 배경',
  '운영 철학',
  '독자 체크포인트',
  '발표 내용',
  '사업 배경',
  '향후 계획',
  '편집자 주',
  '문답',
  '인터뷰',
  '보도자료'
]);

const NEWS_TONE_REPLACEMENTS: Array<[RegExp, string]> = [
  [/입니다(?=\.|!|\?|$)/g, '이다'],
  [/했습니다(?=\.|!|\?|$)/g, '했다'],
  [/하였습니다(?=\.|!|\?|$)/g, '했다'],
  [/합니다(?=\.|!|\?|$)/g, '한다'],
  [/됩니다(?=\.|!|\?|$)/g, '된다'],
  [/됐습니다(?=\.|!|\?|$)/g, '됐다'],
  [/되었습니다(?=\.|!|\?|$)/g, '됐다'],
  [/있습니다(?=\.|!|\?|$)/g, '있다'],
  [/없습니다(?=\.|!|\?|$)/g, '없다'],
  [/보입니다(?=\.|!|\?|$)/g, '보인다'],
  [/나타납니다(?=\.|!|\?|$)/g, '나타난다'],
  [/나타났습니다(?=\.|!|\?|$)/g, '나타났다'],
  [/확인됩니다(?=\.|!|\?|$)/g, '확인된다'],
  [/분석됩니다(?=\.|!|\?|$)/g, '분석된다'],
  [/전망됩니다(?=\.|!|\?|$)/g, '전망된다'],
  [/관측됩니다(?=\.|!|\?|$)/g, '관측된다'],
  [/해석됩니다(?=\.|!|\?|$)/g, '해석된다'],
  [/필요합니다(?=\.|!|\?|$)/g, '필요하다'],
  [/중요합니다(?=\.|!|\?|$)/g, '중요하다'],
  [/가능합니다(?=\.|!|\?|$)/g, '가능하다'],
  [/어렵습니다(?=\.|!|\?|$)/g, '어렵다'],
  [/높습니다(?=\.|!|\?|$)/g, '높다'],
  [/많습니다(?=\.|!|\?|$)/g, '많다'],
  [/큽니다(?=\.|!|\?|$)/g, '크다'],
  [/밝혔습니다(?=\.|!|\?|$)/g, '밝혔다'],
  [/전했습니다(?=\.|!|\?|$)/g, '전했다'],
  [/설명했습니다(?=\.|!|\?|$)/g, '설명했다'],
  [/지적했습니다(?=\.|!|\?|$)/g, '지적했다'],
  [/덧붙였습니다(?=\.|!|\?|$)/g, '덧붙였다']
];

const MARKDOWN_IMAGE_AT_START_RE = /^!\[([^\]]*)\]\((\S+?)(?:\s+"([^"]+)")?\)\s*(.*)$/;
const MARKDOWN_IMAGE_ALT_ONLY_RE = /^!\[([^\]]*)\]\s*$/;
const MARKDOWN_IMAGE_URL_ONLY_RE = /^\((\S+?)(?:\s+"([^"]+)")?\)\s*(.*)$/;

type RenderBlock =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'image'; url: string; caption?: string; credit?: string };

type ParsedImage = {
  image: Extract<RenderBlock, { type: 'image' }>;
  rest?: string;
};

function isInternalLabel(label: string) {
  return INTERNAL_LABELS.has(label.trim());
}

function normalizeNewsTone(text: string) {
  return NEWS_TONE_REPLACEMENTS.reduce((result, [pattern, replacement]) => result.replace(pattern, replacement), text).trim();
}

function createImageBlock(caption?: string, url?: string, credit?: string): Extract<RenderBlock, { type: 'image' }> | null {
  if (!url) return null;

  return {
    type: 'image',
    url,
    caption: caption?.trim() || undefined,
    credit: credit?.trim() || undefined
  };
}

function parseInlineImage(text: string): ParsedImage | null {
  const match = text.trim().match(MARKDOWN_IMAGE_AT_START_RE);
  const image = createImageBlock(match?.[1], match?.[2], match?.[3]);
  if (!image) return null;

  return {
    image,
    rest: match?.[4]?.trim() || undefined
  };
}

function parseSplitImage(currentLine: string, nextLine?: string): ParsedImage | null {
  const alt = currentLine.trim().match(MARKDOWN_IMAGE_ALT_ONLY_RE);
  const url = nextLine?.trim().match(MARKDOWN_IMAGE_URL_ONLY_RE);
  const image = createImageBlock(alt?.[1], url?.[1], url?.[2]);
  if (!image) return null;

  return {
    image,
    rest: url?.[3]?.trim() || undefined
  };
}

function paragraphBlock(text: string): RenderBlock[] {
  const normalized = normalizeNewsTone(text);
  return normalized ? [{ type: 'paragraph', text: normalized }] : [];
}

function toRenderBlocks(lines: string[]): RenderBlock[] {
  const blocks: RenderBlock[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]?.trim();
    if (!line) continue;

    const inlineImage = parseInlineImage(line);
    if (inlineImage) {
      blocks.push(inlineImage.image);
      if (inlineImage.rest) blocks.push(...paragraphBlock(inlineImage.rest));
      continue;
    }

    const splitImage = parseSplitImage(line, lines[index + 1]);
    if (splitImage) {
      blocks.push(splitImage.image);
      if (splitImage.rest) blocks.push(...paragraphBlock(splitImage.rest));
      index += 1;
      continue;
    }

    blocks.push(...paragraphBlock(line));
  }

  return blocks;
}

export function ArticleBody({
  title,
  content,
  summary,
  articleType,
  categoryName,
  className = ''
}: {
  title?: string | null;
  content?: string | null;
  summary?: string | null;
  articleType?: string | null;
  categoryName?: string | null;
  className?: string;
}) {
  const sections = buildEditorialSections({ title, content, summary, articleType, categoryName });

  const blocks = sections.flatMap<RenderBlock>((section): RenderBlock[] => {
    const bodyBlocks = toRenderBlocks(section.body);
    if (!bodyBlocks.length) return [];

    if (isInternalLabel(section.heading)) {
      return bodyBlocks;
    }

    return [
      { type: 'heading' as const, text: section.heading },
      ...bodyBlocks
    ];
  });

  if (!blocks.length) {
    return <p className={`text-gray-600 ${className}`.trim()}>기사가 준비 중이다.</p>;
  }

  return (
    <div className={`article-body space-y-6 ${className}`.trim()} style={{ fontSize: 'calc(1.15rem * var(--article-font-scale, 1))' }}>
      {blocks.map((block, index) => {
        if (block.type === 'heading') {
          return (
            <h3 key={`${block.type}-${index}`} className="mt-10 border-t border-gray-200 pt-7 text-xl font-black leading-snug text-gray-950">
              {block.text}
            </h3>
          );
        }

        if (block.type === 'image') {
          return (
            <figure key={`${block.type}-${index}`} className="my-9 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={block.url} alt={block.caption ?? '기사 이미지'} className="max-h-[520px] w-full object-cover" />
              {(block.caption || block.credit) && (
                <figcaption className="px-4 py-3 text-[14px] leading-6 text-slate-500">
                  {block.caption}
                  {block.credit ? <span className="ml-1">ⓒ {block.credit}</span> : null}
                </figcaption>
              )}
            </figure>
          );
        }

        const isLead = blocks.slice(0, index).every((item) => item.type !== 'paragraph');
        return (
          <p
            key={`${block.type}-${index}`}
            className={
              isLead
                ? 'text-[1.14em] font-semibold leading-9 text-gray-900'
                : 'leading-9 text-gray-800'
            }
          >
            {block.text}
          </p>
        );
      })}
    </div>
  );
}
