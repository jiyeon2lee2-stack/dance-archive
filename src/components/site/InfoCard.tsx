import type { InfoItem } from "@/lib/archive-data";

export function InfoCard({ item }: { item: InfoItem }) {
  return (
    <article className="grain-panel group p-7 transition-all duration-200 hover:-translate-y-1 hover:border-primary md:p-9">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
        <h3 className="type-h3 min-w-0">{item.title}</h3>
        <span className="sticker shrink-0">{item.meta}</span>
      </div>
      <p className="type-body mt-4 text-sm">{item.body}</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {item.tags.map((t, i) => (
          <span key={t} className={i % 2 === 0 ? "sticker" : "sticker sticker-accent"}>
            {t}
          </span>
        ))}
      </div>
    </article>
  );
}
