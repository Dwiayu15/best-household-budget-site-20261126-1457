// HearthLedger — data for the Prameswari household budget.
// All figures in rupiah. Category budgets are the same each month; the
// "terpakai" (actual) figures differ per month and always add up to the
// month's total spending used by the cashflow chart and dashboard.

window.HL_DATA = {
  family: {
    name: 'Keluarga Prameswari',
    city: 'Jakarta',
    members: '2 dewasa · 2 anak',
    earners: [
      { label: 'Penghasilan Ayah', amount: 12000000 },
      { label: 'Penghasilan Ibu', amount: 6500000 },
    ],
  },

  // The nine budget categories, in display order.
  categories: [
    { id: 'dapur', name: 'Belanja Dapur', icon: '🛒' },
    { id: 'transportasi', name: 'Transportasi', icon: '🚗' },
    { id: 'listrik', name: 'Listrik & Air', icon: '💡' },
    { id: 'internet', name: 'Internet & Pulsa', icon: '📶' },
    { id: 'sekolah', name: 'Sekolah Anak', icon: '🎒' },
    { id: 'kesehatan', name: 'Kesehatan', icon: '🩺' },
    { id: 'cicilan', name: 'Cicilan Rumah', icon: '🏠' },
    { id: 'hiburan', name: 'Hiburan', icon: '🎬' },
    { id: 'lainnya', name: 'Lainnya', icon: '📦' },
  ],

  // Monthly figures. anggaran = budget, terpakai = actual spending.
  // Nov 2026 is the current month (per 26 November 2026).
  months: [
    {
      id: '2026-09', label: 'September 2026', short: 'Sep',
      income: 18500000, savings: 3500000,
      cats: {
        dapur:        { anggaran: 3200000, terpakai: 3050000 },
        transportasi: { anggaran: 1400000, terpakai: 1260000 },
        listrik:      { anggaran: 850000,  terpakai: 815000 },
        internet:     { anggaran: 450000,  terpakai: 450000 },
        sekolah:      { anggaran: 1500000, terpakai: 1500000 },
        kesehatan:    { anggaran: 600000,  terpakai: 210000 },
        cicilan:      { anggaran: 4500000, terpakai: 4500000 },
        hiburan:      { anggaran: 800000,  terpakai: 640000 },
        lainnya:      { anggaran: 700000,  terpakai: 610000 },
      },
    },
    {
      id: '2026-10', label: 'Oktober 2026', short: 'Okt',
      income: 18500000, savings: 3000000,
      cats: {
        dapur:        { anggaran: 3200000, terpakai: 3310000 },
        transportasi: { anggaran: 1400000, terpakai: 1385000 },
        listrik:      { anggaran: 850000,  terpakai: 868000 },
        internet:     { anggaran: 450000,  terpakai: 450000 },
        sekolah:      { anggaran: 1500000, terpakai: 1500000 },
        kesehatan:    { anggaran: 600000,  terpakai: 540000 },
        cicilan:      { anggaran: 4500000, terpakai: 4500000 },
        hiburan:      { anggaran: 800000,  terpakai: 720000 },
        lainnya:      { anggaran: 700000,  terpakai: 455000 },
      },
    },
    {
      id: '2026-11', label: 'November 2026', short: 'Nov', current: true,
      income: 18500000, savings: 3500000,
      cats: {
        dapur:        { anggaran: 3200000, terpakai: 2860000 },
        transportasi: { anggaran: 1400000, terpakai: 1120000 },
        listrik:      { anggaran: 850000,  terpakai: 792000 },
        internet:     { anggaran: 450000,  terpakai: 450000 },
        sekolah:      { anggaran: 1500000, terpakai: 1500000 },
        kesehatan:    { anggaran: 600000,  terpakai: 385000 },
        cicilan:      { anggaran: 4500000, terpakai: 4500000 },
        hiburan:      { anggaran: 800000,  terpakai: 915000 },
        lainnya:      { anggaran: 700000,  terpakai: 540000 },
      },
    },
  ],

  // Six months of cashflow for the dashboard chart (Jun–Nov 2026).
  // Sep/Okt/Nov spending matches the category totals above.
  cashflow: [
    { month: 'Jun', income: 18500000, spending: 12940000 },
    { month: 'Jul', income: 18500000, spending: 13410000 },
    { month: 'Agu', income: 18900000, spending: 13955000 },
    { month: 'Sep', income: 18500000, spending: 13035000 },
    { month: 'Okt', income: 18500000, spending: 13728000 },
    { month: 'Nov', income: 18500000, spending: 13062000 },
  ],

  // Recurring bills. paidNov is the state for November 2026.
  // The November amounts for listrik (607.000 + 185.000 air), internet,
  // sekolah and cicilan match the matching category actuals above.
  bills: [
    { name: 'Cicilan Rumah (KPR)', dueDay: 5, amount: 4500000, note: 'Bank BTN · autodebet', paidNov: true },
    { name: 'SPP Sekolah Anak', dueDay: 10, amount: 1500000, note: 'Dua anak · SD & SMP', paidNov: true },
    { name: 'Air PDAM', dueDay: 15, amount: 185000, note: 'PAM Jaya', paidNov: true },
    { name: 'Listrik PLN', dueDay: 20, amount: 607000, note: 'Pascabayar · 2.200 VA', paidNov: true },
    { name: 'Internet & TV Kabel', dueDay: 25, amount: 450000, note: 'Paket keluarga 100 Mbps', paidNov: true },
    { name: 'Asuransi Kesehatan', dueDay: 28, amount: 350000, note: 'Premi keluarga · belum jatuh tempo', paidNov: false },
  ],

  // Savings goals. The three monthly setoran add up to the November
  // savings figure (Rp 3.500.000).
  goals: [
    { name: 'Dana Darurat', icon: '🛟', target: 50000000, saved: 32000000, monthly: 1500000, note: 'Target 6 bulan biaya hidup, disimpan di rekening terpisah.' },
    { name: 'Liburan Keluarga', icon: '🏖️', target: 15000000, saved: 9000000, monthly: 750000, note: 'Rencana ke Yogyakarta, libur sekolah Juni 2027.' },
    { name: 'Uang Pangkal Sekolah', icon: '🏫', target: 20000000, saved: 12000000, monthly: 1250000, note: 'Masuk SMP anak pertama, tahun ajaran 2027/2028.' },
  ],
};
