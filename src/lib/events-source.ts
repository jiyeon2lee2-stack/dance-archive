// 공연·워크샵 일정 데이터 소스 레이어
// events 테이블에서 조회하며, 종료일(없으면 시작일)이 지난 일정은
// 목록에서 자동으로 제외됩니다 → 갱신을 못 해도 사이트가 방치돼 보이지 않습니다.

import { supabase } from "./supabase";

export type EventKind = "performance" | "workshop";
export type EventRegion = "domestic" | "abroad";

export type DanceEvent = {
  id: number;
  title: string;
  kind: EventKind;
  region: EventRegion;
  country: string;
  start: string; // YYYY-MM-DD
  end: string | null;
  venue: string;
  description: string;
  link?: string;
};

type EventRow = {
  id: number;
  title: string;
  kind: EventKind;
  region: EventRegion;
  country: string;
  start_date: string;
  end_date: string | null;
  venue: string;
  description: string;
  link_url: string | null;
};

function rowToEvent(row: EventRow): DanceEvent {
  return {
    id: row.id,
    title: row.title,
    kind: row.kind,
    region: row.region,
    country: row.country,
    start: row.start_date,
    end: row.end_date,
    venue: row.venue,
    description: row.description,
    ...(row.link_url ? { link: row.link_url } : {}),
  };
}

// 오늘(현지 자정 기준) 이후에 끝나는 일정만
export async function fetchUpcomingEvents(): Promise<DanceEvent[]> {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("id,title,kind,region,country,start_date,end_date,venue,description,link_url")
      .order("start_date", { ascending: true });
    if (error || !data) {
      if (error) console.error("[events] DB 조회 실패:", error.message);
      return [];
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return (data as EventRow[])
      .map(rowToEvent)
      .filter((e) => new Date(`${e.end ?? e.start}T23:59:59`) >= today);
  } catch (e) {
    console.error("[events] DB 연결 오류:", e);
    return [];
  }
}

export const kindLabel: Record<EventKind, string> = {
  performance: "공연",
  workshop: "워크샵",
};

export const regionLabel: Record<EventRegion, string> = {
  domestic: "국내",
  abroad: "해외",
};

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;

// "2026.09.12(토)" / 기간이면 "2026.09.12(토) – 09.14(월)"
export function formatEventDate(e: DanceEvent): string {
  const fmt = (iso: string, withYear: boolean) => {
    const d = new Date(`${iso}T00:00:00`);
    const base = `${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}(${WEEKDAYS[d.getDay()]})`;
    return withYear ? `${d.getFullYear()}.${base}` : base;
  };
  if (!e.end || e.end === e.start) return fmt(e.start, true);
  const sameYear = e.start.slice(0, 4) === e.end.slice(0, 4);
  return `${fmt(e.start, true)} – ${fmt(e.end, !sameYear)}`;
}

// "2026년 9월" 형태의 월별 묶음 키
export function monthKey(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월`;
}
