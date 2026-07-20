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

const cellInputClass = "field w-full px-2 py-1.5 text-center text-sm tabular-nums";

const headerButtonClass = "btn-base btn-ghost px-3 py-1.5 text-xs";

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
    <section className="card card-hover">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-muted">
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
        <table className="font-display w-full min-w-105 border-separate border-spacing-y-2 text-sm">
          <thead>
            <tr className="font-display text-left text-xs uppercase tracking-wide text-muted">
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
                className="animate-fade-in-up transition-colors hover:bg-accent/5"
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
                  className="px-2 py-6 text-center text-muted"
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
        className="font-display mt-3 w-full rounded-lg border-2 border-dashed border-surface-border px-4 py-2 text-sm font-medium text-muted transition-all duration-200 hover:border-accent hover:bg-accent/5 hover:text-accent-text active:scale-[0.99]"
      >
        + {t("addProcess")}
      </button>
    </section>
  );
}
