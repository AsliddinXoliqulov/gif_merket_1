const ORDER_API_URL = "https://68247ca60f0188d7e7297d7a.mockapi.io/people/gift_marke_massage";

let cart = [];

let cartBtn, cartSidebar, cartOverlay, closeCart, cartItems, cartCount, totalPrice, checkoutBtn;

let orderModal, orderModalOverlay, orderNameInput, orderPhoneInput, orderMessageInput, orderAddressInput;
let confirmOrderBtn, cancelOrderBtn, orderMapContainer, orderMapSearchInput, orderDeliveryRadios;

let map, marker;
let selectedAddress = "";
let selectedCoords = "";
let mapInitialized = false;

let confirmBtnText = "";

function formatPrice(price) {
  return new Intl.NumberFormat("uz-UZ").format(price) + " so'm";
}

function showNotification(message) {
  const n = document.createElement("div");
  n.style.cssText = `
    position: fixed; top: 90px; right: 18px;
    background: rgba(6,35,62,.96); color:#fff;
    padding: 12px 14px; border-radius: 14px;
    box-shadow: 0 18px 40px rgba(0,0,0,.22);
    z-index: 3000; font-weight: 600;
    border: 1px solid rgba(255,255,255,.12);
    backdrop-filter: blur(10px);
    animation: slideIn .22s ease;
    max-width: min(360px, 92vw);
  `;
  n.textContent = message;
  document.body.appendChild(n);
  setTimeout(() => {
    n.style.animation = "slideOut .22s ease";
    setTimeout(() => n.remove(), 220);
  }, 2000);
}

function setConfirmLoading(isLoading) {
  if (!confirmOrderBtn) return;

  if (isLoading) {
    confirmBtnText = confirmOrderBtn.innerHTML;
    confirmOrderBtn.disabled = true;
    confirmOrderBtn.classList.add("btn-loading");
    confirmOrderBtn.innerHTML = `<span class="btn-spinner"></span> <span>Yuborilmoqda...</span>`;
  } else {
    confirmOrderBtn.disabled = false;
    confirmOrderBtn.classList.remove("btn-loading");
    confirmOrderBtn.innerHTML = confirmBtnText || "Tasdiqlash";
  }
}

function initShopDOM() {
  cartBtn = document.getElementById("cartBtn");
  cartSidebar = document.getElementById("cartSidebar");
  cartOverlay = document.getElementById("cartOverlay");
  closeCart = document.getElementById("closeCart");
  cartItems = document.getElementById("cartItems");
  cartCount = document.getElementById("cartCount");
  totalPrice = document.getElementById("totalPrice");
  checkoutBtn = document.getElementById("checkoutBtn");

  orderModal = document.getElementById("orderModal");
  orderModalOverlay = document.getElementById("orderModalOverlay");

  orderNameInput = document.getElementById("orderName");
  orderPhoneInput = document.getElementById("orderPhone");
  orderMessageInput = document.getElementById("orderMessage");
  orderAddressInput = document.getElementById("orderAddress");

  confirmOrderBtn = document.getElementById("confirmOrderBtn");
  cancelOrderBtn = document.getElementById("cancelOrderBtn");

  orderMapContainer = document.getElementById("orderMap");
  orderMapSearchInput = document.getElementById("orderMapSearch");
  orderDeliveryRadios = document.querySelectorAll('input[name="deliveryMethod"]');
}

function updateTotal() {
  if (!totalPrice) return;
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  totalPrice.textContent = formatPrice(total);
}

function displayCartItems() {
  if (!cartItems) return;

  if (!cart.length) {
    cartItems.innerHTML = `<div class="empty-cart"><p>Savat bo'sh</p></div>`;
    return;
  }

  cartItems.innerHTML = cart
    .map((item) => {
      const img = Array.isArray(item.images) && item.images.length ? item.images[0] : "";
      const imgHtml = img
        ? `<img src="${img}" alt="${item.name}">`
        : `<img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='100%25' height='100%25' fill='%23eee'/%3E%3Ctext x='50%25' y='55%25' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-size='14'%3ENo%20Image%3C/text%3E%3C/svg%3E" alt="No image">`;

      return `
        <div class="cart-item">
          <div class="cart-item-image">${imgHtml}</div>
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">${formatPrice(item.price)}</div>
            <div class="cart-item-actions">
              <button class="quantity-btn" onclick="ShopApp.changeQuantity(${item.id}, -1)">-</button>
              <span>${item.quantity}</span>
              <button class="quantity-btn" onclick="ShopApp.changeQuantity(${item.id}, 1)">+</button>
              <button class="remove-item" onclick="ShopApp.removeFromCart(${item.id})">O'chirish</button>
            </div>
          </div>
        </div>
      `;
    })
    .join("");
}

function updateCart() {
  if (!cartCount) return;

  try {
    localStorage.setItem("gift_market_cart", JSON.stringify(cart));
  } catch {}

  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  displayCartItems();
  updateTotal();
}

function addToCart(productId) {
  const product = window.ProductsApp?.getProductById(productId);
  if (!product) return;

  if (product.sale === false) return showNotification("Bu mahsulot tugagan.");

  const existing = cart.find((i) => i.id === productId);
  if (existing) existing.quantity += 1;
  else cart.push({ ...product, quantity: 1 });

  updateCart();
  showNotification(`${product.name} savatga qo'shildi!`);
}

function changeQuantity(productId, change) {
  const item = cart.find((i) => i.id === productId);
  if (!item) return;
  item.quantity += change;
  if (item.quantity <= 0) removeFromCart(productId);
  else updateCart();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  updateCart();
  showNotification("Mahsulot savatdan olib tashlandi");
}

async function sendOrderToApi({ userPhone, userName, deliver, message, address, map: mapCoord }) {
  if (!cart.length) throw new Error("Savat bo'sh");

  const now = new Date().toISOString();

  const productID = cart.map((i) => i.id);
  const name = cart.map((i) => i.name);
  const price = cart.map((i) => i.price);
  const productr_count = cart.map((i) => i.quantity);
  const total_price = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const image = cart.map((i) => (Array.isArray(i.images) && i.images.length ? i.images[0] : ""));

  const payload = {
    productID,
    name,
    price,
    image,
    user_name: userName,
    user_phone: userPhone,
    deliver: !!deliver,
    map: mapCoord || "",
    status: 1,
    date: now,
    massage: message || "",
    address: address || "",
    productr_count,
    total_price
  };

  const res = await fetch(ORDER_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) throw new Error("Server xatosi");
  return res.json();
}

function openOrderModal() {
  if (!orderModal) return;

  try {
    const savedPhone = localStorage.getItem("gift_market_user_phone");
    if (savedPhone && orderPhoneInput) orderPhoneInput.value = savedPhone;
  } catch {}

  orderModal.classList.add("active");
  document.body.style.overflow = "hidden";

  const selected = Array.from(orderDeliveryRadios || []).find((r) => r.checked);
  if (selected?.value === "delivery") onDeliveryMethodChange({ target: selected });
}

function closeOrderModal() {
  if (!orderModal) return;
  orderModal.classList.remove("active");
  document.body.style.overflow = "";
  setConfirmLoading(false);
}

function onDeliveryMethodChange(e) {
  const isDelivery = e.target.value === "delivery";
  const mapWrapper = document.getElementById("orderMapWrapper");
  if (mapWrapper) mapWrapper.style.display = isDelivery ? "block" : "none";
  if (isDelivery) initializeOrderMap();
}

async function handleOrderSubmit() {
  const userName = orderNameInput?.value.trim() || "";
  if (!userName) return showNotification("Ismingizni kiriting.");

  const userPhone = orderPhoneInput?.value.trim() || "";
  if (!userPhone) return showNotification("Telefon raqamingizni kiriting.");

  try {
    localStorage.setItem("gift_market_user_phone", userPhone);
  } catch {}

  const selected = Array.from(orderDeliveryRadios || []).find((r) => r.checked);
  const deliver = selected ? selected.value === "delivery" : false;

  let address = "";
  let mapCoord = "";

  if (deliver) {
    address = (orderAddressInput?.value.trim()) || selectedAddress;
    if (!address) return showNotification("Yetkazib berish uchun manzil tanlang.");

    mapCoord = selectedCoords || "";
    if (!mapCoord) return showNotification("Haritada joy tanlang.");
  }

  const message = orderMessageInput?.value.trim() || "";

  try {
    setConfirmLoading(true);

    await sendOrderToApi({
      userPhone,
      userName,
      deliver,
      message,
      address,
      map: mapCoord
    });

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cart = [];
    updateCart();

    cartSidebar?.classList.remove("active");
    cartOverlay?.classList.remove("active");

    closeOrderModal();
    showNotification(`Buyurtmangiz qabul qilindi! Jami: ${formatPrice(total)}`);
    // alert("Buyurtmangiz muvaffaqiyatli qabul qilindi! Tez orada siz bilan bog'lanamiz.");x`
  } catch {
    showNotification("Buyurtmani yuborishda xatolik yuz berdi. Qayta urinib ko'ring.");
  } finally {
    setConfirmLoading(false);
  }
}

async function geocodeQuery(query, signal) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;
    const res = await fetch(url, { signal, headers: { "Accept-Language": "uz" } });
    const data = await res.json();
    if (!data?.length) return null;
    return { lat: Number(data[0].lat), lng: Number(data[0].lon), display_name: data[0].display_name };
  } catch {
    return null;
  }
}

async function reverseGeocode(lat, lng) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
    const res = await fetch(url, { headers: { "Accept-Language": "uz" } });
    const data = await res.json();
    return data?.display_name || "";
  } catch {
    return "";
  }
}

async function initializeOrderMap() {
  if (typeof L === "undefined") {
    alert("Xarita yuklanmadi (Leaflet topilmadi). Internet/CDN ni tekshiring.");
    return;
  }

  if (mapInitialized || !orderMapContainer) return;
  mapInitialized = true;

  const defaultCenter = { lat: 41.3111, lng: 69.2797 };

  map = L.map(orderMapContainer).setView([defaultCenter.lat, defaultCenter.lng], 12);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap"
  }).addTo(map);

  marker = L.marker([defaultCenter.lat, defaultCenter.lng], { draggable: true }).addTo(map);

  selectedCoords = `${defaultCenter.lat.toFixed(6)},${defaultCenter.lng.toFixed(6)}`;
  selectedAddress = selectedCoords;

  if (orderAddressInput) orderAddressInput.value = selectedAddress;

  marker.on("dragend", async () => {
    const pos = marker.getLatLng();
    selectedCoords = `${pos.lat.toFixed(6)},${pos.lng.toFixed(6)}`;

    const addr = await reverseGeocode(pos.lat, pos.lng);
    selectedAddress = addr || selectedCoords;

    if (orderAddressInput) orderAddressInput.value = selectedAddress;
  });

  map.on("click", async (e) => {
    marker.setLatLng([e.latlng.lat, e.latlng.lng]);
    selectedCoords = `${e.latlng.lat.toFixed(6)},${e.latlng.lng.toFixed(6)}`;

    const addr = await reverseGeocode(e.latlng.lat, e.latlng.lng);
    selectedAddress = addr || selectedCoords;

    if (orderAddressInput) orderAddressInput.value = selectedAddress;
  });

  let searchTimer = null;
  let geoAbort = null;

  async function runSearch(q) {
    const query = String(q || "").trim();
    if (!query) return;

    try {
      if (geoAbort) geoAbort.abort();
      geoAbort = new AbortController();

      const result = await geocodeQuery(query, geoAbort.signal);
      if (!result) return showNotification("Manzil topilmadi");

      map.setView([result.lat, result.lng], 16);
      marker.setLatLng([result.lat, result.lng]);

      selectedCoords = `${Number(result.lat).toFixed(6)},${Number(result.lng).toFixed(6)}`;
      selectedAddress = result.display_name || selectedCoords;

      if (orderAddressInput) orderAddressInput.value = selectedAddress;
    } catch (e) {
      if (e?.name === "AbortError") return;
      console.error(e);
      showNotification("Qidiruvda xatolik");
    }
  }

  orderMapSearchInput?.addEventListener("input", (e) => {
    const q = e.target.value;

    if (searchTimer) clearTimeout(searchTimer);

    const trimmed = String(q || "").trim();
    if (!trimmed) return;

    searchTimer = setTimeout(() => {
      runSearch(trimmed);
    }, 2000);
  });

  orderMapSearchInput?.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();

    const q = orderMapSearchInput.value.trim();
    if (!q) return;

    if (searchTimer) clearTimeout(searchTimer);
    runSearch(q);
  });

  setTimeout(() => {
    try {
      map.invalidateSize();
    } catch (_) {}
  }, 50);
}

function initShopEvents() {
  cartBtn?.addEventListener("click", () => {
    cartSidebar?.classList.add("active");
    cartOverlay?.classList.add("active");
  });

  closeCart?.addEventListener("click", () => {
    cartSidebar?.classList.remove("active");
    cartOverlay?.classList.remove("active");
  });

  cartOverlay?.addEventListener("click", () => {
    cartSidebar?.classList.remove("active");
    cartOverlay?.classList.remove("active");
  });

  checkoutBtn?.addEventListener("click", () => {
    if (!cart.length) return showNotification("Savat bo'sh!");
    openOrderModal();
  });

  orderModalOverlay?.addEventListener("click", closeOrderModal);
  cancelOrderBtn?.addEventListener("click", closeOrderModal);
  confirmOrderBtn?.addEventListener("click", handleOrderSubmit);

  if (orderDeliveryRadios?.length) {
    orderDeliveryRadios.forEach((r) => r.addEventListener("change", onDeliveryMethodChange));
  }
}

const style = document.createElement("style");
style.textContent = `
@keyframes slideIn { from{transform:translateX(40px); opacity:0} to{transform:translateX(0); opacity:1} }
@keyframes slideOut { from{transform:translateX(0); opacity:1} to{transform:translateX(40px); opacity:0} }
`;
document.head.appendChild(style);

window.ShopApp = { addToCart, changeQuantity, removeFromCart };

document.addEventListener("DOMContentLoaded", () => {
  initShopDOM();

  try {
    const savedCart = localStorage.getItem("gift_market_cart");
    if (savedCart) cart = JSON.parse(savedCart) || [];
  } catch {}

  initShopEvents();
  updateCart();
});