'use client';

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Undo2, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  Loader2,
  HelpCircle
} from 'lucide-react';
import type { DetectedIssue } from '@/lib/ethics/forbidden-words';
import type { EthicsProofreadResponse, EthicsIssue } from '@/app/api/gemini/ethics-proofread/route';

interface ArticleEthicsPanelProps {
  realtimeIssues: DetectedIssue[];
  title: string;
  subtitle: string;
  summary: string;
  content: string;
  category: string;
  onApplySingleCorrection: (field: 'title' | 'subtitle' | 'summary' | 'content', original: string, replacement: string) => void;
  onApplyAllCorrections: (corrected: { title: string; subtitle: string; summary: string; content: string }) => void;
}

export function ArticleEthicsPanel({
  realtimeIssues,
  title,
  subtitle,
  summary,
  content,
  category,
  onApplySingleCorrection,
  onApplyAllCorrections
}: ArticleEthicsPanelProps) {
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<EthicsProofreadResponse | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [showDiffModal, setShowDiffModal] = useState(false);
  const [appliedMap, setAppliedMap] = useState<Record<string, boolean>>({});

  const forbiddenCount = realtimeIssues.filter(i => i.severity === 'forbidden').length;
  const warningCount = realtimeIssues.filter(i => i.severity === 'warning').length;

  const runAiProofread = async () => {
    if (!title && !content) {
      alert('기사 제목 또는 본문을 입력한 후 AI 교정 제안을 실행해 주세요.');
      return;
    }

    setIsAiLoading(true);
    setAiError(null);

    try {
      const res = await fetch('/api/gemini/ethics-proofread', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          subtitle,
          summary,
          content,
          category
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'AI 보도 윤리 검사 중 오류가 발생했습니다.');
      }

      const data: EthicsProofreadResponse = await res.json();
      setAiResult(data);
      setAppliedMap({});
    } catch (err: any) {
      setAiError(err.message || 'AI 교정 서비스를 호출할 수 없습니다.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleApplySingle = (issue: EthicsIssue, index: number) => {
    let field: 'title' | 'subtitle' | 'summary' | 'content' = 'content';
    if (issue.location === '제목') field = 'title';
    else if (issue.location === '부제') field = 'subtitle';
    else if (issue.location === '요약') field = 'summary';

    onApplySingleCorrection(field, issue.original, issue.suggestion);
    setAppliedMap(prev => ({ ...prev, [`ai-${index}`]: true }));
  };

  const handleApplyRealtime = (issue: DetectedIssue, suggestion: string) => {
    onApplySingleCorrection(issue.field, issue.keyword, suggestion);
  };

  const handleApplyAll = () => {
    if (!aiResult) return;
    onApplyAllCorrections({
      title: aiResult.correctedTitle || title,
      subtitle: aiResult.correctedSubtitle || subtitle,
      summary: aiResult.correctedSummary || summary,
      content: aiResult.correctedContent || content
    });
    alert('AI 권장 교정안이 제목, 부제, 요약, 본문에 일괄 반영되었습니다.');
  };

  return (
    <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
      {/* 1. 패널 헤더 & 실시간 상태 요약 */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              실시간 금지어 및 보도 윤리 AI 데스크
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setShowGuidelines(!showGuidelines)}
            className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>윤리 기준 안내</span>
            {showGuidelines ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
        </div>
        <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
          한국인터넷신문윤리강령 및 포털 어뷰징 기준을 바탕으로 작성 중인 문장을 실시간 감지하고, AI가 표준 저널리즘 표현으로 자동 교정해 드립니다.
        </p>

        {/* 윤리 강령 기준 치트시트 아코디언 */}
        {showGuidelines && (
          <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50/90 p-4 text-xs text-slate-700 space-y-2.5">
            <p className="font-bold text-slate-900 flex items-center gap-1.5">
              <span>📚 한국AI교육신문 보도 윤리 5대 핵심 준칙</span>
            </p>
            <div className="grid gap-2 sm:grid-cols-2 text-[11px] leading-relaxed">
              <div className="rounded-xl border border-slate-200 bg-white p-2.5">
                <span className="font-bold text-red-600">1. 단정적 허위·과장 배제</span>
                <p className="text-slate-600 mt-0.5">100%, 무조건, 세계 최초, 혁명적 등 실증 통계 없는 최상급 수식어 금지 (제4조 객관성)</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-2.5">
                <span className="font-bold text-orange-600">2. 선정적 낚시성 표제어 금지</span>
                <p className="text-slate-600 mt-0.5">충격, 경악, 발칵, 멘붕, 대참사 등 독자 클릭 유도형 어뷰징 감탄사 금지 (제10조)</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-2.5">
                <span className="font-bold text-purple-600">3. 차별·비하 및 인권 용어 준수</span>
                <p className="text-slate-600 mt-0.5">장애인 비하(장님/귀머거리 금지), 결손가정(한부모가족 권장), 세대/학벌 혐오어 전면 배제 (제3조)</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-2.5">
                <span className="font-bold text-emerald-600">4. 기사형 광고 및 판촉 배제</span>
                <p className="text-slate-600 mt-0.5">지금 바로 구매, 초특가, 최저가 등 노골적 호객·판촉 문구 엄금 (제12조 기사와 광고 분리)</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. 실시간 금지어/주의표현 진단 뱃지 바 */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">실시간 감지 결과:</span>
            {forbiddenCount === 0 && warningCount === 0 ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                금지·주의 표현 없음 (안전)
              </span>
            ) : (
              <div className="flex items-center gap-2">
                {forbiddenCount > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-800">
                    <ShieldAlert className="h-3.5 w-3.5 text-rose-600" />
                    금지어 {forbiddenCount}건
                  </span>
                )}
                {warningCount > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                    주의 표현 {warningCount}건
                  </span>
                )}
              </div>
            )}
          </div>

          {/* AI 교정 제안 실행 버튼 */}
          <button
            type="button"
            onClick={runAiProofread}
            disabled={isAiLoading}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs font-black shadow-sm transition-all disabled:opacity-50"
          >
            {isAiLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>AI 보도 윤리 심의 중...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                <span>AI 윤리 정밀 진단 및 교정</span>
              </>
            )}
          </button>
        </div>

        {/* 실시간 감지된 세부 목록 */}
        {realtimeIssues.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-200/80 space-y-2.5">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              즉시 검토가 필요한 표현 ({realtimeIssues.length})
            </p>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {realtimeIssues.map((issue) => (
                <div
                  key={issue.id}
                  className={`rounded-xl p-3 text-xs border ${
                    issue.severity === 'forbidden'
                      ? 'border-rose-200 bg-rose-50/80 text-rose-950'
                      : 'border-amber-200 bg-amber-50/80 text-amber-950'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                        issue.severity === 'forbidden' ? 'bg-rose-600 text-white' : 'bg-amber-600 text-white'
                      }`}>
                        {issue.severity === 'forbidden' ? '금지어' : '주의'}
                      </span>
                      <span className="font-bold text-slate-800">[{issue.fieldName}]</span>
                      <strong className="underline underline-offset-2">'{issue.keyword}'</strong>
                      <span className="text-[11px] text-slate-500 font-medium">({issue.categoryName})</span>
                    </div>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-600 leading-relaxed">
                    {issue.reason}
                  </p>

                  {/* 추천 대체어 즉시 적용 버튼들 */}
                  {issue.suggestions.length > 0 && (
                    <div className="mt-2 flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-slate-200/60">
                      <span className="text-[11px] font-bold text-slate-600">권장 대체:</span>
                      {issue.suggestions.map((sug) => (
                        <button
                          key={sug}
                          type="button"
                          onClick={() => handleApplyRealtime(issue, sug)}
                          className="rounded-lg bg-white border border-slate-300 hover:border-blue-600 hover:text-blue-600 px-2 py-0.5 text-[11px] font-medium text-slate-700 transition-colors shadow-2xs"
                        >
                          {sug} 적용 &rarr;
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. AI 보도 윤리 정밀 진단 결과 영역 */}
      {aiError && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800">
          <div className="flex items-center gap-2 font-bold text-rose-950">
            <AlertTriangle className="h-4 w-4 text-rose-600" />
            <span>AI 보도 윤리 검사 오류</span>
          </div>
          <p className="mt-1 leading-relaxed">{aiError}</p>
        </div>
      )}

      {aiResult && (
        <div className="space-y-4 rounded-3xl border-2 border-blue-100 bg-blue-50/40 p-5">
          {/* 점수 & 총평 헤더 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-blue-200/60">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
                  AI 윤리 준수 지수
                </span>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-black ${
                  aiResult.ethicsScore >= 85
                    ? 'bg-emerald-600 text-white'
                    : aiResult.ethicsScore >= 70
                    ? 'bg-amber-600 text-white'
                    : 'bg-rose-600 text-white'
                }`}>
                  {aiResult.ethicsScore}점 ({aiResult.status === 'safe' ? '안전' : aiResult.status === 'caution' ? '보완 필요' : '심각한 위반'})
                </span>
              </div>
              <p className="mt-1.5 text-xs text-slate-700 leading-relaxed">
                {aiResult.overallAssessment}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleApplyAll}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 text-xs font-black shadow-sm transition-all"
              >
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span>AI 권장안 일괄 적용</span>
              </button>
            </div>
          </div>

          {/* AI가 발견한 세부 문제점 및 1:1 교정 카드들 */}
          {aiResult.issues.length > 0 ? (
            <div className="space-y-2.5">
              <p className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>세부 교정 제안 항목 ({aiResult.issues.length}건)</span>
                <span className="text-[11px] text-slate-500 font-normal">원하는 항목만 개별 적용할 수 있습니다.</span>
              </p>
              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {aiResult.issues.map((issue, idx) => {
                  const isApplied = appliedMap[`ai-${idx}`];
                  return (
                    <div
                      key={idx}
                      className="rounded-2xl border border-slate-200 bg-white p-3.5 text-xs shadow-2xs space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-700">
                            {issue.location}
                          </span>
                          <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                            issue.type === 'forbidden'
                              ? 'bg-red-100 text-red-800'
                              : issue.type === 'ad_risk'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {issue.type === 'forbidden' ? '금지어' : issue.type === 'ad_risk' ? '광고성' : '윤리보완'}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-500">
                            {issue.clause}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleApplySingle(issue, idx)}
                          disabled={isApplied}
                          className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all ${
                            isApplied
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 cursor-default'
                              : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-600 hover:text-white'
                          }`}
                        >
                          {isApplied ? (
                            <>
                              <Check className="h-3 w-3" />
                              <span>적용됨</span>
                            </>
                          ) : (
                            <>
                              <span>이 교정 적용</span>
                              <ArrowRight className="h-3 w-3" />
                            </>
                          )}
                        </button>
                      </div>

                      {/* 원문과 권장문 비교 */}
                      <div className="rounded-xl bg-slate-50 p-2.5 grid gap-1.5 text-slate-800">
                        <div className="flex items-start gap-1.5">
                          <span className="text-[10px] font-black uppercase text-rose-600 shrink-0 pt-0.5">기존:</span>
                          <span className="line-through text-rose-700 bg-rose-50/80 px-1.5 py-0.5 rounded font-mono text-[11px]">
                            {issue.original}
                          </span>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <span className="text-[10px] font-black uppercase text-emerald-600 shrink-0 pt-0.5">권장:</span>
                          <span className="text-emerald-800 bg-emerald-50/80 px-1.5 py-0.5 rounded font-bold font-mono text-[11px]">
                            {issue.suggestion}
                          </span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        <strong>사유:</strong> {issue.reason}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="rounded-xl bg-white p-3.5 text-center text-xs text-slate-600">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
              <p className="font-bold text-slate-800">보도 윤리에 위배되는 표현이 발견되지 않았습니다.</p>
              <p className="text-slate-500 mt-0.5">기사의 객관성과 품격이 충실히 유지되고 있습니다.</p>
            </div>
          )}

          {/* 편집국 데스크 권장사항 */}
          {aiResult.recommendations?.length > 0 && (
            <div className="pt-3 border-t border-blue-200/60 space-y-1.5 text-xs">
              <p className="font-bold text-slate-800 flex items-center gap-1.5">
                <span>💡 편집국 데스크 심의 권고</span>
              </p>
              <ul className="list-disc list-inside space-y-0.5 text-slate-600 text-[11px] leading-relaxed">
                {aiResult.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
