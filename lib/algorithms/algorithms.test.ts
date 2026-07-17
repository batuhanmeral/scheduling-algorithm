import { describe, expect, it } from "vitest";
import type { Process } from "../types";
import { validateInput } from "../validation";
import { runScheduler } from "./index";
import { mergeSegments } from "./common";

/** Test girdilerini kısa yazmak için yardımcı. */
function p(
  id: number,
  arrivalTime: number,
  burstTime: number,
  priority = 1,
): Process {
  return { id, arrivalTime, burstTime, priority };
}

describe("FCFS", () => {
  it("işlemleri varış sırasına göre kesintisiz çalıştırır", () => {
    const result = runScheduler("FCFS", [p(1, 0, 5), p(2, 1, 3), p(3, 2, 8)]);

    expect(result.gantt).toEqual([
      { processId: 1, start: 0, end: 5 },
      { processId: 2, start: 5, end: 8 },
      { processId: 3, start: 8, end: 16 },
    ]);
    expect(result.processes.map((r) => r.completionTime)).toEqual([5, 8, 16]);
    expect(result.processes.map((r) => r.turnaroundTime)).toEqual([5, 7, 14]);
    expect(result.processes.map((r) => r.waitingTime)).toEqual([0, 4, 6]);
    expect(result.avgWaitingTime).toBeCloseTo(10 / 3);
    expect(result.avgTurnaroundTime).toBeCloseTo(26 / 3);
  });

  it("hiç işlem gelmeden önce boşta (idle) dilimi ekler", () => {
    const result = runScheduler("FCFS", [p(1, 3, 2)]);

    expect(result.gantt).toEqual([
      { processId: null, start: 0, end: 3 },
      { processId: 1, start: 3, end: 5 },
    ]);
    expect(result.processes[0].waitingTime).toBe(0);
  });

  it("varışlar arasındaki boşluklarda idle dilimi ekler", () => {
    const result = runScheduler("FCFS", [p(1, 0, 2), p(2, 5, 1)]);

    expect(result.gantt).toEqual([
      { processId: 1, start: 0, end: 2 },
      { processId: null, start: 2, end: 5 },
      { processId: 2, start: 5, end: 6 },
    ]);
  });
});

describe("SJF (Non-Preemptive)", () => {
  it("karar noktasında en kısa burst'ü seçer, çalışanı kesmez", () => {
    // Klasik örnek: P1(0,7) P2(2,4) P3(4,1) P4(5,4)
    const result = runScheduler("SJF", [
      p(1, 0, 7),
      p(2, 2, 4),
      p(3, 4, 1),
      p(4, 5, 4),
    ]);

    expect(result.gantt).toEqual([
      { processId: 1, start: 0, end: 7 },
      { processId: 3, start: 7, end: 8 },
      { processId: 2, start: 8, end: 12 },
      { processId: 4, start: 12, end: 16 },
    ]);
    expect(result.processes.map((r) => r.waitingTime)).toEqual([0, 6, 3, 7]);
    expect(result.avgWaitingTime).toBeCloseTo(4);
  });

  it("burst eşitliğinde erken varan işlemi seçer", () => {
    const result = runScheduler("SJF", [p(1, 0, 8), p(2, 3, 4), p(3, 1, 4)]);

    // t=8'de P2 ve P3'ün burst'ü eşit (4); P3 daha erken vardığı için önce çalışır.
    expect(result.gantt).toEqual([
      { processId: 1, start: 0, end: 8 },
      { processId: 3, start: 8, end: 12 },
      { processId: 2, start: 12, end: 16 },
    ]);
  });
});

describe("SRTF (Preemptive)", () => {
  it("daha kısa kalan süreli varış çalışanı keser (preemption)", () => {
    // Klasik örnek: P1(0,8) P2(1,4) P3(2,9) P4(3,5) → ort. WT 6.5
    const result = runScheduler("SRTF", [
      p(1, 0, 8),
      p(2, 1, 4),
      p(3, 2, 9),
      p(4, 3, 5),
    ]);

    expect(result.gantt).toEqual([
      { processId: 1, start: 0, end: 1 },
      { processId: 2, start: 1, end: 5 },
      { processId: 4, start: 5, end: 10 },
      { processId: 1, start: 10, end: 17 },
      { processId: 3, start: 17, end: 26 },
    ]);
    expect(result.processes.map((r) => r.completionTime)).toEqual([
      17, 5, 26, 10,
    ]);
    expect(result.avgWaitingTime).toBeCloseTo(6.5);
    expect(result.avgTurnaroundTime).toBeCloseTo(13);
  });

  it("kesinti olmayan senaryoda SJF ile aynı sonucu verir", () => {
    const input = [p(1, 0, 2), p(2, 0, 5), p(3, 0, 1)];
    const srtfResult = runScheduler("SRTF", input);
    const sjfResult = runScheduler("SJF", input);

    expect(srtfResult.gantt).toEqual(
      sjfResult.gantt.map((s) => ({ ...s })),
    );
    expect(srtfResult.avgWaitingTime).toBe(sjfResult.avgWaitingTime);
  });
});

describe("Round Robin", () => {
  it("quantum dolunca işlemi kuyruğun sonuna gönderir", () => {
    // Klasik örnek: q=4, P1(0,24) P2(0,3) P3(0,3) → ort. WT 17/3
    const result = runScheduler(
      "RR",
      [p(1, 0, 24), p(2, 0, 3), p(3, 0, 3)],
      { timeQuantum: 4 },
    );

    expect(result.gantt).toEqual([
      { processId: 1, start: 0, end: 4 },
      { processId: 2, start: 4, end: 7 },
      { processId: 3, start: 7, end: 10 },
      { processId: 1, start: 10, end: 30 }, // bitişik dilimler birleşti
    ]);
    expect(result.processes.map((r) => r.waitingTime)).toEqual([6, 4, 7]);
    expect(result.avgWaitingTime).toBeCloseTo(17 / 3);
  });

  it("quantum sırasında varanlar preempt edilen işlemden önce kuyruğa girer", () => {
    const result = runScheduler(
      "RR",
      [p(1, 0, 5), p(2, 1, 3), p(3, 2, 8)],
      { timeQuantum: 2 },
    );

    expect(result.gantt).toEqual([
      { processId: 1, start: 0, end: 2 },
      { processId: 2, start: 2, end: 4 },
      { processId: 3, start: 4, end: 6 },
      { processId: 1, start: 6, end: 8 },
      { processId: 2, start: 8, end: 9 },
      { processId: 3, start: 9, end: 11 },
      { processId: 1, start: 11, end: 12 },
      { processId: 3, start: 12, end: 16 },
    ]);
    expect(result.processes.map((r) => r.completionTime)).toEqual([12, 9, 16]);
    expect(result.avgWaitingTime).toBeCloseTo(6);
  });

  it("kuyruk boşken bir sonraki varışa kadar idle bekler", () => {
    const result = runScheduler("RR", [p(1, 0, 2), p(2, 6, 2)], {
      timeQuantum: 4,
    });

    expect(result.gantt).toEqual([
      { processId: 1, start: 0, end: 2 },
      { processId: null, start: 2, end: 6 },
      { processId: 2, start: 6, end: 8 },
    ]);
  });
});

describe("Priority (Non-Preemptive)", () => {
  it("küçük öncelik değerini (yüksek öncelik) önce çalıştırır", () => {
    // Klasik örnek: P1(10,pri3) P2(1,pri1) P3(2,pri4) P4(1,pri5) P5(5,pri2), hepsi t=0
    const result = runScheduler("PRIORITY", [
      p(1, 0, 10, 3),
      p(2, 0, 1, 1),
      p(3, 0, 2, 4),
      p(4, 0, 1, 5),
      p(5, 0, 5, 2),
    ]);

    expect(result.gantt).toEqual([
      { processId: 2, start: 0, end: 1 },
      { processId: 5, start: 1, end: 6 },
      { processId: 1, start: 6, end: 16 },
      { processId: 3, start: 16, end: 18 },
      { processId: 4, start: 18, end: 19 },
    ]);
    expect(result.avgWaitingTime).toBeCloseTo(41 / 5);
  });

  it("çalışan işlemi yüksek öncelikli varış kesemez", () => {
    const result = runScheduler("PRIORITY", [p(1, 0, 10, 5), p(2, 1, 2, 1)]);

    expect(result.gantt).toEqual([
      { processId: 1, start: 0, end: 10 },
      { processId: 2, start: 10, end: 12 },
    ]);
  });
});

describe("Priority (Preemptive)", () => {
  it("daha yüksek öncelikli varış çalışanı keser (preemption)", () => {
    const result = runScheduler("PRIORITY_P", [
      p(1, 0, 10, 3),
      p(2, 1, 2, 1),
    ]);

    expect(result.gantt).toEqual([
      { processId: 1, start: 0, end: 1 },
      { processId: 2, start: 1, end: 3 },
      { processId: 1, start: 3, end: 12 },
    ]);
    expect(result.processes.map((r) => r.waitingTime)).toEqual([2, 0]);
  });

  it("aynı öncelikli yeni varış çalışanı kesmez", () => {
    const result = runScheduler("PRIORITY_P", [p(1, 0, 5, 2), p(2, 1, 3, 2)]);

    expect(result.gantt).toEqual([
      { processId: 1, start: 0, end: 5 },
      { processId: 2, start: 5, end: 8 },
    ]);
  });
});

describe("Priority + Aging", () => {
  it("bekleyen düşük öncelikli işlem yaşlanarak CPU'yu devralır", () => {
    // P2(pri 4), her 5 birimde 1 yükselir: t=15'te etkin öncelik 1 olur
    // ve P1'i (pri 2) keser. Aging olmasaydı t=20'ye kadar beklerdi.
    const result = runScheduler("PRIORITY_AGING", [
      p(1, 0, 20, 2),
      p(2, 0, 4, 4),
    ]);

    expect(result.gantt).toEqual([
      { processId: 1, start: 0, end: 15 },
      { processId: 2, start: 15, end: 19 },
      { processId: 1, start: 19, end: 24 },
    ]);
    expect(result.processes.map((r) => r.waitingTime)).toEqual([4, 15]);
  });

  it("yaşlanma gerektirmeyen senaryoda preemptive priority gibi davranır", () => {
    const input = [p(1, 0, 10, 3), p(2, 1, 2, 1)];
    const aging = runScheduler("PRIORITY_AGING", input);
    const preemptive = runScheduler("PRIORITY_P", input);

    expect(aging.gantt).toEqual(preemptive.gantt.map((s) => ({ ...s })));
  });
});

describe("Priority Round Robin", () => {
  it("aynı öncelik seviyesinde düz Round Robin uygular", () => {
    const result = runScheduler(
      "PRIORITY_RR",
      [p(1, 0, 4, 1), p(2, 0, 3, 1)],
      { timeQuantum: 2 },
    );

    expect(result.gantt).toEqual([
      { processId: 1, start: 0, end: 2 },
      { processId: 2, start: 2, end: 4 },
      { processId: 1, start: 4, end: 6 },
      { processId: 2, start: 6, end: 7 },
    ]);
  });

  it("yüksek öncelikli varış çalışanı keser; kesilen kuyruk başına döner", () => {
    const result = runScheduler(
      "PRIORITY_RR",
      [p(1, 0, 5, 2), p(2, 0, 4, 2), p(3, 3, 2, 1)],
      { timeQuantum: 2 },
    );

    expect(result.gantt).toEqual([
      { processId: 1, start: 0, end: 2 },
      { processId: 2, start: 2, end: 3 }, // P3 (pri 1) t=3'te kesti
      { processId: 3, start: 3, end: 5 },
      { processId: 2, start: 5, end: 7 }, // kesilen P2 kuyruk başından devam
      { processId: 1, start: 7, end: 9 },
      { processId: 2, start: 9, end: 10 },
      { processId: 1, start: 10, end: 11 },
    ]);
    expect(result.processes.map((r) => r.completionTime)).toEqual([11, 10, 5]);
  });
});

describe("HRRN", () => {
  it("yanıt oranı (bekleme + burst) / burst en yüksek olanı seçer", () => {
    // t=13'te P4 oranı 12/5=2.4, P5 oranı 7/2=3.5 → P5 önce çalışır.
    const result = runScheduler("HRRN", [
      p(1, 0, 3),
      p(2, 2, 6),
      p(3, 4, 4),
      p(4, 6, 5),
      p(5, 8, 2),
    ]);

    expect(result.gantt).toEqual([
      { processId: 1, start: 0, end: 3 },
      { processId: 2, start: 3, end: 9 },
      { processId: 3, start: 9, end: 13 },
      { processId: 5, start: 13, end: 15 },
      { processId: 4, start: 15, end: 20 },
    ]);
    expect(result.avgWaitingTime).toBeCloseTo(4);
    expect(result.avgTurnaroundTime).toBeCloseTo(8);
  });

  it("bekleme arttıkça uzun işlerin oranı büyür (açlığı önler)", () => {
    // t=0'da tüm oranlar 1 → FCFS gibi id sırası; sonrasında en çok
    // bekleyenin oranı öne geçer.
    const result = runScheduler("HRRN", [p(1, 0, 8), p(2, 0, 4), p(3, 0, 2)]);

    expect(result.gantt).toEqual([
      { processId: 1, start: 0, end: 8 },
      { processId: 3, start: 8, end: 10 },
      { processId: 2, start: 10, end: 14 },
    ]);
  });
});

describe("MLFQ", () => {
  it("quantum'unu bitiren işlem alt kuyruğa iner (demotion)", () => {
    // Q0 q=2, Q1 q=4, Q2 FCFS.
    const result = runScheduler("MLFQ", [p(1, 0, 10), p(2, 1, 3)], {
      timeQuantum: 2,
    });

    expect(result.gantt).toEqual([
      { processId: 1, start: 0, end: 2 }, // Q0 → Q1
      { processId: 2, start: 2, end: 4 }, // Q0 → Q1
      { processId: 1, start: 4, end: 8 }, // Q1 (q=4) → Q2
      { processId: 2, start: 8, end: 9 }, // Q1'de bitti
      { processId: 1, start: 9, end: 13 }, // Q2 (FCFS)
    ]);
    expect(result.processes.map((r) => r.completionTime)).toEqual([13, 9]);
  });

  it("yeni varış alt seviyede çalışanı keser; kesilen seviyesini korur", () => {
    const result = runScheduler("MLFQ", [p(1, 0, 6), p(2, 5, 2)], {
      timeQuantum: 2,
    });

    // P1 Q1'de 2-6 dilimindeyken P2'nin t=5 varışı onu keser.
    expect(result.gantt).toEqual([
      { processId: 1, start: 0, end: 5 },
      { processId: 2, start: 5, end: 7 },
      { processId: 1, start: 7, end: 8 },
    ]);
  });
});

describe("mergeSegments", () => {
  it("aynı işleme ait bitişik dilimleri birleştirir, sıfır uzunluklu dilimleri atar", () => {
    expect(
      mergeSegments([
        { processId: 1, start: 0, end: 2 },
        { processId: 1, start: 2, end: 4 },
        { processId: 2, start: 4, end: 4 },
        { processId: 2, start: 4, end: 6 },
      ]),
    ).toEqual([
      { processId: 1, start: 0, end: 4 },
      { processId: 2, start: 4, end: 6 },
    ]);
  });
});

describe("validateInput", () => {
  it("boş tabloyu reddeder", () => {
    expect(validateInput([], "FCFS", 2)).toEqual({ key: "errorEmptyTable" });
  });

  it("negatif arrival time'ı ilgili işlemle raporlar", () => {
    expect(validateInput([p(1, 0, 3), p(2, -1, 3)], "FCFS", 2)).toEqual({
      key: "errorInvalidArrival",
      processId: 2,
    });
  });

  it("1'den küçük veya NaN burst time'ı reddeder", () => {
    expect(validateInput([p(1, 0, 0)], "FCFS", 2)).toEqual({
      key: "errorInvalidBurst",
      processId: 1,
    });
    expect(validateInput([p(1, 0, NaN)], "FCFS", 2)).toEqual({
      key: "errorInvalidBurst",
      processId: 1,
    });
  });

  it("priority kontrolünü yalnızca PRIORITY algoritmasında yapar", () => {
    const invalid = [p(1, 0, 3, 0)];
    expect(validateInput(invalid, "FCFS", 2)).toBeNull();
    expect(validateInput(invalid, "PRIORITY", 2)).toEqual({
      key: "errorInvalidPriority",
      processId: 1,
    });
  });

  it("time quantum kontrolünü yalnızca RR algoritmasında yapar", () => {
    const valid = [p(1, 0, 3)];
    expect(validateInput(valid, "FCFS", 0)).toBeNull();
    expect(validateInput(valid, "RR", 0)).toEqual({
      key: "errorInvalidQuantum",
    });
  });

  it("geçerli girdide null döner", () => {
    expect(validateInput([p(1, 0, 3), p(2, 2, 5)], "RR", 2)).toBeNull();
  });
});
