import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import {
  CENTRAL_OHIO_COUNTIES,
  CENTRAL_OHIO_VIEWBOX,
  COLUMBUS_POINT,
  COLUMBUS_RADIUS,
  RADIUS_PLACES,
} from "@/lib/geo/central-ohio";
import { InView } from "./InView";

type TargetingMapProps = {
  /** sm for small inline visuals, md for article width, lg for a feature. */
  size?: "sm" | "md" | "lg";
  /** Pulse the ring and light the ZIP dots while on screen. */
  animate?: boolean;
  className?: string;
};

const SIZES = {
  sm: { maxWidth: "max-w-[260px]", label: 17, pin: 15, legend: "text-[11px]" },
  md: { maxWidth: "max-w-[460px]", label: 11.5, pin: 12, legend: "text-xs" },
  lg: { maxWidth: "max-w-[480px]", label: 11, pin: 12, legend: "text-xs sm:text-sm" },
} as const;

/** Nudges county labels off busy spots. In viewBox units. */
const LABEL_OFFSETS: Record<string, [number, number]> = {
  Franklin: [-36, 52],
  Delaware: [0, -14],
  Licking: [6, 0],
  Fairfield: [6, 10],
};

const { width: W, height: H } = CENTRAL_OHIO_VIEWBOX;
const { x: cx, y: cy } = COLUMBUS_POINT;
const R = COLUMBUS_RADIUS.r;

/**
 * Stylized map of the seven Columbus metro counties with a radius ring and
 * ZIP code dots. Paths come from lib/geo/central-ohio.ts, generated at build
 * time, so this ships no map libraries.
 */
export function TargetingMap({ size = "lg", animate = true, className }: TargetingMapProps) {
  const s = SIZES[size];
  const loop = animate ? "anim-loop" : "";

  return (
    <figure className={cn("mx-auto w-full", s.maxWidth, className)}>
      <InView className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label="Map of Central Ohio counties showing targeting by radius and ZIP code"
          className="block h-auto w-full overflow-visible"
          fill="none"
        >
          <defs>
            <radialGradient id={`map-ring-fill-${size}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#4f8eff" stopOpacity="0.26" />
              <stop offset="100%" stopColor="#4f8eff" stopOpacity="0.05" />
            </radialGradient>
          </defs>

          {/* Counties */}
          {CENTRAL_OHIO_COUNTIES.map((c) => {
            const franklin = c.name === "Franklin";
            return (
              <path
                key={c.fips}
                d={c.path}
                fill={franklin ? "rgba(79,142,255,0.09)" : "rgba(255,255,255,0.018)"}
                stroke={franklin ? "rgba(126,179,255,0.6)" : "rgba(255,255,255,0.16)"}
                strokeWidth={franklin ? 1.4 : 1}
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}

          {/* Radius ring */}
          <circle cx={cx} cy={cy} r={R} fill={`url(#map-ring-fill-${size})`} />
          {animate && (
            <circle
              cx={cx}
              cy={cy}
              r={R}
              className={cn("map-ring-pulse", loop)}
              stroke="#7eb3ff"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
          )}
          <circle
            cx={cx}
            cy={cy}
            r={R}
            stroke="#7eb3ff"
            strokeOpacity="0.75"
            strokeWidth="1.25"
            strokeDasharray="5 5"
            vectorEffect="non-scaling-stroke"
          />

          {/* Radius line and distance */}
          <line x1={cx} y1={cy} x2={cx - R} y2={cy} stroke="#7eb3ff" strokeOpacity="0.45" />
          {size !== "sm" && (
            <text
              x={cx - R * 0.55}
              y={cy - 5}
              textAnchor="middle"
              fill="#7eb3ff"
              fontSize={s.label - 1}
              fontWeight={600}
            >
              {COLUMBUS_RADIUS.miles} mi
            </text>
          )}

          {/* ZIP code dots */}
          {RADIUS_PLACES.map((p, i) => (
            <g key={p.name}>
              <circle cx={p.x} cy={p.y} r="2.6" fill="rgba(255,255,255,0.28)" />
              <g className={cn("map-zip-lit", loop)} style={{ "--i": i } as CSSProperties}>
                <circle cx={p.x} cy={p.y} r="8" fill="#4f8eff" fillOpacity="0.22" />
                <circle cx={p.x} cy={p.y} r="3.4" fill="#7eb3ff" />
              </g>
            </g>
          ))}

          {/* County labels */}
          <g
            fontSize={s.label}
            fontWeight={600}
            letterSpacing="0.08em"
            textAnchor="middle"
            className="uppercase"
          >
            {CENTRAL_OHIO_COUNTIES.map((c) => {
              const [dx, dy] = LABEL_OFFSETS[c.name] ?? [0, 0];
              const franklin = c.name === "Franklin";
              return (
                <text
                  key={c.fips}
                  x={c.centroid[0] + dx}
                  y={c.centroid[1] + dy}
                  fill={franklin ? "#b9d4ff" : "rgba(240,240,245,0.5)"}
                  dominantBaseline="middle"
                >
                  {c.name}
                </text>
              );
            })}
          </g>

          {/* Columbus */}
          <circle cx={cx} cy={cy} r="7" fill="#0a0b0f" stroke="#a78bfa" strokeWidth="2" />
          <circle cx={cx} cy={cy} r="2.6" fill="#a78bfa" />
          <text
            x={cx + 11}
            y={cy + 1}
            fill="#f0f0f5"
            fontSize={s.pin}
            fontWeight={700}
            dominantBaseline="middle"
          >
            Columbus
          </text>
        </svg>
      </InView>

      <figcaption
        className={cn(
          "mt-3 flex items-center justify-center gap-2.5 text-text-dim",
          s.legend,
        )}
      >
        <span aria-hidden className="flex items-center gap-1.5">
          <span className="size-3 rounded-full border border-dashed border-accent-soft bg-accent/15" />
          <span className="size-1.5 rounded-full bg-accent-soft shadow-[0_0_6px_var(--color-accent)]" />
        </span>
        Target by radius, ZIP code, city or county
      </figcaption>
    </figure>
  );
}
