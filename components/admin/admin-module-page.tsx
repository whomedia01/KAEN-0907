import Link from 'next/link';

type ModuleItem = {
  title: string;
  description: string;
  status?: string;
};

export function AdminModulePage({
  eyebrow,
  title,
  description,
  items,
  primaryHref,
  primaryLabel
}: {
  eyebrow: string;
  title: string;
  description: string;
  items: ModuleItem[];
  primaryHref?: string;
  primaryLabel?: string;
}) {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border bg-white p-7">
        <p className="text-sm font-black text-brand-blue">{eyebrow}</p>
        <div className="mt-2 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-black text-brand-navy">{title}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-600">{description}</p>
          </div>
          {primaryHref && primaryLabel ? (
            <Link href={primaryHref} className="inline-flex rounded-xl bg-brand-navy px-4 py-3 text-sm font-black text-white">
              {primaryLabel}
            </Link>
          ) : null}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <article key={item.title} className="rounded-2xl border bg-white p-6">
            {item.status ? <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black text-gray-600">{item.status}</span> : null}
            <h2 className="mt-4 font-black text-gray-950">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">{item.description}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
