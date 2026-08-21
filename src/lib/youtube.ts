// 유튜브 주소에서 영상 ID(11자리)를 추출합니다.
// 지원 형식: watch?v=..., youtu.be/..., shorts/..., embed/..., ID만 입력
export function youtubeId(url: string | undefined): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (/^[\w-]{11}$/.test(trimmed)) return trimmed;
  const m = trimmed.match(
    /(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/,
  );
  return m?.[1] ?? null;
}
