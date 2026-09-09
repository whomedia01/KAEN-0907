import React, { useState } from "react";
import { Article, Category, MainLayoutItem, Author } from "../types";
import { ChevronRight, Plus, Award, FileText, Sparkles, BookOpen, Newspaper, ShieldCheck, Mail, Phone } from "lucide-react";

interface FrontPageProps {
  articles: Article[];
  categories: Category[];
  layoutSettings: MainLayoutItem[];
  authors?: Author[];
  onSelectArticle: (id: string) => void;
  onSelectCategory: (id: string | null) => void;
  fontSize: number;
  currentCategory?: string | null;
  onNavigatePage?: (page: string) => void;
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  } catch {
    return dateStr;
  }
};

const getFontSizeClass = (base: string, fontSize: number) => {
  if (fontSize === 1) return base;
  if (fontSize === 2) {
    if (base.includes("text-xs")) return base.replace("text-xs", "text-sm");
    if (base.includes("text-sm")) return base.replace("text-sm", "text-base");
    if (base.includes("text-base")) return base.replace("text-base", "text-lg");
    if (base.includes("text-lg")) return base.replace("text-lg", "text-xl");
    if (base.includes("text-xl")) return base.replace("text-xl", "text-2xl");
    return base + " text-lg";
  }
  if (base.includes("text-xs")) return base.replace("text-xs", "text-base");
  if (base.includes("text-sm")) return base.replace("text-sm", "text-lg");
  if (base.includes("text-base")) return base.replace("text-base", "text-xl");
  if (base.includes("text-lg")) return base.replace("text-lg", "text-2xl");
  if (base.includes("text-xl")) return base.replace("text-xl", "text-3xl");
  return base + " text-xl";
};

export default function FrontPage({
  articles,
  categories,
  authors,
  onSelectArticle,
  onSelectCategory,
  fontSize,
  currentCategory,
  onNavigatePage
}: FrontPageProps) {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [cultureSlide, setCultureSlide] = useState<number>(1);

  // Filter published articles
  const publishedArticles = articles.filter((a) => a.status === "published");

  // Top Lead Headline Article
  const heroArticle = publishedArticles.find((a) => a.isHero) || publishedArticles[0] || articles[0];
  const heroAuthor = authors?.find((a) => a.id === heroArticle?.authorId);

  // Sub Lead Articles (2 items next to Hero)
  const subHeroArticles = publishedArticles.filter((a) => a.id !== heroArticle?.id).slice(0, 2);

  // Main Bullet Headlines List (Under Hero)
  const subHeadlinesList = publishedArticles.filter(
    (a) => a.id !== heroArticle?.id && !subHeroArticles.some((sa) => sa.id === a.id)
  ).slice(0, 10);

  // e-Report Section Articles
  const eReportArticles = publishedArticles.filter(
    (a) => a.categoryId === "cat_policy" || a.categoryId === "cat_literacy"
  ).slice(0, 6);

  // Photo Section Articles (5 items)
  const photoArticles = publishedArticles.filter((a) => a.imageUrl || a.isPhoto).slice(0, 5);

  // Ranking News Articles (Top 10 by viewCount)
  const rankingArticles = [...publishedArticles]
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, 10);

  // New Exam/Admission News Articles
  const examArticles = publishedArticles.filter(
    (a) => a.categoryId === "cat_school" || a.categoryId === "cat_policy"
  ).slice(0, 5);

  // Tabbed Section Categories & Data (4대 핵심 보도 분야)
  const tabList = [
    { name: "정책·행정", catId: "cat_policy" },
    { name: "학교·교육", catId: "cat_school" },
    { name: "산업·에듀테크", catId: "cat_edtech" },
    { name: "리터러시·인재", catId: "cat_literacy" }
  ];

  const currentTabCatId = tabList[activeTab]?.catId;
  const currentTabArticles = publishedArticles.filter((a) => a.categoryId === currentTabCatId).slice(0, 5);

  // Culture / Poster slide articles
  const cultureArticles = publishedArticles.filter((a) => a.categoryId === "cat_edtech" || a.categoryId === "cat_school");
  const activeCultureArticle = cultureArticles[cultureSlide - 1] || cultureArticles[0] || heroArticle;

  return (
    <main className="bg-[#f4f5f7] min-h-screen text-[#222222] pb-12 font-sans relative" id="main-portal-front">
      
      {/* Main Content Area */}

      <div className="max-w-[1260px] mx-auto px-2 sm:px-4 py-4">

        {/* Category Header Banner if Category Selected */}
        {currentCategory && (() => {
          const matchedCat = categories.find((c) => c.id === currentCategory);
          if (!matchedCat) return null;
          return (
            <div className="bg-[#112443] text-white p-4 rounded-sm flex justify-between items-center text-left mb-4 shadow-sm">
              <div>
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">분야별 기사 모음</span>
                <h1 className="text-xl font-bold tracking-tight mt-0.5">{matchedCat.name}</h1>
              </div>
              <button
                onClick={() => onSelectCategory(null)}
                className="text-xs bg-white/10 hover:bg-white/20 text-white font-medium px-3 py-1.5 rounded transition cursor-pointer"
              >
                전체 메인 헤드라인 보기 &larr;
              </button>
            </div>
          );
        })()}

        {/* ================= MAIN 3-COLUMN LAYOUT ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          
          {/* ---------------- 1. LEFT COLUMN: Ad & Service Banners (hidden on small screens) ---------------- */}
          <div className="hidden lg:block lg:col-span-2 space-y-3 text-left">
            
            {/* Ad Banner 1: CCTV / 보안 모자이크 */}
            <div className="bg-white border border-gray-300 p-2.5 rounded-2xs shadow-2xs space-y-2">
              <div className="bg-slate-900 text-amber-300 font-bold text-[11px] px-2 py-1 rounded-2xs text-center">
                CCTV 모자이크
              </div>
              <div className="text-[11px] text-gray-700 space-y-1 font-medium leading-tight">
                <p className="font-bold text-blue-900">• 보안 철저</p>
                <p className="font-bold text-blue-900">• 신속 작업</p>
                <p className="font-bold text-blue-900">• 투명한 가격</p>
              </div>
              <div className="pt-1 border-t border-gray-200">
                <a
                  href="tel:02-6443-4222"
                  className="block bg-blue-700 hover:bg-blue-800 text-white font-bold text-[10px] text-center py-1.5 rounded transition"
                >
                  실시간 견적 문의
                </a>
                <span className="text-[9px] text-gray-400 text-center block mt-1">bdwide.co.kr</span>
              </div>
            </div>

            {/* Ad Banner 2: 선착순 모집 중 */}
            <div className="bg-white border border-gray-300 p-2.5 rounded-2xs shadow-2xs space-y-2">
              <span className="bg-red-700 text-white font-bold text-[10px] px-1.5 py-0.5 rounded-2xs inline-block">
                선착순 모집 중
              </span>
              <h4 className="text-xs font-bold text-gray-900 leading-tight">
                포성프로오 전문과정 과정 수강생 모집
              </h4>
              <p className="text-[10px] text-gray-500 leading-snug">
                포커스프로오 전공자 신속 및 과목 등급 신속 완비 과정
              </p>
              <button
                onClick={() => onNavigatePage?.("tip_article")}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold text-[10px] py-1 rounded transition cursor-pointer"
              >
                적응하기 &gt;
              </button>
            </div>

            {/* Ad Banner 3: 실제 경험자 보증합니다 */}
            <div className="bg-[#1e293b] text-white p-3 rounded-2xs text-center space-y-2 shadow-2xs border border-slate-700">
              <span className="text-[10px] font-bold text-amber-400 block uppercase">실제 경험자 보증합니다</span>
              <div className="flex justify-center gap-1 my-1">
                <span className="bg-amber-500 text-slate-900 font-black text-[9px] px-1 rounded">Lv.1</span>
                <span className="bg-amber-500 text-slate-900 font-black text-[9px] px-1 rounded">Lv.2</span>
                <span className="bg-amber-500 text-slate-900 font-black text-[9px] px-1 rounded">Lv.3</span>
                <span className="bg-amber-500 text-slate-900 font-black text-[9px] px-1 rounded">Lv.4</span>
              </div>
              <p className="text-[10px] text-slate-300">국가 인정 AI 리터러시 검정</p>
            </div>

            {/* Info Banner 4: 기사제보 및 제휴 문의 */}
            <div className="bg-blue-50 border border-blue-200 p-2.5 rounded-2xs text-center space-y-1.5">
              <h4 className="text-xs font-bold text-blue-900">한국AI교육신문</h4>
              <p className="text-[10px] text-blue-700">기사제보 &amp; 독자 의견</p>
              <button
                onClick={() => onNavigatePage?.("tip_article")}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold text-[11px] py-1.5 rounded cursor-pointer transition shadow-2xs"
              >
                기사제보 접수
              </button>
            </div>

          </div>

          {/* ---------------- 2. CENTER COLUMN: Main News Feed & Sections ---------------- */}
          <div className="lg:col-span-7 space-y-5 text-left bg-white p-4 border border-gray-300 rounded-2xs shadow-2xs">
            
            {/* Top Main Big Headline Title */}
            {heroArticle && (
              <div className="border-b-2 border-[#1a2e5a] pb-3">
                <h1
                  onClick={() => onSelectArticle(heroArticle.id)}
                  className={getFontSizeClass(
                    "text-xl sm:text-2xl font-black text-[#1a2e5a] hover:text-blue-700 cursor-pointer transition leading-tight tracking-tight font-serif-kr",
                    fontSize
                  )}
                >
                  {heroArticle.title}
                </h1>
              </div>
            )}

            {/* Hero Main Grid: Left Lead + Right 2 Sub Lead Cards */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pb-4 border-b border-gray-200">
              
              {/* Main Hero Card (Left - 7 cols) */}
              {heroArticle && (
                <div
                  onClick={() => onSelectArticle(heroArticle.id)}
                  className="md:col-span-7 cursor-pointer group flex flex-col justify-between space-y-2 border-b md:border-b-0 md:border-r border-gray-200 md:pr-4 pb-4 md:pb-0"
                >
                  {heroArticle.imageUrl && (
                    <div className="aspect-[16/10] bg-gray-100 overflow-hidden border border-gray-200 rounded-2xs relative">
                      <img
                        src={heroArticle.imageUrl}
                        alt={heroArticle.title}
                        className="w-full h-full object-cover group-hover:scale-102 transition duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-2 left-2 bg-blue-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                        AI 학생부 서평
                      </span>
                    </div>
                  )}
                  <div>
                    <h2 className={getFontSizeClass("text-base font-bold text-gray-900 group-hover:text-blue-700 leading-snug tracking-tight mt-1", fontSize)}>
                      {heroArticle.title}
                    </h2>
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mt-1.5">
                      {heroArticle.excerpt || heroArticle.content.replace(/<[^>]*>/g, '').slice(0, 100)}...
                    </p>
                    <div className="text-[11px] text-gray-400 mt-2 flex items-center gap-2 font-medium">
                      <span>{heroAuthor ? heroAuthor.name : "편집국 취재팀"}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub Lead Cards (Right - 5 cols) */}
              <div className="md:col-span-5 flex flex-col justify-between space-y-3">
                {subHeroArticles.map((art) => (
                  <div
                    key={art.id}
                    onClick={() => onSelectArticle(art.id)}
                    className="cursor-pointer group flex flex-col justify-between p-2 hover:bg-slate-50 rounded-2xs transition border border-gray-100"
                  >
                    {art.imageUrl && (
                      <div className="aspect-[16/9] bg-gray-100 overflow-hidden rounded-2xs border border-gray-200 mb-1.5">
                        <img
                          src={art.imageUrl}
                          alt={art.title}
                          className="w-full h-full object-cover group-hover:scale-102 transition"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                    <h3 className={getFontSizeClass("text-xs font-bold text-gray-800 group-hover:text-blue-700 line-clamp-2 leading-snug", fontSize)}>
                      {art.title}
                    </h3>
                  </div>
                ))}
              </div>

            </div>

            {/* Sub Headlines Bullet List (Below Hero) */}
            <div className="space-y-2 border-b border-gray-200 pb-5">
              <h3 className="text-xs font-bold text-gray-900 border-l-3 border-blue-900 pl-2 mb-2 uppercase tracking-wider">
                주요 이슈 및 교육 현장 소식
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                {subHeadlinesList.map((art) => (
                  <div
                    key={art.id}
                    onClick={() => onSelectArticle(art.id)}
                    className="cursor-pointer group flex items-start gap-1.5 text-xs text-gray-800 hover:text-blue-700 py-0.5 border-b border-gray-100 last:border-0"
                  >
                    <span className="text-blue-700 font-bold shrink-0">•</span>
                    <span className="truncate font-medium group-hover:underline">{art.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ================= SECTION B: e리포트 (e-Report) ================= */}
            <div className="space-y-3 pt-1 border-b border-gray-200 pb-5">
              <div className="flex items-center justify-between border-b-2 border-emerald-700 pb-1.5">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-700 text-white font-black text-xs px-2 py-0.5 rounded-2xs tracking-wider">
                    e리포트
                  </span>
                  <h3 className="text-sm font-bold text-gray-900">AI 심층 분석 및 교육 정책 리포트</h3>
                </div>
                <button onClick={() => onSelectCategory("cat_policy")} className="text-[11px] text-gray-500 hover:underline">
                  +더보기
                </button>
              </div>

              <div className="space-y-2">
                {eReportArticles.map((art) => (
                  <div
                    key={art.id}
                    onClick={() => onSelectArticle(art.id)}
                    className="p-2.5 bg-emerald-50/40 hover:bg-emerald-50 border border-emerald-100 rounded-2xs cursor-pointer group transition flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className={getFontSizeClass("text-xs font-bold text-gray-900 group-hover:text-emerald-800 truncate", fontSize)}>
                        {art.title}
                      </h4>
                      <p className="text-[11px] text-gray-600 line-clamp-1 mt-0.5">
                        {art.excerpt || art.content.replace(/<[^>]*>/g, '').slice(0, 80)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ================= SECTION C: [라이프&문화] 추억기획 공연 전시 & Multi-Tab Box ================= */}
            <div className="border-b border-gray-200 pb-5">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-slate-50 p-3 rounded-2xs border border-gray-200">
                
                {/* Left Poster / Cultural Feature Box (5 cols) */}
                <div className="md:col-span-5 border-b md:border-b-0 md:border-r border-gray-300 md:pr-3 pb-3 md:pb-0 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-900 truncate">
                      [라이프&amp;문화] 추억기획 공연 전시
                    </h3>
                    <div className="flex items-center gap-1 text-[10px] font-bold">
                      <button
                        onClick={() => setCultureSlide(1)}
                        className={`w-4 h-4 rounded text-center cursor-pointer ${cultureSlide === 1 ? "bg-slate-900 text-white" : "bg-gray-200 text-gray-700"}`}
                      >
                        1
                      </button>
                      <button
                        onClick={() => setCultureSlide(2)}
                        className={`w-4 h-4 rounded text-center cursor-pointer ${cultureSlide === 2 ? "bg-slate-900 text-white" : "bg-gray-200 text-gray-700"}`}
                      >
                        2
                      </button>
                      <button
                        onClick={() => setCultureSlide(3)}
                        className={`w-4 h-4 rounded text-center cursor-pointer ${cultureSlide === 3 ? "bg-slate-900 text-white" : "bg-gray-200 text-gray-700"}`}
                      >
                        3
                      </button>
                    </div>
                  </div>

                  {activeCultureArticle && (
                    <div
                      onClick={() => onSelectArticle(activeCultureArticle.id)}
                      className="cursor-pointer group space-y-2"
                    >
                      <div className="aspect-[16/10] bg-slate-900 overflow-hidden rounded-2xs relative border border-slate-700">
                        <img
                          src={activeCultureArticle.imageUrl || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800"}
                          alt={activeCultureArticle.title}
                          className="w-full h-full object-cover group-hover:opacity-90 transition"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2.5 text-white">
                          <span className="text-[10px] text-amber-300 font-bold">2026.7.4 - 8.23 국립극장 달오름극장</span>
                          <h4 className="text-xs font-bold truncate">{activeCultureArticle.title}</h4>
                        </div>
                      </div>
                      <p className="text-[11px] text-gray-600 line-clamp-2 leading-tight">
                        {activeCultureArticle.excerpt || "문화와 예술이 함께하는 차세대 감성 교육 기획 무대..."}
                      </p>
                    </div>
                  )}
                </div>

                {/* Right Tabbed Category Box (7 cols) */}
                <div className="md:col-span-7 space-y-3">
                  
                  {/* Category Tab Headers */}
                  <div className="flex items-center gap-1 overflow-x-auto scrollbar-none border-b border-gray-300 pb-1">
                    {tabList.map((tab, idx) => (
                      <button
                        key={tab.name}
                        onClick={() => setActiveTab(idx)}
                        className={`text-[11px] font-bold px-2 py-1 rounded-2xs whitespace-nowrap cursor-pointer transition ${
                          activeTab === idx
                            ? "bg-blue-900 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-200 border border-gray-200"
                        }`}
                      >
                        {tab.name}
                      </button>
                    ))}
                  </div>

                  {/* Active Tab Header + More Button */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-bold text-blue-900">
                      {tabList[activeTab]?.name} 뉴스
                    </span>
                    <button
                      onClick={() => onSelectCategory(currentTabCatId)}
                      className="text-[10px] text-blue-700 font-bold hover:underline flex items-center gap-0.5"
                    >
                      <span>+더보기</span>
                    </button>
                  </div>

                  {/* Active Tab Article List */}
                  <div className="space-y-1.5">
                    {currentTabArticles.map((art) => (
                      <div
                        key={art.id}
                        onClick={() => onSelectArticle(art.id)}
                        className="cursor-pointer group flex items-center justify-between text-xs text-gray-800 hover:text-blue-700 py-1 border-b border-gray-200/60 last:border-0"
                      >
                        <span className="truncate font-medium">• {art.title}</span>
                      </div>
                    ))}
                  </div>

                </div>

              </div>
            </div>

            {/* ================= SECTION D: 포토 (Photo Gallery Grid) ================= */}
            <div>
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-1.5 mb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-red-600 rounded-full inline-block"></span>
                  <span>포토 뉴스</span>
                </h3>
                <button onClick={() => onSelectCategory(null)} className="text-[11px] text-gray-500 hover:underline">
                  전체보기 &gt;
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {photoArticles.map((art, idx) => {
                  const sampleCaptions = [
                    "2026 AI교육혁신포럼",
                    "고품격 기사 이야기",
                    "날씨와 더 멀리",
                    "건강 나눔 재능기부",
                    "즐거운 학교현장"
                  ];
                  const captionLabel = sampleCaptions[idx % sampleCaptions.length];

                  return (
                    <div
                      key={art.id}
                      onClick={() => onSelectArticle(art.id)}
                      className="cursor-pointer group relative bg-slate-900 rounded-2xs overflow-hidden border border-gray-200 shadow-2xs aspect-[4/3]"
                    >
                      <img
                        src={art.imageUrl || "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=400"}
                        alt={art.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300 opacity-90 group-hover:opacity-100"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-slate-950/80 p-1.5 text-center">
                        <p className="text-[10px] font-bold text-white truncate">{art.title || captionLabel}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* ---------------- 3. RIGHT COLUMN: Ranking News & Field Briefing ---------------- */}
          <div className="lg:col-span-3 space-y-4 text-left">
            
            {/* Widget 1: 랭킹뉴스 (Ranking News) */}
            <div className="bg-white p-3.5 border border-gray-300 rounded-2xs shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-1.5">
                <h3 className="text-sm font-bold text-slate-900">가장 많이 본 뉴스</h3>
              </div>

              <div className="space-y-2">
                {rankingArticles.map((art, idx) => (
                  <div
                    key={art.id}
                    onClick={() => onSelectArticle(art.id)}
                    className="cursor-pointer group flex items-start gap-2 py-1 border-b border-gray-100 last:border-0"
                  >
                    <span
                      className={`w-4 h-4 shrink-0 rounded-2xs text-[10px] font-black text-center leading-4 ${
                        idx < 3
                          ? "bg-red-600 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <h4 className={getFontSizeClass("text-xs font-medium text-gray-800 group-hover:text-blue-700 line-clamp-2 leading-snug flex-1", fontSize)}>
                      {art.title}
                    </h4>
                  </div>
                ))}
              </div>
            </div>

            {/* Widget 3: [새소식] 수능/입시 */}
            <div className="bg-white p-3.5 border border-gray-300 rounded-2xs shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-1.5">
                <h3 className="text-sm font-bold text-slate-900">[새소식] 수능/입시</h3>
                <button
                  onClick={() => onSelectCategory("cat_school")}
                  className="text-[11px] text-gray-500 hover:underline"
                >
                  +더보기
                </button>
              </div>

              <div className="space-y-2">
                {examArticles.map((art, idx) => {
                  const tagLabels = ["[초등]", "[중등]", "[초등·중등]", "[입시]", "[연수]"];
                  const tag = tagLabels[idx % tagLabels.length];
                  return (
                    <div
                      key={art.id}
                      onClick={() => onSelectArticle(art.id)}
                      className="cursor-pointer group py-1 border-b border-gray-100 last:border-0 space-y-0.5"
                    >
                      <div className="flex items-center gap-1 text-[10px] text-blue-800 font-bold">
                        <span>학교급별</span>
                        <span className="text-red-700">{tag}</span>
                      </div>
                      <h4 className={getFontSizeClass("text-xs font-medium text-gray-800 group-hover:text-blue-700 line-clamp-2 leading-snug", fontSize)}>
                        {art.title}
                      </h4>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}
