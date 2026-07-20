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
      className="animate-fade-in-up card card-hover"
    >
      <h2 className="mb-2 flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-wider text-muted">
        <span aria-hidden>💡</span>
        {t("howItWorks")}
      </h2>
      {/* Tek uzun paragraf olduğu için bilinçli olarak Inter'de kalır. */}
      <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
        {t(descriptionKey)}
      </p>
    </section>
  );
}
