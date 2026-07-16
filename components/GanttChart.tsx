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
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
        {t("ganttChart")}
      </h3>
      <div className="overflow-x-auto pb-1">
        <div className="min-w-120">
          {/* Renkli işlem blokları */}
          <div className="relative flex h-14 overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700">
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
                  className={`flex animate-grow-bar origin-[left] items-center justify-center border-r border-white/40 text-xs font-semibold last:border-r-0 dark:border-black/20 ${
                    isIdle
                      ? "bg-neutral-200 bg-[repeating-linear-gradient(45deg,transparent,transparent_6px,rgba(0,0,0,0.06)_6px,rgba(0,0,0,0.06)_12px)] text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
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
          <div className="relative mt-1 h-5 text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
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
