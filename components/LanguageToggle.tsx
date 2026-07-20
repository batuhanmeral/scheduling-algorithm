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
      className="btn-base btn-ghost px-3 py-2 text-xs uppercase"
    >
      {lang}
    </button>
  );
}
