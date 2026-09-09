export const metadata = { title: '보도자료 접수' };

const required = [
  '기관명 또는 단체명',
  '담당자 이름과 회신 가능한 연락처',
  '자료 제목과 배포 희망일',
  '본문 원고 또는 공식 안내문',
  '사진·이미지 사용 가능 여부와 출처',
  '관련 링크, 신청 페이지, 참고 자료'
];

const review = [
  ['교육 분야 관련성', '평생교육, 자격증, 시니어 학습, 에듀테크, 교육기관 운영 등 에듀저널 보도 분야와 관련성이 있어야 합니다.'],
  ['사실 확인 가능성', '일정, 장소, 주최 기관, 참여 대상, 비용, 신청 방법 등 핵심 정보가 확인 가능해야 합니다.'],
  ['독자 유용성', '단순 홍보 문구보다 독자가 실제로 확인할 수 있는 조건, 절차, 변화, 활용 정보를 우선 검토합니다.'],
  ['편집권 기준', '접수된 자료는 편집 판단에 따라 제목, 표현, 구성, 게재 여부가 조정될 수 있습니다.']
] as const;

export default function PressPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <p className="text-sm font-black tracking-[0.22em] text-brand-gold">PRESS RELEASE</p>
      <h1 className="mt-2 text-4xl font-black text-brand-navy">보도자료 접수</h1>
      <p className="mt-5 text-lg leading-9 text-gray-700">에듀저널은 교육기관, 평생교육 과정, 자격증, 에듀테크, 시니어 학습 관련 보도자료를 접수합니다.</p>

      <section className="mt-8 rounded border border-brand-navy bg-white p-6 text-sm leading-7 text-gray-700">
        <h2 className="text-xl font-black text-brand-navy">접수 이메일</h2>
        <p className="mt-3 font-bold text-gray-900">contact@edujournal.kr</p>
        <p className="mt-2">메일 제목에 [보도자료]를 표시하고, 원문 자료와 이미지 사용 가능 여부를 함께 보내 주세요.</p>
      </section>

      <section className="mt-10 border-t-2 border-brand-navy pt-7">
        <h2 className="text-2xl font-black text-brand-navy">제출 자료</h2>
        <ul className="mt-5 grid gap-3 text-sm leading-7 text-gray-700 sm:grid-cols-2">
          {required.map((item) => <li key={item} className="border bg-white p-4">• {item}</li>)}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-black text-brand-navy">검토 기준</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {review.map(([title, body]) => (
            <div key={title} className="border bg-white p-5">
              <h3 className="font-black text-gray-900">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-gray-700">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 border bg-gray-50 p-6 leading-8 text-gray-700">
        <h2 className="text-xl font-black text-brand-navy">접수 안내</h2>
        <p className="mt-3">보도자료는 편집 기준에 따라 검토되며, 모든 자료가 기사화되는 것은 아닙니다. 사실 확인이나 이미지 사용 권한 확인이 필요한 경우 추가 자료를 요청할 수 있습니다.</p>
      </section>
    </main>
  );
}
