export const metadata = { title: '회사소개' };

const principles = [
  '교육 현장의 변화와 제도 정보를 독자가 이해하기 쉬운 언어로 전달합니다.',
  '확인 가능한 사실과 공식 안내를 우선하고, 추측성 표현과 과장된 문구를 줄입니다.',
  '오류가 확인된 기사에는 정정·수정 이력을 남기고 독자의 제보를 검토합니다.',
  '청소년과 학습자의 권익을 해칠 수 있는 선정적·자극적 표현을 배제합니다.',
  '광고성 자료와 보도자료는 편집 기준에 따라 구분해 검토합니다.'
];

const coverage = [
  '평생교육·직업능력개발',
  '자격증·자기계발·성인학습',
  '시니어·디지털 문해교육',
  '에듀테크·AI 학습도구',
  '교육기관 운영과 지역 교육 소식',
  '교육 전문가 인터뷰와 오피니언',
  '교육 관련 보도자료와 정책 안내'
];

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <p className="text-sm font-black tracking-[0.22em] text-brand-gold">ABOUT EDU JOURNAL</p>
      <h1 className="mt-2 text-4xl font-black text-brand-navy">회사소개</h1>
      <p className="mt-5 text-lg leading-9 text-gray-700">
        에듀저널은 평생교육, 자격증, 시니어 학습, 에듀테크, 교육기관 소식을 다루는 교육 전문 인터넷 매체입니다. 학습자와 교육기관이 실제 의사결정에 참고할 수 있도록 교육 과정의 흐름, 제도 변화, 현장 사례, 확인해야 할 기준을 기사로 정리합니다.
      </p>

      <section className="mt-10 border-t-2 border-brand-navy pt-7">
        <h2 className="text-2xl font-black text-brand-navy">매체 운영 방향</h2>
        <div className="mt-5 space-y-4 leading-8 text-gray-700">
          <p>
            에듀저널은 단순 홍보성 정보보다 독자가 실제로 확인해야 할 조건, 절차, 비용, 일정, 주의사항을 중심으로 보도합니다. 교육기관 탐방, 관계자 인터뷰, 제도 변화 분석, 성인학습 사례 등을 통해 교육 정보의 접근성을 높이는 것을 목표로 합니다.
          </p>
          <p>
            기사 작성 과정에서는 공개 자료, 기관 안내, 현장 확인, 독자 제보를 종합해 사실관계를 검토합니다. 보도 이후에도 오류 제보와 정정 요청을 접수하며, 필요한 경우 기사 수정과 반론권 보장을 진행합니다.
          </p>
        </div>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="border bg-white p-6">
          <h2 className="text-xl font-black text-brand-navy">편집 원칙</h2>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-gray-700">
            {principles.map((item) => <li key={item}>• {item}</li>)}
          </ul>
        </div>
        <div className="border bg-white p-6">
          <h2 className="text-xl font-black text-brand-navy">주요 보도 분야</h2>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-gray-700">
            {coverage.map((item) => <li key={item}>• {item}</li>)}
          </ul>
        </div>
      </section>

      <section className="mt-10 border bg-gray-50 p-6">
        <h2 className="text-xl font-black text-brand-navy">운영 정보</h2>
        <dl className="mt-4 grid gap-3 text-sm leading-7 text-gray-700 md:grid-cols-[150px_1fr]">
          <dt className="font-black text-gray-900">제호</dt><dd>에듀저널</dd>
          <dt className="font-black text-gray-900">발행·운영</dt><dd>알고파트너스</dd>
          <dt className="font-black text-gray-900">대표자</dt><dd>박예준</dd>
          <dt className="font-black text-gray-900">발행인·편집인</dt><dd>박예준</dd>
          <dt className="font-black text-gray-900">사업자등록번호</dt><dd>450-07-03104</dd>
          <dt className="font-black text-gray-900">통신판매업신고번호</dt><dd>제2025-인천서구-3321호</dd>
          <dt className="font-black text-gray-900">인터넷신문 등록번호</dt><dd>등록 신청 예정</dd>
          <dt className="font-black text-gray-900">소재지</dt><dd>인천광역시 서구 청라커낼로 270, 커낼힐스빌 2층 2498호</dd>
          <dt className="font-black text-gray-900">문의</dt><dd>contact@edujournal.kr</dd>
        </dl>
      </section>
    </main>
  );
}
