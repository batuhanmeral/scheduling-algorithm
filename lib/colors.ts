/**
 * İşlemlere atanan sabit renk paleti. Bir işlemin rengi id'sine göre
 * belirlenir, böylece Gantt şeması ile tablolar arasında tutarlı kalır.
 */
const PROCESS_COLORS = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-violet-500",
  "bg-rose-500",
  "bg-stone-500",
  "bg-lime-500",
  "bg-fuchsia-500",
  "bg-orange-500",
  "bg-teal-500",
];

export function processColor(processId: number): string {
  return PROCESS_COLORS[(processId - 1) % PROCESS_COLORS.length];
}

/**
 * PROCESS_COLORS ile aynı sıradaki hex karşılıkları (Tailwind tonları).
 * Canvas'a çizim (PNG dışa aktarma) Tailwind sınıflarını okuyamadığı için
 * doğrudan hex değere ihtiyaç duyulur.
 */
const PROCESS_HEX = [
  "#3b82f6", // blue
  "#10b981", // emerald
  "#f59e0b", // amber
  "#8b5cf6", // violet
  "#f43f5e", // rose
  "#78716c", // stone
  "#84cc16", // lime
  "#d946ef", // fuchsia
  "#f97316", // orange
  "#14b8a6", // teal
];

export function processHex(processId: number): string {
  return PROCESS_HEX[(processId - 1) % PROCESS_HEX.length];
}
