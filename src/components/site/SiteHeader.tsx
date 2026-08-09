import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuth, displayName } from "@/lib/use-auth";

const nav = [
  { to: "/works", label: "작품 탐색" },
  { to: "/admissions", label: "한국 입시" },
  { to: "/study-abroad", label: "해외 유학" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto grid max-w-[1400px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-6 py-4 md:px-10">
        <Link to="/" className="min-w-0">
          <span className="mono block truncate text-[0.72rem] font-bold tracking-[0.12em] md:text-[0.84rem]">
            CONTEMPORARY DANCE ARCHIVE
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="link-marker text-sm"
              activeProps={{ className: "text-primary" }}
            >
              {n.label}
            </Link>
          ))}
          {user ? (
            <span className="flex items-center gap-3">
              <span className="max-w-[9rem] truncate text-xs font-bold">{displayName(user)} 님</span>
              <button
                type="button"
                onClick={() => void signOut()}
                className="btn-base btn-secondary px-4 py-2 text-xs"
              >
                로그아웃
              </button>
            </span>
          ) : (
            <Link to="/login" className="btn-base btn-primary px-5 py-2 text-xs">
              로그인 <span aria-hidden>→</span>
            </Link>
          )}
        </nav>

        <button
          aria-label="메뉴"
          className="btn-ghost md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="link-marker self-start text-base font-bold"
              >
                {n.label}
              </Link>
            ))}
            {user ? (
              <button
                type="button"
                onClick={() => {
                  void signOut();
                  setOpen(false);
                }}
                className="btn-base btn-secondary w-full py-2 text-xs"
              >
                {displayName(user)} 님 · 로그아웃
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="btn-base btn-primary w-full py-2 text-xs"
              >
                로그인 <span aria-hidden>→</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
