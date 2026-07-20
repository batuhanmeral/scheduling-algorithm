"use client";

import {
  ALGORITHMS,
  QUANTUM_ALGORITHMS,
  type AlgorithmId,
} from "@/lib/types";
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

const fieldClass = "field px-3 py-2 text-sm";

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
    <section className="card card-hover">
      <h2 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-muted">
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

        {QUANTUM_ALGORITHMS.has(algorithm) && (
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
            className="btn-base btn-primary px-4 py-2 text-sm"
          >
            ▶ {t("calculate")}
          </button>
          <button
            type="button"
            onClick={onCompare}
            disabled={!canCalculate}
            className="btn-base btn-ghost px-4 py-2 text-sm"
          >
            📊 {t("compare")}
          </button>
        </div>
      </div>
    </section>
  );
}
