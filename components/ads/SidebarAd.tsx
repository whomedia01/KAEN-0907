import Link from 'next/link';

export function SidebarAd({ variant = 'rectangle' }: { variant?: 'rectangle' | 'halfpage' }) {
  if (variant === 'halfpage') {
    return (
      <div className="border border-slate-200 bg-slate-50/70 rounded-lg p-3 text-center shadow-2xs no-print mb-6" aria-label="광고 영역">
        <div className="flex items-center justify-between w-full mb-2 px-1">
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
        <div className="border border-dashed border-slate-300 rounded-md p-6 flex flex-col items-center justify-center min-h-[360px] bg-white/60 text-center">
          <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-500 font-bold text-[10px] tracking-wider mb-2">
            AD
          </span>
          <p className="text-xs font-semibold text-slate-500 tracking-tight">
            광고 영역
          </p>
          <p className="text-[10px] text-slate-400 font-mono mt-0.5">
            Half Page (300 × 600 / 반응형)
          </p>
          <p className="text-[11px] text-slate-400 mt-4 max-w-[200px] leading-relaxed">
            디스플레이 광고 및 제휴 배너가 게재되는 영역입니다.
          </p>
          <Link
            href="/partnership"
            className="mt-6 inline-block text-[11px] font-medium text-blue-600 hover:text-blue-800 underline underline-offset-2"
          >
            광고 게재 안내 &rarr;
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-slate-200 bg-slate-50/70 rounded-lg p-3 text-center shadow-2xs no-print mb-6" aria-label="광고 영역">
      <div className="flex items-center justify-between w-full mb-2 px-1">
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
      <div className="border border-dashed border-slate-300 rounded-md p-5 flex flex-col items-center justify-center min-h-[220px] bg-white/60 text-center">
        <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-500 font-bold text-[10px] tracking-wider mb-2">
          AD
        </span>
        <p className="text-xs font-semibold text-slate-500 tracking-tight">
          광고 영역
        </p>
        <p className="text-[10px] text-slate-400 font-mono mt-0.5">
          Medium Rectangle (300 × 250)
        </p>
        <Link
          href="/partnership"
          className="mt-4 inline-block text-[11px] font-medium text-blue-600 hover:text-blue-800 underline underline-offset-2"
        >
          광고 게재 안내 &rarr;
        </Link>
      </div>
    </div>
  );
}
