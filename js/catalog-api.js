const DATA_URL = "data/products.json";
const catalogStatus = document.querySelector("#catalog-status");
const produkGrid = document.querySelector("#produk-dinamis");
const produkRingkasan = document.querySelector("#produk-ringkasan");
const produkUnggulan = document.querySelector("#produk-unggulan");
const tombolFilter = document.querySelectorAll("[data-filter]");

let products = [];
let activeCategory = "Semua";

console.log({ catalogStatus, produkGrid, produkRingkasan, produkUnggulan, tombolFilter });

function setStatus(state, message) {
  catalogStatus.className = "catalog-status";
  if (state) {
    catalogStatus.classList.add(state);
  }
  catalogStatus.textContent = message;
}

async function loadProducts() {
  try {
    setStatus("loading", "Memuat data produk...");

    const response = await fetch(DATA_URL);

    if (!response.ok) {
      throw new Error(`HTTP status ${response.status}`);
    }

    products = await response.json();
    renderProducts(products);
    setStatus("success", `${products.length} produk berhasil dimuat.`);
  } catch (error) {
    setStatus("error", `Gagal memuat produk: ${error.message}`);
  }
}

function createEmptyState() {
  const empty = document.createElement("p");
  empty.className = "empty-state";
  empty.textContent = "Tidak ada produk ditemukan.";
  return empty;
}

function createProductCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";
  card.innerHTML = `
    <h3>${product.name}</h3>
    <p>${product.category}</p>
    <p>Rp ${product.price}</p>
    <span>Stok: ${product.stock}</span>
  `;
  return card;
}

function renderProducts(items) {
  produkGrid.replaceChildren();

  if (items.length === 0) {
    produkGrid.append(createEmptyState());
    produkRingkasan.textContent = "0 produk ditemukan.";
    setStatus("success", "Request berhasil, tetapi data kosong.");
    return;
  }

  items.forEach((product) => {
    produkGrid.append(createProductCard(product));
  });

  produkRingkasan.textContent = `${items.length} produk ditampilkan.`;
}

function applyFilter(category) {
  activeCategory = category;
  const filtered = category === "Semua"
    ? products
    : products.filter((product) => product.category === category);

  renderProducts(filtered);
}
tombolFilter.forEach((button) => {
  button.addEventListener("click", (event) => {
    tombolFilter.forEach((item) => item.classList.remove("is-active"));
    event.currentTarget.classList.add("is-active");
    applyFilter(event.currentTarget.dataset.filter ?? "Semua");
  });
});

loadProducts();
