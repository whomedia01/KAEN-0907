export const metadata = { title: '저작권/초상권 정책' };
export default function CopyrightPolicyPage() { return <Policy title="저작권/초상권 정책"><p>고객이 제공한 사진, 로고, 문구, 자료의 권리 책임은 제공자에게 있습니다. 고객은 제공 자료를 생활경제저널이 기사, 홍보물, 카드뉴스, 납품물 제작에 사용할 수 있도록 허락한 것으로 봅니다.</p><p>제3자의 저작권, 초상권, 상표권 침해 자료 제출은 금지됩니다.</p></Policy>; }
function Policy({ title, children }: { title: string; children: React.ReactNode }) { return <main className="mx-auto max-w-3xl px-4 py-12"><h1 className="text-4xl font-black text-brand-navy">{title}</h1><div className="markdown-body mt-8 text-gray-700">{children}</div></main>; }
