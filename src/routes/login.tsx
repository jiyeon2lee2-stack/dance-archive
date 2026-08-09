import { createFileRoute } from "@tanstack/react-router";
import { Mail, Check } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "로그인 | 현대 무용 아카이브" },
      {
        name: "description",
        content: "소셜 계정으로 로그인하고 작품 분석과 입시·유학 정보를 열람하세요.",
      },
      { property: "og:title", content: "로그인 | 현대 무용 아카이브" },
      {
        property: "og:description",
        content: "소셜 계정으로 로그인하고 작품 분석 콘텐츠를 열람하세요.",
      },
    ],
  }),
  component: LoginPage,
});

const benefits = ["작품 분석 콘텐츠 열람", "작품에 댓글 작성", "입시 및 유학 정보 열람"];

function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <PageHeader title="로그인" />

      <main className="flex-1 px-6 py-20 md:py-28">
        <div className="mx-auto w-full max-w-md">
          <Reveal>
            <div className="relative text-center">
              <span aria-hidden className="stroke-word stroke-word-accent pointer-events-none absolute inset-x-0 -top-6 text-[4rem] opacity-40 md:text-[6rem]">LOGIN</span>
              <h1 className="type-h1 relative">로그인</h1>
              <p className="type-body mt-3 text-sm">소셜 계정으로 로그인하세요</p>
            </div>

            <div className="grain-panel mt-10 p-7 md:p-8">
              <div className="flex flex-col gap-3">
                <button type="button" className="btn-base w-full border border-border bg-foreground text-background hover:opacity-90">
                  <span aria-hidden className="font-black">G</span> Google로 로그인
                </button>
                <button
                  type="button"
                  className="btn-base w-full text-white hover:opacity-90"
                  style={{ backgroundColor: "var(--naver)" }}
                >
                  <span aria-hidden className="font-bold">N</span> Naver로 로그인
                </button>
                <button
                  type="button"
                  className="btn-base w-full hover:opacity-90"
                  style={{ backgroundColor: "var(--kakao)", color: "var(--kakao-foreground)" }}
                >
                  <span aria-hidden className="font-bold">K</span> Kakao로 로그인
                </button>
              </div>

              <div className="my-7 flex items-center gap-4">
                <span className="rule" />
                <span className="type-caption shrink-0 text-[0.65rem]">또는</span>
                <span className="rule" />
              </div>

              <button type="button" className="btn-base btn-secondary w-full">
                <Mail className="h-4 w-4" /> 이메일로 로그인
              </button>
            </div>

            <p className="type-body mt-6 text-center text-xs">
              처음 방문하셨나요?
              <br />
              소셜 계정으로 로그인하면 자동으로 계정이 생성됩니다
            </p>

            <div className="mt-10 border border-border p-7">
              <h2 className="type-h3 text-center">로그인하면 이용 가능합니다</h2>
              <ul className="mt-6 flex flex-col gap-3">
                {benefits.map((b) => (
                  <li key={b} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 shrink-0 text-primary" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
