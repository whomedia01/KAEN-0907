import Link from 'next/link';
import { requireAdminUser } from '@/lib/admin/auth';
import { listTable } from '@/lib/data/admin';

export default async function AdminArticlesPage() {
  await requireAdminUser();
  const rows = await listTable('articles', 200);

  return (
    <main className="mx-auto max-w-6xl rounded-3xl border bg-white p-8 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">ARTICLE CMS</p>
          <h1 className="mt-2 text-3xl font-black text-brand-navy">기사 관리</h1>
          <p className="mt-2 text-sm leading-7 text-slate-600">published 기사는 공개 사이트에 노출되고, draft/review/scheduled 기사는 관리자에서만 관리됩니다.</p>
        </div>
        <Link href="/admin/articles/new" className="rounded-full bg-brand-navy px-5 py-3 text-sm font-black text-white">새 기사</Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-[0.2em] text-slate-500">
            <tr><th className="p-4">상태</th><th className="p-4">제목</th><th className="p-4">기자</th><th className="p-4">발행일</th><th className="p-4">공개 URL</th></tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-slate-500">아직 DB에 저장된 기사가 없습니다. 새 기사를 작성하면 이곳에 표시됩니다.</td></tr>
            ) : rows.map((article: any) => (
              <tr key={article.id} className="border-t">
                <td className="p-4"><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black">{article.status}</span></td>
                <td className="p-4 font-bold text-slate-900">{article.title}</td>
                <td className="p-4 text-slate-600">{article.author_name ?? '에듀저널 편집부'}</td>
                <td className="p-4 text-slate-600">{article.published_at ? new Date(article.published_at).toLocaleDateString('ko-KR') : '-'}</td>
                <td className="p-4">{article.status === 'published' ? <Link href={`/articles/${article.slug}`} className="font-black text-brand-navy">보기</Link> : <span className="text-slate-400">비공개</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
