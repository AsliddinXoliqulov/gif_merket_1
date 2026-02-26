(() => {
  const categoryNames = {
    all: "Barchasi",
    "category 1": "Gullar",
    "category 2": "Zargarlik buyumlari",
    "category 3": "Elektronika",
    "category 4": "Kitoblar",
    "category 5": "Bloknot"
  };

  const API_URL = "https://68247ca60f0188d7e7297d7a.mockapi.io/people/gift_market";
  const ORDER_API_URL = "https://68247ca60f0188d7e7297d7a.mockapi.io/people/gift_marke_massage";

  const formatPrice = (price) => new Intl.NumberFormat("uz-UZ").format(price) + " so'm";
  const getSafeText = (v) => (typeof v === "string" ? v : "");

  const showNotification = (message) => {
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
  };

  const injectNotifStyles = () => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes slideIn { from{transform:translateX(40px); opacity:0} to{transform:translateX(0); opacity:1} }
      @keyframes slideOut { from{transform:translateX(0); opacity:1} to{transform:translateX(40px); opacity:0} }
    `;
    document.head.appendChild(style);
  };

  const ImageViewer = (() => {
    let imageViewer, imageViewerImg, imageViewerClose;

    const initDOM = () => {
      imageViewer = document.getElementById("imageViewer");
      imageViewerImg = document.getElementById("imageViewerImg");
      imageViewerClose = document.getElementById("imageViewerClose");

      if (!imageViewer) return;

      imageViewerClose?.addEventListener("click", close);
      imageViewer.addEventListener("click", (e) => {
        if (e.target === imageViewer) close();
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && imageViewer?.classList.contains("active")) close();
      });
    };

    const open = (src) => {
      if (!imageViewer || !imageViewerImg) return;
      if (typeof src !== "string" || src.length < 3) return;

      imageViewerImg.src = src;
      imageViewer.classList.add("active");
    };

    const close = () => {
      if (!imageViewer || !imageViewerImg) return;
      imageViewer.classList.remove("active");
      imageViewerImg.src = "";
    };

    return { initDOM, open, close };
  })();

  const ProductsApp = (() => {
    let products = [];
    let currentCategory = "all";
    let searchQuery = "";

    let currentImageIndex = 0;
    let currentProductImages = [];

    let productsGrid, searchInput, clearBtn, categoryCards;
    let productModal, productModalOverlay, closeProductModalBtn, productDetailContainer;

    const initDOM = () => {
      productsGrid = document.getElementById("productsGrid");
      searchInput = document.getElementById("searchInput");
      clearBtn = document.getElementById("clearBtn");
      categoryCards = document.querySelectorAll(".category-card");

      productModal = document.getElementById("productModal");
      productModalOverlay = document.getElementById("productModalOverlay");
      closeProductModalBtn = document.getElementById("closeProductModal");
      productDetailContainer = document.getElementById("productDetailContainer");
    };

    const getImageElement = (img) => {
      if (typeof img !== "string") return "🎁";
      if (img.length <= 2) return img;

      return `
        <div class="img-loader"></div>
        <img src="${img}" alt="Product image" onload="this.previousElementSibling && (this.previousElementSibling.style.display='none')">
      `;
    };

    const getProductById = (id) => products.find((p) => p.id === id);

    const displayProducts = () => {
      if (!productsGrid) return;

      let filtered = [...products];

      if (currentCategory !== "all") {
        filtered = filtered.filter(
          (p) => (p.category || "").toLowerCase() === currentCategory.toLowerCase()
        );
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            (p.name || "").toLowerCase().includes(q) ||
            (p.description || "").toLowerCase().includes(q)
        );
      }

      productsGrid.innerHTML = "";

      if (!filtered.length) {
        productsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; padding:3rem; color:#999;">Mahsulot topilmadi</p>`;
        return;
      }

      filtered.forEach((product) => {
        const card = document.createElement("div");
        const isAvailable = product.sale !== false;

        card.className = "product-card" + (isAvailable ? "" : " unavailable");

        card.addEventListener("click", (e) => {
          if (!e.target.closest(".add-to-cart")) openProductModal(product.id);
        });

        const hasImage = Array.isArray(product.images) && product.images.length;
        const mainImage = hasImage
          ? `<img src="${product.images[0]}" alt="${product.name}">`
          : (product.emoji || "🎁");

        const nameText = product.name || "";
        const descText = product.description || "";

        card.innerHTML = `
          <div class="product-image">
            ${mainImage}
            <div class="product-category-badge">${product.categoryName || categoryNames[product.category] || product.category || ""}</div>
            ${!isAvailable ? `<div class="product-status-badge">Tugagan</div>` : ""}
          </div>

          <div class="product-info">
            <h3 style="text-transform: capitalize;" class="product-name">
              ${nameText.length > 40 ? nameText.slice(0, 40) + "..." : nameText}
            </h3>

            <p class="product-description">
              ${descText.length > 50 ? descText.slice(0, 50) + "..." : descText}
            </p><br>

            <div class="product-footer">
              <span class="product-price">${formatPrice(product.price || 0)}</span>
              <button class="add-to-cart ${!isAvailable ? "disabled" : ""}" ${!isAvailable ? "disabled" : ""} onclick="event.stopPropagation(); ShopApp.addToCart(${product.id})">
                Savatga
              </button>
            </div>
          </div>
        `;

        productsGrid.appendChild(card);
      });
    };

    const loadProducts = async () => {
      if (productsGrid) {
        productsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; padding:3rem; color:#999;">Mahsulotlar yuklanmoqda...</p>`;
      }

      try {
        const res = await fetch(API_URL);
        const data = await res.json();

        products = (Array.isArray(data) ? data : []).map((item) => {
          const imgs = Array.isArray(item.img) ? item.img : [];
          const category = getSafeText(item.category) || "category 1";

          return {
            id: Number(item.id),
            name: getSafeText(item.name) || `Mahsulot ${item.id}`,
            description: getSafeText(item.about) || `Kategoriya: ${category}`,
            price: Number(item.price || 0) * 1000,
            category,
            categoryName: categoryNames[category] || category,
            sale: item.sale,
            images: imgs,
            emoji: "🎁"
          };
        });

        displayProducts();
      } catch {
        if (productsGrid) {
          productsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; padding:3rem; color:#e74c3c;">Mahsulotlarni yuklashda xatolik yuz berdi.</p>`;
        }
      }
    };

    const openProductModal = (productId) => {
      if (!productModal || !productDetailContainer) return;

      const product = getProductById(productId);
      if (!product) return;

      currentImageIndex = 0;
      currentProductImages =
        Array.isArray(product.images) && product.images.length ? product.images : [product.emoji];

      productDetailContainer.innerHTML = `
        <div class="product-detail-images">
          <div class="product-main-image" id="mainImage">
            ${getImageElement(currentProductImages[0])}
            <div class="product-detail-category-badge">${product.categoryName || categoryNames[product.category] || ""}</div>
            ${
              currentProductImages.length > 1
                ? `<button class="carousel-nav prev" onclick="ProductsApp.changeImage(-1)">‹</button>
                   <button class="carousel-nav next" onclick="ProductsApp.changeImage(1)">›</button>`
                : ""
            }
          </div>

          ${
            currentProductImages.length > 1
              ? `<div class="product-image-carousel">
                  ${currentProductImages
                    .map(
                      (img, index) => `
                      <div class="product-thumbnail ${index === 0 ? "active" : ""}" onclick="ProductsApp.selectImage(${index})">
                        ${getImageElement(img)}
                      </div>
                    `
                    )
                    .join("")}
                </div>`
              : ""
          }
        </div>

        <div class="product-detail-info">
          <h2 class="product-detail-name">${product.name}</h2>
          <p class="product-detail-description">${product.description}</p>
          <div class="product-detail-price">${formatPrice(product.price)}</div>
          <div class="product-detail-actions">
            <button class="btn btn-primary" onclick="ShopApp.addToCart(${product.id}); ProductsApp.closeProductModal();">
              Savatga qo'shish
            </button>
          </div>
        </div>
      `;

      const main = document.getElementById("mainImage");
      main?.addEventListener("click", (e) => {
        const img = currentProductImages[currentImageIndex];
        if (typeof img === "string" && img.length > 3) ImageViewer.open(img);
      });

      productModal.classList.add("active");
      document.body.style.overflow = "hidden";
    };

    const updateMainImage = () => {
      const mainImage = document.getElementById("mainImage");
      if (!mainImage) return;

      const badge = mainImage.querySelector(".product-detail-category-badge");
      const prevBtn = mainImage.querySelector(".carousel-nav.prev");
      const nextBtn = mainImage.querySelector(".carousel-nav.next");

      let html = getImageElement(currentProductImages[currentImageIndex]);
      if (badge) html += badge.outerHTML;
      if (currentProductImages.length > 1) {
        if (prevBtn) html += prevBtn.outerHTML;
        if (nextBtn) html += nextBtn.outerHTML;
      }

      mainImage.innerHTML = html;

      mainImage.addEventListener("click", () => {
        const img = currentProductImages[currentImageIndex];
        if (typeof img === "string" && img.length > 3) ImageViewer.open(img);
      });
    };

    const updateThumbnails = () => {
      document.querySelectorAll(".product-thumbnail").forEach((thumb, idx) => {
        thumb.classList.toggle("active", idx === currentImageIndex);
      });
    };

    const changeImage = (direction) => {
      currentImageIndex += direction;
      if (currentImageIndex < 0) currentImageIndex = currentProductImages.length - 1;
      if (currentImageIndex >= currentProductImages.length) currentImageIndex = 0;
      updateMainImage();
      updateThumbnails();
    };

    const selectImage = (index) => {
      currentImageIndex = index;
      updateMainImage();
      updateThumbnails();
    };

    const closeProductModal = () => {
      if (!productModal) return;
      productModal.classList.remove("active");
      document.body.style.overflow = "";
    };

    const initEvents = () => {
      if (categoryCards?.length) {
        categoryCards.forEach((card) => {
          card.addEventListener("click", () => {
            categoryCards.forEach((c) => c.classList.remove("active"));
            card.classList.add("active");
            currentCategory = card.dataset.category || "all";
            displayProducts();
            document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
          });
        });
      }

      searchInput?.addEventListener("input", (e) => {
        searchQuery = e.target.value || "";
        displayProducts();
      });

      clearBtn?.addEventListener("click", () => {
        if (!searchInput) return;
        searchInput.value = "";
        searchQuery = "";
        displayProducts();
        searchInput.focus();
      });

      closeProductModalBtn?.addEventListener("click", closeProductModal);
      productModalOverlay?.addEventListener("click", closeProductModal);

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && productModal?.classList.contains("active")) closeProductModal();
      });
    };

    return {
      initDOM,
      initEvents,
      loadProducts,
      displayProducts,
      openProductModal,
      closeProductModal,
      changeImage,
      selectImage,
      getProductById
    };
  })();

  const ShopApp = (() => {
    let cart = [];

    let cartBtn, cartSidebar, cartOverlay, closeCart, cartItems, cartCount, totalPrice, checkoutBtn;
    let orderModal, orderModalOverlay, orderNameInput, orderPhoneInput, orderMessageInput, orderAddressInput;
    let confirmOrderBtn, cancelOrderBtn, orderMapContainer, orderMapSearchInput, orderDeliveryRadios;

    let map, marker;
    let selectedAddress = "";
    let selectedCoords = "";
    let mapInitialized = false;

    let confirmBtnText = "";

    const initDOM = () => {
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
    };

    const updateTotal = () => {
      if (!totalPrice) return;
      const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      totalPrice.textContent = formatPrice(total);
    };

    const displayCartItems = () => {
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
    };

    const updateCart = () => {
      if (!cartCount) return;

      try {
        localStorage.setItem("gift_market_cart", JSON.stringify(cart));
      } catch {}

      cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
      displayCartItems();
      updateTotal();
    };

    const addToCart = (productId) => {
      const product = window.ProductsApp?.getProductById(productId);
      if (!product) return;

      if (product.sale === false) return showNotification("Bu mahsulot tugagan.");

      const existing = cart.find((i) => i.id === productId);
      if (existing) existing.quantity += 1;
      else cart.push({ ...product, quantity: 1 });

      updateCart();
      showNotification(`${product.name} savatga qo'shildi!`);
    };

    const changeQuantity = (productId, change) => {
      const item = cart.find((i) => i.id === productId);
      if (!item) return;
      item.quantity += change;
      if (item.quantity <= 0) removeFromCart(productId);
      else updateCart();
    };

    const removeFromCart = (productId) => {
      cart = cart.filter((item) => item.id !== productId);
      updateCart();
      showNotification("Mahsulot savatdan olib tashlandi");
    };

    const setConfirmLoading = (isLoading) => {
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
    };

    const sendOrderToApi = async ({ userPhone, userName, deliver, message, address, map: mapCoord }) => {
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
    };

    const openOrderModal = () => {
      if (!orderModal) return;

      try {
        const savedPhone = localStorage.getItem("gift_market_user_phone");
        if (savedPhone && orderPhoneInput) orderPhoneInput.value = savedPhone;
      } catch {}

      orderModal.classList.add("active");
      document.body.style.overflow = "hidden";

      const selected = Array.from(orderDeliveryRadios || []).find((r) => r.checked);
      if (selected?.value === "delivery") onDeliveryMethodChange({ target: selected });
    };

    const closeOrderModal = () => {
      if (!orderModal) return;
      orderModal.classList.remove("active");
      document.body.style.overflow = "";
      setConfirmLoading(false);
    };

    const onDeliveryMethodChange = (e) => {
      const isDelivery = e.target.value === "delivery";
      const mapWrapper = document.getElementById("orderMapWrapper");
      if (mapWrapper) mapWrapper.style.display = isDelivery ? "block" : "none";
      if (isDelivery) initializeOrderMap();
    };

    const geocodeQuery = async (query, signal) => {
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&accept-language=uz&q=${encodeURIComponent(
          query
        )}`;
        const res = await fetch(url, { signal });
        const data = await res.json();
        if (!data?.length) return null;
        return {
          lat: Number(data[0].lat),
          lng: Number(data[0].lon),
          display_name: data[0].display_name
        };
      } catch {
        return null;
      }
    };

    const reverseGeocode = async (lat, lng) => {
      try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&accept-language=uz&lat=${lat}&lon=${lng}`;
        const res = await fetch(url);
        const data = await res.json();
        return data?.display_name || "";
      } catch {
        return "";
      }
    };

    const initializeOrderMap = async () => {
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

      const runSearch = async (q) => {
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
      };

      orderMapSearchInput?.addEventListener("input", (e) => {
        const q = e.target.value;

        if (searchTimer) clearTimeout(searchTimer);

        const trimmed = String(q || "").trim();
        if (!trimmed) return;

        searchTimer = setTimeout(() => runSearch(trimmed), 800);
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
        } catch {}
      }, 50);
    };

    const handleOrderSubmit = async () => {
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
        address = orderAddressInput?.value.trim() || selectedAddress;
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
        alert("Buyurtmangiz muvaffaqiyatli qabul qilindi! Tez orada siz bilan bog'lanamiz.");
      } catch {
        showNotification("Buyurtmani yuborishda xatolik yuz berdi. Qayta urinib ko'ring.");
      } finally {
        setConfirmLoading(false);
      }
    };

    const initEvents = () => {
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
    };

    const restoreCart = () => {
      try {
        const savedCart = localStorage.getItem("gift_market_cart");
        if (savedCart) cart = JSON.parse(savedCart) || [];
      } catch {}
      updateCart();
    };

    return {
      initDOM,
      initEvents,
      restoreCart,
      addToCart,
      changeQuantity,
      removeFromCart
    };
  })();

  const NavApp = (() => {
    const init = () => {
      const menuToggle = document.getElementById("menuToggle");
      const nav = document.querySelector(".nav");

      menuToggle?.addEventListener("click", () => nav?.classList.toggle("active"));

      document.querySelectorAll(".nav-link").forEach((link) => {
        link.addEventListener("click", () => nav?.classList.remove("active"));
      });

      const sections = document.querySelectorAll("section[id]");
      const navLinks = document.querySelectorAll(".nav-link");

      const setActiveLink = () => {
        let currentId = "";

        sections.forEach((section) => {
          const top = section.offsetTop - 140;
          const bottom = top + section.offsetHeight;

          if (scrollY >= top && scrollY < bottom) currentId = section.id;
        });

        if (!currentId && sections[0]) currentId = sections[0].id;

        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
        });
      };

      window.addEventListener("scroll", setActiveLink);
      window.addEventListener("load", setActiveLink);
      setActiveLink();
    };

    return { init };
  })();

  window.ProductsApp = ProductsApp;
  window.ShopApp = ShopApp;

  document.addEventListener("DOMContentLoaded", () => {
    injectNotifStyles();

    ImageViewer.initDOM();

    ProductsApp.initDOM();
    ProductsApp.initEvents();
    ProductsApp.loadProducts();

    ShopApp.initDOM();
    ShopApp.initEvents();
    ShopApp.restoreCart();

    NavApp.init();
  });
})();