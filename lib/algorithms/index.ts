import type { AlgorithmId, Process, SimulationResult } from "../types";
import type { Scheduler, SchedulerOptions } from "./common";
import { fcfs } from "./fcfs";
import { priority } from "./priority";
import { roundRobin } from "./roundRobin";
import { sjf } from "./sjf";
import { srtf } from "./srtf";

export type { Scheduler, SchedulerOptions } from "./common";

const SCHEDULERS: Record<AlgorithmId, Scheduler> = {
  FCFS: fcfs,
  SJF: sjf,
  SRTF: srtf,
  RR: roundRobin,
  PRIORITY: priority,
};

/** Seçilen algoritmaya karşılık gelen zamanlayıcıyı çalıştırır. */
export function runScheduler(
  algorithm: AlgorithmId,
  processes: Process[],
  options?: SchedulerOptions,
): SimulationResult {
  return SCHEDULERS[algorithm](processes, options);
}
