// 로그인 상태 훅
// 어느 컴포넌트에서든 const { user, loading, signOut } = useAuth() 로
// 현재 로그인한 사용자를 알 수 있습니다.

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 현재 세션 확인 (소셜 로그인 후 돌아왔을 때 URL의 토큰도 자동 처리됨)
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    // 로그인/로그아웃 실시간 반영
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return {
    user,
    loading,
    signOut: () => supabase.auth.signOut(),
  };
}

// 사용자 표시 이름 (소셜 제공자마다 담기는 위치가 달라서 순서대로 탐색)
export function displayName(user: User | null): string {
  if (!user) return "";
  const m = user.user_metadata ?? {};
  return (
    (m["full_name"] as string) ||
    (m["name"] as string) ||
    (m["nickname"] as string) ||
    (m["preferred_username"] as string) ||
    user.email?.split("@")[0] ||
    "회원"
  );
}
