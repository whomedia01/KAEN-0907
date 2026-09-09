'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Image as ImageIcon, 
  BarChart3, 
  CheckCircle2, 
  Copy, 
  ArrowDownToLine, 
  Eye, 
  Loader2, 
  Sliders, 
  Plus, 
  X,
  ExternalLink,
  Layers,
  FileCheck2,
  Check
} from 'lucide-react';
import type { VisualAidItem, VisualAidResponse } from '@/app/api/gemini/visual-aids/route';

interface ArticleVisualAidsPanelProps {
  title: string;
  subtitle: string;
  category: string;
  categorySlug: string;
  content: string;
  onInsertMarkdown: (markdown: string, placementHint?: string) => void;
  onSetThumbnail: (imageUrl: string, caption: string, sourceName: string) => void;
}

export function ArticleVisualAidsPanel({
  title,
  subtitle,
  category,
  categorySlug,
  content,
  onInsertMarkdown,
  onSetThumbnail
}: ArticleVisualAidsPanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<VisualAidResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [insertedIds, setInsertedIds] = useState<Record<string, boolean>>({});
  const [thumbnailSetId, setThumbnailSetId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<VisualAidItem | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'recommendations' | 'custom'>('recommendations');

  // 커스텀 생성 폼 상태
  const [customType, setCustomType] = useState<'checklist' | 'stats' | 'roadmap'>('checklist');
  const [customTitle, setCustomTitle] = useState('');
  const [customSubtitle, setCustomSubtitle] = useState('');
  const [isCustomGenerating, setIsCustomGenerating] = useState(false);

  const runAnalysis = async () => {
    if (!title && !content) {
      alert('기사 제목 또는 본문을 입력한 후 AI 시각 자료 생성을 실행해 주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/gemini/visual-aids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          subtitle,
          category,
          categorySlug,
          content,
          mode: 'recommend'
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || '시각 자료 생성 중 오류가 발생했습니다.');
      }

      const result: VisualAidResponse = await res.json();
      setData(result);
    } catch (err: any) {
      setError(err.message || '시각 자료 서비스를 호출할 수 없습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInsert = (item: VisualAidItem) => {
    onInsertMarkdown(item.markdownSnippet, item.recommendedPlacement);
    setInsertedIds(prev => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setInsertedIds(prev => ({ ...prev, [item.id]: false }));
    }, 3000);
  };

  const handleSetThumbnail = (item: VisualAidItem) => {
    onSetThumbnail(item.imageUrl, item.caption, item.sourceName);
    setThumbnailSetId(item.id);
    setTimeout(() => setThumbnailSetId(null), 3000);
  };

  const handleCopyUrl = (item: VisualAidItem) => {
    navigator.clipboard.writeText(item.imageUrl);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) {
      alert('인포그래픽 제목을 입력해 주세요.');
      return;
    }

    setIsCustomGenerating(true);
    try {
      const res = await fetch('/api/gemini/visual-aids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          mode: 'custom_generate',
          customData: {
            visualType: customType,
            title: customTitle,
            subtitle: customSubtitle || undefined
          }
        })
      });

      const resData = await res.json();
      if (resData.item) {
        setData(prev => {
          if (!prev) {
            return {
              analysisSummary: '사용자 지정 맞춤 인포그래픽이 생성되었습니다.',
              articleFocalPoints: [],
              recommendations: [resData.item]
            };
          }
          return {
            ...prev,
            recommendations: [resData.item, ...prev.recommendations]
          };
        });
        setActiveSubTab('recommendations');
        setCustomTitle('');
        setCustomSubtitle('');
      }
    } catch (err: any) {
      alert('커스텀 생성 중 오류가 발생했습니다: ' + err.message);
    } finally {
      setIsCustomGenerating(false);
    }
  };

  const getTypeBadge = (type: VisualAidItem['type']) => {
    switch (type) {
      case 'infographic_checklist':
        return { label: '체크리스트 도해', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'infographic_stats':
        return { label: '통계 지표 차트', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'infographic_roadmap':
        return { label: '3단계 로드맵', bg: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'press_photo':
        return { label: '현장 보도 사진', bg: 'bg-amber-50 text-amber-800 border-amber-200' };
      default:
        return { label: '시각 자료', bg: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xs space-y-5">
      {/* 패널 헤더 */}
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xs">
              <Sparkles className="h-4 w-4" />
            </span>
            <h3 className="text-base font-black text-slate-900">
              AI 시각 자료 & 본문 이미지 생성
            </h3>
          </div>
          <p className="mt-1 text-xs text-slate-500 leading-relaxed">
            기사 본문을 분석하여 가독성을 높이는 언론사 표준 인포그래픽과 보도 사진을 추천·생성합니다.
          </p>
        </div>

        <button
          type="button"
          onClick={runAnalysis}
          disabled={isLoading}
          className="shrink-0 flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 px-3.5 py-2 text-xs font-black text-white shadow-xs transition-colors"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>AI 분석·생성 중...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5" />
              <span>시각 자료 생성</span>
            </>
          )}
        </button>
      </div>

      {/* 서브 탭: 추천 목록 vs 커스텀 제작 */}
      <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
        <button
          type="button"
          onClick={() => setActiveSubTab('recommendations')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            activeSubTab === 'recommendations'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          AI 추천 자료 {data?.recommendations ? `(${data.recommendations.length})` : ''}
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('custom')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ${
            activeSubTab === 'custom'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Plus className="h-3 w-3" />
          <span>직접 인포그래픽 만들기</span>
        </button>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
          {error}
        </div>
      )}

      {/* 탭 1: 추천 목록 */}
      {activeSubTab === 'recommendations' && (
        <div className="space-y-4">
          {!data && !isLoading && (
            <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <ImageIcon className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-black text-slate-800">
                  기사 본문과 직결되는 시각 보조 자료가 없습니다
                </p>
                <p className="text-[11px] text-slate-500 leading-relaxed max-w-xs mx-auto">
                  우측 상단 <strong>&lsquo;시각 자료 생성&rsquo;</strong> 버튼을 누르면 AI가 제목과 본문을 분석하여 5대 점검 기준 인포그래픽, 통계 차트, 보도 사진을 자동 생성합니다.
                </p>
              </div>
              <button
                type="button"
                onClick={runAnalysis}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 shadow-xs transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                <span>지금 기사 분석 및 시각자료 생성</span>
              </button>
            </div>
          )}

          {isLoading && (
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-8 text-center space-y-3">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
              <p className="text-xs font-bold text-slate-800">
                기사 본문 맥락을 분석하고 인포그래픽을 렌더링 중입니다...
              </p>
              <p className="text-[11px] text-slate-500">
                5대 점검 기준, 통계 성과 지표, 3단계 추진 로드맵 및 매칭 보도 사진을 합성하고 있습니다.
              </p>
            </div>
          )}

          {data && !isLoading && (
            <div className="space-y-4">
              {/* 요약 팁 */}
              <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3 text-xs text-blue-900 space-y-1">
                <div className="flex items-center gap-1.5 font-black text-blue-950">
                  <FileCheck2 className="h-4 w-4 text-blue-600" />
                  <span>AI 분석 결과: 4종의 고해상도 시각 자료가 준비되었습니다</span>
                </div>
                <p className="text-[11px] text-blue-800 leading-relaxed">
                  원하는 자료의 <strong>[본문에 삽입]</strong>을 누르면 본문 마크다운으로 자동 삽입되며, <strong>[대표 썸네일 지정]</strong>을 누르면 기사 대표 이미지로 등록됩니다.
                </p>
              </div>

              {/* 시각자료 카드 리스트 */}
              <div className="space-y-4 max-h-[580px] overflow-y-auto pr-1">
                {data.recommendations.map((item) => {
                  const badge = getTypeBadge(item.type);
                  const isInserted = insertedIds[item.id];
                  const isThumbnail = thumbnailSetId === item.id;
                  const isCopied = copiedId === item.id;

                  return (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-slate-200 bg-white hover:border-blue-300 transition-all p-3.5 shadow-2xs space-y-3"
                    >
                      {/* 카드 상단 배지 & 유형 */}
                      <div className="flex items-center justify-between gap-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${badge.bg}`}>
                          {badge.label}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {item.aspectRatio} 규격
                        </span>
                      </div>

                      {/* 이미지 미리보기 썸네일 */}
                      <div className="relative group overflow-hidden rounded-xl bg-slate-900 border border-slate-200 aspect-[16/9] w-full">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-102"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => setPreviewItem(item)}
                            className="p-2 rounded-xl bg-white/90 text-slate-900 hover:bg-white text-xs font-bold shadow-md flex items-center gap-1"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>크게 보기</span>
                          </button>
                        </div>
                      </div>

                      {/* 제목 & 설명 */}
                      <div className="space-y-1">
                        <h4 className="text-xs font-black text-slate-900 line-clamp-1">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                          {item.description}
                        </p>
                      </div>

                      {/* 추천 위치 안내 */}
                      <div className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-[10px] text-slate-600 font-medium flex items-center gap-1.5 border border-slate-100">
                        <span className="font-bold text-blue-600 shrink-0">권장 위치:</span>
                        <span className="truncate">{item.recommendedPlacement}</span>
                      </div>

                      {/* 캡션 & 출처 표기 */}
                      <div className="text-[10px] text-slate-400 space-y-0.5 border-t border-slate-100 pt-2">
                        <div className="truncate font-medium text-slate-600">{item.caption}</div>
                        <div className="text-slate-400">출처: {item.sourceName}</div>
                      </div>

                      {/* 액션 버튼 그룹 */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleInsert(item)}
                          className={`flex items-center justify-center gap-1.5 rounded-xl px-2.5 py-2 text-xs font-bold transition-colors ${
                            isInserted
                              ? 'bg-emerald-600 text-white'
                              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-2xs'
                          }`}
                        >
                          {isInserted ? (
                            <>
                              <Check className="h-3.5 w-3.5" />
                              <span>본문 삽입됨!</span>
                            </>
                          ) : (
                            <>
                              <ArrowDownToLine className="h-3.5 w-3.5" />
                              <span>본문에 삽입</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSetThumbnail(item)}
                          className={`flex items-center justify-center gap-1.5 rounded-xl border px-2.5 py-2 text-xs font-bold transition-colors ${
                            isThumbnail
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-black'
                              : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          {isThumbnail ? (
                            <>
                              <Check className="h-3.5 w-3.5" />
                              <span>대표 지정 완료!</span>
                            </>
                          ) : (
                            <>
                              <ImageIcon className="h-3.5 w-3.5 text-slate-500" />
                              <span>대표 이미지 지정</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="flex items-center justify-end gap-3 text-[11px] text-slate-500 pt-0.5">
                        <button
                          type="button"
                          onClick={() => handleCopyUrl(item)}
                          className="hover:text-slate-900 transition-colors flex items-center gap-1"
                        >
                          {isCopied ? (
                            <span className="text-emerald-600 font-bold">복사 완료!</span>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              <span>이미지 URL 복사</span>
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewItem(item)}
                          className="hover:text-slate-900 transition-colors flex items-center gap-1"
                        >
                          <Eye className="h-3 w-3" />
                          <span>미리보기</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 탭 2: 직접 인포그래픽 제작 폼 */}
      {activeSubTab === 'custom' && (
        <form onSubmit={handleCreateCustom} className="space-y-4">
          <div className="space-y-1">
            <h4 className="text-xs font-black text-slate-900">맞춤형 인포그래픽 생성기</h4>
            <p className="text-[11px] text-slate-500">
              원하는 인포그래픽 유형과 제목을 입력하면 고해상도 벡터 그래픽으로 즉각 렌더링됩니다.
            </p>
          </div>

          <label className="grid gap-1.5 text-xs font-bold text-slate-700">
            인포그래픽 유형 선택
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setCustomType('checklist')}
                className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all ${
                  customType === 'checklist'
                    ? 'border-blue-600 bg-blue-50/60 text-blue-950 ring-1 ring-blue-600'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="font-black text-xs">체크리스트</div>
                <div className="text-[10px] text-slate-500 mt-0.5">5대 기준 가이드</div>
              </button>

              <button
                type="button"
                onClick={() => setCustomType('stats')}
                className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all ${
                  customType === 'stats'
                    ? 'border-blue-600 bg-blue-50/60 text-blue-950 ring-1 ring-blue-600'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="font-black text-xs">통계 지표</div>
                <div className="text-[10px] text-slate-500 mt-0.5">만족도/성과 차트</div>
              </button>

              <button
                type="button"
                onClick={() => setCustomType('roadmap')}
                className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all ${
                  customType === 'roadmap'
                    ? 'border-blue-600 bg-blue-50/60 text-blue-950 ring-1 ring-blue-600'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="font-black text-xs">3단계 로드맵</div>
                <div className="text-[10px] text-slate-500 mt-0.5">단계별 추진 전략</div>
              </button>
            </div>
          </label>

          <label className="grid gap-1.5 text-xs font-bold text-slate-700">
            인포그래픽 메인 표제 (제목)
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="예: AI 교육 현장 안착을 위한 5대 점검 기준"
              required
              className="rounded-xl border border-slate-300 px-3.5 py-2 text-xs focus:border-blue-600 focus:outline-hidden"
            />
          </label>

          <label className="grid gap-1.5 text-xs font-bold text-slate-700">
            부제 / 설명 (선택)
            <input
              type="text"
              value={customSubtitle}
              onChange={(e) => setCustomSubtitle(e.target.value)}
              placeholder="예: 학습자 권익 보호와 실무 검증 중심의 종합 평가"
              className="rounded-xl border border-slate-300 px-3.5 py-2 text-xs focus:border-blue-600 focus:outline-hidden"
            />
          </label>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setActiveSubTab('recommendations')}
              className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isCustomGenerating || !customTitle.trim()}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-2 text-xs font-black shadow-xs transition-colors"
            >
              {isCustomGenerating ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>생성 중...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>인포그래픽 생성</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* 전체 화면 / 크게 보기 모달 */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="relative w-full max-w-4xl rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between text-white">
              <div>
                <span className="text-xs font-extrabold text-blue-400">
                  {getTypeBadge(previewItem.type).label}
                </span>
                <h3 className="text-base font-black text-white mt-0.5">
                  {previewItem.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="rounded-xl p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-black aspect-[16/9]">
              <img
                src={previewItem.imageUrl}
                alt={previewItem.title}
                className="h-full w-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-t border-slate-800 pt-3">
              <div className="text-slate-400 text-xs">
                <span className="text-slate-200 font-semibold">{previewItem.caption}</span>
                <span className="ml-2 text-slate-500">[{previewItem.sourceName}]</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleInsert(previewItem);
                    setPreviewItem(null);
                  }}
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-black text-white shadow-xs"
                >
                  기사 본문에 바로 삽입
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleSetThumbnail(previewItem);
                    setPreviewItem(null);
                  }}
                  className="rounded-xl border border-slate-700 hover:bg-slate-800 px-4 py-2 text-xs font-bold text-slate-200"
                >
                  대표 썸네일로 설정
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
