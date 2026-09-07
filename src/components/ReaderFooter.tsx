import React from "react";
import { SiteSetting } from "../types";

interface ReaderFooterProps {
  settings: SiteSetting;
  onNavigateToPage: (page: string) => void;
}

export default function ReaderFooter({ settings, onNavigateToPage }: ReaderFooterProps) {
  
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLinkClick = (e: React.MouseEvent, page: string) => {
    e.preventDefault();
    onNavigateToPage(page);
  };

  return (
    <footer className="bg-white text-slate-700 border-t border-slate-300 py-8 px-4 font-sans text-left select-none" id="site-footer">
      <div className="max-w-[1200px] mx-auto space-y-6">
        
        {/* 1. Policy Link Navigation Area (Strict South Korea Internet News Legal Compliance) */}
        <div className="flex flex-wrap items-center justify-start gap-x-3 gap-y-2 text-[13px] md:text-[14px] text-slate-700 border-b border-slate-200 pb-4 font-medium break-keep">
          <a
            href="#"
            onClick={(e) => handleLinkClick(e, "about_company")}
            className="hover:text-blue-800 hover:underline cursor-pointer text-slate-700 font-normal"
          >
            회사소개
          </a>
          <span className="text-slate-300">|</span>
          <a
            href="#"
            onClick={(e) => handleLinkClick(e, "ethics_charter")}
            className="hover:text-blue-800 hover:underline cursor-pointer text-slate-700 font-normal"
          >
            윤리강령·편집규약
          </a>
          <span className="text-slate-300">|</span>
          <a
            href="#"
            onClick={(e) => handleLinkClick(e, "terms_of_service")}
            className="hover:text-blue-800 hover:underline cursor-pointer text-slate-700 font-normal"
          >
            이용약관
          </a>
          <span className="text-slate-300">|</span>
          {/* Mandatory Legal Requirement: Privacy Policy styled with bold emphasis */}
          <a
            href="#"
            onClick={(e) => handleLinkClick(e, "privacy_policy")}
            className="font-bold text-slate-900 hover:text-blue-800 hover:underline cursor-pointer"
          >
            개인정보처리방침
          </a>
          <span className="text-slate-300">|</span>
          {/* Mandatory Legal Requirement: Youth Protection Policy styled with bold emphasis */}
          <a
            href="#"
            onClick={(e) => handleLinkClick(e, "youth_policy")}
            className="font-bold text-slate-900 hover:text-blue-800 hover:underline cursor-pointer"
          >
            청소년보호정책
          </a>
          <span className="text-slate-300">|</span>
          <a
            href="#"
            onClick={(e) => handleLinkClick(e, "tip_article")}
            className="hover:text-blue-800 hover:underline cursor-pointer text-slate-700 font-normal"
          >
            기사제보
          </a>
          <span className="text-slate-300">|</span>
          <a
            href="#"
            onClick={(e) => handleLinkClick(e, "correction")}
            className="hover:text-blue-800 hover:underline cursor-pointer text-slate-700 font-normal"
          >
            고충처리인·정정보도청구
          </a>
        </div>

        {/* 2. Press & Corporate Statutory Information Area */}
        <div className="relative space-y-3 font-sans text-left">
          
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-bareun-batang">
                {settings?.newspaperName || "한국AI교육일보"}
              </h2>
            </div>
            
            <button
              onClick={handleScrollToTop}
              className="border border-slate-300 bg-white px-3 py-1 rounded text-[12px] font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            >
              ▲ 맨위로
            </button>
          </div>

          <div className="text-[12px] text-slate-600 leading-relaxed space-y-1.5 pt-1">
            <div className="flex flex-wrap gap-x-3 gap-y-1 items-center">
              <span><strong>인터넷신문 등록번호:</strong> {settings?.registrationNo || "서울 아 05412"}</span>
              <span className="text-slate-300">|</span>
              <span><strong>등록연월일:</strong> {settings?.registrationDate || "2026.08.01"}</span>
              <span className="text-slate-300">|</span>
              <span><strong>발행인·편집인:</strong> {settings?.representative || "황광성"}</span>
              <span className="text-slate-300">|</span>
              <span><strong>청소년보호책임자:</strong> {settings?.youthOfficer || "황광성"} ({settings?.phone || "02-6443-4222"})</span>
              <span className="text-slate-300">|</span>
              <span><strong>고충처리인:</strong> {settings?.grievanceOfficer || "황광성"} ({settings?.phone || "02-6443-4222"})</span>
            </div>

            <div className="pt-1.5"></div>

            <div className="flex flex-wrap gap-x-3 gap-y-1 items-center">
              <span><strong>법인명:</strong> {settings?.companyName || "(주)후미디어"}</span>
              <span className="text-slate-300">|</span>
              <span><strong>대표자:</strong> {settings?.representative || "황광성"}</span>
              <span className="text-slate-300">|</span>
              <span><strong>사업자등록번호:</strong> {settings?.businessLicenseNo || "119-86-25861"}</span>
            </div>

            <div className="flex flex-wrap gap-x-3 gap-y-1 items-center">
              <span><strong>본사 주소:</strong> {settings?.address || "서울특별시 금천구 가산디지털2로 53 한라시그마밸리 1102호 ~ 1104호"}</span>
            </div>

            <div className="flex flex-wrap gap-x-3 gap-y-1 items-center">
              <span><strong>Tel:</strong> {settings?.phone || "02-6443-4222"}</span>
              <span className="text-slate-300">|</span>
              <span><strong>Fax:</strong> {settings?.fax || "02-6443-4230"}</span>
              <span className="text-slate-300">|</span>
              <span><strong>E-mail:</strong> {settings?.email || "whomedia6104@gmail.com"}</span>
            </div>

            <div className="pt-3 border-t border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center text-[11px] text-slate-500 gap-1.5">
              <p>
                Copyright © {settings?.newspaperName || "한국AI교육일보"} All rights reserved.
              </p>
              <p className="font-medium text-slate-600">
                본 정보 및 기사의 무단 전재, 재배포, AI 학습용 무단 크롤링 및 수집을 엄금합니다. (저작권법 제28조 인용 규격 준수)
              </p>
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
}
