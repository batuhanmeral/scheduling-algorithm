import type { GanttSegment } from "../types";
import { buildResult, type Scheduler } from "./common";

/**
 * SRTF (Shortest Remaining Time First — Preemptive SJF): her an, kalan
 * süresi en kısa olan işlem çalışır. Yeni bir varış daha kısa kalan
 * süreyle gelirse CPU'yu devralır (preemption).
 *
 * Olay güdümlü ilerler: seçilen işlem ya bitene ya da bir sonraki varışa
 * kadar çalıştırılır; ara zaman adımlarını tek tek simüle etmeye gerek
 * kalmaz. Bitişik dilimler buildResult içinde birleştirilir.
 */
export const srtf: Scheduler = (processes) => {
  const remaining = new Map(processes.map((p) => [p.id, p.burstTime]));
  const gantt: GanttSegment[] = [];
  let clock = 0;
  let completed = 0;

  while (completed < processes.length) {
    const pending = processes.filter((p) => remaining.get(p.id)! > 0);
    const available = pending.filter((p) => p.arrivalTime <= clock);

    if (available.length === 0) {
      const nextArrival = Math.min(...pending.map((p) => p.arrivalTime));
      gantt.push({ processId: null, start: clock, end: nextArrival });
      clock = nextArrival;
      continue;
    }

    const current = [...available].sort(
      (a, b) =>
        remaining.get(a.id)! - remaining.get(b.id)! ||
        a.arrivalTime - b.arrivalTime ||
        a.id - b.id,
    )[0];
    const rem = remaining.get(current.id)!;

    // Bir sonraki olaya kadar çalıştır: işlemin bitişi veya yeni bir varış.
    const futureArrivals = pending
      .filter((p) => p.arrivalTime > clock)
      .map((p) => p.arrivalTime);
    const nextEvent = Math.min(clock + rem, ...futureArrivals);

    gantt.push({ processId: current.id, start: clock, end: nextEvent });
    remaining.set(current.id, rem - (nextEvent - clock));
    if (remaining.get(current.id) === 0) completed++;
    clock = nextEvent;
  }

  return buildResult("SRTF", processes, gantt);
};
