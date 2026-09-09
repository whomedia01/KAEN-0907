import Link from 'next/link';
import { requireAdminUser } from '@/lib/admin/auth';
import { listTable, listCategories, getLatestSiteSettings } from '@/lib/data/admin';

const controls = [
  ['기사 작성·발행', '새 기사 작성, 검수, 예약, 공개 전환을 처리합니다.', '/admin/articles'],
  ['홈 편성', '메인 톱기사, 섹션별 기사, 랭킹/스포트라이트 노출을 제어합니다.', '/admin/home'],
  ['카테고리 관리', '메뉴명, slug, 정렬값, 카테고리 설명을 관리합니다.', '/admin/categories'],
  ['사이트 설정', '제호, 운영사, 대표자, 등록번호, 푸터 정보를 관리합니다.', '/admin/settings'],
  ['미디어 관리', '대표 이미지, 출처, 라이선스, 캡션을 관리합니다.', '/admin/media'],
  ['제보·보도자료', '독자 제보, 보도자료, 정정보도 신청 접수를 관리합니다.', '/admin/submissions'],
  ['정책 페이지', '개인정보처리방침, 청소년보호정책, 약관을 관리합니다.', '/admin/policies'],
  ['운영 구조', '관리자가 공개 사이트를 어디까지 제어하는지 확인합니다.', '/admin/system']
];

export default async function AdminDashboardPage() {
  const user = await requireAdminUser();
  const [articles, categories, settings] = await Promise.all([listTable('articles', 200), listCategories(), getLatestSiteSettings()]);
  const published = articles.filter((item: any) => item.status === 'published').length;
  const drafts = articles.filter((item: any) => item.status !== 'published').length;

  return (
    <main className="min-h-screen bg-[#f5f5f2] text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-12">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-slate-500">EDU JOURNAL CMS</p>
          <div className="mt-4 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl font-black tracking-tight md:text-6xl">에듀저널 관리자</h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
                이 관리자 화면은 Supabase DB를 직접 제어합니다. 여기서 발행한 기사는 공개 홈, 카테고리, 기사 상세에 우선 반영됩니다.
              </p>
            </div>
            <div className="rounded-2xl bg-slate-950 p-5 text-sm leading-7 text-white">
              <p className="font-black">로그인 계정</p>
              <p className="text-slate-300">{user.email}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl bg-slate-50 p-5"><p className="text-xs font-black text-slate-500">전체 기사</p><p className="mt-2 text-3xl font-black">{articles.length}</p></div>
            <div className="rounded-2xl bg-slate-50 p-5"><p className="text-xs font-black text-slate-500">공개 기사</p><p className="mt-2 text-3xl font-black">{published}</p></div>
            <div className="rounded-2xl bg-slate-50 p-5"><p className="text-xs font-black text-slate-500">검수/초안</p><p className="mt-2 text-3xl font-black">{drafts}</p></div>
            <div className="rounded-2xl bg-slate-50 p-5"><p className="text-xs font-black text-slate-500">카테고리</p><p className="mt-2 text-3xl font-black">{categories.length}</p></div>
          </div>

          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-900">
            <b>신청 전 점검:</b> 사이트 설정은 {settings ? 'DB에서 관리 중' : '아직 기본값 사용 중'}입니다. 기사·카테고리·정책 페이지를 관리자 DB 기준으로 채우면 인터넷신문 등록 신청용 운영 구조가 됩니다.
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-5 py-10 md:grid-cols-4">
        {controls.map(([title, desc, href]) => (
          <Link key={title} href={href} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:border-slate-400">
            <h2 className="text-lg font-black">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">{desc}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
