import { describe, expect, it } from "vitest";
import { runScheduler } from "./algorithms";
import type { Process } from "./types";
import { timelineBounds, timelineStateAt } from "./timeline";

const PROCESSES: Process[] = [
  { id: 1, arrivalTime: 0, burstTime: 5, priority: 1 },
  { id: 2, arrivalTime: 1, burstTime: 3, priority: 1 },
  { id: 3, arrivalTime: 2, burstTime: 8, priority: 1 },
];

// FCFS gantt: P1 0-5, P2 5-8, P3 8-16
const fcfs = runScheduler("FCFS", PROCESSES);

describe("timelineBounds", () => {
  it("ilk dilim başı ve son dilim sonunu döner", () => {
    expect(timelineBounds(fcfs)).toEqual({ start: 0, end: 16 });
  });
});

describe("timelineStateAt", () => {
  it("başlangıçta yalnızca ilk işlem çalışır, kuyruk boştur", () => {
    expect(timelineStateAt(fcfs, 0)).toEqual({ running: 1, ready: [] });
  });

  it("gelmiş ama çalışmayan işlemleri hazır kuyruğunda gösterir", () => {
    expect(timelineStateAt(fcfs, 2)).toEqual({ running: 1, ready: [2, 3] });
  });

  it("tamamlanan işlemi hazır kuyruğuna almaz", () => {
    // t=5: P2 çalışıyor, P1 tamamlandı (CT=5), P3 bekliyor
    expect(timelineStateAt(fcfs, 5)).toEqual({ running: 2, ready: [3] });
  });

  it("son anda CPU boştadır ve kuyruk boştur", () => {
    expect(timelineStateAt(fcfs, 16)).toEqual({ running: null, ready: [] });
  });
});
