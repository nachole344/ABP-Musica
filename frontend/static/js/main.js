let currentArtistIndex = 0;
let artistsData = [];
let productsData = [];
let eventsData = [];
let ordersData = [];
let orderItemsData = [];
let cart = [];

const mockProducts = [
    { product_id: 1, product_name: "Álbum 'Echoes en la Noche'", product_type: "album", price: 15.99, image_url: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=400" },
    { product_id: 2, product_name: "Vinilo Edición Especial Clásicos", product_type: "vinyl", price: 35.50, image_url: "https://images.unsplash.com/photo-1538688423619-a81d3f23454b?auto=format&fit=crop&q=80&w=400" },
    { product_id: 3, product_name: "Camiseta Tour 2024 (Negra)", product_type: "clothing", price: 25.00, image_url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=400" },
    { product_id: 4, product_name: "Tote Bag Sostenible Algodón", product_type: "tote_bag", price: 12.00, image_url: "https://images.unsplash.com/photo-1597423235375-14f7623a31eb?auto=format&fit=crop&q=80&w=400" },
    { product_id: 5, product_name: "Sudadera SoundScape Premium", product_type: "clothing", price: 45.00, image_url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=400" },
    { product_id: 6, product_name: "Pin Metálico Logo Banda", product_type: "pin", price: 5.50, image_url: "https://images.unsplash.com/photo-1611078716388-3485ba8051a8?auto=format&fit=crop&q=80&w=400" }
];

const mockOrders = [
    { order_id: 1, order_date: "2026-03-15", total_price: 21.49, status: "delivered" },
    { order_id: 2, order_date: "2026-05-20", total_price: 85.50, status: "paid" },
    { order_id: 3, order_date: "2026-05-21", total_price: 87.50, status: "pending" }
];

const mockOrderItems = [
    { order_item_id: 1, order_id: 1, product_id: 1, quantity: 1, price: 15.99 },
    { order_item_id: 2, order_id: 1, product_id: 6, quantity: 1, price: 5.50 },
    { order_item_id: 3, order_id: 2, product_id: 2, quantity: 1, price: 35.50 },
    { order_item_id: 4, order_id: 2, product_id: 3, quantity: 2, price: 25.00 },
    { order_item_id: 5, order_id: 3, product_id: 5, quantity: 1, price: 45.00 },
    { order_item_id: 6, order_id: 3, product_id: 3, quantity: 1, price: 25.00 },
    { order_item_id: 7, order_id: 3, product_id: 4, quantity: 1, price: 12.00 },
    { order_item_id: 8, order_id: 3, product_id: 6, quantity: 1, price: 5.50 }
];

document.addEventListener('DOMContentLoaded', () => {
    console.log('SoundScape: Inicializando aplicación...');
    if (window.lucide) lucide.createIcons();
    fetchArtists();
    fetchProducts();
    fetchEvents();
    fetchOrders();
    checkLoginStatus();
});

// NAVEGACIÓN GLOBAL
function showSection(sectionId) {
    const sections = ['home', 'artists', 'shop', 'extras', 'sustainability'];
    sections.forEach(s => {
        const element = document.getElementById(s + '-section');
        const navLink = document.getElementById('nav-' + s);
        if (element) {
            element.classList.remove('active');
            if (element.classList.contains('viewport-section')) element.style.display = 'none';
        }
        if (navLink) navLink.classList.remove('active');
    });
    const activeSection = document.getElementById(sectionId + '-section');
    const activeNavLink = document.getElementById('nav-' + sectionId);
    if (activeSection) {
        activeSection.classList.add('active');
        if (activeSection.classList.contains('viewport-section')) activeSection.style.display = 'flex';
    }
    if (activeNavLink) activeNavLink.classList.add('active');
    closeCatalog();
    hideLogin();
    if (window.lucide) lucide.createIcons();
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if (menu) menu.classList.toggle('show');
}

// FETCH FUNCTIONS
async function fetchArtists() {
    try {
        const response = await fetch('/api/artists/', { credentials: 'include' });
        if (!response.ok) throw new Error('API no disponible');
        artistsData = await response.json();
        renderArtistSlides();
    } catch (error) {
        console.warn('Cargando mock data para artistas...');
    }
}

async function fetchProducts() {
    try {
        const response = await fetch('/api/shop/', { credentials: 'include' });
        const data = await response.json();
        if (data.length === 0) {
            console.warn('BD vacía. Cargando mock data de productos...');
            productsData = mockProducts;
        } else {
            productsData = data;
        }
        renderProducts(productsData);
    } catch (error) {
        console.warn('Backend inactivo. Cargando mock data de productos...');
        productsData = mockProducts;
        renderProducts(productsData);
    }
}

async function fetchOrders() {
    try {
        const response = await fetch('/api/orders/', { credentials: 'include' });
        const data = await response.json();
        ordersData = data.length === 0 ? mockOrders : data;
        fetchOrdersItems();
    } catch (error) {
        console.warn('Backend inactivo. Cargando mock data de pedidos...');
        ordersData = mockOrders;
        fetchOrdersItems();
    }
}

async function fetchOrdersItems() {
    try {
        const response = await fetch('/api/orders/items/', { credentials: 'include' });
        const data = await response.json();
        orderItemsData = data.length === 0 ? mockOrderItems : data;
        renderOrders();
    } catch (error) {
        console.warn('Backend inactivo. Cargando mock data de items...');
        orderItemsData = mockOrderItems;
        renderOrders();
    }
}

async function fetchEvents() {
    try {
        const response = await fetch('/api/events/', { credentials: 'include' });
        if (!response.ok) throw new Error('API no disponible');
        eventsData = await response.json();
        renderEvents();
    } catch (error) {
        console.warn('Cargando mock data para eventos...');
        renderEvents();
    }
}

// RENDER FUNCTIONS
function renderArtistSlides() {
    const container = document.getElementById('artists-slides-container');
    if (!container) return;
    container.innerHTML = artistsData.map((artist, index) => `
        <div class="artist-slide ${index === 0 ? 'active' : ''}" id="slide-${index}">
            <video class="video-bg" autoplay muted loop playsinline>
                <source src="${artist.video_url || ''}" type="video/mp4">
            </video>
            <div class="artist-info relative z-20">
                <h2 class="fade-in text-shadow-lg">${artist.artist_name}</h2>
                <button class="mt-8 px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform shadow-2xl"
                        onclick="viewArtistCatalog(${index})">VER CATÁLOGO</button>
            </div>
        </div>
    `).join('');
}

function renderProducts(productsToRender = productsData) {
    const container = document.getElementById('shop-container');
    if (!container) return;
    if (productsToRender.length === 0) {
        container.innerHTML = `<p class="text-slate-400 col-span-full text-center py-10">No hay productos disponibles en esta categoría.</p>`;
        return;
    }
    container.innerHTML = productsToRender.map(product => {
        const inStock = product.stock === undefined || product.stock > 0;
        const stockBadge = product.stock !== undefined
            ? `<span class="text-xs font-semibold ${inStock ? 'text-emerald-400' : 'text-red-400'}">${inStock ? `Stock: ${product.stock}` : 'Sin stock'}</span>`
            : '';
        return `
        <div class="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all group flex flex-col justify-between">
            <div>
                <img src="${product.image_url}" class="w-full aspect-square object-cover rounded-xl mb-4 group-hover:scale-105 transition-transform" alt="${product.product_name}">
                <h3 class="font-bold text-lg leading-tight mb-1">${product.product_name}</h3>
                <div class="flex items-center justify-between mb-4">
                    <p class="text-slate-400 text-xs font-semibold tracking-widest uppercase">${product.product_type.replace('_', ' ')}</p>
                    ${stockBadge}
                </div>
            </div>
            <div class="flex items-center justify-between mt-4 gap-2">
                <span class="text-xl font-black">${product.price.toFixed(2)}€</span>
                <div class="flex items-center gap-1.5">
                    <input type="number" id="qty-${product.product_id}" value="1" min="1" max="${product.stock || 99}"
                           ${!inStock ? 'disabled' : ''}
                           class="w-12 p-1.5 bg-white/10 text-white rounded-lg text-center text-sm font-bold border border-white/10 focus:outline-none focus:border-red-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none disabled:opacity-40">
                    <button class="p-2 rounded-lg transition-colors ${inStock ? 'bg-red-500 hover:bg-red-600' : 'bg-slate-600 cursor-not-allowed opacity-50'}"
                            onclick="${inStock ? `addToCart(${product.product_id})` : ''}" ${!inStock ? 'disabled' : ''}>
                        <i data-lucide="shopping-cart" size="20"></i>
                    </button>
                </div>
            </div>
        </div>`;
    }).join('');
    if (window.lucide) lucide.createIcons();
}

function filterProducts(type) {
    if (type === 'all') {
        renderProducts(productsData);
    } else {
        renderProducts(productsData.filter(p => p.product_type === type));
    }
}

function renderEvents() {
    const container = document.querySelector('#extras-section .grid');
    if (!container) return;
    container.innerHTML = eventsData.map(event => `
        <div class="flex flex-col md:flex-row gap-6 bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all">
            <img src="${event.poster}" class="w-full md:w-48 aspect-[3/4] object-cover rounded-2xl shadow-xl" alt="${event.event_name}">
            <div class="flex flex-col justify-center">
                <span class="text-amber-500 font-bold tracking-widest text-sm uppercase mb-2">${event.event_type}</span>
                <h3 class="text-3xl font-black mb-4">${event.event_name}</h3>
                <div class="flex items-center gap-4 text-slate-400 mb-6">
                    <span class="flex items-center gap-2"><i data-lucide="calendar" size="16"></i> ${new Date(event.event_date).toLocaleDateString()}</span>
                    <span class="flex items-center gap-2"><i data-lucide="map-pin" size="16"></i> ${event.location}</span>
                </div>
                <button class="px-6 py-2 bg-white text-black font-bold rounded-full self-start hover:bg-amber-500 hover:text-white transition-all">RESERVAR</button>
            </div>
        </div>
    `).join('');
    if (window.lucide) lucide.createIcons();
}

// CATÁLOGO DE ARTISTA
function viewArtistCatalog(index) {
    const artist = artistsData[index];
    const catalogOverlay = document.getElementById('catalog-overlay');
    const catalogContent = document.getElementById('catalog-content');
    if (!catalogOverlay || !catalogContent || !artist) return;

    catalogContent.innerHTML = `
        <div class="row pt-10 md:pt-20 pb-20">
            <div class="col-lg-4 mb-20 sticky-lg-top" style="top: 2rem; height: fit-content;">
                <h1 class="text-6xl md:text-8xl font-black mb-4 leading-none">${artist.artist_name}</h1>
                <p class="text-blue-500 font-bold tracking-widest uppercase mb-6">${artist.country} • Debut ${new Date(artist.debut).getFullYear()}</p>
                <p class="text-slate-400 text-lg leading-relaxed mb-10">${artist.description || 'Sin descripción.'}</p>
                <a href="${artist.social_media}" target="_blank" class="btn btn-outline-light rounded-pill px-6 py-3 font-bold">REDES SOCIALES</a>
            </div>
            <div class="col-lg-7 offset-lg-1">
                <h3 class="text-2xl font-black mb-10 flex items-center gap-4 tracking-tighter">
                    <i data-lucide="disc" class="text-blue-500"></i> DISCOGRAFÍA
                </h3>
                <div class="space-y-16">
                    ${(artist.albums || []).map(album => `
                        <div class="row g-8">
                            <div class="col-md-4">
                                <div class="glass-card p-2 rounded-2xl">
                                    <img src="${album.cover_album}" class="w-full aspect-square object-cover rounded-xl shadow-2xl mb-4" alt="${album.album_title}">
                                    <h4 class="font-bold text-xl">${album.album_title}</h4>
                                    <p class="text-slate-500 text-sm mb-3">${new Date(album.release_date).getFullYear()}</p>
                                    ${album.spotify ? `<a href="${album.spotify}" target="_blank" rel="noopener noreferrer"
                                        class="inline-flex items-center gap-2 px-4 py-2 bg-[#1DB954] text-black text-sm font-bold rounded-full hover:bg-[#1ed760] transition-colors no-underline">
                                        <i data-lucide="music" size="14"></i> Spotify
                                    </a>` : ''}
                                </div>
                            </div>
                            <div class="col-md-8">
                                <div class="space-y-1">
                                    ${(album.songs || []).map((song, i) => `
                                        <a ${song.video_url ? `href="${song.video_url}" target="_blank" rel="noopener noreferrer"` : ''}
                                           class="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all group no-underline ${song.video_url ? 'cursor-pointer' : 'pointer-events-none'}">
                                            <div class="flex items-center gap-4">
                                                <span class="text-slate-600 font-mono text-sm">${String(i + 1).padStart(2, '0')}</span>
                                                <span class="font-semibold text-slate-200">${song.song_title}</span>
                                                ${song.video_url ? '<i data-lucide="play-circle" class="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" size="16"></i>' : ''}
                                            </div>
                                            <span class="text-slate-500 font-mono text-xs">${song.duration}</span>
                                        </a>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    catalogOverlay.style.display = 'block';
    setTimeout(() => catalogOverlay.classList.add('active'), 10);
    if (window.lucide) lucide.createIcons();
}

function closeCatalog() {
    const catalogOverlay = document.getElementById('catalog-overlay');
    if (catalogOverlay) {
        catalogOverlay.classList.remove('active');
        setTimeout(() => { catalogOverlay.style.display = 'none'; }, 300);
    }
}

function nextArtist() { updateSlide((currentArtistIndex + 1) % artistsData.length); }
function prevArtist() { updateSlide((currentArtistIndex - 1 + artistsData.length) % artistsData.length); }

function updateSlide(newIndex) {
    const currentSlide = document.getElementById(`slide-${currentArtistIndex}`);
    if (currentSlide) currentSlide.classList.remove('active');
    currentArtistIndex = newIndex;
    const nextSlide = document.getElementById(`slide-${currentArtistIndex}`);
    if (nextSlide) nextSlide.classList.add('active');
}

// CARRITO
function openCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cart-overlay');
    overlay.classList.remove('hidden');
    setTimeout(() => overlay.classList.remove('opacity-0'), 10);
    sidebar.classList.remove('translate-x-full');
    renderCart();
}

function closeCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cart-overlay');
    sidebar.classList.add('translate-x-full');
    overlay.classList.add('opacity-0');
    setTimeout(() => overlay.classList.add('hidden'), 300);
}

function addToCart(productId) {
    const product = productsData.find(p => p.product_id === productId);
    if (!product) return;
    const qtyInput = document.getElementById(`qty-${productId}`);
    const quantityToAdd = qtyInput ? parseInt(qtyInput.value) || 1 : 1;
    const existingItem = cart.find(item => item.product_id === productId);
    if (existingItem) {
        existingItem.quantity += quantityToAdd;
    } else {
        cart.push({ ...product, quantity: quantityToAdd });
    }
    if (qtyInput) qtyInput.value = 1;
    updateCartCounter();
    renderCart();
    openCart();
}

function renderCart() {
    const list = document.getElementById('cartItems');
    const totalElement = document.getElementById('cartTotal');
    if (!list) return;
    list.innerHTML = '';
    let total = 0;
    if (cart.length === 0) {
        list.innerHTML = `<p class="text-center text-slate-500 mt-10">Tu carrito está vacío.</p>`;
        totalElement.innerText = '0.00€';
        return;
    }
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        list.innerHTML += `
            <div class="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5 justify-between hover:border-red-500 transition-colors">
                <div class="flex items-center gap-3">
                    <img src="${item.image_url}" alt="${item.product_name}" class="w-14 h-14 object-cover rounded-lg flex-shrink-0">
                    <div>
                        <h4 class="font-bold text-sm line-clamp-1 text-slate-200">${item.product_name}</h4>
                        <p class="text-slate-400 text-xs">${item.price}€ x ${item.quantity}</p>
                    </div>
                </div>
                <div class="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <span class="font-black text-sm">${itemTotal.toFixed(2)}€</span>
                    <button onclick="removeFromCart(${item.product_id})" class="text-slate-500 hover:text-red-500 transition-colors p-1">
                        <i data-lucide="trash" size="16"></i>
                    </button>
                </div>
            </div>
        `;
    });
    totalElement.innerText = total.toFixed(2) + '€';
    if (window.lucide) lucide.createIcons();
}

async function goToOrders() {
    if (cart.length === 0) { alert('¡Añade productos antes de procesar el pedido!'); return; }
    if (!confirm('¿Desea confirmar el pedido?')) return;

    const items = cart.map(item => ({ product_id: item.product_id, quantity: item.quantity }));
    try {
        const response = await fetch('/api/orders/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ items }),
        });
        const data = await response.json();
        if (response.ok) {
            alert(`Pedido #${data.order_id} creado. Total: ${data.total.toFixed(2)}€`);
            cart = [];
            updateCartCounter();
            renderCart();
            fetchOrders();
        } else {
            alert(`Error: ${data.error || 'No se pudo procesar el pedido'}`);
        }
    } catch (error) {
        console.error('Error al crear pedido:', error);
        alert('Error de conexión. Inténtalo de nuevo.');
    }
}

function updateCartCounter() {
    const counter = document.getElementById('cart-count');
    if (counter) counter.innerText = cart.reduce((sum, item) => sum + item.quantity, 0);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.product_id !== productId);
    updateCartCounter();
    renderCart();
}

function emptyCart() {
    if (cart.length === 0) return;
    if (confirm('¿Estás seguro de que deseas vaciar por completo tu carrito?')) {
        cart = [];
        updateCartCounter();
        renderCart();
    }
}

// PEDIDOS
function showPrviousOrders() {
    const modalOverlay = document.getElementById('orders-modal-overlay');
    const modalContent = document.getElementById('orders-modal-content');
    modalOverlay.classList.remove('hidden');
    setTimeout(() => {
        modalOverlay.classList.remove('opacity-0');
        modalContent.classList.remove('scale-95');
    }, 10);
    closeCart();
    renderOrders();
}

function closeOrdersModal() {
    const modalOverlay = document.getElementById('orders-modal-overlay');
    const modalContent = document.getElementById('orders-modal-content');
    modalOverlay.classList.add('opacity-0');
    modalContent.classList.add('scale-95');
    setTimeout(() => modalOverlay.classList.add('hidden'), 300);
}

function renderOrders() {
    const container = document.getElementById('orders-container');
    if (!container) return;
    if (!ordersData || ordersData.length === 0) {
        container.innerHTML = `<p class="text-center text-slate-500 py-10 text-lg">Aún no tienes pedidos anteriores.</p>`;
        return;
    }
    container.innerHTML = [...ordersData].reverse().map(order => {
        const orderItems = orderItemsData.filter(item => item.order_id === order.order_id);
        const itemsHtml = orderItems.map(item => {
            const productInfo = productsData.find(p => p.product_id === item.product_id);
            if (!productInfo) return '';
            return `
                <div class="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                    <div class="flex items-center gap-4">
                        <img src="${productInfo.image_url}" alt="${productInfo.product_name}" class="w-14 h-14 object-cover rounded-lg flex-shrink-0">
                        <div>
                            <h5 class="text-sm font-bold text-slate-200 line-clamp-1">${productInfo.product_name}</h5>
                            <p class="text-xs text-slate-400 mt-1">${item.quantity} ud. x ${item.price.toFixed(2)}€</p>
                        </div>
                    </div>
                    <span class="font-bold text-slate-300">${(item.quantity * item.price).toFixed(2)}€</span>
                </div>
            `;
        }).join('');

        let statusClasses = 'bg-slate-500/20 text-slate-400';
        let statusLabel = 'Desconocido';
        if (order.status === 'delivered') { statusClasses = 'bg-emerald-500/20 text-emerald-400'; statusLabel = 'Entregado'; }
        else if (order.status === 'paid') { statusClasses = 'bg-blue-500/20 text-blue-400'; statusLabel = 'Pagado'; }
        else if (order.status === 'pending') { statusClasses = 'bg-amber-500/20 text-amber-400'; statusLabel = 'Pendiente'; }

        return `
            <div class="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
                <div class="flex flex-col md:flex-row md:items-center justify-between mb-4 pb-4 border-b border-white/10 gap-4">
                    <div>
                        <h3 class="text-xl font-black text-white">Pedido #${order.order_id}</h3>
                        <div class="flex items-center gap-2 mt-1">
                            <i data-lucide="calendar" class="w-4 h-4 text-slate-400"></i>
                            <span class="text-sm text-slate-400">${new Date(order.order_date).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div class="flex items-center justify-between md:flex-col md:items-end gap-2">
                        <span class="px-3 py-1 text-xs font-bold rounded-full border border-white/5 uppercase tracking-widest ${statusClasses}">${statusLabel}</span>
                        <span class="text-2xl font-black text-white">${order.total_price.toFixed(2)}€</span>
                    </div>
                </div>
                <div class="space-y-1">${itemsHtml}</div>
            </div>
        `;
    }).join('');
    if (window.lucide) lucide.createIcons();
}

// LOGIN Y ADMIN
function showLogin() {
    const loginSection = document.getElementById('login-section');
    if (loginSection) { loginSection.classList.add('active'); loginSection.style.display = 'flex'; }
}

function hideLogin() {
    const loginSection = document.getElementById('login-section');
    if (loginSection) {
        loginSection.classList.remove('active');
        setTimeout(() => { loginSection.style.display = 'none'; }, 300);
    }
}

function switchAuthTab(tab) {
    const loginPanel = document.getElementById('auth-login-panel');
    const registerPanel = document.getElementById('auth-register-panel');
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    if (tab === 'login') {
        loginPanel.classList.remove('hidden');
        registerPanel.classList.add('hidden');
        tabLogin.classList.add('bg-blue-600', 'text-white');
        tabLogin.classList.remove('bg-transparent', 'text-slate-400');
        tabRegister.classList.remove('bg-blue-600', 'text-white');
        tabRegister.classList.add('bg-transparent', 'text-slate-400');
    } else {
        registerPanel.classList.remove('hidden');
        loginPanel.classList.add('hidden');
        tabRegister.classList.add('bg-blue-600', 'text-white');
        tabRegister.classList.remove('bg-transparent', 'text-slate-400');
        tabLogin.classList.remove('bg-blue-600', 'text-white');
        tabLogin.classList.add('bg-transparent', 'text-slate-400');
    }
}

async function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const errorMsg = document.getElementById('login-error');
    if (errorMsg) errorMsg.classList.add('hidden');
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ username, password })
        });
        if (response.ok) {
            const data = await response.json();
            updateUIForLoggedInUser(data.user);
            hideLogin();
        } else {
            if (errorMsg) errorMsg.classList.remove('hidden');
        }
    } catch (error) {
        console.error('Error en login:', error);
        alert('Error al conectar con el servidor.');
    }
}

async function handleLogout() {
    try {
        const response = await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
        if (response.ok) updateUIForLoggedOutUser();
    } catch (error) {
        console.error('Error en logout:', error);
    }
}

async function checkLoginStatus() {
    try {
        const response = await fetch('/api/auth/check', { credentials: 'include' });
        const data = await response.json();
        if (data.logged_in) updateUIForLoggedInUser(data.user);
        else updateUIForLoggedOutUser();
    } catch (error) {
        console.warn('No se pudo verificar el estado del login.');
    }
}

function updateUIForLoggedInUser(user) {
    const adminBtn = document.getElementById('nav-admin-panel');
    const loginBtn = document.getElementById('nav-login');
    const logoutBtn = document.getElementById('nav-logout');
    const loginLabel = document.getElementById('login-label');
    if (loginLabel) loginLabel.innerText = user.username;
    if (loginBtn) loginBtn.classList.add('active');
    if (logoutBtn) logoutBtn.classList.remove('hidden');
    // Only show admin panel button for admin users
    if (adminBtn) {
        if (user.role === 'admin') adminBtn.classList.remove('hidden');
        else adminBtn.classList.add('hidden');
    }
}

async function handleRegister(event) {
    event.preventDefault();
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const errorMsg = document.getElementById('register-error');
    const successMsg = document.getElementById('register-success');
    if (errorMsg) errorMsg.classList.add('hidden');
    if (successMsg) successMsg.classList.add('hidden');
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        if (response.ok) {
            if (successMsg) { successMsg.innerText = '¡Cuenta creada! Ya puedes iniciar sesión.'; successMsg.classList.remove('hidden'); }
            document.getElementById('register-username').value = '';
            document.getElementById('register-password').value = '';
        } else {
            if (errorMsg) { errorMsg.innerText = data.error || 'Error al registrar.'; errorMsg.classList.remove('hidden'); }
        }
    } catch (error) {
        if (errorMsg) { errorMsg.innerText = 'Error de conexión.'; errorMsg.classList.remove('hidden'); }
    }
}

function updateUIForLoggedOutUser() {
    const adminBtn = document.getElementById('nav-admin-panel');
    const loginBtn = document.getElementById('nav-login');
    const logoutBtn = document.getElementById('nav-logout');
    const loginLabel = document.getElementById('login-label');
    if (loginLabel) loginLabel.innerText = 'Iniciar Sesión';
    if (loginBtn) loginBtn.classList.remove('active');
    if (logoutBtn) logoutBtn.classList.add('hidden');
    if (adminBtn) adminBtn.classList.add('hidden');
}
