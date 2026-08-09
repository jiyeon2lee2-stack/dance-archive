// 작품 데이터 소스 레이어
// 1순위: Supabase DB에서 조회
// 2순위(폴백): DB 연결 실패/데이터 없음 시 내장 데이터(archive-data.ts) 사용
// → DB에 문제가 생겨도 사이트는 절대 비어 보이지 않습니다.

import { supabase } from "./supabase";
import { works as localWorks, getWork as getLocalWork, type Work } from "./archive-data";

// DB의 행(row) 형태
type WorkRow = {
  slug: string;
  title: string;
  choreographer: string;
  country: string;
  year: number;
  image_url: string | null;
  summary: string;
  analysis: string[] | null;
};

// slug → 프로젝트에 내장된 이미지 매핑 (DB의 image_url이 비어있을 때 사용)
const localImageBySlug: Record<string, string> = Object.fromEntries(
  localWorks.map((w) => [w.slug, w.image]),
);
const defaultImage = localWorks[0]?.image ?? "";

function rowToWork(row: WorkRow): Work {
  return {
    slug: row.slug,
    title: row.title,
    choreographer: row.choreographer,
    country: row.country,
    year: row.year,
    image: row.image_url || localImageBySlug[row.slug] || defaultImage,
    summary: row.summary,
    analysis: Array.isArray(row.analysis) ? row.analysis : [],
  };
}

export async function fetchWorks(): Promise<Work[]> {
  try {
    const { data, error } = await supabase
      .from("works")
      .select("slug,title,choreographer,country,year,image_url,summary,analysis")
      .order("display_order", { ascending: true })
      .order("year", { ascending: true });

    if (error || !data || data.length === 0) {
      if (error) console.error("[works] DB 조회 실패, 내장 데이터 사용:", error.message);
      return localWorks;
    }
    return (data as WorkRow[]).map(rowToWork);
  } catch (e) {
    console.error("[works] DB 연결 오류, 내장 데이터 사용:", e);
    return localWorks;
  }
}

export async function fetchWork(slug: string): Promise<Work | undefined> {
  try {
    const { data, error } = await supabase
      .from("works")
      .select("slug,title,choreographer,country,year,image_url,summary,analysis")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !data) {
      if (error) console.error("[work] DB 조회 실패, 내장 데이터 사용:", error.message);
      return getLocalWork(slug);
    }
    return rowToWork(data as WorkRow);
  } catch (e) {
    console.error("[work] DB 연결 오류, 내장 데이터 사용:", e);
    return getLocalWork(slug);
  }
}

// 필터 옵션(국가/연도/안무가)을 작품 목록으로부터 계산
export function buildFilterOptions(list: Work[]) {
  return {
    countries: ["모든 국가", ...Array.from(new Set(list.map((w) => w.country)))],
    years: ["모든 연도", ...Array.from(new Set(list.map((w) => String(w.year))))],
    choreographers: ["모든 안무가", ...Array.from(new Set(list.map((w) => w.choreographer)))],
  };
}
