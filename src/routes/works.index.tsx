import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageHeader } from "@/components/site/PageHeader";
import { WorkCard } from "@/components/site/WorkCard";
import { EmptyState } from "@/components/site/EmptyState";
import { Reveal } from "@/components/site/Reveal";
import { fetchWorks, buildFilterOptions } from "@/lib/works-source";

export const Route = createFileRoute("/works/")({
  loader: async () => {
    const works = await fetchWorks();
    return { works, options: buildFilterOptions(works) };
  },
  head: () => ({
    meta: [
      { title: "작품 탐색 | 현대 무용 아카이브" },
      {
        name: "description",
        content: "국가, 연도, 안무가별로 세계 현대 무용 작품을 탐색하고 분석을 읽어보세요.",
      },
      { property: "og:title", content: "작품 탐색 | 현대 무용 아카이브" },
      {
        property: "og:description",
        content: "국가·연도·안무가별로 현대 무용 대표작을 탐색하세요.",
      },
    ],
  }),
  component: WorksPage,
});

function WorksPage() {
  const { works, options } = Route.useLoaderData();
  const { countries, years, choreographers } = options;
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState<string>(countries[0]!);
  const [year, setYear] = useState<string>(years[0]!);
  const [choreographer, setChoreographer] = useState<string>(choreographers[0]!);

  const filtered = useMemo(
    () =>
      works.filter((w) => {
        const q = query.trim().toLowerCase();
        const matchQ =
          !q ||
          w.title.toLowerCase().includes(q) ||
          w.choreographer.toLowerCase().includes(q) ||
          w.summary.toLowerCase().includes(q);
        return (
          matchQ &&
          (country === countries[0] || w.country === country) &&
          (year === years[0] || String(w.year) === year) &&
          (choreographer === choreographers[0] || w.choreographer === choreographer)
        );
      }),
    [query, country, year, choreographer],
  );

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <PageHeader title="작품 탐색" />

      <div className="relative overflow-hidden border-b border-border px-6 py-12 md:px-10">
        <div className="mx-auto max-w-[1400px]">
          <p className="eyebrow">Explore</p>
          <h1 className="type-h1 mt-3">작품 탐색</h1>
          <p aria-hidden className="stroke-word stroke-word-accent mt-2 text-[3rem] whitespace-nowrap md:text-[7rem]">ARCHIVE INDEX</p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-[1400px] flex-1 px-6 py-12 md:px-10 md:py-16">
        <div className="grid gap-12 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 shrink-0 text-primary" />
              <span className="type-caption text-[0.65rem] text-foreground">필터</span>
            </div>

            <div className="mt-8 flex flex-col gap-7">
              <div>
                <label htmlFor="q" className="type-caption text-[0.6rem]">
                  검색
                </label>
                <div className="relative mt-3">
                  <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="q"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="작품 검색..."
                    className="field pl-9"
                  />
                </div>
              </div>

              <Select label="국가" value={country} onChange={setCountry} options={countries} />
              <Select label="연도" value={year} onChange={setYear} options={years} />
              <Select
                label="안무가"
                value={choreographer}
                onChange={setChoreographer}
                options={choreographers}
              />
            </div>
          </aside>

          <section>
            {filtered.length === 0 ? (
              <EmptyState
                title="검색 결과가 없습니다"
                description="다른 조건으로 다시 탐색해 보세요."
              />
            ) : (
              <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2">
                {filtered.map((w, i) => (
                  <Reveal key={w.slug} delay={i * 70}>
                    <WorkCard work={w} ratio="aspect-[4/3]" />
                  </Reveal>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="type-caption text-[0.6rem]" htmlFor={label}>
        {label}
      </label>
      <select
        id={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="field mt-3 appearance-none bg-surface"
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-background">
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
