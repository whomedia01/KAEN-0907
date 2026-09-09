import { getArticleWritingTemplate } from '@/lib/editorial/article-style';

export function ArticleWritingGuide() {
  return (
    <section className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div>
        <h2 className="text-lg font-black text-gray-950">생활경제저널 기사 톤/분량 기준</h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          첫 문단에서 핵심을 바로 제시하고, 중간부에서 배경·쟁점·현장 반응을 충분히 전개한 뒤, 마지막 문단에서 전망과 과제로 닫습니다. 본문에는 작성용 표지를 넣지 않습니다.
        </p>
      </div>
      <div className="grid gap-3 text-sm leading-6 text-gray-700 md:grid-cols-2">
        <div className="rounded-lg border bg-white p-3">
          <p className="font-black text-brand-navy">문체 원칙</p>
          <p className="mt-1">객관적 보도체, 8문단 이상, 1,500자 이상, 단문 나열 금지, 과장·홍보 표현 금지</p>
        </div>
        <div className="rounded-lg border bg-white p-3">
          <p className="font-black text-brand-navy">문맥 흐름</p>
          <p className="mt-1">도입 → 배경 → 쟁점 → 현장 의미 → 독자 영향 → 반론/제약 → 전망 → 마무리</p>
        </div>
      </div>
      <textarea readOnly rows={13} value={getArticleWritingTemplate()} className="w-full rounded-lg border bg-white px-3 py-2 font-mono text-xs leading-5 text-gray-700" />
      <p className="text-xs leading-5 text-gray-500">위 기준을 참고해 완성형 기사 문단으로 작성하세요. 공개 기사에는 자연스러운 보도문만 남기는 것을 원칙으로 합니다.</p>
    </section>
  );
}
