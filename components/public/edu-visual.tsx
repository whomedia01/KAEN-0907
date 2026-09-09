type EduVisualProps = {
  category?: string | null;
  title?: string | null;
  className?: string;
  compact?: boolean;
};

const palette: Record<string, string> = {
  '평생교육·HRD': 'bg-blue-50 text-blue-950 border-blue-200',
  '자격증·자기계발': 'bg-amber-50 text-amber-950 border-amber-200',
  '시니어·실버교육': 'bg-emerald-50 text-emerald-950 border-emerald-200',
  '에듀테크·AI': 'bg-indigo-50 text-indigo-950 border-indigo-200',
  '웰니스·인문학': 'bg-rose-50 text-rose-950 border-rose-200',
  '교육기관 탐방': 'bg-cyan-50 text-cyan-950 border-cyan-200',
  '명사 인터뷰': 'bg-violet-50 text-violet-950 border-violet-200',
  오피니언: 'bg-slate-50 text-slate-950 border-slate-200',
  '공지·보도': 'bg-lime-50 text-lime-950 border-lime-200'
};

export function EduVisual({ category, title, className = '', compact = false }: EduVisualProps) {
  const label = category || '에듀저널';
  const tone = palette[label] || 'bg-slate-50 text-slate-950 border-slate-200';
  const displayTitle = title || '교육 전문 콘텐츠';

  return (
    <div className={`relative overflow-hidden border ${tone} ${className}`}>
      <div className="absolute right-3 top-3 h-12 w-12 rounded-full bg-white/70" />
      <div className="absolute bottom-3 left-3 h-10 w-10 rounded-full bg-white/60" />
      <div className={`${compact ? 'p-3' : 'p-5'} relative flex h-full min-h-[inherit] flex-col justify-between`}>
        <p className="text-[10px] font-black uppercase tracking-[0.18em] opacity-70">EDU JOURNAL</p>
        <div>
          <p className={`${compact ? 'text-sm' : 'text-lg'} line-clamp-2 font-black leading-tight`}>{label}</p>
          <p className={`${compact ? 'hidden' : 'mt-2 line-clamp-2'} text-xs font-semibold leading-5 opacity-70`}>{displayTitle}</p>
        </div>
      </div>
    </div>
  );
}
