import { InArticleAd } from '@/components/ads/InArticleAd';

interface ArticleInteractiveBodyProps {
  title?: string;
  summary?: string | null;
  paragraphs: string[];
  authorName?: string;
  authorEmail?: string | null;
}

export function ArticleInteractiveBody({
  summary,
  paragraphs,
  authorName
}: ArticleInteractiveBodyProps) {
  // 기자명 정제 (예: '홍길동 기자' -> '홍길동')
  const cleanAuthorName = authorName ? authorName.replace(/\s*기자$/, '').trim() : '취재팀';

  return (
    <div className="mt-6">
      {/* 1. 기사 전문 (Lead Summary) - 기사 요건의 전문 */}
      {summary && (
        <div className="p-5 bg-slate-50 border-l-4 border-slate-900 rounded-r-md text-slate-800 mb-6">
          <p className="font-semibold text-[16px] sm:text-[17px] leading-relaxed">
            {summary}
          </p>
        </div>
      )}

      {/* 2. 기사 본문 단락 */}
      <div className="space-y-6 text-slate-900 text-[17px] sm:text-[18px] leading-[1.95] font-news-sans article-content">
        {paragraphs.map((para, index) => {
          // 마크다운 이미지 태그 감지: ![캡션](URL)
          const imgMatch = para.match(/^!\[(.*?)\]\((.*?)\)$/);
          if (imgMatch) {
            const caption = imgMatch[1] || '';
            const src = imgMatch[2] || '';
            return (
              <figure 
                key={index} 
                className="my-8 overflow-hidden rounded-2xl border border-slate-200 bg-slate-950/5 shadow-xs transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-[16/9] w-full bg-slate-900">
                  <img
                    src={src}
                    alt={caption}
                    className="h-full w-full object-contain"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                </div>
                {caption && (
                  <figcaption className="p-3.5 text-center text-xs sm:text-sm font-medium text-slate-600 border-t border-slate-200/80 bg-white">
                    {caption.startsWith('▲') ? caption : `▲ ${caption}`}
                  </figcaption>
                )}
              </figure>
            );
          }

          const isSectionHeader = para.startsWith('■') || (para.startsWith('[') && !para.startsWith('[한국AI교육신문'));
          return (
            <div key={index}>
              {isSectionHeader ? (
                <h3 className="mt-8 mb-3 font-extrabold text-xl sm:text-2xl text-slate-950 tracking-tight">
                  {para}
                </h3>
              ) : (
                <p className="mb-4 text-justify sm:text-left leading-[1.95]">{para}</p>
              )}

              {/* 본문 중간 네이티브 광고 (기사 분량 확대에 맞춰 4번째 단락 또는 1/3 지점 후 배치) */}
              {index === (paragraphs.length >= 7 ? 4 : 2) && <InArticleAd />}
            </div>
          );
        })}
      </div>

      {/* 3. 기사 말미 공식 바이라인 및 저작권 표기 (언론사 기사 필수 양식) */}
      <div className="mt-10 border-t border-b border-slate-200 py-4 text-sm text-slate-700 font-medium">
        <p className="font-bold text-slate-900">
          [한국AI교육신문 = {cleanAuthorName} 기자]
        </p>
        <p className="text-xs text-slate-500 mt-1.5">
          &lt;저작권자 © 한국AI교육신문, 무단 전재 및 재배포 금지&gt;
        </p>
      </div>
    </div>
  );
}
