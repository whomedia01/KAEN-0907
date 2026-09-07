import React, { useState, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import ReaderHeader from "./components/ReaderHeader";
import ReaderFooter from "./components/ReaderFooter";
import FrontPage from "./components/FrontPage";
import ArticleView from "./components/ArticleView";
import AdminPanel from "./components/AdminPanel";
import StaticPages from "./components/StaticPages";
import seedData from "../db_data.json";
import { Article, Category, Author, Comment, Revision, MediaItem, SiteSetting, AuditLog, MainLayoutItem } from "./types";

const defaultSiteSetting: SiteSetting = {
  newspaperName: "한국AI교육일보",
  companyName: "㈜후미디어",
  representative: "황광성",
  businessLicenseNo: "119-86-25861",
  address: "서울특별시 금천구 가산디지털2로 53 한라시그마밸리 1102호 ~ 1104호",
  phone: "02-6443-4222",
  fax: "02-6443-4230",
  email: "whomedia6104@gmail.com",
  youthOfficer: "황광성 (발행인·편집인)",
  grievanceOfficer: "황광성",
  privacyPolicy: "한국AI교육일보은 이용자의 개인정보를 보호하며 관련 법령을 엄격히 준수합니다.",
  termsOfService: "한국AI교육일보 서비스를 이용함에 있어 본 약관의 규정에 따릅니다.",
  youthPolicy: "한국AI교육일보은 청소년이 유해한 환경으로부터 보호받을 수 있도록 청소년 보호 정책을 실시합니다.",
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

  // Navigation Routing State
  // 'home' | 'article_detail' | 'admin' | static page types
  const [currentPage, setCurrentPage] = useState<string>("home");
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

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
        onClose={() => setCurrentPage("home")}
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
        onOpenAdmin={() => handleNavigatePage("admin")}
        fontSize={fontSize}
        setFontSize={setFontSize}
        readingMode={readingMode}
        setReadingMode={setReadingMode}
        onSearch={setSearchTerm}
        userRole={userRole}
        setUserRole={handleRoleShift}
        onNavigatePage={handleNavigatePage}
      />

      {/* Main Dynamic Viewport */}
      <div className="flex-grow">
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
