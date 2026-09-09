'use client';

import { useState, useTransition } from 'react';
import { submitLead } from '@/app/apply/actions';

const inputClass = 'w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-blue-100';
const labelClass = 'text-sm font-bold text-gray-700';

export function LeadForm() {
  const [state, setState] = useState<{ ok?: boolean; message?: string }>({});
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          const result = await submitLead(formData);
          setState(result);
        });
      }}
      className="rounded-2xl border bg-white p-6 shadow-sm"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label><span className={labelClass}>업체명</span><input name="business_name" required className={inputClass} /></label>
        <label><span className={labelClass}>대표자명</span><input name="owner_name" className={inputClass} /></label>
        <label><span className={labelClass}>담당자명</span><input name="manager_name" className={inputClass} /></label>
        <label><span className={labelClass}>업종</span><input name="industry" className={inputClass} /></label>
        <label><span className={labelClass}>지역</span><input name="region" className={inputClass} /></label>
        <label><span className={labelClass}>전화번호</span><input name="phone" required className={inputClass} /></label>
        <label><span className={labelClass}>이메일</span><input name="email" type="email" className={inputClass} /></label>
        <label><span className={labelClass}>희망 상품</span><select name="desired_product" className={inputClass}><option>브랜드 인터뷰</option><option>우수 브랜드 기획전</option><option>프리미엄 광고 패키지</option><option>월 광고주 패키지</option></select></label>
        <label><span className={labelClass}>홈페이지 URL</span><input name="website_url" className={inputClass} /></label>
        <label><span className={labelClass}>네이버 플레이스 URL</span><input name="naver_place_url" className={inputClass} /></label>
      </div>
      <label className="mt-4 block"><span className={labelClass}>문의 내용</span><textarea name="message" rows={5} className={inputClass} /></label>

      <div className="mt-6 rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
        <p className="font-black text-brand-navy">필수 동의</p>
        {[
          ['privacy_agreed', '개인정보 수집 및 이용 동의'],
          ['terms_agreed', '서비스 이용약관 동의'],
          ['refund_policy_agreed', '환불정책 동의'],
          ['sponsored_policy_agreed', '제휴 콘텐츠 제작 및 표시 정책 동의'],
          ['copyright_agreed', '제출 자료의 저작권·초상권 책임 확인'],
          ['ad_content_acknowledged', '광고/제휴 콘텐츠의 성격 확인']
        ].map(([name, label]) => (
          <label key={name} className="mt-2 flex gap-2"><input type="checkbox" name={name} required /> <span>{label}</span></label>
        ))}
      </div>

      <div className="mt-4 rounded-xl bg-blue-50 p-4 text-sm text-gray-700">
        <p className="font-black text-brand-navy">선택 동의</p>
        {[
          ['marketing_agreed', '마케팅 정보 수신 동의'],
          ['email_marketing_agreed', '이메일 수신 동의'],
          ['sms_marketing_agreed', '문자 수신 동의'],
          ['phone_contact_agreed', '전화 상담 동의']
        ].map(([name, label]) => (
          <label key={name} className="mt-2 flex gap-2"><input type="checkbox" name={name} /> <span>{label}</span></label>
        ))}
      </div>

      {state.message && <p className={`mt-4 rounded-lg p-3 text-sm ${state.ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{state.message}</p>}
      <button disabled={isPending} className="mt-6 w-full rounded-xl bg-brand-navy px-5 py-3 font-black text-white disabled:opacity-50">
        {isPending ? '접수 중...' : '신청하기'}
      </button>
    </form>
  );
}
