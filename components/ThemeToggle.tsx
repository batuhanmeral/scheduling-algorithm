"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "./LanguageProvider";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export default function ThemeToggle() {
  const { t } = useLanguage();
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    const initial =
      stored ??
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    setTheme(initial);
    applyTheme(initial);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    applyTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t("themeToggleAria")}
      className="group rounded-lg border border-neutral-300 bg-white p-2 text-lg leading-none shadow-sm transition-all duration-200 hover:bg-neutral-100 hover:shadow active:scale-90 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700"
    >
      <span className="inline-block transition-transform duration-300 group-hover:rotate-12">
        {theme === "dark" ? "☀️" : "🌙"}
      </span>
    </button>
  );
}
