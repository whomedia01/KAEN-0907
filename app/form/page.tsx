import Link from 'next/link';

export const metadata = { title: '기사제보' };

export default function FormPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <p className="text-sm font-black tracking-[0.22em] text-brand-gold">REPORT FORM</p>
      <h1 className="mt-2 text-4xl font-black text-brand-navy">기사제보</h1>
      <p className="mt-5 text-lg leading-9 text-gray-700">교육 현장, 평생교육, 자격증, 시니어 학습, 에듀테크, 교육기관 운영 관련 제보를 받습니다. 제보 내용은 사실 확인 후 기사화 여부를 검토합니다.</p>

      <section className="mt-10 rounded-2xl border bg-gray-50 p-6">
        <h2 className="text-xl font-black text-brand-navy">이메일 접수</h2>
        <p className="mt-4 leading-8 text-gray-700">현재 제보는 이메일로 접수합니다. 제목에 [기사제보]를 포함하고, 제보 내용·관련 자료·연락 가능한 정보를 함께 보내주세요.</p>
        <p className="mt-4 rounded bg-white p-4 font-black text-brand-navy">contact@edujournal.kr</p>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <Link href="/report" className="border bg-white p-5 font-black hover:border-brand-navy">기사제보 안내</Link>
        <Link href="/press" className="border bg-white p-5 font-black hover:border-brand-navy">보도자료 접수</Link>
        <Link href="/correction" className="border bg-white p-5 font-black hover:border-brand-navy">정정보도·반론보도</Link>
      </section>
    </main>
  );
}
