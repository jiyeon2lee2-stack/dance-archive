// 현재 로그인한 사용자가 관리자인지 확인하는 훅
// admins 테이블은 RLS로 "본인 행만 조회 가능"이므로,
// 조회 결과가 있으면 관리자, 없으면 일반 회원입니다.

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";

export function useIsAdmin(user: User | null) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (!user) {
      setIsAdmin(false);
      setChecking(false);
      return;
    }
    setChecking(true);
    supabase
      .from("admins")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) {
          setIsAdmin(Boolean(data));
          setChecking(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  return { isAdmin, checking };
}
