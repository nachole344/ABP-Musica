let currentArtistIndex = 0;
let openAlbumIndex = -1;
let catalogArtistIndex = -1;
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
    initSwipe();
});

function initSwipe() {
    const section = document.getElementById('artists-section');
    if (!section) return;
    let startX = 0, startY = 0;
    section.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    }, { passive: true });
    section.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - startX;
        const dy = e.changedTouches[0].clientY - startY;
        if (Math.abs(dx) < 40 || Math.abs(dy) > Math.abs(dx)) return;
        if (dx < 0) nextArtist(); else prevArtist();
    }, { passive: true });
}

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
        artistsData = (await response.json()).filter(a => a.albums && a.albums.length > 0);
        renderArtistSlides();
        initArtistSearch();
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
function toHttps(url) {
    return url ? url.replace(/^http:\/\//i, 'https://') : '';
}

function renderArtistSlides() {
    const container = document.getElementById('artists-slides-container');
    if (!container) return;
    container.innerHTML = artistsData.map((artist, index) => {
        const cover = toHttps(artist.albums[Math.floor(Math.random() * artist.albums.length)].cover_album);
        return `
        <div class="artist-slide ${index === 0 ? 'active' : ''}" id="slide-${index}">
            <div class="vinyl-scene">
                <div class="vinyl-glow" style="background-image: url('${cover}')"></div>
                <div class="vinyl-ring"></div>
                <div class="vinyl-ring vinyl-ring-2"></div>
                <div class="vinyl-ring vinyl-ring-3"></div>
                <div class="vinyl-disc">
                    <div class="vinyl-label">
                        <img src="${cover}" alt="${artist.artist_name}">
                    </div>
                    <div class="vinyl-hole"></div>
                </div>
                <div class="vinyl-text-overlay">
                    <p class="vinyl-artist-name">${artist.artist_name}</p>
                    <button class="vinyl-catalog-btn" onclick="viewArtistCatalog(${index})">VER CATÁLOGO</button>
                </div>
            </div>
        </div>
        `;
    }).join('');
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

    catalogArtistIndex = index;
    openAlbumIndex = -1;
    artist.albums.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));

    const debutYear  = artist.debut      ? new Date(artist.debut).getFullYear()      : null;
    const birthYear  = artist.birth_date ? new Date(artist.birth_date).getFullYear() : null;
    const metaParts  = [artist.country, debutYear ? `Debut ${debutYear}` : null, birthYear ? `Nacido en ${birthYear}` : null].filter(Boolean);
    const albumCount = (artist.albums || []).length;

    catalogContent.innerHTML = `
        <div style="padding-top: 1rem; padding-bottom: 3rem;">

            <!-- HEADER HORIZONTAL -->
            <div class="catalog-artist-header">
                <div class="catalog-artist-top">
                    ${artist.image ? `<img src="${artist.image}" class="catalog-artist-photo" alt="${artist.artist_name}">` : ''}
                    <div class="catalog-artist-info">
                        <h1 class="text-5xl md:text-7xl font-black leading-none mb-1">${artist.artist_name}</h1>
                        ${artist.real_name ? `<p class="text-slate-500 font-semibold text-sm mb-3">${artist.real_name}</p>` : ''}
                        <div style="display:flex;align-items:center;justify-content:space-between;gap:1rem;margin-bottom:1rem;">
                            <p class="text-blue-400 font-bold tracking-widest uppercase text-xs m-0">${metaParts.join(' · ')}</p>
                            ${artist.social_media ? `
                            <a href="${artist.social_media}" target="_blank" rel="noopener noreferrer"
                               class="inline-flex items-center gap-1.5 px-3 py-1 border border-white/20 rounded-full text-xs font-bold hover:bg-white/10 transition-colors no-underline text-white flex-shrink-0">
                                <i data-lucide="share-2" size="12"></i> Redes
                            </a>` : ''}
                        </div>
                    </div>
                </div>
                ${artist.description ? `<p class="catalog-artist-bio">${artist.description}</p>` : ''}
            </div>

            <!-- DISCOGRAFÍA -->
            <h3 class="text-base font-black mb-4 tracking-tight flex items-center gap-2 uppercase">
                <i data-lucide="disc-3" class="text-blue-500" size="18"></i>
                Discografía
                <span class="text-slate-600 font-normal text-xs normal-case">${albumCount} álbum${albumCount !== 1 ? 'es' : ''}</span>
            </h3>

            <div class="discography-grid">
                ${(artist.albums || []).map((album, ai) => `
                    <div class="album-card" onclick="openAlbumModal(${ai})">
                        <img src="${album.cover_album}" alt="${album.album_title}" loading="lazy">
                        <div class="album-card-body">
                            <p class="font-bold text-sm leading-tight mb-0.5">${album.album_title}</p>
                            <p class="text-slate-500 text-xs">${new Date(album.release_date).getFullYear()} · ${album.total_track} canciones</p>
                        </div>
                    </div>
                `).join('')}
            </div>

        </div>
    `;

    catalogOverlay.style.display = 'block';
    setTimeout(() => catalogOverlay.classList.add('active'), 10);
    if (window.lucide) lucide.createIcons();
}

function openAlbumModal(albumIndex) {
    const artist = artistsData[catalogArtistIndex];
    if (!artist) return;
    const album   = artist.albums[albumIndex];
    const overlay = document.getElementById('album-modal-overlay');
    const header  = document.getElementById('album-modal-header');
    const list    = document.getElementById('album-modal-tracklist');

    header.innerHTML = `
        <img src="${album.cover_album}" class="modal-cover" alt="${album.album_title}">
        <div style="flex:1;min-width:0;">
            <h4 class="font-black text-xl leading-tight mb-1">${album.album_title}</h4>
            <p class="text-slate-500 text-xs mb-3">
                ${new Date(album.release_date).toLocaleDateString('es-ES', { year:'numeric', month:'long' })} · ${album.total_track} canciones
            </p>
            ${album.spotify ? `
            <a href="${album.spotify}" target="_blank" rel="noopener noreferrer"
               class="inline-flex items-center gap-2 px-4 py-2 bg-[#1DB954] text-black text-xs font-black rounded-full hover:bg-[#1ed760] transition-colors no-underline">
                <i data-lucide="music" size="13"></i> Abrir en Spotify
            </a>` : ''}
        </div>
        <button class="modal-close" onclick="closeAlbumModal()">
            <i data-lucide="x" size="14"></i>
        </button>
    `;

    list.innerHTML = (album.songs || []).map((song, i) => `
        <a ${song.video_url ? `href="${song.video_url}" target="_blank" rel="noopener noreferrer"` : ''}
           class="tracklist-row ${song.video_url ? '' : 'pointer-events-none'}">
            <span class="text-slate-600 font-mono text-xs w-5 text-right flex-shrink-0">${String(i + 1).padStart(2, '0')}</span>
            <span class="flex-1 font-semibold text-sm text-slate-200 truncate">${song.song_title}</span>
            ${song.video_url ? `<i data-lucide="play-circle" class="text-blue-400 flex-shrink-0" size="14"></i>` : ''}
            <span class="text-slate-500 font-mono text-xs flex-shrink-0">${song.duration ? song.duration.slice(3) : ''}</span>
        </a>
    `).join('');

    overlay.classList.add('open');
    if (window.lucide) lucide.createIcons();
}

function closeAlbumModal(e) {
    if (e && e.target !== document.getElementById('album-modal-overlay')) return;
    document.getElementById('album-modal-overlay').classList.remove('open');
}

function closeCatalog() {
    document.getElementById('album-modal-overlay')?.classList.remove('open');
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

function initArtistSearch() {
    const input = document.getElementById('artists-search-input');
    const dropdown = document.getElementById('artist-search-dropdown');
    if (!input || !dropdown) return;

    let focusedIndex = -1;

    function getMatches(q) {
        return artistsData
            .map((a, i) => ({ name: a.artist_name, index: i }))
            .filter(a => a.name.toLowerCase().includes(q.toLowerCase()))
            .slice(0, 8);
    }

    function renderDropdown(matches) {
        dropdown.innerHTML = matches.map((a, i) => `
            <div class="artist-dropdown-item" data-index="${a.index}" role="option" tabindex="-1">${a.name}</div>
        `).join('');
        dropdown.querySelectorAll('.artist-dropdown-item').forEach(el => {
            el.addEventListener('mousedown', e => {
                e.preventDefault();
                selectArtist(parseInt(el.dataset.index));
            });
        });
    }

    function setFocus(i) {
        const items = dropdown.querySelectorAll('.artist-dropdown-item');
        items.forEach(el => el.classList.remove('focused'));
        focusedIndex = Math.max(-1, Math.min(i, items.length - 1));
        if (focusedIndex >= 0) items[focusedIndex].classList.add('focused');
    }

    function openDropdown(q) {
        const matches = getMatches(q);
        if (matches.length === 0) { closeDropdown(); return; }
        renderDropdown(matches);
        focusedIndex = -1;
        dropdown.classList.add('open');
        input.setAttribute('aria-expanded', 'true');
    }

    function closeDropdown() {
        dropdown.classList.remove('open');
        input.setAttribute('aria-expanded', 'false');
        focusedIndex = -1;
    }

    function selectArtist(artistIndex) {
        updateSlide(artistIndex);
        input.value = '';
        closeDropdown();
        input.blur();
    }

    input.addEventListener('input', () => {
        const q = input.value.trim();
        if (q === '') { closeDropdown(); return; }
        openDropdown(q);
    });

    input.addEventListener('keydown', e => {
        const items = dropdown.querySelectorAll('.artist-dropdown-item');
        if (!dropdown.classList.contains('open')) return;
        if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) {
            e.preventDefault();
            setFocus(focusedIndex + 1 < items.length ? focusedIndex + 1 : 0);
        } else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) {
            e.preventDefault();
            setFocus(focusedIndex - 1 >= 0 ? focusedIndex - 1 : items.length - 1);
        } else if (e.key === 'Enter' && focusedIndex >= 0) {
            e.preventDefault();
            selectArtist(parseInt(items[focusedIndex].dataset.index));
        } else if (e.key === 'Escape') {
            closeDropdown();
        }
    });

    input.addEventListener('blur', () => setTimeout(closeDropdown, 150));
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
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    const counter = document.getElementById('cart-count');
    if (counter) counter.innerText = total;
    const mobileCounter = document.getElementById('mobile-cart-count');
    if (mobileCounter) {
        mobileCounter.innerText = total;
        mobileCounter.style.display = total > 0 ? 'flex' : 'none';
    }
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
    // Sidebar escritorio
    const adminBtn = document.getElementById('nav-admin-panel');
    const loginBtn = document.getElementById('nav-login');
    const logoutBtn = document.getElementById('nav-logout');
    const loginLabel = document.getElementById('login-label');
    if (loginLabel) loginLabel.innerText = user.username;
    if (loginBtn) loginBtn.classList.add('active');
    if (logoutBtn) logoutBtn.classList.remove('hidden');
    if (adminBtn) {
        if (user.role === 'admin') adminBtn.classList.remove('hidden');
        else adminBtn.classList.add('hidden');
    }
    // Menú móvil
    const mobileAdmin  = document.getElementById('mobile-nav-admin');
    const mobileLogin  = document.getElementById('mobile-nav-login');
    const mobileLogout = document.getElementById('mobile-nav-logout');
    const mobileLabel  = document.getElementById('mobile-login-label');
    if (mobileLabel)  mobileLabel.innerText = user.username;
    if (mobileLogout) { mobileLogout.classList.remove('hidden'); mobileLogout.style.display = 'block'; }
    if (mobileAdmin) {
        if (user.role === 'admin') { mobileAdmin.classList.remove('hidden'); mobileAdmin.style.display = 'block'; }
        else { mobileAdmin.classList.add('hidden'); mobileAdmin.style.display = ''; }
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
    // Sidebar escritorio
    const adminBtn = document.getElementById('nav-admin-panel');
    const loginBtn = document.getElementById('nav-login');
    const logoutBtn = document.getElementById('nav-logout');
    const loginLabel = document.getElementById('login-label');
    if (loginLabel) loginLabel.innerText = 'Iniciar Sesión';
    if (loginBtn) loginBtn.classList.remove('active');
    if (logoutBtn) logoutBtn.classList.add('hidden');
    if (adminBtn) adminBtn.classList.add('hidden');
    // Menú móvil
    const mobileAdmin  = document.getElementById('mobile-nav-admin');
    const mobileLogout = document.getElementById('mobile-nav-logout');
    const mobileLabel  = document.getElementById('mobile-login-label');
    if (mobileLabel)  mobileLabel.innerText = 'Iniciar Sesión';
    if (mobileLogout) { mobileLogout.classList.add('hidden'); mobileLogout.style.display = ''; }
    if (mobileAdmin)  { mobileAdmin.classList.add('hidden');  mobileAdmin.style.display = ''; }
}
