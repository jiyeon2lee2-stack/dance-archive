export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden border border-border bg-surface px-6 py-20 text-center md:py-28">
      <span
        aria-hidden
        className="stroke-word stroke-word-accent pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-[4rem] whitespace-nowrap opacity-30 md:text-[9rem]"
      >
        EMPTY · EMPTY
      </span>

      <div className="relative">
        <p className="eyebrow">Archive</p>
        <p className="type-h2 mt-4">{title}</p>
        {description && <p className="type-body mx-auto mt-4 max-w-md text-sm">{description}</p>}
        {action && <div className="mt-8 flex justify-center">{action}</div>}
      </div>
    </div>
  );
}
