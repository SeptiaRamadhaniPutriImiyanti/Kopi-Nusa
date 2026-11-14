"use strict";

// ==========================================================================
// FITUR HAMBURGER MENU MOBILE (AKTIF DI SEMUA HALAMAN)
// ==========================================================================
function initNavbarMobile() {
  const menuToggle = document.querySelector("#menu-toggle");
  const navMenu = document.querySelector("#nav-menu");

  // Guard Clause: Mencegah error jika halaman tidak memiliki menu
  if (!menuToggle || !navMenu) return;

  // Toggle class 'active' saat tombol diklik
  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });
}

// ==========================================================================
// PRAKTIKUM P10: DATA & FUNCTION CONTRACTS
// ==========================================================================

// 1. Data minimal 4 produk UMKM dengan properti tambahan 'unggulan' dan 'deskripsi'
const produkUmkm = [
  { 
    nama: "Arabika Gayo", 
    kategori: "Kopi", 
    harga: 85000, 
    stok: 12, 
    unggulan: true, 
    deskripsi: "Aroma buah dan tingkat keasaman seimbang." 
  },
  { 
    nama: "Robusta Temanggung", 
    kategori: "Kopi", 
    harga: 65000, 
    stok: 4, 
    unggulan: false, 
    deskripsi: "Rasa murni dengan body yang tebal dan aroma cokelat." 
  },
  { 
    nama: "Cold Brew Aren", 
    kategori: "Kopi", 
    harga: 22000,  
    stok: 8, 
    unggulan: true, 
    deskripsi: "Minuman kopi dingin manis aren alami." 
  },
  { 
    nama: "Paket Seduh", 
    kategori: "Bundling", 
    harga: 125000, 
    stok: 0, 
    unggulan: false, 
    deskripsi: "Paket lengkap alat seduh dan biji kopi pilihan." 
  }
];

// 2. Function contract: Formatter Angka ke Format Rupiah
function formatRupiah(nilai) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(nilai);
}

// 3. Function contract: Status Stok Produk
function statusStok(stok) {
  if (stok <= 0) {
    return { label: "Habis", className: "warning" };
  }
  if (stok <= 5) {
    return { label: "Stok terbatas", className: "warning" };
  }
  return { label: "Tersedia", className: "" };
}

// 4. Function contract: Label Kategori
function labelKategori(kategori) {
  switch (kategori) {
    case "Kopi":
      return "Produk kopi pilihan";
    case "Bundling":
      return "Paket hemat";
    default:
      return "Produk UMKM";
  }
}

// ==========================================================================
// PRAKTIKUM P11-E04-E05: DOM SELECTION DAN GUARD
// ==========================================================================
const produkGrid = document.querySelector("#produk-dinamis");
const produkStatus = document.querySelector("#produk-ringkasan");
const tombolFilter = document.querySelectorAll("[data-filter]");

//Langkah E05: Function buatElementProduk dengan createElement & textContect
function buatElemenProduk(produk) {
  const card = document.createElement("article");
  card.classList.add("product-card");

  const title = document.createElement("h3");
  title.textContent = produk.nama;

  const category = document.createElement("p");
  category.classList.add("category-note");
  category.textContent = produk.kategori;

  const price = document.createElement("p");
  price.classList.add("price");
  price.textContent = formatRupiah(produk.harga);

  const stock = document.createElement("span");
  const status = statusStok(produk.stok);
  stock.classList.add("stock-badge");
  if (status.className) {
    stock.classList.add(status.className);
  }
  stock.textContent = status.label;

  card.append(title, category, price, stock);

// Langkah E08: uji remove element sementara
  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.textContent = "Sembunyikan";
  removeButton.classList.add("ghost-button");

  removeButton.addEventListener("click", () => {
    card.remove();
    produkStatus.textContent = "Satu kartu disembunyikan dari tampilan sementara.";
  });

card.append(removeButton);
  return card;
}

// ==========================================================================
// PRAKTIKUM P11-E06: Function buatEmptyState& Function utama renderProduk
// ==========================================================================
function buatEmptyState(kategori) {
  const empty = document.createElement("p");
  empty.classList.add("empty-state");
  empty.textContent = `Belum ada produk pada kategori ${kategori}.`;
  return empty;
}

function renderProduk(kategoriAktif = "Semua") {
  if (!produkGrid || !produkStatus) {
    console.warn("Target render produk tidak ditemukan.");
    return;
  }

  const produkTampil = kategoriAktif === "Semua"
    ? produkUmkm
    : produkUmkm.filter((produk) => produk.kategori === kategoriAktif);

  produkGrid.replaceChildren();

  if (produkTampil.length === 0) {
    produkGrid.append(buatEmptyState(kategoriAktif));
    produkStatus.textContent = "0 produk ditemukan.";
    return;
  }

  produkTampil.forEach((produk) => {
    produkGrid.append(buatElemenProduk(produk));
  });

  produkStatus.textContent = `${produkTampil.length} produk ditampilkan.`;
}

// ==========================================================================
// PRAKTIKUM P11-E07: pasang event listerner dan ClassList untuk tombol filter
// ==========================================================================
tombolFilter.forEach((tombol) => {
  tombol.addEventListener("click", (event) => {
    const tombolAktif = event.currentTarget;
    const kategori = tombolAktif.dataset.filter;

    tombolFilter.forEach((item) => item.classList.remove("is-active"));
    tombolAktif.classList.add("is-active");

    renderProduk(kategori);
  });
});

// ==========================================================================
// INISIALISASI SAAT DOM SELESAI DIMUAT
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  initNavbarMobile(); // Jalankan Hamburger Menu di SEMUA halaman
  renderProduk();     // Jalankan uji selector & guard Langkah 4
});