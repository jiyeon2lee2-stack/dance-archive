# 현대무용 아카이브 프로젝트

## 개요
- 20대 딸이 운영하는 현대무용 아카이브 웹사이트 (Rambert 스타일: 산토리니 블루 #2E64C8 포인트, Black Han Sans 헤드라인)
- 사용자(아버지)는 비개발자. 전문용어는 쉽게 풀어서 설명할 것. 코드 수정은 Claude가 전부 담당
- 사이트: https://dance-archive.jiyeon2-lee2.workers.dev
- 배포: Cloudflare Workers, main 브랜치에 커밋하면 자동 배포
- DB/인증: Supabase (프로젝트 qgkojpkmthfkitgcphkj, 서울). 연결 정보는 src/lib/supabase.ts
- 스택: React 19 + TanStack Start + Tailwind 4 + shadcn/ui + supabase-js + d3-geo

## 작업 규칙
- 수정 후 반드시 `npx vite build` 와 `npx tsc --noEmit` 로 검증하고 커밋할 것
- DB 스키마 변경이 필요하면: 사용자에게 Supabase SQL Editor용 SQL을 먼저 주고, 실행 확인 후에 코드를 커밋할 것 (순서가 바뀌면 사이트가 폴백 데이터로 빠짐)
- 새 라우트 파일을 만들면 vite build를 먼저 돌려 routeTree.gen.ts를 갱신한 뒤 tsc를 실행할 것
- 커밋 메시지는 한국어로 간단하게

## 완료된 기능
- 로그인: 이메일 매직링크, 카카오, 구글 (네이버는 미지원으로 버튼 삭제함)
- /admin 관리자: 작품·입시/유학 정보·무용단·일정 CRUD + 회원 목록(admin_list_users RPC). admins 테이블 + is_admin() RLS
- 작품(works): youtube_url 임베드(youtube-nocookie), company_slug로 무용단 연결
- 무용단(companies): 목록/상세, 작품 상호 연결
- 일정(events): 국내/해외·공연/워크샵, country 컬럼, 지난 일정 자동 숨김, 타임라인 페이지(/events, ?country= 필터 지원)
- 홈: 산토리니 블루 와이어프레임 지구본 (자전, 드래그 회전, 나라 점 클릭 → /events?country=X 이동)

## 저작권 원칙 (중요)
- 구글이미지/SNS/기사 사진, 유튜브 캡처·썸네일, 원본 사진의 AI 변형 = 전부 금지
- 허용: 직접 촬영, 위키미디어 퍼블릭도메인/CC(출처 표기), 무료 스톡, 텍스트로만 생성한 분위기용 AI 이미지, 허락받은 프레스 사진
- 유튜브는 공식 채널 영상을 임베드로만 사용

## 남은 할 일 (순서대로)
1. 파비콘 + OG 이미지 (로고 방향 미정 — 딸과 상의 필요. 기존 "무" 로고는 폐기됨)
2. 개인정보처리방침 페이지
3. 모바일 화면 전수 점검 (기존 작품 사진 5장 출처 점검 포함)
4. 커스텀 도메인 → 검색엔진 등록 → 오픈
5. (오픈 후) 댓글, 사진 업로드, 무용 용어사전, 작품 카드 배지 다듬기

## 검토 중
- 그랜드 피날레 프레스 사진 허락 이메일 (hofesh.co.uk)
- 저작권 체크 스킬 제작
