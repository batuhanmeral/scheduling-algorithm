"use client";

import { ALGORITHMS, type SimulationResult } from "@/lib/types";
import { useLanguage } from "./LanguageProvider";

interface ComparisonPanelProps {
  results: SimulationResult[];
}

export default function ComparisonPanel({ results }: ComparisonPanelProps) {
  const { t } = useLanguage();

  // En düşük ortalama bekleme süresi "en iyi" kabul edilir.
  const bestWaiting = Math.min(...results.map((r) => r.avgWaitingTime));
  // Bekleme çubuklarını orantılamak için en yüksek ortalama.
  const maxWaiting = Math.max(...results.map((r) => r.avgWaitingTime), 1);

  const labelOf = (r: SimulationResult) =>
    ALGORITHMS.find((a) => a.id === r.algorithm)?.label ?? r.algorithm;

  return (
    <section className="animate-fade-in-up card card-hover">
      <h2 className="mb-5 font-display text-sm font-semibold uppercase tracking-wider text-muted">
        {t("comparisonTitle")}
      </h2>

      <div className="overflow-x-auto">
        <table className="font-display w-full min-w-140 text-sm tabular-nums">
          <thead>
            <tr className="font-display border-b border-surface-border text-left text-xs uppercase tracking-wide text-muted">
              <th className="px-3 py-2">{t("algorithm")}</th>
              <th className="px-3 py-2 text-center">{t("avgWaiting")}</th>
              <th className="px-3 py-2 text-center">{t("avgTurnaround")}</th>
              <th className="px-3 py-2">&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => {
              const isBest = r.avgWaitingTime === bestWaiting;
              return (
                <tr
                  key={r.algorithm}
                  style={{ animationDelay: `${i * 0.06}s` }}
                  className="animate-fade-in-up border-b border-surface-border/60 transition-colors last:border-b-0 hover:bg-accent/5"
                >
                  <td className="px-3 py-3 font-medium">
                    <span className="flex items-center gap-2">
                      {labelOf(r)}
                      {isBest && (
                        <span className="rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-accent-text">
                          ★ {t("best")}
                        </span>
                      )}
                    </span>
                  </td>
                  <td
                    className={`px-3 py-3 text-center tabular-nums ${
                      isBest ? "font-bold text-accent-text" : ""
                    }`}
                  >
                    {r.avgWaitingTime.toFixed(2)}
                  </td>
                  <td className="px-3 py-3 text-center tabular-nums">
                    {r.avgTurnaroundTime.toFixed(2)}
                  </td>
                  <td className="w-40 px-3 py-3">
                    {/* Ortalama beklemeyi orantılı gösteren çubuk; en iyi
                        satır accent rengiyle, diğerleri soluk kalır. */}
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-border">
                      <div
                        style={{
                          width: `${(r.avgWaitingTime / maxWaiting) * 100}%`,
                        }}
                        className={`h-full origin-[left] animate-grow-bar rounded-full ${
                          isBest
                            ? "bg-accent"
                            : "bg-muted/45"
                        }`}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
