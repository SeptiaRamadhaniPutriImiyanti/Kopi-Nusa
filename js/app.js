"use strict";

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
    nama: "Kopi Senja Nusa", 
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

// Cetak data bentuk tabel ke Console DevTools
console.table(produkUmkm);

// 2. Formatter Angka ke Format Rupiah
const formatRupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0
});

// 3. Conditional 1: Status stok produk
function statusStok(stok) {
  if (stok === 0) {
    return { label: "Habis", className: "empty" };
  }
  if (stok <= 5) {
    return { label: "Stok terbatas", className: "warning" };
  }
  return { label: "Tersedia", className: "" };
}

// 4. Conditional Switch: Label Kategori
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

// 5. Fungsi Render Data ke DOM
function renderProduk() {
  const grid = document.querySelector("#produk-dinamis");
  const ringkasan = document.querySelector("#produk-ringkasan");

  // Guard Clause: Mencegah error pada halaman selain produk.html
  if (!grid || !ringkasan) {
    return;
  }

  let jumlahTersedia = 0;
  let markup = "";

  for (const produk of produkUmkm) {
    const status = statusStok(produk.stok);
    const kategori = labelKategori(produk.kategori);
    
    // Conditional 2 (Ternary): Label Aksi berdasarkan stok
    const labelAksi = produk.stok > 0 ? "Siap dipesan" : "Hubungi admin";
    
    // Conditional tambahan (Pengayaan): Badge produk unggulan
    const badgeUnggulan = produk.unggulan ? `<span class="product-badge">Unggulan</span>` : "";

    if (produk.stok > 0) {
      jumlahTersedia = jumlahTersedia + 1;
    }

    markup += `
      <article class="js-product-card">
        ${badgeUnggulan}
        <h3>${produk.nama}</h3>
        <p><em>${kategori}</em></p>
        <p>${produk.deskripsi}</p>
        <p class="price">${formatRupiah.format(produk.harga)}</p>
        <span class="stock-badge ${status.className}">${status.label}</span>
        <p><strong>${labelAksi}</strong></p>
      </article>
    `;
  }

  grid.innerHTML = markup;
  ringkasan.textContent = `${jumlahTersedia} produk tersedia dari ${produkUmkm.length} data.`;
}

// Jalankan fungsi render ketika dokumen HTML selesai diurai
document.addEventListener("DOMContentLoaded", renderProduk);