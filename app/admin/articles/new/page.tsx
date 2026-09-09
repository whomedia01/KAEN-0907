import Link from 'next/link';
import { createArticle } from './actions';
import { getCategories } from '@/lib/data/public';

export default async function NewArticlePage() {
  const categories = await getCategories();

  return (
    <main className="mx-auto max-w-5xl rounded-3xl border bg-white p-8 shadow-sm">
      <div className="flex items-start justify-between gap-5">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">ARTICLE CMS</p>
          <h1 className="mt-3 text-3xl font-black text-brand-navy">새 기사 작성</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">여기서 저장한 기사는 Supabase DB에 들어가고, published 상태이면 공개 홈·카테고리·기사 상세에 바로 반영됩니다. Git 커밋 옵션을 켜면 기사 원문 스냅샷도 저장소에 백업됩니다.</p>
        </div>
        <Link href="/admin/articles" className="rounded-full border px-4 py-2 text-sm font-black text-slate-700">목록</Link>
      </div>

      <form action={createArticle} className="mt-8 grid gap-6">
        <section className="grid gap-4 rounded-2xl bg-slate-50 p-5">
          <h2 className="text-lg font-black">기본 정보</h2>
          <label className="grid gap-2 text-sm font-bold text-slate-700">제목<input name="title" required className="rounded-xl border px-4 py-3" /></label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">슬러그<input name="slug" placeholder="비워두면 제목 기준으로 자동 생성" className="rounded-xl border px-4 py-3" /></label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">부제<input name="subtitle" className="rounded-xl border px-4 py-3" /></label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">요약<textarea name="summary" rows={4} className="rounded-xl border px-4 py-3" /></label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">본문<textarea name="content" rows={14} required className="rounded-xl border px-4 py-3" /></label>
        </section>

        <section className="grid gap-4 rounded-2xl bg-slate-50 p-5 md:grid-cols-2">
          <h2 className="md:col-span-2 text-lg font-black">분류·발행</h2>
          <label className="grid gap-2 text-sm font-bold text-slate-700">카테고리<select name="category_slug" className="rounded-xl border px-4 py-3">{categories.map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}</select></label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">상태<select name="status" className="rounded-xl border px-4 py-3"><option value="draft">임시저장</option><option value="review">검수 대기</option><option value="scheduled">예약 발행</option><option value="published">즉시 발행</option></select></label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">기사 유형<select name="article_type" className="rounded-xl border px-4 py-3"><option value="normal">일반 기사</option><option value="press_release">보도자료</option><option value="brand_interview">브랜드 인터뷰</option><option value="sponsored">협찬 기사</option><option value="advertorial">광고성 기사</option></select></label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">예약 발행 시각<input name="scheduled_at" type="datetime-local" className="rounded-xl border px-4 py-3" /></label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">기자명<input name="author_name" placeholder="에듀저널 편집부" className="rounded-xl border px-4 py-3" /></label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">태그<input name="tags" placeholder="쉼표로 구분" className="rounded-xl border px-4 py-3" /></label>
        </section>

        <section className="grid gap-4 rounded-2xl bg-slate-50 p-5 md:grid-cols-2">
          <h2 className="md:col-span-2 text-lg font-black">대표 이미지·출처</h2>
          <label className="grid gap-2 text-sm font-bold text-slate-700">대표 이미지 URL<input name="thumbnail_url" className="rounded-xl border px-4 py-3" /></label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">이미지 원본 URL<input name="image_source_url" className="rounded-xl border px-4 py-3" /></label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">이미지 출처명<input name="image_source_name" placeholder="직접 촬영 / 기관 제공 / 공개 이미지" className="rounded-xl border px-4 py-3" /></label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">이미지 저작자<input name="image_author" className="rounded-xl border px-4 py-3" /></label>
          <label className="grid gap-2 text-sm font-bold text-slate-700 md:col-span-2">이미지 캡션<input name="image_caption" className="rounded-xl border px-4 py-3" /></label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">이미지 라이선스<input name="image_license" className="rounded-xl border px-4 py-3" /></label>
        </section>

        <section className="grid gap-4 rounded-2xl bg-slate-50 p-5">
          <h2 className="text-lg font-black">검수·근거</h2>
          <label className="grid gap-2 text-sm font-bold text-slate-700">참고 출처 URL<textarea name="source_urls" rows={3} placeholder="한 줄에 하나씩 입력" className="rounded-xl border px-4 py-3" /></label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">출처 메모<input name="source_note" className="rounded-xl border px-4 py-3" /></label>
          <label className="flex items-center gap-3 text-sm font-bold text-slate-700"><input name="fact_checked" type="checkbox" /> 팩트체크 완료</label>
          <label className="flex items-center gap-3 text-sm font-bold text-slate-700"><input name="compliance_checked" type="checkbox" /> 광고성/저작권/명예훼손 위험 검토</label>
        </section>

        <section className="grid gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <h2 className="text-lg font-black text-amber-950">Git 백업 커밋</h2>
          <p className="text-sm leading-7 text-amber-900">체크하면 DB 저장 후 content/articles/슬러그.json 파일을 GitHub main 브랜치에 커밋합니다. GitHub 토큰이 없으면 DB 저장만 하고 커밋은 건너뜁니다.</p>
          <label className="flex items-center gap-3 text-sm font-black text-amber-950"><input name="commit_to_git" type="checkbox" defaultChecked /> 기사 스냅샷을 GitHub에 커밋</label>
        </section>

        <button className="rounded-2xl bg-brand-navy px-6 py-4 text-base font-black text-white">DB에 저장하고 공개 사이트 반영</button>
      </form>
    </main>
  );
}
