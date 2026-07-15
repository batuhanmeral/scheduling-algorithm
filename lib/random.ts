import type { Process } from "./types";

/** Rastgele 4-6 adet işlem üretir. */
export function generateRandomProcesses(): Process[] {
  const count = 4 + Math.floor(Math.random() * 3);
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    arrivalTime: Math.floor(Math.random() * 10),
    burstTime: 1 + Math.floor(Math.random() * 10),
    priority: 1 + Math.floor(Math.random() * 5),
  }));
}
