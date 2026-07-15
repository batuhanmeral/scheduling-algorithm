import { describe, expect, it } from "vitest";
import { encodeShareParams, parseShareParams } from "./share";
import type { Process } from "./types";

const PROCESSES: Process[] = [
  { id: 1, arrivalTime: 0, burstTime: 5, priority: 2 },
  { id: 2, arrivalTime: 1, burstTime: 3, priority: 1 },
];

describe("encodeShareParams", () => {
  it("algoritma ve işlemleri query string'e çevirir", () => {
    const query = encodeShareParams({
      algorithm: "FCFS",
      timeQuantum: 2,
      processes: PROCESSES,
    });
    expect(query).toBe("algo=FCFS&p=0-5-2%2C1-3-1");
  });

  it("time quantum'u yalnızca RR için ekler", () => {
    const query = encodeShareParams({
      algorithm: "RR",
      timeQuantum: 3,
      processes: PROCESSES,
    });
    expect(query).toContain("tq=3");
  });
});

describe("parseShareParams", () => {
  it("kodlanan durumu geri çözer (round-trip)", () => {
    const query = encodeShareParams({
      algorithm: "RR",
      timeQuantum: 3,
      processes: PROCESSES,
    });
    expect(parseShareParams(`?${query}`)).toEqual({
      algorithm: "RR",
      timeQuantum: 3,
      processes: PROCESSES,
    });
  });

  it("parametre yoksa null döner", () => {
    expect(parseShareParams("")).toBeNull();
    expect(parseShareParams("?algo=FCFS")).toBeNull();
  });

  it("bilinmeyen algoritmayı reddeder", () => {
    expect(parseShareParams("?algo=XYZ&p=0-5-1")).toBeNull();
  });

  it("bozuk işlem değerlerini reddeder", () => {
    expect(parseShareParams("?algo=FCFS&p=0-5")).toBeNull();
    expect(parseShareParams("?algo=FCFS&p=a-b-c")).toBeNull();
    expect(parseShareParams("?algo=FCFS&p=-1-5-1")).toBeNull();
    expect(parseShareParams("?algo=FCFS&p=0-0-1")).toBeNull();
  });

  it("geçersiz time quantum yerine varsayılanı kullanır", () => {
    expect(parseShareParams("?algo=RR&tq=0&p=0-5-1")?.timeQuantum).toBe(2);
  });
});
