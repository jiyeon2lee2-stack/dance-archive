// 로그인 후 원래 보던 페이지로 되돌려 보내기
//
// 소셜 로그인은 홈(/)으로 돌아오게 되어 있습니다. 작품을 읽다가 로그인한 경우
// 홈으로 튕기면 흐름이 끊기므로, 떠나기 직전 주소를 잠시 기억해뒀다가
// 로그인이 확인되면 그 페이지로 다시 보냅니다.
//
// sessionStorage에 저장하므로 탭을 닫으면 사라집니다.

const KEY = "dance-archive:return-to";

/** 로그인하러 가기 직전에 현재 주소를 기억 */
export function rememberReturnPath(path: string): void {
  if (typeof window === "undefined") return;
  if (!path.startsWith("/")) return; // 외부 주소로는 절대 보내지 않음
  try {
    window.sessionStorage.setItem(KEY, path);
  } catch {
    // 저장 실패는 무시 (홈으로 돌아가게 됨)
  }
}

/** 기억해둔 주소를 꺼내고 지웁니다. 없으면 null */
export function consumeReturnPath(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const path = window.sessionStorage.getItem(KEY);
    window.sessionStorage.removeItem(KEY);
    return path && path.startsWith("/") ? path : null;
  } catch {
    return null;
  }
}
