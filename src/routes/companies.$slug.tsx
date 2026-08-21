import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { fetchCompany } from "@/lib/companies-source";
import { fetchWorksByCompany } from "@/lib/works-source";
import { youtubeId } from "@/lib/youtube";

export const Route = createFileRoute("/companies/$slug")({
  loader: async ({ params }) => {
    const company = await fetchCompany(params.slug);
    if (!company) throw notFound();
    const works = await fetchWorksByCompany(params.slug);
    return { company, works };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "무용단을 찾을 수 없습니다 | 현대 무용 아카이브" }, { name: "robots", content: "noindex" }],
      };
    }
    const { company } = loaderData;
    const desc = `${company.name} (${company.country}) 무용단 소개.`;
    return {
      meta: [
        { title: `${company.name} | 현대 무용 아카이브` },
        { name: "description", content: desc },
        { property: "og:title", content: `${company.name} 무용단 소개` },
        { property: "og:description", content: desc },
      ],
    };
  },
  component: CompanyDetail,
  notFoundComponent: CompanyNotFound,
});

function CompanyDetail() {
  const { company, works } = Route.useLoaderData();
  const vid = youtubeId(company.youtube);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <PageHeader title="무용단 소개" backTo="/companies" />

      <main className="flex-1">
        {company.image && (
          <div className="relative isolate">
            <img
              src={company.image}
              alt={`${company.name} 이미지`}
              className="h-[42vh] w-full object-cover opacity-35 grayscale md:h-[62vh]"
            />
            <div className="absolute inset-0 bg-linear-to-t from-background via-background/50 to-transparent" />
          </div>
        )}

        <article
          className={`mx-auto max-w-[760px] px-6 pb-24 md:pb-32 ${
            company.image ? "-mt-24 md:-mt-32" : "pt-16 md:pt-20"
          }`}
        >
          <Reveal>
            <p className="eyebrow">Company</p>
            <h1 className="type-h1 mt-5">{company.name}</h1>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="sticker sticker-accent">{company.country}</span>
              {company.founded && <span className="sticker">{company.founded}년 설립</span>}
              {company.director && <span className="sticker">예술감독 {company.director}</span>}
            </div>
            <div className="rule mt-8" />
          </Reveal>

          <div className="mt-10 flex flex-col gap-7">
            {company.description.map((p: string, i: number) => (
              <Reveal key={i} delay={i * 60}>
                <p className="type-body text-[1.0625rem] leading-[2]">{p}</p>
              </Reveal>
            ))}
          </div>

          {/* 소개 영상 (유튜브 공식 삽입) */}
          {vid && (
            <Reveal>
              <section className="mt-20">
                <div className="rule" />
                <p className="eyebrow mt-10">Video</p>
                <div className="mt-6 aspect-video w-full overflow-hidden bg-foreground/5">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${vid}`}
                    title={`${company.name} 소개 영상`}
                    className="h-full w-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
                <p className="type-caption mt-4 text-[0.6rem]">영상 출처: YouTube</p>
              </section>
            </Reveal>
          )}

          {/* 이 무용단의 작품 */}
          {works.length > 0 && (
            <Reveal>
              <section className="mt-20">
                <div className="rule" />
                <p className="eyebrow mt-10">Works</p>
                <h2 className="type-h3 mt-4">이 무용단의 작품</h2>
                <ul className="mt-6 flex flex-col divide-y divide-border border-t border-b border-border">
                  {works.map((w) => (
                    <li key={w.slug}>
                      <Link
                        to="/works/$slug"
                        params={{ slug: w.slug }}
                        className="group flex items-center justify-between gap-4 py-5"
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-bold group-hover:text-primary">{w.title}</span>
                          <span className="type-caption mt-1 block text-[0.6rem]">{w.year}</span>
                        </span>
                        <span aria-hidden className="shrink-0 text-primary opacity-0 transition-opacity group-hover:opacity-100">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            </Reveal>
          )}

          {company.website && (
            <Reveal>
              <div className="mt-16">
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-base btn-secondary"
                >
                  공식 웹사이트 <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </Reveal>
          )}
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}

function CompanyNotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <PageHeader title="무용단 소개" backTo="/companies" />
      <main className="mx-auto w-full max-w-[900px] flex-1 px-6 py-28 text-center">
        <h1 className="type-h1">무용단을 찾을 수 없습니다</h1>
        <p className="type-body mt-4 text-sm">요청하신 무용단이 아카이브에 없습니다.</p>
        <div className="mt-8">
          <Link to="/companies" className="btn-base btn-secondary">
            무용단 목록으로
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
