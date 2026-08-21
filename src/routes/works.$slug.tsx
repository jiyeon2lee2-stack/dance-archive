import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { fetchWork } from "@/lib/works-source";

// 유튜브 주소에서 영상 ID(11자리)를 추출합니다.
// 지원 형식: watch?v=..., youtu.be/..., shorts/..., embed/..., ID만 입력
function youtubeId(url: string | undefined): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (/^[\w-]{11}$/.test(trimmed)) return trimmed;
  const m = trimmed.match(
    /(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/,
  );
  return m?.[1] ?? null;
}

export const Route = createFileRoute("/works/$slug")({
  loader: async ({ params }) => {
    const work = await fetchWork(params.slug);
    if (!work) throw notFound();
    return { work };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "작품을 찾을 수 없습니다 | 현대 무용 아카이브" }, { name: "robots", content: "noindex" }],
      };
    }
    const { work } = loaderData;
    const desc = `${work.choreographer}의 ${work.title} (${work.country} · ${work.year}) 작품 분석.`;
    return {
      meta: [
        { title: `${work.title} 작품 분석 | 현대 무용 아카이브` },
        { name: "description", content: desc },
        { property: "og:title", content: `${work.title} 작품 분석` },
        { property: "og:description", content: desc },
      ],
    };
  },
  component: WorkDetail,
  notFoundComponent: WorkNotFound,
});

function WorkDetail() {
  const { work } = Route.useLoaderData();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <PageHeader title="작품 분석" backTo="/works" />

      <main className="flex-1">
        <div className="relative isolate">
          <img
            src={work.image}
            alt={`${work.title} 공연 이미지`}
            className="h-[42vh] w-full object-cover opacity-35 grayscale md:h-[62vh]"
          />
          <div className="absolute inset-0 bg-linear-to-t from-background via-background/50 to-transparent" />
        </div>

        <article className="mx-auto -mt-24 max-w-[760px] px-6 pb-24 md:-mt-32 md:pb-32">
          <Reveal>
            <p className="eyebrow">Analysis</p>
            <h1 className="type-h1 mt-5">{work.title}</h1>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="sticker sticker-accent">{work.year}</span>
              <span className="sticker">{work.country}</span>
              <span className="sticker">{work.choreographer}</span>
            </div>
            <div className="rule mt-8" />
          </Reveal>

          <div className="mt-10 flex flex-col gap-7">
            {work.analysis.map((p: string, i: number) => (
              <Reveal key={i} delay={i * 60}>
                <p className="type-body text-[1.0625rem] leading-[2]">{p}</p>
              </Reveal>
            ))}
          </div>

          {/* 공연 영상 (유튜브 공식 삽입) */}
          {youtubeId(work.youtube) && (
            <Reveal>
              <section className="mt-20">
                <div className="rule" />
                <p className="eyebrow mt-10">Video</p>
                <div className="mt-6 aspect-video w-full overflow-hidden bg-foreground/5">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${youtubeId(work.youtube)}`}
                    title={`${work.title} 공연 영상`}
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

        </article>
      </main>

      <SiteFooter />
    </div>
  );
}

function WorkNotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <PageHeader title="작품 분석" backTo="/works" />
      <main className="mx-auto w-full max-w-[900px] flex-1 px-6 py-28 text-center">
        <h1 className="type-h1">작품을 찾을 수 없습니다</h1>
        <p className="type-body mt-4 text-sm">요청하신 작품이 아카이브에 없습니다.</p>
        <div className="mt-8">
          <Link to="/works" className="btn-base btn-secondary">
            작품 탐색으로
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
