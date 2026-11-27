// HearthLedger — hash router and small bits of page state.
// Routes: #/ dashboard, #/budget, #/bills, #/goals, anything else 404.
// The budget page remembers the selected month while navigating.

const HL_STATE = { budgetMonth: '2026-11' };

function routePath() {
  const raw = window.location.hash.replace(/^#/, '');
  return raw === '' ? '/' : raw;
}

function render() {
  window.__shotReady = false;
  const path = routePath();
  const app = document.getElementById('app');
  let html;
  if (path === '/') html = renderDashboard();
  else if (path === '/budget') html = renderBudget(HL_STATE.budgetMonth);
  else if (path === '/bills') html = renderBills();
  else if (path === '/goals') html = renderGoals();
  else html = renderNotFound();
  app.innerHTML = html;

  document.querySelectorAll('.main-nav a').forEach((a) => {
    a.classList.toggle('active', a.getAttribute('data-nav') === path);
  });
  window.__shotReady = true;
}

// Month switcher on the budget page: buttons carry data-month; one
// delegated listener re-renders the table for the chosen month.
document.addEventListener('click', (ev) => {
  const btn = ev.target.closest('[data-month]');
  if (!btn) return;
  HL_STATE.budgetMonth = btn.getAttribute('data-month');
  render();
});

window.addEventListener('hashchange', render);
render();
