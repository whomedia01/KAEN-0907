import Link from 'next/link';
import { LeaderboardAd } from '@/components/ads/LeaderboardAd';
import { Search } from 'lucide-react';

// GNB 카테고리: 정규 언론사 뉴스 카테고리
const navItems = [
  ['최신뉴스', '/articles'],
  ['AI·에듀테크', '/category/edutech-ai'],
  ['평생교육', '/category/lifelong-education'],
  ['자격증·HRD', '/category/career-dev'],
  ['시니어교육', '/category/senior-education'],
  ['교육기관', '/category/edu-institution'],
  ['인터뷰', '/category/interview-people'],
  ['오피니언', '/category/opinion'],
  ['보도자료', '/category/press-release']
] as const;

// 상단 유틸리티 메뉴: 필수 기능 창구만 유지
const utilityLinks = [
  ['기사제보', '/report'],
  ['보도자료 접수', '/press'],
  ['광고·제휴문의', '/partnership'],
  ['정정보도신청', '/correction'],
  ['관리자', '/admin']
] as const;

export async function PublicHeader() {
  return (
    <header id="top" className="border-b bg-white">
      {/* 1. 상단 유틸리티 바 */}
      <div className="border-b border-slate-100 bg-slate-50">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-2 px-4 py-2 text-[13px] leading-6 text-slate-600 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-3 text-xs">
            <span className="font-extrabold text-slate-900">한국AI교육신문</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500">인공지능 교육 · 평생학습 · 에듀테크</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 text-[12px] sm:text-[13px] font-medium">
            {utilityLinks.map(([label, href], index) => (
              <Link key={href} href={href} className="hover:text-blue-700 text-slate-600 transition-colors">
                {index > 0 ? <span className="mr-3 text-slate-300">|</span> : null}{label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 2. 메인 신문 제호(Masthead) & 검색 */}
      <div className="mx-auto flex max-w-[1180px] flex-col gap-4 px-4 py-5 md:flex-row md:items-center md:justify-between">
        {/* 좌측: 발행일자 */}
        <div className="hidden md:block">
          <span className="text-sm font-semibold text-slate-700">2026년 9월 9일 수요일</span>
        </div>

        {/* 중앙: 한국AI교육신문 제호 */}
        <Link href="/" className="block text-center group">
          <p className="text-[11px] sm:text-[12px] font-black tracking-[0.25em] text-blue-600 uppercase">
            KOREA AI EDUCATION NEWS
          </p>
          <div className="mt-1">
            <span className="text-[32px] sm:text-[42px] md:text-[46px] font-black leading-none tracking-[-0.06em] text-slate-950 group-hover:text-blue-900 transition-colors">
              한국AI교육신문
            </span>
          </div>
        </Link>

        {/* 우측: 통합 기사 검색 */}
        <form action="/search" className="flex h-11 w-full max-w-full overflow-hidden rounded-md border border-slate-300 bg-white md:max-w-[280px] shadow-2xs">
          <input
            name="q"
            aria-label="기사 검색"
            placeholder="기사·정책·교육기관 검색"
            className="min-w-0 flex-1 px-3.5 text-xs outline-none"
          />
          <button
            className="bg-slate-900 px-4 text-xs font-bold text-white hover:bg-slate-800 transition-colors flex items-center gap-1"
            type="submit"
          >
            <Search className="w-3.5 h-3.5" />
            <span>검색</span>
          </button>
        </form>
      </div>

      {/* 3. GNB (Global Navigation Bar) */}
      <nav className="bg-slate-900 text-white shadow-xs">
        <div className="mx-auto flex h-11 max-w-[1180px] items-center overflow-x-auto px-4 text-[14px] sm:text-[15px] font-bold no-scrollbar">
          {navItems.map(([label, href], index) => (
            <Link
              key={href}
              href={href}
              className="shrink-0 px-3.5 py-2 leading-none hover:bg-slate-800 hover:text-blue-300 transition-colors rounded text-slate-100"
            >
              {label}
              {index < navItems.length - 1 && <span className="ml-3 text-slate-700 font-normal">|</span>}
            </Link>
          ))}
        </div>
      </nav>

      {/* 4. 상단 광고 슬롯 */}
      <LeaderboardAd />
    </header>
  );
}
