"use client";

import type { TranslationKey } from "@/lib/i18n";
import type { AlgorithmId } from "@/lib/types";
import { useLanguage } from "./LanguageProvider";

interface AlgorithmInfoProps {
  algorithm: AlgorithmId;
}

export default function AlgorithmInfo({ algorithm }: AlgorithmInfoProps) {
  const { t } = useLanguage();
  // i18n anahtarları descFCFS, descSJF, ... deseniyle algoritma id'sine bağlı.
  const descriptionKey = `desc${algorithm}` as TranslationKey;

  return (
    <section
      key={algorithm}
      className="animate-fade-in-up rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
    >
      <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
        <span aria-hidden>💡</span>
        {t("howItWorks")}
      </h2>
      <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
        {t(descriptionKey)}
      </p>
    </section>
  );
}
