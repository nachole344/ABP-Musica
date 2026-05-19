let currentArtistIndex = 0;
let artistsData = [];
let productsData = [];
let eventsData = [];

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
    const sections = ['artists', 'shop', 'extras', 'sustainability'];
    
    sections.forEach(s => {
        const element = document.getElementById(s + '-section');
        const navLink = document.getElementById('nav-' + s);
        if (element) element.classList.remove('active');
        if (navLink) navLink.classList.remove('active');
    });

    const activeSection = document.getElementById(sectionId + '-section');
    const activeNavLink = document.getElementById('nav-' + sectionId);

    if (activeSection) activeSection.classList.add('active');
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
        // Mock data omitted for brevity in replace, but keeping it if needed
        // For now, I'll just leave the real fetch and handle error
    }
}

async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:5000/api/shop/');
        if (!response.ok) throw new Error('API no disponible');
        productsData = await response.json();
        renderProducts();
    } catch (error) {
        console.warn('Cargando mock data para tienda...');
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

function renderProducts() {
    const container = document.getElementById('shop-container');
    if (!container) return;

    container.innerHTML = productsData.map(product => `
        <div class="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all group">
            <img src="${product.image_url}" class="w-full aspect-square object-cover rounded-xl mb-4 group-hover:scale-105 transition-transform" alt="${product.product_name}">
            <h3 class="font-bold text-lg">${product.product_name}</h3>
            <p class="text-slate-400 text-sm mb-4">${product.product_type}</p>
            <div class="flex items-center justify-between">
                <span class="text-2xl font-black">${product.price}€</span>
                <button class="p-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors">
                    <i data-lucide="shopping-cart" size="20"></i>
                </button>
            </div>
        </div>
    `).join('');
    if (window.lucide) lucide.createIcons();
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
