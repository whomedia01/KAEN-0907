import Link from 'next/link';

const navItems = [
  ['홈', '/'],
  ['최신뉴스', '/articles'],
  ['평생교육', '/category/lifelong-education'],
  ['자격증', '/category/career-dev'],
  ['시니어교육', '/category/senior-education'],
  ['에듀테크', '/category/edutech-ai'],
  ['교육기관', '/category/edu-institution'],
  ['인터뷰', '/category/interview-people'],
  ['오피니언', '/category/opinion'],
  ['보도자료', '/category/press-release']
] as const;

const utilityLinks = [
  ['회사소개', '/about'],
  ['기사제보', '/report'],
  ['보도자료 접수', '/press'],
  ['광고·제휴문의', '/partnership'],
  ['관리자', '/admin']
] as const;

export function PublicHeader() {
  return (
    <header id="top" className="border-b bg-white">
      <div className="border-b border-slate-100 bg-slate-50">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-2 px-4 py-2.5 text-[14px] leading-6 text-slate-600 md:flex-row md:items-center md:justify-between md:text-[13px]">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="font-black text-slate-900">교육 전문 인터넷매체</span>
            <span>평생학습 · 자격증 · 시니어교육 · 에듀테크 · 교육기관</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-bold text-[14px] md:text-[13px]">
            {utilityLinks.map(([label, href], index) => (
              <Link key={href} href={href} className="hover:text-teal-700">
                {index > 0 ? <span className="mr-3 text-slate-300">|</span> : null}{label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1180px] flex-col gap-4 px-4 py-5 md:flex-row md:items-center md:justify-between">
        <div className="hidden rounded-lg border border-emerald-100 bg-emerald-50 px-5 py-3 text-center text-[15px] font-black text-emerald-700 md:block">
          평생교육 정보 허브
        </div>
        <Link href="/" className="block text-center">
          <p className="text-[13px] font-black tracking-[0.3em] text-teal-600 md:text-[12px]">EDUCATION NEWS NETWORK</p>
          <div className="mt-1 flex items-end justify-center gap-2 md:gap-3">
            <span className="text-[42px] font-black leading-none tracking-[-0.08em] text-slate-950 sm:text-[48px] md:text-[56px]">에듀저널</span>
            <span className="pb-1 text-[13px] font-black tracking-[0.2em] text-slate-400 md:text-[13px]">EDU JOURNAL</span>
          </div>
          <p className="mt-2 text-[15px] font-semibold leading-6 text-slate-600 md:text-[15px]">교육 현장과 제도 변화를 매일 전하는 인터넷신문</p>
        </Link>
        <form action="/search" className="flex h-12 w-full max-w-full overflow-hidden rounded-md border border-slate-300 bg-white md:h-11 md:max-w-[320px]">
          <input name="q" aria-label="기사 검색" placeholder="검색어 입력" className="min-w-0 flex-1 px-4 text-[16px] outline-none md:text-[14px]" />
          <button className="bg-slate-950 px-5 text-[16px] font-black text-white md:text-[14px]" type="submit">검색</button>
        </form>
      </div>

      <nav className="bg-[#20b8b8] text-white">
        <div className="mx-auto flex h-12 max-w-[1180px] items-center overflow-x-auto px-3 text-[16px] font-black md:h-11 md:px-4 md:text-[15px]">
          {navItems.map(([label, href], index) => (
            <Link key={href} href={href} className="shrink-0 px-3.5 py-3 leading-none hover:bg-teal-700 md:px-3">
              {index > 0 ? <span className="mr-3 text-white/40">·</span> : null}{label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
