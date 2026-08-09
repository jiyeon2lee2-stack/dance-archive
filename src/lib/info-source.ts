// 입시/유학 정보 데이터 소스 레이어
// 작품(works-source.ts)과 동일한 패턴:
// 1순위 Supabase → 실패/빈 결과 시 내장 데이터 폴백

import { supabase } from "./supabase";
import { koreaAdmissionItems, studyAbroadItems, type InfoItem } from "./archive-data";

export type InfoCategory = "korea" | "abroad";

type InfoRow = {
  title: string;
  meta: string;
  body: string;
  tags: string[] | null;
};

const localByCategory: Record<InfoCategory, InfoItem[]> = {
  korea: koreaAdmissionItems,
  abroad: studyAbroadItems,
};

export async function fetchInfoItems(category: InfoCategory): Promise<InfoItem[]> {
  try {
    const { data, error } = await supabase
      .from("info_items")
      .select("title,meta,body,tags")
      .eq("category", category)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("[info] DB 조회 실패, 내장 데이터 사용:", error.message);
      return localByCategory[category];
    }
    // DB 조회 자체가 성공했다면 결과가 0건이어도 DB를 신뢰합니다.
    // (해외 유학처럼 의도적으로 비워둔 카테고리는 빈 상태 화면이 떠야 하므로)
    return (data as InfoRow[]).map((r) => ({
      title: r.title,
      meta: r.meta,
      body: r.body,
      tags: Array.isArray(r.tags) ? r.tags : [],
    }));
  } catch (e) {
    console.error("[info] DB 연결 오류, 내장 데이터 사용:", e);
    return localByCategory[category];
  }
}
