import { Link } from "@tanstack/react-router";
import type { Work } from "@/lib/archive-data";

export function WorkCard({ work, ratio = "aspect-[4/5]" }: { work: Work; ratio?: string }) {
  return (
    <article className="group flex flex-col">
      <Link
        to="/works/$slug"
        params={{ slug: work.slug }}
        className={`relative block w-full overflow-hidden ${ratio}`}
      >
        <img
          src={work.image}
          alt={`${work.title} 공연 이미지`}
          loading="lazy"
          className="h-full w-full object-cover grayscale transition-all duration-500 ease-out group-hover:scale-[1.06] group-hover:rotate-[1.5deg] group-hover:grayscale-0"
        />
        <span className="pointer-events-none absolute inset-0 bg-linear-to-t from-background/60 via-transparent to-transparent" />

        <span className="pointer-events-none absolute top-3 left-3 flex flex-wrap gap-2">
          <span className="sticker sticker-accent">{work.year}</span>
          <span className="sticker">{work.country}</span>
        </span>

        <span className="pointer-events-none absolute right-3 bottom-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-black text-primary-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          ↗
        </span>
      </Link>

      <div className="mt-5 min-w-0">
        <h3 className="type-h3">{work.title}</h3>
        <p className="type-caption mt-2 text-[0.65rem]">
          {work.choreographer} — {work.year}
        </p>
        <p className="type-body mt-3 line-clamp-3 text-sm">{work.summary}</p>
        <Link
          to="/works/$slug"
          params={{ slug: work.slug }}
          className="link-marker mt-5 text-sm"
          aria-label={`${work.title} 분석 읽기`}
        >
          분석 읽기 <span aria-hidden>→</span>
        </Link>
      </div>
    </article>
  );
}
