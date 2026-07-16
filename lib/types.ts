export type AlgorithmId =
  | "FCFS"
  | "SJF"
  | "SRTF"
  | "RR"
  | "PRIORITY"
  | "PRIORITY_P"
  | "PRIORITY_AGING"
  | "PRIORITY_RR"
  | "HRRN"
  | "MLFQ";

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
  { id: "PRIORITY_P", label: "Priority (Preemptive)" },
  { id: "PRIORITY_AGING", label: "Priority + Aging" },
  { id: "PRIORITY_RR", label: "Priority Round Robin" },
  { id: "HRRN", label: "HRRN (Highest Response Ratio Next)" },
  { id: "MLFQ", label: "MLFQ (Multi-Level Feedback Queue)" },
];

/** Priority alanını kullanan algoritmalar; tabloda Priority sütununu gösterir. */
export const PRIORITY_ALGORITHMS: ReadonlySet<AlgorithmId> = new Set([
  "PRIORITY",
  "PRIORITY_P",
  "PRIORITY_AGING",
  "PRIORITY_RR",
]);

/** Time quantum gerektiren algoritmalar; panelde quantum girişini gösterir. */
export const QUANTUM_ALGORITHMS: ReadonlySet<AlgorithmId> = new Set([
  "RR",
  "PRIORITY_RR",
  "MLFQ",
]);

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
