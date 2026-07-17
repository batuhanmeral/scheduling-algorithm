import {
  ALGORITHMS,
  QUANTUM_ALGORITHMS,
  type AlgorithmId,
  type Process,
} from "./types";

/** URL üzerinden paylaşılan simülasyon girdileri. */
export interface SharedState {
  algorithm: AlgorithmId;
  timeQuantum: number;
  processes: Process[];
}

const DEFAULT_TIME_QUANTUM = 2;

/**
 * Simülasyon girdilerini query string'e çevirir.
 * Biçim: ?algo=RR&tq=3&p=AT-BT-PR,AT-BT-PR,... (işlem id'leri sıradan türetilir)
 */
export function encodeShareParams(state: SharedState): string {
  const params = new URLSearchParams();
  params.set("algo", state.algorithm);
  if (QUANTUM_ALGORITHMS.has(state.algorithm)) {
    params.set("tq", String(state.timeQuantum));
  }
  params.set(
    "p",
    state.processes
      .map((p) => `${p.arrivalTime}-${p.burstTime}-${p.priority}`)
      .join(","),
  );
  return params.toString();
}

/**
 * Query string'den simülasyon girdilerini çözer; parametreler eksik veya
 * bozuksa null döner. Değer sınırları validateInput ile aynıdır.
 */
export function parseShareParams(search: string): SharedState | null {
  const params = new URLSearchParams(search);
  const algo = params.get("algo");
  const encoded = params.get("p");
  if (!algo || !encoded) return null;
  if (!ALGORITHMS.some((a) => a.id === algo)) return null;

  const processes: Process[] = [];
  for (const part of encoded.split(",")) {
    const nums = part.split("-").map(Number);
    if (nums.length !== 3 || nums.some((n) => !Number.isInteger(n))) {
      return null;
    }
    const [arrivalTime, burstTime, priority] = nums;
    if (arrivalTime < 0 || burstTime < 1 || priority < 1) return null;
    processes.push({ id: processes.length + 1, arrivalTime, burstTime, priority });
  }
  if (processes.length === 0) return null;

  const rawQuantum = Number(params.get("tq") ?? DEFAULT_TIME_QUANTUM);
  const timeQuantum =
    Number.isInteger(rawQuantum) && rawQuantum >= 1
      ? rawQuantum
      : DEFAULT_TIME_QUANTUM;

  return { algorithm: algo as AlgorithmId, timeQuantum, processes };
}
