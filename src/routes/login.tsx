import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Check, LogOut } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { supabase } from "@/lib/supabase";
import { useAuth, displayName } from "@/lib/use-auth";

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

const benefits = ["작품 분석 콘텐츠 열람", "입시 및 유학 정보 열람"];

function friendlyError(message: string): string {
  if (/provider is not enabled|Unsupported provider/i.test(message))
    return "아직 준비 중인 로그인 방식입니다. 다른 방법을 이용해주세요.";
  if (/rate limit/i.test(message)) return "요청이 너무 잦습니다. 잠시 후 다시 시도해주세요.";
  if (/invalid.*email/i.test(message)) return "이메일 주소 형식을 확인해주세요.";
  return "로그인 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
}

function LoginPage() {
  const { user, loading, signOut } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [emailOpen, setEmailOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [emailState, setEmailState] = useState<"idle" | "sending" | "sent">("idle");

  const oauth = async (provider: "google" | "kakao") => {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin },
    });
    if (error) setError(friendlyError(error.message));
  };

  const sendMagicLink = async () => {
    const target = email.trim();
    if (!target) return;
    setError(null);
    setEmailState("sending");
    const { error } = await supabase.auth.signInWithOtp({
      email: target,
      options: { emailRedirectTo: window.location.origin },
    });
    if (error) {
      setError(friendlyError(error.message));
      setEmailState("idle");
    } else {
      setEmailState("sent");
    }
  };

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
              <p className="type-body mt-3 text-sm">
                {user ? "이미 로그인되어 있습니다" : "소셜 계정으로 로그인하세요"}
              </p>
            </div>

            {user ? (
              <div className="grain-panel mt-10 p-7 text-center md:p-8">
                <p className="type-h3">{displayName(user)} 님</p>
                {user.email && (
                  <p className="type-body mt-2 text-sm text-muted-foreground">{user.email}</p>
                )}
                <button
                  type="button"
                  onClick={() => void signOut()}
                  className="btn-base btn-secondary mt-6 w-full"
                >
                  <LogOut className="h-4 w-4" /> 로그아웃
                </button>
              </div>
            ) : (
              <div className="grain-panel mt-10 p-7 md:p-8">
                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => void oauth("google")}
                    className="btn-base w-full text-white hover:opacity-90"
                    style={{ backgroundColor: "var(--santorini)" }}
                  >
                    <span aria-hidden className="font-black">G</span> Google로 로그인
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => void oauth("kakao")}
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

                {!emailOpen ? (
                  <button
                    type="button"
                    onClick={() => setEmailOpen(true)}
                    className="btn-base btn-secondary w-full"
                  >
                    <Mail className="h-4 w-4" /> 이메일로 로그인
                  </button>
                ) : emailState === "sent" ? (
                  <div className="border border-primary/40 bg-primary/5 p-5 text-center">
                    <p className="text-sm font-bold">메일함을 확인해주세요</p>
                    <p className="type-body mt-2 text-xs text-muted-foreground">
                      {email} 로 로그인 링크를 보냈습니다.
                      <br />
                      메일의 링크를 누르면 로그인됩니다.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && void sendMagicLink()}
                      placeholder="이메일 주소"
                      autoFocus
                      className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                    />
                    <button
                      type="button"
                      disabled={emailState === "sending" || !email.trim()}
                      onClick={() => void sendMagicLink()}
                      className="btn-base btn-primary w-full disabled:opacity-50"
                    >
                      <Mail className="h-4 w-4" />
                      {emailState === "sending" ? "보내는 중..." : "로그인 링크 보내기"}
                    </button>
                  </div>
                )}

                {error && (
                  <p className="mt-5 border border-destructive/40 bg-destructive/5 p-3 text-center text-xs text-destructive">
                    {error}
                  </p>
                )}
              </div>
            )}

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
