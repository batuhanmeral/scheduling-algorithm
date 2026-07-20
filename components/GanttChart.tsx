"use client";

import { processColor } from "@/lib/colors";
import type { GanttSegment } from "@/lib/types";
import { useLanguage } from "./LanguageProvider";

interface GanttChartProps {
  segments: GanttSegment[];
}

/** Blokların soldan sağa sırayla büyümesi için segment başına gecikme (sn). */
const STAGGER_DELAY = 0.08;

export default function GanttChart({ segments }: GanttChartProps) {
  const { t } = useLanguage();

  if (segments.length === 0) return null;

  const start = segments[0].start;
  const totalDuration = segments[segments.length - 1].end - start || 1;

  return (
    <div>
      <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-muted">
        {t("ganttChart")}
      </h3>
      <div className="overflow-x-auto pb-1">
        <div className="min-w-120">
          {/* Renkli işlem blokları */}
          <div className="relative flex h-14 overflow-hidden rounded-lg border border-surface-border">
            {segments.map((seg, i) => {
              const widthPct =
                ((seg.end - seg.start) / totalDuration) * 100;
              const isIdle = seg.processId === null;
              return (
                <div
                  key={i}
                  style={{
                    width: `${widthPct}%`,
                    animationDelay: `${i * STAGGER_DELAY}s`,
                  }}
                  className={`font-display flex animate-grow-bar origin-[left] items-center justify-center border-r border-white/40 text-xs font-semibold last:border-r-0 dark:border-black/20 ${
                    isIdle
                      ? "bg-[repeating-linear-gradient(45deg,transparent,transparent_6px,var(--grid-line-major)_6px,var(--grid-line-major)_12px)] text-muted"
                      : `${processColor(seg.processId!)} text-white`
                  }`}
                  title={
                    isIdle
                      ? `${t("idle")}: ${seg.start} → ${seg.end}`
                      : `P${seg.processId}: ${seg.start} → ${seg.end}`
                  }
                >
                  {isIdle ? t("idle") : `P${seg.processId}`}
                </div>
              );
            })}
          </div>

          {/* Zaman etiketleri */}
          <div className="font-display relative mt-1 h-5 text-[11px] font-medium tabular-nums text-muted">
            {segments.map((seg, i) => (
              <span
                key={i}
                style={{
                  left: `${((seg.start - segments[0].start) / totalDuration) * 100}%`,
                  animationDelay: `${i * STAGGER_DELAY}s`,
                }}
                className="absolute -translate-x-1/2 animate-pop-in first:translate-x-0"
              >
                {seg.start}
              </span>
            ))}
            <span
              style={{
                animationDelay: `${segments.length * STAGGER_DELAY}s`,
              }}
              className="absolute right-0 translate-x-0 animate-pop-in"
            >
              {segments[segments.length - 1].end}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
