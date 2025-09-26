// Инициализация корзины
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Функция обновления корзины
function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }
}

// Добавление товара в корзину
function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({...product, quantity: 1});
    }
    updateCart();
    // Анимация
    const btn = event.target;
    btn.classList.add('added-to-cart');
    setTimeout(() => btn.classList.remove('added-to-cart'), 500);
    alert(`Товар "${product.name}" добавлен в корзину!`);
}

// Удаление товара из корзины
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
    renderCart();
    updateStats();
}

// Отрисовка корзины
function renderCart() {
    const cartContainer = document.querySelector('.cart-items');
    if (!cartContainer) return;

    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Корзина пуста</p>';
        return;
    }

    cart.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.classList.add('cart-item');
        itemEl.innerHTML = `
            <h3>${item.name}</h3>
            <p>Цена: ₽${item.price}</p>
            <p>Количество: ${item.quantity}</p>
            <button onclick="removeFromCart(${item.id})">Удалить</button>
        `;
        cartContainer.appendChild(itemEl);
    });
}

// Статистика
function updateStats() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const statsEl = document.querySelector('.stats');
    if (statsEl) {
        statsEl.innerHTML = `
            <h3>Статистика корзины</h3>
            <p>Товаров: ${totalItems}</p>
            <p>Общая сумма: ₽${totalPrice}</p>
        `;
    }
}

// Пример данных товаров
const products = [
    { id: 1, name: "Nike Air Max 270", price: 12999, brand: "Nike", image: "images/sneakers.jpg", sizes: [39,40,41,42,43,44,45] },
    { id: 2, name: "Adidas Ultraboost 24", price: 14499, brand: "Adidas", image: "images/sneakers.jpg", sizes: [38,39,40,41,42,43,44] },
    { id: 3, name: "Puma RS-X", price: 8999, brand: "Puma", image: "images/sneakers.jpg", sizes: [37,38,39,40,41,42,43] },
    { id: 4, name: "Jordan 1 High OG", price: 18999, brand: "Jordan", image: "images/sneakers.jpg", sizes: [40,41,42,43,44,45] },
    { id: 5, name: "New Balance 550", price: 10499, brand: "New Balance", image: "images/sneakers.jpg", sizes: [39,40,41,42,43,44,45] },
    { id: 6, name: "Yeezy Boost 350", price: 25999, brand: "Yeezy", image: "images/sneakers.jpg", sizes: [39,40,41,42,43,44,45] },
];

// Фильтрация и сортировка товаров
function renderProducts(filter = {}) {
    const list = document.getElementById('products-list');
    const maxPrice = filter.price || 30000;
    const brand = filter.brand || '';
    const sortBy = filter.sortBy || 'name';

    list.innerHTML = '';

    let filtered = products.filter(p => p.price <= maxPrice && (brand === '' || p.brand === brand));

    // Сортировка
    if (sortBy === 'price-asc') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
        filtered.sort((a, b) => b.price - a.price);
    } else {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    filtered.forEach(p => {
        const card = document.createElement('div');
        card.classList.add('product-card');
        card.onclick = () => openProductModal(p);
        card.innerHTML = `
            <img src="${p.image}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p class="price">₽${p.price}</p>
            <button class="btn-sm" onclick="event.stopPropagation(); addToCart({id: ${p.id}, name: '${p.name}', price: ${p.price}})">В корзину</button>
            <button class="btn-sm" onclick="event.stopPropagation(); quickCheckout({id: ${p.id}, name: '${p.name}', price: ${p.price}})">Купить сейчас</button>
        `;
        list.appendChild(card);
    });
}

// Модальное окно товара
function openProductModal(product) {
    const modal = document.getElementById('product-modal');
    const content = document.querySelector('.modal-content');
    content.innerHTML = `
        <span class="close-modal" onclick="closeProductModal()">&times;</span>
        <img src="${product.image}" alt="${product.name}" style="width: 100%;">
        <h2>${product.name}</h2>
        <p class="price">₽${product.price}</p>
        <p>Бренд: ${product.brand}</p>
        <p>Доступные размеры: ${product.sizes.join(', ')}</p>
        <button class="btn" onclick="addToCart({id: ${product.id}, name: '${product.name}', price: ${product.price}})">Добавить в корзину</button>
        <button class="btn" style="margin-left: 10px;" onclick="quickCheckout({id: ${product.id}, name: '${product.name}', price: ${product.price}})">Купить сейчас</button>
    `;
    modal.style.display = 'flex';
}

function closeProductModal() {
    document.getElementById('product-modal').style.display = 'none';
}

// Покупка сейчас
function buyNow(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        quickCheckout(product);
    }
}

// Быстрое оформление
function quickCheckout(product) {
    const quickModal = document.getElementById('quick-checkout-modal');
    const content = document.querySelector('.quick-checkout-content');
    content.innerHTML = `
        <span class="close-quick-checkout" onclick="closeQuickCheckout()">&times;</span>
        <h2>Быстрое оформление заказа</h2>
        <p><strong>Товар:</strong> ${product.name}</p>
        <p><strong>Цена:</strong> ₽${product.price}</p>
        <form id="quick-checkout-form">
            <label>Имя *</label>
            <input type="text" id="quick-name" required>

            <label>Email *</label>
            <input type="email" id="quick-email" required>

            <label>Телефон *</label>
            <input type="tel" id="quick-phone" required>

            <label>Адрес доставки *</label>
            <textarea id="quick-address" required></textarea>

            <label>Способ оплаты</label>
            <select id="quick-payment" required>
                <option>Онлайн-оплата</option>
                <option>Наличные при получении</option>
                <option>Карта</option>
            </select>

            <button type="submit" class="btn">Оформить заказ</button>
        </form>
    `;
    quickModal.style.display = 'flex';

    document.getElementById('quick-checkout-form').onsubmit = function(e) {
        e.preventDefault();
        placeQuickOrder(product);
    };
}

function placeQuickOrder(product) {
    const name = document.getElementById('quick-name').value;
    const email = document.getElementById('quick-email').value;
    const phone = document.getElementById('quick-phone').value;
    const address = document.getElementById('quick-address').value;
    const payment = document.getElementById('quick-payment').value;

    if (!name || !email || !phone || !address || !payment) {
        alert('Пожалуйста, заполните все поля!');
        return;
    }

    alert(`Заказ на "${product.name}" успешно оформлен!\nСпособ оплаты: ${payment}\nЦена: ₽${product.price}`);
    closeQuickCheckout();
}

function closeQuickCheckout() {
    document.getElementById('quick-checkout-modal').style.display = 'none';
}

// Слайдер
let slideIndex = 0;
function showSlides() {
    const slides = document.querySelectorAll('.slide');
    const total = slides.length;

    slides.forEach((slide, i) => {
        slide.style.display = i === slideIndex ? 'block' : 'none';
    });
}

function nextSlide() {
    slideIndex = (slideIndex + 1) % document.querySelectorAll('.slide').length;
    showSlides();
}

function prevSlide() {
    const total = document.querySelectorAll('.slide').length;
    slideIndex = (slideIndex - 1 + total) % total;
    showSlides();
}

// Оформление заказа
function placeOrder() {
    const name = document.getElementById('order-name').value;
    const email = document.getElementById('order-email').value;
    const phone = document.getElementById('order-phone').value;
    const address = document.getElementById('order-address').value;
    const payment = document.getElementById('order-payment').value;

    if (!name || !email || !phone || !address || !payment) {
        alert('Пожалуйста, заполните все поля!');
        return;
    }

    if (cart.length === 0) {
        alert('Корзина пуста!');
        return;
    }

    alert(`Заказ успешно оформлен!\nСпособ оплаты: ${payment}\nОбщая сумма: ₽${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)}`);
    cart = [];
    updateCart();
    updateStats();
    renderCart();
    document.getElementById('checkout-form').reset();
}

// Адаптивное меню
document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('nav-menu');

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Закрытие меню при клике на ссылку
    document.querySelectorAll('.nav a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // Обновление корзины и статистики при загрузке
    updateCart();
    renderCart();
    updateStats();

    // Фильтры в каталоге
    const priceFilter = document.getElementById('price-filter');
    const brandFilter = document.getElementById('brand-filter');
    const sortFilter = document.getElementById('sort-filter');
    const priceValue = document.getElementById('price-value');

    if (priceFilter && brandFilter) {
        priceFilter.addEventListener('input', function () {
            priceValue.textContent = `До ₽${this.value}`;
            renderProducts({ price: this.value, brand: brandFilter.value, sortBy: sortFilter.value });
        });

        brandFilter.addEventListener('change', function () {
            renderProducts({ price: priceFilter.value, brand: this.value, sortBy: sortFilter.value });
        });

        sortFilter && sortFilter.addEventListener('change', function () {
            renderProducts({ price: priceFilter.value, brand: brandFilter.value, sortBy: this.value });
        });
    }

    // Запуск отображения товаров
    renderProducts();

    // Слайдер
    showSlides();
    setInterval(nextSlide, 5000);

    // Обработчик формы оформления заказа
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            placeOrder();
        });
    }
});