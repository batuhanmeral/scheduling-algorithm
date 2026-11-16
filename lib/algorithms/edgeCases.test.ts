import { describe, expect, it } from "vitest";
import { ALGORITHMS, type Process, type ProcessResult } from "../types";
import { runScheduler } from "./index";

/**
 * Kenar durum testleri. Beklenen değerlerin hepsi elle hesaplandı; her
 * örneğin üstündeki yorumda Gantt sırası ve CT/TAT/WT hesabı yer alır.
 *
 *   CT  = işlemin son diliminin bitişi
 *   TAT = CT - varış
 *   WT  = TAT - burst
 *
 * Not: burstTime = 0 bilinçli olarak burada test edilmiyor. validateInput ve
 * parseShareParams bu girdiyi reddediyor (algorithms.test.ts, share.test.ts);
 * zamanlayıcıların bu girdideki davranışı tanımsız ve ayrıca raporlandı.
 */

function p(
  id: number,
  arrivalTime: number,
  burstTime: number,
  priority = 1,
): Process {
  return { id, arrivalTime, burstTime, priority };
}

/** Sonuçları id sırasıyla [CT, TAT, WT] üçlüleri olarak döner. */
function metrics(processes: ProcessResult[]): number[][] {
  return processes.map((r) => [
    r.completionTime,
    r.turnaroundTime,
    r.waitingTime,
  ]);
}

const ALL_IDS = ALGORITHMS.map((a) => a.id);

describe("boş kuyruk", () => {
  it.each(ALL_IDS)("%s: işlem yoksa boş Gantt ve 0 ortalama döner", (id) => {
    // Çalışacak işlem yok → Gantt boş. Ortalamalar boş küme için
    // buildResult'taki (n || 1) korumasıyla 0 tanımlanır, NaN olmaz.
    const result = runScheduler(id, [], { timeQuantum: 2 });

    expect(result.gantt).toEqual([]);
    expect(result.processes).toEqual([]);
    expect(result.avgTurnaroundTime).toBe(0);
    expect(result.avgWaitingTime).toBe(0);
  });

  it.each(ALL_IDS)(
    "%s: hazır kuyruğu boşaldığında bir sonraki varışa kadar boşta kalır",
    (id) => {
      // P1(AT=2, BT=3), P2(AT=10, BT=2), q=2, aynı öncelik.
      // t=0-2 kimse yok → idle. P1 tek başına 2-5 çalışır (RR/MLFQ'da
      // 2-4 + 4-5 dilimleri bitişik olduğu için tek dilimde birleşir).
      // t=5-10 kuyruk boş → idle. P2 10-12.
      // P1: CT=5,  TAT=5-2=3,   WT=3-3=0
      // P2: CT=12, TAT=12-10=2, WT=2-2=0
      const result = runScheduler(id, [p(1, 2, 3), p(2, 10, 2)], {
        timeQuantum: 2,
      });

      expect(result.gantt).toEqual([
        { processId: null, start: 0, end: 2 },
        { processId: 1, start: 2, end: 5 },
        { processId: null, start: 5, end: 10 },
        { processId: 2, start: 10, end: 12 },
      ]);
      expect(metrics(result.processes)).toEqual([
        [5, 3, 0],
        [12, 2, 0],
      ]);
    },
  );
});

describe("aynı varış zamanı", () => {
  it("FCFS: eşit varışta girdi sırasına değil id sırasına göre çalıştırır", () => {
    // Girdi sırası P3, P1, P2; hepsi t=0'da. Eşitlikte küçük id önce.
    // Gantt: P1 0-4 | P2 4-7 | P3 7-9
    // P1: CT=4, TAT=4, WT=4-4=0
    // P2: CT=7, TAT=7, WT=7-3=4
    // P3: CT=9, TAT=9, WT=9-2=7
    // Ort. TAT = 20/3, ort. WT = 11/3
    const result = runScheduler("FCFS", [p(3, 0, 2), p(1, 0, 4), p(2, 0, 3)]);

    expect(result.gantt).toEqual([
      { processId: 1, start: 0, end: 4 },
      { processId: 2, start: 4, end: 7 },
      { processId: 3, start: 7, end: 9 },
    ]);
    expect(metrics(result.processes)).toEqual([
      [4, 4, 0],
      [7, 7, 4],
      [9, 9, 7],
    ]);
    expect(result.avgTurnaroundTime).toBeCloseTo(20 / 3);
    expect(result.avgWaitingTime).toBeCloseTo(11 / 3);
  });

  it("SJF: önce en kısa burst, eşit burst'te küçük id", () => {
    // Hepsi t=0'da. P3 (BT=1) en kısa; P1 ve P2 BT=3 ile eşit → id.
    // Gantt: P3 0-1 | P1 1-4 | P2 4-7
    // P1: CT=4, TAT=4, WT=1
    // P2: CT=7, TAT=7, WT=4
    // P3: CT=1, TAT=1, WT=0
    // Ort. WT = 5/3
    const result = runScheduler("SJF", [p(2, 0, 3), p(1, 0, 3), p(3, 0, 1)]);

    expect(result.gantt).toEqual([
      { processId: 3, start: 0, end: 1 },
      { processId: 1, start: 1, end: 4 },
      { processId: 2, start: 4, end: 7 },
    ]);
    expect(metrics(result.processes)).toEqual([
      [4, 4, 1],
      [7, 7, 4],
      [1, 1, 0],
    ]);
    expect(result.avgWaitingTime).toBeCloseTo(5 / 3);
  });

  it("SRTF: eşit kalan sürede küçük id önce çalışır", () => {
    // Hepsi t=0'da, girdi sırası P3, P2, P1. P2 ve P3 kalan=2 ile eşit
    // → P2 (küçük id; girdi sırasına göre seçilseydi P3 önce çalışırdı).
    // Yeni varış yok, kesinti olmaz.
    // Gantt: P2 0-2 | P3 2-4 | P1 4-9
    // P1: CT=9, TAT=9, WT=4
    // P2: CT=2, TAT=2, WT=0
    // P3: CT=4, TAT=4, WT=2
    // Ort. WT = 6/3 = 2
    const result = runScheduler("SRTF", [p(3, 0, 2), p(2, 0, 2), p(1, 0, 5)]);

    expect(result.gantt).toEqual([
      { processId: 2, start: 0, end: 2 },
      { processId: 3, start: 2, end: 4 },
      { processId: 1, start: 4, end: 9 },
    ]);
    expect(metrics(result.processes)).toEqual([
      [9, 9, 4],
      [2, 2, 0],
      [4, 4, 2],
    ]);
    expect(result.avgWaitingTime).toBeCloseTo(2);
  });

  it("SRTF: varışta kalan süreler eşitse çalışanı kesmez", () => {
    // P2(0,4), P1(2,2). t=2'de P2 kalan=2, P1 kalan=2 → eşit;
    // erken varan P2 devam eder. (Eşitlik id ile bozulsaydı küçük id'li
    // P1 t=2'de keserdi.)
    // Gantt: P2 0-4 | P1 4-6
    // P1: CT=6, TAT=6-2=4, WT=4-2=2
    // P2: CT=4, TAT=4,     WT=0
    const result = runScheduler("SRTF", [p(2, 0, 4), p(1, 2, 2)]);

    expect(result.gantt).toEqual([
      { processId: 2, start: 0, end: 4 },
      { processId: 1, start: 4, end: 6 },
    ]);
    expect(metrics(result.processes)).toEqual([
      [6, 4, 2],
      [4, 4, 0],
    ]);
  });

  it("Round Robin: eşit varışta kuyruğa id sırasıyla girer", () => {
    // q=2, girdi sırası P2, P1; ikisi de t=0'da → kuyruk [P1, P2].
    // P1 0-2 (kalan 1) → kuyruk [P2, P1]
    // P2 2-4 (kalan 1) → kuyruk [P1, P2]
    // P1 4-5 bitti, P2 5-6 bitti.
    // P1: CT=5, TAT=5, WT=5-3=2
    // P2: CT=6, TAT=6, WT=6-3=3
    const result = runScheduler("RR", [p(2, 0, 3), p(1, 0, 3)], {
      timeQuantum: 2,
    });

    expect(result.gantt).toEqual([
      { processId: 1, start: 0, end: 2 },
      { processId: 2, start: 2, end: 4 },
      { processId: 1, start: 4, end: 5 },
      { processId: 2, start: 5, end: 6 },
    ]);
    expect(metrics(result.processes)).toEqual([
      [5, 5, 2],
      [6, 6, 3],
    ]);
  });

  it("HRRN: yanıt oranları eşitse küçük id seçilir", () => {
    // P1(0,4), P2(1,2), P3(1,2).
    // t=0: yalnız P1 var → P1 0-4.
    // t=4: P2 oranı (3+2)/2 = 2.5, P3 oranı (3+2)/2 = 2.5 → eşit,
    //      varış da eşit → küçük id: P2 4-6.
    // t=6: yalnız P3 → P3 6-8.
    // P1: CT=4, TAT=4, WT=0
    // P2: CT=6, TAT=5, WT=3
    // P3: CT=8, TAT=7, WT=5
    // Ort. WT = 8/3
    const result = runScheduler("HRRN", [p(1, 0, 4), p(3, 1, 2), p(2, 1, 2)]);

    expect(result.gantt).toEqual([
      { processId: 1, start: 0, end: 4 },
      { processId: 2, start: 4, end: 6 },
      { processId: 3, start: 6, end: 8 },
    ]);
    expect(metrics(result.processes)).toEqual([
      [4, 4, 0],
      [6, 5, 3],
      [8, 7, 5],
    ]);
    expect(result.avgWaitingTime).toBeCloseTo(8 / 3);
  });

  it("MLFQ: eşit varışta Q0'da sırayla çalışır, birlikte Q1'e iner", () => {
    // q=1 → Q0 q=1, Q1 q=2. P1(0,3), P2(0,3); ikisi de Q0'da: [P1, P2].
    // P1 0-1 (quantum doldu, kalan 2) → Q1=[P1]
    // P2 1-2 (quantum doldu, kalan 2) → Q1=[P1, P2]
    // Q0 boş → Q1 (q=2): P1 2-4 bitti, P2 4-6 bitti.
    // (Demotion olmasaydı Q0'da q=1 ile 1-2-1-2-1-2 dönüşürlerdi.)
    // P1: CT=4, TAT=4, WT=4-3=1
    // P2: CT=6, TAT=6, WT=6-3=3
    const result = runScheduler("MLFQ", [p(1, 0, 3), p(2, 0, 3)], {
      timeQuantum: 1,
    });

    expect(result.gantt).toEqual([
      { processId: 1, start: 0, end: 1 },
      { processId: 2, start: 1, end: 2 },
      { processId: 1, start: 2, end: 4 },
      { processId: 2, start: 4, end: 6 },
    ]);
    expect(metrics(result.processes)).toEqual([
      [4, 4, 1],
      [6, 6, 3],
    ]);
  });
});

describe("quantum ve burst ilişkisi", () => {
  it("Round Robin: quantum > burst iken FCFS sırasıyla kesintisiz çalışır", () => {
    // q=10, P1(0,3), P2(1,4), P3(2,2). Hiçbir burst quantum'u doldurmaz.
    // Gantt: P1 0-3 | P2 3-7 | P3 7-9
    // P1: CT=3, TAT=3, WT=0
    // P2: CT=7, TAT=6, WT=2
    // P3: CT=9, TAT=7, WT=5
    // Ort. WT = 7/3
    const result = runScheduler("RR", [p(1, 0, 3), p(2, 1, 4), p(3, 2, 2)], {
      timeQuantum: 10,
    });

    expect(result.gantt).toEqual([
      { processId: 1, start: 0, end: 3 },
      { processId: 2, start: 3, end: 7 },
      { processId: 3, start: 7, end: 9 },
    ]);
    expect(metrics(result.processes)).toEqual([
      [3, 3, 0],
      [7, 6, 2],
      [9, 7, 5],
    ]);
    expect(result.avgWaitingTime).toBeCloseTo(7 / 3);
  });

  it("Round Robin: quantum = burst iken işlem tam quantum sonunda biter", () => {
    // q=3, P1(0,3), P2(0,3).
    // P1 0-3 tam quantum kullanır, kalan 0 → biter. P2 3-6.
    // Not: kalan 0 olan işlem kuyruğa geri eklenseydi simülasyon sonsuz
    // döngüye girerdi (0 uzunluklu dilimler birleştirmede atılır); bu test
    // o durumda kırmızıya değil, zaman aşımına/asılmaya düşer.
    // P1: CT=3, TAT=3, WT=0
    // P2: CT=6, TAT=6, WT=3
    const result = runScheduler("RR", [p(1, 0, 3), p(2, 0, 3)], {
      timeQuantum: 3,
    });

    expect(result.gantt).toEqual([
      { processId: 1, start: 0, end: 3 },
      { processId: 2, start: 3, end: 6 },
    ]);
    expect(metrics(result.processes)).toEqual([
      [3, 3, 0],
      [6, 6, 3],
    ]);
  });

  it.each([
    ["verilmezse", undefined],
    ["0 ise", 0],
    ["negatifse", -3],
  ])("Round Robin: quantum %s 1 kabul edilir", (_label, timeQuantum) => {
    // q=1, P1(0,2), P2(0,1). Kuyruk [P1, P2].
    // P1 0-1 (kalan 1) → [P2, P1]; P2 1-2 bitti; P1 2-3 bitti.
    // P1: CT=3, TAT=3, WT=1
    // P2: CT=2, TAT=2, WT=1
    const result = runScheduler(
      "RR",
      [p(1, 0, 2), p(2, 0, 1)],
      timeQuantum === undefined ? undefined : { timeQuantum },
    );

    expect(result.gantt).toEqual([
      { processId: 1, start: 0, end: 1 },
      { processId: 2, start: 1, end: 2 },
      { processId: 1, start: 2, end: 3 },
    ]);
    expect(metrics(result.processes)).toEqual([
      [3, 3, 1],
      [2, 2, 1],
    ]);
  });

  it("MLFQ: quantum > burst iken işlem Q0'da biter, alt kuyruğa inmez", () => {
    // q=10 → Q0 q=10. P1(0,3), P2(1,4).
    // P1 0-3: BT=3 < q=10, quantum dolmadan Q0'da biter.
    // P2 (t=1'de Q0'a girer) 3-7: BT=4 < q=10, Q0'da biter. Hiç demotion yok.
    // (Quantum burst'ten küçük olsaydı, ör. 2, P1 t=2'de Q1'e inerdi.)
    // P1: CT=3, TAT=3, WT=0
    // P2: CT=7, TAT=6, WT=2
    const result = runScheduler("MLFQ", [p(1, 0, 3), p(2, 1, 4)], {
      timeQuantum: 10,
    });

    expect(result.gantt).toEqual([
      { processId: 1, start: 0, end: 3 },
      { processId: 2, start: 3, end: 7 },
    ]);
    expect(metrics(result.processes)).toEqual([
      [3, 3, 0],
      [7, 6, 2],
    ]);
  });

  it("Priority RR: quantum > burst iken yalnızca yüksek öncelikli varış keser", () => {
    // q=10, P1(0,3,pri2), P2(1,4,pri1), P3(2,2,pri2).
    // t=0: P1 0-3 planlanır, ama t=1'de P2 (pri 1 < 2) varır → keser.
    //      P1 0-1, kalan 2, pri2 kuyruğuna döner: [P1] (kuyrukta tek
    //      olduğu için başa/sona eklemek burada fark etmez).
    // t=1: P2 1-5 (BT=4 < q). t=2'de P3 (pri 2) varır, P2'yi kesemez;
    //      pri2 kuyruğu [P1, P3].
    // t=5: P1 5-7 bitti, P3 7-9 bitti.
    // P1: CT=7, TAT=7, WT=7-3=4
    // P2: CT=5, TAT=4, WT=0
    // P3: CT=9, TAT=7, WT=7-2=5
    const result = runScheduler(
      "PRIORITY_RR",
      [p(1, 0, 3, 2), p(2, 1, 4, 1), p(3, 2, 2, 2)],
      { timeQuantum: 10 },
    );

    expect(result.gantt).toEqual([
      { processId: 1, start: 0, end: 1 },
      { processId: 2, start: 1, end: 5 },
      { processId: 1, start: 5, end: 7 },
      { processId: 3, start: 7, end: 9 },
    ]);
    expect(metrics(result.processes)).toEqual([
      [7, 7, 4],
      [5, 4, 0],
      [9, 7, 5],
    ]);
  });
});

describe("eşit öncelik", () => {
  it("Priority (Non-Preemptive): eşit öncelikte burst'e değil varış ve id'ye bakar", () => {
    // Hepsi pri=2. Girdi sırası P4, P3, P2, P1.
    // P1(0,4), P2(2,1), P3(1,3), P4(1,2).
    // t=0: yalnız P1 → P1 0-4.
    // t=4: P2, P3, P4 aynı öncelik. Önce varış: P3 ve P4 (t=1) P2'den
    //      (t=2) önce; P3/P4 eşit varış → küçük id P3 4-7.
    // t=7: P4 (varış 1) P2'den (varış 2) önce → P4 7-9. Sonra P2 9-10.
    // (Burst'e bakılsaydı P2 (BT=1) t=4'te; yalnız id'ye bakılsaydı yine
    // P2; girdi sırasına bakılsaydı P4 önce çalışırdı.)
    // Gantt: P1 0-4 | P3 4-7 | P4 7-9 | P2 9-10
    // P1: CT=4,  TAT=4,  WT=0
    // P2: CT=10, TAT=8,  WT=8-1=7
    // P3: CT=7,  TAT=6,  WT=6-3=3
    // P4: CT=9,  TAT=8,  WT=8-2=6
    // Ort. WT = 16/4 = 4
    const result = runScheduler("PRIORITY", [
      p(4, 1, 2, 2),
      p(3, 1, 3, 2),
      p(2, 2, 1, 2),
      p(1, 0, 4, 2),
    ]);

    expect(result.gantt).toEqual([
      { processId: 1, start: 0, end: 4 },
      { processId: 3, start: 4, end: 7 },
      { processId: 4, start: 7, end: 9 },
      { processId: 2, start: 9, end: 10 },
    ]);
    expect(metrics(result.processes)).toEqual([
      [4, 4, 0],
      [10, 8, 7],
      [7, 6, 3],
      [9, 8, 6],
    ]);
    expect(result.avgWaitingTime).toBeCloseTo(4);
  });

  it("Priority (Preemptive): eşit öncelik ve eşit varışta küçük id önce", () => {
    // Hepsi pri=3, t=0. Girdi sırası P2, P1 → P1 önce.
    // Gantt: P1 0-3 | P2 3-5
    // P1: CT=3, TAT=3, WT=0
    // P2: CT=5, TAT=5, WT=3
    const result = runScheduler("PRIORITY_P", [p(2, 0, 2, 3), p(1, 0, 3, 3)]);

    expect(result.gantt).toEqual([
      { processId: 1, start: 0, end: 3 },
      { processId: 2, start: 3, end: 5 },
    ]);
    expect(metrics(result.processes)).toEqual([
      [3, 3, 0],
      [5, 5, 3],
    ]);
  });

  it("Priority + Aging: eşit öncelikte bekleyen işlem yaşlanıp çalışanı keser", () => {
    // AGING_INTERVAL=5. P1(0,10,pri3), P2(0,4,pri3).
    // t=0: etkin öncelikler eşit (3,3) → küçük id P1 çalışır.
    // t=5: P1 bekleme = 5-0-5 = 0 → etkin 3.
    //      P2 bekleme = 5 → etkin 3 - floor(5/5) = 2 → P2 keser.
    // t=5-9: P2 çalışırken yaşlanmaz (etkin 2); P1 beklemesi 0→4,
    //        etkin 3 kalır. P2 t=9'da biter.
    // t=9-14: P1 kalan 5 birimi çalışır.
    // P1: CT=14, TAT=14, WT=14-10=4
    // P2: CT=9,  TAT=9,  WT=9-4=5
    const result = runScheduler("PRIORITY_AGING", [
      p(1, 0, 10, 3),
      p(2, 0, 4, 3),
    ]);

    expect(result.gantt).toEqual([
      { processId: 1, start: 0, end: 5 },
      { processId: 2, start: 5, end: 9 },
      { processId: 1, start: 9, end: 14 },
    ]);
    expect(metrics(result.processes)).toEqual([
      [14, 14, 4],
      [9, 9, 5],
    ]);
  });
});
