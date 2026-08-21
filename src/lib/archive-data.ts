import revelations from "@/assets/work-revelations.jpg";
import chance from "@/assets/work-chance.jpg";
import cafe from "@/assets/work-cafe.jpg";
import falling from "@/assets/work-falling.jpg";
import rush from "@/assets/work-rush.jpg";

export type Work = {
  slug: string;
  title: string;
  choreographer: string;
  country: string;
  year: number;
  image: string;
  summary: string;
  analysis: string[];
  /** 유튜브 영상 주소 (선택). 있으면 상세 페이지에 영상이 표시됩니다. */
  youtube?: string;
  /** 연결된 무용단의 slug (선택). 있으면 작품↔무용단 페이지가 서로 연결됩니다. */
  company?: string;
};

export const works: Work[] = [
  {
    slug: "revelations",
    title: "계시록",
    choreographer: "Alvin Ailey",
    country: "United States",
    year: 1960,
    image: revelations,
    summary:
      "영적 음악, 블루스, 재즈를 통해 아프리카계 미국인의 경험을 기념하는 미국 현대 무용의 상징입니다. 이 상징적인 작품은 전 세계에서 가장 많이 공연되는 현대 무용 작품 중 하나입니다.",
    analysis: [
      "1960년 초연된 이 작품은 흑인 영가와 가스펠, 블루스를 축으로 삼아 고통에서 정화, 그리고 환희로 이어지는 세 개의 장을 그립니다. 무대는 최소한의 장치만 남기고, 신체와 빛, 그리고 천으로 감정의 지형을 만듭니다.",
      "첫 장에서 무용수들은 무거운 중력에 붙들린 듯 낮은 자세를 유지합니다. 팔은 위로 뻗지만 몸통은 땅을 향하고, 이 긴장이 곧 작품 전체의 주제인 '억압과 상승'을 압축합니다.",
      "물의 이미지로 채워진 두 번째 장은 세례의 은유입니다. 흰 천이 파도처럼 흔들리며 무대의 시간감을 늦추고, 관객은 개인의 서사가 공동체의 의례로 확장되는 순간을 목격합니다.",
      "마지막 장의 부채와 의자는 예배당의 기억을 소환합니다. 반복되는 리듬과 웃음, 그리고 폭발하는 점프는 슬픔을 부정하지 않으면서도 기쁨을 선언하는 태도를 보여줍니다.",
    ],
  },
  {
    slug: "chance",
    title: "우연에 의한 모음곡",
    choreographer: "Merce Cunningham",
    country: "United States",
    year: 1953,
    image: chance,
    summary:
      "음악과 무용을 독립적으로 분리하며 각각이 독립적으로 존재할 수 있게 한 획기적인 작품입니다. 이 작품은 무용과 음악이 어떻게 관련되어야 하는지에 대한 기존의 개념에 도전했습니다.",
    analysis: [
      "커닝햄은 동작의 순서를 동전 던지기와 같은 우연 절차로 결정했습니다. 안무가의 취향이 개입하기 전에 구조가 먼저 결정되고, 무용수는 그 구조를 정밀하게 수행합니다.",
      "음악은 동작을 설명하지 않습니다. 무대 위에서 처음 만나는 두 시간축은 서로를 지배하지 않고 병렬로 흐르며, 관객은 스스로 의미를 조립해야 합니다.",
      "이 방법론은 이후 반세기 동안 현대 무용의 어휘를 재정의했고, 무대 중심을 해체한 공간 감각은 오늘날 컨템포러리 작품 대부분에 흔적을 남겼습니다.",
    ],
  },
  {
    slug: "cafe-muller",
    title: "카페 뮐러",
    choreographer: "Pina Bausch",
    country: "Germany",
    year: 1978,
    image: cafe,
    summary:
      "무용과 연극 요소를 결합한 섬세하고 친밀한 작품입니다. 무용수들은 테이블과 의자로 가득 찬 공간을 움직이며, 그리움과 반복의 꿈 같은 분위기를 만듭니다.",
    analysis: [
      "눈을 감은 채 벽을 향해 걷는 인물, 그 앞의 의자를 황급히 치우는 인물. 바우쉬는 반복을 통해 관계의 구조를 드러냅니다.",
      "탄츠테아터의 언어는 여기서 완성됩니다. 동작은 춤이면서 동시에 일상 행위이고, 무대의 소품은 기억의 잔해처럼 배치됩니다.",
      "포옹이 반복될수록 그 형태는 점점 기계적으로 변합니다. 사랑의 제스처가 습관이 되는 과정을 이보다 잔인하게 보여준 작품은 드뭅니다.",
    ],
  },
  {
    slug: "falling-angels",
    title: "떨어지는 천사들",
    choreographer: "Jiří Kylián",
    country: "Netherlands",
    year: 1989,
    image: falling,
    summary:
      "스티브 라이시의 타악 리듬 위에서 여덟 명의 여성 무용수가 정밀한 대열을 이루는 작품입니다. 고전 기법을 해체하면서도 우아함과 힘을 유지합니다.",
    analysis: [
      "고전 발레의 정렬을 유지하면서도 척추와 골반의 움직임을 자유롭게 풀어놓아, 형식과 해방이 한 몸에서 충돌하게 만듭니다.",
      "듀엣 구간의 리프트는 힘의 과시가 아니라 무게의 교환입니다. 두 신체가 서로에게 기대는 각도에서 작품의 정서가 만들어집니다.",
      "빛의 사용 또한 안무의 일부입니다. 좁은 광폭이 무대를 잘라내며 시선을 강제로 집중시키고, 어둠은 다음 장면을 위한 여백이 됩니다.",
    ],
  },
  {
    slug: "rush",
    title: "러시",
    choreographer: "Akram Khan",
    country: "United Kingdom",
    year: 2000,
    image: rush,
    summary:
      "카탁의 정교한 리듬과 컨템포러리 어휘가 충돌하며 만들어내는 속도의 작품입니다. 낙하와 활공의 감각이 무대를 가로지릅니다.",
    analysis: [
      "칸은 카탁의 회전과 발 리듬을 컨템포러리의 낙하 기술과 겹쳐놓습니다. 두 전통은 절충되지 않고 서로를 밀어냅니다.",
      "제목이 가리키는 '러시'는 스카이다이빙의 활공 감각에서 출발합니다. 무대 위 신체는 늘 떨어지는 중이며, 착지는 유예됩니다.",
      "리듬 구조는 수학적으로 설계되어 있지만 체감은 즉흥적입니다. 이 간극이 관객에게 지속적인 긴장을 만듭니다.",
    ],
  },
];

export const getWork = (slug: string) => works.find((w) => w.slug === slug);

export const countries = ["모든 국가", ...Array.from(new Set(works.map((w) => w.country)))];
export const years = ["모든 연도", ...Array.from(new Set(works.map((w) => String(w.year))))];
export const choreographers = [
  "모든 안무가",
  ...Array.from(new Set(works.map((w) => w.choreographer))),
];

export type InfoItem = {
  title: string;
  meta: string;
  body: string;
  tags: string[];
};

export const studyAbroadItems: InfoItem[] = [];

export const koreaAdmissionItems: InfoItem[] = [
  {
    title: "한국예술종합학교 무용원 실기과",
    meta: "서울 · 수시/정시",
    body: "실기 중심 전형으로 현대무용 지정작과 자유작을 함께 심사합니다. 1차 실기 후 2차 면접에서 작품 해석 능력을 평가합니다.",
    tags: ["실기 100%", "지정작", "면접"],
  },
  {
    title: "이화여자대학교 무용과",
    meta: "서울 · 수시",
    body: "학생부와 실기를 병행하여 평가하며, 현대무용 전공은 즉흥 과제가 포함됩니다. 기본기와 음악성에 대한 배점이 높습니다.",
    tags: ["학생부 30%", "즉흥", "현대무용"],
  },
  {
    title: "세종대학교 무용과",
    meta: "서울 · 정시",
    body: "정시 실기 위주 전형으로 컨템포러리 시퀀스와 자유 솔로를 요구합니다. 지원 전 연도별 지정 과제 변경 사항을 확인하세요.",
    tags: ["정시", "자유 솔로", "컨템포러리"],
  },
];
