import type { GanttSegment, Process } from "../types";
import { buildResult, type Scheduler } from "./common";

/**
 * MLFQ (Multi-Level Feedback Queue): üç seviyeli geri beslemeli kuyruk.
 *
 * - Q0: Round Robin, quantum = time quantum
 * - Q1: Round Robin, quantum = 2 × time quantum
 * - Q2: FCFS (bitene kadar çalışır)
 *
 * Kurallar:
 * - Yeni varışlar her zaman Q0'a girer; her zaman boş olmayan en üst
 *   kuyruk servis edilir.
 * - Quantum'unu tamamen kullanan işlem bir alt kuyruğa iner (demotion).
 * - Alt kuyrukta çalışan işlem, yeni bir varış (Q0'a girer) olduğunda
 *   anında kesilir; kesilen işlem seviyesini korur, kuyruğunun başına
 *   döner ve quantum sıfırlanır.
 *
 * Böylece kısa/etkileşimli işler üst kuyruklarda hızla biterken CPU'ya
 * doymayan uzun işler alta inip FCFS ile tamamlanır.
 */
export const mlfq: Scheduler = (processes, options) => {
  const baseQuantum = Math.max(1, options?.timeQuantum ?? 1);
  // Seviye başına quantum; Infinity = FCFS (bitene kadar).
  const quanta = [baseQuantum, baseQuantum * 2, Infinity];
  const queues: Process[][] = [[], [], []];
  const sorted = [...processes].sort(
    (a, b) => a.arrivalTime - b.arrivalTime || a.id - b.id,
  );
  const remaining = new Map(processes.map((p) => [p.id, p.burstTime]));
  const gantt: GanttSegment[] = [];
  let clock = 0;
  let nextArrivalIdx = 0;

  const enqueueArrivalsUpTo = (time: number) => {
    while (
      nextArrivalIdx < sorted.length &&
      sorted[nextArrivalIdx].arrivalTime <= time
    ) {
      queues[0].push(sorted[nextArrivalIdx]);
      nextArrivalIdx++;
    }
  };

  enqueueArrivalsUpTo(clock);
  while (
    queues.some((q) => q.length > 0) ||
    nextArrivalIdx < sorted.length
  ) {
    const level = queues.findIndex((q) => q.length > 0);
    if (level === -1) {
      const nextArrival = sorted[nextArrivalIdx].arrivalTime;
      gantt.push({ processId: null, start: clock, end: nextArrival });
      clock = nextArrival;
      enqueueArrivalsUpTo(clock);
      continue;
    }

    const current = queues[level].shift()!;
    const rem = remaining.get(current.id)!;
    const sliceEnd = clock + Math.min(quanta[level], rem);

    // Q0'a yeni varış, alt seviyede çalışan işlemi anında keser.
    let preemptAt: number | null = null;
    if (
      level > 0 &&
      nextArrivalIdx < sorted.length &&
      sorted[nextArrivalIdx].arrivalTime < sliceEnd
    ) {
      preemptAt = sorted[nextArrivalIdx].arrivalTime;
    }

    const end = preemptAt ?? sliceEnd;
    gantt.push({ processId: current.id, start: clock, end });
    remaining.set(current.id, rem - (end - clock));
    clock = end;

    enqueueArrivalsUpTo(clock);
    if (remaining.get(current.id)! > 0) {
      if (preemptAt !== null) {
        queues[level].unshift(current); // Kesilen seviyesini korur.
      } else {
        queues[Math.min(level + 1, 2)].push(current); // Quantum doldu → in.
      }
    }
  }

  return buildResult("MLFQ", processes, gantt);
};
