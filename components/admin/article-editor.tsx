'use client';

import React, { useState, useMemo, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Sparkles, 
  AlertTriangle, 
  Check, 
  RotateCcw,
  FileText,
  HelpCircle,
  ExternalLink,
  Image as ImageIcon,
  Layers
} from 'lucide-react';
import { scanArticleForForbiddenWords, DetectedIssue } from '@/lib/ethics/forbidden-words';
import { ArticleEthicsPanel } from './article-ethics-panel';
import { ArticleVisualAidsPanel } from './article-visual-aids-panel';

interface CategoryItem {
  slug: string;
  name: string;
}

interface ArticleEditorProps {
  categories: CategoryItem[];
  action: (formData: FormData) => Promise<void>;
  initialData?: {
    id?: string;
    title?: string;
    slug?: string;
    subtitle?: string;
    summary?: string;
    content?: string;
    category_slug?: string;
    status?: string;
    article_type?: string;
    scheduled_at?: string;
    author_name?: string;
    tags?: string;
    thumbnail_url?: string;
    image_source_url?: string;
    image_source_name?: string;
    image_author?: string;
    image_caption?: string;
    image_license?: string;
    source_urls?: string;
    source_note?: string;
    fact_checked?: boolean;
    compliance_checked?: boolean;
  };
}

export function ArticleEditor({ categories, action, initialData }: ArticleEditorProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [subtitle, setSubtitle] = useState(initialData?.subtitle || '');
  const [summary, setSummary] = useState(initialData?.summary || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [categorySlug, setCategorySlug] = useState(initialData?.category_slug || categories[0]?.slug || 'lifelong-education');

  // 대표 이미지 및 캡션/출처 상태
  const [thumbnailUrl, setThumbnailUrl] = useState(initialData?.thumbnail_url || '');
  const [imageCaption, setImageCaption] = useState(initialData?.image_caption || '');
  const [imageSourceName, setImageSourceName] = useState(initialData?.image_source_name || '');
  const [imageAuthor, setImageAuthor] = useState(initialData?.image_author || '');
  const [imageLicense, setImageLicense] = useState(initialData?.image_license || '');

  // 우측 보조 데스크 탭: AI 시각자료 vs 보도 윤리
  const [activeSideTab, setActiveSideTab] = useState<'visuals' | 'ethics'>('visuals');

  // 변경 전 백업 (실행 취소용)
  const [historySnapshot, setHistorySnapshot] = useState<{
    title: string;
    subtitle: string;
    summary: string;
    content: string;
  } | null>(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingSubmitForm, setPendingSubmitForm] = useState<HTMLFormElement | null>(null);
  const [isPending, startTransition] = useTransition();

  // 실시간 금지어 및 주의 표현 스캔
  const realtimeIssues = useMemo(() => {
    return scanArticleForForbiddenWords(title, subtitle, summary, content);
  }, [title, subtitle, summary, content]);

  const forbiddenIssues = useMemo(() => {
    return realtimeIssues.filter(i => i.severity === 'forbidden');
  }, [realtimeIssues]);

  // 단일 교정 적용 핸들러
  const handleApplySingleCorrection = (
    field: 'title' | 'subtitle' | 'summary' | 'content',
    original: string,
    replacement: string
  ) => {
    // 히스토리 백업
    setHistorySnapshot({ title, subtitle, summary, content });

    if (field === 'title') {
      setTitle(prev => prev.replace(original, replacement));
    } else if (field === 'subtitle') {
      setSubtitle(prev => prev.replace(original, replacement));
    } else if (field === 'summary') {
      setSummary(prev => prev.replace(original, replacement));
    } else if (field === 'content') {
      setContent(prev => prev.replace(original, replacement));
    }
  };

  // AI 전체 권장안 일괄 적용 핸들러
  const handleApplyAllCorrections = (corrected: {
    title: string;
    subtitle: string;
    summary: string;
    content: string;
  }) => {
    setHistorySnapshot({ title, subtitle, summary, content });
    if (corrected.title) setTitle(corrected.title);
    if (corrected.subtitle) setSubtitle(corrected.subtitle);
    if (corrected.summary) setSummary(corrected.summary);
    if (corrected.content) setContent(corrected.content);
  };

  // 실행 취소
  const handleUndo = () => {
    if (!historySnapshot) return;
    setTitle(historySnapshot.title);
    setSubtitle(historySnapshot.subtitle);
    setSummary(historySnapshot.summary);
    setContent(historySnapshot.content);
    setHistorySnapshot(null);
  };

  // AI 시각 자료를 본문에 삽입 (권장 섹션 위치 또는 끝 위치)
  const handleInsertVisualIntoContent = (markdownSnippet: string, placementHint?: string) => {
    setHistorySnapshot({ title, subtitle, summary, content });

    let inserted = false;
    if (placementHint && placementHint.includes("'■")) {
      const match = placementHint.match(/'(■[^']+)'/);
      if (match && match[1] && content.includes(match[1])) {
        const headerStr = match[1];
        const headerIndex = content.indexOf(headerStr);
        const nextDoubleNewline = content.indexOf('\n\n', headerIndex + headerStr.length);
        if (nextDoubleNewline !== -1) {
          const before = content.slice(0, nextDoubleNewline);
          const after = content.slice(nextDoubleNewline);
          setContent(`${before}${markdownSnippet}${after}`);
          inserted = true;
        }
      }
    }

    if (!inserted) {
      setContent(prev => `${prev.trimEnd()}${markdownSnippet}`);
    }
  };

  // AI 시각 자료를 기사의 대표 썸네일 이미지로 지정
  const handleSetVisualAsThumbnail = (imgUrl: string, caption: string, sourceName: string) => {
    setThumbnailUrl(imgUrl);
    setImageCaption(caption);
    setImageSourceName(sourceName);
  };

  // 심층 기사 표준 양식 (2배 분량 / 2,500자+ 템플릿) 삽입
  const handleInsertDeepTemplate = () => {
    const defaultTemplate = `[한국AI교육신문 = 취재팀 기자] 최근 교육 현장에서 급변하는 인공지능(AI) 기술과 디지털 교육 혁신을 둘러싼 논의가 뜨겁게 고조되고 있다. 이번 동향은 단순한 기술 시연을 넘어 실제 공교육과 평생교육 현장의 질적 패러다임 전환을 상징하는 대표적 분기점으로 평가된다.

특히 AI 대중화와 디지털 전환 가속화로 인해 학습자와 교육기관 모두 과거의 일방향 강의 전달 방식에서 벗어나, 실질적인 참여와 문제 해결 능력을 검증할 수 있는 새로운 교육 모델을 적극적으로 도입하고 있다.

■ 현장에서 확인한 핵심 쟁점과 실무 운영 실태

수도권 및 지역 주요 교육 거점을 직접 취재한 결과, 과거 과정명이나 수강료 할인 프로모션만을 앞세우던 홍보 관행은 크게 줄어든 것으로 나타났다. 대신 강사진의 실제 산업 현장 실무 경력, 구체적인 주차별 학습 목표와 프로젝트 결과물, 중도 탈락 방지를 위한 1:1 밀착 상담 관리, 그리고 수료 후 객관적인 자격 취득 및 실무 연계 가능 여부를 전면에 내세우는 기관들이 학습자들의 높은 지지를 얻고 있다.

현장에서 만난 교육 운영 책임자는 "학습자들의 안목이 매우 높아져 실무와 동떨어진 이론 나열식 강의는 즉각 외면받는다"며 "실제 산업 현장의 문제를 해결하는 프로젝트 기반 학습(PBL)과 AI 보조 도구를 결합한 하이브리드 교육 과정에 집중 투자하고 있다"고 전했다.

■ 공급자와 수요자 간 시각차 및 구조적 과제

그러나 이러한 긍정적인 변화 이면에는 여전히 교육 공급자와 수요자 간의 시각차와 구조적 한계가 존재한다. 대다수 기관이 양질의 커리큘럼을 표방하지만, 실제 강사진의 전문성 격차나 실습 소프트웨어 라이선스 지원 수준에 따라 교육 성과의 편차가 크게 벌어지고 있는 실정이다.

특히 급변하는 최신 AI 기술 트렌드를 신속하게 커리큘럼에 반영할 수 있는 전문 강사진의 수급난이 지속되면서, 일부 기관에서는 검증되지 않은 외부 인력을 무리하게 투입하는 사례도 지적된다. 이로 인해 학습자가 기대했던 교육 수준과 실제 수강 경험 사이의 괴리가 발생하고, 수강 중도 포기나 환불 분쟁으로 이어지는 부작용도 보고되고 있다.

■ 학습자가 수강 및 참여 전 반드시 점검해야 할 5대 기준

첫째, 본인의 학습 목적과 해당 과정의 난이도 및 선수 학습 요건 일치 여부다. 기초 입문 과정인지 심화 프로젝트 과정인지에 따라 투입 시간과 사전 지식이 크게 상이하므로 강의 계획서를 정밀히 살펴야 한다.

둘째, 환불 규정과 학사 운영 규정의 투명성이다. 평생교육법 등 관계 법령에 따라 수강료 반환 기준이 명확하게 사전 공시되어 있는지, 결석 시 보충 학습과 복습용 녹화 영상 제공이 원활한지 확인해야 한다.

셋째, 교강사와의 질의응답 및 피드백 채널의 활성화 여부다. 일방적인 동영상 시청을 넘어 전담 튜터나 교강사가 학습자의 과제에 대해 개별 첨삭과 피드백을 적시에 제공하는지가 완주율을 좌우한다.

넷째, 수료 후 사후 관리 체계다. 공인 시험 응시 지원, 포트폴리오 첨삭, 최신 산업 세미나 초대 및 동문 커뮤니티 연결 등 지속적인 역량 개발을 뒷받침하는 프로그램이 있는지 따져보아야 한다.

다섯째, 국가 공인 인증 및 공식 인가 여부다. 고용노동부, 교육부 등 정부 부처의 공식 인가나 위탁 교육 지정을 받은 과정인지 공공 알리미 포털 등을 통해 교차 검증하는 지혜가 필요하다.

■ 산·학·연 협력 거버넌스와 질적 관리 모델

전문가들은 교육 생태계가 건전하게 뿌리내리기 위해 민간 교육기관과 공공 플랫폼, 산업체가 긴밀히 협력하는 산·학·연 거버넌스가 확립되어야 한다고 입을 모은다. 실제 기업에서 요구하는 직무 역량 지표를 교육 과정에 즉각 반영하고, 학습자의 학습 로그와 성취도를 정밀 분석하여 취약점을 보완하는 데이터 기반 학습 관리 체계가 요구된다.

■ 법적·윤리적 신뢰성 제고와 향후 과제

아울러 과장 광고를 엄단하고 사실에 입각한 정보 공개가 완전히 정착되어야 한다. 일부 비인가 기관의 '취업 100% 보장'이나 '단기 속성 취득'과 같은 부당 광고에 현혹되지 않도록 규제 당국의 상시 모니터링이 강화되어야 하며, 소비자 스스로도 공식 등록 여부를 꼼꼼히 대조해야 한다.

[기자 수첩 / 심층 취재 후기]

이번 취재 현장에서 만난 학습자들에게서 배움에 대한 뜨거운 열정과 진지함을 읽을 수 있었다. 교육기관들이 단기적 상업성에 매몰되지 않고 진정성 있는 교육 품질로 화답할 때 비로소 대한민국 AI 교육의 밝은 미래가 열릴 것이다.

※ 저작권자 ⓒ 한국AI교육신문. 무단전재 및 재배포, AI 학습용 무단 크롤링을 엄격히 금합니다.
※ 본 기사는 저작권법 및 한국인터넷신문윤리강령을 준수하며 철저한 현장 취재 및 사실 검증을 거쳐 보도되었습니다.
※ 기사 제보 및 정정보도, 반론권 청구: 편집국 (02-6443-4222)`;

    if (content && !confirm('기존 본문 내용이 심층 표준 템플릿(2배 분량)으로 대체됩니다. 계속하시겠습니까?')) {
      return;
    }
    setHistorySnapshot({ title, subtitle, summary, content });
    setContent(defaultTemplate);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (forbiddenIssues.length > 0) {
      e.preventDefault();
      setPendingSubmitForm(e.currentTarget);
      setShowConfirmModal(true);
    }
  };

  return (
    <div className="space-y-8">
      {/* 실행 취소 플로팅 토스트 */}
      {historySnapshot && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900 text-white px-4 py-3 shadow-xl animate-in fade-in slide-in-from-bottom-3">
          <span className="text-xs font-bold text-slate-200">교정 표현이 적용되었습니다.</span>
          <button
            type="button"
            onClick={handleUndo}
            className="flex items-center gap-1 text-xs font-black text-amber-300 hover:text-amber-200 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>원래대로 실행 취소</span>
          </button>
          <button
            type="button"
            onClick={() => setHistorySnapshot(null)}
            className="text-slate-500 hover:text-white text-xs ml-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* 실시간 금지어 경고 확인 모달 */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <ShieldAlert className="h-7 w-7 shrink-0" />
              <h3 className="text-lg font-black text-slate-900">
                보도 윤리 금지어 감지 안내
              </h3>
            </div>
            <p className="text-xs leading-relaxed text-slate-600">
              작성 중인 기사에 한국인터넷신문윤리강령 상 사용이 제한되는 <strong>금지어 {forbiddenIssues.length}건</strong>이 감지되었습니다. 발행 전 권장 표현으로 교정하거나 확인 후 저장하시기 바랍니다.
            </p>

            <div className="rounded-2xl border border-rose-100 bg-rose-50/60 p-3 text-xs space-y-1.5 max-h-40 overflow-y-auto">
              {forbiddenIssues.map((issue, idx) => (
                <div key={idx} className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-rose-950">[{issue.fieldName}] {issue.keyword}</span>
                  <span className="text-rose-700 font-medium">&rarr; {issue.suggestions[0] || '객관적 표현'}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="rounded-xl border px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                교정하러 돌아가기
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowConfirmModal(false);
                  pendingSubmitForm?.requestSubmit();
                }}
                className="rounded-xl bg-rose-600 hover:bg-rose-700 px-4 py-2 text-xs font-black text-white shadow-sm"
              >
                주의 사항 인지하고 저장
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 메인 레이아웃: 좌측 편집 폼 + 우측 실시간 AI 보도 윤리 데스크 */}
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* 좌측: 기사 편집 입력 폼 */}
        <div className="lg:col-span-7 space-y-6">
          <form action={action} onSubmit={handleFormSubmit} className="grid gap-6">
            {/* 상단 팩트체크 및 인터넷신문 기사 요건 안내 */}
            <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-5 text-xs text-blue-950 leading-relaxed">
              <p className="font-bold text-sm text-blue-900 flex items-center gap-1.5 mb-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>인터넷신문 기사 필수 요건 & 실시간 윤리 감지 시스템 가동 중</span>
              </p>
              <p className="text-blue-800 text-[11px]">
                한국AI교육신문 편집국 시스템은 기사 작성과 동시에 금지어(단정·과장, 낚시성, 차별표현, 기사형 광고)를 실시간으로 탐지하며, 우측 패널에서 Gemini AI의 보도 윤리 교정을 즉시 적용할 수 있습니다.
              </p>
            </div>

            {/* 기본 정보 (제목, 슬러그, 부제, 전문, 본문) */}
            <section className="grid gap-4 rounded-3xl bg-white border border-slate-200 p-6 shadow-2xs">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-black text-slate-900">기사 본문 작성</h2>
                {realtimeIssues.length > 0 && (
                  <span className="text-xs font-bold text-rose-600 flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    금지·주의 표현 {realtimeIssues.length}건 실시간 감지됨
                  </span>
                )}
              </div>

              {/* 기사 제목 */}
              <label className="grid gap-1.5 text-xs font-bold text-slate-700">
                기사 제목 (필수)
                <input
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  minLength={2}
                  placeholder="예: 교육부, 2026 AI 맞춤형 학습 플랫폼 종합 가이드라인 발표"
                  className="rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-blue-600 focus:outline-hidden"
                />
              </label>

              {/* 슬러그 */}
              <label className="grid gap-1.5 text-xs font-bold text-slate-700">
                슬러그 (URL 식별자)
                <input
                  name="slug"
                  defaultValue={initialData?.slug}
                  placeholder="비워두면 제목 기준으로 자동 생성됩니다"
                  className="rounded-xl border border-slate-300 px-4 py-2.5 text-xs text-slate-600 focus:border-blue-600 focus:outline-hidden font-mono"
                />
              </label>

              {/* 부제 */}
              <label className="grid gap-1.5 text-xs font-bold text-slate-700">
                부제 (선택)
                <input
                  name="subtitle"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="기사의 핵심 배경이나 핵심 수치를 요약하는 소제목"
                  className="rounded-xl border border-slate-300 px-4 py-2.5 text-xs text-slate-700 focus:border-blue-600 focus:outline-hidden"
                />
              </label>

              {/* 기사 전문 / 리드문 */}
              <label className="grid gap-1.5 text-xs font-bold text-slate-700">
                기사 전문 / 리드문 요약 (권장)
                <textarea
                  name="summary"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={3}
                  placeholder="기사 전체의 핵심 요지를 2~3문장의 6하원칙으로 간결하게 작성하세요."
                  className="rounded-xl border border-slate-300 px-4 py-2.5 text-xs leading-relaxed text-slate-700 focus:border-blue-600 focus:outline-hidden"
                />
              </label>

              {/* 본문 에디터 */}
              <div className="grid gap-1.5 text-xs font-bold text-slate-700">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label htmlFor="article-content-field" className="text-xs font-bold text-slate-700">
                    본문 (필수)
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[11px] font-mono ${content.length >= 2000 ? 'text-emerald-600 font-bold' : 'text-slate-500'}`}>
                      {content.length.toLocaleString()}자 {content.length >= 2000 ? '(심층 규격)' : ''}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveSideTab('visuals');
                        const panel = document.getElementById('side-assistant-panel');
                        if (panel) {
                          panel.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-[11px] font-black shadow-xs transition-all"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-blue-200" />
                      <span>✨ AI 시각자료 생성·추천</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleInsertDeepTemplate}
                      className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-[11px] font-bold transition-colors border border-blue-200"
                    >
                      + 심층 템플릿(2배)
                    </button>
                  </div>
                </div>
                <textarea
                  id="article-content-field"
                  name="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={18}
                  required
                  minLength={20}
                  placeholder="6하원칙에 입각한 기사 본문을 작성하세요. 소제목은 '■ [주제]' 형식으로 구분할 수 있습니다."
                  className="rounded-xl border border-slate-300 p-4 font-mono text-xs leading-relaxed text-slate-800 focus:border-blue-600 focus:outline-hidden"
                />
              </div>
            </section>

            {/* 분류 및 발행 설정 */}
            <section className="grid gap-4 rounded-3xl bg-white border border-slate-200 p-6 shadow-2xs md:grid-cols-2">
              <h2 className="md:col-span-2 text-base font-black text-slate-900">분류 및 발행 정보</h2>
              
              <label className="grid gap-1.5 text-xs font-bold text-slate-700">
                카테고리 (필수)
                <select
                  name="category_slug"
                  value={categorySlug}
                  onChange={(e) => setCategorySlug(e.target.value)}
                  required
                  className="rounded-xl border border-slate-300 px-4 py-2.5 text-xs bg-white"
                >
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </label>

              <label className="grid gap-1.5 text-xs font-bold text-slate-700">
                발행 상태
                <select
                  name="status"
                  defaultValue={initialData?.status || 'published'}
                  className="rounded-xl border border-slate-300 px-4 py-2.5 text-xs bg-white"
                >
                  <option value="draft">임시저장</option>
                  <option value="review">검수 대기</option>
                  <option value="scheduled">예약 발행</option>
                  <option value="published">즉시 발행</option>
                </select>
              </label>

              <label className="grid gap-1.5 text-xs font-bold text-slate-700">
                기사 유형
                <select
                  name="article_type"
                  defaultValue={initialData?.article_type || 'normal'}
                  className="rounded-xl border border-slate-300 px-4 py-2.5 text-xs bg-white"
                >
                  <option value="normal">일반 취재기사</option>
                  <option value="press_release">보도자료</option>
                  <option value="brand_interview">기획 인터뷰</option>
                  <option value="sponsored">협찬 기사</option>
                  <option value="advertorial">광고성 기사</option>
                </select>
              </label>

              <label className="grid gap-1.5 text-xs font-bold text-slate-700">
                예약 발행 시각
                <input
                  name="scheduled_at"
                  type="datetime-local"
                  defaultValue={initialData?.scheduled_at}
                  className="rounded-xl border border-slate-300 px-4 py-2.5 text-xs"
                />
              </label>

              <label className="grid gap-1.5 text-xs font-bold text-slate-700">
                작성 기자명 (바이라인 필수)
                <input
                  name="author_name"
                  defaultValue={initialData?.author_name || '한국AI교육신문 취재팀'}
                  required
                  placeholder="예: 홍길동 (취재기자)"
                  className="rounded-xl border border-slate-300 px-4 py-2.5 text-xs"
                />
              </label>

              <label className="grid gap-1.5 text-xs font-bold text-slate-700">
                태그
                <input
                  name="tags"
                  defaultValue={initialData?.tags}
                  placeholder="AI교육, 평생학습, 에듀테크 (쉼표 구분)"
                  className="rounded-xl border border-slate-300 px-4 py-2.5 text-xs"
                />
              </label>
            </section>

            {/* 대표 이미지 및 저작권 출처 */}
            <section className="grid gap-4 rounded-3xl bg-white border border-slate-200 p-6 shadow-2xs md:grid-cols-2">
              <h2 className="md:col-span-2 text-base font-black text-slate-900">대표 이미지 및 저작권 출처</h2>
              
              <label className="grid gap-1.5 text-xs font-bold text-slate-700">
                대표 이미지 URL
                <input
                  name="thumbnail_url"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="https://..."
                  className="rounded-xl border border-slate-300 px-4 py-2.5 text-xs font-mono"
                />
              </label>

              <label className="grid gap-1.5 text-xs font-bold text-slate-700">
                이미지 원본 URL
                <input
                  name="image_source_url"
                  defaultValue={initialData?.image_source_url}
                  className="rounded-xl border border-slate-300 px-4 py-2.5 text-xs font-mono"
                />
              </label>

              <label className="grid gap-1.5 text-xs font-bold text-slate-700">
                이미지 출처명 (기관/촬영자)
                <input
                  name="image_source_name"
                  value={imageSourceName}
                  onChange={(e) => setImageSourceName(e.target.value)}
                  placeholder="직접 촬영 / 한국AI교육신문 AI비주얼팀 / 공공누리"
                  className="rounded-xl border border-slate-300 px-4 py-2.5 text-xs"
                />
              </label>

              <label className="grid gap-1.5 text-xs font-bold text-slate-700">
                이미지 저작자
                <input
                  name="image_author"
                  value={imageAuthor}
                  onChange={(e) => setImageAuthor(e.target.value)}
                  placeholder="예: 한국AI교육신문 취재팀"
                  className="rounded-xl border border-slate-300 px-4 py-2.5 text-xs"
                />
              </label>

              <label className="grid gap-1.5 text-xs font-bold text-slate-700 md:col-span-2">
                이미지 캡션
                <input
                  name="image_caption"
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  placeholder="▲ 사진 또는 인포그래픽에 대한 구체적인 설명"
                  className="rounded-xl border border-slate-300 px-4 py-2.5 text-xs"
                />
              </label>

              <label className="grid gap-1.5 text-xs font-bold text-slate-700 md:col-span-2">
                이미지 라이선스
                <input
                  name="image_license"
                  value={imageLicense}
                  onChange={(e) => setImageLicense(e.target.value)}
                  placeholder="보도용 제공 / 자체 제작 저작권 준수 / 공공누리"
                  className="rounded-xl border border-slate-300 px-4 py-2.5 text-xs"
                />
              </label>

              {/* 실시간 썸네일 미리보기 */}
              {thumbnailUrl && (
                <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 space-y-2">
                  <span className="text-[11px] font-black text-slate-700 flex items-center gap-1.5">
                    <ImageIcon className="h-3.5 w-3.5 text-blue-600" />
                    <span>대표 이미지 미리보기</span>
                  </span>
                  <div className="relative aspect-[16/9] max-h-48 overflow-hidden rounded-xl border border-slate-200 bg-slate-900">
                    <img
                      src={thumbnailUrl}
                      alt={imageCaption || '대표 이미지'}
                      className="h-full w-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  {imageCaption && (
                    <p className="text-[11px] text-slate-500 font-medium text-center">
                      {imageCaption}
                    </p>
                  )}
                </div>
              )}
            </section>

            {/* 팩트체크 및 컴플라이언스 검수 */}
            <section className="grid gap-4 rounded-3xl bg-white border border-slate-200 p-6 shadow-2xs">
              <h2 className="text-base font-black text-slate-900">검수 및 출처 근거</h2>
              <label className="grid gap-1.5 text-xs font-bold text-slate-700">
                참고 출처 URL
                <textarea
                  name="source_urls"
                  defaultValue={initialData?.source_urls}
                  rows={2}
                  placeholder="한 줄에 하나씩 입력"
                  className="rounded-xl border border-slate-300 px-4 py-2 text-xs"
                />
              </label>
              <label className="grid gap-1.5 text-xs font-bold text-slate-700">
                출처 메모
                <input
                  name="source_note"
                  defaultValue={initialData?.source_note}
                  className="rounded-xl border border-slate-300 px-4 py-2.5 text-xs"
                />
              </label>

              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    name="fact_checked"
                    type="checkbox"
                    defaultChecked={initialData?.fact_checked ?? true}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>팩트체크 완료 (복수 출처 교차 검증)</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    name="compliance_checked"
                    type="checkbox"
                    defaultChecked={initialData?.compliance_checked ?? true}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>광고성 / 저작권 / 명예훼손 위험 검토 완료</span>
                </label>
              </div>
            </section>

            {/* Git 백업 커밋 옵션 */}
            <section className="rounded-3xl border border-amber-200 bg-amber-50/70 p-5 text-xs text-amber-950">
              <h3 className="font-black text-amber-900 mb-1">Git 기사 원문 스냅샷 백업</h3>
              <p className="text-amber-800 text-[11px] mb-3">
                DB 저장 후 GitHub main 브랜치(content/articles/)에 기사 스냅샷 파일을 안전하게 백업합니다.
              </p>
              <label className="flex items-center gap-2 font-bold cursor-pointer">
                <input
                  name="commit_to_git"
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-amber-400 text-amber-600"
                />
                <span>기사 스냅샷을 GitHub 저장소에 커밋</span>
              </label>
            </section>

            {/* 저장 버튼 */}
            <div className="flex items-center justify-between gap-4 pt-4">
              <Link
                href="/admin/articles"
                className="rounded-2xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                취소 및 목록
              </Link>
              <button
                type="submit"
                className="flex-1 rounded-2xl bg-blue-600 hover:bg-blue-700 px-6 py-4 text-base font-black text-white shadow-md transition-colors"
              >
                DB에 저장하고 공개 사이트에 반영
              </button>
            </div>
          </form>
        </div>

        {/* 우측: AI 어시스턴트 데스크 (AI 시각 자료 생성/추천 + 실시간 보도 윤리 데스크) */}
        <div id="side-assistant-panel" className="lg:col-span-5 lg:sticky lg:top-6 space-y-4">
          {/* 상단 탭 스위처 */}
          <div className="flex items-center rounded-2xl bg-slate-100 p-1 border border-slate-200 shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveSideTab('visuals')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-black transition-all ${
                activeSideTab === 'visuals'
                  ? 'bg-white text-blue-600 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI 시각자료·이미지</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSideTab('ethics')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-black transition-all ${
                activeSideTab === 'ethics'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>보도 윤리 데스크</span>
              {realtimeIssues.length > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white">
                  {realtimeIssues.length}
                </span>
              )}
            </button>
          </div>

          {activeSideTab === 'visuals' ? (
            <ArticleVisualAidsPanel
              title={title}
              subtitle={subtitle}
              category={categories.find(c => c.slug === categorySlug)?.name || categorySlug}
              categorySlug={categorySlug}
              content={content}
              onInsertMarkdown={handleInsertVisualIntoContent}
              onSetThumbnail={handleSetVisualAsThumbnail}
            />
          ) : (
            <ArticleEthicsPanel
              realtimeIssues={realtimeIssues}
              title={title}
              subtitle={subtitle}
              summary={summary}
              content={content}
              category={categories.find(c => c.slug === categorySlug)?.name || categorySlug}
              onApplySingleCorrection={handleApplySingleCorrection}
              onApplyAllCorrections={handleApplyAllCorrections}
            />
          )}
        </div>
      </div>
    </div>
  );
}
