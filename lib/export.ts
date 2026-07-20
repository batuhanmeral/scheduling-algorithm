import { processHex } from "./colors";
import { PRIORITY_ALGORITHMS, type SimulationResult } from "./types";

/**
 * Bu modüldeki fonksiyonlar yalnızca tarayıcıda, kullanıcı etkileşimiyle
 * (buton tıklaması) çağrılır; document/window'a bu nedenle güvenle erişir.
 */

function triggerDownload(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/** Sonuç tablosunu CSV metnine çevirir (başlıklar standart kısaltmalarla). */
export function resultToCsv(result: SimulationResult): string {
  const showPriority = PRIORITY_ALGORITHMS.has(result.algorithm);
  const header = [
    "PID",
    "AT",
    "BT",
    ...(showPriority ? ["Priority"] : []),
    "CT",
    "TAT",
    "WT",
  ];

  const rows = result.processes.map((p) =>
    [
      `P${p.id}`,
      p.arrivalTime,
      p.burstTime,
      ...(showPriority ? [p.priority] : []),
      p.completionTime,
      p.turnaroundTime,
      p.waitingTime,
    ].join(","),
  );

  const avgPad = showPriority ? ",,,," : ",,,";
  const avgRow = `Average${avgPad}${result.avgTurnaroundTime.toFixed(
    2,
  )},${result.avgWaitingTime.toFixed(2)}`;

  return [header.join(","), ...rows, avgRow].join("\n");
}

export function downloadCsv(result: SimulationResult) {
  const blob = new Blob([resultToCsv(result)], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, `scheduling-${result.algorithm.toLowerCase()}.csv`);
  URL.revokeObjectURL(url);
}

/** Gantt şemasını canvas'a çizip PNG olarak indirir (idleText yerelleştirilir). */
export function downloadGanttPng(result: SimulationResult, idleText: string) {
  const { gantt } = result;
  if (gantt.length === 0) return;

  const start = gantt[0].start;
  const total = gantt[gantt.length - 1].end - start || 1;

  const scale = 2; // Retina için piksel yoğunluğu.
  const pad = 16;
  const barHeight = 56;
  const axisHeight = 22;
  const pxPerUnit = Math.max(24, Math.min(60, 720 / total));
  const width = pad * 2 + total * pxPerUnit;
  const height = pad * 2 + barHeight + axisHeight;

  const canvas = document.createElement("canvas");
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.scale(scale, scale);

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  // Sayfadaki mono tipografiyle uyumlu olsun diye monospace kullanılır.
  // next/font ailesinin adı derleme zamanında hash'lendiği için canvas'tan
  // erişilemez; bu yüzden jenerik ui-monospace'e güveniyoruz.
  ctx.font = "600 13px ui-monospace, monospace";

  for (const seg of gantt) {
    const x = pad + (seg.start - start) * pxPerUnit;
    const w = (seg.end - seg.start) * pxPerUnit;
    const isIdle = seg.processId === null;

    ctx.fillStyle = isIdle ? "#e5e5e5" : processHex(seg.processId!);
    ctx.fillRect(x, pad, w, barHeight);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, pad, w, barHeight);

    ctx.fillStyle = isIdle ? "#737373" : "#ffffff";
    ctx.fillText(
      isIdle ? idleText : `P${seg.processId}`,
      x + w / 2,
      pad + barHeight / 2,
    );
  }

  // Zaman ekseni etiketleri (her dilim sınırı + son).
  ctx.fillStyle = "#737373";
  ctx.font = "500 11px ui-monospace, monospace";
  const axisY = pad + barHeight + axisHeight / 2;
  for (const seg of gantt) {
    const x = pad + (seg.start - start) * pxPerUnit;
    ctx.textAlign = seg.start === start ? "left" : "center";
    ctx.fillText(String(seg.start), x, axisY);
  }
  ctx.textAlign = "right";
  ctx.fillText(String(gantt[gantt.length - 1].end), width - pad, axisY);

  triggerDownload(
    canvas.toDataURL("image/png"),
    `gantt-${result.algorithm.toLowerCase()}.png`,
  );
}
