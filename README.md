# Chronos — Scheduling Algorithm Simulator

Chronos is an interactive, bilingual (TR/EN) educational tool for visualizing operating-system CPU scheduling algorithms. Enter processes, run a scheduler, and watch the Gantt chart, per-process metrics, and averages update instantly — or compare every algorithm side by side to see which one performs best.

![Chronos — Scheduling Algorithm Simulator](docs/image.png)

## Features

- **Five scheduling algorithms** — FCFS, SJF (non-preemptive), SRTF (preemptive), Round Robin (configurable time quantum), and Priority (non-preemptive).
- **Editable process table** — Add, delete, and edit processes, generate a random set, or clear all at once.
- **Gantt chart** — Color-coded, animated timeline of CPU execution with idle periods clearly marked.
- **Results table** — Completion, turnaround, and waiting time per process, plus a totals row.
- **Aggregate metrics** — Average turnaround time, average waiting time, throughput, and CPU utilization.
- **Algorithm comparison** — Run all algorithms on the same input and highlight the best by average waiting time.
- **Export** — Download results as CSV or the Gantt chart as PNG.
- **Shareable links** — The current algorithm and process set are encoded into the URL; opening a shared link restores the inputs and runs the simulation automatically.
- **Theme & language** — Light/dark mode and Turkish/English toggles, both persisted in `localStorage`.

## Algorithms

| Algorithm | Preemptive | Notes |
| --- | --- | --- |
| **FCFS** — First Come First Serve | No | Runs processes in arrival order. |
| **SJF** — Shortest Job First | No | Picks the shortest available burst time next. |
| **SRTF** — Shortest Remaining Time First | Yes | Preemptive variant of SJF; re-evaluates on every arrival. |
| **RR** — Round Robin | Yes | Cycles through processes using a configurable time quantum. |
| **Priority** | No | Runs the highest-priority available process (lower value = higher priority). |

Each process is defined by an **arrival time (AT)**, a **burst time (BT)**, and a **priority** (used only by the Priority algorithm).

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router) with React 19
- [Tailwind CSS 4](https://tailwindcss.com)
- TypeScript
- [Vitest](https://vitest.dev) for unit tests

## Getting Started

Requires [Node.js](https://nodejs.org) 20 or newer.

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Pick an algorithm from the control panel (set a time quantum when Round Robin is selected).
2. Edit the process table by hand, or hit **Generate Random Processes** to get a starter set.
3. Run the simulation to render the Gantt chart, per-process results, and aggregate metrics.
4. Use **Compare** to run every algorithm on the same input and see the best performer by average waiting time.
5. Export the results as CSV or the Gantt chart as PNG, or copy a shareable link that encodes the entire setup.

### Shareable links

The active setup is encoded into the query string as `?algo=RR&tq=3&p=AT-BT-PR,AT-BT-PR,...` — one comma-separated entry per process. Opening such a link restores the algorithm, time quantum, and process list, then runs the simulation automatically. Invalid or incomplete parameters are ignored and fall back to the defaults.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm test` | Run the test suite once |
| `npm run test:watch` | Run tests in watch mode |

## Testing

Unit tests cover the scheduling algorithms, timeline computation, and the export/share logic. Run them with:

```bash
npm test
```

## Project Structure

```
app/          Next.js App Router entry (layout, page, global styles)
components/   React UI components (control panel, tables, charts, toggles)
lib/          Scheduling algorithms, timeline, export, share, and i18n logic
docs/         Screenshots and other documentation assets
```

## License

Released under the [MIT License](LICENSE).
