import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="overflow-hidden border-t border-border">
      <div className="mx-auto max-w-[1400px] px-6 py-14 md:px-10">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_auto]">
          <div className="min-w-0">
            <p className="type-h2">현대무용 아카이브</p>
            <p className="type-body mt-3 max-w-md text-sm">
              세계의 위대한 현대 무용 작품들을 만나세요
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-8 gap-y-3 md:justify-end">
            <Link to="/works" className="link-marker text-sm">
              작품 탐색
            </Link>
            <Link to="/admissions" className="link-marker text-sm">
              한국 입시 요강
            </Link>
            <Link to="/study-abroad" className="link-marker text-sm">
              해외 유학 정보
            </Link>
          </nav>
        </div>

        <p
          aria-hidden
          className="stroke-word stroke-word-accent mt-12 text-[3.2rem] whitespace-nowrap md:text-[8rem]"
        >
          ARCHIVE 2026
        </p>

        <div className="rule mt-8" />
        <p className="type-caption mt-6 text-[0.62rem]">
          © 2026 현대무용 아카이브 · 모든 권리 보유
        </p>
      </div>
    </footer>
  );
}
