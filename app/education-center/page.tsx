export const metadata = { title: '교육센터 | 에듀저널' };

export default function EducationCenterPage() {
  return (
    <main className="bg-gray-50 py-12">
      <section className="mx-auto max-w-5xl bg-white px-6 py-10 shadow-sm md:px-10">
        <p className="text-sm font-black text-amber-600">EDU JOURNAL CENTER</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950">에듀저널 교육센터</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-gray-600">
          에듀저널 교육센터는 평생교육, 자격증, 시니어 학습, 에듀테크 분야의 정보를 정리하고 교육 콘텐츠 확장을 준비하는 안내 공간이다.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="border p-5"><h2 className="font-black">평생교육 정보</h2><p className="mt-3 text-sm leading-7 text-gray-600">성인학습과 직무교육 흐름을 정리한다.</p></div>
          <div className="border p-5"><h2 className="font-black">자격증·자기계발</h2><p className="mt-3 text-sm leading-7 text-gray-600">자격증과 역량개발 정보를 제공한다.</p></div>
          <div className="border p-5"><h2 className="font-black">교육기관 탐방</h2><p className="mt-3 text-sm leading-7 text-gray-600">교육 현장과 운영 사례를 기록한다.</p></div>
        </div>
      </section>
    </main>
  );
}
