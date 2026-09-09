import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/auth/admin';

const adminNavGroups = [
  {
    title: '운영 현황',
    items: [
      ['대시보드', '/admin'],
      ['운영시스템', '/admin/system'],
      ['접속·콘텐츠 통계', '/admin/statistics']
    ]
  },
  {
    title: '편집국',
    items: [
      ['기사 관리', '/admin/articles'],
      ['기사 작성', '/admin/articles/new'],
      ['카테고리', '/admin/categories'],
      ['미디어 보관함', '/admin/media'],
      ['보도자료', '/admin/press'],
      ['기자·계정', '/admin/journalists']
    ]
  },
  {
    title: '비즈니스',
    items: [
      ['제보·문의', '/admin/leads'],
      ['고객 CRM', '/admin/clients'],
      ['영업 관리', '/admin/outreach'],
      ['상품', '/admin/products'],
      ['주문', '/admin/orders'],
      ['납품', '/admin/deliveries']
    ]
  },
  {
    title: '자동화·설정',
    items: [
      ['AI 작성도구', '/admin/ai-writer'],
      ['뉴스레터', '/admin/newsletter'],
      ['템플릿', '/admin/templates'],
      ['컴플라이언스', '/admin/compliance'],
      ['애드센스 준비', '/admin/adsense'],
      ['사이트 설정', '/admin/settings']
    ]
  }
];

export async function AdminShell({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/admin/login');

  return (
    <div className="min-h-screen bg-slate-100">
      <aside className="fixed inset-y-0 left-0 hidden w-72 overflow-y-auto border-r bg-white p-5 md:block">
        <Link href="/admin" className="block text-xl font-black text-brand-navy">MediaOffice</Link>
        <p className="mt-1 text-xs leading-5 text-gray-500">생활경제저널 인터넷매체 운영 관리자</p>
        <nav className="mt-7 space-y-6">
          {adminNavGroups.map((group) => (
            <section key={group.title}>
              <div className="px-3 text-[11px] font-black uppercase tracking-[0.18em] text-gray-400">{group.title}</div>
              <div className="mt-2 space-y-1">
                {group.items.map(([label, href]) => (
                  <Link key={href} href={href} className="block rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-slate-100 hover:text-brand-blue">
                    {label}
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </nav>
      </aside>
      <div className="md:pl-72">
        <header className="border-b bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-black text-brand-navy">관리자</span>
              <p className="text-xs text-gray-500">기사 발행, 제보, 광고·제휴, 등록정보를 한 곳에서 관리합니다.</p>
            </div>
            <span className="text-sm text-gray-500">{admin.email}</span>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
