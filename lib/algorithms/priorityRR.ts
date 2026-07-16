import type { GanttSegment, Process } from "../types";
import { buildResult, type Scheduler } from "./common";

/**
 * Priority Round Robin: her öncelik seviyesinin kendi FIFO kuyruğu vardır;
 * her zaman en yüksek öncelikli (en küçük öncelik değeri) boş olmayan
 * kuyruk servis edilir ve o kuyruk içinde Round Robin uygulanır.
 *
 * Kurallar:
 * - Seçilen işlem en fazla bir time quantum çalışır; bitmezse kendi
 *   kuyruğunun sonuna döner.
 * - Daha yüksek öncelikli bir varış çalışanı anında keser (preemption);
 *   kesilen işlem kendi kuyruğunun BAŞINA döner ve quantum sıfırlanır.
 * - Quantum sırasında (bitiş anı dahil) varan aynı/düşük öncelikli
 *   işlemler kuyruğa, preempt edilen işlemden önce eklenir.
 */
export const priorityRR: Scheduler = (processes, options) => {
  const quantum = Math.max(1, options?.timeQuantum ?? 1);
  const sorted = [...processes].sort(
    (a, b) => a.arrivalTime - b.arrivalTime || a.id - b.id,
  );
  const remaining = new Map(processes.map((p) => [p.id, p.burstTime]));
  // Öncelik seviyesi → o seviyenin FIFO kuyruğu.
  const queues = new Map<number, Process[]>();
  const gantt: GanttSegment[] = [];
  let clock = 0;
  let nextArrivalIdx = 0;

  const enqueue = (p: Process, toFront = false) => {
    const queue = queues.get(p.priority) ?? [];
    if (toFront) queue.unshift(p);
    else queue.push(p);
    queues.set(p.priority, queue);
  };

  const enqueueArrivalsUpTo = (time: number) => {
    while (
      nextArrivalIdx < sorted.length &&
      sorted[nextArrivalIdx].arrivalTime <= time
    ) {
      enqueue(sorted[nextArrivalIdx]);
      nextArrivalIdx++;
    }
  };

  /** Boş olmayan en yüksek öncelikli kuyruğun seviyesi; hiçbiri yoksa null. */
  const topLevel = (): number | null => {
    let best: number | null = null;
    for (const [level, queue] of queues) {
      if (queue.length > 0 && (best === null || level < best)) best = level;
    }
    return best;
  };

  enqueueArrivalsUpTo(clock);
  while (topLevel() !== null || nextArrivalIdx < sorted.length) {
    const level = topLevel();
    if (level === null) {
      const nextArrival = sorted[nextArrivalIdx].arrivalTime;
      gantt.push({ processId: null, start: clock, end: nextArrival });
      clock = nextArrival;
      enqueueArrivalsUpTo(clock);
      continue;
    }

    const current = queues.get(level)!.shift()!;
    const rem = remaining.get(current.id)!;
    const sliceEnd = clock + Math.min(quantum, rem);

    // Dilim içinde daha yüksek öncelikli ilk varış çalışanı keser.
    let preemptAt: number | null = null;
    for (
      let i = nextArrivalIdx;
      i < sorted.length && sorted[i].arrivalTime < sliceEnd;
      i++
    ) {
      if (sorted[i].priority < current.priority) {
        preemptAt = sorted[i].arrivalTime;
        break;
      }
    }

    const end = preemptAt ?? sliceEnd;
    gantt.push({ processId: current.id, start: clock, end });
    remaining.set(current.id, rem - (end - clock));
    clock = end;

    enqueueArrivalsUpTo(clock);
    if (remaining.get(current.id)! > 0) {
      enqueue(current, preemptAt !== null);
    }
  }

  return buildResult("PRIORITY_RR", processes, gantt);
};
