-- ============================================================
-- 작품 사진 업로드용 Supabase 스토리지 설정 (최초 1회만 실행)
-- Supabase 대시보드 → SQL Editor 에 통째로 붙여넣고 RUN
-- ============================================================

-- 1) 'work-images' 사진 보관함(버킷) 만들기
--    public = true → 올라간 사진을 누구나 볼 수 있음 (사이트 방문자에게 보여야 하므로)
insert into storage.buckets (id, name, public)
values ('work-images', 'work-images', true)
on conflict (id) do update set public = true;

-- 2) 기존 정책이 있으면 정리 (여러 번 실행해도 안전하도록)
drop policy if exists "work_images_public_read"   on storage.objects;
drop policy if exists "work_images_admin_insert"  on storage.objects;
drop policy if exists "work_images_admin_update"  on storage.objects;
drop policy if exists "work_images_admin_delete"  on storage.objects;

-- 3) 읽기: 누구나 볼 수 있음
create policy "work_images_public_read"
on storage.objects for select
using (bucket_id = 'work-images');

-- 4) 올리기: 관리자(admins 테이블에 등록된 계정)만
create policy "work_images_admin_insert"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'work-images'
  and exists (select 1 from public.admins a where a.user_id = auth.uid())
);

-- 5) 덮어쓰기: 관리자만
create policy "work_images_admin_update"
on storage.objects for update to authenticated
using (
  bucket_id = 'work-images'
  and exists (select 1 from public.admins a where a.user_id = auth.uid())
)
with check (
  bucket_id = 'work-images'
  and exists (select 1 from public.admins a where a.user_id = auth.uid())
);

-- 6) 삭제: 관리자만
create policy "work_images_admin_delete"
on storage.objects for delete to authenticated
using (
  bucket_id = 'work-images'
  and exists (select 1 from public.admins a where a.user_id = auth.uid())
);

-- ============================================================
-- 확인용: 아래를 실행하면 버킷이 잘 만들어졌는지 볼 수 있습니다.
-- select id, name, public from storage.buckets where id = 'work-images';
-- ============================================================
