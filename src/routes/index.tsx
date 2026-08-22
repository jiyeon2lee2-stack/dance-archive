import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SectionHeader } from "@/components/site/SectionHeader";
import { WorkCard } from "@/components/site/WorkCard";
import { WireGlobe } from "@/components/site/WireGlobe";
import { Reveal } from "@/components/site/Reveal";
import { type Work } from "@/lib/archive-data";
import { fetchWorks } from "@/lib/works-source";
import {
  fetchUpcomingEvents,
  formatEventDate,
  kindLabel,
  regionLabel,
  type DanceEvent,
} from "@/lib/events-source";
import heroImage from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  loader: async () => {
    const [works, events] = await Promise.all([fetchWorks(), fetchUpcomingEvents()]);
    return { featured: works.slice(0, 3), upcoming: events.slice(0, 3) };
  },
  head: () => ({
    meta: [
      { title: "현대무용 아카이브 | 세계의 현대 무용 작품 아카이브" },
      {
        name: "description",
        content:
          "세계의 위대한 현대 무용 작품과 안무가를 아카이브합니다. 작품 분석, 한국 입시 요강, 해외 유학 정보를 한 곳에서 만나보세요.",
      },
      { property: "og:title", content: "현대무용 아카이브" },
      {
        property: "og:description",
        content: "세계의 위대한 현대 무용 작품들을 만나세요. 작품 분석과 입시·유학 정보 아카이브.",
      },
    ],
  }),
  component: Home,
});

const features = [
  {
    title: "깊이 있는 작품 분석",
    body: "세계적 안무가의 대표작을 구조와 맥락으로 읽어냅니다. 시대적 배경부터 동작 어휘까지 한 편의 에세이로 정리합니다.",
  },
  {
    title: "안무가 프로필",
    body: "머스 커닝햄부터 피나 바우쉬까지, 현대 무용의 언어를 바꾼 안무가들의 작업 세계를 살펴봅니다.",
  },
  {
    title: "진로 콘텐츠",
    body: "국내 입시 요강과 해외 유학 정보를 정리해, 무대를 향한 다음 걸음을 구체적으로 설계할 수 있게 돕습니다.",
  },
];

// 시작까지 남은 일수 (오늘이면 0, 시작했으면 음수)
function daysUntil(iso: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((new Date(`${iso}T00:00:00`).getTime() - today.getTime()) / 86_400_000);
}

function dday(start: string): string | null {
  const d = daysUntil(start);
  if (d < 0) return "진행 중";
  if (d === 0) return "오늘";
  if (d <= 14) return `D-${d}`;
  return null;
}

// "09.12" 형태의 큰 날짜 숫자
function bigDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return `${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

function Home() {
  const { featured, upcoming } = Route.useLoaderData() as { featured: Work[]; upcoming: DanceEvent[] };

  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <img
          src={heroImage}
          alt="어두운 극장 무대 위 한 명의 무용수"
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover opacity-25 grayscale"
        />
        <div className="absolute inset-0 bg-linear-to-b from-background/60 via-background/75 to-background" />
        <span
          aria-hidden
          className="stroke-word stroke-word-accent pointer-events-none absolute inset-x-0 top-1/3 text-center text-[6rem] whitespace-nowrap opacity-40 md:text-[16rem]"
        >
          MOVEMENT
        </span>

        <div className="relative mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-40">
          <Reveal>
            <p className="eyebrow">Contemporary Dance Archive ✦ SINCE 2026</p>
            <h1 className="type-display mt-6">
              현대무용
              <br />
              <span className="text-primary">아카이브</span>
            </h1>
            <p className="type-body mt-8 max-w-xl text-base">
              세계의 위대한 현대 무용 작품들을 만나세요. 시대를 바꾼 안무와 그 안에 담긴 사유를,
              깊이 있는 분석과 함께 아카이브합니다.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/works" className="btn-base btn-primary">
                작품 탐색하기 <span aria-hidden>→</span>
              </Link>
              <Link to="/login" className="btn-base btn-secondary">
                로그인하고 분석 보기 <span aria-hidden>↗</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>


      {/* 추천 작품 */}
      <section className="mx-auto max-w-[1400px] px-6 py-20 md:px-10 md:py-28">
        <Reveal>
          <SectionHeader
            eyebrow="Featured"
            title="추천 작품"
            subtitle="반드시 마주해야 할 걸작들"
            strokeWord="Featured"
          />
        </Reveal>

        <div className="mt-16 grid gap-12 md:grid-cols-12">
          <Reveal className="md:col-span-7" delay={60}>
            {featured[0] && <WorkCard work={featured[0]} ratio="aspect-[4/5]" />}
          </Reveal>
          <div className="flex flex-col gap-12 md:col-span-5 md:pt-24">
            {featured.slice(1).map((w, i) => (
              <Reveal key={w.slug} delay={120 + i * 90}>
                <WorkCard work={w} ratio="aspect-[16/10]" />
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="mt-16">
          <Link to="/works" className="btn-base btn-secondary">
            모든 작품 보기 <span aria-hidden>→</span>
          </Link>
        </Reveal>
      </section>

      {/* 다가오는 일정 — 등록된 일정이 없으면 섹션 자체가 표시되지 않습니다 */}
      {upcoming.length > 0 && (
        <section className="border-t border-border">
          <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-20">
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="eyebrow">What's On</p>
                  <h2 className="type-h2 mt-3">다가오는 일정</h2>
                </div>
                <Link to="/events" className="btn-base btn-secondary px-5 py-2 text-xs">
                  전체 일정 보기 <span aria-hidden>→</span>
                </Link>
              </div>
            </Reveal>
            <ul className="mt-10 grid gap-6 md:grid-cols-3">
              {upcoming.map((e, i) => (
                <Reveal key={e.id} delay={i * 80}>
                  <li className="h-full">
                    <Link
                      to="/events"
                      className="group flex h-full flex-col border border-border p-7 transition-all duration-200 hover:-translate-y-1 hover:border-primary md:p-8"
                    >
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="sticker sticker-accent">{kindLabel[e.kind]}</span>
                        <span className="sticker">{regionLabel[e.region]}</span>
                        {dday(e.start) && (
                          <span className="mono ml-auto text-xs font-bold text-primary">{dday(e.start)}</span>
                        )}
                      </span>
                      <span className="mt-6 block text-6xl font-black tracking-tighter group-hover:text-primary md:text-7xl">
                        {bigDate(e.start)}
                      </span>
                      <span className="mono mt-2 block text-[0.65rem] tracking-wide text-muted-foreground">
                        {formatEventDate(e)}
                      </span>
                      <span className="mt-5 block text-base font-bold leading-snug">{e.title}</span>
                      {e.venue && (
                        <span className="mt-2 block text-xs text-muted-foreground">{e.venue}</span>
                      )}
                      <span aria-hidden className="mt-auto block pt-6 text-primary opacity-0 transition-opacity group-hover:opacity-100">
                        →
                      </span>
                    </Link>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* 무엇을 경험할 수 있나요? — inverted beige block */}
      <section className="invert-block relative isolate overflow-hidden">
        <WireGlobe className="pointer-events-none absolute top-1/2 -right-[18%] -z-10 h-[130%] w-auto -translate-y-1/2 opacity-30 md:-right-[10%] md:opacity-40" />
        <div className="relative mx-auto max-w-[1400px] px-6 py-20 md:px-10 md:py-28">
          <Reveal>
            <p className="text-xs font-extrabold tracking-[0.24em] uppercase">Experience</p>
            <h2 className="type-h2 mt-3">무엇을 경험할 수 있나요?</h2>
          </Reveal>
          <div className="mt-12 grid gap-0 md:grid-cols-3">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 90}>
                <div className="border-t border-primary-foreground/25 py-10 md:mr-10 md:py-12">
                  <p className="text-5xl font-black tracking-tighter">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="type-h3 mt-5">{f.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed opacity-80">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>


      {/* 입시 & 유학 정보 */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-[1400px] px-6 py-20 md:px-10 md:py-28">
          <Reveal>
            <SectionHeader eyebrow="Pathways" title="입시 & 유학 정보" strokeWord="Pathways" />
          </Reveal>
          <div className="mt-14 grid gap-8 md:grid-cols-2">
            <Reveal delay={60}>
              <div className="grain-panel flex h-full flex-col justify-between p-8 transition-all duration-200 hover:-translate-y-1 hover:border-primary md:p-12">
                <div>
                  <p className="eyebrow">Korea</p>
                  <h3 className="type-h2 mt-4">한국 입시 요강</h3>
                  <p className="type-body mt-4 text-sm">
                    국내 주요 대학 무용과의 전형 방식과 실기 과제, 준비 일정을 정리했습니다.
                  </p>
                </div>
                <Link to="/admissions" className="link-marker mt-10 text-sm">
                  입시 정보 보기 <span aria-hidden>→</span>
                </Link>
              </div>
            </Reveal>
            <Reveal delay={140}>
              <div className="grain-panel flex h-full flex-col justify-between p-8 transition-all duration-200 hover:-translate-y-1 hover:border-primary md:p-12">
                <div>
                  <p className="eyebrow">Overseas</p>
                  <h3 className="type-h2 mt-4">해외 유학 정보</h3>
                  <p className="type-body mt-4 text-sm">
                    유럽과 북미의 컨템포러리 댄스 학교, 오디션 일정과 지원 요건을 안내합니다.
                  </p>
                </div>
                <Link to="/study-abroad" className="link-marker mt-10 text-sm">
                  유학 정보 보기 <span aria-hidden>→</span>
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border">
        <div className="relative mx-auto max-w-[1400px] overflow-hidden px-6 py-24 text-center md:px-10 md:py-32">
          <span
            aria-hidden
            className="stroke-word pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-[4rem] whitespace-nowrap opacity-30 md:text-[12rem]"
          >
            JOIN NOW
          </span>
          <Reveal>
            <h2 className="type-h1 relative">지금 시작하세요</h2>
            <p className="type-body relative mx-auto mt-6 max-w-lg">
              무료로 가입하고 모든 작품 분석과 진로 콘텐츠를 열람하세요
            </p>
            <div className="relative mt-10">
              <Link to="/login" className="btn-base btn-primary">
                무료로 시작하기 <span aria-hidden>→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
