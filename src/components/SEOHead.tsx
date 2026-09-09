import React from "react";
import { Helmet } from "react-helmet-async";
import { Article, Category, Author, SiteSetting } from "../types";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogType?: "website" | "article";
  ogImage?: string;
  article?: Article;
  category?: Category;
  author?: Author;
  siteSetting?: SiteSetting | null;
}

export default function SEOHead({
  title,
  description,
  keywords = [],
  canonicalUrl,
  ogType = "website",
  ogImage,
  article,
  category,
  author,
  siteSetting
}: SEOHeadProps) {
  const siteName = siteSetting?.newspaperName || "한국AI교육신문 (KAEN News)";
  const defaultDesc =
    siteSetting?.companyName
      ? `${siteName} - 대한민국 대표 인공지능·미래교육 전문지 CMS 플랫폼 및 언론사 뉴스 웹사이트`
      : "대한민국 대표 인공지능·미래교육 전문지 CMS 플랫폼 및 언론사 뉴스 웹사이트";

  // Fallback and derived fields
  const finalTitle = article
    ? `${article.title} | ${siteName}`
    : title
    ? `${title} | ${siteName}`
    : siteName;

  const rawExcerpt = article?.excerpt || description || defaultDesc;
  // Strip any HTML tags if present in excerpt
  const finalDescription = rawExcerpt.replace(/<[^>]*>/g, "").slice(0, 160).trim();

  // Keyword tags
  const combinedKeywords = Array.from(
    new Set([
      ...(article?.tags || []),
      ...keywords,
      "AI교육",
      "인공지능",
      "에듀테크",
      "한국AI교육신문",
      "공교육혁신",
      category?.name || "AI·미래교육"
    ])
  ).filter(Boolean);

  const keywordsString = combinedKeywords.join(", ");

  // Images
  const finalImage =
    article?.imageUrl ||
    ogImage ||
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1200";

  // Author
  const authorName = author?.name || "한국AI교육신문 취재팀";

  // Current URL
  const currentUrl =
    canonicalUrl ||
    (typeof window !== "undefined" ? window.location.href : "https://ai-kaen-news.ai.studio");

  const publishedDate = article?.createdAt || new Date().toISOString();
  const sectionName = category?.name || "AI·미래교육";

  // JSON-LD Structured Data for NewsArticle SEO
  const structuredData = article
    ? {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        "headline": article.title,
        "description": finalDescription,
        "image": [finalImage],
        "datePublished": publishedDate,
        "dateModified": publishedDate,
        "author": [
          {
            "@type": "Person",
            "name": authorName,
            "jobTitle": author?.role || "기자"
          }
        ],
        "publisher": {
          "@type": "NewsMediaOrganization",
          "name": siteName,
          "logo": {
            "@type": "ImageObject",
            "url": "https://ai-kaen-news.ai.studio/logo.png"
          }
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": currentUrl
        },
        "articleSection": sectionName,
        "keywords": keywordsString
      }
    : {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": siteName,
        "url": currentUrl,
        "description": finalDescription
      };

  return (
    <Helmet prioritizeSeoTags>
      {/* 1. Basic Metadata */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={keywordsString} />
      <meta name="author" content={authorName} />
      <link rel="canonical" href={currentUrl} />

      {/* 2. Open Graph / Facebook / KakaoTalk */}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={article ? article.title : finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:type" content={article ? "article" : ogType} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={article ? article.title : siteName} />
      <meta property="og:locale" content="ko_KR" />

      {/* Article Specific Open Graph */}
      {article && (
        <meta property="article:published_time" content={publishedDate} />
      )}
      {article && (
        <meta property="article:section" content={sectionName} />
      )}
      {article && (
        <meta property="article:author" content={authorName} />
      )}
      {article &&
        (article.tags || []).map((tag, idx) => (
          <meta key={`og-tag-${idx}`} property="article:tag" content={tag} />
        ))}

      {/* 3. Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@kaen_news" />
      <meta name="twitter:title" content={article ? article.title : finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />

      {/* 4. Structured Data (JSON-LD) for Search Engines & News aggregators */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
}
