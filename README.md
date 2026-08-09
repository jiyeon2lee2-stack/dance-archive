# 현대무용 아카이브 (Contemporary Dance Archive)

세계의 현대무용 걸작들을 깊이 있는 분석과 함께 아카이브하는 웹사이트입니다!

## 페이지 구성

| 경로 | 페이지 | 설명 |
|---|---|---|
| `/` | 홈 | 히어로, 추천 작품, 경험 소개, 입시·유학 안내 |
| `/works` | 작품 탐색 | 전체 작품 목록 + 검색/국가/연도/안무가 필터 |
| `/works/[slug]` | 작품 분석 | 작품별 상세 분석 글 + 댓글(UI) |
| `/admissions` | 한국 입시 | 국내 입시 요강 정보 |
| `/study-abroad` | 해외 유학 | 해외 유학 정보 |
| `/login` | 로그인 | 소셜 로그인 UI (기능 연결 예정) |
| `/styleguide` | 스타일 가이드 | 내부용 디자인 시스템 문서 (메뉴 미노출) |

## 기술 스택

- **React 19** + **TypeScript**
- **TanStack Start** — 라우팅/SSR 프레임워크
- **Tailwind CSS 4** + **shadcn/ui** — 스타일/컴포넌트
- 배포 빌드: Nitro (기본 타깃: Cloudflare)

## 로컬에서 실행하기

Node.js(LTS 버전)가 설치되어 있어야 합니다.

```sh
npm install     # 최초 1회, 패키지 설치
npm run dev     # 개발 서버 실행 → http://localhost:5173
```

배포용 빌드 확인:

```sh
npm run build
npm run preview
```

## 콘텐츠 수정하는 법

**작품 추가/수정** → `src/lib/archive-data.ts` 파일 하나만 고치면 됩니다.
`works` 배열에 아래 형식으로 항목을 추가하세요. 이미지는 `src/assets/`에 넣고 상단에서 import 합니다.

```ts
{
  slug: "url에-쓰일-영문-이름",
  title: "작품명",
  choreographer: "안무가",
  country: "국가",
  year: 2024,
  image: 임포트한이미지,
  summary: "목록에 보이는 한두 문장 요약",
  analysis: ["분석 문단 1", "분석 문단 2", ...],
}
```

**디자인 규칙** → `/styleguide` 페이지에 색상, 타이포, 컴포넌트 규칙이 정리되어 있습니다. 새 페이지를 만들 때 이 규칙을 따라야 사이트의 일관성이 유지됩니다.

## 폴더 구조 (핵심만)

```
src/
├── routes/          # 페이지 (파일 = 라우트)
├── components/
│   ├── site/        # 이 사이트 전용 컴포넌트 (헤더, 푸터, 작품카드 등)
│   └── ui/          # shadcn/ui 공용 컴포넌트
├── lib/
│   └── archive-data.ts   # ★ 작품 데이터 (콘텐츠 수정은 여기)
├── assets/          # 이미지
└── styles.css       # 전역 스타일/디자인 토큰
```

## 앞으로 할 일 (로드맵)

- [ ] Supabase 연동 — 작품 데이터를 DB로 이전
- [ ] 소셜 로그인 실제 구현 (Google / Kakao, Supabase Auth)
- [ ] 댓글 기능 구현
- [ ] 입시/유학 콘텐츠 채우기
- [ ] 커스텀 도메인 연결

## 참고

- 이 프로젝트는 Lovable로 초기 디자인을 생성한 뒤 독립시킨 코드입니다.
  `@lovable.dev/vite-tanstack-config`(빌드 설정 패키지)는 공개 npm 패키지로,
  Lovable 서비스와 무관하게 동작합니다. 추후 표준 Vite 설정으로 교체할 수 있습니다.
