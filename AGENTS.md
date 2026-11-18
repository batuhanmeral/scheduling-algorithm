# AGENTS.md

Scheduling Algorithm Simulator, Next.js 16 + React 19 ile yazılmış bir CPU
zamanlama algoritması simülatörüdür. Zamanlama mantığı saf TypeScript olarak
`lib/algorithms/` altındadır. Arayüz `app/` ve `components/` altındadır.

## Commands

| Amaç | Komut |
| --- | --- |
| Tüm testler (tek seferlik, CI uyumlu) | `npm test` |
| Tek test dosyası | `npm test -- lib/algorithms/edgeCases.test.ts` |
| Ada göre tek test | `npm test -- -t "quantum = burst"` |
| Watch modu | `npm run test:watch` |
| Testler + kapsam eşiği | `npm run test:coverage` |
| Lint (yalnızca hatalar engeller) | `npm run lint` |
| Tip kontrolü (`tsc --noEmit`) | `npm run typecheck` |
| Hepsi (lint → typecheck → test:coverage) | `npm run check` |

Bir işi bitirmeden önce `npm run check` geçmelidir.

## Notlar

- Kapsam eşikleri `vitest.config.mts` içindedir; ölçülen değerin hemen
  altına konur ve yalnızca yükseltilir.
- Algoritma testlerinde beklenen değerler elle hesaplanır ve hesap test
  dosyasında yorum olarak yazılır; mevcut çıktı kopyalanmaz.
- Ayrıntılı doküman (Türkçe): `.docs/test-altyapisi.md` (yerel, git'te yok).
