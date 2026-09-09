import React, { useState, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import ReaderHeader from "./components/ReaderHeader";
import ReaderFooter from "./components/ReaderFooter";
import FrontPage from "./components/FrontPage";
import ArticleView from "./components/ArticleView";
import AdminPanel from "./components/AdminPanel";
import StaticPages from "./components/StaticPages";
import SEOHead from "./components/SEOHead";
import seedData from "../db_data.json";
import { Article, Category, Author, Comment, Revision, MediaItem, SiteSetting, AuditLog, MainLayoutItem } from "./types";

const defaultSiteSetting: SiteSetting = {
  newspaperName: "한국AI교육신문",
  companyName: "(주)후미디어",
  representative: "황광성",
  businessLicenseNo: "119-86-25861",
  registrationNo: "",
  registrationDate: "",
  address: "서울특별시 금천구 가산디지털2로 53 (가산동) 한라시그마밸리 1102호 ~ 1104호",
  phone: "02-6443-4222",
  fax: "02-6443-4223",
  email: "whomedia03@gmail.com",
  youthOfficer: "황광성",
  grievanceOfficer: "황광성",
  privacyPolicy: "한국AI교육신문은 이용자의 개인정보를 보호하며 관련 법령을 엄격히 준수합니다.",
  termsOfService: "한국AI교육신문 서비스를 이용함에 있어 본 약관의 규정에 따릅니다.",
  youthPolicy: "한국AI교육신문은 청소년이 유해한 환경으로부터 보호받을 수 있도록 청소년 보호 정책을 실시합니다.",
  correctionGuide: "기사 내용 중 오보나 정정이 필요한 사항은 편집국 이메일로 접수해 주시면 확인 후 조치합니다.",
  tipGuide: "인공지능 교육 현장 소식, 독자 제보, 보도자료를 상시 접수합니다.",
  logoUrl: "/logo.png",
  adsenseApproved: true,
  adsenseActive: true
};

export default function App() {
  // State initialized with preloaded seedData for instantaneous zero-latency display,
  // then seamlessly revalidated in the background via Express API
  const [articles, setArticles] = useState<Article[]>((seedData.articles as Article[]) || []);
  const [categories, setCategories] = useState<Category[]>((seedData.categories as Category[]) || []);
  const [authors, setAuthors] = useState<Author[]>((seedData.authors as Author[]) || []);
  const [comments, setComments] = useState<Comment[]>((seedData.comments as Comment[]) || []);
  const [revisions, setRevisions] = useState<Revision[]>((seedData.revisions as Revision[]) || []);
  const [media, setMedia] = useState<MediaItem[]>((seedData.media as MediaItem[]) || []);
  const [siteSetting, setSiteSetting] = useState<SiteSetting>((seedData.siteSetting as SiteSetting) || defaultSiteSetting);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>((seedData.auditLogs as AuditLog[]) || []);
  const [layoutSettings, setLayoutSettings] = useState<MainLayoutItem[]>((seedData.layoutSettings as MainLayoutItem[]) || []);

  // Layout / Display State
  const [fontSize, setFontSize] = useState<number>(1); // 1 = Standard, 2 = Medium, 3 = Large
  const [readingMode, setReadingMode] = useState<boolean>(false); // Distraction-free reading toggle
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Role Control
  const [userRole, setUserRole] = useState<'Admin' | 'Editor' | 'Reporter' | 'Citizen' | 'Viewer'>('Admin');
  const [userName, setUserName] = useState<string>("황광성 발행인");
  const [userId, setUserId] = useState<string>("auth_publisher");

  // Check if current URL is the admin entry path (/adm or #adm)
  const checkIsAdminPath = () => {
    if (typeof window === "undefined") return false;
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    return path === "/adm" || path === "/adm/" || hash === "#adm" || hash === "#/adm";
  };

  // Navigation Routing State
  // 'home' | 'article_detail' | 'admin' | static page types
  const [currentPage, setCurrentPage] = useState<string>(() => (checkIsAdminPath() ? "admin" : "home"));
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // Synchronize browser URL location for /adm access
  useEffect(() => {
    const handleUrlChange = () => {
      if (checkIsAdminPath()) {
        setCurrentPage("admin");
      } else if (window.location.pathname === "/" && currentPage === "admin") {
        setCurrentPage("home");
      }
    };

    window.addEventListener("popstate", handleUrlChange);
    window.addEventListener("hashchange", handleUrlChange);
    return () => {
      window.removeEventListener("popstate", handleUrlChange);
      window.removeEventListener("hashchange", handleUrlChange);
    };
  }, [currentPage]);

  // Dynamic SEO metadata computation for non-article views
  const getPageSeoProps = () => {
    const siteName = siteSetting?.newspaperName || "한국AI교육신문 (KAEN News)";
    if (currentPage === "home") {
      if (selectedCategoryId) {
        const cat = categories.find((c) => c.id === selectedCategoryId);
        return {
          title: cat ? `${cat.name}` : siteName,
          description: `${cat ? cat.name : "주요 뉴스"} - 대한민국 대표 인공지능 미래교육 전문지 실시간 보도`,
          ogType: "website" as const
        };
      }
      if (searchTerm) {
        return {
          title: `'${searchTerm}' 검색 결과`,
          description: `'${searchTerm}' 관련 한국AI교육신문 보도 기사 검색 결과`,
          ogType: "website" as const
        };
      }
      return {
        title: `${siteName} - 대한민국 대표 AI 공교육 정론직필`,
        description: "대한민국 대표 인공지능·미래교육 전문지 한국AI교육신문 CMS 플랫폼 및 정론직필 언론사 뉴스 웹사이트",
        ogType: "website" as const
      };
    }
    if (currentPage === "admin") {
      return {
        title: `통합 CMS 종합편집국 관리센터`,
        description: "한국AI교육신문 통합 기사 발행 및 편집 관리 시스템",
        ogType: "website" as const
      };
    }
    const staticTitles: Record<string, string> = {
      about_company: "신문사 소개 및 발행인 인사말",
      ethics_charter: "신문윤리강령 및 보도준칙",
      reporters: "취재진 및 편집국 기자 소개",
      tip_article: "독자 기사 제보 및 보도자료 접수",
      correction: "정정보도 및 고충처리 청구",
      terms_of_service: "이용약관",
      privacy_policy: "개인정보처리방침",
      youth_policy: "청소년보호정책",
      rss_feed: "RSS 피드 서비스",
      sitemap: "사이트맵"
    };
    return {
      title: `${staticTitles[currentPage] || "안내"}`,
      description: `${siteName} ${staticTitles[currentPage] || "안내"} 공식 페이지입니다.`,
      ogType: "website" as const
    };
  };

  // Fetch all CMS data from full-stack Express API with resilient error boundaries
  const refreshAllData = async () => {
    try {
      const safeFetchJson = async (url: string, fallback: any) => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 4000);
          const res = await fetch(url, { signal: controller.signal });
          clearTimeout(timeoutId);
          if (!res.ok) return fallback;
          return await res.json();
        } catch {
          return fallback;
        }
      };

      const [
        dataArticles,
        dataCategories,
        dataAuthors,
        dataComments,
        dataMedia,
        dataSettings,
        dataAudit,
        dataLayout,
        dataRevisions
      ] = await Promise.all([
        safeFetchJson("/api/articles", []),
        safeFetchJson("/api/categories", []),
        safeFetchJson("/api/authors", []),
        safeFetchJson("/api/comments", []),
        safeFetchJson("/api/media", []),
        safeFetchJson("/api/site-settings", defaultSiteSetting),
        safeFetchJson("/api/audit-log", []),
        safeFetchJson("/api/layout-settings", []),
        safeFetchJson("/api/revisions", [])
      ]);

      if (Array.isArray(dataArticles)) setArticles(dataArticles);
      if (Array.isArray(dataCategories)) setCategories(dataCategories);
      if (Array.isArray(dataAuthors)) setAuthors(dataAuthors);
      if (Array.isArray(dataComments)) setComments(dataComments);
      if (Array.isArray(dataMedia)) setMedia(dataMedia);
      if (dataSettings && typeof dataSettings === "object") setSiteSetting(dataSettings);
      if (Array.isArray(dataAudit)) setAuditLogs(dataAudit);
      if (Array.isArray(dataLayout)) setLayoutSettings(dataLayout);
      if (Array.isArray(dataRevisions)) setRevisions(dataRevisions);
    } catch (err) {
      console.error("Failed to sync backend DB state:", err);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  // Post new comment to Express backend
  const handlePostComment = async (authorName: string, authorEmail: string, content: string) => {
    if (!selectedArticleId) return;
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articleId: selectedArticleId,
          authorName,
          authorEmail,
          content,
          status: userRole === "Admin" || userRole === "Editor" ? "approved" : "pending"
        })
      });

      if (res.ok) {
        await refreshAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Helper trigger role profile shift
  const handleRoleShift = (role: 'Admin' | 'Editor' | 'Reporter' | 'Citizen' | 'Viewer') => {
    setUserRole(role);
    if (role === 'Admin') {
      setUserName("황광성 발행인");
      setUserId("auth_publisher");
    } else if (role === 'Editor') {
      setUserName("편집국 취재팀");
      setUserId("auth_editorial");
    } else if (role === 'Reporter') {
      setUserName("교육정책 취재팀");
      setUserId("auth_policy");
    } else if (role === 'Citizen') {
      setUserName("시민 기고자");
      setUserId("auth_citizen");
    } else {
      setUserName("방문 독자");
      setUserId("viewer_guest");
    }
  };

  // Filter articles for reader front-end based on search and category
  const getFilteredArticlesForReader = () => {
    let result = [...articles];

    // Exclude drafts unless in CMS
    result = result.filter((a) => a.status === "published");

    if (selectedCategoryId) {
      result = result.filter((a) => a.categoryId === selectedCategoryId);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(term) ||
          a.excerpt.toLowerCase().includes(term) ||
          a.content.toLowerCase().includes(term)
      );
    }

    return result;
  };

  const handleSelectArticle = (id: string) => {
    setSelectedArticleId(id);
    setCurrentPage("article_detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewIncrement = (articleId: string, newCount: number) => {
    setArticles((prev) =>
      prev.map((art) => (art.id === articleId ? { ...art, viewCount: newCount } : art))
    );
  };

  const handleSelectCategory = (id: string | null) => {
    setSelectedCategoryId(id);
    setSelectedArticleId(null);
    setCurrentPage("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigatePage = (page: string) => {
    if (page === "admin") {
      if (typeof window !== "undefined" && window.location.pathname !== "/adm") {
        window.history.pushState({}, "", "/adm");
      }
    } else {
      if (typeof window !== "undefined" && (window.location.pathname === "/adm" || window.location.pathname === "/adm/")) {
        window.history.pushState({}, "", "/");
      }
    }
    if (page === "home") {
      setSelectedArticleId(null);
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const selectedArticle = articles.find((a) => a.id === selectedArticleId);

  // If we are currently inside the fullscreen Admin CMS, do not render reader headers
  if (currentPage === "admin") {
    return (
      <AdminPanel
        articles={articles}
        categories={categories}
        authors={authors}
        comments={comments}
        revisions={revisions}
        media={media}
        siteSetting={siteSetting}
        auditLogs={auditLogs}
        layoutSettings={layoutSettings}
        userRole={userRole}
        userName={userName}
        userId={userId}
        onRefreshAll={refreshAllData}
        onClose={() => {
          if (typeof window !== "undefined" && (window.location.pathname === "/adm" || window.location.pathname === "/adm/")) {
            window.history.pushState({}, "", "/");
          }
          setCurrentPage("home");
        }}
      />
    );
  }

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      readingMode ? "bg-amber-50/5 text-neutral-800" : "bg-neutral-50 text-neutral-800"
    }`} id="site-root-layout">
      {/* Reader Layout Header */}
      <ReaderHeader
        categories={categories}
        articles={articles}
        currentCategory={selectedCategoryId}
        onSelectCategory={handleSelectCategory}
        onSelectArticle={handleSelectArticle}
        fontSize={fontSize}
        setFontSize={setFontSize}
        readingMode={readingMode}
        setReadingMode={setReadingMode}
        onSearch={setSearchTerm}
        onNavigatePage={handleNavigatePage}
      />

      {/* Main Dynamic Viewport */}
      <div className="flex-grow">
        {/* Dynamic SEO & OpenGraph Head Tag for non-article views */}
        {currentPage !== "article_detail" && (
          <SEOHead
            title={getPageSeoProps().title}
            description={getPageSeoProps().description}
            ogType={getPageSeoProps().ogType}
            siteSetting={siteSetting}
          />
        )}

        <AnimatePresence mode="wait">
          {currentPage === "home" && (
            <FrontPage
              articles={getFilteredArticlesForReader()}
              categories={categories}
              layoutSettings={layoutSettings}
              authors={authors}
              onSelectArticle={handleSelectArticle}
              onSelectCategory={handleSelectCategory}
              fontSize={fontSize}
              currentCategory={selectedCategoryId}
              onNavigatePage={handleNavigatePage}
            />
          )}

          {currentPage === "article_detail" && selectedArticle && (
            <ArticleView
              article={selectedArticle}
              articles={articles}
              onSelectArticle={handleSelectArticle}
              categories={categories}
              authors={authors}
              comments={comments}
              siteSetting={siteSetting}
              onPostComment={handlePostComment}
              onBack={() => handleNavigatePage("home")}
              fontSize={fontSize}
              readingMode={readingMode}
              onViewIncrement={handleViewIncrement}
            />
          )}

          {[
            "about_company",
            "ethics_charter",
            "reporters",
            "tip_article",
            "correction",
            "terms_of_service",
            "privacy_policy",
            "youth_policy",
            "rss_feed",
            "sitemap"
          ].includes(currentPage) && (
            <StaticPages
              pageType={currentPage as any}
              authors={authors}
              articles={articles}
              categories={categories}
              settings={siteSetting}
              onBack={() => handleNavigatePage("home")}
              onSelectArticle={handleSelectArticle}
              onSelectCategory={handleSelectCategory}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Reader Legal Footer */}
      <ReaderFooter
        settings={siteSetting}
        onNavigateToPage={handleNavigatePage}
      />
    </div>
  );
}
