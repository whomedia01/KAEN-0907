export const metadata = { title: '제휴·광고문의' };

export default function PartnershipPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <p className="text-sm font-black tracking-[0.22em] text-brand-gold">PARTNERSHIP</p>
      <h1 className="mt-2 text-4xl font-black text-brand-navy">제휴·광고문의</h1>
      <p className="mt-5 text-lg leading-9 text-gray-700">한국AI교육신문은 교육기관, 평생교육·자격증·에듀테크 분야 기관의 보도자료, 제휴 제안, 광고 문의를 접수합니다. 광고성 콘텐츠는 독자가 구분할 수 있도록 표시하며 편집 기준에 따라 검토합니다.</p>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="border bg-white p-6">
          <h2 className="text-xl font-black text-brand-navy">접수 항목</h2>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-gray-700">
            <li>• 교육기관·기업 제휴 제안</li>
            <li>• 배너 광고·브랜드 콘텐츠 문의</li>
            <li>• 행사·세미나·설명회 홍보 문의</li>
            <li>• 교육 서비스 소개 자료 접수</li>
          </ul>
        </div>
        <div className="border bg-white p-6">
          <h2 className="text-xl font-black text-brand-navy">접수 방법</h2>
          <p className="mt-4 text-sm leading-7 text-gray-700">제안서, 담당자 연락처, 희망 일정, 참고 URL을 포함해 아래 공식 창구로 문의해 주세요.</p>
          <div className="mt-4 rounded bg-gray-50 p-4 space-y-1 text-sm leading-6">
            <p><span className="font-bold text-gray-900">공식 이메일:</span> <span className="font-black text-brand-navy">whomedia03@gmail.com</span></p>
            <p><span className="font-bold text-gray-900">대표전화:</span> 02-6443-4222</p>
            <p><span className="font-bold text-gray-900">팩스번호:</span> 02-6443-4223</p>
          </div>
        </div>
      </section>
    </main>
  );
}
