"use client";

import { useLanguage } from "./LanguageProvider";

export default function LanguageToggle() {
  const { lang, setLang, t } = useLanguage();

  // Tıklayınca diğer dile geçer; buton üzerinde o an aktif dil gösterilir.
  const next = lang === "tr" ? "en" : "tr";

  return (
    <button
      type="button"
      onClick={() => setLang(next)}
      aria-label={t("langToggleAria")}
      title={t("langToggleAria")}
      className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-semibold uppercase text-neutral-700 shadow-sm transition-all duration-200 hover:bg-neutral-100 hover:shadow active:scale-90 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
    >
      {lang}
    </button>
  );
}
