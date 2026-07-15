"use client";

import { downloadCsv, downloadGanttPng } from "@/lib/export";
import type { SimulationResult } from "@/lib/types";
import { useLanguage } from "./LanguageProvider";

interface ExportButtonsProps {
  result: SimulationResult;
}

const buttonClass =
  "inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-neutral-100 hover:shadow active:translate-y-0 active:scale-95 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700";

export default function ExportButtons({ result }: ExportButtonsProps) {
  const { t } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => downloadCsv(result)}
        className={buttonClass}
      >
        ⬇ {t("exportCsv")}
      </button>
      <button
        type="button"
        onClick={() => downloadGanttPng(result, t("idle"))}
        className={buttonClass}
      >
        ⬇ {t("exportPng")}
      </button>
    </div>
  );
}
