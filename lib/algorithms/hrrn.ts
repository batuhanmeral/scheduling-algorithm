import { buildResult, runNonPreemptive, type Scheduler } from "./common";

/**
 * HRRN (Highest Response Ratio Next — Non-Preemptive): her karar anında
 * yanıt oranı en YÜKSEK olan işlem seçilir ve bitene kadar çalışır.
 *
 *   Response Ratio = (Bekleme + Burst) / Burst
 *
 * Kısa işleri kayırırken bekleyen uzun işlerin oranı zamanla büyüdüğü
 * için SJF'deki açlık (starvation) sorununu çözer. Eşitlikte önce erken
 * varan, sonra küçük id kazanır.
 */
export const hrrn: Scheduler = (processes) => {
  const gantt = runNonPreemptive(processes, (a, b, clock) => {
    const ratioA = (clock - a.arrivalTime + a.burstTime) / a.burstTime;
    const ratioB = (clock - b.arrivalTime + b.burstTime) / b.burstTime;
    return (
      ratioB - ratioA ||
      a.arrivalTime - b.arrivalTime ||
      a.id - b.id
    );
  });
  return buildResult("HRRN", processes, gantt);
};
