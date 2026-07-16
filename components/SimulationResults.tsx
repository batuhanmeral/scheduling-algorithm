"use client";

import { timelineBounds } from "@/lib/timeline";
import { ALGORITHMS, type SimulationResult } from "@/lib/types";
import AverageCards from "./AverageCards";
import ExportButtons from "./ExportButtons";
import GanttChart from "./GanttChart";
import { useLanguage } from "./LanguageProvider";
import ResultsTable from "./ResultsTable";

interface SimulationResultsProps {
  result: SimulationResult;
}

export default function SimulationResults({ result }: SimulationResultsProps) {
  const { t } = useLanguage();

  const algorithmLabel =
    ALGORITHMS.find((a) => a.id === result.algorithm)?.label ??
    result.algorithm;

  // Throughput = tamamlanan işlem / toplam süre; CPU kullanımı = dolu geçen
  // sürenin toplam süreye oranı. Toplam süre Gantt'ın kapsadığı aralıktır.
  const { start, end } = timelineBounds(result);
  const totalTime = end - start || 1;
  const busyTime = result.gantt.reduce(
    (sum, seg) => (seg.processId === null ? sum : sum + (seg.end - seg.start)),
    0,
  );
  const throughput = result.processes.length / totalTime;
  const cpuUtilization = (busyTime / totalTime) * 100;

  return (
    <section className="animate-fade-in-up rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          {t("simulationResults")}
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons result={result} />
          <span className="animate-pop-in rounded-full bg-neutral-900 px-3 py-1 text-xs font-medium text-white dark:bg-neutral-100 dark:text-neutral-900">
            {algorithmLabel}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <GanttChart segments={result.gantt} />
        <ResultsTable
          results={result.processes}
          showPriority={result.algorithm === "PRIORITY"}
        />
        <AverageCards
          avgTurnaroundTime={result.avgTurnaroundTime}
          avgWaitingTime={result.avgWaitingTime}
          throughput={throughput}
          cpuUtilization={cpuUtilization}
        />
      </div>
    </section>
  );
}
