export type Lang = "tr" | "en";

/**
 * Tüm arayüz metinleri. Yeni bir metin eklerken her iki dile de
 * eklenmelidir; TranslationKey tipi bunu derleme zamanında zorlar.
 */
export const translations = {
  tr: {
    appTitle: "Chronos - Zamanlama Algoritması Simülatörü",
    appSubtitle:
      "İşletim sistemlerindeki CPU zamanlama algoritmalarını görselleştirerek öğrenin.",
    appBadge: "algoritma",
    controlPanel: "Kontrol Paneli",
    algorithm: "Algoritma",
    timeQuantum: "Time Quantum",
    generateRandom: "Rastgele İşlemler Üret",
    clearAll: "Tümünü Temizle",
    calculate: "Hesapla ve Çiz",
    processTable: "İşlem Tablosu",
    processId: "Process ID",
    arrivalTime: "Arrival Time (AT)",
    burstTime: "Burst Time (BT)",
    priority: "Priority",
    emptyTable: 'Henüz işlem yok. "Yeni İşlem Ekle" ile başlayın.',
    addProcess: "Yeni İşlem Ekle",
    deleteProcessAria: "işlemini sil",
    simulationResults: "Simülasyon Sonuçları",
    ganttChart: "Gantt Şeması",
    resultsTable: "Sonuç Tablosu",
    idle: "Boşta",
    completionTime: "Completion Time (CT)",
    turnaroundTime: "Turnaround Time (TAT)",
    waitingTime: "Waiting Time (WT)",
    avgTurnaround: "Ortalama Turnaround Time",
    avgWaiting: "Ortalama Waiting Time",
    throughput: "Throughput",
    cpuUtilization: "CPU Kullanımı",
    throughputUnit: "işlem/birim",
    total: "Toplam",
    timeUnit: "birim",
    themeToggleAria: "Tema değiştir",
    langToggleAria: "Dil değiştir",
    errorEmptyTable: "Simülasyon için en az bir işlem ekleyin.",
    errorInvalidArrival: "Arrival Time 0 veya daha büyük bir sayı olmalı:",
    errorInvalidBurst: "Burst Time 1 veya daha büyük bir sayı olmalı:",
    errorInvalidPriority: "Priority 1 veya daha büyük bir sayı olmalı:",
    errorInvalidQuantum: "Time Quantum 1 veya daha büyük bir sayı olmalı.",
    compare: "Tümünü Karşılaştır",
    howItWorks: "Nasıl Çalışır?",
    descFCFS:
      "İşlemler varış sırasına göre, sıraya girdikleri gibi kesintisiz çalışır. Basittir; ancak uzun bir işlem öndeyse kısa işlemler uzun süre bekler (convoy etkisi).",
    descSJF:
      "Her karar anında bekleyenler arasından en kısa işlemi seçer (kesintisiz). Ortalama bekleme süresini en aza indirir, fakat uzun işlemler açlığa (starvation) uğrayabilir.",
    descSRTF:
      "SJF'nin kesintili (preemptive) hâli. Kalan süresi daha kısa bir işlem geldiğinde CPU'yu devralır. Bekleme süresi genelde düşer, bağlam değişimi (context switch) artar.",
    descRR:
      "Her işlem sırayla en fazla bir 'time quantum' kadar çalışır; bitmezse kuyruğun sonuna döner. Adildir ve etkileşimli sistemlere uygundur; quantum seçimi kritiktir.",
    descPRIORITY:
      "Her karar anında en yüksek öncelikli (en küçük öncelik değeri) işlem çalışır (kesintisiz). Düşük öncelikli işlemler açlığa uğrayabilir; yaşlandırma (aging) ile önlenebilir.",
    descPRIORITY_P:
      "Priority'nin kesintili (preemptive) hâli. Daha yüksek öncelikli bir işlem geldiğinde çalışanı keser ve CPU'yu devralır. Yanıt süresi iyileşir; düşük öncelikliler yine açlığa uğrayabilir.",
    descPRIORITY_AGING:
      "Preemptive Priority + yaşlandırma: hazır kuyruğunda bekleyen işlemin etkin önceliği her 5 birimde 1 yükselir. Böylece düşük öncelikli işlemler de eninde sonunda CPU alır; açlık önlenir.",
    descPRIORITY_RR:
      "Her öncelik seviyesinin kendi kuyruğu vardır; en yüksek öncelikli kuyruk içinde Round Robin uygulanır. Daha yüksek öncelikli varış çalışanı keser. Öncelik + adil paylaşımı birleştirir.",
    descHRRN:
      "Her karar anında yanıt oranı (bekleme + burst) / burst en yüksek olan işlem çalışır (kesintisiz). Bekleyen uzun işlerin oranı zamanla büyüdüğü için SJF'deki açlık sorununu çözer.",
    descMLFQ:
      "Üç seviyeli geri beslemeli kuyruk: Q0 (RR, quantum), Q1 (RR, 2×quantum), Q2 (FCFS). Quantum'unu bitiren işlem alta iner; yeni varışlar Q0'a girer ve alttaki çalışanı keser. Kısa işler hızlı, uzun işler altta tamamlanır.",
    share: "Paylaş",
    copied: "Kopyalandı!",
    shareAria: "Simülasyonu bağlantıyla paylaş",
    comparisonTitle: "Algoritma Karşılaştırması",
    best: "En iyi",
    exportCsv: "CSV",
    exportPng: "PNG",
  },
  en: {
    appTitle: "Chronos - Scheduling Algorithm Simulator",
    appSubtitle:
      "Learn operating system CPU scheduling algorithms through visualization.",
    appBadge: "algorithms",
    controlPanel: "Control Panel",
    algorithm: "Algorithm",
    timeQuantum: "Time Quantum",
    generateRandom: "Generate Random Processes",
    clearAll: "Clear All Processes",
    calculate: "Calculate & Simulate",
    processTable: "Process Table",
    processId: "Process ID",
    arrivalTime: "Arrival Time (AT)",
    burstTime: "Burst Time (BT)",
    priority: "Priority",
    emptyTable: 'No processes yet. Start with "Add Process".',
    addProcess: "Add Process",
    deleteProcessAria: "delete process",
    simulationResults: "Simulation Results",
    ganttChart: "Gantt Chart",
    resultsTable: "Results Table",
    idle: "Idle",
    completionTime: "Completion Time (CT)",
    turnaroundTime: "Turnaround Time (TAT)",
    waitingTime: "Waiting Time (WT)",
    avgTurnaround: "Average Turnaround Time",
    avgWaiting: "Average Waiting Time",
    throughput: "Throughput",
    cpuUtilization: "CPU Utilization",
    throughputUnit: "proc/unit",
    total: "Total",
    timeUnit: "units",
    themeToggleAria: "Toggle theme",
    langToggleAria: "Change language",
    errorEmptyTable: "Add at least one process to run the simulation.",
    errorInvalidArrival: "Arrival Time must be a number greater than or equal to 0:",
    errorInvalidBurst: "Burst Time must be a number greater than or equal to 1:",
    errorInvalidPriority: "Priority must be a number greater than or equal to 1:",
    errorInvalidQuantum: "Time Quantum must be a number greater than or equal to 1.",
    compare: "Compare All",
    howItWorks: "How It Works",
    descFCFS:
      "Processes run in their arrival order, without interruption. Simple, but short jobs wait a long time behind a long one (the convoy effect).",
    descSJF:
      "At each decision point it picks the shortest available job (no preemption). Minimizes average waiting time, but long jobs may starve.",
    descSRTF:
      "The preemptive version of SJF. A newly arrived job with a shorter remaining time takes over the CPU. Usually lowers waiting time at the cost of more context switches.",
    descRR:
      "Each process runs for at most one time quantum in turn, then goes to the back of the queue if unfinished. Fair and suited to interactive systems; the quantum size is critical.",
    descPRIORITY:
      "At each decision point the highest-priority job (smallest priority value) runs, without preemption. Low-priority jobs may starve; aging can prevent this.",
    descPRIORITY_P:
      "The preemptive version of Priority. A newly arrived higher-priority job interrupts the running one and takes over the CPU. Improves response time; low-priority jobs may still starve.",
    descPRIORITY_AGING:
      "Preemptive Priority with aging: a job waiting in the ready queue gains one effective priority level every 5 time units. Low-priority jobs eventually get the CPU, preventing starvation.",
    descPRIORITY_RR:
      "Each priority level has its own queue; the highest-priority queue is served with Round Robin. A higher-priority arrival preempts the running job. Combines priorities with fair sharing.",
    descHRRN:
      "At each decision point the job with the highest response ratio (waiting + burst) / burst runs, without preemption. Waiting jobs' ratios grow over time, solving SJF's starvation problem.",
    descMLFQ:
      "Three-level feedback queue: Q0 (RR, quantum), Q1 (RR, 2×quantum), Q2 (FCFS). A job that uses its full quantum is demoted; new arrivals enter Q0 and preempt lower-level work. Short jobs finish fast, long jobs settle at the bottom.",
    share: "Share",
    copied: "Copied!",
    shareAria: "Share simulation via link",
    comparisonTitle: "Algorithm Comparison",
    best: "Best",
    exportCsv: "CSV",
    exportPng: "PNG",
  },
} as const;

export type TranslationKey = keyof (typeof translations)["tr"];
