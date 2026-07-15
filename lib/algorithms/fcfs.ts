import { buildResult, runNonPreemptive, type Scheduler } from "./common";

/**
 * FCFS (First Come First Serve): işlemler varış sırasına göre,
 * kesintisiz olarak çalıştırılır. Varış eşitliğinde küçük id önce gelir.
 */
export const fcfs: Scheduler = (processes) => {
  const gantt = runNonPreemptive(
    processes,
    (a, b) => a.arrivalTime - b.arrivalTime || a.id - b.id,
  );
  return buildResult("FCFS", processes, gantt);
};
