"use client";

import { useLanguage } from "./LanguageProvider";

interface AverageCardsProps {
  avgTurnaroundTime: number;
  avgWaitingTime: number;
  throughput: number;
  cpuUtilization: number;
}

function StatCard({
  label,
  value,
  unit,
  delay,
}: {
  label: string;
  value: string;
  unit: string;
  delay: number;
}) {
  return (
    <div
      style={{ animationDelay: `${delay}s` }}
      className="animate-fade-in-up rounded-xl border border-neutral-800 bg-neutral-900 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800"
    >
      <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold text-white">
        {value}
        <span className="ml-1 text-sm font-normal text-neutral-500">
          {unit}
        </span>
      </p>
    </div>
  );
}

export default function AverageCards({
  avgTurnaroundTime,
  avgWaitingTime,
  throughput,
  cpuUtilization,
}: AverageCardsProps) {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label={t("avgTurnaround")}
        value={avgTurnaroundTime.toFixed(2)}
        unit={t("timeUnit")}
        delay={0.1}
      />
      <StatCard
        label={t("avgWaiting")}
        value={avgWaitingTime.toFixed(2)}
        unit={t("timeUnit")}
        delay={0.2}
      />
      <StatCard
        label={t("throughput")}
        value={throughput.toFixed(2)}
        unit={t("throughputUnit")}
        delay={0.3}
      />
      <StatCard
        label={t("cpuUtilization")}
        value={cpuUtilization.toFixed(1)}
        unit="%"
        delay={0.4}
      />
    </div>
  );
}
