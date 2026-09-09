export const metadata = { title: '정정보도·반론보도 신청' };

const required = [
  '신청인 이름 또는 기관명',
  '회신 가능한 이메일 또는 연락처',
  '대상 기사 제목과 URL',
  '정정 또는 반론을 요청하는 구체적 문장',
  '사실 확인을 위한 근거 자료 또는 공식 문서',
  '요청 취지와 원하는 조치 사항'
];

const process = [
  ['접수', '대상 기사, 신청인 정보, 요청 사유, 근거 자료가 포함된 신청을 접수합니다.'],
  ['확인', '편집 담당자가 기사 원문, 취재 자료, 제출 근거, 관계자 의견을 확인합니다.'],
  ['검토', '명백한 오류, 설명 보완 필요성, 반론권 보장 필요성을 기준으로 조치 여부를 판단합니다.'],
  ['조치', '정정, 보완, 반론 게재, 추후보도 또는 사유 안내를 진행합니다.']
] as const;

export default function CorrectionPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <p className="text-sm font-black tracking-[0.22em] text-brand-gold">CORRECTION REQUEST</p>
      <h1 className="mt-2 text-4xl font-black text-brand-navy">정정보도·반론보도 신청</h1>
      <p className="mt-5 text-lg leading-9 text-gray-700">
        에듀저널은 기사 내용의 사실관계 오류, 설명 보완 요청, 반론권 보장 요청을 접수합니다. 신청 내용은 편집 기준과 관련 법령 취지에 따라 확인 후 처리합니다.
      </p>

      <section className="mt-10 border-t-2 border-brand-navy pt-7">
        <h2 className="text-2xl font-black text-brand-navy">신청 시 포함할 내용</h2>
        <ul className="mt-5 grid gap-3 text-sm leading-7 text-gray-700 sm:grid-cols-2">
          {required.map((item) => <li key={item} className="border bg-white p-4">• {item}</li>)}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-black text-brand-navy">처리 절차</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {process.map(([title, body]) => (
            <div key={title} className="border bg-white p-5">
              <h3 className="font-black text-gray-900">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-gray-700">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 border bg-gray-50 p-6 text-sm leading-7 text-gray-700">
        <h2 className="text-xl font-black text-brand-navy">접수 창구</h2>
        <p className="mt-3">정정·반론 신청은 contact@edujournal.kr 로 접수합니다. 메일 제목에 [정정요청] 또는 [반론요청]을 표시하면 확인이 빠릅니다.</p>
      </section>
    </main>
  );
}
