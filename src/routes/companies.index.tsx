import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { fetchCompanies } from "@/lib/companies-source";

export const Route = createFileRoute("/companies/")({
  loader: async () => {
    const companies = await fetchCompanies();
    return { companies };
  },
  head: () => ({
    meta: [
      { title: "무용단 소개 | 현대 무용 아카이브" },
      {
        name: "description",
        content: "세계 현대 무용을 이끄는 무용단들을 소개합니다.",
      },
      { property: "og:title", content: "무용단 소개 | 현대 무용 아카이브" },
      { property: "og:description", content: "세계 현대 무용을 이끄는 무용단들을 소개합니다." },
    ],
  }),
  component: CompaniesPage,
});

function CompaniesPage() {
  const { companies } = Route.useLoaderData();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return companies;
    return companies.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q) ||
        c.director.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q),
    );
  }, [query, companies]);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <PageHeader title="무용단 소개" />

      <div className="relative overflow-hidden border-b border-border px-6 py-12 md:px-10">
        <div className="mx-auto max-w-[1400px]">
          <p className="eyebrow">Companies</p>
          <h1 className="type-h1 mt-3">무용단 소개</h1>
          <p aria-hidden className="stroke-word stroke-word-accent mt-2 text-[3rem] whitespace-nowrap md:text-[7rem]">DANCE COMPANIES</p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-[1400px] flex-1 px-6 py-12 md:px-10 md:py-16">
        <div className="max-w-sm">
          <label htmlFor="cq" className="type-caption text-[0.6rem]">
            검색
          </label>
          <div className="relative mt-3">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="cq"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="무용단, 국가, 예술감독 검색"
              className="w-full border border-border bg-background py-2.5 pr-3 pl-10 text-sm outline-none focus:border-primary"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="type-body mt-16 text-center text-sm text-muted-foreground">
            {companies.length === 0
              ? "아직 등록된 무용단이 없습니다. 곧 채워질 예정입니다."
              : "검색 결과가 없습니다."}
          </p>
        ) : (
          <ul className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c, i) => (
              <Reveal key={c.slug} delay={i * 50}>
                <li>
                  <Link to="/companies/$slug" params={{ slug: c.slug }} className="group block">
                    {c.image ? (
                      <div className="overflow-hidden bg-foreground/5">
                        <img
                          src={c.image}
                          alt={`${c.name} 이미지`}
                          className="aspect-[4/3] w-full object-cover grayscale transition-transform duration-500 group-hover:scale-[1.03]"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="flex aspect-[4/3] w-full items-center justify-center bg-foreground/5">
                        <span aria-hidden className="stroke-word text-4xl">DANCE</span>
                      </div>
                    )}
                    <div className="mt-5 flex flex-wrap items-center gap-2">
                      <span className="sticker sticker-accent">{c.country}</span>
                      {c.founded && <span className="sticker">{c.founded}년 설립</span>}
                    </div>
                    <h2 className="type-h3 mt-3 group-hover:text-primary">{c.name}</h2>
                    {c.director && (
                      <p className="type-caption mt-1.5 text-[0.62rem]">예술감독 {c.director}</p>
                    )}
                    <p className="type-body mt-3 line-clamp-2 text-sm text-muted-foreground">{c.summary}</p>
                  </Link>
                </li>
              </Reveal>
            ))}
          </ul>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
