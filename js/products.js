const categoryNames = {
  all: "Barchasi",
  "category 1": "Gullar",
  "category 2": "Zargarlik buyumlari",
  "category 3": "Elektronika",
  "category 4": "Kitoblar",
  "category 5": "Bloknot"
};

const API_URL = "https://68247ca60f0188d7e7297d7a.mockapi.io/people/gift_market";

let products = [];
let currentCategory = "all";
let searchQuery = "";

let currentImageIndex = 0;
let currentProductImages = [];

let productsGrid, searchInput, clearBtn, categoryCards;
let productModal, productModalOverlay, closeProductModalBtn, productDetailContainer;

function formatPrice(price) {
  return new Intl.NumberFormat("uz-UZ").format(price) + " so'm";
}

function getSafeText(v) {
  return typeof v === "string" ? v : "";
}

function initProductsDOM() {
  productsGrid = document.getElementById("productsGrid");
  searchInput = document.getElementById("searchInput");
  clearBtn = document.getElementById("clearBtn");
  categoryCards = document.querySelectorAll(".category-card");

  productModal = document.getElementById("productModal");
  productModalOverlay = document.getElementById("productModalOverlay");
  closeProductModalBtn = document.getElementById("closeProductModal");
  productDetailContainer = document.getElementById("productDetailContainer");
}


function getImageElement(img) {
  if (typeof img !== "string") return "🎁";
  if (img.length <= 2) return img;

  return `
  <div class="img-loader"></div>
  <img src="${img}" alt="Product image"
  onload="this.previousElementSibling.style.display='none'">
  `;
}

function displayProducts() {
  if (!productsGrid) return;

  let filtered = [...products];

  if (currentCategory !== "all") {
    filtered = filtered.filter(
      p => (p.category || "").toLowerCase() === currentCategory.toLowerCase()
    );
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(p =>
      (p.name || "").toLowerCase().includes(q) ||
      (p.description || "").toLowerCase().includes(q)
    );
  }

  productsGrid.innerHTML = "";

  if (!filtered.length) {
    productsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; padding:3rem; color:#999;">Mahsulot topilmadi</p>`;
    return;
  }

  filtered.forEach(product => {
    const card = document.createElement("div");
    const isAvailable = product.sale !== false;

    card.className = "product-card" + (isAvailable ? "" : " unavailable");

    card.addEventListener("click", (e) => {
      if (!e.target.closest(".add-to-cart")) openProductModal(product.id);
    });

    const hasImage = Array.isArray(product.images) && product.images.length;
    const mainImage = hasImage ? `<img src="${product.images[0]}" alt="${product.name}">` : (product.emoji || "🎁");

    card.innerHTML = `
      <div class="product-image">
        ${mainImage}
        <div class="product-category-badge">${product.categoryName || categoryNames[product.category] || product.category || ""}</div>
        ${!isAvailable ? `<div class="product-status-badge">Tugagan</div>` : ""}
      </div>

      <div class="product-info">
        <h3 style="text-transform: capitalize;" class="product-name">
        ${(product.name || "").length > 20 
          ? product.name.slice(0,40) + "..." 
          : (product.name || "")}


        </h3>
        <p class="product-description">
          ${(product.description || "").length > 50 
          ? product.description.slice(0,50) + "..." 
          : (product.description || "")}
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
}

async function loadProducts() {
  if (productsGrid) {
    productsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; padding:3rem; color:#999;">Mahsulotlar yuklanmoqda...</p>`;
  }

  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    products = data.map(item => {
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
}

function openProductModal(productId) {
  if (!productModal || !productDetailContainer) return;

  const product = products.find(p => p.id === productId);
  if (!product) return;

  currentImageIndex = 0;
  currentProductImages = (Array.isArray(product.images) && product.images.length) ? product.images : [product.emoji];

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
              ${currentProductImages.map((img, index) => `
                <div class="product-thumbnail ${index === 0 ? "active" : ""}" onclick="ProductsApp.selectImage(${index})">
                  ${getImageElement(img)}
                </div>
              `).join("")}
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

  productModal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function updateMainImage() {
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
}

function updateThumbnails() {
  document.querySelectorAll(".product-thumbnail").forEach((thumb, idx) => {
    thumb.classList.toggle("active", idx === currentImageIndex);
  });
}

function changeImage(direction) {
  currentImageIndex += direction;
  if (currentImageIndex < 0) currentImageIndex = currentProductImages.length - 1;
  if (currentImageIndex >= currentProductImages.length) currentImageIndex = 0;
  updateMainImage();
  updateThumbnails();
}

function selectImage(index) {
  currentImageIndex = index;
  updateMainImage();
  updateThumbnails();
}

function closeProductModal() {
  if (!productModal) return;
  productModal.classList.remove("active");
  document.body.style.overflow = "";
}

function initProductsEvents() {
  if (categoryCards?.length) {
    categoryCards.forEach(card => {
      card.addEventListener("click", () => {
        categoryCards.forEach(c => c.classList.remove("active"));
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
}
window.ProductsApp = {
  getProductById: (id) => products.find(p => p.id === id),
  loadProducts,
  displayProducts,
  openProductModal,
  closeProductModal,
  changeImage,
  selectImage,
  openImageViewerByIndex: (index) => {
    const src = currentProductImages?.[index];
    if (typeof src === "string" && src.length > 3) openImageViewer(src);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  initProductsDOM();
  initProductsEvents();
  loadProducts();
});




let imageViewer, imageViewerImg, imageViewerClose;

function initImageViewerDOM() {
  imageViewer = document.getElementById("imageViewer");
  imageViewerImg = document.getElementById("imageViewerImg");
  imageViewerClose = document.getElementById("imageViewerClose");

  if (!imageViewer) return;

  imageViewerClose?.addEventListener("click", closeImageViewer);
  imageViewer.addEventListener("click", (e) => {
    if (e.target === imageViewer) closeImageViewer();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && imageViewer?.classList.contains("active")) closeImageViewer();
  });
}

function openImageViewer(src) {
  if (!imageViewer || !imageViewerImg) return;
  if (typeof src !== "string" || src.length < 3) return;

  imageViewerImg.src = src;
  imageViewer.classList.add("active");
}

function closeImageViewer() {
  if (!imageViewer || !imageViewerImg) return;
  imageViewer.classList.remove("active");
  imageViewerImg.src = "";
}


