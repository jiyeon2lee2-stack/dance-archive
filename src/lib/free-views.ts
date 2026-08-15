// 비회원 무료 열람 횟수 관리
//
// 로그인하지 않은 방문자는 작품 분석을 FREE_VIEW_LIMIT편까지 볼 수 있고,
// 그 다음부터는 로그인 안내가 표시됩니다.
//
// 기록은 방문자 브라우저(localStorage)에만 남습니다. 서버에 저장하지 않으므로
// 개인정보가 수집되지 않고, 브라우저를 바꾸면 다시 세어집니다.
// (완벽히 막는 장치가 아니라 "많이 읽는 사람은 가입하도록" 권하는 장치입니다.)

/** 비회원이 무료로 볼 수 있는 작품 분석 편수 */
export const FREE_VIEW_LIMIT = 3;

const KEY = "dance-archive:free-views:v1";

function readSeen(): string[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((s): s is string => typeof s === "string") : [];
  } catch {
    // 시크릿 모드 등 localStorage를 못 쓰는 환경 → 제한 없이 열어줍니다.
    return [];
  }
}

function writeSeen(list: string[]): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // 저장 실패는 무시 (열람은 그대로 허용)
  }
}

/**
 * 이 작품을 지금 볼 수 있는지 판단하고, 처음 보는 작품이면 열람 기록에 추가합니다.
 * - 이미 읽은 작품을 다시 여는 것은 횟수에 세지 않습니다.
 * @returns 볼 수 있으면 true, 무료 횟수를 모두 썼으면 false
 */
export function registerFreeView(slug: string): boolean {
  if (typeof window === "undefined") return true;
  const seen = readSeen();
  if (seen.includes(slug)) return true;
  if (seen.length >= FREE_VIEW_LIMIT) return false;
  writeSeen([...seen, slug]);
  return true;
}

/** 앞으로 몇 편을 더 무료로 볼 수 있는지 */
export function freeViewsLeft(): number {
  if (typeof window === "undefined") return FREE_VIEW_LIMIT;
  return Math.max(0, FREE_VIEW_LIMIT - readSeen().length);
}
