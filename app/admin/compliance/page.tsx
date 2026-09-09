import { FORBIDDEN_TERMS } from '@/lib/forbidden-terms';

export default function CompliancePage() {
  return <div><h1 className="text-3xl font-black text-brand-navy">컴플라이언스</h1><div className="mt-6 rounded-2xl border bg-white p-6"><h2 className="font-black text-brand-navy">금지/주의 표현</h2><div className="mt-4 flex flex-wrap gap-2">{FORBIDDEN_TERMS.map((term) => <span key={term} className="rounded-full bg-red-50 px-3 py-1 text-sm text-red-700">{term}</span>)}</div></div><div className="mt-6 rounded-2xl border bg-white p-6"><h2 className="font-black text-brand-navy">발행 전 체크리스트</h2><ul className="mt-4 space-y-2 text-gray-700"><li>□ 제휴 콘텐츠 여부 확인</li><li>□ 광고/제휴 고지문 표시 확인</li><li>□ 과장 표현 없음</li><li>□ 광고주 제공 자료 출처 확인</li><li>□ 사진/로고 사용권 확인</li><li>□ 개인정보 노출 없음</li><li>□ 민감 업종 표현 확인</li></ul></div></div>;
}
