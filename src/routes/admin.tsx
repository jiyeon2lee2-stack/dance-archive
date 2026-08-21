import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, ShieldAlert } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PageHeader } from "@/components/site/PageHeader";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/use-auth";
import { useIsAdmin } from "@/lib/use-admin";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "관리자 | 현대 무용 아카이브" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

/* ---------- 공용 UI 조각 ---------- */

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="type-caption block text-[0.7rem]">{label}</span>
      {hint && <span className="block text-[0.68rem] text-muted-foreground">{hint}</span>}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

const inputCls =
  "w-full border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary";

/* ---------- 작품 관리 ---------- */

type WorkRow = {
  id: number;
  slug: string;
  title: string;
  choreographer: string;
  country: string;
  year: number;
  image_url: string | null;
  youtube_url: string | null;
  summary: string;
  analysis: string[];
  display_order: number;
};

const emptyWork = {
  slug: "",
  title: "",
  choreographer: "",
  country: "",
  year: new Date().getFullYear(),
  image_url: "",
  youtube_url: "",
  summary: "",
  analysisText: "",
  display_order: 100,
};

function WorksAdmin() {
  const [rows, setRows] = useState<WorkRow[]>([]);
  const [form, setForm] = useState<typeof emptyWork & { id?: number }>(emptyWork);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const load = async () => {
    const { data, error } = await supabase
      .from("works")
      .select("id,slug,title,choreographer,country,year,image_url,youtube_url,summary,analysis,display_order")
      .order("display_order");
    if (!error && data) setRows(data as WorkRow[]);
  };
  useEffect(() => {
    void load();
  }, []);

  const startNew = () => {
    setForm(emptyWork);
    setOpen(true);
    setMsg(null);
  };
  const startEdit = (r: WorkRow) => {
    setForm({
      id: r.id,
      slug: r.slug,
      title: r.title,
      choreographer: r.choreographer,
      country: r.country,
      year: r.year,
      image_url: r.image_url ?? "",
      youtube_url: r.youtube_url ?? "",
      summary: r.summary,
      analysisText: (r.analysis ?? []).join("\n\n"),
      display_order: r.display_order,
    });
    setOpen(true);
    setMsg(null);
  };

  const save = async () => {
    if (!form.slug.trim() || !form.title.trim()) {
      setMsg("slug와 제목은 필수입니다.");
      return;
    }
    setBusy(true);
    setMsg(null);
    const payload = {
      slug: form.slug.trim(),
      title: form.title.trim(),
      choreographer: form.choreographer.trim(),
      country: form.country.trim(),
      year: Number(form.year) || 0,
      image_url: form.image_url.trim() || null,
      youtube_url: form.youtube_url.trim() || null,
      summary: form.summary.trim(),
      analysis: form.analysisText
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean),
      display_order: Number(form.display_order) || 100,
    };
    const q = form.id
      ? supabase.from("works").update(payload).eq("id", form.id)
      : supabase.from("works").insert(payload);
    const { error } = await q;
    setBusy(false);
    if (error) {
      setMsg(`저장 실패: ${error.message}`);
    } else {
      setOpen(false);
      void load();
    }
  };

  const remove = async (r: WorkRow) => {
    if (!confirm(`정말 삭제할까요?\n"${r.title}"`)) return;
    const { error } = await supabase.from("works").delete().eq("id", r.id);
    if (error) alert(`삭제 실패: ${error.message}`);
    else void load();
  };

  return (
    <section>
      <div className="flex items-center justify-between gap-4">
        <h2 className="type-h3">작품 목록 ({rows.length})</h2>
        <button type="button" onClick={startNew} className="btn-base btn-primary px-4 py-2 text-xs">
          <Plus className="h-4 w-4" /> 새 작품
        </button>
      </div>

      <div className="mt-6 flex flex-col divide-y divide-border border border-border">
        {rows.map((r) => (
          <div key={r.id} className="flex items-center gap-3 px-4 py-3">
            <span className="sticker shrink-0">{r.display_order}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">{r.title}</p>
              <p className="truncate text-xs text-muted-foreground">
                {r.choreographer} · {r.country} · {r.year} · /works/{r.slug}
              </p>
            </div>
            <button type="button" onClick={() => startEdit(r)} className="btn-ghost" aria-label="수정">
              <Pencil className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => void remove(r)} className="btn-ghost text-destructive" aria-label="삭제">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {rows.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">작품이 없습니다.</p>
        )}
      </div>

      {open && (
        <div className="grain-panel mt-8 p-6 md:p-8">
          <div className="flex items-center justify-between">
            <h3 className="type-h3">{form.id ? "작품 수정" : "새 작품"}</h3>
            <button type="button" onClick={() => setOpen(false)} className="btn-ghost" aria-label="닫기">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Field label="제목">
              <input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </Field>
            <Field label="slug (영문 주소)" hint="예: falling-angels → /works/falling-angels">
              <input className={inputCls} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            </Field>
            <Field label="안무가">
              <input className={inputCls} value={form.choreographer} onChange={(e) => setForm({ ...form, choreographer: e.target.value })} />
            </Field>
            <Field label="국가">
              <input className={inputCls} value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
            </Field>
            <Field label="연도">
              <input type="number" className={inputCls} value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} />
            </Field>
            <Field label="표시 순서" hint="낮을수록 먼저 표시">
              <input type="number" className={inputCls} value={form.display_order} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })} />
            </Field>
          </div>
          <div className="mt-4 grid gap-4">
            <Field label="이미지 URL" hint="비워두면 기본 이미지 사용. 외부 이미지 주소(https://...)를 붙여넣으세요.">
              <input className={inputCls} value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
            </Field>
            <Field label="유튜브 영상 주소" hint="공식 채널 영상만 사용하세요. 주소를 그대로 붙여넣으면 상세 페이지에 영상이 표시됩니다. 비워두면 영상 없이 표시됩니다.">
              <input className={inputCls} value={form.youtube_url} onChange={(e) => setForm({ ...form, youtube_url: e.target.value })} placeholder="https://www.youtube.com/watch?v=..." />
            </Field>
            <Field label="요약" hint="목록 카드에 표시되는 한두 문장">
              <textarea className={inputCls} rows={2} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
            </Field>
            <Field label="분석 본문" hint="문단 사이를 빈 줄로 구분하세요. 각 문단이 상세 페이지의 한 단락이 됩니다.">
              <textarea className={inputCls} rows={10} value={form.analysisText} onChange={(e) => setForm({ ...form, analysisText: e.target.value })} />
            </Field>
          </div>

          {msg && <p className="mt-4 text-sm text-destructive">{msg}</p>}

          <div className="mt-6 flex gap-3">
            <button type="button" disabled={busy} onClick={() => void save()} className="btn-base btn-primary px-6 disabled:opacity-50">
              {busy ? "저장 중..." : "저장"}
            </button>
            <button type="button" onClick={() => setOpen(false)} className="btn-base btn-secondary px-6">
              취소
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

/* ---------- 회원 관리 ---------- */

type MemberRow = {
  id: string;
  email: string;
  display_name: string;
  provider: string;
  created_at: string;
  last_sign_in_at: string | null;
  is_admin: boolean;
};

const providerLabel: Record<string, string> = {
  email: "이메일",
  kakao: "카카오",
  google: "구글",
};

function fmtDate(iso: string | null): string {
  if (!iso) return "-";
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

function MembersAdmin() {
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [query, setQuery] = useState("");

  useEffect(() => {
    supabase.rpc("admin_list_users").then(({ data, error }) => {
      if (error) {
        console.error("[members] 조회 실패:", error.message);
        setState("error");
        return;
      }
      setMembers((data as MemberRow[]) ?? []);
      setState("ready");
    });
  }, []);

  const q = query.trim().toLowerCase();
  const filtered = q
    ? members.filter(
        (m) =>
          m.email.toLowerCase().includes(q) ||
          m.display_name.toLowerCase().includes(q),
      )
    : members;

  if (state === "loading")
    return <p className="type-body text-sm text-muted-foreground">회원 목록을 불러오는 중...</p>;
  if (state === "error")
    return (
      <p className="type-body text-sm text-destructive">
        회원 목록을 불러오지 못했습니다. DB에 회원 조회 창구(admin_list_users)가 만들어져 있는지 확인해주세요.
      </p>
    );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="type-caption text-[0.7rem]">
          전체 회원 <span className="text-foreground">{members.length}</span>명
          {q && ` · 검색 결과 ${filtered.length}명`}
        </p>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="이름 또는 이메일로 검색"
          className={`${inputCls} max-w-xs`}
        />
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-foreground/20 text-left">
              <th className="type-caption py-3 pr-4 text-[0.65rem] font-normal">이름</th>
              <th className="type-caption py-3 pr-4 text-[0.65rem] font-normal">이메일</th>
              <th className="type-caption py-3 pr-4 text-[0.65rem] font-normal">로그인 방식</th>
              <th className="type-caption py-3 pr-4 text-[0.65rem] font-normal">가입일</th>
              <th className="type-caption py-3 text-[0.65rem] font-normal">마지막 로그인</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <tr key={m.id} className="border-b border-border">
                <td className="py-3.5 pr-4">
                  <span className="flex items-center gap-2">
                    {m.display_name || <span className="text-muted-foreground">-</span>}
                    {m.is_admin && (
                      <span className="bg-primary px-1.5 py-0.5 text-[0.6rem] text-primary-foreground">
                        관리자
                      </span>
                    )}
                  </span>
                </td>
                <td className="py-3.5 pr-4">{m.email}</td>
                <td className="py-3.5 pr-4">{providerLabel[m.provider] ?? m.provider}</td>
                <td className="py-3.5 pr-4 whitespace-nowrap">{fmtDate(m.created_at)}</td>
                <td className="py-3.5 whitespace-nowrap">{fmtDate(m.last_sign_in_at)}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-muted-foreground">
                  검색 결과가 없습니다
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="type-caption mt-6 text-[0.62rem] text-muted-foreground">
        회원 탈퇴 처리나 관리자 지정은 Supabase 대시보드에서 할 수 있습니다.
      </p>
    </div>
  );
}

/* ---------- 입시/유학 정보 관리 ---------- */

type InfoRow = {
  id: number;
  category: "korea" | "abroad";
  title: string;
  meta: string;
  body: string;
  tags: string[];
  display_order: number;
};

const emptyInfo = {
  category: "korea" as "korea" | "abroad",
  title: "",
  meta: "",
  body: "",
  tagsText: "",
  display_order: 100,
};

function InfoAdmin() {
  const [category, setCategory] = useState<"korea" | "abroad">("korea");
  const [rows, setRows] = useState<InfoRow[]>([]);
  const [form, setForm] = useState<typeof emptyInfo & { id?: number }>(emptyInfo);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const load = async () => {
    const { data, error } = await supabase
      .from("info_items")
      .select("id,category,title,meta,body,tags,display_order")
      .eq("category", category)
      .order("display_order");
    if (!error && data) setRows(data as InfoRow[]);
  };
  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const startNew = () => {
    setForm({ ...emptyInfo, category });
    setOpen(true);
    setMsg(null);
  };
  const startEdit = (r: InfoRow) => {
    setForm({
      id: r.id,
      category: r.category,
      title: r.title,
      meta: r.meta,
      body: r.body,
      tagsText: (r.tags ?? []).join(", "),
      display_order: r.display_order,
    });
    setOpen(true);
    setMsg(null);
  };

  const save = async () => {
    if (!form.title.trim()) {
      setMsg("제목은 필수입니다.");
      return;
    }
    setBusy(true);
    setMsg(null);
    const payload = {
      category: form.category,
      title: form.title.trim(),
      meta: form.meta.trim(),
      body: form.body.trim(),
      tags: form.tagsText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      display_order: Number(form.display_order) || 100,
    };
    const q = form.id
      ? supabase.from("info_items").update(payload).eq("id", form.id)
      : supabase.from("info_items").insert(payload);
    const { error } = await q;
    setBusy(false);
    if (error) {
      setMsg(`저장 실패: ${error.message}`);
    } else {
      setOpen(false);
      void load();
    }
  };

  const remove = async (r: InfoRow) => {
    if (!confirm(`정말 삭제할까요?\n"${r.title}"`)) return;
    const { error } = await supabase.from("info_items").delete().eq("id", r.id);
    if (error) alert(`삭제 실패: ${error.message}`);
    else void load();
  };

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setCategory("korea")}
            className={`btn-base px-4 py-2 text-xs ${category === "korea" ? "btn-primary" : "btn-secondary"}`}
          >
            한국 입시
          </button>
          <button
            type="button"
            onClick={() => setCategory("abroad")}
            className={`btn-base px-4 py-2 text-xs ${category === "abroad" ? "btn-primary" : "btn-secondary"}`}
          >
            해외 유학
          </button>
        </div>
        <button type="button" onClick={startNew} className="btn-base btn-primary px-4 py-2 text-xs">
          <Plus className="h-4 w-4" /> 새 정보
        </button>
      </div>

      <div className="mt-6 flex flex-col divide-y divide-border border border-border">
        {rows.map((r) => (
          <div key={r.id} className="flex items-center gap-3 px-4 py-3">
            <span className="sticker shrink-0">{r.display_order}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">{r.title}</p>
              <p className="truncate text-xs text-muted-foreground">{r.meta}</p>
            </div>
            <button type="button" onClick={() => startEdit(r)} className="btn-ghost" aria-label="수정">
              <Pencil className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => void remove(r)} className="btn-ghost text-destructive" aria-label="삭제">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {rows.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            등록된 정보가 없습니다. "새 정보"로 추가하세요.
          </p>
        )}
      </div>

      {open && (
        <div className="grain-panel mt-8 p-6 md:p-8">
          <div className="flex items-center justify-between">
            <h3 className="type-h3">{form.id ? "정보 수정" : "새 정보"}</h3>
            <button type="button" onClick={() => setOpen(false)} className="btn-ghost" aria-label="닫기">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Field label="분류">
              <select
                className={inputCls}
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as "korea" | "abroad" })}
              >
                <option value="korea">한국 입시</option>
                <option value="abroad">해외 유학</option>
              </select>
            </Field>
            <Field label="표시 순서" hint="낮을수록 먼저 표시">
              <input type="number" className={inputCls} value={form.display_order} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })} />
            </Field>
          </div>
          <div className="mt-4 grid gap-4">
            <Field label="제목" hint="예: 한국예술종합학교 무용원 실기과">
              <input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </Field>
            <Field label="배지" hint="카드 우측 상단 짧은 표시. 예: 서울 · 수시/정시">
              <input className={inputCls} value={form.meta} onChange={(e) => setForm({ ...form, meta: e.target.value })} />
            </Field>
            <Field label="본문">
              <textarea className={inputCls} rows={4} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
            </Field>
            <Field label="태그" hint="쉼표로 구분. 예: 실기 100%, 지정작, 면접">
              <input className={inputCls} value={form.tagsText} onChange={(e) => setForm({ ...form, tagsText: e.target.value })} />
            </Field>
          </div>

          {msg && <p className="mt-4 text-sm text-destructive">{msg}</p>}

          <div className="mt-6 flex gap-3">
            <button type="button" disabled={busy} onClick={() => void save()} className="btn-base btn-primary px-6 disabled:opacity-50">
              {busy ? "저장 중..." : "저장"}
            </button>
            <button type="button" onClick={() => setOpen(false)} className="btn-base btn-secondary px-6">
              취소
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

/* ---------- 페이지 본체 ---------- */

function AdminPage() {
  const { user, loading } = useAuth();
  const { isAdmin, checking } = useIsAdmin(user);
  const [tab, setTab] = useState<"works" | "info" | "members">("works");

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <PageHeader title="관리자" />

      <main className="mx-auto w-full max-w-[1100px] flex-1 px-6 py-16 md:py-20">
        {loading || checking ? (
          <p className="py-20 text-center text-sm text-muted-foreground">확인 중...</p>
        ) : !user || !isAdmin ? (
          <div className="mx-auto max-w-md py-16 text-center">
            <ShieldAlert className="mx-auto h-10 w-10 text-muted-foreground" />
            <h1 className="type-h3 mt-6">접근 권한이 없습니다</h1>
            <p className="type-body mt-3 text-sm">
              이 페이지는 운영자 전용입니다.
              {!user && " 먼저 로그인해주세요."}
            </p>
            <div className="mt-8">
              <Link to={user ? "/" : "/login"} className="btn-base btn-primary">
                {user ? "홈으로" : "로그인하기"}
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="flex gap-2 border-b border-border pb-6">
              <button
                type="button"
                onClick={() => setTab("works")}
                className={`btn-base px-5 py-2 text-xs ${tab === "works" ? "btn-primary" : "btn-secondary"}`}
              >
                작품 관리
              </button>
              <button
                type="button"
                onClick={() => setTab("info")}
                className={`btn-base px-5 py-2 text-xs ${tab === "info" ? "btn-primary" : "btn-secondary"}`}
              >
                입시·유학 정보 관리
              </button>
              <button
                type="button"
                onClick={() => setTab("members")}
                className={`btn-base px-5 py-2 text-xs ${tab === "members" ? "btn-primary" : "btn-secondary"}`}
              >
                회원 관리
              </button>
            </div>
            <div className="mt-8">{tab === "works" ? <WorksAdmin /> : tab === "info" ? <InfoAdmin /> : <MembersAdmin />}</div>
          </>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
