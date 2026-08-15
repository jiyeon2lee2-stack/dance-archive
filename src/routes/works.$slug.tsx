import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Lock } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { fetchWork } from "@/lib/works-source";
import { useAuth } from "@/lib/use-auth";
import { FREE_VIEW_LIMIT, freeViewsLeft, registerFreeView } from "@/lib/free-views";
import { rememberReturnPath } from "@/lib/after-login";

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
  const { user, loading: authLoading } = useAuth();

  // "pending" = 아직 로그인 여부 확인 중 / "open" = 열람 가능 / "locked" = 무료 횟수 소진
  const [gate, setGate] = useState<"pending" | "open" | "locked">("pending");
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    if (authLoading) return; // 로그인 확인이 끝날 때까지 판단 보류
    if (user) {
      setGate("open"); // 회원은 언제나 전체 열람
      setLeft(null);
      return;
    }
    const allowed = registerFreeView(work.slug);
    setGate(allowed ? "open" : "locked");
    setLeft(freeViewsLeft());
  }, [authLoading, user, work.slug]);

  const paragraphs: string[] = work.analysis ?? [];
  // 확인 중이거나 잠긴 상태에서는 본문을 접어서 보여줍니다.
  // (본문은 HTML에 그대로 있으므로 검색엔진 노출에는 영향이 없습니다.)
  const clamped = gate !== "open" && paragraphs.length > 0;

  // 본문 길이에 맞춰 접히는 높이를 정합니다. 분석이 짧은 작품까지 고정 높이로 자르면
  // 사실상 전부 보이거나, 반대로 한 줄만 보이는 일이 생기기 때문입니다.
  const bodyRef = useRef<HTMLDivElement>(null);
  const [clampPx, setClampPx] = useState<number | null>(null);
  useEffect(() => {
    if (!clamped) {
      setClampPx(null);
      return;
    }
    const el = bodyRef.current;
    if (!el) return;
    const full = el.scrollHeight;
    // 본문이 아주 짧으면 접지 않습니다.
    setClampPx(full > 240 ? Math.min(320, Math.max(160, Math.round(full * 0.45))) : null);
  }, [clamped, work.slug]);

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

          <div
            ref={bodyRef}
            className={clamped ? "relative overflow-hidden" : ""}
            style={clamped ? { maxHeight: clampPx ?? 320 } : undefined}
          >
            <div className="mt-10 flex flex-col gap-7">
              {paragraphs.map((p: string, i: number) => (
                <Reveal key={i} delay={i * 60}>
                  <p className="type-body text-[1.0625rem] leading-[2]">{p}</p>
                </Reveal>
              ))}
            </div>
            {clamped && clampPx !== null && (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-background to-transparent"
              />
            )}
          </div>

          {/* 무료 열람을 모두 사용한 비회원 안내 */}
          {gate === "locked" && (
            <div className="grain-panel mt-8 p-7 text-center md:p-10">
              <Lock className="mx-auto h-8 w-8 text-primary" />
              <h2 className="type-h3 mt-5">이어서 읽으려면 로그인해주세요</h2>
              <p className="type-body mx-auto mt-4 max-w-sm text-sm">
                로그인 없이 볼 수 있는 작품 분석 {FREE_VIEW_LIMIT}편을 모두 보셨습니다. 로그인하시면
                모든 작품 분석을 제한 없이 읽으실 수 있습니다.
              </p>
              <div className="mt-8">
                <Link
                  to="/login"
                  onClick={() => rememberReturnPath(`/works/${work.slug}`)}
                  className="btn-base btn-primary px-7"
                >
                  로그인하고 이어서 읽기
                </Link>
              </div>
              <p className="type-body mt-5 text-xs text-muted-foreground">
                구글·카카오 계정으로 바로 로그인할 수 있습니다.
                <br />
                입시·유학 정보는 로그인 없이도 모두 보실 수 있습니다.
              </p>
            </div>
          )}

          {/* 아직 여유가 있는 비회원에게 남은 편수 안내 */}
          {gate === "open" && !user && left !== null && left < FREE_VIEW_LIMIT && (
            <p className="mt-12 border-t border-border pt-6 text-center text-xs text-muted-foreground">
              {left > 0 ? (
                <>
                  로그인 없이 <span className="font-bold text-foreground">{left}편</span>을 더 보실 수
                  있습니다.{" "}
                </>
              ) : (
                <>무료로 볼 수 있는 마지막 작품입니다. </>
              )}
              <Link
                to="/login"
                onClick={() => rememberReturnPath(`/works/${work.slug}`)}
                className="underline underline-offset-4 hover:text-primary"
              >
                로그인하면 제한 없이 볼 수 있습니다
              </Link>
            </p>
          )}

          {/* 공연 영상 (유튜브 공식 삽입) */}
          {gate !== "locked" && youtubeId(work.youtube) && (
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
