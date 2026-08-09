import { createFileRoute } from "@tanstack/react-router";
import { Search, Mail } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageHeader } from "@/components/site/PageHeader";
import { EmptyState } from "@/components/site/EmptyState";
import { InfoCard } from "@/components/site/InfoCard";
import { WorkCard } from "@/components/site/WorkCard";
import { works, koreaAdmissionItems } from "@/lib/archive-data";

export const Route = createFileRoute("/styleguide")({
  head: () => ({
    meta: [
      { title: "스타일 가이드 | 현대무용 아카이브" },
      { name: "description", content: "현대무용 아카이브의 색상, 타이포그래피, 컴포넌트 레퍼런스." },
      { property: "og:title", content: "스타일 가이드 | 현대무용 아카이브" },
      { property: "og:description", content: "디자인 시스템 레퍼런스 페이지." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: StyleGuide,
});

const palette = [
  { name: "Background (Beige)", hex: "#EFE7D8", varName: "--background" },
  { name: "Surface", hex: "#E6DCC9", varName: "--surface" },
  { name: "Surface 2", hex: "#DCD0B8", varName: "--surface-2" },
  { name: "Foreground (Ink)", hex: "#141210", varName: "--foreground" },
  { name: "Muted Foreground", hex: "#5C574E", varName: "--muted-foreground" },
  { name: "Santorini Blue", hex: "#2E64C8", varName: "--santorini" },
  { name: "Primary", hex: "#0057B8", varName: "--primary" },
  { name: "Invert (Ink)", hex: "#141210", varName: "--beige" },
  { name: "Naver Green", hex: "#03C75A", varName: "--naver" },
  { name: "Kakao Yellow", hex: "#FEE500", varName: "--kakao" },
];

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border py-14">
      <p className="eyebrow">{title}</p>
      <div className="mt-8">{children}</div>
    </section>
  );
}

function StyleGuide() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <PageHeader title="스타일 가이드" />

      <main className="mx-auto w-full max-w-[1100px] flex-1 px-6 py-16 md:py-20">
        <h1 className="type-h1">디자인 시스템</h1>
        <p aria-hidden className="stroke-word stroke-word-accent mt-3 text-[3rem] whitespace-nowrap md:text-[7rem]">
          STYLE GUIDE
        </p>
        <p className="type-body mt-4 max-w-xl text-sm">
          현대무용 아카이브의 모든 페이지가 따르는 색상, 타이포그래피, 컴포넌트 규칙입니다.
        </p>

        <Block title="Color">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {palette.map((c) => (
              <div key={c.name}>
                <div
                  className="h-24 w-full border border-border"
                  style={{ backgroundColor: `var(${c.varName})` }}
                />
                <p className="mt-3 text-sm font-bold">{c.name}</p>
                <p className="type-caption mt-1 text-[0.6rem]">{c.hex}</p>
              </div>
            ))}
          </div>
        </Block>

        <Block title="Typography">
          <div className="flex flex-col gap-8">
            <div>
              <p className="type-caption text-[0.6rem]">Display · Pretendard Black / Mono mix</p>
              <p className="type-display mt-2">현대무용</p>
            </div>
            <div>
              <p className="type-caption text-[0.6rem]">Stroke word (graphic element)</p>
              <p aria-hidden className="stroke-word stroke-word-accent mt-2 text-[3rem] md:text-[6rem]">
                ARCHIVE
              </p>
            </div>
            <div>
              <p className="type-caption text-[0.6rem]">H1</p>
              <p className="type-h1 mt-2">작품 분석</p>
            </div>
            <div>
              <p className="type-caption text-[0.6rem]">H2</p>
              <p className="type-h2 mt-2">추천 작품</p>
            </div>
            <div>
              <p className="type-caption text-[0.6rem]">H3</p>
              <p className="type-h3 mt-2">한국 입시 요강</p>
            </div>
            <div>
              <p className="type-caption text-[0.6rem]">Body · Pretendard / Noto Sans KR · Mono captions</p>
              <p className="type-body mt-2 max-w-xl">
                세계의 위대한 현대 무용 작품들을 만나세요. 시대를 바꾼 안무와 그 안에 담긴 사유를
                깊이 있는 분석과 함께 아카이브합니다.
              </p>
            </div>
            <div>
              <p className="type-caption text-[0.6rem]">Caption</p>
              <p className="type-caption mt-2">United States · 1960</p>
            </div>
          </div>
        </Block>

        <Block title="Inverted block">
          <div className="invert-block p-8">
            <p className="text-xs font-extrabold tracking-[0.24em] uppercase">Experience</p>
            <p className="type-h2 mt-3">무엇을 경험할 수 있나요?</p>
          </div>
        </Block>

        <Block title="Stickers">
          <div className="flex flex-wrap items-center gap-3">
            <span className="sticker sticker-accent">1960</span>
            <span className="sticker">United States</span>
            <span className="sticker">실기 100%</span>
            <span className="sticker sticker-accent">오디션</span>
          </div>
        </Block>

        <Block title="Buttons">
          <div className="flex flex-wrap items-center gap-4">
            <button className="btn-base btn-primary">
              Primary <span aria-hidden>→</span>
            </button>
            <button className="btn-base btn-secondary">
              Secondary <span aria-hidden>↗</span>
            </button>
            <button className="btn-base btn-ghost">Ghost</button>
            <a className="link-marker text-sm" href="#">
              분석 읽기 <span aria-hidden>→</span>
            </a>
            <a className="link-arrow" href="#">
              더 보기 <span aria-hidden>→</span>
            </a>
          </div>
          <div className="mt-6 flex flex-wrap gap-4">
            <button
              className="btn-base text-white"
              style={{ backgroundColor: "var(--naver)" }}
            >
              Naver로 로그인
            </button>
            <button
              className="btn-base"
              style={{ backgroundColor: "var(--kakao)", color: "var(--kakao-foreground)" }}
            >
              Kakao로 로그인
            </button>
          </div>
        </Block>

        <Block title="Form controls">
          <div className="grid max-w-xl gap-6 sm:grid-cols-2">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input className="field pl-9" placeholder="작품 검색..." />
            </div>
            <select className="field appearance-none">
              <option>모든 국가</option>
              <option>United States</option>
            </select>
            <textarea className="field resize-none sm:col-span-2" rows={3} placeholder="댓글 작성" />
            <button className="btn-base btn-secondary sm:col-span-2">
              <Mail className="h-4 w-4" /> 이메일로 로그인
            </button>
          </div>
        </Block>

        <Block title="Work card">
          <div className="grid gap-8 sm:grid-cols-2">
            <WorkCard work={works[0]!} ratio="aspect-[4/3]" />
            <WorkCard work={works[1]!} ratio="aspect-[4/3]" />
          </div>
        </Block>

        <Block title="Info card">
          <InfoCard item={koreaAdmissionItems[0]!} />
        </Block>

        <Block title="Empty state">
          <EmptyState
            title="유학 정보가 없습니다"
            description="새로운 정보가 준비되는 대로 이곳에 공개됩니다."
            action={
              <button className="btn-base btn-secondary">
                다른 정보 보기 <span aria-hidden>→</span>
              </button>
            }
          />
        </Block>
      </main>

      <SiteFooter />
    </div>
  );
}
