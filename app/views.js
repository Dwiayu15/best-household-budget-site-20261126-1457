// HearthLedger — view renderers. Each function returns an HTML string for
// one route; main.js wires them to the hash router. All numbers come from
// HL_DATA (data.js) and are formatted here, so every page agrees.

function fmtRp(n) {
  const neg = n < 0;
  const s = String(Math.abs(Math.round(n)));
  return (neg ? '− Rp ' : 'Rp ') + s.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Short label for chart axes: 18500000 -> "18,5 jt"
function fmtJt(n) {
  const v = n / 1000000;
  const t = Number.isInteger(v) ? String(v) : v.toFixed(1).replace('.', ',');
  return t + ' jt';
}

function monthById(id) {
  return HL_DATA.months.find((m) => m.id === id) || HL_DATA.months[HL_DATA.months.length - 1];
}

function currentMonth() {
  return HL_DATA.months.find((m) => m.current) || HL_DATA.months[HL_DATA.months.length - 1];
}

function monthTotals(month) {
  let anggaran = 0;
  let terpakai = 0;
  for (const c of HL_DATA.categories) {
    anggaran += month.cats[c.id].anggaran;
    terpakai += month.cats[c.id].terpakai;
  }
  return { anggaran, terpakai, sisa: month.income - terpakai };
}

// Status rule: at most 80% of budget used is Aman, up to 100% is Waspada,
// anything above the budget is Lewat.
function statusOf(cat) {
  const pct = cat.anggaran === 0 ? 0 : (cat.terpakai / cat.anggaran) * 100;
  if (pct > 100) return { key: 'lewat', label: 'Lewat', pct };
  if (pct > 80) return { key: 'waspada', label: 'Waspada', pct };
  return { key: 'aman', label: 'Aman', pct };
}

function chip(st) {
  return '<span class="chip chip-' + st.key + '">' + st.label + '</span>';
}

function categoryBar(cat, figures) {
  const st = statusOf(figures);
  const width = Math.min(100, st.pct);
  return (
    '<div class="bar-row">' +
      '<div class="bar-head">' +
        '<span class="bar-name">' + cat.icon + ' ' + cat.name + '</span>' +
        '<span class="bar-fig">' + fmtRp(figures.terpakai) + ' <em>dari</em> ' + fmtRp(figures.anggaran) + '</span>' +
      '</div>' +
      '<div class="bar-track"><div class="bar-fill fill-' + st.key + '" style="width:' + width.toFixed(1) + '%"></div></div>' +
      '<div class="bar-sub">' + st.pct.toFixed(0) + '% terpakai · sisa ' + fmtRp(figures.anggaran - figures.terpakai) + '</div>' +
    '</div>'
  );
}

// Grouped bar chart (income vs spending) as inline SVG, built from the
// six cashflow rows so the heights always match the data.
function cashflowChart() {
  const rows = HL_DATA.cashflow;
  const W = 660, H = 280, base = 232, top = 26;
  const max = 20000000;
  const y = (v) => base - (v / max) * (base - top);
  const groupW = W / rows.length;
  const barW = 26;
  let s = '<svg viewBox="0 0 ' + W + ' ' + H + '" class="chart" role="img" aria-label="Grafik arus kas enam bulan">';
  // gridlines at 0 / 10jt / 20jt
  for (const gv of [0, 10000000, 20000000]) {
    s += '<line x1="44" x2="' + (W - 6) + '" y1="' + y(gv) + '" y2="' + y(gv) + '" class="grid" />' +
         '<text x="40" y="' + (y(gv) + 4) + '" class="axis" text-anchor="end">' + fmtJt(gv) + '</text>';
  }
  rows.forEach((r, i) => {
    const cx = 44 + groupW * i + (groupW - 44 / rows.length) / 2;
    const x1 = cx - barW - 3, x2 = cx + 3;
    s += '<rect x="' + x1 + '" y="' + y(r.income) + '" width="' + barW + '" height="' + (base - y(r.income)) + '" rx="4" class="bar-in" />' +
         '<rect x="' + x2 + '" y="' + y(r.spending) + '" width="' + barW + '" height="' + (base - y(r.spending)) + '" rx="4" class="bar-out" />' +
         '<text x="' + (x1 + barW / 2) + '" y="' + (y(r.income) - 6) + '" class="bar-val val-in" text-anchor="middle">' + fmtJt(r.income) + '</text>' +
         '<text x="' + (x2 + barW / 2) + '" y="' + (y(r.spending) - 6) + '" class="bar-val val-out" text-anchor="middle">' + fmtJt(r.spending) + '</text>' +
         '<text x="' + cx + '" y="' + (base + 20) + '" class="axis" text-anchor="middle">' + r.month + '</text>';
  });
  s += '</svg>';
  s += '<div class="legend"><span class="dot dot-in"></span> Pemasukan <span class="dot dot-out"></span> Pengeluaran</div>';
  return s;
}

function goalProgress(goal) {
  return Math.min(100, (goal.saved / goal.target) * 100);
}

function goalEta(goal) {
  const remaining = goal.target - goal.saved;
  if (remaining <= 0) return 'Sudah tercapai';
  const months = Math.ceil(remaining / goal.monthly);
  return '± ' + months + ' bulan lagi';
}

function goalCard(goal, compact) {
  const pct = goalProgress(goal);
  return (
    '<article class="card goal-card">' +
      '<div class="goal-head"><span class="goal-icon">' + goal.icon + '</span><h3>' + goal.name + '</h3>' +
      '<span class="goal-pct">' + pct.toFixed(0) + '%</span></div>' +
      '<div class="bar-track big"><div class="bar-fill fill-aman" style="width:' + pct.toFixed(1) + '%"></div></div>' +
      '<p class="goal-fig">Terkumpul <strong>' + fmtRp(goal.saved) + '</strong> dari ' + fmtRp(goal.target) + '</p>' +
      (compact ? '' :
        '<p class="goal-note">' + goal.note + '</p>' +
        '<p class="goal-eta">Setoran disarankan ' + fmtRp(goal.monthly) + '/bulan · ' + goalEta(goal) + '</p>') +
    '</article>'
  );
}

function renderDashboard() {
  const m = currentMonth();
  const t = monthTotals(m);
  const unpaid = HL_DATA.bills.filter((b) => !b.paidNov);
  const nextTwo = [...HL_DATA.bills].sort((a, b) => a.dueDay - b.dueDay).slice(0, 2);
  let upcoming = '';
  for (const b of unpaid) {
    upcoming += '<li><span class="bill-when">' + b.dueDay + ' Nov</span><span class="bill-name">' + b.name + '</span><span class="bill-amt">' + fmtRp(b.amount) + '</span><span class="chip chip-waspada">Belum bayar</span></li>';
  }
  for (const b of nextTwo) {
    upcoming += '<li><span class="bill-when">' + b.dueDay + ' Des</span><span class="bill-name">' + b.name + '</span><span class="bill-amt">' + fmtRp(b.amount) + '</span><span class="chip chip-aman">Berikutnya</span></li>';
  }
  const bars = HL_DATA.categories.map((c) => categoryBar(c, m.cats[c.id])).join('');
  const goals = HL_DATA.goals.map((g) => goalCard(g, true)).join('');
  return (
    '<section class="hero">' +
      '<h1>Anggaran ' + m.label + '</h1>' +
      '<p>' + HL_DATA.family.name + ' · ' + HL_DATA.family.city + ' · ' + HL_DATA.family.members + '</p>' +
    '</section>' +
    '<section class="cards">' +
      '<article class="card stat"><span class="stat-label">Pemasukan</span><strong class="stat-num">' + fmtRp(m.income) + '</strong><span class="stat-sub">Dua penghasilan tetap</span></article>' +
      '<article class="card stat"><span class="stat-label">Pengeluaran</span><strong class="stat-num">' + fmtRp(t.terpakai) + '</strong><span class="stat-sub">dari anggaran ' + fmtRp(t.anggaran) + '</span></article>' +
      '<article class="card stat"><span class="stat-label">Sisa</span><strong class="stat-num good">' + fmtRp(t.sisa) + '</strong><span class="stat-sub">setelah semua pengeluaran</span></article>' +
      '<article class="card stat"><span class="stat-label">Tabungan bulan ini</span><strong class="stat-num good">' + fmtRp(m.savings) + '</strong><span class="stat-sub">disetor ke 3 tujuan</span></article>' +
    '</section>' +
    '<section class="card panel"><h2>Anggaran vs Terpakai</h2>' + bars +
      '<p class="panel-link"><a href="#/budget">Lihat rincian anggaran →</a></p></section>' +
    '<section class="card panel"><h2>Arus Kas 6 Bulan</h2>' + cashflowChart() + '</section>' +
    '<section class="grid-2">' +
      '<article class="card panel"><h2>Tagihan Berikutnya</h2><ul class="bill-list">' + upcoming + '</ul>' +
        '<p class="panel-link"><a href="#/bills">Semua tagihan →</a></p></article>' +
      '<article class="panel goals-mini"><h2 class="mini-h">Tujuan Tabungan</h2><div class="goals-stack">' + goals + '</div>' +
        '<p class="panel-link"><a href="#/goals">Rincian tujuan →</a></p></article>' +
    '</section>'
  );
}

function renderBudget(monthId) {
  const m = monthById(monthId);
  const t = monthTotals(m);
  const switcher = HL_DATA.months.map((x) =>
    '<button type="button" class="month-btn' + (x.id === m.id ? ' active' : '') + '" data-month="' + x.id + '">' + x.short + ' 2026</button>'
  ).join('');
  let rowsHtml = '';
  for (const c of HL_DATA.categories) {
    const f = m.cats[c.id];
    const st = statusOf(f);
    const sisa = f.anggaran - f.terpakai;
    rowsHtml +=
      '<tr>' +
        '<td class="cat-cell">' + c.icon + ' ' + c.name + '</td>' +
        '<td class="num">' + fmtRp(f.anggaran) + '</td>' +
        '<td class="num">' + fmtRp(f.terpakai) + '</td>' +
        '<td class="num' + (sisa < 0 ? ' neg' : '') + '">' + fmtRp(sisa) + '</td>' +
        '<td>' + chip(st) + '</td>' +
      '</tr>';
  }
  return (
    '<section class="hero"><h1>Anggaran per Kategori</h1><p>Rencana dan realisasi untuk ' + m.label + '. Ganti bulan untuk membandingkan.</p></section>' +
    '<div class="month-switch" role="group" aria-label="Pilih bulan">' + switcher + '</div>' +
    '<section class="card panel">' +
      '<div class="table-wrap"><table class="budget-table">' +
        '<thead><tr><th>Kategori</th><th class="num">Anggaran</th><th class="num">Terpakai</th><th class="num">Sisa</th><th>Status</th></tr></thead>' +
        '<tbody>' + rowsHtml + '</tbody>' +
        '<tfoot><tr><td>Total</td><td class="num">' + fmtRp(t.anggaran) + '</td><td class="num">' + fmtRp(t.terpakai) + '</td><td class="num">' + fmtRp(t.anggaran - t.terpakai) + '</td><td></td></tr></tfoot>' +
      '</table></div>' +
      '<p class="table-note">Pemasukan ' + m.label + ': ' + fmtRp(m.income) + ' · Sisa keseluruhan: ' + fmtRp(t.sisa) + ' · Ditabung: ' + fmtRp(m.savings) + '</p>' +
    '</section>'
  );
}

function renderBills() {
  const m = currentMonth();
  const sorted = [...HL_DATA.bills].sort((a, b) => a.dueDay - b.dueDay);
  const total = sorted.reduce((s, b) => s + b.amount, 0);
  const paidTotal = sorted.filter((b) => b.paidNov).reduce((s, b) => s + b.amount, 0);
  let items = '';
  for (const b of sorted) {
    items +=
      '<li class="bill-item">' +
        '<div class="bill-date"><strong>' + b.dueDay + '</strong><span>Nov</span></div>' +
        '<div class="bill-main"><span class="bill-name">' + b.name + '</span><span class="bill-note">' + b.note + '</span></div>' +
        '<span class="bill-amt">' + fmtRp(b.amount) + '</span>' +
        (b.paidNov ? '<span class="chip chip-aman">Lunas</span>' : '<span class="chip chip-waspada">Belum bayar</span>') +
      '</li>';
  }
  return (
    '<section class="hero"><h1>Tagihan Rutin</h1><p>Jatuh tempo dan status pembayaran untuk ' + m.label + '.</p></section>' +
    '<section class="cards">' +
      '<article class="card stat"><span class="stat-label">Total tagihan / bulan</span><strong class="stat-num">' + fmtRp(total) + '</strong><span class="stat-sub">' + sorted.length + ' tagihan rutin</span></article>' +
      '<article class="card stat"><span class="stat-label">Sudah dibayar</span><strong class="stat-num good">' + fmtRp(paidTotal) + '</strong><span class="stat-sub">' + sorted.filter((b) => b.paidNov).length + ' dari ' + sorted.length + ' tagihan</span></article>' +
      '<article class="card stat"><span class="stat-label">Belum dibayar</span><strong class="stat-num warn">' + fmtRp(total - paidTotal) + '</strong><span class="stat-sub">jatuh tempo 28 November</span></article>' +
    '</section>' +
    '<section class="card panel"><ul class="bill-items">' + items + '</ul></section>'
  );
}

function renderGoals() {
  const totalSaved = HL_DATA.goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = HL_DATA.goals.reduce((s, g) => s + g.target, 0);
  const totalMonthly = HL_DATA.goals.reduce((s, g) => s + g.monthly, 0);
  const cards = HL_DATA.goals.map((g) => goalCard(g, false)).join('');
  return (
    '<section class="hero"><h1>Tujuan Tabungan</h1><p>Tiga tujuan yang sedang dikumpulkan bersama, disetor setiap awal bulan.</p></section>' +
    '<section class="card panel goal-summary">' +
      '<p>Total terkumpul <strong>' + fmtRp(totalSaved) + '</strong> dari target gabungan ' + fmtRp(totalTarget) + '.</p>' +
      '<p>Total setoran yang disarankan: <strong>' + fmtRp(totalMonthly) + ' per bulan</strong> — sesuai tabungan bulan ini.</p>' +
    '</section>' +
    '<section class="goals-grid">' + cards + '</section>'
  );
}

function renderNotFound() {
  return (
    '<section class="card panel notfound">' +
      '<div class="nf-code">404</div>' +
      '<h1>Halaman tidak ditemukan</h1>' +
      '<p>Alamat yang dibuka tidak ada di HearthLedger. Kembali ke <a href="#/">dasbor</a> untuk melihat ringkasan bulan ini.</p>' +
    '</section>'
  );
}
