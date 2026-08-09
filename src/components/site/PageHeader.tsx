import { Link } from "@tanstack/react-router";

export function PageHeader({ title, backTo = "/" }: { title: string; backTo?: string }) {
  return (
    <div className="border-b border-border">
      <div className="mx-auto grid max-w-[1400px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-6 py-4 md:grid-cols-3 md:px-10">
        <Link to={backTo} className="link-marker min-w-0 text-sm">
          <span aria-hidden>←</span>
          <span className="truncate">돌아가기</span>
        </Link>
        <p className="type-caption hidden text-center text-[0.7rem] text-foreground md:block">
          {title}
        </p>
        <span className="hidden md:block" />
      </div>
    </div>
  );
}
