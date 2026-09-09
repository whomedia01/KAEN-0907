import Link from 'next/link';
import { getPublishedArticles } from '@/lib/data/public';
import { formatDate } from '@/lib/utils/format';

type Article = Awaited<ReturnType<typeof getPublishedArticles>>[number];
const fallback = '/media/edu-lifelong.svg';

function Thumb({ article, wide = false }: { article?: Article; wide?: boolean }) {
  return <img src={article?.thumbnail_url || fallback} alt={article?.title || '에듀저널'} className={`${wide ? 'aspect-[16/9]' : 'aspect-[4/3]'} w-full bg-slate-100 object-cover`} loading="lazy" />;
}

function Head({ title, href }: { title: string; href?: string }) {
  return <div className="flex items-center justify-between border-b-2 border-slate-950 pb-2"><h2 className="text-[23px] font-black tracking-[-0.05em] md:text-[24px]">{title}</h2>{href ? <Link href={href} className="text-[15px] font-black text-blue-700">더보기</Link> : null}</div>;
}

function TopIssue({ article }: { article?: Article }) {
  if (!article) return null;
  return <Link href={`/articles/${article.slug}`} className="group block"><Thumb article={article} wide /><p className="mt-4 text-[14px] font-black tracking-[0.2em] text-blue-700">TOP ISSUE</p><h1 className="mt-2 text-[33px] font-black leading-[1.25] tracking-[-0.06em] group-hover:text-blue-700 sm:text-[38px] md:text-[46px]">{article.title}</h1><p className="mt-3 line-clamp-3 text-[18px] leading-8 text-slate-700 md:text-[18px]">{article.summary}</p><p className="mt-4 text-[14px] font-bold text-slate-500 md:text-[14px]">{article.categories?.name ?? '교육뉴스'} · {formatDate(article.published_at)}</p></Link>;
}

function TopSide({ articles }: { articles: Article[] }) {
  return <div className="grid gap-4">{articles.slice(0, 4).map((article) => <Link key={article.id} href={`/articles/${article.slug}`} className="grid grid-cols-[124px_1fr] gap-3 border-b border-slate-100 pb-4 hover:text-blue-700 sm:grid-cols-[138px_1fr]"><Thumb article={article} /><div><p className="text-[13px] font-black text-blue-700 md:text-[13px]">{article.categories?.name ?? '교육뉴스'}</p><h3 className="mt-1 line-clamp-2 text-[18px] font-black leading-7 md:text-[17px]">{article.title}</h3><p className="mt-1 text-[14px] text-slate-500">{formatDate(article.published_at)}</p></div></Link>)}</div>;
}

function Ranking({ articles }: { articles: Article[] }) {
  return <section className="bg-white p-5"><Head title="랭킹뉴스" /><div className="mt-3 divide-y divide-slate-100">{articles.slice(0, 10).map((article, index) => <Link key={article.id} href={`/articles/${article.slug}`} className="flex gap-3 py-3 hover:text-blue-700"><span className="w-7 shrink-0 text-center text-[22px] font-black text-blue-700">{index + 1}</span><div><p className="line-clamp-2 text-[17px] font-black leading-7">{article.title}</p><p className="mt-1 text-[14px] text-slate-500">{formatDate(article.published_at)}</p></div></Link>)}</div></section>;
}

function TextList({ title, articles, href }: { title: string; articles: Article[]; href?: string }) {
  return <section className="bg-white p-5"><Head title={title} href={href} /><div className="mt-3 divide-y divide-slate-100">{articles.slice(0, 8).map((article) => <Link key={article.id} href={`/articles/${article.slug}`} className="block py-3 hover:text-blue-700"><p className="line-clamp-2 text-[17px] font-bold leading-7">{article.title}</p><p className="mt-1 text-[14px] text-slate-500">{article.categories?.name ?? '교육뉴스'} · {formatDate(article.published_at)}</p></Link>)}</div></section>;
}

function Feature({ title, articles, href }: { title: string; articles: Article[]; href?: string }) {
  const lead = articles[0];
  if (!lead) return null;
  return <section className="bg-white p-5"><Head title={title} href={href} /><Link href={`/articles/${lead.slug}`} className="group mt-4 grid gap-4 md:grid-cols-[240px_1fr]"><Thumb article={lead} wide /><div><p className="text-[14px] font-black text-blue-700">{lead.categories?.name ?? '교육뉴스'}</p><h3 className="mt-1 line-clamp-2 text-[25px] font-black leading-8 tracking-[-0.04em] group-hover:text-blue-700 md:text-[26px] md:leading-9">{lead.title}</h3><p className="mt-2 line-clamp-4 text-[17px] leading-8 text-slate-700">{lead.summary}</p></div></Link><div className="mt-4 grid gap-2.5 md:grid-cols-2">{articles.slice(1, 5).map((article) => <Link key={article.id} href={`/articles/${article.slug}`} className="border-t border-slate-100 pt-3 text-[17px] font-bold leading-7 hover:text-blue-700">· {article.title}</Link>)}</div></section>;
}

function Brief() {
  return <section className="bg-slate-950 p-5 text-white"><p className="text-[13px] font-black tracking-[0.22em] text-blue-300">EDU JOURNAL BRIEF</p><h2 className="mt-2 text-[23px] font-black tracking-[-0.04em]">교육산업 브리핑</h2><p className="mt-3 text-[16px] leading-7 text-slate-300">정책 변화, 직무교육, 에듀테크, 기관 운영 사례를 현장 중심으로 정리합니다.</p><div className="mt-4 grid grid-cols-2 gap-2 text-[15px] font-bold text-slate-200"><Link href="/report" className="border border-slate-600 px-3 py-3 text-center hover:border-white">기사제보</Link><Link href="/press" className="border border-slate-600 px-3 py-3 text-center hover:border-white">보도자료 접수</Link></div></section>;
}

function CategoryBlock({ title, slug, articles }: { title: string; slug: string; articles: Article[] }) {
  const list = articles.filter((a) => a.categories?.slug === slug).slice(0, 5);
  const lead = list[0] ?? articles[0];
  return <section className="bg-white p-5"><Head title={title} href={`/category/${slug}`} />{lead ? <Link href={`/articles/${lead.slug}`} className="group mt-4 block"><Thumb article={lead} wide /><h3 className="mt-3 line-clamp-2 text-[21px] font-black leading-8 group-hover:text-blue-700">{lead.title}</h3></Link> : null}<div className="mt-3 space-y-2.5">{list.slice(1, 5).map((article) => <Link key={article.id} href={`/articles/${article.slug}`} className="block text-[16px] font-bold leading-7 hover:text-blue-700">· {article.title}</Link>)}</div></section>;
}

export async function IndustryHomePage() {
  const articles = await getPublishedArticles(160);
  const spotlight = articles.filter((a) => ['edutech-ai', 'edu-institution', 'lifelong-education'].includes(a.categories?.slug ?? '')).slice(0, 6);
  const interviews = articles.filter((a) => a.categories?.slug === 'interview-people').slice(0, 6);
  const seminar = articles.filter((a) => ['lifelong-education', 'career-dev', 'senior-education'].includes(a.categories?.slug ?? '')).slice(0, 8);
  const categories = [['AI·에듀테크', 'edutech-ai'], ['정책·보도', 'press-release'], ['자격증·직무교육', 'career-dev'], ['평생교육·HRD', 'lifelong-education'], ['시니어교육', 'senior-education'], ['교육기관 탐방', 'edu-institution'], ['인터뷰', 'interview-people'], ['오피니언', 'opinion']] as const;

  return <main className="bg-[#f4f5f7] text-slate-950"><section className="border-y border-slate-200 bg-white"><div className="mx-auto flex max-w-[1180px] flex-col gap-2 px-4 py-3 text-[16px] leading-7 md:flex-row md:items-center"><span className="w-fit bg-blue-700 px-2.5 py-1 text-[13px] font-black text-white">최신</span><div className="flex flex-wrap gap-x-5 gap-y-1">{articles.slice(0, 5).map((article) => <Link key={article.id} href={`/articles/${article.slug}`} className="font-bold hover:text-blue-700">{article.title}</Link>)}</div></div></section><section className="mx-auto grid max-w-[1180px] grid-cols-12 gap-5 px-4 py-5 md:py-7"><div className="col-span-12 bg-white p-5 lg:col-span-8"><div className="grid gap-6 md:grid-cols-[1.45fr_1fr]"><TopIssue article={articles[0]} /><TopSide articles={articles.slice(1, 5)} /></div></div><aside className="col-span-12 space-y-5 lg:col-span-4"><Ranking articles={articles} /><Brief /></aside></section><section className="mx-auto grid max-w-[1180px] gap-5 px-4 pb-6 lg:grid-cols-2"><Feature title="스포트라이트" articles={spotlight.length ? spotlight : articles.slice(10, 16)} /><Feature title="인터뷰" articles={interviews.length ? interviews : articles.slice(16, 22)} href="/category/interview-people" /></section><section className="mx-auto grid max-w-[1180px] gap-5 px-4 pb-6 lg:grid-cols-[2fr_1fr]"><Feature title="교육·세미나" articles={seminar.length ? seminar : articles.slice(22, 30)} href="/category/lifelong-education" /><TextList title="최신 교육뉴스" articles={articles.slice(5, 15)} href="/articles" /></section><section className="mx-auto grid max-w-[1180px] gap-5 px-4 pb-10 md:grid-cols-2 lg:grid-cols-4">{categories.map(([title, slug]) => <CategoryBlock key={slug} title={title} slug={slug} articles={articles} />)}</section></main>;
}
