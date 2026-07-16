"use client";

import { ALGORITHMS, type AlgorithmId } from "@/lib/types";
import { useLanguage } from "./LanguageProvider";

interface ControlPanelProps {
  algorithm: AlgorithmId;
  onAlgorithmChange: (algorithm: AlgorithmId) => void;
  timeQuantum: number;
  onTimeQuantumChange: (quantum: number) => void;
  onCalculate: () => void;
  onCompare: () => void;
  canCalculate: boolean;
}

const fieldClass =
  "rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-400/30 dark:border-neutral-700 dark:bg-neutral-800 dark:focus:border-neutral-400";

export default function ControlPanel({
  algorithm,
  onAlgorithmChange,
  timeQuantum,
  onTimeQuantumChange,
  onCalculate,
  onCompare,
  canCalculate,
}: ControlPanelProps) {
  const { t } = useLanguage();

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
        {t("controlPanel")}
      </h2>

      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {t("algorithm")}
          </span>
          <select
            value={algorithm}
            onChange={(e) => onAlgorithmChange(e.target.value as AlgorithmId)}
            className={fieldClass}
          >
            {ALGORITHMS.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label}
              </option>
            ))}
          </select>
        </label>

        {algorithm === "RR" && (
          <label className="flex animate-fade-in-up flex-col gap-1.5">
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              {t("timeQuantum")}
            </span>
            <input
              type="number"
              min={1}
              value={timeQuantum}
              onChange={(e) =>
                onTimeQuantumChange(Math.max(1, Number(e.target.value)))
              }
              className={fieldClass}
            />
          </label>
        )}

        <div className="mt-2 flex flex-col gap-2">
          <button
            type="button"
            onClick={onCalculate}
            disabled={!canCalculate}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-lg active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-sm dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500"
          >
            ▶ {t("calculate")}
          </button>
          <button
            type="button"
            onClick={onCompare}
            disabled={!canCalculate}
            className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-neutral-100 hover:shadow active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
          >
            📊 {t("compare")}
          </button>
        </div>
      </div>
    </section>
  );
}
