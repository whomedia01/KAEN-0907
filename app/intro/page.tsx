import Link from 'next/link';

export const metadata = { title: '안내' };

const menuItems = [
  ['회사소개', '/about', '에듀저널의 운영 방향, 보도 분야, 발행 정보를 확인합니다.'],
  ['회원약관', '/terms', '서비스 이용 기준과 콘텐츠 이용 조건을 확인합니다.'],
  ['개인정보보호방침', '/privacy', '제보·문의 과정에서 처리되는 개인정보 기준을 확인합니다.'],
  ['청소년보호정책', '/youth-policy', '청소년 유해정보 차단과 보호 기준을 확인합니다.'],
  ['인터넷신문윤리강령', '/ethics', '에듀저널의 취재·편집 윤리 기준을 확인합니다.'],
  ['기사제보', '/form', '기사제보, 보도자료, 정정보도 신청 창구로 이동합니다.']
] as const;

export default function IntroPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <p className="text-sm font-black tracking-[0.22em] text-brand-gold">EDU JOURNAL INFO</p>
      <h1 className="mt-2 text-4xl font-black text-brand-navy">에듀저널 안내</h1>
      <p className="mt-5 text-lg leading-9 text-gray-700">회사소개, 약관, 개인정보보호방침, 청소년보호정책, 윤리강령, 제보 창구를 한곳에서 확인할 수 있습니다.</p>
      <section className="mt-10 grid gap-5 md:grid-cols-2">
        {menuItems.map(([title, href, desc]) => (
          <Link key={href} href={href} className="rounded-2xl border bg-white p-6 hover:border-brand-navy">
            <h2 className="text-xl font-black text-brand-navy">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-gray-700">{desc}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
