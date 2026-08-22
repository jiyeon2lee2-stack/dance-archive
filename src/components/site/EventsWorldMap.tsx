// 다가오는 일정 지구본
// - 산토리니 블루 구체 위에 대륙이 그려지고, 일정이 있는 나라에 점이 맥박칩니다.
// - 마우스 드래그(모바일: 좌우로 쓸기)로 회전하고, 손대기 전에는 천천히 자전합니다.
// - 점을 클릭(탭)하면 아래에 그 나라의 일정 목록이 펼쳐집니다.
// 지형 데이터는 Natural Earth(퍼블릭 도메인)에서 생성했습니다.

import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { geoOrthographic, geoPath, geoGraticule10, geoDistance } from "d3-geo";
import { LAND } from "./globe-land";
import { formatEventDate, kindLabel, type DanceEvent } from "@/lib/events-source";

// 나라별 대표 좌표 (경도, 위도)
const COUNTRY_LL: Record<string, [number, number]> = {
  한국: [126.98, 37.57], 일본: [139.69, 35.69], 중국: [116.4, 39.9],
  대만: [121.56, 25.03], 싱가포르: [103.82, 1.35], 홍콩: [114.17, 22.32],
  미국: [-98.0, 39.0], 캐나다: [-97.0, 50.0], 브라질: [-47.93, -15.78],
  아르헨티나: [-58.38, -34.6], 영국: [-0.13, 51.51], 프랑스: [2.35, 48.86],
  독일: [13.4, 52.52], 네덜란드: [4.9, 52.37], 벨기에: [4.35, 50.85],
  스위스: [7.45, 46.95], 오스트리아: [16.37, 48.21], 스페인: [-3.7, 40.42],
  이탈리아: [12.5, 41.9], 포르투갈: [-9.14, 38.72], 스웨덴: [18.07, 59.33],
  덴마크: [12.57, 55.68], 노르웨이: [10.75, 59.91], 핀란드: [24.94, 60.17],
  체코: [14.42, 50.09], 폴란드: [21.01, 52.23], 헝가리: [19.04, 47.5],
  그리스: [23.73, 37.98], 이스라엘: [34.78, 32.08], 튀르키예: [32.85, 39.93],
  호주: [151.21, -33.87], 뉴질랜드: [174.78, -41.29],
};

const SIZE = 600;
const R = 288;
const C = SIZE / 2;
const GRATICULE = geoGraticule10();

export function EventsWorldMap({ events }: { events: DanceEvent[] }) {
  // 회전 상태: [경도 회전, 위도 기울기]. 시작은 한국이 정면
  const [rotation, setRotation] = useState<[number, number]>([-127, -18]);
  const [selected, setSelected] = useState<string | null>(null);

  const interactedRef = useRef(false);
  const dragRef = useRef<{ x: number; y: number; rot: [number, number]; moved: boolean } | null>(null);

  // 손대기 전 느린 자전
  useEffect(() => {
    let raf = 0;
    const spin = () => {
      if (!interactedRef.current && !dragRef.current) {
        setRotation(([l, p]) => [l + 0.06, p]);
      }
      raf = requestAnimationFrame(spin);
    };
    raf = requestAnimationFrame(spin);
    return () => cancelAnimationFrame(raf);
  }, []);

  const projection = useMemo(
    () =>
      geoOrthographic()
        .scale(R)
        .translate([C, C])
        .clipAngle(90)
        .rotate([rotation[0], rotation[1]]),
    [rotation],
  );
  const path = useMemo(() => geoPath(projection), [projection]);

  const byCountry = useMemo(() => {
    const m = new Map<string, DanceEvent[]>();
    for (const e of events) {
      if (!COUNTRY_LL[e.country]) continue;
      if (!m.has(e.country)) m.set(e.country, []);
      m.get(e.country)!.push(e);
    }
    return m;
  }, [events]);

  // 드래그 회전
  const onPointerDown = (ev: React.PointerEvent<SVGSVGElement>) => {
    interactedRef.current = true;
    dragRef.current = { x: ev.clientX, y: ev.clientY, rot: [...rotation] as [number, number], moved: false };
    ev.currentTarget.setPointerCapture(ev.pointerId);
  };
  const onPointerMove = (ev: React.PointerEvent<SVGSVGElement>) => {
    const d = dragRef.current;
    if (!d) return;
    const dx = ev.clientX - d.x;
    const dy = ev.clientY - d.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) d.moved = true;
    const k = 0.32;
    const lambda = d.rot[0] + dx * k;
    const phi = Math.max(-62, Math.min(62, d.rot[1] - dy * k));
    setRotation([lambda, phi]);
  };
  const endDrag = () => {
    // 클릭 판별을 위해 잠깐 유지 후 해제
    setTimeout(() => {
      dragRef.current = null;
    }, 0);
  };

  const wasDragged = () => Boolean(dragRef.current?.moved);

  const center: [number, number] = [-rotation[0], -rotation[1]];
  const sel = selected ? (byCountry.get(selected) ?? []) : null;

  return (
    <div>
      <div className="mx-auto max-w-[560px]">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          role="img"
          aria-label="다가오는 일정이 있는 나라를 표시한 지구본. 드래그하면 회전합니다."
          className="w-full cursor-grab select-none active:cursor-grabbing [touch-action:pan-y]"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <defs>
            {/* 구면 음영: 왼쪽 위 하이라이트 + 가장자리 어둡게 → 입체감 */}
            <radialGradient id="globe-shade" cx="0.36" cy="0.3" r="0.9">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
              <stop offset="55%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.28" />
            </radialGradient>
          </defs>

          {/* 바다 (산토리니 블루 구체) */}
          <circle cx={C} cy={C} r={R} style={{ fill: "var(--santorini)" }} />

          {/* 위·경도 그물선 */}
          <path d={path(GRATICULE) ?? ""} fill="none" stroke="#ffffff" strokeOpacity="0.14" strokeWidth="0.7" />

          {/* 대륙 */}
          <path
            d={path(LAND as Parameters<typeof path>[0]) ?? ""}
            className="fill-background"
            fillOpacity="0.92"
            stroke="#ffffff"
            strokeOpacity="0.35"
            strokeWidth="0.5"
          />

          {/* 구면 음영 + 윤곽 */}
          <circle cx={C} cy={C} r={R} fill="url(#globe-shade)" pointerEvents="none" />
          <circle cx={C} cy={C} r={R} fill="none" className="stroke-foreground/30" strokeWidth="1" />

          {/* 일정 점 (뒷면은 자동 숨김) */}
          {Array.from(byCountry.entries()).map(([country, list]) => {
            const ll = COUNTRY_LL[country];
            if (!ll) return null;
            if (geoDistance(ll, center) > Math.PI / 2 - 0.03) return null;
            const p = projection(ll);
            if (!p) return null;
            const [x, y] = p;
            const active = selected === country;
            return (
              <g
                key={country}
                className="cursor-pointer"
                onClick={() => {
                  if (wasDragged()) return;
                  setSelected(active ? null : country);
                }}
              >
                <title>{`${country} · 일정 ${list.length}개`}</title>
                <circle cx={x} cy={y} r="6" className="map-pulse fill-foreground" />
                <circle cx={x} cy={y} r="15" fill="transparent" />
                <circle cx={x} cy={y} r={active ? 8.5 : 6.5} className="fill-foreground" stroke="#ffffff" strokeOpacity="0.85" strokeWidth="1.5" />
                {list.length > 1 && (
                  <text x={x} y={y + 3.4} textAnchor="middle" className="pointer-events-none fill-background text-[9.5px] font-bold">
                    {list.length}
                  </text>
                )}
                {active && (
                  <text
                    x={x}
                    y={y - 16}
                    textAnchor="middle"
                    className="pointer-events-none fill-foreground text-[15px] font-bold"
                    stroke="var(--background)"
                    strokeWidth="4"
                    paintOrder="stroke"
                  >
                    {country}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {sel && selected ? (
        <div className="mx-auto mt-4 max-w-[720px] border border-border p-6 md:p-7">
          <div className="flex items-center justify-between gap-4">
            <h3 className="type-h3">{selected}</h3>
            <span className="sticker sticker-accent">{sel.length}개 일정</span>
          </div>
          <ul className="mt-4 flex flex-col divide-y divide-border">
            {sel.map((e) => (
              <li key={e.id} className="py-3.5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <span className="min-w-0 text-sm font-bold">
                    <span className="sticker mr-2 align-middle">{kindLabel[e.kind]}</span>
                    {e.title}
                  </span>
                  <span className="mono text-xs text-muted-foreground">{formatEventDate(e)}</span>
                </div>
                {e.venue && <p className="mt-1 text-xs text-muted-foreground">{e.venue}</p>}
              </li>
            ))}
          </ul>
          <Link to="/events" className="link-marker mt-5 inline-block text-sm">
            전체 일정 보기 <span aria-hidden>→</span>
          </Link>
        </div>
      ) : (
        <p className="type-caption mt-4 text-center text-[0.62rem] text-muted-foreground">
          지구본을 돌려보세요 · 점을 누르면 나라별 일정이 표시됩니다
        </p>
      )}
    </div>
  );
}
