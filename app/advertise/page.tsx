import Link from 'next/link';

export const metadata = { title: '제휴 문의' };

export default function PartnershipPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <p className="text-sm font-black text-brand-gold">PARTNERSHIP</p>
      <h1 className="mt-2 text-4xl font-black text-brand-navy">제휴 문의</h1>
      <p className="mt-4 text-lg leading-8 text-gray-700">
        에듀저널은 교육기관, 학습 서비스, 자격증 과정, 에듀테크 분야의 공익성 있는 정보와 협력 제안을 검토합니다.
      </p>
      <section className="mt-10 border bg-white p-6">
        <h2 className="text-xl font-black text-brand-navy">제휴 검토 기준</h2>
        <ul className="mt-4 space-y-2 text-sm leading-7 text-gray-700">
          <li>• 독자에게 실질적인 교육 정보가 되는 내용</li>
          <li>• 출처와 담당자를 확인할 수 있는 자료</li>
          <li>• 과장되거나 오해를 줄 수 있는 표현이 없는 자료</li>
        </ul>
      </section>
      <section className="mt-8 border bg-gray-50 p-6">
        <h2 className="text-xl font-black text-brand-navy">문의 방법</h2>
        <p className="mt-3 text-sm leading-7 text-gray-700">기관명, 제안 내용, 담당자 연락처, 참고자료를 정리해 문의해 주세요.</p>
        <Link href="/contact" className="mt-5 inline-flex rounded-full bg-brand-navy px-5 py-3 text-sm font-black text-white">문의 페이지로 이동</Link>
      </section>
    </main>
  );
}
