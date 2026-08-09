import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageHeader } from "@/components/site/PageHeader";
import { EmptyState } from "@/components/site/EmptyState";
import { InfoCard } from "@/components/site/InfoCard";
import { Reveal } from "@/components/site/Reveal";
import { fetchInfoItems } from "@/lib/info-source";

export const Route = createFileRoute("/study-abroad")({
  loader: async () => ({ items: await fetchInfoItems("abroad") }),
  head: () => ({
    meta: [
      { title: "해외 유학 정보 | 현대 무용 아카이브" },
      {
        name: "description",
        content: "세계의 현대무용 유학 기회와 학교, 오디션 정보를 탐색하세요.",
      },
      { property: "og:title", content: "해외 유학 정보 | 현대 무용 아카이브" },
      { property: "og:description", content: "세계의 현대무용 유학 기회를 탐색하세요." },
    ],
  }),
  component: StudyAbroad,
});

function StudyAbroad() {
  const { items: studyAbroadItems } = Route.useLoaderData();
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <PageHeader title="해외 유학" />

      <main className="mx-auto w-full max-w-[1100px] flex-1 px-6 py-20 md:py-28">
        <Reveal className="relative">
          <p className="eyebrow">Overseas</p>
          <span aria-hidden className="stroke-word stroke-word-accent pointer-events-none absolute -top-8 left-0 text-[4.5rem] opacity-35 md:text-[9rem]">ABROAD</span>
          <h1 className="type-h1 relative mt-4">해외 유학 정보</h1>
          <p className="type-body mt-4">세계의 현대무용 유학 기회를 탐색하세요</p>
        </Reveal>

        <div className="mt-14">
          {studyAbroadItems.length === 0 ? (
            <Reveal>
              <EmptyState
                title="유학 정보가 없습니다"
                description="새로운 유학 정보가 준비되는 대로 이곳에 공개됩니다. 그동안 국내 입시 요강을 살펴보세요."
                action={
                  <Link to="/admissions" className="btn-base btn-secondary">
                    한국 입시 요강 보기
                  </Link>
                }
              />
            </Reveal>
          ) : (
            <div className="flex flex-col gap-6">
              {studyAbroadItems.map((item, i) => (
                <Reveal key={item.title} delay={i * 80}>
                  <InfoCard item={item} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
