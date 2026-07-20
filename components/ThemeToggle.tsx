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
      className="btn-base btn-ghost group p-2 text-lg leading-none"
    >
      <span className="inline-block transition-transform duration-300 group-hover:rotate-12">
        {theme === "dark" ? "☀️" : "🌙"}
      </span>
    </button>
  );
}
