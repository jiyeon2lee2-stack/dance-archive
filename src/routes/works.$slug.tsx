import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { getWork } from "@/lib/archive-data";

export const Route = createFileRoute("/works/$slug")({
  loader: ({ params }) => {
    const work = getWork(params.slug);
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

const seedComments = [
  { name: "지민", time: "2일 전", body: "무대 위 반복의 의미를 이렇게 정리해주셔서 감사합니다. 다시 보고 싶어졌어요." },
  { name: "H.Park", time: "5일 전", body: "안무의 구조 분석이 특히 좋았습니다. 음악과의 관계도 더 듣고 싶네요." },
];

function WorkDetail() {
  const { work } = Route.useLoaderData();
  const [comment, setComment] = useState("");

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

          {/* 댓글 */}
          <section className="mt-20">
            <div className="rule" />
            <h2 className="type-h2 mt-10">댓글</h2>

            <div className="mt-8">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                placeholder="이 작품에 대한 생각을 남겨보세요"
                className="field resize-none"
              />
              <div className="mt-4 flex justify-end">
                <button type="button" className="btn-base btn-primary">
                  댓글 남기기
                </button>
              </div>
            </div>

            <ul className="mt-12 flex flex-col">
              {seedComments.map((c) => (
                <li key={c.name} className="border-t border-border py-7">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
                    <span className="truncate text-sm text-foreground">{c.name}</span>
                    <span className="type-caption shrink-0 text-[0.6rem]">{c.time}</span>
                  </div>
                  <p className="type-body mt-3 text-sm">{c.body}</p>
                </li>
              ))}
            </ul>
          </section>
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
