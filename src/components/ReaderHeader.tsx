import React, { useState } from "react";
import { Search, BookOpen, User, Settings, Type, Sparkles, X, Menu, ArrowRight, LogIn, LogOut, Check } from "lucide-react";
import { Category, Article } from "../types";

interface ReaderHeaderProps {
  categories: Category[];
  articles: Article[];
  currentCategory: string | null;
  onSelectCategory: (catId: string | null) => void;
  onSelectArticle: (articleId: string | null) => void;
  onOpenAdmin: () => void;
  fontSize: number; // 1, 2, 3 representing small, medium, large
  setFontSize: (size: number) => void;
  readingMode: boolean;
  setReadingMode: (mode: boolean) => void;
  onSearch: (query: string) => void;
  userRole: string;
  setUserRole: (role: any) => void;
  onNavigatePage?: (page: string) => void;
}

export default function ReaderHeader({
  categories,
  articles,
  currentCategory,
  onSelectCategory,
  onSelectArticle,
  onOpenAdmin,
  fontSize,
  setFontSize,
  readingMode,
  setReadingMode,
  onSearch,
  userRole,
  setUserRole,
  onNavigatePage
}: ReaderHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (art: Article) => {
    setSearchQuery("");
    setShowSuggestions(false);
    onSelectArticle(art.id);
  };

  const suggestions = searchQuery.trim()
    ? articles
        .filter(
          (a) =>
            a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const increaseFontSize = () => {
    if (fontSize < 3) setFontSize(fontSize + 1);
  };

  const decreaseFontSize = () => {
    if (fontSize > 1) setFontSize(fontSize - 1);
  };

  // Safe formatting for dates matching screenshot "최종편집 2026-07-27(월)"
  const getTodayString = () => {
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    const d = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}(${days[d.getDay()]})`;
  };

  return (
    <>
      {/* 1. Top Utility Header - Clean, non-redundant top bar */}
      <div className="bg-[#f8f9fa] border-b border-gray-200 text-[#333333] text-[12px] py-1.5 px-4 select-none">
        <div className="max-w-[1240px] mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          
          {/* Left: Final Edit Date */}
          <div className="flex items-center gap-2 text-gray-600 font-medium">
            <span>최종편집</span>
            <strong className="font-semibold text-gray-800">{getTodayString()}</strong>
          </div>

          {/* Right: Essential Login/Admin Controls, Font Size & Search */}
          <div className="flex items-center gap-3 text-[12px] text-gray-700">
            {userRole === "Viewer" ? (
              <>
                <button 
                  onClick={() => setIsLoginModalOpen(true)} 
                  className="hover:text-blue-600 cursor-pointer font-medium"
                >
                  로그인
                </button>
                <span className="text-gray-300">|</span>
                <button 
                  onClick={onOpenAdmin} 
                  className="hover:text-blue-700 font-bold text-red-600 flex items-center gap-1 cursor-pointer" 
                  id="btn-admin-console"
                >
                  <Settings className="h-3 w-3" />
                  <span>관리자</span>
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={onOpenAdmin} 
                  className="hover:text-blue-700 font-bold text-blue-900 flex items-center gap-1 cursor-pointer"
                  id="btn-admin-console"
                >
                  <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full"></span>
                  <span>관리자</span>
                </button>
                <span className="text-gray-300">|</span>
                <button 
                  onClick={() => setUserRole('Viewer')} 
                  className="hover:text-red-600 cursor-pointer"
                >
                  로그아웃
                </button>
              </>
            )}
            <span className="text-gray-300">|</span>

            {/* Font Size controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={decreaseFontSize}
                disabled={fontSize === 1}
                className="px-1 py-0.2 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-30 cursor-pointer text-[10px]"
                title="글자 크기 축소"
              >
                가-
              </button>
              <button
                onClick={increaseFontSize}
                disabled={fontSize === 3}
                className="px-1 py-0.2 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-30 cursor-pointer text-[10px]"
                title="글자 크기 확대"
              >
                가+
              </button>
            </div>

            {/* Search Input Box */}
            <form onSubmit={handleSearchSubmit} className="relative ml-2">
              <div className="flex items-center border border-gray-300 rounded bg-white px-2 py-0.5 h-[26px]">
                <input
                  type="search"
                  placeholder="검색어를 2단어 이상 입력해 주세요"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className="bg-transparent text-[11px] placeholder-gray-400 focus:outline-none w-[170px] sm:w-[210px]"
                />
                <button type="submit" className="text-gray-500 hover:text-blue-600 cursor-pointer pl-1">
                  <Search className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Suggestions dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute right-0 mt-1 bg-white text-gray-800 rounded shadow-lg border border-gray-200 z-50 overflow-hidden w-[280px]">
                  <div className="p-2 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-600 flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-amber-500" /> 추천 검색어
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowSuggestions(false)}
                      className="text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                  <ul>
                    {suggestions.map((art) => (
                      <li
                        key={art.id}
                        onClick={() => handleSuggestionClick(art)}
                        className="p-2 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 cursor-pointer transition text-left"
                      >
                        <h4 className="text-[12px] font-bold text-gray-900 truncate">{art.title}</h4>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </form>

          </div>
        </div>
      </div>

      {/* 2. Main Newspaper Logo Header */}
      <header className="bg-white py-5 px-4 border-b border-gray-200">
        <div className="max-w-[1240px] mx-auto flex items-center justify-center">
          
          {/* Center Logo: 한국AI교육일보 (Gmarket Sans, Bold, 크기 28px, 진한 네이비색 #112443) */}
          <div 
            className="text-center cursor-pointer select-none flex flex-col items-center justify-center py-1" 
            onClick={() => onSelectCategory(null)}
          >
            <div className="flex items-center justify-center gap-2">
              <div className="text-center">
                <h1 className="text-[30px] font-bold tracking-tight text-[#112443] font-bareun-batang">
                  한국AI교육일보
                </h1>
                <p className="text-[11px] text-[#2563eb] font-bold tracking-wider font-pretendard uppercase -mt-1">
                  KOREA AI EDUCATION NEWS
                </p>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* 3. Primary Navigation Bar - Taegeuk Theme (Red to Blue Gradient with Taegeuk Accents) */}
      <nav className="sticky top-0 z-40 bg-gradient-to-r from-[#cd2e3a] via-[#0f2442] to-[#0047a0] text-white shadow-md border-t-2 border-[#cd2e3a] border-b-2 border-[#0047a0]">
        <div className="max-w-[1240px] mx-auto px-2 flex justify-between items-center h-[46px]">
          
          {/* Main Menu Hamburger + Primary Categories */}
          <div className="flex items-center overflow-x-auto scrollbar-none h-full w-full">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="px-3 text-white hover:bg-white/20 h-full flex items-center transition cursor-pointer"
              title="전체 메뉴 및 섹션 열기"
              id="btn-hamburger-menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <button
              onClick={() => onSelectCategory(null)}
              className={`h-full px-4 text-[16px] font-medium font-pretendard whitespace-nowrap transition cursor-pointer flex items-center ${
                currentCategory === null
                  ? "bg-white/25 text-white font-bold border-b-2 border-amber-300"
                  : "text-white/95 hover:bg-white/15 hover:text-white"
              }`}
            >
              홈
            </button>

            {/* Render dynamic menu buttons */}
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`h-full px-4 text-[16px] font-medium font-pretendard whitespace-nowrap transition cursor-pointer flex items-center ${
                  currentCategory === cat.id
                    ? "bg-white/25 text-white font-bold border-b-2 border-amber-300"
                    : "text-white/95 hover:bg-white/15 hover:text-white"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Far Right: 기사제보 / 제휴문의 */}
          <div className="shrink-0 pl-2">
            <button
              onClick={() => onNavigatePage ? onNavigatePage("tip_article") : onSelectCategory(null)}
              className="h-full px-3.5 py-1.5 text-[14px] font-bold whitespace-nowrap bg-gradient-to-r from-[#cd2e3a] to-[#0047a0] hover:from-red-700 hover:to-blue-800 text-amber-300 rounded border border-amber-300/40 cursor-pointer transition flex items-center shadow-xs"
            >
              기사제보
            </button>
          </div>
        </div>
      </nav>

      {/* 4. Sub-Navigation Bar (Detailed sub-topics for AI Education Newspaper) */}
      <section className="bg-slate-50 border-b border-gray-200 py-2 px-4 shadow-xs">
        <div className="max-w-[1240px] mx-auto flex items-center justify-start gap-5 overflow-x-auto scrollbar-none text-[13px] font-medium text-slate-700">
          <span className="font-bold text-blue-700 text-xs shrink-0">[주요세부]</span>
          <button onClick={() => onSelectCategory("cat_policy")} className="hover:text-blue-700 whitespace-nowrap cursor-pointer">
            정부 동향
          </button>
          <span className="text-gray-300">|</span>
          <button onClick={() => onSelectCategory("cat_policy")} className="hover:text-blue-700 whitespace-nowrap cursor-pointer">
            교육청 정책
          </button>
          <span className="text-gray-300">|</span>
          <button onClick={() => onSelectCategory("cat_school")} className="hover:text-blue-700 whitespace-nowrap cursor-pointer">
            초·중·고 AI교육
          </button>
          <span className="text-gray-300">|</span>
          <button onClick={() => onSelectCategory("cat_school")} className="hover:text-blue-700 whitespace-nowrap cursor-pointer">
            교원 역량강화
          </button>
          <span className="text-gray-300">|</span>
          <button onClick={() => onSelectCategory("cat_edtech")} className="hover:text-blue-700 whitespace-nowrap cursor-pointer">
            에듀테크 동향
          </button>
          <span className="text-gray-300">|</span>
          <button onClick={() => onSelectCategory("cat_literacy")} className="hover:text-blue-700 whitespace-nowrap cursor-pointer">
            AI 윤리·리터러시
          </button>
          <span className="text-gray-300">|</span>
          <button onClick={() => onSelectCategory("cat_opinion")} className="hover:text-blue-700 whitespace-nowrap cursor-pointer">
            전문가 칼럼
          </button>
        </div>
      </section>

      {/* 4. Breaking News rolling bar with 2 lines of news (최신 & 시선) as seen in image */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-[1200px] mx-auto px-4 py-2.5 text-[13px] divide-y divide-slate-100">
          
          {/* Row 1: 최신 속보 */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 py-1">
            <span className="w-14 shrink-0 bg-[#1e3a8a] text-center py-0.5 text-[11px] font-black text-white rounded-[2px] uppercase tracking-wider select-none">
              최신기사
            </span>
            <div className="flex flex-wrap gap-x-4 gap-y-1 overflow-hidden h-5">
              {articles.slice(0, 5).map((article, idx) => (
                <div key={article.id} className="flex items-center gap-1.5">
                  <button
                    onClick={() => onSelectArticle(article.id)}
                    className="font-bold text-neutral-800 hover:text-red-600 text-left cursor-pointer truncate max-w-[220px] md:max-w-[280px]"
                  >
                    {article.title}
                  </button>
                  {idx < 4 && <span className="text-slate-300 text-[10px]">·</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Row 2: 시선 포커스 */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 py-1">
            <span className="w-14 shrink-0 bg-[#d92323] text-center py-0.5 text-[11px] font-black text-white rounded-[2px] uppercase tracking-wider select-none">
              시선뉴스
            </span>
            <div className="flex flex-wrap gap-x-4 gap-y-1 overflow-hidden h-5">
              {articles.slice(5, 10).map((article, idx) => (
                <div key={article.id} className="flex items-center gap-1.5">
                  <button
                    onClick={() => onSelectArticle(article.id)}
                    className="font-bold text-slate-700 hover:text-red-600 text-left cursor-pointer truncate max-w-[220px] md:max-w-[280px]"
                  >
                    {article.title}
                  </button>
                  {idx < 4 && <span className="text-slate-300 text-[10px]">·</span>}
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 5. Full Category Mega Menu / Drawer Overlay (Works for all screen sizes: PC Desktop & Mobile) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-start bg-black/60 backdrop-blur-xs font-sans animate-fade-in" id="full-menu-drawer-overlay">
          <div 
            className="fixed inset-0" 
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Backdrop"
          />
          <div className="relative z-10 bg-white w-full max-w-sm sm:max-w-md h-full overflow-y-auto shadow-2xl flex flex-col justify-between text-left animate-slide-right">
            
            {/* Drawer Header */}
            <div>
              <div className="bg-[#112443] p-5 text-white flex justify-between items-center sticky top-0 z-20">
                <div>
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-amber-300">KOREA AI EDUCATION NEWS</h3>
                  <h2 className="text-lg font-black font-serif-kr">한국AI교육일보 전체 메뉴</h2>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition cursor-pointer"
                  title="메뉴 닫기"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Menu Categories List */}
              <div className="p-5 space-y-6">
                
                {/* Section 1: Main Categories */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">
                    주요 보도 카테고리
                  </h3>
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        onSelectCategory(null);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 rounded text-sm font-bold transition flex items-center justify-between cursor-pointer ${
                        currentCategory === null
                          ? "bg-blue-50 text-blue-800 border-l-4 border-blue-600"
                          : "text-slate-800 hover:bg-slate-100"
                      }`}
                    >
                      <span>전체 기사</span>
                      <ArrowRight className="h-4 w-4 opacity-50" />
                    </button>

                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          onSelectCategory(cat.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2.5 rounded text-sm font-bold transition flex items-center justify-between cursor-pointer ${
                          currentCategory === cat.id
                            ? "bg-blue-50 text-blue-800 border-l-4 border-blue-600"
                            : "text-slate-800 hover:bg-slate-100"
                        }`}
                      >
                        <span>{cat.name}</span>
                        <ArrowRight className="h-4 w-4 opacity-50" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Section 2: Sub-Topics */}
                <div className="border-t border-slate-100 pt-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">
                    주요 세부 분야
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-700">
                    <button
                      onClick={() => { onSelectCategory("cat_policy"); setMobileMenuOpen(false); }}
                      className="p-2.5 rounded bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-left border border-slate-200 transition cursor-pointer"
                    >
                      정부 동향
                    </button>
                    <button
                      onClick={() => { onSelectCategory("cat_policy"); setMobileMenuOpen(false); }}
                      className="p-2.5 rounded bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-left border border-slate-200 transition cursor-pointer"
                    >
                      교육청 정책
                    </button>
                    <button
                      onClick={() => { onSelectCategory("cat_school"); setMobileMenuOpen(false); }}
                      className="p-2.5 rounded bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-left border border-slate-200 transition cursor-pointer"
                    >
                      초·중·고 AI교육
                    </button>
                    <button
                      onClick={() => { onSelectCategory("cat_school"); setMobileMenuOpen(false); }}
                      className="p-2.5 rounded bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-left border border-slate-200 transition cursor-pointer"
                    >
                      교원 역량강화
                    </button>
                    <button
                      onClick={() => { onSelectCategory("cat_edtech"); setMobileMenuOpen(false); }}
                      className="p-2.5 rounded bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-left border border-slate-200 transition cursor-pointer"
                    >
                      에듀테크 동향
                    </button>
                    <button
                      onClick={() => { onSelectCategory("cat_literacy"); setMobileMenuOpen(false); }}
                      className="p-2.5 rounded bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-left border border-slate-200 transition cursor-pointer"
                    >
                      AI 윤리·리터러시
                    </button>
                    <button
                      onClick={() => { onSelectCategory("cat_opinion"); setMobileMenuOpen(false); }}
                      className="p-2.5 rounded bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-left border border-slate-200 transition cursor-pointer col-span-2"
                    >
                      전문가 칼럼 / 시론
                    </button>
                  </div>
                </div>

                {/* Section 3: Reader Services & Shortcuts */}
                <div className="border-t border-slate-100 pt-4 space-y-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
                    독자 서비스 및 제보
                  </h3>
                  <button
                    onClick={() => {
                      if (onNavigatePage) onNavigatePage("tip_article");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full p-3 rounded-md bg-gradient-to-r from-red-600 to-blue-700 text-white font-bold text-xs flex items-center justify-between cursor-pointer shadow-xs hover:opacity-95"
                  >
                    <span>독자 기사 제보 및 제휴 문의</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (onNavigatePage) onNavigatePage("ethics_charter");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full p-2.5 rounded border border-slate-200 text-slate-700 font-medium text-xs text-left hover:bg-slate-50 transition cursor-pointer flex justify-between items-center"
                  >
                    <span>윤리강령 및 보도준칙</span>
                  </button>
                  <button
                    onClick={() => {
                      if (onNavigatePage) onNavigatePage("grievance_officer");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full p-2.5 rounded border border-slate-200 text-slate-700 font-medium text-xs text-left hover:bg-slate-50 transition cursor-pointer flex justify-between items-center"
                  >
                    <span>신문사 고충처리 청구 창구</span>
                  </button>
                </div>

              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-5 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">신문사 모드: {userRole}</span>
                <button
                  onClick={() => {
                    setIsLoginModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="text-blue-700 font-bold hover:underline cursor-pointer"
                >
                  로그인/권한변경
                </button>
              </div>
              <button
                onClick={() => {
                  onOpenAdmin();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 bg-slate-900 text-white font-bold rounded text-center block hover:bg-slate-800 transition cursor-pointer"
              >
                신문사 CMS 관리자 콘솔
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 6. Sleek Interactive Login & Role Selector Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans animate-fade-in" id="login-modal-overlay">
          <div className="bg-white rounded-md max-w-md w-full border border-slate-200 overflow-hidden shadow-2xl flex flex-col animate-scale-in text-left">
            <div className="bg-[#112443] p-5 text-white flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-yellow-300">한국AI교육일보 독자 포털</h3>
                <h2 className="text-lg font-black font-serif-kr">신문사 회원 로그인 및 권한 선택</h2>
              </div>
              <button 
                onClick={() => setIsLoginModalOpen(false)}
                className="text-white/70 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                {[
                  { role: 'Admin', title: '황광성 발행인 · 편집인 (Admin)' },
                  { role: 'Editor', title: '편집국 취재팀 (Editor)' },
                  { role: 'Viewer', title: '일반 방문 독자 (Viewer)' }
                ].map((item) => (
                  <button
                    key={item.role}
                    onClick={() => {
                      setUserRole(item.role);
                      setIsLoginModalOpen(false);
                    }}
                    className={`w-full border p-3 rounded text-left transition hover:border-slate-900 cursor-pointer flex items-center justify-between ${
                      userRole === item.role ? 'border-slate-900 bg-slate-50 ring-2 ring-slate-900/5' : 'border-slate-200 hover:bg-slate-50/50'
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-900">{item.title}</span>
                    {userRole === item.role && (
                      <span className="bg-slate-900 text-white font-mono text-[8px] px-1.5 py-0.5 rounded-full font-black flex items-center gap-0.5">
                        <Check className="h-2 w-2" /> ACTIVE
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setIsLoginModalOpen(false)}
                className="bg-slate-900 text-white font-bold text-xs py-2 px-5 rounded hover:bg-slate-800 transition cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
