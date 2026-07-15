"use client";

import { useEffect, useRef, useState } from "react";
import { encodeShareParams, type SharedState } from "@/lib/share";
import { useLanguage } from "./LanguageProvider";

type ShareButtonProps = SharedState;

/** Süre sonunda "Kopyalandı!" geri bildirimi normale döner (ms). */
const FEEDBACK_MS = 2000;

export default function ShareButton(props: ShareButtonProps) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  async function handleShare() {
    const url = `${window.location.origin}${window.location.pathname}?${encodeShareParams(props)}`;
    // Adres çubuğu da paylaşılabilir hâle gelsin.
    window.history.replaceState(null, "", url);
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Pano erişimi yoksa (ör. http) URL yine de adres çubuğunda hazır.
    }
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), FEEDBACK_MS);
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label={t("shareAria")}
      className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 shadow-sm transition-all duration-200 hover:bg-neutral-100 hover:shadow active:scale-95 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
    >
      {copied ? `✓ ${t("copied")}` : `🔗 ${t("share")}`}
    </button>
  );
}
