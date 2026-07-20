"use client";

import { useEffect, useRef, useState } from "react";
import AlgorithmInfo from "@/components/AlgorithmInfo";
import ComparisonPanel from "@/components/ComparisonPanel";
import ControlPanel from "@/components/ControlPanel";
import { useLanguage } from "@/components/LanguageProvider";
import LanguageToggle from "@/components/LanguageToggle";
import ProcessTable from "@/components/ProcessTable";
import ShareButton from "@/components/ShareButton";
import SimulationResults from "@/components/SimulationResults";
import ThemeToggle from "@/components/ThemeToggle";
import { runScheduler } from "@/lib/algorithms";
import { generateRandomProcesses } from "@/lib/random";
import { parseShareParams } from "@/lib/share";
import {
  ALGORITHMS,
  PRIORITY_ALGORITHMS,
  type AlgorithmId,
  type Process,
  type SimulationResult,
} from "@/lib/types";
import { validateInput, type ValidationError } from "@/lib/validation";

const INITIAL_PROCESSES: Process[] = [
  { id: 1, arrivalTime: 0, burstTime: 5, priority: 2 },
  { id: 2, arrivalTime: 1, burstTime: 3, priority: 1 },
  { id: 3, arrivalTime: 2, burstTime: 8, priority: 3 },
];

export default function Home() {
  const { t } = useLanguage();
  const [algorithm, setAlgorithm] = useState<AlgorithmId>("FCFS");
  const [timeQuantum, setTimeQuantum] = useState(2);
  const [processes, setProcesses] = useState<Process[]>(INITIAL_PROCESSES);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [comparison, setComparison] = useState<SimulationResult[] | null>(null);
  const [error, setError] = useState<ValidationError | null>(null);
  // Her hesaplamada artar; sonuç bölümüne key olarak verilerek
  // giriş animasyonlarının yeniden oynatılmasını sağlar.
  const [runId, setRunId] = useState(0);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Paylaşım bağlantısıyla gelindiyse girdileri URL'den yükle ve hesapla.
  useEffect(() => {
    const shared = parseShareParams(window.location.search);
    if (!shared) return;
    setAlgorithm(shared.algorithm);
    setTimeQuantum(shared.timeQuantum);
    setProcesses(shared.processes);
    if (
      !validateInput(shared.processes, shared.algorithm, shared.timeQuantum)
    ) {
      setResult(
        runScheduler(shared.algorithm, shared.processes, {
          timeQuantum: shared.timeQuantum,
        }),
      );
      setRunId((prev) => prev + 1);
    }
  }, []);

  // Hesapla/karşılaştıra basıldığında sayfayı sonuç bölümüne kaydır.
  useEffect(() => {
    if (runId > 0) {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [runId]);

  /** İşlem listesi değiştiğinde önceki (artık geçersiz) sonuçları temizler. */
  function resetOutputs() {
    setError(null);
    setResult(null);
    setComparison(null);
  }

  function handleAddProcess() {
    resetOutputs();
    setProcesses((prev) => {
      const nextId = prev.reduce((max, p) => Math.max(max, p.id), 0) + 1;
      return [...prev, { id: nextId, arrivalTime: 0, burstTime: 1, priority: 1 }];
    });
  }

  function handleDeleteProcess(id: number) {
    resetOutputs();
    setProcesses((prev) => prev.filter((p) => p.id !== id));
  }

  function handleUpdateProcess(
    id: number,
    field: "arrivalTime" | "burstTime" | "priority",
    value: number,
  ) {
    resetOutputs();
    setProcesses((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    );
  }

  function handleGenerateRandom() {
    resetOutputs();
    setProcesses(generateRandomProcesses());
  }

  function handleClearAll() {
    resetOutputs();
    setProcesses([]);
  }

  function handleCalculate() {
    const validationError = validateInput(processes, algorithm, timeQuantum);
    if (validationError) {
      setError(validationError);
      setResult(null);
      return;
    }
    setError(null);
    setResult(runScheduler(algorithm, processes, { timeQuantum }));
    setRunId((prev) => prev + 1);
  }

  function handleCompare() {
    // Karşılaştırma tüm algoritmaları çalıştırdığı için AT/BT'nin yanı sıra
    // Priority ve Time Quantum da geçerli olmalı; üç kontrolü zincirliyoruz.
    const validationError =
      validateInput(processes, "FCFS", timeQuantum) ??
      validateInput(processes, "PRIORITY", timeQuantum) ??
      validateInput(processes, "RR", timeQuantum);
    if (validationError) {
      setError(validationError);
      setComparison(null);
      return;
    }
    setError(null);
    setComparison(
      ALGORITHMS.map((a) =>
        runScheduler(a.id, processes, { timeQuantum }),
      ),
    );
    setRunId((prev) => prev + 1);
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
      <header className="mb-8 flex animate-fade-in-up flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            {t("appTitle")}
          </h1>
          <p className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-muted">
            <span className="font-display rounded-md border border-accent/30 bg-accent/10 px-2 py-0.5 text-xs font-semibold tabular-nums text-accent-text">
              {ALGORITHMS.length} {t("appBadge")}
            </span>
            {t("appSubtitle")}
          </p>
        </div>
        {/* Üç ayrı kutu yerine tek bir cam araç çubuğu */}
        <div className="toolbar flex items-center gap-1 rounded-xl border border-surface-border bg-surface p-1 backdrop-blur-xl">
          <ShareButton
            algorithm={algorithm}
            timeQuantum={timeQuantum}
            processes={processes}
          />
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>

      <div className="grid animate-fade-in-up grid-cols-1 gap-6 [animation-delay:0.1s] lg:grid-cols-[300px_1fr]">
        <div className="flex flex-col gap-6">
          <ControlPanel
            algorithm={algorithm}
            onAlgorithmChange={setAlgorithm}
            timeQuantum={timeQuantum}
            onTimeQuantumChange={setTimeQuantum}
            onCalculate={handleCalculate}
            onCompare={handleCompare}
            canCalculate={processes.length > 0}
          />
          <AlgorithmInfo algorithm={algorithm} />
        </div>
        <ProcessTable
          processes={processes}
          showPriority={PRIORITY_ALGORITHMS.has(algorithm)}
          onUpdate={handleUpdateProcess}
          onAdd={handleAddProcess}
          onDelete={handleDeleteProcess}
          onGenerateRandom={handleGenerateRandom}
          onClearAll={handleClearAll}
        />
      </div>

      {error && (
        <div
          role="alert"
          className="mt-6 animate-fade-in-up rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-700 backdrop-blur-xl dark:text-rose-300"
        >
          ⚠️ {t(error.key)}
          {error.processId !== undefined && ` P${error.processId}`}
        </div>
      )}

      <div ref={resultsRef} className="scroll-mt-6">
        {result && (
          <div key={`result-${runId}`} className="mt-6">
            <SimulationResults result={result} />
          </div>
        )}

        {comparison && (
          <div key={`comparison-${runId}`} className="mt-6">
            <ComparisonPanel results={comparison} />
          </div>
        )}
      </div>
    </main>
  );
}
