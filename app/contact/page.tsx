export const metadata = { title: '문의' };

const contacts = [
  ['일반 문의', '사이트 이용, 기사 열람, 오류 신고, 제휴 문의 등 일반 문의를 접수합니다.'],
  ['기사 관련 문의', '기사 제목, URL, 확인이 필요한 문장, 요청 사유를 함께 남겨주시면 검토가 빠릅니다.'],
  ['교육기관 문의', '기관명, 담당자, 연락처, 관련 과정명, 공개 가능한 자료를 함께 보내 주세요.'],
  ['정정·반론 요청', '사실관계 확인이 필요한 경우 근거 자료와 연락 가능한 정보를 함께 남겨 주세요.']
] as const;

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <p className="text-sm font-black tracking-[0.22em] text-brand-gold">CONTACT</p>
      <h1 className="mt-2 text-4xl font-black text-brand-navy">문의</h1>
      <p className="mt-5 text-lg leading-9 text-gray-700">에듀저널은 독자 의견, 기사 오류, 교육기관 소식, 사이트 이용 관련 문의를 접수합니다.</p>
      <section className="mt-10 grid gap-4 sm:grid-cols-2">
        {contacts.map(([title, body]) => (
          <div key={title} className="border bg-white p-5">
            <h2 className="text-lg font-black text-brand-navy">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-gray-700">{body}</p>
          </div>
        ))}
      </section>
      <section className="mt-10 border-t-2 border-brand-navy pt-6 leading-8 text-gray-700">
        <h2 className="text-xl font-black text-brand-navy">접수 시 포함하면 좋은 정보</h2>
        <ul className="mt-4 space-y-2 text-sm">
          <li>• 이름 또는 기관명</li>
          <li>• 회신 가능한 이메일 또는 연락처</li>
          <li>• 문의 대상 기사 URL 또는 관련 자료</li>
          <li>• 확인이 필요한 내용과 요청 사항</li>
        </ul>
      </section>
    </main>
  );
}
