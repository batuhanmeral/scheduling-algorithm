import { buildResult, runNonPreemptive, type Scheduler } from "./common";

/**
 * Priority (Non-Preemptive): her karar noktasında gelmiş işlemler
 * arasından öncelik değeri en KÜÇÜK olan (en yüksek öncelik) seçilir ve
 * bitene kadar çalışır. Eşitlikte önce erken varan, sonra küçük id kazanır.
 */
export const priority: Scheduler = (processes) => {
  const gantt = runNonPreemptive(
    processes,
    (a, b) =>
      a.priority - b.priority ||
      a.arrivalTime - b.arrivalTime ||
      a.id - b.id,
  );
  return buildResult("PRIORITY", processes, gantt);
};
