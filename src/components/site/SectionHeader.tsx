export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  strokeWord,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  strokeWord?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={`relative ${align === "center" ? "text-center" : ""}`}>
      {strokeWord && (
        <span
          aria-hidden
          className="stroke-word pointer-events-none absolute -top-6 -left-2 hidden text-[5.5rem] opacity-40 md:block md:text-[8rem]"
        >
          {strokeWord}
        </span>
      )}
      <div className="relative">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="type-h2 mt-3">{title}</h2>
        {subtitle && (
          <p className={`type-body mt-4 max-w-xl ${align === "center" ? "mx-auto" : ""}`}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
