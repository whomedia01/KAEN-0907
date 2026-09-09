export const metadata = { title: '인터넷신문윤리강령' };

const items = [
  ['정확성', '에듀저널은 확인 가능한 사실과 출처를 바탕으로 기사를 작성하며, 불확실한 정보는 단정적으로 보도하지 않습니다.'],
  ['공정성', '교육기관, 학습자, 독자에게 영향을 미치는 사안은 가능한 범위에서 여러 관점을 확인합니다.'],
  ['독립성', '광고, 협찬, 보도자료성 콘텐츠는 일반 기사와 혼동되지 않도록 표시하고 편집권을 지킵니다.'],
  ['인권 보호', '청소년, 고령 학습자, 취약계층의 사생활과 명예를 침해하지 않도록 주의합니다.'],
  ['정정과 반론', '오류가 확인된 기사에 대해서는 신속히 정정하고, 필요한 경우 반론 또는 후속 보도를 검토합니다.'],
  ['저작권 준수', '사진, 자료, 인용문 사용 시 출처와 이용 권한을 확인하고 무단 복제를 금지합니다.']
];

export default function EthicsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <p className="text-sm font-black tracking-[0.22em] text-brand-gold">ETHICS</p>
      <h1 className="mt-2 text-4xl font-black text-brand-navy">인터넷신문윤리강령</h1>
      <p className="mt-5 text-lg leading-9 text-gray-700">에듀저널은 교육 전문 인터넷매체로서 독자의 알 권리와 교육 현장의 신뢰를 존중하며 다음의 편집 윤리 기준을 준수합니다.</p>
      <section className="mt-10 divide-y border-y">
        {items.map(([title, desc]) => (
          <div key={title} className="grid gap-2 py-5 md:grid-cols-[160px_1fr]">
            <h2 className="text-lg font-black text-brand-navy">{title}</h2>
            <p className="leading-8 text-gray-700">{desc}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
