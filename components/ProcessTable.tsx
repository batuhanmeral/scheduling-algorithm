"use client";

import { processColor } from "@/lib/colors";
import type { Process } from "@/lib/types";
import { useLanguage } from "./LanguageProvider";

interface ProcessTableProps {
  processes: Process[];
  showPriority: boolean;
  onUpdate: (
    id: number,
    field: "arrivalTime" | "burstTime" | "priority",
    value: number,
  ) => void;
  onAdd: () => void;
  onDelete: (id: number) => void;
  onGenerateRandom: () => void;
  onClearAll: () => void;
}

function TrashIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden
    >
      <path d="M3 6h18" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}

const cellInputClass =
  "w-full rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-center text-sm outline-none transition-all duration-200 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-400/30 dark:border-neutral-700 dark:bg-neutral-800 dark:focus:border-neutral-400";

const headerButtonClass =
  "rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-neutral-100 hover:shadow active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700";

export default function ProcessTable({
  processes,
  showPriority,
  onUpdate,
  onAdd,
  onDelete,
  onGenerateRandom,
  onClearAll,
}: ProcessTableProps) {
  const { t } = useLanguage();

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          {t("processTable")}
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onGenerateRandom}
            className={headerButtonClass}
          >
            🎲 {t("generateRandom")}
          </button>
          <button
            type="button"
            onClick={onClearAll}
            disabled={processes.length === 0}
            className={headerButtonClass}
          >
            🧹 {t("clearAll")}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-105 border-separate border-spacing-y-2 text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              <th className="px-2 py-1">{t("processId")}</th>
              <th className="px-2 py-1 text-center">{t("arrivalTime")}</th>
              <th className="px-2 py-1 text-center">{t("burstTime")}</th>
              {showPriority && (
                <th className="px-2 py-1 text-center">{t("priority")}</th>
              )}
              <th className="w-10 px-2 py-1" />
            </tr>
          </thead>
          <tbody>
            {processes.map((p) => (
              <tr
                key={p.id}
                className="animate-fade-in-up transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/40"
              >
                <td className="rounded-l-lg px-2 py-1">
                  <span className="inline-flex items-center gap-2 font-medium">
                    <span
                      className={`h-3 w-3 rounded-full ${processColor(p.id)}`}
                    />
                    P{p.id}
                  </span>
                </td>
                <td className="px-2 py-1">
                  <input
                    type="number"
                    min={0}
                    value={p.arrivalTime}
                    onChange={(e) =>
                      onUpdate(p.id, "arrivalTime", Number(e.target.value))
                    }
                    className={cellInputClass}
                  />
                </td>
                <td className="px-2 py-1">
                  <input
                    type="number"
                    min={1}
                    value={p.burstTime}
                    onChange={(e) =>
                      onUpdate(p.id, "burstTime", Number(e.target.value))
                    }
                    className={cellInputClass}
                  />
                </td>
                {showPriority && (
                  <td className="px-2 py-1">
                    <input
                      type="number"
                      min={1}
                      value={p.priority}
                      onChange={(e) =>
                        onUpdate(p.id, "priority", Number(e.target.value))
                      }
                      className={cellInputClass}
                    />
                  </td>
                )}
                <td className="rounded-r-lg px-2 py-1 text-center">
                  <button
                    type="button"
                    onClick={() => onDelete(p.id)}
                    aria-label={`P${p.id} ${t("deleteProcessAria")}`}
                    className="rounded-md p-2 text-neutral-400 transition-all duration-200 hover:scale-110 hover:bg-rose-50 hover:text-rose-600 active:scale-95 dark:hover:bg-rose-950/40"
                  >
                    <TrashIcon />
                  </button>
                </td>
              </tr>
            ))}
            {processes.length === 0 && (
              <tr>
                <td
                  colSpan={showPriority ? 5 : 4}
                  className="px-2 py-6 text-center text-neutral-400"
                >
                  {t("emptyTable")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={onAdd}
        className="mt-3 w-full rounded-lg border-2 border-dashed border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-500 transition-all duration-200 hover:border-neutral-500 hover:bg-neutral-50 hover:text-neutral-800 active:scale-[0.99] dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-neutral-500 dark:hover:bg-neutral-800/60 dark:hover:text-neutral-200"
      >
        + {t("addProcess")}
      </button>
    </section>
  );
}
