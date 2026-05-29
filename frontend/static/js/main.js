let currentArtistIndex = 0;
let artistsData = [];
let productsData = [];
let eventsData = [];
let ordersData = [];
let orderItemsData = [];
let cart = []; // Array para guardar los preductos que se desean comprar

// Variables de los filtros en la tienda
let activeCategory = 'all';
let activeArtist = 'all';


document.addEventListener('DOMContentLoaded', () => {
    console.log('SoundScape: Inicializando aplicación...');
    if (window.lucide) {
        lucide.createIcons();
    }
    fetchArtists();
    fetchProducts();
    fetchEvents();
    fetchOrders();
});

// NAVEGACIÓN GLOBAL (Sidebar y Mobile)
function showSection(sectionId) {
    const sections = ['home', 'artists', 'shop', 'extras', 'sustainability'];

    sections.forEach(s => {
        const element = document.getElementById(s + '-section');
        const navLink = document.getElementById('nav-' + s);

        if (element) {
            element.classList.remove('active');
            // Aseguramos que las secciones de pantalla completa se oculten correctamente
            if (element.classList.contains('viewport-section')) {
                element.style.display = 'none';
            }
        }
        if (navLink) navLink.classList.remove('active');
    });

    const activeSection = document.getElementById(sectionId + '-section');
    const activeNavLink = document.getElementById('nav-' + sectionId);

    if (activeSection) {
        activeSection.classList.add('active');
        // Si es una sección de pantalla completa, usamos flex para centrar
        if (activeSection.classList.contains('viewport-section')) {
            activeSection.style.display = 'flex';
        }
    }
    if (activeNavLink) activeNavLink.classList.add('active');

    // Cerrar el catálogo si se cambia de sección
    closeCatalog();
    // También ocultamos el login si se cambia de sección
    hideLogin();

    if (window.lucide) lucide.createIcons();
}

// LÓGICA MENÚ MÓVIL
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if (menu) {
        menu.classList.toggle('show');
    }
}

// LÓGICA DE ARTISTAS (Carousel Full-Screen)
async function fetchArtists() {
    try {
        const response = await fetch('https://musehub.mom/api/artists/', { credentials: 'include' });
        if (!response.ok) throw new Error('API no disponible');
        artistsData = await response.json();
        renderArtistSlides();
        populateArtistFilter();
    } catch (error) {
        console.warn('Cargando mock data para artistas...');
    }
}

async function fetchProducts() {
    try {
        const response = await fetch('https://musehub.mom/api/shop/', { credentials: 'include' });

        // Si el backend responde pero devuelve un array vacío (la BD no tiene datos aún)
        const data = await response.json();

        if (data.length === 0) {
            console.warn('La base de datos está vacía.');
        } else {
            productsData = data;
        }

        renderProducts();

    } catch (error) {
        // Si el backend ni siquiera está encendido, caemos aquí
        console.warn('Backend inactivo.');
        renderProducts();
    }
}

async function fetchOrders() {
    try {
        const response = await fetch('https://musehub.mom/api/orders/', { credentials: 'include' });
        const data = await response.json();

        if (data.length === 0) {
            console.warn('La base de datos está vacía.');
        } else {
            ordersData = data;
        }

        fetchOrdersItems();

    } catch (error) {
        // Si el backend ni siquiera está encendido, caemos aquí
        console.warn('Backend inactivo.');
        ordersData = mockOrders;
        fetchOrdersItems();
    }
}

async function fetchOrdersItems() {
    try {
        const response = await fetch('https://musehub.mom/api/orders/items/', { credentials: 'include' });
        const data = await response.json();

        if (data.length === 0) {
            console.warn('La base de datos está vacía.');
        } else {
            orderItemsData = data;
        }

        renderOrders();
        renderFeaturedProducts();

    } catch (error) {
        // Si el backend ni siquiera está encendido, caemos aquí
        console.warn('Backend inactivo.');
        renderOrders();
        renderFeaturedProducts();
    }
}

async function fetchEvents() {
    try {
        const response = await fetch('https://musehub.mom/api/events/', { credentials: 'include' });
        if (!response.ok) throw new Error('API no disponible');
        renderEvents();
    } catch (error) {
        console.warn('Cargando mock data para eventos...');
        renderEvents();
    }
}

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

// LÓGICA DEL CATÁLOGO
function viewArtistCatalog(index) {
    console.log('Abriendo catálogo para el artista en el índice:', index);
    const artist = artistsData[index];
    const catalogOverlay = document.getElementById('catalog-overlay');
    const catalogContent = document.getElementById('catalog-content');

    if (!catalogOverlay || !catalogContent || !artist) {
        console.error('Error: No se encontró el overlay o el artista.');
        return;
    }

    // Renderizar usando campos exactos de la BBDD
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
                                    <p class="text-slate-500 text-sm">${new Date(album.release_date).getFullYear()}</p>
                                </div>
                            </div>
                            <div class="col-md-8">
                                <div class="space-y-1">
                                    ${(album.songs || []).map((song, i) => `
                                        <div class="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all group">
                                            <div class="flex items-center gap-4">
                                                <span class="text-slate-600 font-mono text-sm">${String(i + 1).padStart(2, '0')}</span>
                                                <span class="font-semibold text-slate-200">${song.song_title}</span>
                                            </div>
                                            <span class="text-slate-500 font-mono text-xs">${song.duration}</span>
                                        </div>
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
    setTimeout(() => {
        catalogOverlay.classList.add('active');
    }, 10);

    if (window.lucide) lucide.createIcons();
}

function closeCatalog() {
    const catalogOverlay = document.getElementById('catalog-overlay');
    if (catalogOverlay) {
        catalogOverlay.classList.remove('active');
        setTimeout(() => {
            catalogOverlay.style.display = 'none';
        }, 300); // Esperar a que termine la animación
    }
}

function nextArtist() {
    updateSlide((currentArtistIndex + 1) % artistsData.length);
}

function prevArtist() {
    updateSlide((currentArtistIndex - 1 + artistsData.length) % artistsData.length);
}

function updateSlide(newIndex) {
    const currentSlide = document.getElementById(`slide-${currentArtistIndex}`);
    if (currentSlide) currentSlide.classList.remove('active');
    currentArtistIndex = newIndex;
    const nextSlide = document.getElementById(`slide-${currentArtistIndex}`);
    if (nextSlide) nextSlide.classList.add('active');
}

// LÓGICA SHOP

// Por defecto, usa todos los productos (productsData).
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

function renderFeaturedProducts() {
    const container = document.getElementById('featured-products-container');

    // Solo procedemos si existen ambos arrays de datos y el contenedor HTML
    if (!container || productsData.length === 0 || orderItemsData.length === 0) return;

    const salesCount = {};
    orderItemsData.forEach(item => {
        salesCount[item.product_id] = (salesCount[item.product_id] || 0) + item.quantity;
    });

    const topProducts = Object.keys(salesCount)
        .map(id => {
            const product = productsData.find(p => p.product_id === parseInt(id));
            return product ? { ...product, total_sold: salesCount[id] } : null;
        })
        .filter(p => p !== null)
        .sort((a, b) => b.total_sold - a.total_sold)
        .slice(0, 4); // Seleccionamos solo los 4 primeros

    if (topProducts.length === 0) {
        container.innerHTML = `<p class="text-slate-400">Aún no hay suficientes datos de ventas.</p>`;
        return;
    }

    container.innerHTML = topProducts.map(product => {
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

// Se ejecuta al pulsar los botones de categoría
function filterProducts(type) {
    activeCategory = type;
    applyFilters();
}

// Se ejecuta al cambiar la selección en el menú desplegable de artistas
function filterByArtist(artistId) {
    activeArtist = artistId;
    applyFilters();
}

// Cruza ambas variables y renderiza el resultado exacto
function applyFilters() {
    let filteredResults = productsData;

    if (activeCategory !== 'all') {
        filteredResults = filteredResults.filter(product => product.product_type === activeCategory);
    }

    if (activeArtist !== 'all') {
        filteredResults = filteredResults.filter(product => product.artist_id === parseInt(activeArtist));
    }

    // Ocultar los productos destacados si hay filtros
    const featuredSection = document.getElementById('featured-section');
    const productsTitle = document.getElementById('all-products-title');
    if (featuredSection) {
        if (activeCategory !== 'all' || activeArtist !== 'all') {
            featuredSection.classList.add('hidden');
            productsTitle.classList.add('hidden');
        } else {
            featuredSection.classList.remove('hidden');
            productsTitle.classList.remove('hidden');
        }
    }

    renderProducts(filteredResults);
}

// Inyecta los artistas dentro del elemento <select> del HTML
function populateArtistFilter() {
    const selectElement = document.getElementById('artist-filter');
    if (!selectElement) return;

    // Reiniciamos el select manteniendo siempre la opción inicial de "Todos"
    selectElement.innerHTML = `<option value="all" class="bg-zinc-950 text-white">Todos los Artistas</option>`;

    // Recorremos los artistas guardados y los añadimos como opciones
    artistsData.forEach(artist => {
        selectElement.innerHTML += `
            <option value="${artist.artist_id}" class="bg-zinc-950 text-white">
                ${artist.artist_name}
            </option>
        `;
    });
}

// LÓGICA CARRITO

function openCart() {
    const sidebar = document.getElementById("cartSidebar");
    const overlay = document.getElementById("cart-overlay");

    // Mostramos el overlay con una transición suave
    overlay.classList.remove("hidden");
    setTimeout(() => overlay.classList.remove("opacity-0"), 10);

    // Deslizamos el sidebar hacia adentro
    sidebar.classList.remove("translate-x-full");

    // Renderizamos los datos más recientes
    renderCart();
}

function closeCart() {
    const sidebar = document.getElementById("cartSidebar");
    const overlay = document.getElementById("cart-overlay");

    // Ocultamos deslizando hacia la derecha
    sidebar.classList.add("translate-x-full");

    // Ocultamos el overlay suavemente
    overlay.classList.add("opacity-0");
    setTimeout(() => overlay.classList.add("hidden"), 300);
}

function addToCart(productId) {
    const product = productsData.find(p => p.product_id === productId);
    const productStock = product.stock;
    if (!product) return;

    // Se revisa la cantidad que se quiere añadir
    const qtyInput = document.getElementById(`qty-${productId}`);
    const quantityToAdd = qtyInput ? parseInt(qtyInput.value) || 1 : 1;

    if (quantityToAdd > productStock) {
        alert("La cantidad que se quiere añadir, supera a la cantidad de stock");
        return;
    }

    const existingItem = cart.find(item => item.product_id === productId);

    if (existingItem) {
        // Si ya hay productos de este tipo en el carrito, se suman la cantidad seleccionada a la cantidad que habia en el carrito
        existingItem.quantity += quantityToAdd;
    } else {
        cart.push({ ...product, quantity: quantityToAdd });
    }

    // Se reinicia el contador
    if (qtyInput) qtyInput.value = 1;

    updateCartCounter();
    renderCart();
    openCart();
}

// Renderiza la lista dentro del Sidebar
function renderCart() {
    const list = document.getElementById("cartItems");
    const totalElement = document.getElementById("cartTotal");
    if (!list) return;

    list.innerHTML = "";
    let total = 0;

    // Si el carrito está vacío, se muestra un mensaje indicandolo
    if (cart.length === 0) {
        list.innerHTML = `<p class="text-center text-slate-500 mt-10">Tu carrito está vacío.</p>`;
        totalElement.innerText = "0.00€";
        return;
    }

    // Se muestran todos los productos del carrito
    cart.forEach((item) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        list.innerHTML += `
            <div class="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5 justify-between hover:bborder-red-500 transition-colors">
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

    totalElement.innerText = total.toFixed(2) + "€";

    // Se reinician los iconos de Lucide para evitar errores
    if (window.lucide) lucide.createIcons();
}

function goToOrders() {
    if (cart.length === 0) {
        alert("¡Añade productos antes de procesar el pedido!");
        return;
    }

    if (confirm("¿Desea continuar con el pago?")) {
        alert("Pago finalizado");
        cart = [];
        updateCartCounter();
        renderCart();
    }
}

// Actualiza el contador del carrito
function updateCartCounter() {
    const counter = document.getElementById('cart-count');
    if (counter) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        counter.innerText = totalItems;
    }
}

// Elimina un producto por completo del carrito independientemente de su cantidad
function removeFromCart(productId) {
    // Filtramos el array conservando todos los elementos excepto el que coincide con el ID
    cart = cart.filter(item => item.product_id !== productId);

    // Sincronizamos el contador y volvemos a dibujar el carrito
    updateCartCounter();
    renderCart();
}

// Vacía por completo el carrito
function emptyCart() {
    if (cart.length === 0) return;

    // Pedimos confirmación al usuario para evitar clicks accidentales
    if (confirm("¿Estás seguro de que deseas vaciar por completo tu carrito?")) {
        cart = [];
        updateCartCounter();
        renderCart();
    }
}

// LÓGICA DE LOS PEDIDOS
function showPrviousOrders() {
    const modalOverlay = document.getElementById('orders-modal-overlay');
    const modalContent = document.getElementById('orders-modal-content');

    // Muestra el modal con una transición suave (Fade in y zoom)
    modalOverlay.classList.remove('hidden');

    // Un pequeño delay para que la transición CSS tenga efecto
    setTimeout(() => {
        modalOverlay.classList.remove('opacity-0');
        modalContent.classList.remove('scale-95');
    }, 10);

    // Cerramos el carrito lateral por si estaba abierto
    closeCart();

    // Renderizamos los pedidos
    renderOrders();
}

function closeOrdersModal() {
    const modalOverlay = document.getElementById('orders-modal-overlay');
    const modalContent = document.getElementById('orders-modal-content');

    // Oculta el modal con animación inversa
    modalOverlay.classList.add('opacity-0');
    modalContent.classList.add('scale-95');

    setTimeout(() => {
        modalOverlay.classList.add('hidden');
    }, 300);
}

function renderOrders() {
    const container = document.getElementById('orders-container');
    if (!container) return;

    // Si no hay pedidos
    if (!ordersData || ordersData.length === 0) {
        container.innerHTML = `<p class="text-center text-slate-500 py-10 text-lg">Aún no tienes pedidos anteriores.</p>`;
        return;
    }

    // Iteramos sobre todos los pedidos (del más reciente al más antiguo, por lo que le damos la vuelta con reverse())
    container.innerHTML = [...ordersData].reverse().map(order => {

        // Se buscan los productos que pertenezcan al pedido
        const orderItems = orderItemsData.filter(item => item.order_id === order.order_id);

        // Se inserta el HTML de cada pedido
        const itemsHtml = orderItems.map(item => {
            // Buscamos la info visual del producto usando el product_id
            const productInfo = productsData.find(p => p.product_id === item.product_id);

            // Si por alguna razón no encuentra el producto, saltamos (para no romper la app)
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

        // Cambia el color según el estado del pedido
        let statusClasses = "bg-slate-500/20 text-slate-400"; // Por defecto
        let statusLabel = "Desconocido";

        if (order.status === "delivered") {
            statusClasses = "bg-emerald-500/20 text-emerald-400";
            statusLabel = "Entregado";
        } else if (order.status === "paid") {
            statusClasses = "bg-blue-500/20 text-blue-400";
            statusLabel = "Pagado";
        } else if (order.status === "pending") {
            statusClasses = "bg-amber-500/20 text-amber-400";
            statusLabel = "Pendiente";
        }

        // Se retorna la tarjeta
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
                        <span class="px-3 py-1 text-xs font-bold rounded-full border border-white/5 uppercase tracking-widest ${statusClasses}">
                            ${statusLabel}
                        </span>
                        <span class="text-2xl font-black text-white">${order.total_price.toFixed(2)}€</span>
                    </div>
                </div>
                
                <div class="space-y-1">
                    ${itemsHtml}
                </div>
            </div>
        `;
    }).join('');

    if (window.lucide) lucide.createIcons();
}
// LÓGICA DE LOGIN Y ADMIN
function showLogin() {
    const loginSection = document.getElementById('login-section');
    if (loginSection) {
        loginSection.classList.add('active');
        loginSection.style.display = 'flex';
    }
}

function hideLogin() {
    const loginSection = document.getElementById('login-section');
    if (loginSection) {
        loginSection.classList.remove('active');
        setTimeout(() => {
            loginSection.style.display = 'none';
        }, 300);
    }
}

async function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const errorMsg = document.getElementById('login-error');

    try {
        const response = await fetch('http://fuertes:5001/admin/login', {
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
        const response = await fetch('https://musehub.mom/api/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });
        if (response.ok) {
            updateUIForLoggedOutUser();
        }
    } catch (error) {
        console.error('Error en logout:', error);
    }
}

async function checkLoginStatus() {
    try {
        const response = await fetch('https://musehub.mom/api/auth/check', {
            credentials: 'include'
        });
        const data = await response.json();
        if (data.logged_in) {
            updateUIForLoggedInUser(data.user);
        } else {
            updateUIForLoggedOutUser();
        }
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

    // Por ahora, asumimos que si puede loguearse es admin para mostrar el botón
    // pero lo hacemos condicional por si luego quieres añadir roles.
    if (adminBtn) adminBtn.classList.remove('hidden');
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

// Llamar al check al cargar
document.addEventListener('DOMContentLoaded', () => {
    // ... código existente ...
    checkLoginStatus();
});