import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageHeader } from "@/components/site/PageHeader";
import { EmptyState } from "@/components/site/EmptyState";
import { InfoCard } from "@/components/site/InfoCard";
import { Reveal } from "@/components/site/Reveal";
import { fetchInfoItems } from "@/lib/info-source";

export const Route = createFileRoute("/admissions")({
  loader: async () => ({ items: await fetchInfoItems("korea") }),
  head: () => ({
    meta: [
      { title: "한국 입시 요강 | 현대 무용 아카이브" },
      {
        name: "description",
        content: "국내 주요 대학 무용과의 전형 방식과 실기 과제, 준비 일정을 정리했습니다.",
      },
      { property: "og:title", content: "한국 입시 요강 | 현대 무용 아카이브" },
      { property: "og:description", content: "국내 무용과 입시 전형과 실기 과제를 확인하세요." },
    ],
  }),
  component: Admissions,
});

function Admissions() {
  const { items: koreaAdmissionItems } = Route.useLoaderData();
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <PageHeader title="한국 입시" />

      <main className="mx-auto w-full max-w-[1100px] flex-1 px-6 py-20 md:py-28">
        <Reveal className="relative">
          <p className="eyebrow">Korea</p>
          <span aria-hidden className="stroke-word stroke-word-accent pointer-events-none absolute -top-8 left-0 text-[4.5rem] opacity-35 md:text-[9rem]">KOREA</span>
          <h1 className="type-h1 relative mt-4">한국 입시 요강</h1>
          <p className="type-body mt-4">국내 무용과 전형과 실기 과제를 확인하세요</p>
        </Reveal>

        <div className="mt-14">
          {koreaAdmissionItems.length === 0 ? (
            <Reveal>
              <EmptyState
                title="입시 정보가 없습니다"
                description="새로운 입시 요강이 준비되는 대로 이곳에 공개됩니다."
                action={
                  <Link to="/study-abroad" className="btn-base btn-secondary">
                    해외 유학 정보 보기
                  </Link>
                }
              />
            </Reveal>
          ) : (
            <div className="flex flex-col gap-6">
              {koreaAdmissionItems.map((item, i) => (
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
