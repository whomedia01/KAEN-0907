import Link from 'next/link';

export function InArticleAd() {
  return (
    <div className="my-8 py-3 px-4 bg-slate-50/70 border border-slate-200 rounded-lg no-print" aria-label="기사 본문 광고 영역">
      <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-200/80">
        <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
          AD / 광고
        </span>
        <Link
          href="/partnership"
          className="text-[10px] text-slate-400 hover:text-slate-600 transition-colors"
        >
          광고·제휴 문의
        </Link>
      </div>
      <div className="border border-dashed border-slate-300 rounded-md py-6 px-4 flex flex-col items-center justify-center bg-white/60 text-center">
        <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-500 font-bold text-[10px] tracking-wider mb-1.5">
          AD
        </span>
        <p className="text-xs font-semibold text-slate-500 tracking-tight">
          기사 본문 광고 영역
        </p>
        <p className="text-[10px] text-slate-400 font-mono mt-0.5">
          In-Article Ad (반응형 디스플레이 광고)
        </p>
      </div>
    </div>
  );
}
