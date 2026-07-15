import type { SimulationResult } from "./types";

export interface TimelineState {
  /** t anında CPU'da çalışan işlem; boşta ise null. */
  running: number | null;
  /** t anında gelmiş, henüz bitmemiş ve çalışmayan işlemlerin id'leri. */
  ready: number[];
}

/** Gantt'ın başladığı (ilk dilim başı) ve bittiği (son dilim sonu) anlar. */
export function timelineBounds(result: SimulationResult): {
  start: number;
  end: number;
} {
  const { gantt } = result;
  if (gantt.length === 0) return { start: 0, end: 0 };
  return { start: gantt[0].start, end: gantt[gantt.length - 1].end };
}

/**
 * t anındaki CPU durumunu türetir: hangi işlem çalışıyor ve hangileri hazır
 * (gelmiş ama bitmemiş, çalışmayan) durumda bekliyor.
 *
 * Not: Bu, iç kuyruk sırasını birebir yansıtmaz; algoritmadan bağımsız,
 * "o anda bekleyen işlemler" görünümü sunar. Bekleyenler id'ye göre sıralanır.
 */
export function timelineStateAt(
  result: SimulationResult,
  t: number,
): TimelineState {
  // [start, end) aralığını kapsayan dilim çalışıyordur; boşta dilimde null.
  const segment = result.gantt.find((s) => s.start <= t && t < s.end);
  const running = segment ? segment.processId : null;

  const ready = result.processes
    .filter(
      (p) =>
        p.arrivalTime <= t && p.completionTime > t && p.id !== running,
    )
    .map((p) => p.id)
    .sort((a, b) => a - b);

  return { running, ready };
}
