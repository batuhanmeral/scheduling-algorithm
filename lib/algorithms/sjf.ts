import { buildResult, runNonPreemptive, type Scheduler } from "./common";

/**
 * SJF (Shortest Job First — Non-Preemptive): her karar noktasında gelmiş
 * işlemler arasından burst time'ı en kısa olan seçilir ve bitene kadar
 * çalışır. Eşitlikte önce erken varan, sonra küçük id kazanır.
 */
export const sjf: Scheduler = (processes) => {
  const gantt = runNonPreemptive(
    processes,
    (a, b) =>
      a.burstTime - b.burstTime ||
      a.arrivalTime - b.arrivalTime ||
      a.id - b.id,
  );
  return buildResult("SJF", processes, gantt);
};
