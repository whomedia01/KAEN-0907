import React, { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Send, CheckCircle2, ShieldAlert, Award, Mail, Layers, Rss, ShieldCheck } from "lucide-react";
import { Author, Article, Category, SiteSetting } from "../types";

interface StaticPagesProps {
  pageType: 'about_company' | 'ethics_charter' | 'reporters' | 'tip_article' | 'correction' | 'terms_of_service' | 'privacy_policy' | 'youth_policy' | 'rss_feed' | 'sitemap';
  authors: Author[];
  articles: Article[];
  categories: Category[];
  settings: SiteSetting;
  onBack: () => void;
  onSelectArticle: (id: string) => void;
  onSelectCategory: (id: string | null) => void;
}

export default function StaticPages({
  pageType,
  authors,
  articles,
  categories,
  settings,
  onBack,
  onSelectArticle,
  onSelectCategory
}: StaticPagesProps) {
  // Citizen Tip state
  const [tipName, setTipName] = useState("");
  const [tipTitle, setTipTitle] = useState("");
  const [tipEmail, setTipEmail] = useState("");
  const [tipPhone, setTipPhone] = useState("");
  const [tipContent, setTipContent] = useState("");
  const [tipSubmitted, setTipSubmitted] = useState(false);

  // Correction request state
  const [corrName, setCorrName] = useState("");
  const [corrEmail, setCorrEmail] = useState("");
  const [corrPhone, setCorrPhone] = useState("");
  const [corrArticleTitle, setCorrArticleTitle] = useState("");
  const [corrParagraph, setCorrParagraph] = useState("");
  const [corrReason, setCorrReason] = useState("");
  const [corrSubmitted, setCorrSubmitted] = useState(false);

  const handleTipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tipTitle.trim() || !tipContent.trim()) return;

    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `[독자제보] ${tipTitle}`,
          content: `<p><strong>[제보자]: ${tipName} (${tipEmail} / ${tipPhone})</strong></p><p>${tipContent}</p>`,
          excerpt: `제보자 ${tipName}님의 독자 기고 제보글입니다.`,
          categoryId: "cat_school",
          authorId: "auth_citizen",
          status: "draft",
          imageUrl: "https://picsum.photos/seed/tip_default/800/600",
          imageCaption: "독자 제보 현장 증언 자료 사진",
          imageCopyright: "독자 직접 제공",
          tags: ["독자제보", "취재요청"],
          isHero: false,
          isOpinion: false,
          isPhoto: false,
          faqList: [],
          gitCommit: false,
          changeReason: "시민 제보 최초 등록"
        })
      });

      if (res.ok) {
        setTipSubmitted(true);
        setTipName("");
        setTipTitle("");
        setTipEmail("");
        setTipPhone("");
        setTipContent("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCorrectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCorrSubmitted(true);
    setCorrName("");
    setCorrEmail("");
    setCorrPhone("");
    setCorrArticleTitle("");
    setCorrParagraph("");
    setCorrReason("");
  };

  const renderContent = () => {
    switch (pageType) {
      case "about_company":
        return (
          <div className="space-y-6 text-left">
            <div className="border-b border-neutral-200 pb-4">
              <span className="text-xs font-bold text-blue-800 uppercase tracking-widest block mb-1">FOUNDING EDITORIAL</span>
              <h1 className="text-2xl font-serif font-black text-neutral-900 border-l-4 border-blue-800 pl-3">
                한국AI교육신문 창간사 (Founding Statement)
              </h1>
            </div>

            <div className="bg-slate-50 p-6 rounded border border-slate-200 space-y-4 text-sm leading-relaxed text-slate-800 font-serif">
              <p className="font-bold text-base text-slate-900">
                "AI 시대 대한민국 미래교육 발전과 인재 양성의 정론직필 등불이 되겠습니다."
              </p>
              <p>
                인공지능(AI) 기술의 대전환은 교육 현장에 근본적인 패러다임 변화를 요구하고 있습니다. 교실에서의 공교육 AI 통합, 스마트 에듀테크 생태계 구축, 디지털 리터러시 및 윤리 교육의 정착은 미래 대한민국 경쟁력을 좌우할 핵심 과제입니다.
              </p>
              <p>
                <strong>'한국AI교육신문'</strong>은 이러한 시대적 사명에 부응하여 교사, 학생, 학부모, 정책 당국, 에듀테크 기업을 잇는 공신력 있는 미래 교육 전문 언론으로 창간되었습니다. 초·중·고교 및 고등교육, 평생교육 현장의 AI 혁신 소식을 가장 신속하고 정밀하게 전달하고자 합니다.
              </p>
              <p>
                우리는 사실 검증에 기반한 객관적 보도를 원칙으로 삼으며, 교원 역량 강화와 교육 격차 해소를 위한 깊이 있는 정책 분석과 지식 전달에 최선을 다할 것입니다. 또한 무분별한 과장 광고나 검증되지 않은 에듀테크 정보로부터 독자의 권익을 보호하는 언론 본연의 책무를 성실히 이행하겠습니다.
              </p>
              <p className="pt-2 text-right font-sans text-xs font-bold text-slate-700">
                한국AI교육신문 발행인·편집인 <span className="text-slate-900 text-sm font-black ml-1">황 광 성</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-white p-5 rounded border border-neutral-200 space-y-2 shadow-xs">
                <Award className="h-6 w-6 text-blue-800" />
                <h3 className="text-sm font-bold text-neutral-900">저널리즘 3대 핵심 가치</h3>
                <ul className="text-xs text-neutral-600 space-y-1.5 list-disc pl-4">
                  <li><strong>공공성 & 객관성:</strong> 철저한 사실에 기반한 정밀 취재와 교차 검증</li>
                  <li><strong>현장성:</strong> 교육 현장 교원과 학생, 기업의 목소리를 대변</li>
                  <li><strong>미래지향성:</strong> 올바른 AI 윤리와 교육 격차 해소 선도</li>
                </ul>
              </div>

              <div className="bg-white p-5 rounded border border-neutral-200 space-y-2 shadow-xs">
                <Layers className="h-6 w-6 text-blue-800" />
                <h3 className="text-sm font-bold text-neutral-900">언론사 및 사업주체 정보</h3>
                <div className="text-xs text-neutral-600 space-y-1 leading-snug">
                  <p><strong>발행 매체명:</strong> {settings.newspaperName || "한국AI교육신문"}</p>
                  <p><strong>사업주체 법인:</strong> {settings.companyName || "(주)후미디어"}</p>
                  <p><strong>인터넷신문 등록번호:</strong> {settings.registrationNo || ""}</p>
                  {settings.registrationDate ? (
                    <p><strong>등록연월일:</strong> {settings.registrationDate}</p>
                  ) : null}
                  <p><strong>발행인 / 편집인:</strong> {settings.representative || "황광성"}</p>
                  <p><strong>청소년보호책임자:</strong> {settings.youthOfficer || "황광성"}</p>
                  <p><strong>고충처리인:</strong> {settings.grievanceOfficer || "황광성"}</p>
                  <p><strong>주소:</strong> {settings.address || ""}</p>
                  <p><strong>대표전화:</strong> {settings.phone || ""}{settings.fax ? ` | 팩스: ${settings.fax}` : ""}</p>
                  <p><strong>공식 이메일:</strong> {settings.email || ""}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case "ethics_charter":
        return (
          <div className="space-y-6 text-left font-sans">
            <div className="border-b border-neutral-200 pb-4">
              <span className="text-xs font-bold text-blue-800 uppercase tracking-widest block mb-1">ETHICS & EDITORIAL POLICY</span>
              <h1 className="text-2xl font-serif font-black text-neutral-900 border-l-4 border-blue-800 pl-3">
                한국AI교육신문 윤리강령 및 편집규약
              </h1>
            </div>

            <div className="bg-slate-50 p-5 rounded border border-slate-200 text-xs text-slate-800 leading-relaxed font-serif space-y-2">
              <p className="font-bold text-sm text-slate-900">[전 문]</p>
              <p>
                한국AI교육신문은 대한민국 미래교육 발전과 인공지능(AI) 시대의 올바른 저널리즘 가치를 실현하기 위하여 사명감을 가지고 정론직필에 임합니다. 우리는 신문윤리강령 및 인터넷신문 윤리강령을 준수하고, 독립적이고 공정한 보도를 통해 독자의 알 권리를 충족시키며 공익에 봉사할 것을 다짐합니다. 이에 전 임직원이 준수해야 할 윤리강령 및 편집규약을 제정하여 철저히 이행합니다.
              </p>
            </div>

            <div className="space-y-5 text-xs text-slate-700 leading-relaxed">
              <div className="border-l-2 border-blue-800 pl-4 py-1 space-y-1">
                <h3 className="font-bold text-sm text-slate-900">제1조 (언론의 자유와 사회적 책임)</h3>
                <p>
                  1. 우리는 국민의 알 권리를 보장하고 진실을 보도하기 위해 정치·경제·사회적 권력으로부터 독자적인 취재 및 보도의 자유를 수호합니다.<br />
                  2. 보도로 인한 사회적 파장과 개인의 명예 훼손 여부를 신중히 고려하며, 언론에 부여된 공적 책임과 윤리적 의무를 완수합니다.
                </p>
              </div>

              <div className="border-l-2 border-blue-800 pl-4 py-1 space-y-1">
                <h3 className="font-bold text-sm text-slate-900">제2조 (보도의 공정성과 사실 검증)</h3>
                <p>
                  1. 모든 기사는 철저히 객관적 사실에 근거하여 작성하며, 편향되거나 일방의 주장에 치우치지 않는 균형 잡힌 시각을 유지합니다.<br />
                  2. AI 기술 통계, 에듀테크 검증 수치, 정부 정책 발표 자료 등은 반드시 다각도의 교차 검증을 거쳐 정확성을 확보하며 오보 방지에 최선을 다합니다.
                </p>
              </div>

              <div className="border-l-2 border-blue-800 pl-4 py-1 space-y-1">
                <h3 className="font-bold text-sm text-slate-900">제3조 (취재원 보호 및 정당한 정보 수집)</h3>
                <p>
                  1. 취재원에 대한 신원 보호는 언론 윤리의 기본 원칙임을 인지하고, 취재원의 동의 없이 인적사항이나 비공개 제보 내용을 외부에 공개하지 않습니다.<br />
                  2. 정보를 수집할 때에는 정당한 취재 방법을 사용하며, 협박·기만·불법적 도청 등의 행위를 엄격히 금지합니다.
                </p>
              </div>

              <div className="border-l-2 border-blue-800 pl-4 py-1 space-y-1">
                <h3 className="font-bold text-sm text-slate-900">제4조 (인권 존중 및 사생활 보호)</h3>
                <p>
                  1. 개인의 인권과 명예를 존중하며, 공익적 목적과 직접 관련이 없는 사생활을 침해하지 않습니다.<br />
                  2. 초·중·고 학생 및 청소년 취재 시 부모 등 법정대리인의 동의를 얻는 것을 원칙으로 하며, 범죄 피의자 및 피해자의 초상권과 인적사항 보호 규정을 준수합니다.
                </p>
              </div>

              <div className="border-l-2 border-blue-800 pl-4 py-1 space-y-1">
                <h3 className="font-bold text-sm text-slate-900">제5조 (저작권 존중 및 무단 전재·표절 금지)</h3>
                <p>
                  1. 타 언론사, 연구기관, 기업 및 개인의 저작물·지식재산권을 존중하며, 기사 작성 시 출처를 정확하고 명확하게 표기합니다.<br />
                  2. 타인의 글, 사진, 영상, 데이터 등을 무단 복제·표절하거나 출처 없이 가공·재배포하는 행위를 엄격히 금합니다.
                </p>
              </div>

              <div className="border-l-2 border-blue-800 pl-4 py-1 space-y-1">
                <h3 className="font-bold text-sm text-slate-900">제6조 (광고와 보도의 엄격한 분리)</h3>
                <p>
                  1. 독자가 기사와 광고를 명확히 식별할 수 있도록 기사형 광고나 협찬 콘텐츠는 '광고', '기획광고' 또는 '협찬보도'임을 독자가 알기 쉽게 명시합니다.<br />
                  2. 광고주의 부당한 압력이나 경제적 대가에 따라 기사 내용을 왜곡하거나 특정 기업·상품을 선전하는 보도를 하지 않습니다.
                </p>
              </div>

              <div className="border-l-2 border-blue-800 pl-4 py-1 space-y-1">
                <h3 className="font-bold text-sm text-slate-900">제7조 (이해상충 방지 및 임직원의 품위 유지)</h3>
                <p>
                  1. 기자 및 편집진은 직무상 취득한 비공개 정보를 주식 투자 등 개인적 이익 추구 목적으로 이용하지 않습니다.<br />
                  2. 취재원으로부터 부당한 금품, 향응, 편의를 제공받지 않으며 직무윤리를 철저히 준수합니다.
                </p>
              </div>

              <div className="border-l-2 border-blue-800 pl-4 py-1 space-y-1">
                <h3 className="font-bold text-sm text-slate-900">제8조 (AI 저널리즘 및 생성형 AI 활용 가이드라인)</h3>
                <p>
                  1. 기사 작성 및 편집 과정에서 AI 생성 도구를 활용할 수 있으나, 최종 결과물에 대한 정밀 팩트체크와 수수료·인권·편향성 검율 책임은 전적으로 인간 편집진에 있습니다.<br />
                  2. AI의 환각 현상(Hallucination)에 의한 오보를 철저히 예방하기 위해 데스크 승인 절차를 거칩니다.
                </p>
              </div>

              <div className="border-l-2 border-blue-800 pl-4 py-1 space-y-1">
                <h3 className="font-bold text-sm text-slate-900">제9조 (오보의 신속한 시정 및 독자 권익 구제)</h3>
                <p>
                  1. 보도 내용 중 오류나 사실과 다른 내용이 확인된 경우 지체 없이 정정·반론보도를 게시하여 독자에게 신속하게 시정 조치합니다.<br />
                  2. 언론 피해 구제를 위하여 고충처리인 제도를 실질적으로 운영하고 독자의 목소리를 적극 청취합니다.
                </p>
              </div>

              <div className="border-l-2 border-blue-800 pl-4 py-1 space-y-1">
                <h3 className="font-bold text-sm text-slate-900">제10조 (준수 의무 및 시행)</h3>
                <p>
                  본 윤리강령 및 편집규약은 2026년 1월 1일부터 시행되며, 한국AI교육신문의 모든 기자, 에디터 및 임직원은 본 규약을 반드시 준수하여야 합니다.
                </p>
              </div>
            </div>
          </div>
        );

      case "reporters":
        return (
          <div className="space-y-6 text-left">
            <h1 className="text-2xl font-serif font-black text-neutral-900 border-l-4 border-blue-800 pl-3">
              {settings.newspaperName || "한국AI교육신문"} 기자단 소개 (Editorial Staff)
            </h1>
            <p className="text-xs text-neutral-600 mb-6">
              각 교육 현장과 에듀테크 기술 개발 최전선에서 정교한 사실 검증과 취재 노력을 아끼지 않는 전문 기자단을 공개합니다.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {authors.map((au) => (
                <div key={au.id} className="bg-neutral-50 border border-neutral-200 rounded p-4 flex gap-4">
                  <div className="h-16 w-16 rounded-full overflow-hidden border border-neutral-300 flex-shrink-0 bg-neutral-200">
                    <img src={au.avatarUrl} alt={au.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-neutral-900">{au.name}</h3>
                      <span className="bg-blue-100 text-blue-900 text-[10px] font-bold px-1.5 py-0.5 rounded">
                        {au.role}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 leading-normal">{au.bio}</p>
                    <a
                      href={`mailto:${au.email}`}
                      className="text-[11px] text-neutral-400 hover:text-blue-700 flex items-center gap-1 mt-1.5 hover:underline"
                    >
                      <Mail className="h-3 w-3" /> {au.email}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "tip_article":
        return (
          <div className="space-y-6 text-left">
            <h1 className="text-2xl font-serif font-black text-neutral-900 border-l-4 border-blue-800 pl-3">
              독자 뉴스 기보 및 취재 제보센터 (Tip Submission)
            </h1>
            <p className="text-xs text-neutral-600 leading-relaxed">
              독자 여러분의 생생한 현장 고발, 미래 기술에 관한 관점 기고, 부당 사례 제보 등은 더 나은 교육 문화를 만드는 촉매가 됩니다. 제보 기사는 내부 검토 후 정식 취재 보도됩니다.
            </p>

            {tipSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded p-6 text-center space-y-3 animate-fade-in">
                <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
                <h3 className="text-sm font-bold text-neutral-900">취재 제보가 정상 접수 되었습니다!</h3>
                <p className="text-xs text-neutral-600">
                  접수된 정보는 {settings.newspaperName || "한국AI교육신문"} 편집국 데이터베이스에 안전하게 전달되었으며, 담당 기자 검토 후 신속히 보강 취재가 진행됩니다. 감사드립니다.
                </p>
                <button
                  onClick={() => setTipSubmitted(false)}
                  className="bg-neutral-900 text-white font-bold text-xs py-1.5 px-4 rounded hover:bg-neutral-800 mt-2"
                >
                  새 제보하기
                </button>
              </div>
            ) : (
              <form onSubmit={handleTipSubmit} className="space-y-4 bg-neutral-50 p-6 rounded border border-neutral-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-neutral-700 font-bold block mb-1">제보자 성명 / 단체명</label>
                    <input
                      type="text"
                      value={tipName}
                      onChange={(e) => setTipName(e.target.value)}
                      className="w-full bg-white border border-neutral-300 rounded p-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-700 font-bold block mb-1">제보자 이메일 주소</label>
                    <input
                      type="email"
                      value={tipEmail}
                      onChange={(e) => setTipEmail(e.target.value)}
                      className="w-full bg-white border border-neutral-300 rounded p-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-neutral-700 font-bold block mb-1">제보 뉴스 제목 (가제)</label>
                  <input
                    type="text"
                    placeholder="보도할 핵심 뉴스 내용을 요약해 적어주세요..."
                    value={tipTitle}
                    onChange={(e) => setTipTitle(e.target.value)}
                    className="w-full bg-white border border-neutral-300 rounded p-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-neutral-700 font-bold block mb-1">구체적인 제보 사유 및 팩트 내용</label>
                  <textarea
                    placeholder="취재 시 육하원칙에 입각한 정보와 사실 확인이 가능한 근거/위치 등을 적어주시면 큰 보탬이 됩니다."
                    value={tipContent}
                    onChange={(e) => setTipContent(e.target.value)}
                    className="w-full bg-white border border-neutral-300 rounded p-2.5 text-xs focus:ring-1 focus:ring-blue-500 outline-none h-36"
                    required
                  />
                </div>

                <div className="flex justify-between items-center text-[10px] text-neutral-400 gap-2">
                  <p>※ 제보자의 신원은 언론윤리에 입각해 비밀이 철저히 보장됩니다.</p>
                  <button
                    type="submit"
                    className="bg-neutral-900 text-white font-bold text-xs py-2 px-6 rounded hover:bg-blue-800 transition flex items-center gap-1 cursor-pointer"
                  >
                    <Send className="h-3 w-3" /> 제보 전송
                  </button>
                </div>
              </form>
            )}
          </div>
        );

      case "correction":
        return (
          <div className="space-y-6 text-left font-sans">
            <h1 className="text-2xl font-serif font-black text-neutral-900 border-l-4 border-rose-600 pl-3 flex items-center gap-1.5">
              <ShieldAlert className="h-6 w-6 text-rose-600" />
              <span>고충처리인 안내 및 정정보도 청구 창구 (Correction Request)</span>
            </h1>

            <div className="bg-slate-50 p-5 rounded border border-slate-200 space-y-3 text-xs text-slate-700 leading-relaxed">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5 border-b border-slate-200 pb-2">
                <ShieldCheck className="h-4 w-4 text-slate-800" />
                언론중재 및 피해구제 등에 관한 법률에 따른 고충처리제도 안내
              </h3>
              <p>
                {settings.newspaperName || "한국AI교육신문"}은 「언론중재 및 피해구제 등에 관한 법률」 제6조에 의거하여 보도 내용으로 인한 독자 및 이해관계인의 피해를 예방하고 권익을 자율적으로 구제하기 위해 고충처리인 제도를 엄격히 운영하고 있습니다.
              </p>
              <div className="pt-2 text-slate-800 font-medium grid grid-cols-1 md:grid-cols-2 gap-2 bg-white p-3 rounded border border-slate-200/80">
                <p>• <strong>고충처리인:</strong> 황광성 (발행인·편집인 겸임)</p>
                <p>• <strong>접수 이메일:</strong> {settings.email || "whomedia03@gmail.com"}</p>
                <p>• <strong>대표 전화:</strong> 02-6443-4222</p>
                <p>• <strong>팩스:</strong> 02-6443-4223</p>
                <p className="md:col-span-2">• <strong>서면 접수 주소:</strong> 서울특별시 금천구 가산디지털2로 53 (가산동) 한라시그마밸리 1102호~1104호 고충처리위원회</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-200 text-slate-600">
                <h4 className="font-bold text-xs text-slate-900">■ 고충처리인의 직무 및 권한</h4>
                <ul className="list-disc pl-4 space-y-1">
                  <li>언론의 침해행위에 대한 구제신청 처리 및 시정권고</li>
                  <li>정정보도·반론보도·추후보도 청구에 대한 조사 및 처리 협의</li>
                  <li>독자의 권익 보호 및 시정 대상 기사에 대한 데스크 조율</li>
                </ul>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-200 text-slate-600">
                <h4 className="font-bold text-xs text-slate-900">■ 정정보도 청구 요건 및 시한 (언론중재법 제14조~제17조)</h4>
                <ul className="list-disc pl-4 space-y-1">
                  <li><strong>청구 자격:</strong> 보도 내용이 사실과 달라 명예나 권리, 기타 법익을 침해받은 개인 또는 단체</li>
                  <li><strong>청구 시한:</strong> 해당 보도가 있음을 안 날로부터 3개월 이내 (보도가 있은 날로부터 6개월 이내)</li>
                  <li><strong>처리 절차:</strong> 접수 후 3일 이내 수용 여부 및 처리 결과를 청구인에게 통보하며, 수용 시 14일 이내 정정보도문 게시 또는 해당 기사를 정정 수정합니다.</li>
                </ul>
              </div>
            </div>

            {corrSubmitted ? (
              <div className="bg-rose-50 border border-rose-200 rounded p-6 text-center space-y-3 animate-fade-in">
                <CheckCircle2 className="h-10 w-10 text-rose-600 mx-auto" />
                <h3 className="text-sm font-bold text-neutral-900">정정보도 청구 접수가 승인 대기 중입니다</h3>
                <p className="text-xs text-neutral-600">
                  접수 내용은 고충처리 부서에 즉각 전달되었으며, 언론중재 및 피해구제 등에 관한 법률에 의거하여 신속히 조사 및 답변드리겠습니다.
                </p>
                <button
                  onClick={() => setCorrSubmitted(false)}
                  className="bg-neutral-900 text-white font-bold text-xs py-1.5 px-4 rounded hover:bg-neutral-850 mt-2 cursor-pointer"
                >
                  추가 청구하기
                </button>
              </div>
            ) : (
              <form onSubmit={handleCorrectionSubmit} className="space-y-4 bg-neutral-50 p-6 rounded border border-neutral-200">
                <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider border-b border-neutral-200 pb-2">
                  온라인 정정보도 및 반론보도 신청서
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-neutral-700 font-bold block mb-1">청구인 성명 / 기업 명의</label>
                    <input
                      type="text"
                      value={corrName}
                      onChange={(e) => setCorrName(e.target.value)}
                      className="w-full bg-white border border-neutral-300 rounded p-2 text-xs outline-none focus:ring-1 focus:ring-rose-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-700 font-bold block mb-1">연락처 및 이메일 주소</label>
                    <input
                      type="text"
                      value={corrEmail}
                      onChange={(e) => setCorrEmail(e.target.value)}
                      className="w-full bg-white border border-neutral-300 rounded p-2 text-xs outline-none focus:ring-1 focus:ring-rose-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-neutral-700 font-bold block mb-1">대상 기사 제목 및 URL</label>
                  <input
                    type="text"
                    placeholder="정정보도를 요구하시는 기사의 정확한 제목 및 링크"
                    value={corrArticleTitle}
                    onChange={(e) => setCorrArticleTitle(e.target.value)}
                    className="w-full bg-white border border-neutral-300 rounded p-2 text-xs outline-none focus:ring-1 focus:ring-rose-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-neutral-700 font-bold block mb-1">이의제기 단락 및 핵심 구절</label>
                  <input
                    type="text"
                    placeholder="오보 또는 피해가 발생했다고 판단되는 문단 및 구절"
                    value={corrParagraph}
                    onChange={(e) => setCorrParagraph(e.target.value)}
                    className="w-full bg-white border border-neutral-300 rounded p-2 text-xs outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-neutral-700 font-bold block mb-1">청구 사유 및 올바른 팩트 자료</label>
                  <textarea
                    placeholder="정정 요청 청구 사유와 올바른 사실에 대한 증빙 및 설명을 상세히 기재해 주십시오."
                    value={corrReason}
                    onChange={(e) => setCorrReason(e.target.value)}
                    className="w-full bg-white border border-neutral-300 rounded p-2.5 text-xs outline-none focus:ring-1 focus:ring-rose-500 h-32"
                    required
                  />
                </div>

                <div className="flex justify-between items-center text-[10px] text-neutral-400 gap-2">
                  <p>※ 접수 후 3일 이내 정정/반론 여부에 대한 결과 및 수용 방침을 안내해 드립니다.</p>
                  <button
                    type="submit"
                    className="bg-rose-900 text-white font-bold text-xs py-2 px-6 rounded hover:bg-rose-800 transition cursor-pointer"
                  >
                    정정 청구 전송
                  </button>
                </div>
              </form>
            )}
          </div>
        );

      case "terms_of_service":
        return (
          <div className="prose prose-sm max-w-none text-xs text-neutral-800 leading-relaxed space-y-5 text-left font-sans">
            <div className="border-b pb-3">
              <h1 className="text-2xl font-serif font-black text-neutral-900">서비스 이용약관 (Terms of Service)</h1>
              <p className="text-[11px] text-neutral-500 mt-1">공고일자: 2026년 01월 01일 | 시행일자: 2026년 01월 01일</p>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-neutral-900 text-sm border-l-2 border-blue-800 pl-2">제1조 (목적)</h3>
                <p className="mt-1">
                  본 약관은 주식회사 후미디어(이하 "회사")가 운영하는 인터넷신문 서비스 {settings.newspaperName || "한국AI교육신문"}(이하 "서비스")을 이용함에 있어 회사와 이용자(이하 "독자" 또는 "회원")간의 권리·의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-neutral-900 text-sm border-l-2 border-blue-800 pl-2">제2조 (용어의 정의)</h3>
                <p className="mt-1">
                  1. "서비스"라 함은 회사가 인터넷 웹사이트, 모바일 애플리케이션 및 RSS 등 다양한 디지털 매체를 통해 제공하는 기사, 사진, 영상, 칼럼, 데이터 등 제반 콘텐츠를 말합니다.<br />
                  2. "이용자"라 함은 회사의 서비스에 접속하여 본 약관에 따라 회사가 제공하는 서비스를 이용하는 회원 및 비회원을 말합니다.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-neutral-900 text-sm border-l-2 border-blue-800 pl-2">제3조 (약관의 게시와 개정)</h3>
                <p className="mt-1">
                  1. 회사는 본 약관의 내용을 이용자가 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다.<br />
                  2. 회사는 「약관의 규제에 관한 법률」, 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 등 관련 법령을 위배하지 않는 범위에서 본 약관을 개정할 수 있습니다.<br />
                  3. 개정된 약관은 적용일자 7일 전(중요한 개정의 경우 30일 전)부터 공지사항을 통해 고지합니다.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-neutral-900 text-sm border-l-2 border-blue-800 pl-2">제4조 (서비스의 제공 및 변경)</h3>
                <p className="mt-1">
                  1. 회사는 연중무휴, 1일 24시간 독자에게 저널리즘 콘텐츠 및 제반 서비스를 제공함을 원칙으로 합니다.<br />
                  2. 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신두절 또는 천재지변 등의 불가항력적 사유가 발생한 경우 서비스 제공을 일시적으로 중단할 수 있습니다.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-neutral-900 text-sm border-l-2 border-blue-800 pl-2">제5조 (이용자의 의무 및 금지행위)</h3>
                <p className="mt-1">
                  이용자는 다음 각 호의 행위를 하여서는 안 됩니다.<br />
                  1. 타인의 정보 도용 및 허위 사실 유포<br />
                  2. 회사 및 제3자의 저작권, 인격권, 명예 등 지식재산권을 침해하는 행위<br />
                  3. 욕설, 비방, 음란물, 사행성 광고 등 사회질서에 반하는 댓글 및 게시물을 등록하는 행위<br />
                  4. 회사의 동의 없이 서비스의 정보 및 시스템을 영리 목적으로 복제·가공하거나 자동화 수단(스파이더, 크롤러 등)을 이용하여 무단 수집하는 행위
                </p>
              </div>

              <div>
                <h3 className="font-bold text-neutral-900 text-sm border-l-2 border-blue-800 pl-2">제6조 (저작권의 귀속 및 이용제한 - AI 무단 크롤링 금지)</h3>
                <p className="mt-1">
                  1. 회사가 작성한 보도기사, 사진, 영상, 그래픽, 디자인 등 모든 서비스 콘텐츠에 대한 저작권 및 지식재산권은 회사에 귀속됩니다.<br />
                  2. 이용자는 회사의 사전 서면 승인 없이 콘텐츠를 복제, 배포, 방송, 공중송신하거나 영리 목적으로 활용할 수 없습니다.<br />
                  3. <strong>[AI 모델 학습 무단 수집 금지]</strong> 회사의 모든 기사 데이터 및 멀티미디어 자산에 대해 AI(인공지능) 생성 모델 학습, 데이터셋 구축, 자동 가공 및 웹 크롤링 행위를 엄격히 금지합니다.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-neutral-900 text-sm border-l-2 border-blue-800 pl-2">제7조 (독자 댓글 및 게시물의 관리)</h3>
                <p className="mt-1">
                  1. 독자가 작성한 댓글 및 제보 게시물에 대한 책임은 원칙적으로 게시자 본인에게 있습니다.<br />
                  2. 타인의 명예를 훼손하거나 유해 정보를 담은 댓글은 정보통신망법 및 클린 댓글 관리 기준에 따라 사전 통보 없이 삭제 또는 비공개 조치될 수 있습니다.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-neutral-900 text-sm border-l-2 border-blue-800 pl-2">제8조 (손해배상 및 면책조항)</h3>
                <p className="mt-1">
                  1. 회사는 천재지변, 기상 이변, 디도스 공격 등 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 책임이 면제됩니다.<br />
                  2. 회사는 독자가 서비스를 통해 얻은 정보나 타 독자의 댓글 내용의 신뢰성, 정확성에 대해 법적 보증을 하지 않습니다.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-neutral-900 text-sm border-l-2 border-blue-800 pl-2">제9조 (분쟁해결 및 관할법원)</h3>
                <p className="mt-1">
                  1. 회사와 이용자 간 발생한 분쟁에 관한 소송은 회사의 본사 소재지를 관할하는 법원을 전속 관할법원으로 합니다.<br />
                  2. 본 약관의 해석 및 관할에 관한 사항은 대한민국 법률을 적용합니다.
                </p>
              </div>
            </div>
          </div>
        );

      case "privacy_policy":
        return (
          <div className="prose prose-sm max-w-none text-xs text-neutral-800 leading-relaxed space-y-5 text-left font-sans">
            <div className="border-b pb-3">
              <h1 className="text-2xl font-serif font-black text-neutral-900">개인정보처리방침 (Privacy Policy)</h1>
              <p className="text-[11px] text-neutral-500 mt-1">공고일자: 2026년 01월 01일 | 시행일자: 2026년 01월 01일</p>
            </div>

            <p className="bg-slate-50 p-4 rounded border border-slate-200 text-slate-700">
              주식회사 후미디어(이하 "회사")가 운영하는 인터넷신문 {settings.newspaperName || "한국AI교육신문"}은 「개인정보 보호법」 제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-neutral-900 text-sm border-l-2 border-blue-800 pl-2">1. 개인정보의 처리 목적</h3>
                <p className="mt-1">
                  회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.<br />
                  - 취재 제보 접수, 확인 및 담당 기자 보강 취재 소통<br />
                  - 정정보도, 반론보도 및 고충처리 신청 접수·처리결과 통보<br />
                  - 독자 댓글 게시물 관리 및 클린 인터넷 환경 유지
                </p>
              </div>

              <div>
                <h3 className="font-bold text-neutral-900 text-sm border-l-2 border-blue-800 pl-2">2. 처리하는 개인정보의 항목 및 수집방법</h3>
                <p className="mt-1">
                  - <strong>취재 제보 접수:</strong> 성명(또는 단체명), 이메일, 연락처(선택), 제보 내용<br />
                  - <strong>고충처리/정정보도 청구:</strong> 청구인 성명, 연락처, 이메일, 대상 기사 URL, 청구 사유 증빙<br />
                  - <strong>인터넷 서비스 이용 시 자동 수집:</strong> IP 주소, 쿠키, 방문 일시, 서비스 이용 기록
                </p>
              </div>

              <div>
                <h3 className="font-bold text-neutral-900 text-sm border-l-2 border-blue-800 pl-2">3. 개인정보의 처리 및 보유 기간</h3>
                <p className="mt-1">
                  회사는 법령에 따른 개인정보 보유·이용 기간 또는 정보주체로부터 개인정보 수집 시 동의받은 보유·이용 기간 내에서 개인정보를 처리·보유합니다.<br />
                  - 제보 및 고충처리 관련 기록: 접수 처리 완료 후 3년간 보관(언론중재법 및 소비자기본법 참조)<br />
                  - 서비스 접속 기록: 3개월(통신비밀보호법)
                </p>
              </div>

              <div>
                <h3 className="font-bold text-neutral-900 text-sm border-l-2 border-blue-800 pl-2">4. 개인정보의 제3자 제공</h3>
                <p className="mt-1">
                  회사는 정보주체의 개인정보를 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 「개인정보 보호법」 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-neutral-900 text-sm border-l-2 border-blue-800 pl-2">5. 개인정보처리 위탁</h3>
                <p className="mt-1">
                  회사는 원활한 개인정보 업무처리를 위하여 개인정보 처리업무를 외부에 위탁하지 않으며, 위탁계약 체결 시 개인정보 보호법 제26조에 따라 관리·감독을 시행합니다.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-neutral-900 text-sm border-l-2 border-blue-800 pl-2">6. 정보주체와 법정대리인의 권리·의무 및 그 행사방법</h3>
                <p className="mt-1">
                  정보주체는 회사에 대해 언제든지 개인정보 열람·정정·삭제·처리정지 요구 등의 권리를 행사할 수 있으며, 서면, 이메일, 전화 등을 통해 요구하실 수 있습니다.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-neutral-900 text-sm border-l-2 border-blue-800 pl-2">7. 개인정보의 파기절차 및 파기방법</h3>
                <p className="mt-1">
                  회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체 없이 해당 개인정보를 파기합니다. 전자적 파일은 복구 불가능한 기술적 방법으로 삭제합니다.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-neutral-900 text-sm border-l-2 border-blue-800 pl-2">8. 개인정보의 안전성 확보 조치</h3>
                <p className="mt-1">
                  회사는 개인정보의 안전성 확보를 위해 기술적·관리적·물리적 대책을 강구하고 있습니다.<br />
                  - 관리적 조치: 취급 직원 최소화, 정기적 보안 교육 실시<br />
                  - 기술적 조치: 개인정보 암호화, 접근통제시스템 설치, 보안프로그램 적용
                </p>
              </div>

              <div>
                <h3 className="font-bold text-neutral-900 text-sm border-l-2 border-blue-800 pl-2">9. 개인정보 자동 수집 장치의 설치·운영 및 거부</h3>
                <p className="mt-1">
                  회사는 독자에게 편리한 웹 환경을 제공하기 위해 '쿠키(cookie)'를 사용할 수 있으며, 독자는 웹 브라우저 옵션 설정을 통해 쿠키 수집을 거부할 수 있습니다.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-neutral-900 text-sm border-l-2 border-blue-800 pl-2">10. 개인정보 보호책임자</h3>
                <p className="mt-1">
                  - <strong>개인정보 보호책임자:</strong> 황광성 (발행인·편집인)<br />
                  - <strong>연락처:</strong> 02-6443-4222 / {settings.email || "whomedia03@gmail.com"}<br />
                  - <strong>주소:</strong> 서울특별시 금천구 가산디지털2로 53 (가산동) 한라시그마밸리 1102호~1104호
                </p>
              </div>

              <div>
                <h3 className="font-bold text-neutral-900 text-sm border-l-2 border-blue-800 pl-2">11. 권익침해 구제방법</h3>
                <p className="mt-1">
                  개인정보 침해로 인한 구제를 받기 위하여 개인정보분쟁조정위원회, 한국인터넷진흥원 개인정보침해신고센터 등에 분쟁해결이나 상담을 신청할 수 있습니다.<br />
                  - 개인정보분쟁조정위원회: 1833-6972 (www.kopico.go.kr)<br />
                  - 개인정보침해신고센터: 118 (privacy.kisa.or.kr)
                </p>
              </div>

              <div>
                <h3 className="font-bold text-neutral-900 text-sm border-l-2 border-blue-800 pl-2">12. 개인정보 처리방침의 변경</h3>
                <p className="mt-1">
                  본 개인정보 처리방침은 2026년 1월 1일부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 공지사항을 통하여 고지할 것입니다.
                </p>
              </div>
            </div>
          </div>
        );

      case "youth_policy":
        return (
          <div className="prose prose-sm max-w-none text-xs text-neutral-800 leading-relaxed space-y-5 text-left font-sans">
            <div className="border-b pb-3">
              <h1 className="text-2xl font-serif font-black text-neutral-900">청소년보호정책 (Youth Protection Policy)</h1>
              <p className="text-[11px] text-neutral-500 mt-1">공고일자: 2026년 01월 01일 | 시행일자: 2026년 01월 01일</p>
            </div>

            <p className="bg-slate-50 p-4 rounded border border-slate-200 text-slate-700">
              {settings.newspaperName || "한국AI교육신문"}은 유해한 환경으로부터 청소년을 보호하고, 올바른 인성 및 디지털 리터러시를 함양할 수 있도록 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 및 「청소년 보호법」에 근거하여 청소년 보호정책을 시행하고 있습니다.
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-neutral-900 text-sm border-l-2 border-blue-800 pl-2">1. 청소년 유해정보로부터의 청소년 보호계획 수립</h3>
                <p className="mt-1">
                  회사는 청소년이 유해한 매체에 노출되지 않도록 정보통신윤리위원회 심의기준 및 청소년유해매체물에 대한 심의 규정에 의거하여 자체 모니터링을 철저히 실시합니다.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-neutral-900 text-sm border-l-2 border-blue-800 pl-2">2. 유해정보에 대한 청소년 접근제한 및 관리조치</h3>
                <p className="mt-1">
                  회사는 청소년 유해정보 및 과도한 선정성, 폭력성, 사행성 등의 불법 유해 광고가 서비스에 표출되지 않도록 차단 시스템을 적용하고 관련 게시물을 즉시 조치합니다.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-neutral-900 text-sm border-l-2 border-blue-800 pl-2">3. 취재 및 보도 종사자에 대한 청소년 보호 교육</h3>
                <p className="mt-1">
                  회사는 기자, 에디터 등 편집국 종사자를 대상으로 청소년 보호 관련 법령 및 보호 가이드라인에 관한 자체 윤리 교육을 주기적으로 실시합니다.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-neutral-900 text-sm border-l-2 border-blue-800 pl-2">4. 청소년 유해정보로 인한 피해상담 및 고충처리</h3>
                <p className="mt-1">
                  회사는 청소년 유해정보로 인한 피해 상담 및 의견 수렴을 위한 고충처리 창구를 운영하고 있으며, 신고 접수 시 신속하게 조치합니다.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-neutral-900 text-sm border-l-2 border-blue-800 pl-2">5. 청소년보호책임자 및 담당자 지정</h3>
                <p className="mt-1">
                  - <strong>청소년보호책임자:</strong> 황광성 (발행인·편집인)<br />
                  - <strong>전화번호:</strong> 02-6443-4222 | <strong>팩스:</strong> 02-6443-4223<br />
                  - <strong>전자우편:</strong> {settings.email || "whomedia03@gmail.com"}<br />
                  - <strong>주소:</strong> 서울특별시 금천구 가산디지털2로 53 (가산동) 한라시그마밸리 1102호~1104호
                </p>
              </div>
            </div>
          </div>
        );

      case "rss_feed":
        const mockRssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${settings.newspaperName || "한국AI교육신문"} 뉴스 피드</title>
    <link>http://kaen-news.kr</link>
    <description>AI 교육 혁신과 대한민국 미래 에듀테크 뉴스</description>
    <language>ko-KR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <pubDate>${new Date().toUTCString()}</pubDate>
    <generator>KAEN RSS Engine v1.0</generator>
    
    ${articles
      .filter((a) => a.status === "published")
      .slice(0, 5)
      .map(
        (art) => `
    <item>
      <title><![CDATA[${art.title}]]></title>
      <link>http://kaen-news.kr/article/${art.id}</link>
      <guid isPermaLink="true">http://kaen-news.kr/article/${art.id}</guid>
      <description><![CDATA[${art.excerpt || art.title}]]></description>
      <pubDate>${new Date(art.createdAt).toUTCString()}</pubDate>
      <author>editor@kaen-news.kr</author>
    </item>`
      )
      .join("")}
  </channel>
</rss>`;

        return (
          <div className="space-y-6 text-left">
            <div className="flex items-center gap-2">
              <Rss className="h-6 w-6 text-amber-600" />
              <div>
                <h1 className="text-2xl font-serif font-black text-neutral-900">{settings.newspaperName || "한국AI교육신문"} RSS XML 피드</h1>
                <p className="text-xs text-neutral-500">포털 뉴스 수집 표준 및 제휴 크롤링 표준 XML 규격을 제공합니다.</p>
              </div>
            </div>

            <div className="bg-neutral-900 rounded p-4 border border-neutral-800 font-mono text-[11px] text-amber-400 overflow-x-auto max-h-96">
              <pre>{mockRssXml}</pre>
            </div>
          </div>
        );

      case "sitemap":
        return (
          <div className="space-y-6 text-left">
            <h1 className="text-2xl font-serif font-black text-neutral-900 border-l-4 border-blue-800 pl-3">
              전체 사이트맵 (Sitemap)
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-neutral-50 p-4 rounded border border-neutral-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-3 border-b pb-1.5">
                  뉴스 카테고리
                </h3>
                <ul className="space-y-2 text-xs">
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <button
                        onClick={() => {
                          onSelectCategory(cat.id);
                          onBack();
                        }}
                        className="text-neutral-700 hover:text-blue-700 font-medium hover:underline text-left cursor-pointer"
                      >
                        {cat.name} ({cat.slug})
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-neutral-50 p-4 rounded border border-neutral-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-3 border-b pb-1.5">
                  참여 및 제보
                </h3>
                <ul className="space-y-2 text-xs text-neutral-700">
                  <li>
                    <button onClick={() => { onBack(); onSelectCategory(null); }} className="hover:text-blue-700 cursor-pointer">실시간 헤드라인 뉴스룸</button>
                  </li>
                  <li>
                    <button onClick={() => { onBack(); }} className="hover:text-blue-700 cursor-pointer">기사 제보센터</button>
                  </li>
                </ul>
              </div>

              <div className="bg-neutral-50 p-4 rounded border border-neutral-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-3 border-b pb-1.5">
                  법률 및 언론 고지
                </h3>
                <ul className="space-y-2 text-xs text-neutral-700">
                  <li>회사소개 (About Us)</li>
                  <li>윤리강령 및 편집규약</li>
                  <li>이용약관 및 고지사항</li>
                  <li>개인정보처리방침</li>
                  <li>청소년보호정책</li>
                  <li>고충처리인 및 정정보도청구</li>
                </ul>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto px-6 py-10 bg-white border border-neutral-200 shadow-xs rounded my-6"
      id="main-static-viewport"
    >
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-blue-700 transition mb-6 cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" /> 메인 뉴스룸으로 이동
      </button>

      {renderContent()}
    </motion.div>
  );
}
