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