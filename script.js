// Kategoriya nomlari
const categoryNames = {
    all: "Barchasi",
    flowers: "Gullar",
    jewelry: "Zargarlik buyumlari",
    electronics: "Elektronika",
    books: "Kitoblar",
    toys: "O'yinchoqlar"
};

// Mahsulotlar ma'lumotlari
const products = [
    {
        id: 1,
        name: "Qizil atirgul guldastasi",
        description: "Chiroyli qizil atirgullar guldastasi. Bu guldasta sevgi va mehr ramzi bo'lib, sevimli odamlaringizga sovg'a qilish uchun ajoyib tanlov. Tabiiy gullar bilan tayyorlangan va maxsus qutida yetkazib beriladi.",
        price: 150000,
        category: "flowers",
        categoryName: "Gullar",
        emoji: "🌹",
        stock: 15,
        sales: 234,
        images: ["🌹", "🌺", "🌸", "🌷"]
    },
    {
        id: 2,
        name: "Kumush uzuk",
        description: "Zamonaviy dizayndagi kumush uzuk. Elegant va zamonaviy ko'rinishga ega bo'lgan bu uzuk har qanday kiyimga mos keladi. Yuqori sifatli kumushdan tayyorlangan.",
        price: 500000,
        category: "jewelry",
        categoryName: "Zargarlik buyumlari",
        emoji: "💍",
        stock: 8,
        sales: 156,
        images: ["💍", "💎", "✨", "👑"]
    },
    {
        id: 3,
        name: "Smartfon",
        description: "Eng yangi model smartfon. Yuqori samaradorlik, ajoyib kamera va uzun batareya muddati bilan. Zamonaviy texnologiyalar bilan jihozlangan.",
        price: 5000000,
        category: "electronics",
        categoryName: "Elektronika",
        emoji: "📱",
        stock: 5,
        sales: 89,
        images: ["📱", "📲", "💻", "⌚"]
    },
    {
        id: 4,
        name: "Kitoblar to'plami",
        description: "Bestseller kitoblar to'plami. Eng mashhur mualliflar asarlaridan iborat. Har bir kitob o'qishga qiziqarli va foydali.",
        price: 200000,
        category: "books",
        categoryName: "Kitoblar",
        emoji: "📚",
        stock: 25,
        sales: 312,
        images: ["📚", "📖", "📕", "📗"]
    },
    {
        id: 5,
        name: "O'yinchoq ayiq",
        description: "Yumshoq o'yinchoq ayiq. Bolalar uchun ajoyib sovg'a. Yuqori sifatli materialdan tayyorlangan va xavfsiz.",
        price: 80000,
        category: "toys",
        categoryName: "O'yinchoqlar",
        emoji: "🧸",
        stock: 30,
        sales: 445,
        images: ["🧸", "🐻", "🎁", "🎈"]
    },
    {
        id: 6,
        name: "Sariq guldasta",
        description: "Quyosh rangidagi gullar. Quyoshdek yorug' va quvnoq ranglar bilan sizning kunningizni yanada yorug'roq qiladi.",
        price: 120000,
        category: "flowers",
        categoryName: "Gullar",
        emoji: "🌻",
        stock: 20,
        sales: 189,
        images: ["🌻", "🌼", "🌷", "🌹"]
    },
    {
        id: 7,
        name: "Oltin zanjir",
        description: "Elegant oltin zanjir. Klassik dizayn bilan zamonaviy uslubni uyg'unlashtirgan. Har qanday holatga mos keladi.",
        price: 800000,
        category: "jewelry",
        categoryName: "Zargarlik buyumlari",
        emoji: "⛓️",
        stock: 12,
        sales: 98,
        images: ["⛓️", "💍", "💎", "✨"]
    },
    {
        id: 8,
        name: "Noutbuk",
        description: "Yuqori samaradorlikdagi noutbuk. Ish va o'yinlar uchun ideal. Kuchli protsessor va yaxshi ekran sifati.",
        price: 8000000,
        category: "electronics",
        categoryName: "Elektronika",
        emoji: "💻",
        stock: 3,
        sales: 45,
        images: ["💻", "⌨️", "🖥️", "📱"]
    },
    {
        id: 9,
        name: "Romantik roman",
        description: "Sevgi haqidagi roman. Chuqur hissiyotlar va qiziqarli syujet bilan. O'qishni yaxshi ko'radiganlar uchun.",
        price: 60000,
        category: "books",
        categoryName: "Kitoblar",
        emoji: "📖",
        stock: 40,
        sales: 567,
        images: ["📖", "📚", "📕", "📗"]
    },
    {
        id: 10,
        name: "O'yinchoq mashina",
        description: "Radioboshqaruvli mashina. Bolalar uchun ajoyib sovg'a. Uzoq masofadan boshqariladi va tez harakatlanadi.",
        price: 150000,
        category: "toys",
        categoryName: "O'yinchoqlar",
        emoji: "🚗",
        stock: 18,
        sales: 234,
        images: ["🚗", "🚙", "🏎️", "🚕"]
    },
    {
        id: 11,
        name: "Qizil va oq gullar",
        description: "Arlekin guldasta. Qizil va oq ranglarining chiroyli kombinatsiyasi. Maxsus holatlar uchun ideal.",
        price: 180000,
        category: "flowers",
        categoryName: "Gullar",
        emoji: "🌺",
        stock: 22,
        sales: 278,
        images: ["🌺", "🌹", "🌻", "🌸"]
    },
    {
        id: 12,
        name: "Marvarid marjon",
        description: "Tabiiy marvarid marjon. Klassik va zamonaviy dizayn. Har qanday kiyimga mos keladi va elegan ko'rinish beradi.",
        price: 600000,
        category: "jewelry",
        categoryName: "Zargarlik buyumlari",
        emoji: "📿",
        stock: 10,
        sales: 123,
        images: ["📿", "💍", "💎", "✨"]
    }
];

// Savat ma'lumotlari
let cart = [];
let currentCategory = 'all';
let searchQuery = '';
let currentImageIndex = 0;
let currentProductImages = [];

// DOM elementlar - DOMContentLoaded ichida o'rnatiladi
let productsGrid, cartBtn, cartSidebar, cartOverlay, closeCart, cartItems, cartCount, totalPrice, checkoutBtn;
let searchBtn, searchModal, closeSearch, searchInput;
let categoryCards, menuToggle, nav, contactForm;
let productModal, productModalOverlay, closeProductModalBtn, productDetailContainer;

// DOM elementlarini o'rnatish
function initDOMElements() {
    productsGrid = document.getElementById('productsGrid');
    cartBtn = document.getElementById('cartBtn');
    cartSidebar = document.getElementById('cartSidebar');
    cartOverlay = document.getElementById('cartOverlay');
    closeCart = document.getElementById('closeCart');
    cartItems = document.getElementById('cartItems');
    cartCount = document.getElementById('cartCount');
    totalPrice = document.getElementById('totalPrice');
    checkoutBtn = document.getElementById('checkoutBtn');
    searchBtn = document.getElementById('searchBtn');
    searchModal = document.getElementById('searchModal');
    closeSearch = document.getElementById('closeSearch');
    searchInput = document.getElementById('searchInput');
    categoryCards = document.querySelectorAll('.category-card');
    menuToggle = document.getElementById('menuToggle');
    nav = document.querySelector('.nav');
    contactForm = document.getElementById('contactForm');
    productModal = document.getElementById('productModal');
    productModalOverlay = document.getElementById('productModalOverlay');
    closeProductModalBtn = document.getElementById('closeProductModal');
    productDetailContainer = document.getElementById('productDetailContainer');
}

// Mahsulotlarni ko'rsatish
function displayProducts() {
    if (!productsGrid) {
        console.error('productsGrid elementi topilmadi');
        return;
    }
    
    let filteredProducts = products;

    // Kategoriya bo'yicha filtr
    if (currentCategory !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === currentCategory);
    }

    // Qidiruv bo'yicha filtr
    if (searchQuery) {
        filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    productsGrid.innerHTML = '';

    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #999;">Mahsulot topilmadi</p>';
        return;
    }

    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.style.cursor = 'pointer';
        productCard.addEventListener('click', (e) => {
            // Agar button yoki uning ichidagi elementga bosilgan bo'lsa, modal ochilmasin
            if (!e.target.closest('.add-to-cart')) {
                openProductModal(product.id);
            }
        });
        productCard.innerHTML = `
            <div class="product-image">
                ${product.emoji}
                <div class="product-category-badge">${product.categoryName || categoryNames[product.category]}</div>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">${formatPrice(product.price)}</span>
                    <button class="add-to-cart" onclick="event.stopPropagation(); addToCart(${product.id})">
                        Savatga qo'shish
                    </button>
                </div>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Narxni formatlash
function formatPrice(price) {
    return new Intl.NumberFormat('uz-UZ').format(price) + ' so\'m';
}

// Savatga qo'shish
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCart();
    showNotification(`${product.name} savatga qo'shildi!`);
}

// Savatni yangilash
function updateCart() {
    if (!cartCount) return;
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    displayCartItems();
    updateTotal();
}

// Savat mahsulotlarini ko'rsatish
function displayCartItems() {
    if (!cartItems) return;
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart"><p>Savat bo\'sh</p></div>';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">${item.emoji}</div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${formatPrice(item.price)}</div>
                <div class="cart-item-actions">
                    <button class="quantity-btn" onclick="changeQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
                    <button class="remove-item" onclick="removeFromCart(${item.id})">O'chirish</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Miqdorni o'zgartirish
function changeQuantity(productId, change) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCart();
    }
}

// Savatdan olib tashlash
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    showNotification('Mahsulot savatdan olib tashlandi');
}

// Jami narxni hisoblash
function updateTotal() {
    if (!totalPrice) return;
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalPrice.textContent = formatPrice(total);
}

// Bildirishnoma ko'rsatish
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Event listenerlar initEventListeners() funksiyasiga ko'chirildi

// Scroll animatsiyasi
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Animatsiya uchun elementlarni kuzatish
document.addEventListener('DOMContentLoaded', () => {
    // DOM elementlarini o'rnatish
    initDOMElements();
    
    // Event listenerlarni o'rnatish
    initEventListeners();
    
    // Dastlabki mahsulotlarni ko'rsatish
    displayProducts();
    updateCart();
    
    // Animatsiyalar uchun elementlarni kuzatish
    setTimeout(() => {
        const animatedElements = document.querySelectorAll('.product-card, .category-card, .feature');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s, transform 0.5s';
            observer.observe(el);
        });
    }, 100);
});

// Event listenerlarni o'rnatish
function initEventListeners() {
    // Kategoriya tanlash
    if (categoryCards && categoryCards.length > 0) {
        categoryCards.forEach(card => {
            card.addEventListener('click', () => {
                categoryCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                currentCategory = card.dataset.category;
                displayProducts();
            });
        });
    }

    // Savatni ochish/yopish
    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            if (cartSidebar && cartOverlay) {
                cartSidebar.classList.add('active');
                cartOverlay.classList.add('active');
            }
        });
    }

    if (closeCart) {
        closeCart.addEventListener('click', () => {
            if (cartSidebar && cartOverlay) {
                cartSidebar.classList.remove('active');
                cartOverlay.classList.remove('active');
            }
        });
    }

    if (cartOverlay) {
        cartOverlay.addEventListener('click', () => {
            if (cartSidebar) {
                cartSidebar.classList.remove('active');
                cartOverlay.classList.remove('active');
            }
        });
    }

    // Qidiruvni ochish/yopish
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            if (searchModal && searchInput) {
                searchModal.classList.add('active');
                searchInput.focus();
            }
        });
    }

    if (closeSearch) {
        closeSearch.addEventListener('click', () => {
            if (searchModal && searchInput) {
                searchModal.classList.remove('active');
                searchInput.value = '';
                searchQuery = '';
                displayProducts();
            }
        });
    }

    if (searchModal) {
        searchModal.addEventListener('click', (e) => {
            if (e.target === searchModal) {
                searchModal.classList.remove('active');
            }
        });
    }

    // Qidiruv funksiyasi
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            displayProducts();
        });

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && searchModal) {
                searchModal.classList.remove('active');
            }
        });
    }

    // Buyurtma berish
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showNotification('Savat bo\'sh!');
                return;
            }
            
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            alert(`Buyurtma muvaffaqiyatli qabul qilindi!\n\nJami: ${formatPrice(total)}\n\nTez orada siz bilan bog'lanamiz!`);
            
            cart = [];
            updateCart();
            if (cartSidebar && cartOverlay) {
                cartSidebar.classList.remove('active');
                cartOverlay.classList.remove('active');
            }
        });
    }

    // Mobil menyu
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
    }

    // Nav linklarini bosganda menyuni yopish
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (nav) {
                nav.classList.remove('active');
            }
        });
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Aloqa formasi
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('Xabaringiz yuborildi! Tez orada javob beramiz.');
            contactForm.reset();
        });
    }

    // Modal yopish eventlari
    if (closeProductModalBtn) {
        closeProductModalBtn.addEventListener('click', () => closeProductModal());
    }
    if (productModalOverlay) {
        productModalOverlay.addEventListener('click', () => closeProductModal());
    }

    // ESC tugmasi bilan yopish
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && productModal && productModal.classList.contains('active')) {
            closeProductModal();
        }
    });
}

// Mahsulot modalini ochish
function openProductModal(productId) {
    if (!productModal || !productDetailContainer) return;
    
    const product = products.find(p => p.id === productId);
    if (!product) return;

    currentImageIndex = 0;
    currentProductImages = product.images || [product.emoji];

    const stockClass = product.stock <= 5 ? 'stock-low' : product.stock <= 15 ? 'stock-medium' : 'stock-high';

    productDetailContainer.innerHTML = `
        <div class="product-detail-images">
            <div class="product-main-image" id="mainImage">
                ${currentProductImages.length > 0 ? getImageElement(currentProductImages[0]) : product.emoji}
                <div class="product-detail-category-badge">${product.categoryName || categoryNames[product.category]}</div>
                ${currentProductImages.length > 1 ? `
                    <button class="carousel-nav prev" onclick="changeImage(-1)">‹</button>
                    <button class="carousel-nav next" onclick="changeImage(1)">›</button>
                ` : ''}
            </div>
            ${currentProductImages.length > 1 ? `
                <div class="product-image-carousel" id="imageCarousel">
                    ${currentProductImages.map((img, index) => `
                        <div class="product-thumbnail ${index === 0 ? 'active' : ''}" onclick="selectImage(${index})">
                            ${getImageElement(img)}
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        </div>
        <div class="product-detail-info">
            <h2 class="product-detail-name">${product.name}</h2>
            <p class="product-detail-description">${product.description}</p>
            <div class="product-detail-price">${formatPrice(product.price)}</div>
            <div class="product-stats">
                <div class="product-stat">
                    <span class="product-stat-label">Qolgan</span>
                    <span class="product-stat-value ${stockClass}">${product.stock || 0}</span>
                </div>
                <div class="product-stat">
                    <span class="product-stat-label">Sotuvlar</span>
                    <span class="product-stat-value">${product.sales || 0}</span>
                </div>
            </div>
            <div class="product-detail-actions">
                <button class="btn btn-primary" onclick="addToCart(${product.id}); window.closeProductModal();">
                    Savatga qo'shish
                </button>
            </div>
        </div>
    `;

    productModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Rasm elementini olish
function getImageElement(img) {
    // Agar emoji bo'lsa
    if (img.length <= 2) {
        return img;
    }
    // Agar URL bo'lsa
    return `<img src="${img}" alt="Product image">`;
}

// Rasmlarni o'zgartirish
function changeImage(direction) {
    currentImageIndex += direction;
    
    if (currentImageIndex < 0) {
        currentImageIndex = currentProductImages.length - 1;
    } else if (currentImageIndex >= currentProductImages.length) {
        currentImageIndex = 0;
    }

    updateMainImage();
    updateThumbnails();
}

// Rasmni tanlash
function selectImage(index) {
    currentImageIndex = index;
    updateMainImage();
    updateThumbnails();
}

// Asosiy rasmini yangilash
function updateMainImage() {
    const mainImage = document.getElementById('mainImage');
    if (mainImage && currentProductImages[currentImageIndex]) {
        const categoryBadge = mainImage.querySelector('.product-detail-category-badge');
        const prevBtn = mainImage.querySelector('.carousel-nav.prev');
        const nextBtn = mainImage.querySelector('.carousel-nav.next');
        
        const imgElement = getImageElement(currentProductImages[currentImageIndex]);
        let html = imgElement;
        
        if (categoryBadge) {
            html += categoryBadge.outerHTML;
        }
        
        if (currentProductImages.length > 1) {
            if (prevBtn) html += prevBtn.outerHTML;
            if (nextBtn) html += nextBtn.outerHTML;
        }
        
        mainImage.innerHTML = html;
    }
}

// Thumbnail rasmlarni yangilash
function updateThumbnails() {
    const thumbnails = document.querySelectorAll('.product-thumbnail');
    thumbnails.forEach((thumb, index) => {
        if (index === currentImageIndex) {
            thumb.classList.add('active');
        } else {
            thumb.classList.remove('active');
        }
    });
}

// Modalni yopish
function closeProductModal() {
    if (!productModal) return;
    productModal.classList.remove('active');
    document.body.style.overflow = '';
}

// Global funksiya sifatida qo'shish (onclick uchun)
window.closeProductModal = closeProductModal;

// CSS animatsiyalari qo'shish
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
