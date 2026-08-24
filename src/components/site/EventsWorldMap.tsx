// 다가오는 일정 지구본
// - 산토리니 블루 구체 위에 대륙이 그려지고, 일정이 있는 나라에 점이 맥박칩니다.
// - 마우스 드래그(모바일: 좌우로 쓸기)로 회전하고, 손대기 전에는 천천히 자전합니다.
// - 점을 클릭(탭)하면 공연·워크샵 일정 페이지로 이동합니다.
// 지형 데이터는 Natural Earth(퍼블릭 도메인)에서 생성했습니다.

import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { geoOrthographic, geoPath, geoGraticule10, geoDistance } from "d3-geo";
import { LAND } from "./globe-land";
import { type DanceEvent } from "@/lib/events-source";

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
  const navigate = useNavigate();

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
    // 주의: 여기서 마우스를 붙잡으면(setPointerCapture) 점 클릭까지 가로채므로,
    // 실제로 끌기 시작한 뒤(onPointerMove)에만 붙잡습니다.
  };
  const onPointerMove = (ev: React.PointerEvent<SVGSVGElement>) => {
    const d = dragRef.current;
    if (!d) return;
    const dx = ev.clientX - d.x;
    const dy = ev.clientY - d.y;
    if (!d.moved && Math.abs(dx) + Math.abs(dy) > 4) {
      d.moved = true;
      ev.currentTarget.setPointerCapture(ev.pointerId);
    }
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

  const goEvents = (country: string) => {
    if (wasDragged()) return; // 끌기였다면 이동하지 않음
    void navigate({ to: "/events", search: { country } });
  };

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
            {/* 가장자리로 갈수록 은은히 푸르게 → 선만으로 구의 볼륨을 암시 */}
            <radialGradient id="globe-depth" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor="var(--santorini)" stopOpacity="0" />
              <stop offset="78%" stopColor="var(--santorini)" stopOpacity="0.03" />
              <stop offset="100%" stopColor="var(--santorini)" stopOpacity="0.12" />
            </radialGradient>
          </defs>

          {/* 드래그 잡을 수 있는 투명 구면 + 깊이감 */}
          <circle cx={C} cy={C} r={R} fill="url(#globe-depth)" />

          {/* 위·경도 그물선 (가는 가닥) */}
          <path
            d={path(GRATICULE) ?? ""}
            fill="none"
            stroke="var(--santorini)"
            strokeOpacity="0.22"
            strokeWidth="0.55"
          />

          {/* 대륙 윤곽선 (조금 진한 가닥) */}
          <path
            d={path(LAND as Parameters<typeof path>[0]) ?? ""}
            fill="var(--santorini)"
            fillOpacity="0.045"
            stroke="var(--santorini)"
            strokeOpacity="0.75"
            strokeWidth="0.9"
          />

          {/* 바깥 윤곽 */}
          <circle
            cx={C}
            cy={C}
            r={R}
            fill="none"
            stroke="var(--santorini)"
            strokeOpacity="0.5"
            strokeWidth="1.1"
          />

          {/* 일정 점 (뒷면은 자동 숨김) */}
          {Array.from(byCountry.entries()).map(([country, list]) => {
            const ll = COUNTRY_LL[country];
            if (!ll) return null;
            if (geoDistance(ll, center) > Math.PI / 2 - 0.03) return null;
            const p = projection(ll);
            if (!p) return null;
            const [x, y] = p;
            return (
              <g
                key={country}
                role="link"
                tabIndex={0}
                aria-label={`${country} 일정 ${list.length}개 — ${country} 일정 보기`}
                className="cursor-pointer outline-none"
                onClick={() => goEvents(country)}
                onKeyDown={(ev) => {
                  if (ev.key === "Enter" || ev.key === " ") goEvents(country);
                }}
              >
                <title>{`${country} · 일정 ${list.length}개 → ${country} 일정 보기`}</title>
                <circle cx={x} cy={y} r="6" className="map-pulse" fill="var(--santorini)" />
                <circle cx={x} cy={y} r="15" fill="transparent" />
                <circle cx={x} cy={y} r="6.5" fill="var(--santorini)" stroke="var(--background)" strokeWidth="1.5" />
                {list.length > 1 && (
                  <text x={x} y={y + 3.4} textAnchor="middle" className="pointer-events-none fill-white text-[9.5px] font-bold">
                    {list.length}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <p className="type-caption mt-4 text-center text-[0.62rem] text-muted-foreground">
        지구본을 돌려보세요 · 파란 점을 누르면 그 나라의 일정으로 이동합니다
      </p>
    </div>
  );
}
