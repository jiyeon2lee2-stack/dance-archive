import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ExternalLink, MapPin } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import {
  fetchUpcomingEvents,
  formatEventDate,
  monthKey,
  kindLabel,
  regionLabel,
  type DanceEvent,
  type EventKind,
  type EventRegion,
} from "@/lib/events-source";

export const Route = createFileRoute("/events")({
  loader: async () => {
    const events = await fetchUpcomingEvents();
    return { events };
  },
  head: () => ({
    meta: [
      { title: "공연·워크샵 | 현대 무용 아카이브" },
      { name: "description", content: "국내외 현대 무용 공연과 워크샵 일정을 확인하세요." },
      { property: "og:title", content: "공연·워크샵 | 현대 무용 아카이브" },
      { property: "og:description", content: "국내외 현대 무용 공연과 워크샵 일정을 확인하세요." },
    ],
  }),
  component: EventsPage,
});

type KindFilter = "all" | EventKind;
type RegionFilter = "all" | EventRegion;

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`btn-base px-4 py-2 text-xs ${active ? "btn-primary" : "btn-secondary"}`}
    >
      {children}
    </button>
  );
}

function EventsPage() {
  const { events } = Route.useLoaderData();
  const [kind, setKind] = useState<KindFilter>("all");
  const [region, setRegion] = useState<RegionFilter>("all");

  const filtered = useMemo(
    () =>
      events.filter(
        (e: DanceEvent) =>
          (kind === "all" || e.kind === kind) && (region === "all" || e.region === region),
      ),
    [events, kind, region],
  );

  // 월별 묶음 (시작일 기준, 이미 날짜순 정렬됨)
  const grouped = useMemo(() => {
    const map = new Map<string, DanceEvent[]>();
    for (const e of filtered) {
      const key = monthKey(e.start);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
    }
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <PageHeader title="공연·워크샵" />

      <div className="relative overflow-hidden border-b border-border px-6 py-12 md:px-10">
        <div className="mx-auto max-w-[1400px]">
          <p className="eyebrow">Calendar</p>
          <h1 className="type-h1 mt-3">공연·워크샵</h1>
          <p aria-hidden className="stroke-word stroke-word-accent mt-2 text-[3rem] whitespace-nowrap md:text-[7rem]">WHAT'S ON</p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-[900px] flex-1 px-6 py-12 md:px-10 md:py-16">
        {/* 필터 */}
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <div className="flex items-center gap-2">
            <FilterButton active={kind === "all"} onClick={() => setKind("all")}>전체</FilterButton>
            <FilterButton active={kind === "performance"} onClick={() => setKind("performance")}>공연</FilterButton>
            <FilterButton active={kind === "workshop"} onClick={() => setKind("workshop")}>워크샵</FilterButton>
          </div>
          <div className="flex items-center gap-2">
            <FilterButton active={region === "all"} onClick={() => setRegion("all")}>전 지역</FilterButton>
            <FilterButton active={region === "domestic"} onClick={() => setRegion("domestic")}>국내</FilterButton>
            <FilterButton active={region === "abroad"} onClick={() => setRegion("abroad")}>해외</FilterButton>
          </div>
        </div>

        {grouped.length === 0 ? (
          <p className="type-body mt-20 text-center text-sm text-muted-foreground">
            {events.length === 0
              ? "예정된 일정이 없습니다. 새 일정이 등록되면 이곳에 표시됩니다."
              : "선택한 조건에 맞는 일정이 없습니다."}
          </p>
        ) : (
          grouped.map(([month, list]) => (
            <section key={month} className="mt-14">
              <Reveal>
                <h2 className="type-caption text-[0.7rem] text-primary">{month}</h2>
                <div className="rule mt-4" />
              </Reveal>
              <ul className="flex flex-col divide-y divide-border">
                {list.map((e: DanceEvent) => (
                  <Reveal key={e.id}>
                    <li className="py-8">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="sticker sticker-accent">{kindLabel[e.kind]}</span>
                        <span className="sticker">{regionLabel[e.region]}</span>
                      </div>
                      <h3 className="type-h3 mt-4">{e.title}</h3>
                      <p className="mono mt-3 text-xs font-bold tracking-wide">{formatEventDate(e)}</p>
                      {e.venue && (
                        <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 shrink-0" /> {e.venue}
                        </p>
                      )}
                      {e.description && (
                        <p className="type-body mt-4 text-sm leading-[1.9]">{e.description}</p>
                      )}
                      {e.link && (
                        <a
                          href={e.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-base btn-secondary mt-5 px-5 py-2 text-xs"
                        >
                          자세히 보기 <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </li>
                  </Reveal>
                ))}
              </ul>
            </section>
          ))
        )}

        <p className="type-caption mt-20 text-[0.62rem] text-muted-foreground">
          지난 일정은 자동으로 목록에서 사라집니다. 일정 정보는 변경될 수 있으니 예매·신청 전 링크에서 최신 정보를 확인하세요.
        </p>
      </main>

      <SiteFooter />
    </div>
  );
}
