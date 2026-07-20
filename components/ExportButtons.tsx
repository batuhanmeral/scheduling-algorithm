"use client";

import { downloadCsv, downloadGanttPng } from "@/lib/export";
import type { SimulationResult } from "@/lib/types";
import { useLanguage } from "./LanguageProvider";

interface ExportButtonsProps {
  result: SimulationResult;
}

const buttonClass = "btn-base btn-ghost px-3 py-1.5 text-xs";

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
