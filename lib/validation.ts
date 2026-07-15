import type { TranslationKey } from "./i18n";
import type { AlgorithmId, Process } from "./types";

export interface ValidationError {
  /** Kullanıcıya gösterilecek mesajın çeviri anahtarı. */
  key: TranslationKey;
  /** Hatanın ilgili olduğu işlem (varsa); mesaja "P{id}" olarak eklenir. */
  processId?: number;
}

/**
 * Simülasyon girdilerini doğrular; ilk bulunan hatayı döndürür,
 * geçerliyse null döner.
 */
export function validateInput(
  processes: Process[],
  algorithm: AlgorithmId,
  timeQuantum: number,
): ValidationError | null {
  if (processes.length === 0) {
    return { key: "errorEmptyTable" };
  }

  for (const p of processes) {
    if (!Number.isFinite(p.arrivalTime) || p.arrivalTime < 0) {
      return { key: "errorInvalidArrival", processId: p.id };
    }
    if (!Number.isFinite(p.burstTime) || p.burstTime < 1) {
      return { key: "errorInvalidBurst", processId: p.id };
    }
    if (
      algorithm === "PRIORITY" &&
      (!Number.isFinite(p.priority) || p.priority < 1)
    ) {
      return { key: "errorInvalidPriority", processId: p.id };
    }
  }

  if (algorithm === "RR" && (!Number.isFinite(timeQuantum) || timeQuantum < 1)) {
    return { key: "errorInvalidQuantum" };
  }

  return null;
}
