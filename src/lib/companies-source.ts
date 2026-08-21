// 무용단 데이터 소스 레이어
// Supabase의 companies 테이블에서 조회합니다.
// 작품(works)과 달리 내장 폴백 데이터는 없으며,
// DB에 무용단이 없으면 목록 페이지에 빈 상태 안내가 표시됩니다.

import { supabase } from "./supabase";

export type Company = {
  slug: string;
  name: string;
  country: string;
  founded: number | null;
  director: string;
  image?: string;
  summary: string;
  description: string[];
  website?: string;
  youtube?: string;
};

type CompanyRow = {
  slug: string;
  name: string;
  country: string;
  founded_year: number | null;
  director: string;
  image_url: string | null;
  website_url: string | null;
  youtube_url: string | null;
  summary: string;
  description: string[] | null;
};

const SELECT =
  "slug,name,country,founded_year,director,image_url,website_url,youtube_url,summary,description";

function rowToCompany(row: CompanyRow): Company {
  return {
    slug: row.slug,
    name: row.name,
    country: row.country,
    founded: row.founded_year,
    director: row.director,
    summary: row.summary,
    description: Array.isArray(row.description) ? row.description : [],
    ...(row.image_url ? { image: row.image_url } : {}),
    ...(row.website_url ? { website: row.website_url } : {}),
    ...(row.youtube_url ? { youtube: row.youtube_url } : {}),
  };
}

export async function fetchCompanies(): Promise<Company[]> {
  try {
    const { data, error } = await supabase
      .from("companies")
      .select(SELECT)
      .order("display_order", { ascending: true })
      .order("name", { ascending: true });
    if (error || !data) {
      if (error) console.error("[companies] DB 조회 실패:", error.message);
      return [];
    }
    return (data as CompanyRow[]).map(rowToCompany);
  } catch (e) {
    console.error("[companies] DB 연결 오류:", e);
    return [];
  }
}

export async function fetchCompany(slug: string): Promise<Company | undefined> {
  try {
    const { data, error } = await supabase
      .from("companies")
      .select(SELECT)
      .eq("slug", slug)
      .maybeSingle();
    if (error || !data) {
      if (error) console.error("[company] DB 조회 실패:", error.message);
      return undefined;
    }
    return rowToCompany(data as CompanyRow);
  } catch (e) {
    console.error("[company] DB 연결 오류:", e);
    return undefined;
  }
}
