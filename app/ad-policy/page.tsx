export const metadata = { title: '광고 정책' };
export default function AdPolicyPage() { return <Policy title="광고 정책"><p>광고 상품은 브랜드 인터뷰, 우수 브랜드 기획전, 프리미엄 광고 패키지, 월 광고주 패키지로 구성됩니다.</p><p>불법·허위·과장 광고는 제한되며, 의료·금융·부동산·건강기능식품 등 민감 업종은 별도 검토가 필요합니다.</p></Policy>; }
function Policy({ title, children }: { title: string; children: React.ReactNode }) { return <main className="mx-auto max-w-3xl px-4 py-12"><h1 className="text-4xl font-black text-brand-navy">{title}</h1><div className="markdown-body mt-8 text-gray-700">{children}</div></main>; }
