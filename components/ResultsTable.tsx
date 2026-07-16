"use client";

import { processColor } from "@/lib/colors";
import type { ProcessResult } from "@/lib/types";
import { useLanguage } from "./LanguageProvider";

interface ResultsTableProps {
  results: ProcessResult[];
  showPriority: boolean;
}

export default function ResultsTable({
  results,
  showPriority,
}: ResultsTableProps) {
  const { t } = useLanguage();

  const totalTurnaround = results.reduce((sum, r) => sum + r.turnaroundTime, 0);
  const totalWaiting = results.reduce((sum, r) => sum + r.waitingTime, 0);

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
        {t("resultsTable")}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full min-w-140 text-sm">
          <thead>
            <tr className="border-b border-neutral-200 text-left text-xs uppercase tracking-wide text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
              <th className="px-3 py-2">Process</th>
              <th className="px-3 py-2 text-center">{t("arrivalTime")}</th>
              <th className="px-3 py-2 text-center">{t("burstTime")}</th>
              {showPriority && (
                <th className="px-3 py-2 text-center">{t("priority")}</th>
              )}
              <th className="px-3 py-2 text-center">{t("completionTime")}</th>
              <th className="px-3 py-2 text-center">{t("turnaroundTime")}</th>
              <th className="px-3 py-2 text-center">{t("waitingTime")}</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr
                key={r.id}
                style={{ animationDelay: `${i * 0.06}s` }}
                className="animate-fade-in-up border-b border-neutral-100 transition-colors last:border-b-0 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/40"
              >
                <td className="px-3 py-2">
                  <span className="inline-flex items-center gap-2 font-medium">
                    <span
                      className={`h-3 w-3 rounded-full ${processColor(r.id)}`}
                    />
                    P{r.id}
                  </span>
                </td>
                <td className="px-3 py-2 text-center">{r.arrivalTime}</td>
                <td className="px-3 py-2 text-center">{r.burstTime}</td>
                {showPriority && (
                  <td className="px-3 py-2 text-center">{r.priority}</td>
                )}
                <td className="px-3 py-2 text-center font-medium">
                  {r.completionTime}
                </td>
                <td className="px-3 py-2 text-center font-medium">
                  {r.turnaroundTime}
                </td>
                <td className="px-3 py-2 text-center font-medium">
                  {r.waitingTime}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-neutral-200 dark:border-neutral-700">
              <td
                colSpan={showPriority ? 5 : 4}
                className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400"
              >
                {t("total")}
              </td>
              <td className="px-3 py-2 text-center font-bold">
                {totalTurnaround}
              </td>
              <td className="px-3 py-2 text-center font-bold">
                {totalWaiting}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
