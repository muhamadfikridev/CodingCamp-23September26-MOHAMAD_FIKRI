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