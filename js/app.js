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

// 5. Function contract: Buat Kartu Produk HTML (Modular)
function buatKartuProduk(produk) {
  const status = statusStok(produk.stok);
  const kategori = labelKategori(produk.kategori);
  const labelAksi = produk.stok > 0 ? "Siap dipesan" : "Hubungi admin";
  const badgeUnggulan = produk.unggulan ? `<span class="product-badge">Unggulan</span>` : "";

  return `
    <article class="js-product-card">
      ${badgeUnggulan}
      <h3>${produk.nama}</h3>
      <p><em>${kategori}</em></p>
      <p>${produk.deskripsi}</p>
      <p class="price">${formatRupiah(produk.harga)}</p>
      <span class="stock-badge ${status.className}">${status.label}</span>
      <p><strong>${labelAksi}</strong></p>
    </article>
  `;
}

// 6. Function utama: Render Produk Modular dengan Array Methods
function renderProduk() {
  const grid = document.querySelector("#produk-dinamis");
  const ringkasan = document.querySelector("#produk-ringkasan");
  const unggulan = document.querySelector("#produk-unggulan");

  // Guard Clause P10: Mencegah error jika elemen target render belum lengkap
  if (!grid || !ringkasan || !unggulan) {
    console.warn("Target render produk belum lengkap.");
    return;
  }

  // Debugging log dengan forEach (P10)
  produkUmkm.forEach((produk) => {
    console.log("Debug produk:", produk.nama, "stok:", produk.stok);
  });

  // Array Methods P10: filter, find, map
  const produkTersedia = produkUmkm.filter((produk) => produk.stok > 0);
  const produkUnggulan = produkUmkm.find((produk) => produk.unggulan === true);
  const markupProduk = produkTersedia.map(buatKartuProduk).join("");

  // Update DOM
  grid.innerHTML = markupProduk;
  ringkasan.textContent = `${produkTersedia.length} produk tersedia dari ${produkUmkm.length} data.`;
  unggulan.textContent = produkUnggulan
    ? `Produk unggulan: ${produkUnggulan.nama}`
    : "Belum ada produk unggulan.";

  console.table(produkUmkm);
}

// ==========================================================================
// INISIALISASI SAAT DOM SELESAI DIMUAT
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  initNavbarMobile(); // Jalankan Hamburger Menu di SEMUA halaman
  renderProduk();      // Jalankan Render Produk P10 (Aman di-guard jika bukan di produk.html)
});