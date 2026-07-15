import type {
  AlgorithmId,
  GanttSegment,
  Process,
  ProcessResult,
  SimulationResult,
} from "../types";

export interface SchedulerOptions {
  timeQuantum?: number;
}

/** Tüm zamanlama algoritmalarının ortak imzası. */
export type Scheduler = (
  processes: Process[],
  options?: SchedulerOptions,
) => SimulationResult;

/**
 * Aynı işleme ait bitişik Gantt dilimlerini tek dilimde birleştirir.
 * Preemptive algoritmalar bir işlemi art arda küçük dilimlerde
 * çalıştırabildiği için şemayı sadeleştirir.
 */
export function mergeSegments(segments: GanttSegment[]): GanttSegment[] {
  const merged: GanttSegment[] = [];
  for (const seg of segments) {
    if (seg.start === seg.end) continue;
    const last = merged[merged.length - 1];
    if (last && last.processId === seg.processId && last.end === seg.start) {
      last.end = seg.end;
    } else {
      merged.push({ ...seg });
    }
  }
  return merged;
}

/**
 * Gantt dilimlerinden CT/TAT/WT değerlerini ve ortalamaları türetir.
 * Bir işlemin Completion Time'ı, o işleme ait son dilimin bitişidir.
 */
export function buildResult(
  algorithm: AlgorithmId,
  processes: Process[],
  gantt: GanttSegment[],
): SimulationResult {
  const merged = mergeSegments(gantt);

  const completion = new Map<number, number>();
  for (const seg of merged) {
    if (seg.processId !== null) {
      completion.set(seg.processId, seg.end);
    }
  }

  const results: ProcessResult[] = [...processes]
    .sort((a, b) => a.id - b.id)
    .map((p) => {
      const completionTime = completion.get(p.id) ?? p.arrivalTime;
      const turnaroundTime = completionTime - p.arrivalTime;
      return {
        ...p,
        completionTime,
        turnaroundTime,
        waitingTime: turnaroundTime - p.burstTime,
      };
    });

  const n = results.length || 1;
  return {
    algorithm,
    gantt: merged,
    processes: results,
    avgTurnaroundTime:
      results.reduce((sum, r) => sum + r.turnaroundTime, 0) / n,
    avgWaitingTime: results.reduce((sum, r) => sum + r.waitingTime, 0) / n,
  };
}

/**
 * Non-preemptive algoritmaların ortak döngüsü: her karar noktasında
 * gelmiş işlemler arasından karşılaştırıcıya göre en öndekini seçer ve
 * bitene kadar çalıştırır. Hiç işlem gelmemişse bir sonraki varışa kadar
 * boşta (idle) dilimi ekler.
 */
export function runNonPreemptive(
  processes: Process[],
  compare: (a: Process, b: Process) => number,
): GanttSegment[] {
  const remaining = [...processes];
  const gantt: GanttSegment[] = [];
  let clock = 0;

  while (remaining.length > 0) {
    const arrived = remaining.filter((p) => p.arrivalTime <= clock);
    if (arrived.length === 0) {
      const nextArrival = Math.min(...remaining.map((p) => p.arrivalTime));
      gantt.push({ processId: null, start: clock, end: nextArrival });
      clock = nextArrival;
      continue;
    }

    const chosen = [...arrived].sort(compare)[0];
    gantt.push({
      processId: chosen.id,
      start: clock,
      end: clock + chosen.burstTime,
    });
    clock += chosen.burstTime;
    remaining.splice(remaining.indexOf(chosen), 1);
  }

  return gantt;
}
