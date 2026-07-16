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
    <section className="animate-fade-in-up rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
      <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
        {t("comparisonTitle")}
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full min-w-140 text-sm">
          <thead>
            <tr className="border-b border-neutral-200 text-left text-xs uppercase tracking-wide text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
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
                  className="animate-fade-in-up border-b border-neutral-100 transition-colors last:border-b-0 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/40"
                >
                  <td className="px-3 py-3 font-medium">
                    <span className="flex items-center gap-2">
                      {labelOf(r)}
                      {isBest && (
                        <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-[10px] font-semibold uppercase text-white dark:bg-white dark:text-neutral-900">
                          ★ {t("best")}
                        </span>
                      )}
                    </span>
                  </td>
                  <td
                    className={`px-3 py-3 text-center tabular-nums ${
                      isBest ? "font-bold text-neutral-900 dark:text-white" : ""
                    }`}
                  >
                    {r.avgWaitingTime.toFixed(2)}
                  </td>
                  <td className="px-3 py-3 text-center tabular-nums">
                    {r.avgTurnaroundTime.toFixed(2)}
                  </td>
                  <td className="w-40 px-3 py-3">
                    {/* Ortalama beklemeyi orantılı gösteren monokrom çubuk */}
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                      <div
                        style={{
                          width: `${(r.avgWaitingTime / maxWaiting) * 100}%`,
                        }}
                        className={`h-full origin-[left] animate-grow-bar rounded-full ${
                          isBest
                            ? "bg-neutral-900 dark:bg-white"
                            : "bg-neutral-400 dark:bg-neutral-500"
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
