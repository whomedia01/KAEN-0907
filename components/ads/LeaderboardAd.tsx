import Link from 'next/link';

export function LeaderboardAd() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-2 no-print" aria-label="광고 영역">
      <div className="border border-slate-200 bg-slate-50/70 rounded-lg p-3 text-center shadow-2xs">
        <div className="flex items-center justify-between w-full mb-1 px-1">
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
        <div className="border border-dashed border-slate-300 rounded-md py-4 px-3 flex flex-col items-center justify-center min-h-[60px] bg-white/60">
          <p className="text-xs font-semibold text-slate-500 tracking-tight">
            광고 영역
          </p>
          <p className="text-[10px] text-slate-400 font-mono mt-0.5">
            Leaderboard (728 × 90 / 반응형)
          </p>
        </div>
      </div>
    </div>
  );
}
