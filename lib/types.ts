export type AlgorithmId = "FCFS" | "SJF" | "SRTF" | "RR" | "PRIORITY";

export interface AlgorithmOption {
  id: AlgorithmId;
  label: string;
}

export const ALGORITHMS: AlgorithmOption[] = [
  { id: "FCFS", label: "FCFS (First Come First Serve)" },
  { id: "SJF", label: "SJF (Shortest Job First - Non-Preemptive)" },
  { id: "SRTF", label: "SRTF (Shortest Remaining Time First)" },
  { id: "RR", label: "Round Robin" },
  { id: "PRIORITY", label: "Priority (Non-Preemptive)" },
];

export interface Process {
  /** Sayısal kimlik; ekranda "P{id}" olarak gösterilir. */
  id: number;
  arrivalTime: number;
  burstTime: number;
  /** Sadece Priority algoritmasında kullanılır (küçük değer = yüksek öncelik). */
  priority: number;
}

/** Gantt şemasındaki tek bir zaman dilimi. processId null ise CPU boşta (idle). */
export interface GanttSegment {
  processId: number | null;
  start: number;
  end: number;
}

export interface ProcessResult extends Process {
  completionTime: number;
  turnaroundTime: number;
  waitingTime: number;
}

export interface SimulationResult {
  algorithm: AlgorithmId;
  gantt: GanttSegment[];
  processes: ProcessResult[];
  avgTurnaroundTime: number;
  avgWaitingTime: number;
}
