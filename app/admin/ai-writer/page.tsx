'use client';

import { useMemo, useState } from 'react';
import { buildBrandInterviewPrompt } from '@/lib/prompts/templates';
import { detectForbiddenTerms } from '@/lib/forbidden-terms';

export default function AiWriterPage() {
  const [form, setForm] = useState<Record<string, string>>({});
  const prompt = useMemo(() => buildBrandInterviewPrompt(form), [form]);
  const warnings = useMemo(() => detectForbiddenTerms(Object.values(form).join('\n')), [form]);
  const set = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <h1 className="text-3xl font-black text-brand-navy">AI 프롬프트 생성기</h1>
        <p className="mt-2 text-gray-600">초기 MVP는 API 호출 없이 클로드/ChatGPT에 붙여넣을 프롬프트를 생성합니다.</p>
        <div className="mt-6 space-y-3 rounded-2xl border bg-white p-5">
          {[
            ['businessName', '업체명'], ['ownerName', '대표자'], ['industry', '업종'], ['region', '지역'], ['services', '주요 서비스'], ['customers', '주요 고객층'], ['philosophy', '운영 철학'], ['strengths', '강점'], ['interviewAnswers', '인터뷰 답변'], ['photoNotes', '사진 설명'], ['tone', '원하는 톤']
          ].map(([key, label]) => <label key={key} className="block text-sm font-bold text-gray-700">{label}<textarea rows={key === 'interviewAnswers' ? 5 : 2} className="mt-1 w-full rounded-lg border px-3 py-2" onChange={(e) => set(key, e.target.value)} /></label>)}
        </div>
      </div>
      <div>
        <div className="rounded-2xl border bg-white p-5">
          <h2 className="font-black text-brand-navy">생성 프롬프트</h2>
          {warnings.length > 0 && <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">법적 리스크 표현 감지: {warnings.join(', ')}</div>}
          <textarea readOnly value={prompt} className="mt-4 h-[620px] w-full rounded-lg border bg-gray-50 p-3 text-sm leading-6" />
        </div>
      </div>
    </div>
  );
}
