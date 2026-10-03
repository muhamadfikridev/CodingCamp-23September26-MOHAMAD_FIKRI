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