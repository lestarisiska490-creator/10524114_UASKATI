// Daftar produk
const products = [
  { id: 1, name: "Oli Motor Yamalube", price: 45000, img: "img/oli.jpg" },
  { id: 2, name: "Ban Motor Tubeless", price: 250000, img: "img/ban.jpg" },
  { id: 3, name: "Kampas Rem Honda", price: 55000, img: "img/rem.jpg" },
  { id: 4, name: "Aki Motor Yuasa", price: 320000, img: "img/aki.jpg" },
  { id: 5, name: "Lampu LED Motor", price: 75000, img: "img/lampu.jpg" }
];

// Daftar ongkir
const shippingOptions = [
  { name: "JNE - Reguler", price: 20000 },
  { name: "J&T Express", price: 22000 },
  { name: "SiCepat - Best", price: 25000 },
  { name: "Ambil di Toko", price: 0 }
];

// Render produk di halaman index
if (document.getElementById("products-grid")) {
  const grid = document.getElementById("products-grid");
  products.forEach(p => {
    const div = document.createElement("div");
    div.className = "card product";
    div.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <div class="price">Rp${p.price.toLocaleString()}</div>
      <button class="btn btn-primary" onclick="beliProduk(${p.id})">Beli</button>
    `;
    grid.appendChild(div);
  });
}

// Fungsi beli produk (prefill order form)
function beliProduk(id) {
  localStorage.setItem("selectedProduct", id);
  window.location.href = "order.html";
}

// Isi dropdown produk & pengiriman di order.html
if (document.getElementById("order-form")) {
  const productSelect = document.getElementById("product");
  const shippingSelect = document.getElementById("shipping");

  // Isi produk
  products.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.textContent = `${p.name} - Rp${p.price.toLocaleString()}`;
    productSelect.appendChild(opt);
  });

  // Prefill produk jika beli dari index
  const selectedId = localStorage.getItem("selectedProduct");
  if (selectedId) {
    productSelect.value = selectedId;
    localStorage.removeItem("selectedProduct");
  }

  // Isi ongkir
  shippingOptions.forEach(s => {
    const opt = document.createElement("option");
    opt.value = s.name;
    opt.textContent = `${s.name} - Rp${s.price.toLocaleString()}`;
    shippingSelect.appendChild(opt);
  });

  // Submit form
  document.getElementById("order-form").addEventListener("submit", e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const product = products.find(p => p.id == formData.get("product"));
    const shipping = shippingOptions.find(s => s.name == formData.get("shipping"));
    const qty = parseInt(formData.get("qty"));
    const totalProduct = product.price * qty;
    const total = totalProduct + shipping.price;

    const invoiceData = {
      fullname: formData.get("fullname"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      address: formData.get("address"),
      product: product.name,
      price: product.price,
      qty: qty,
      shipping: shipping.name,
      shippingPrice: shipping.price,
      payment: formData.get("payment"),
      note: formData.get("note"),
      totalProduct: totalProduct,
      total: total
    };

    localStorage.setItem("invoiceData", JSON.stringify(invoiceData));
    window.location.href = "invoice.html";
  });
}

// Tampilkan invoice di invoice.html
if (document.getElementById("invoice-wrap")) {
  const data = JSON.parse(localStorage.getItem("invoiceData"));
  if (!data) {
    document.getElementById("invoice-wrap").innerHTML = "<p>Data invoice tidak ditemukan.</p>";
  } else {
    document.getElementById("invoice-wrap").innerHTML = `
      <h2>Invoice Pemesanan</h2>
      <p><strong>Nama:</strong> ${data.fullname}</p>
      <p><strong>Telepon:</strong> ${data.phone}</p>
      <p><strong>Email:</strong> ${data.email || '-'}</p>
      <p><strong>Alamat:</strong> ${data.address}</p>
      <hr>
      <p><strong>Produk:</strong> ${data.product}</p>
      <p><strong>Harga Satuan:</strong> Rp${data.price.toLocaleString()}</p>
      <p><strong>Jumlah:</strong> ${data.qty}</p>
      <p><strong>Subtotal Produk:</strong> Rp${data.totalProduct.toLocaleString()}</p>
      <p><strong>Pengiriman:</strong> ${data.shipping} (Rp${data.shippingPrice.toLocaleString()})</p>
      <hr>
      <h3>Total: Rp${data.total.toLocaleString()}</h3>
      <p><strong>Metode Pembayaran:</strong> ${data.payment}</p>
      <p><strong>Catatan:</strong> ${data.note || '-'}</p>
      <div style="margin-top:20px;">
        <button class="btn" onclick="window.print()">Cetak Invoice</button>
        <a class="btn btn-primary" href="index.html">Kembali ke Beranda</a>
      </div>
    `;
  }
}
