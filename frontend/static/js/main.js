let currentArtistIndex = 0;
let artistsData = [];
let productsData = [];
let eventsData = [];
let cart = []; // Array para guardar los preductos que se desean comprar

// MOCK DATA temporal para provar el funcionamiento de los productos
const mockProducts = [
    { 
        product_id: 1, 
        product_name: "Álbum 'Echoes en la Noche'", 
        product_type: "album", 
        price: 15.99, 
        image_url: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=400" 
    },
    { 
        product_id: 2, 
        product_name: "Vinilo Edición Especial Clásicos", 
        product_type: "vinyl", 
        price: 35.50, 
        image_url: "https://images.unsplash.com/photo-1538688423619-a81d3f23454b?auto=format&fit=crop&q=80&w=400" 
    },
    { 
        product_id: 3, 
        product_name: "Camiseta Tour 2024 (Negra)", 
        product_type: "clothing", 
        price: 25.00, 
        image_url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=400" 
    },
    { 
        product_id: 4, 
        product_name: "Tote Bag Sostenible Algodón", 
        product_type: "tote_bag", 
        price: 12.00, 
        image_url: "https://images.unsplash.com/photo-1597423235375-14f7623a31eb?auto=format&fit=crop&q=80&w=400" 
    },
    { 
        product_id: 5, 
        product_name: "Sudadera SoundScape Premium", 
        product_type: "clothing", 
        price: 45.00, 
        image_url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=400" 
    },
    { 
        product_id: 6, 
        product_name: "Pin Metálico Logo Banda", 
        product_type: "pin", 
        price: 5.50, 
        image_url: "https://images.unsplash.com/photo-1611078716388-3485ba8051a8?auto=format&fit=crop&q=80&w=400" 
    }
];

document.addEventListener('DOMContentLoaded', () => {
    console.log('SoundScape: Inicializando aplicación...');
    if (window.lucide) {
        lucide.createIcons();
    }
    fetchArtists();
    fetchProducts();
    fetchEvents();
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
        const response = await fetch('http://localhost:5000/api/artists/');
        if (!response.ok) throw new Error('API no disponible');
        artistsData = await response.json();
        renderArtistSlides();
    } catch (error) {
        console.warn('Cargando mock data para artistas...');
    }
}

async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:5000/api/shop/');
        
        // Si el backend responde pero devuelve un array vacío (la BD no tiene datos aún)
        const data = await response.json();
        
        if (data.length === 0) {
            console.warn('La base de datos está vacía. Cargando datos simulados (Mock)...');
            productsData = mockProducts;
        } else {
            productsData = data;
        }
        
        renderProducts(productsData);

    } catch (error) {
        // Si el backend ni siquiera está encendido, caemos aquí
        console.warn('Backend inactivo. Cargando datos simulados de forma offline...');
        productsData = mockProducts;
        renderProducts(productsData);
    }
}

async function fetchEvents() {
    try {
        const response = await fetch('http://localhost:5000/api/events/');
        if (!response.ok) throw new Error('API no disponible');
        eventsData = await response.json();
        renderEvents();
    } catch (error) {
        console.warn('Cargando mock data para eventos...');
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

    // Si no hay productos que mostrar, se enseña un mensaje avisando de ello.
    if (productsToRender.length === 0) {
        container.innerHTML = `<p class="text-slate-400 col-span-full text-center py-10">No hay productos disponibles en esta categoría.</p>`;
        return;
    }

    // Se introduce todos los productos en el HTML
    container.innerHTML = productsToRender.map(product => `
        <div class="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all group flex flex-col justify-between">
            <div>
                <img src="${product.image_url}" class="w-full aspect-square object-cover rounded-xl mb-4 group-hover:scale-105 transition-transform" alt="${product.product_name}">
                <h3 class="font-bold text-lg leading-tight mb-1">${product.product_name}</h3>
                <p class="text-slate-400 text-xs font-semibold tracking-widest mb-4 uppercase">${product.product_type.replace('_', ' ')}</p>
            </div>
            <div class="flex items-center justify-between mt-4 gap-2">
                <span class="text-xl font-black">${product.price.toFixed(2)}€</span>
                
                <div class="flex items-center gap-1.5">
                    <input type="number" id="qty-${product.product_id}" value="1" min="1" 
                           class="w-12 p-1.5 bg-white/10 text-white rounded-lg text-center text-sm font-bold border border-white/10 focus:outline-none focus:border-red-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none">
                    
                    <button class="p-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors" onclick="addToCart(${product.product_id})">
                        <i data-lucide="shopping-cart" size="20"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Se recargan los iconos de Lucide para evitar errores.
    if (window.lucide) lucide.createIcons();
}

// Filtra los productos comparando el parámetro con el product_type
function filterProducts(type) {
    if (type === 'all') {
        renderProducts(productsData); // Muestra todos
    } else {
        const filtered = productsData.filter(p => p.product_type === type);
        renderProducts(filtered); // Muestra solo los de la categoría
    }
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
    if (!product) return;

    // Se revisa la cantidad que se quiere añadir
    const qtyInput = document.getElementById(`qty-${productId}`);
    const quantityToAdd = qtyInput ? parseInt(qtyInput.value) || 1 : 1;

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
            <div class="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5 justify-between">
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