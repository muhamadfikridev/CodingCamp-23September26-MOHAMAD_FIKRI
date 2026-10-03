// ===== Konstanta & State =====
const KEYS = { tx: 'ev_transactions', cat: 'ev_categories', theme: 'ev_theme' };
const DEFAULT_CATEGORIES = ['Makanan', 'Transportasi', 'Hiburan'];

// Warna tetap untuk kategori umum (dicocokkan tanpa peduli huruf besar/kecil)
const CATEGORY_COLORS = {
  'makanan': '#00c875',      // hijau
  'transportasi': '#0a84e0', // biru
  'hiburan': '#ff7a00',      // oranye
  'minuman': '#8e44ad'       // ungu
};


// Warna cadangan untuk kategori kustom lain
const EXTRA_COLORS = ['#e63946', '#f1c40f', '#16a085', '#e84393', '#795548', '#2c3e50', '#a3cb38', '#7f8c8d'];

let transactions = load(KEYS.tx, []);
let categories = load(KEYS.cat, DEFAULT_CATEGORIES);
let chart = null;

// ===== Elemen DOM =====
const form = document.getElementById('transaction-form');
const nameInput = document.getElementById('item-name');
const amountInput = document.getElementById('item-amount');
const categorySelect = document.getElementById('item-category');
const errorEl = document.getElementById('form-error');
const listEl = document.getElementById('transaction-list');
const listEmpty = document.getElementById('list-empty');
const totalEl = document.getElementById('total-balance');
const sortSelect = document.getElementById('sort-select');
const chartEmpty = document.getElementById('chart-empty');
const chartCanvas = document.getElementById('expense-chart');
const themeBtn = document.getElementById('theme-toggle');
const newCategoryInput = document.getElementById('new-category');


// ===== Local Storage =====
function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}
function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}


// ===== Util =====
function formatRupiah(n) {
  return 'Rp ' + Number(n).toLocaleString('id-ID');
}
function escapeHtml(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

// Warna unik per kategori (tetap sama di grafik dan daftar)
function getCategoryColor(category) {
  const fixed = CATEGORY_COLORS[category.toLowerCase()];
  if (fixed) return fixed;
  const customs = categories.filter(c => !CATEGORY_COLORS[c.toLowerCase()]);
  const i = Math.max(customs.indexOf(category), 0);
  return EXTRA_COLORS[i % EXTRA_COLORS.length];
}

// ===== Render =====
function renderCategories() {
  const current = categorySelect.value;
  categorySelect.innerHTML = '<option value="">Pilih kategori</option>' +
    categories.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('');
  if (categories.includes(current)) categorySelect.value = current;
}

function getSorted() {
  const list = [...transactions];
  switch (sortSelect.value) {
    case 'amount-desc': return list.sort((a, b) => b.amount - a.amount);
    case 'amount-asc': return list.sort((a, b) => a.amount - b.amount);
    case 'category': return list.sort((a, b) => a.category.localeCompare(b.category));
    default: return list.sort((a, b) => b.id - a.id); // terbaru
  }
}

function renderList() {
  const items = getSorted();
  listEl.innerHTML = items.map(t => `
    <li>
      <div class="item-info">
        <p class="item-name">${escapeHtml(t.name)}</p>
        <p class="item-cat"><span class="dot" style="background:${getCategoryColor(t.category)}"></span>${escapeHtml(t.category)}</p>
      </div>
      <div class="item-right">
        <strong>${formatRupiah(t.amount)}</strong>
        <button class="delete-btn" type="button" data-id="${t.id}" aria-label="Hapus ${escapeHtml(t.name)}">Hapus</button>
      </div>
    </li>`).join('');
  listEmpty.classList.toggle('hidden', items.length > 0);
}

function renderBalance() {
  const total = transactions.reduce((sum, t) => sum + t.amount, 0);
  totalEl.textContent = formatRupiah(total);
}

function renderChart() {
  const totals = {};
  transactions.forEach(t => { totals[t.category] = (totals[t.category] || 0) + t.amount; });
  const labels = Object.keys(totals);
  const data = Object.values(totals);
  const hasData = labels.length > 0;

  chartCanvas.classList.toggle('hidden', !hasData);
  chartEmpty.classList.toggle('hidden', hasData);

  if (!hasData) {
    if (chart) { chart.destroy(); chart = null; }
    return;
  }

  const colors = labels.map(getCategoryColor);
  const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text').trim();

  if (chart) {
    chart.data.labels = labels;
    chart.data.datasets[0].data = data;
    chart.data.datasets[0].backgroundColor = colors;
    chart.options.plugins.legend.labels.color = textColor;
    chart.update();
  } else {
    chart = new Chart(chartCanvas, {
      type: 'pie',
      data: { labels, datasets: [{ data, backgroundColor: colors, borderWidth: 0 }] },
      options: {
        plugins: {
          legend: { position: 'bottom', labels: { color: textColor, usePointStyle: true } },
          tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${formatRupiah(ctx.parsed)}` } }
        }
      }
    });
  }
}

function render() {
  renderBalance();
  renderList();
  renderChart();
}


// ===== Aksi =====
form.addEventListener('submit', e => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const amount = Number(amountInput.value);
  const category = categorySelect.value;

  if (!name || !amountInput.value || !category) {
    errorEl.textContent = 'Semua kolom harus diisi.';
    return;
  }
  if (!(amount > 0)) {
    errorEl.textContent = 'Jumlah harus lebih dari 0.';
    return;
  }

  errorEl.textContent = '';
  transactions.push({ id: Date.now(), name, amount, category });
  save(KEYS.tx, transactions);
  form.reset();
  render();
});

listEl.addEventListener('click', e => {
  const btn = e.target.closest('.delete-btn');
  if (!btn) return;
  transactions = transactions.filter(t => t.id !== Number(btn.dataset.id));
  save(KEYS.tx, transactions);
  render();
});

sortSelect.addEventListener('change', renderList);


// Kategori kustom
document.getElementById('add-category').addEventListener('click', () => {
  const value = newCategoryInput.value.trim();
  if (!value) return;
  const exists = categories.some(c => c.toLowerCase() === value.toLowerCase());
  if (exists) {
    errorEl.textContent = 'Kategori sudah ada.';
    return;
  }
  errorEl.textContent = '';
  categories.push(value);
  save(KEYS.cat, categories);
  newCategoryInput.value = '';
  renderCategories();
  categorySelect.value = value;
});


// Mode gelap/terang
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
  save(KEYS.theme, theme);
  if (chart) { chart.destroy(); chart = null; renderChart(); }
}
themeBtn.addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
});

