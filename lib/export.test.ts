import { describe, expect, it } from "vitest";
import { runScheduler } from "./algorithms";
import { resultToCsv } from "./export";
import type { Process } from "./types";

const PROCESSES: Process[] = [
  { id: 1, arrivalTime: 0, burstTime: 5, priority: 2 },
  { id: 2, arrivalTime: 1, burstTime: 3, priority: 1 },
  { id: 3, arrivalTime: 2, burstTime: 8, priority: 3 },
];

describe("resultToCsv", () => {
  it("Priority dışı algoritmada Priority sütunu olmadan üretir", () => {
    const csv = resultToCsv(runScheduler("FCFS", PROCESSES));
    const lines = csv.split("\n");

    expect(lines[0]).toBe("PID,AT,BT,CT,TAT,WT");
    expect(lines[1]).toBe("P1,0,5,5,5,0");
    expect(lines[2]).toBe("P2,1,3,8,7,4");
    expect(lines[3]).toBe("P3,2,8,16,14,6");
    // Ortalama satırı TAT ve WT sütunlarıyla hizalı (3 boş: AT/BT/CT)
    expect(lines[4]).toBe("Average,,,8.67,3.33");
  });

  it("Priority algoritmasında Priority sütununu ekler ve hizayı korur", () => {
    const csv = resultToCsv(runScheduler("PRIORITY", PROCESSES));
    const lines = csv.split("\n");

    expect(lines[0]).toBe("PID,AT,BT,Priority,CT,TAT,WT");
    // Ortalama satırında 4 boş sütun: AT/BT/Priority/CT
    expect(lines[lines.length - 1].startsWith("Average,,,,")).toBe(true);
    // Her veri satırı başlıkla aynı sütun sayısına sahip
    const columnCount = lines[0].split(",").length;
    expect(lines[1].split(",")).toHaveLength(columnCount);
  });
});
