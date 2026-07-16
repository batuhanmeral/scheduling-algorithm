import type { GanttSegment, Process } from "../types";
import { buildResult, type Scheduler } from "./common";

/**
 * Hazır kuyruğunda geçirilen her AGING_INTERVAL birim, işlemin etkin
 * öncelik değerini 1 azaltır (öncelik yükselir).
 */
export const AGING_INTERVAL = 5;

/**
 * Priority + Aging (Preemptive): Preemptive Priority'nin açlık (starvation)
 * sorununu yaşlandırma ile çözer. Bekleyen işlemlerin etkin önceliği
 * zamanla yükselir, böylece düşük öncelikli işlemler de eninde sonunda
 * CPU alır.
 *
 *   Etkin öncelik = max(1, priority - floor(bekleme / AGING_INTERVAL))
 *
 * Etkin öncelikler varış olmadan da (sırf zaman geçtiği için) değiştiğinden
 * simülasyon birim zaman adımlarıyla ilerler; bitişik dilimler buildResult
 * içinde birleştirilir. Eşitlikte önce erken varan, sonra küçük id kazanır.
 */
export const priorityAging: Scheduler = (processes) => {
  const remaining = new Map(processes.map((p) => [p.id, p.burstTime]));
  const gantt: GanttSegment[] = [];
  let clock = 0;
  let completed = 0;

  // Bekleme = geçen süre - çalışılan süre; çalışırken yaşlanma durur.
  const effectivePriority = (p: Process) => {
    const executed = p.burstTime - remaining.get(p.id)!;
    const waiting = clock - p.arrivalTime - executed;
    return Math.max(1, p.priority - Math.floor(waiting / AGING_INTERVAL));
  };

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
        effectivePriority(a) - effectivePriority(b) ||
        a.arrivalTime - b.arrivalTime ||
        a.id - b.id,
    )[0];

    // Tek birim çalıştır; sonraki adımda etkin öncelikler yeniden hesaplanır.
    gantt.push({ processId: current.id, start: clock, end: clock + 1 });
    remaining.set(current.id, remaining.get(current.id)! - 1);
    if (remaining.get(current.id) === 0) completed++;
    clock += 1;
  }

  return buildResult("PRIORITY_AGING", processes, gantt);
};
