// 관리자 페이지에서 내 컴퓨터의 사진을 Supabase 스토리지에 올리는 기능.
//
// 흐름:
//   1) 브라우저에서 사진을 열어 긴 변 1600px로 줄이고 JPEG로 다시 저장 (용량 절감)
//   2) Supabase 스토리지의 'work-images' 버킷에 업로드
//   3) 공개 주소(https://...)를 돌려줌 → 그대로 works.image_url에 저장
//
// 버킷과 접근 권한은 Supabase에서 미리 한 번만 만들어두어야 합니다(setup SQL 참고).

import { supabase } from "./supabase";

export const WORK_IMAGE_BUCKET = "work-images";

/** 원본 파일 최대 크기 (20MB) */
const MAX_BYTES = 20 * 1024 * 1024;
/** 줄인 뒤의 긴 변 최대 길이 (px) */
const MAX_EDGE = 1600;
/** JPEG 품질 */
const QUALITY = 0.85;

/** 브라우저에서 이미지를 줄여 JPEG Blob으로 변환. 실패하면 예외를 던집니다. */
async function shrinkToJpeg(file: File): Promise<Blob> {
  if (typeof createImageBitmap !== "function") {
    throw new Error("unsupported");
  }
  const bitmap = await createImageBitmap(file);
  try {
    const longest = Math.max(bitmap.width, bitmap.height);
    const scale = longest > MAX_EDGE ? MAX_EDGE / longest : 1;
    const w = Math.max(1, Math.round(bitmap.width * scale));
    const h = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("unsupported");
    ctx.drawImage(bitmap, 0, 0, w, h);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", QUALITY),
    );
    if (!blob) throw new Error("unsupported");
    return blob;
  } finally {
    bitmap.close?.();
  }
}

/** 파일 이름에 쓸 수 있도록 slug를 영문·숫자·하이픈으로 정리 */
function safeFolder(hint: string | undefined): string {
  const cleaned = (hint ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return cleaned || "work";
}

/** Supabase가 돌려주는 영어 오류 메시지를 알아보기 쉬운 한국어로 바꿉니다. */
function friendlyError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("bucket not found")) {
    return "사진 보관함(work-images)이 아직 만들어지지 않았습니다. Supabase 설정을 먼저 마쳐주세요.";
  }
  if (m.includes("row-level security") || m.includes("unauthorized") || m.includes("403")) {
    return "업로드 권한이 없습니다. 관리자 계정으로 로그인했는지 확인해주세요.";
  }
  if (m.includes("payload too large") || m.includes("exceeded the maximum")) {
    return "파일이 너무 큽니다. 더 작은 사진으로 올려주세요.";
  }
  if (m.includes("already exists")) {
    return "같은 이름의 파일이 이미 있습니다. 잠시 후 다시 시도해주세요.";
  }
  return `업로드 실패: ${message}`;
}

/**
 * 사진 한 장을 올리고 공개 주소를 돌려줍니다.
 * @param file  사용자가 고른 파일
 * @param slugHint  작품 slug (파일을 작품별 폴더로 정리하는 용도)
 */
export async function uploadWorkImage(file: File, slugHint?: string): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("이미지 파일만 올릴 수 있습니다. (jpg, png, webp 등)");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("파일이 너무 큽니다. 20MB 이하의 사진을 올려주세요.");
  }

  // 1) 줄이기. 브라우저가 못 여는 형식(HEIC 등)이면 원본 그대로 올립니다.
  let body: Blob = file;
  let ext = (file.name.split(".").pop() ?? "").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  let contentType = file.type;
  try {
    body = await shrinkToJpeg(file);
    ext = "jpg";
    contentType = "image/jpeg";
  } catch {
    // 변환 실패 시 원본 업로드 (한글 파일명은 아래에서 새 이름으로 바뀌므로 안전)
  }

  // 2) 업로드. 파일 이름은 항상 새로 만들어 한글·공백·중복 문제를 피합니다.
  const suffix = Math.random().toString(36).slice(2, 8);
  const path = `${safeFolder(slugHint)}/${Date.now()}-${suffix}.${ext}`;

  const { error } = await supabase.storage.from(WORK_IMAGE_BUCKET).upload(path, body, {
    contentType,
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw new Error(friendlyError(error.message));

  // 3) 공개 주소 반환
  const { data } = supabase.storage.from(WORK_IMAGE_BUCKET).getPublicUrl(path);
  if (!data?.publicUrl) throw new Error("업로드는 되었지만 주소를 받지 못했습니다.");
  return data.publicUrl;
}
