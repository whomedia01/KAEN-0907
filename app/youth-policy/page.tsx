export const metadata = { title: '청소년보호정책' };

const policies = [
  ['유해 정보 차단', '청소년에게 부적절한 선정적·폭력적·사행성 정보가 노출되지 않도록 기사 제목, 이미지, 본문 표현을 관리합니다.'],
  ['교육 정보 검수', '교육 과정, 기관 소개, 학습 서비스 보도 시 과장된 성과 표현이나 불안감을 조성하는 문구를 줄이고 사실 확인을 우선합니다.'],
  ['청소년 개인정보 보호', '청소년 또는 미성년자가 포함된 제보, 사진, 사례는 식별 가능성을 최소화하고 필요한 경우 보호자 또는 관계 기관의 확인을 거칩니다.'],
  ['이미지와 인용 관리', '청소년이 식별될 수 있는 사진, 이름, 학교, 연락처 등은 공개 범위를 제한하고 필요한 경우 비식별 처리합니다.'],
  ['신고 및 조치', '문제가 있는 콘텐츠가 확인되면 문의 페이지를 통해 신고할 수 있으며, 접수 내용은 확인 후 수정·비공개·삭제 등 필요한 조치를 진행합니다.'],
  ['광고와 외부 링크 관리', '교육 서비스, 이벤트, 외부 링크가 청소년에게 부적절한 정보로 이어지지 않도록 노출 전후로 확인합니다.']
] as const;

export default function YouthPolicyPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <p className="text-sm font-black tracking-[0.22em] text-brand-gold">YOUTH PROTECTION</p>
      <h1 className="mt-2 text-4xl font-black text-brand-navy">청소년보호정책</h1>
      <p className="mt-5 text-lg leading-9 text-gray-700">에듀저널은 교육 정보를 다루는 매체로서 청소년이 안전하게 콘텐츠를 이용할 수 있도록 다음 기준에 따라 사이트를 운영합니다.</p>

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        {policies.map(([title, body]) => (
          <div key={title} className="border bg-white p-5">
            <h2 className="text-lg font-black text-brand-navy">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-gray-700">{body}</p>
          </div>
        ))}
      </section>

      <section className="mt-10 border-t-2 border-brand-navy pt-7 leading-8 text-gray-700">
        <h2 className="text-xl font-black text-brand-navy">청소년보호책임자</h2>
        <dl className="mt-4 grid gap-3 text-sm md:grid-cols-[160px_1fr]">
          <dt className="font-black text-gray-900">성명</dt><dd>박예준</dd>
          <dt className="font-black text-gray-900">담당 업무</dt><dd>청소년 보호 정책 수립, 유해 콘텐츠 신고 확인, 콘텐츠 수정·차단 요청 처리</dd>
          <dt className="font-black text-gray-900">접수 창구</dt><dd>contact@edujournal.kr</dd>
        </dl>
      </section>
    </main>
  );
}
