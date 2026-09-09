import { LeadForm } from '@/components/forms/lead-form';

export const metadata = { title: '브랜드 인터뷰 신청' };

export default function ApplyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-4xl font-black text-brand-navy">브랜드 인터뷰 신청</h1>
      <p className="mt-4 text-gray-600">신청 내용을 확인한 뒤 광고·제휴 담당자가 연락드립니다. 제휴 콘텐츠는 독자가 식별할 수 있도록 명확히 표시됩니다.</p>
      <div className="mt-8"><LeadForm /></div>
    </div>
  );
}
