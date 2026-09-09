export const metadata = { title: '이용약관' };

const sections = [
  ['이용 목적', '에듀저널은 독자가 교육 관련 기사와 정보를 확인할 수 있도록 운영되는 교육 전문 매체입니다. 사이트 이용자는 기사 열람, 검색, 제보, 문의 기능을 이용할 수 있습니다.'],
  ['기사와 자료 이용', '기사와 사진, 편집 자료는 정보 확인을 위한 목적으로 제공됩니다. 외부에서 활용하려는 경우 출처와 원문 링크를 함께 표시하는 것을 원칙으로 합니다.'],
  ['정보 확인 안내', '교육 과정, 비용, 일정, 자격 기준, 제도 정보는 기관 사정에 따라 달라질 수 있습니다. 실제 신청 전에는 해당 기관 또는 공식 안내처에서 최신 내용을 다시 확인해 주세요.'],
  ['제보 이용', '제보자는 사실 확인이 가능한 자료와 연락 가능한 정보를 함께 제공해야 합니다. 접수된 내용은 편집 기준에 따라 검토되며, 필요할 경우 추가 확인을 요청할 수 있습니다.'],
  ['정정 요청', '기사 내용에 오류가 있거나 설명이 필요한 부분이 있으면 문의 또는 기사제보 페이지를 통해 알려 주세요. 확인 후 필요한 경우 수정 내용을 반영합니다.'],
  ['서비스 운영', '사이트 구성과 제공 기능은 안정적인 운영과 개선을 위해 변경될 수 있습니다. 중요한 변경 사항은 사이트 내 공지 또는 관련 페이지를 통해 안내합니다.']
] as const;

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <p className="text-sm font-black tracking-[0.22em] text-brand-gold">TERMS</p>
      <h1 className="mt-2 text-4xl font-black text-brand-navy">이용약관</h1>
      <p className="mt-5 text-lg leading-9 text-gray-700">에듀저널 웹사이트 이용과 기사 열람, 제보, 문의 접수에 관한 기본 안내입니다.</p>
      <div className="mt-10 space-y-7 border-t-2 border-brand-navy pt-7">
        {sections.map(([title, body]) => (
          <section key={title}>
            <h2 className="text-xl font-black text-brand-navy">{title}</h2>
            <p className="mt-3 leading-8 text-gray-700">{body}</p>
          </section>
        ))}
      </div>
      <p className="mt-10 border bg-gray-50 p-5 text-sm leading-7 text-gray-600">시행일: 2026년 6월 23일</p>
    </main>
  );
}
