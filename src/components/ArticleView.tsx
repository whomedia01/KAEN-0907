import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowLeft, BadgeHelp, Heart } from "lucide-react";
import { Article, Category, Author, Comment, SiteSetting } from "../types";
import SEOHead from "./SEOHead";

interface ArticleViewProps {
  article: Article;
  articles: Article[];
  onSelectArticle: (id: string) => void;
  categories: Category[];
  authors: Author[];
  comments: Comment[];
  siteSetting: SiteSetting | null;
  onPostComment: (authorName: string, authorEmail: string, content: string) => void;
  onBack: () => void;
  fontSize: number;
  readingMode: boolean;
  onViewIncrement?: (articleId: string, newCount: number) => void;
}

export default function ArticleView({
  article,
  articles,
  onSelectArticle,
  categories,
  authors,
  comments,
  siteSetting,
  onPostComment,
  onBack,
  fontSize,
  readingMode,
  onViewIncrement
}: ArticleViewProps) {
  // Real-time View Count State
  const [currentViewCount, setCurrentViewCount] = useState<number>(article.viewCount || 0);

  const matchedCategory = categories.find((c) => c.id === article.categoryId);
  const matchedAuthor = authors.find((a) => a.id === article.authorId);

  // Dynamically increment real view count upon opening article
  useEffect(() => {
    setCurrentViewCount(article.viewCount || 0);
    if (article?.id) {
      fetch(`/api/articles/${article.id}/view`, { method: "POST" })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && typeof data.viewCount === "number") {
            setCurrentViewCount(data.viewCount);
            if (onViewIncrement) {
              onViewIncrement(article.id, data.viewCount);
            }
          }
        })
        .catch((err) => console.error("Failed to increment view count:", err));
    }
  }, [article.id]);

  // Generate dynamic font size classes
  const getFontSizeClass = (type: "title" | "body" | "meta") => {
    if (fontSize === 1) {
      if (type === "title") return "text-[28px] md:text-[32px] font-sans font-bold text-neutral-900 leading-snug tracking-tight";
      if (type === "body") return "text-[16px] md:text-[17px] text-[#1f2937] leading-[1.8] font-sans";
      return "text-xs text-neutral-500 font-sans";
    }
    if (fontSize === 2) {
      if (type === "title") return "text-[32px] md:text-[34px] font-sans font-bold text-neutral-900 leading-snug tracking-tight";
      if (type === "body") return "text-[17px] md:text-[18px] text-[#1f2937] leading-[1.8] font-sans";
      return "text-sm text-neutral-500 font-sans";
    }
    // fontSize === 3
    if (type === "title") return "text-[36px] md:text-[38px] font-sans font-bold text-neutral-900 leading-snug tracking-tight";
    if (type === "body") return "text-[19px] md:text-[20px] text-[#111827] leading-[1.85] font-sans";
    return "text-base text-neutral-500 font-sans";
  };

  // Prepend standard newspaper byline prefix to the first paragraph and strip layout artifacts
  const getProcessedContent = () => {
    let content = article.content;

    // 1. Remove all subheadings completely to make the text one continuous flow
    content = content.replace(/<h2[^>]*>.*?<\/h2>/gi, "");
    content = content.replace(/<h3[^>]*>.*?<\/h3>/gi, "");
    
    // 2. Convert blockquotes to standard paragraphs
    content = content.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, "<p>$1</p>");
    
    // 3. Convert lists to standard paragraphs to preserve content in a clean, unified news run
    content = content.replace(/<li[^>]*>(.*?)<\/li>/gi, "<p>• $1</p>");
    content = content.replace(/<\/?(ul|ol)>/gi, "");
    
    // 4. Strip tables as they don't belong in a text-focused standard newspaper run
    content = content.replace(/<table[^>]*>.*?<\/table>/gi, "");
    
    // 5. Strip inline figures to prevent duplicate images or broken templates
    content = content.replace(/<figure[^>]*>.*?<\/figure>/gi, "");

    // 6. Clean up trailing or empty paragraphs
    content = content.replace(/<p>\s*<\/p>/gi, "");
    content = content.replace(/<p>&nbsp;<\/p>/gi, "");

    const authorName = matchedAuthor ? matchedAuthor.name : "편집국 취재팀";
    const isTeam = authorName.includes("취재팀") || authorName.includes("편집국") || authorName.includes("발행인") || authorName.includes("편집인");
    const authorRole = isTeam ? "" : (matchedAuthor ? (matchedAuthor.role === 'Reporter' ? '기자' : matchedAuthor.role === 'Admin' ? '발행인' : matchedAuthor.role) : "");
    const newspaper = siteSetting?.newspaperName || "한국AI교육신문";
    const byline = authorRole ? `[${newspaper} = ${authorName} ${authorRole}]` : `[${newspaper} = ${authorName}]`;
    
    // Check if a dateline like [한국AI교육신문 = ...] or author byline is already present in content to prevent duplication
    const hasDateline = /\[[^\]]*=[^\]]*\]/.test(content) || content.includes(byline);
    
    if (!hasDateline) {
      // Find the first <p> or paragraph beginning and prepend it inside
      const pIndex = content.indexOf("<p>");
      if (pIndex !== -1) {
        content = content.slice(0, pIndex + 3) + `${byline} ` + content.slice(pIndex + 3);
      } else {
        content = `<p>${byline} </p>` + content;
      }
    }
    return content;
  };

  // Date Formatter (YYYY년 MM월 DD일 HH시 mm분 ss초)
  const formatArticleDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const pad = (n: number) => n.toString().padStart(2, '0');
      const year = d.getFullYear();
      const month = pad(d.getMonth() + 1);
      const date = pad(d.getDate());
      const hours = pad(d.getHours());
      const minutes = pad(d.getMinutes());
      const seconds = pad(d.getSeconds());
      return `${year}년 ${month}월 ${date}일 ${hours}시 ${minutes}분 ${seconds}초`;
    } catch (e) {
      return dateStr;
    }
  };

  // Parse summary bullet highlights (Split by sentences or newlines)
  const highlightLines = article.excerpt
    ? article.excerpt
        .split(/[.\n]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 6)
    : [];

  // Articles written by the same author
  const reporterArticles = articles
    .filter((a) => a.authorId === article.authorId && a.id !== article.id && a.status === "published")
    .slice(0, 3);

  // If there aren't enough articles by the reporter, backfill with top popular articles
  if (reporterArticles.length < 3) {
    const backfill = articles
      .filter((a) => a.id !== article.id && a.status === "published" && !reporterArticles.some((r) => r.id === a.id))
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, 3 - reporterArticles.length);
    reporterArticles.push(...backfill);
  }

  // Like system (Using local storage to persist locally; initialized to 0 without arbitrary random counts)
  const [likeCount, setLikeCount] = useState(() => {
    const stored = localStorage.getItem(`likes_${article.id}`);
    return stored ? parseInt(stored, 10) : 0;
  });

  const handleLike = () => {
    const nextCount = likeCount + 1;
    setLikeCount(nextCount);
    localStorage.setItem(`likes_${article.id}`, nextCount.toString());
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`max-w-[800px] mx-auto px-4 md:px-6 py-8 ${readingMode ? "bg-amber-50/10" : "bg-white"}`}
      id="main-content"
    >
      {/* Dynamic React Helmet SEO & OpenGraph Head Tag Management */}
      <SEOHead
        article={article}
        category={matchedCategory}
        author={matchedAuthor}
        siteSetting={siteSetting}
        canonicalUrl={typeof window !== "undefined" ? window.location.href : undefined}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Article Body Column */}
        <div className="lg:col-span-12">
          {/* Back button */}
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-sky-700 transition mb-6 font-pretendard"
            id="btn-back-to-home"
          >
            <ArrowLeft className="h-4 w-4" /> 목록으로 돌아가기
          </button>

          {/* Breadcrumb matching exact "Home > AI 정책" format */}
          <nav className="text-xs text-neutral-400 font-medium mb-2.5 flex items-center gap-1 font-pretendard" aria-label="Breadcrumb">
            <span className="hover:underline cursor-pointer" onClick={onBack}>Home</span>
            <span className="text-neutral-300 mx-1">&gt;</span>
            <span className="text-neutral-700 font-bold">
              {matchedCategory ? matchedCategory.name.split("/")[0] : "AI 정책"}
            </span>
          </nav>

          {/* Title (Pretendard, Bold, 크기 32px) */}
          <h1 className={`${getFontSizeClass("title")} mb-3 tracking-tight font-pretendard font-bold text-neutral-900`}>
            {article.title}
          </h1>

          {/* Meta Header Byline Block */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-600 mb-4 font-pretendard bg-slate-50 p-2.5 rounded border border-gray-200">
            <span className="font-bold text-neutral-900">
              취재: {matchedAuthor ? matchedAuthor.name : "편집국 취재팀"} ({matchedAuthor?.email || siteSetting?.email || "whomedia03@gmail.com"})
            </span>
            <span className="text-neutral-300 mx-1">|</span>
            <span>
              발행일시: {formatArticleDate(article.createdAt)}
            </span>
          </div>

          {/* Spacing Thin divider line */}
          <div className="border-b border-neutral-200 mb-5" />

          {/* Subtitles / Highlights bullet block exactly below divider */}
          {highlightLines.length > 0 && (
            <div className="my-5 space-y-1.5 border-l-2 border-neutral-300 pl-3.5 py-0.5 font-sans">
              {highlightLines.map((line, idx) => (
                <p key={idx} className="text-[13px] md:text-[14px] font-bold text-neutral-700 leading-relaxed">
                  ◇ {line}
                </p>
              ))}
            </div>
          )}

          {/* Featured Header Media graphic */}
          {article.imageUrl && (
            <figure className="mb-6 overflow-hidden rounded-sm border border-neutral-200 bg-neutral-50 group" id="article-figure">
              <div className="relative aspect-16/10 overflow-hidden">
                <img
                  src={article.imageUrl}
                  alt={article.imageCaption || article.title}
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-101"
                  referrerPolicy="no-referrer"
                />
              </div>
              <figcaption className="p-2.5 bg-neutral-50 border-t border-neutral-200 text-[10px] text-neutral-500 leading-relaxed flex flex-col sm:flex-row justify-between gap-2 font-sans">
                <div>
                  <span className="font-bold text-neutral-700">[사진 설명]</span> {article.imageCaption || "기사 내용을 풍부하게 보조하는 현장 스케치 사진"}
                </div>
                <div className="text-neutral-400 text-[9px] font-mono sm:text-right whitespace-nowrap">
                  출처: {article.imageCopyright || "신문사 라이브러리 제공"}
                </div>
              </figcaption>
            </figure>
          )}

          {/* Raw HTML Rich content displaying */}
          <div
            className={`markdown-body prose max-w-none font-sans font-pretendard ${getFontSizeClass("body")} mb-6 text-neutral-800`}
            dangerouslySetInnerHTML={{ __html: getProcessedContent() }}
            id="article-body-content"
          />

          {/* Copyright & Statutory Press Notice block directly below article content */}
          <div className="bg-slate-50 border border-slate-200/80 rounded p-3.5 my-6 space-y-1.5 text-xs text-slate-600 select-none font-sans text-left">
            <div className="flex flex-wrap items-center justify-between gap-2 font-bold text-slate-800 text-[11px] md:text-xs">
              <span>[저작권자ⓒ {siteSetting?.newspaperName || "한국AI교육신문"}. 무단전재-재배포 금지]</span>
              <span className="text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-[10px] font-mono">
                저작권법 제28조 정당한 인용 원칙 준수
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-500">
              본 기사의 무단 복제, 전재, 재배포 및 AI(인공지능) 생성형 모델의 무단 학습·크롤링 데이터 수집을 엄격히 금합니다. 저작권법 제28조(공표된 저작물의 인용)에 의거 보도·비평·교육 등을 위하여 인용할 시에는 출처('{siteSetting?.newspaperName || "한국AI교육신문"}') 및 기자명을 명확히 기재하여야 합니다.
            </p>
          </div>

          {/* Tags list (Grouped list of hashtag lines as requested) */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-col gap-1 my-6 text-xs text-slate-500 font-medium font-sans">
              {article.tags.map((t, idx) => (
                <span
                  key={idx}
                  className="hover:text-sky-700 cursor-pointer w-fit"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Reporter info and dynamic Popular Articles */}
          <div className="border-t-2 border-neutral-900 pt-5 mt-8 font-sans">
            <div className="text-sm font-bold text-neutral-900 mb-1">
              {matchedAuthor ? matchedAuthor.name : "편집국 취재팀"}
            </div>
            <p className="text-xs text-neutral-500 mb-4 leading-relaxed">
              {matchedAuthor?.bio || "한국AI교육신문 종합 편집국 취재팀입니다."}
            </p>

            {/* Reporter's Hot Articles Box */}
            <div className="bg-neutral-50 p-4 rounded-sm border border-neutral-200/80 mt-3">
              <h4 className="text-xs font-bold text-neutral-800 mb-2.5">
                {matchedAuthor?.name?.includes("취재팀") || !matchedAuthor ? "편집국 관련 기사" : `${matchedAuthor.name} 기자의 주요 기사`}
              </h4>
              <ul className="space-y-2">
                {reporterArticles.map((art) => (
                  <li
                    key={art.id}
                    onClick={() => onSelectArticle(art.id)}
                    className="text-xs text-neutral-600 hover:text-sky-700 hover:underline cursor-pointer flex items-start gap-1.5"
                  >
                    <span className="text-neutral-400 font-bold">•</span>
                    <span>{art.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Bar (좋아요) */}
          <div className="flex flex-wrap items-center justify-between gap-3 py-4 border-y border-neutral-200 my-8 font-sans">
            <div className="flex items-center gap-3">
              <button
                onClick={handleLike}
                className="flex items-center gap-1.5 text-xs font-bold text-neutral-700 hover:text-rose-600 transition px-4 py-2 rounded border border-neutral-200 hover:border-rose-300 bg-white cursor-pointer shadow-2xs"
                id="btn-article-like"
              >
                <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
                <span>좋아요 {likeCount}</span>
              </button>
            </div>
          </div>

          {/* FAQ Accordion section (strictly matching "FAQ 자동 생성, Meta, Schema, FAQ") */}
          {article.faqList && article.faqList.length > 0 && (
            <div className="bg-neutral-50 border border-neutral-200 rounded p-4 mb-6 font-sans" id="article-faq-container">
              <h3 className="text-xs font-bold text-neutral-900 mb-3 flex items-center gap-1.5">
                <BadgeHelp className="h-4 w-4 text-sky-600" />
                <span>이 뉴스에 대해 자주 묻는 질문 (FAQ)</span>
              </h3>
              <div className="space-y-3">
                {article.faqList.map((faq, idx) => (
                  <div key={idx} className="border-b border-neutral-200/50 pb-2.5 last:border-0 last:pb-0">
                    <h4 className="text-xs font-bold text-neutral-900 flex items-start gap-1.5 mb-1">
                      <span className="text-sky-700 font-extrabold">Q{idx + 1}.</span>
                      <span>{faq.q}</span>
                    </h4>
                    <p className="text-xs text-neutral-600 leading-relaxed pl-5">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}

