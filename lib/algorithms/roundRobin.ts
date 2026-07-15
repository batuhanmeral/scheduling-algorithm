import type { GanttSegment, Process } from "../types";
import { buildResult, type Scheduler } from "./common";

/**
 * Round Robin: hazır kuyruğundaki işlemler sırayla en fazla bir time
 * quantum kadar çalıştırılır; süresi bitmeyen işlem kuyruğun sonuna döner.
 *
 * Yaygın ders kitabı kuralı uygulanır: quantum sırasında (bitiş anı dahil)
 * varan işlemler kuyruğa, preempt edilen işlemden ÖNCE eklenir.
 */
export const roundRobin: Scheduler = (processes, options) => {
  const quantum = Math.max(1, options?.timeQuantum ?? 1);
  const sorted = [...processes].sort(
    (a, b) => a.arrivalTime - b.arrivalTime || a.id - b.id,
  );
  const remaining = new Map(processes.map((p) => [p.id, p.burstTime]));
  const queue: Process[] = [];
  const gantt: GanttSegment[] = [];
  let clock = 0;
  let nextArrivalIdx = 0;

  const enqueueArrivalsUpTo = (time: number) => {
    while (
      nextArrivalIdx < sorted.length &&
      sorted[nextArrivalIdx].arrivalTime <= time
    ) {
      queue.push(sorted[nextArrivalIdx]);
      nextArrivalIdx++;
    }
  };

  enqueueArrivalsUpTo(clock);
  while (queue.length > 0 || nextArrivalIdx < sorted.length) {
    if (queue.length === 0) {
      const nextArrival = sorted[nextArrivalIdx].arrivalTime;
      gantt.push({ processId: null, start: clock, end: nextArrival });
      clock = nextArrival;
      enqueueArrivalsUpTo(clock);
      continue;
    }

    const current = queue.shift()!;
    const rem = remaining.get(current.id)!;
    const run = Math.min(quantum, rem);

    gantt.push({ processId: current.id, start: clock, end: clock + run });
    clock += run;
    remaining.set(current.id, rem - run);

    enqueueArrivalsUpTo(clock);
    if (remaining.get(current.id)! > 0) {
      queue.push(current);
    }
  }

  return buildResult("RR", processes, gantt);
};
