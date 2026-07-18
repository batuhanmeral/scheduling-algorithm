import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { LanguageProvider } from "@/components/LanguageProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Chronos - Scheduling Algorithm Simulator",
  description:
    "İşletim sistemleri CPU zamanlama (scheduling) algoritmalarını interaktif olarak görselleştiren eğitim aracı: FCFS, SJF, SRTF, Round Robin ve Priority.",
};

/**
 * Sayfa boyanmadan önce kayıtlı temayı uygular; böylece karanlık modda
 * açılışta beyaz parlama (FOUC) olmaz.
 */
const themeInitScript = `
try {
  const stored = localStorage.getItem("theme");
  const dark = stored ? stored === "dark"
    : window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.classList.toggle("dark", dark);
} catch {}
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
