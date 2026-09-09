export function SponsoredNotice({ notice, className = '' }: { notice: string; className?: string }) {
  return (
    <div className={`rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-medium leading-7 text-amber-900 ${className || 'my-6'}`}>
      {notice}
    </div>
  );
}
