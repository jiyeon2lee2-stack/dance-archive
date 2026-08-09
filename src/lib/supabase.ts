import { createClient } from "@supabase/supabase-js";

// Supabase 연결 정보.
// anon key는 공개용 키로, RLS(행 수준 보안) 정책이 실제 접근을 통제합니다.
// 환경변수(VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)가 있으면 그 값을 우선 사용합니다.
const SUPABASE_URL =
  import.meta.env?.["VITE_SUPABASE_URL"] ?? "https://qgkojpkmthfkitgcphkj.supabase.co";
const SUPABASE_ANON_KEY =
  import.meta.env?.["VITE_SUPABASE_ANON_KEY"] ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFna29qcGttdGhma2l0Z2NwaGtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYyNDA5MDAsImV4cCI6MjEwMTgxNjkwMH0.B4iCUAh9O6gNS90bz6EWimA7GS8dv1K9zaBDuLvvFlc";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    // 로그인 기능 구현 전까지는 세션 유지 기능을 꺼둡니다.
    persistSession: false,
  },
});
