export const metadata = { title: '기사제보' };

const fields = [
  ['평생교육·직업능력개발', '기관 운영, 교육 과정, 지역 평생학습 소식, 성인학습 사례'],
  ['자격증·자기계발', '시험 제도, 교육 과정, 수강생 사례, 기관 안내'],
  ['시니어·실버교육', '디지털 문해교육, 건강·문화 프로그램, 고령층 학습 지원'],
  ['에듀테크·AI', '학습 플랫폼, AI 교육도구, 학교·기관 도입 사례'],
  ['교육기관 탐방', '학원, 평생교육원, 직업훈련기관, 지역 교육시설'],
  ['오류·정정 요청', '기사 내용의 사실관계 오류, 수정 요청, 반론 의견']
] as const;

const checklist = [
  '제보자의 이름 또는 기관명',
  '연락 가능한 이메일 또는 전화번호',
  '제보 내용의 발생 시점과 장소',
  '확인 가능한 자료, 사진, 문서 또는 공식 링크',
  '익명 처리 필요 여부',
  '이해관계 또는 보도자료성 자료 여부'
];

export default function ReportPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <p className="text-sm font-black tracking-[0.22em] text-brand-gold">REPORT</p>
      <h1 className="mt-2 text-4xl font-black text-brand-navy">기사제보</h1>
      <p className="mt-5 text-lg leading-9 text-gray-700">에듀저널은 교육 현장의 변화, 제도 개선, 학습자 사례, 교육기관 운영 소식, 기사 오류와 정정 요청을 접수합니다.</p>

      <section className="mt-8 rounded border border-brand-navy bg-white p-6 text-sm leading-7 text-gray-700">
        <h2 className="text-xl font-black text-brand-navy">제보 접수 이메일</h2>
        <p className="mt-3">contact@edujournal.kr</p>
        <p className="mt-2">메일 제목에 [기사제보]를 표시하고, 기사화 가능 여부를 확인할 수 있는 자료를 함께 보내 주세요.</p>
      </section>

      <section className="mt-10 border-t-2 border-brand-navy pt-7">
        <h2 className="text-2xl font-black text-brand-navy">제보 가능한 분야</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {fields.map(([title, body]) => (
            <div key={title} className="border bg-white p-5">
              <h3 className="font-black text-gray-900">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-gray-700">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 border bg-gray-50 p-6">
        <h2 className="text-xl font-black text-brand-navy">제보 시 포함할 내용</h2>
        <ul className="mt-4 space-y-2 text-sm leading-7 text-gray-700">
          {checklist.map((item) => <li key={item}>• {item}</li>)}
        </ul>
      </section>

      <section className="mt-10 leading-8 text-gray-700">
        <h2 className="text-xl font-black text-brand-navy">처리 기준</h2>
        <p className="mt-3">접수된 제보는 공익성, 사실 확인 가능성, 교육 분야 관련성, 이해관계자 반론 가능성을 기준으로 검토합니다. 제보 내용이 기사화되지 않더라도 관련 사실 확인을 위해 추가 자료를 요청할 수 있습니다.</p>
      </section>
    </main>
  );
}
