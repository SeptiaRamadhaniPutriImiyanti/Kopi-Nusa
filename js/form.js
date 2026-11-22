const form = document.querySelector("#form-kontak");
const preview = document.querySelector("#preview-form");
const formFeedback = document.querySelector("#form-feedback");
const fields = ["nama", "email", "whatsapp", "paket", "pesan", "setuju"].map((id) =>
  document.querySelector(`#${id}`)
);
const topikInputs = document.querySelectorAll('input[name="topik"]');
const waktuInputs = document.querySelectorAll('input[name="waktu_kontak"]');
const STORAGE_KEY = "kopi-nusa-preferensi-kontak";

function getFieldError(field) {
  const validity = field.validity;

  if (validity.valueMissing) return "Bagian ini wajib diisi.";
  if (validity.typeMismatch) return "Format data belum sesuai.";
  if (validity.tooShort) return `Isi minimal ${field.minLength} karakter.`;
  if (validity.patternMismatch) return "Format belum sesuai contoh yang diminta.";

  return "";
}

function tampilkanError(field, pesan) {
  const error = document.querySelector(`#${field.id}-error`);
  field.setCustomValidity(pesan);
  field.setAttribute("aria-invalid", pesan ? "true" : "false");

  if (error) {
    error.textContent = pesan;
  }
}

function validasiField(field) {
  field.setCustomValidity("");
  const pesan = getFieldError(field);
  tampilkanError(field, pesan);
  return pesan === "";
}

function validasiRadioGroup(inputs, errorId) {
  const valid = Array.from(inputs).some((input) => input.checked);
  const errorEl = document.querySelector(`#${errorId}`);

  inputs.forEach((input) => {
    input.setAttribute("aria-invalid", valid ? "false" : "true");
  });

  if (errorEl) {
    errorEl.textContent = valid ? "" : "Bagian ini wajib dipilih.";
  }

  return valid;
}

function simpanPreferensi() {
  const data = new FormData(form);
  const preferensi = {
    paket: data.get("paket"),
    topik: data.get("topik"),
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(preferensi));
}

function muatPreferensi() {
  try {
    const tersimpan = localStorage.getItem(STORAGE_KEY);
    if (!tersimpan) return;

    const preferensi = JSON.parse(tersimpan);
    document.querySelector("#paket").value = preferensi.paket ?? "";
    const topik = document.querySelector(`input[name="topik"][value="${preferensi.topik}"]`);
    if (topik) topik.checked = true;
  } catch (error) {
    console.warn("Preferensi tidak valid.", error);
    localStorage.removeItem(STORAGE_KEY);
  }
}

function tampilkanPreview() {
  const data = new FormData(form);
  preview.textContent = [
    `Nama: ${data.get("nama")}`,
    `Email: ${data.get("email")}`,
    `WhatsApp: ${data.get("whatsapp")}`,
    `Paket: ${data.get("paket")}`,
    `Topik: ${data.get("topik")}`,
    `Waktu Kontak: ${data.get("waktu_kontak")}`,
    `Pesan: ${data.get("pesan")}`,
  ].join("\n");

  simpanPreferensi();

  formFeedback.textContent = "Form valid. Preview berhasil dibuat.";
  formFeedback.classList.add("success");
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const semuaValid = fields.every((field) => validasiField(field));
  const topikValid = validasiRadioGroup(topikInputs, "topik-error");
  const waktuValid = validasiRadioGroup(waktuInputs, "waktu_kontak-error");

  if (!semuaValid || !topikValid || !waktuValid || !form.checkValidity()) {
    formFeedback.textContent = "Periksa kembali bagian yang ditandai.";
    formFeedback.classList.remove("success");
    form.reportValidity();
    form.querySelector(":invalid")?.focus();
    return;
  }

  tampilkanPreview();
});

const btnHapusPreferensi = document.querySelector("#btn-hapus-preferensi");

if (btnHapusPreferensi) {
  btnHapusPreferensi.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    form.reset();
    preview.textContent = "Data form akan muncul setelah tombol dikirim.";
    formFeedback.textContent = "Preferensi tersimpan berhasil dihapus.";
    formFeedback.classList.remove("success");
  });
}

muatPreferensi();

