# MuseHub — Plataforma de Discográfica

Plataforma web completa para una discográfica ficticia. Permite explorar artistas y su discografía, escuchar previews en Spotify, comprar merchandise y entradas, y gestionar todo el contenido desde un panel de administración propio.

**Producción:** [musehub.mom](https://musehub.mom)

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | HTML5, CSS3, JavaScript ES6+ vanilla, Tailwind CSS, Lucide Icons |
| Backend API | Python 3, Flask, SQLAlchemy, Gunicorn |
| Panel Admin | Python 3, Flask, Jinja2, Bootstrap 5, Gunicorn |
| Base de datos | PostgreSQL 15 |
| Proxy | nginx |
| Infraestructura | Docker Compose, Cloudflare Tunnel |

---

## Arquitectura

```
Usuario
  │
  ▼
musehub.mom (Cloudflare Tunnel)
  │
  ▼
nginx :8000
  ├── /          → frontend estático (HTML/JS/CSS)
  ├── /api/      → backend Flask :5000
  └── /admin/    → panel-admin Flask :5001
                        │
                        ▼
                   PostgreSQL :5432
```

---

## Requisitos

- Docker
- Docker Compose

---

## Puesta en marcha

**1. Clona el repositorio y entra en la carpeta:**
```bash
git clone https://github.com/nachole344/ABP-Musica.git
cd ABP-Musica
```

**2. Crea el archivo `.env` en la raíz:**
```env
POSTGRES_DB=musicdb
POSTGRES_USER=tu_usuario
POSTGRES_PASSWORD=tu_password
SECRET_KEY=una_clave_secreta_larga
```

**3. Levanta todos los servicios:**
```bash
docker compose up -d
```

La web estará disponible en `http://localhost:8000`.

**Para parar:**
```bash
docker compose down
```

**Para ver logs:**
```bash
docker compose logs -f
```

---

## Servicios

| Contenedor | Puerto | Descripción |
|------------|--------|-------------|
| `music_db` | 5432 | PostgreSQL — base de datos principal |
| `music_backend` | 5000 | API REST Flask |
| `music_panel_admin` | 5001 | Panel de administración |
| `music_frontend` | 8000 | nginx — frontend + proxy |

Todos los contenedores tienen `restart: always` y arrancan automáticamente con el servidor.

---

## Funcionalidades

### Frontend (usuario)
- Carrusel de artistas con disco de vinilo animado y aura de color por álbum
- Swipe táctil para navegar entre artistas en móvil
- Catálogo de artista: discografía, modal de álbum con tracklist y links a YouTube
- Secciones desplegables: estadísticas, todas las canciones, embeds de Spotify
- Tienda con filtros por tipo de producto y control de stock en tiempo real
- Carrito de compra con badge contador, historial de pedidos
- Login / Registro / Logout con sesión persistente
- Menú responsive: sidebar en desktop, hamburger en móvil
- Panel Admin accesible solo para usuarios con `role='admin'`

### Panel Admin (`/admin/`)
- CRUD completo de artistas, álbumes, canciones, productos y eventos
- Importación de artistas desde **MusicBrainz** (sin credenciales)
- Importación de datos desde **Spotify** (requiere credenciales en `.env`)
- Login propio independiente del backend (requiere `role='admin'`)

### API REST (`/api/`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/artists/` | Artistas con álbumes y canciones anidados |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| POST | `/api/auth/register` | Registro (role='user') |
| GET | `/api/auth/check` | Estado de sesión actual |
| GET | `/api/shop/` | Productos con stock |
| POST | `/api/orders/` | Crear pedido, decrementa stock |
| GET | `/api/orders/` | Historial de pedidos del usuario |
| GET | `/api/events/` | Eventos |

---

## Estructura del proyecto

```
ABP-Musica/
├── backend/                  # API REST Flask
│   ├── app/
│   │   ├── models/           # Artist, Album, Song, Product, Order, User, Event
│   │   └── routes/           # artists, auth, shop, orders, events
│   ├── Dockerfile
│   └── requirements.txt
├── panel-admin/              # Panel de administración Flask
│   ├── app/
│   │   ├── models.py
│   │   ├── routes.py
│   │   ├── musicbrainz_service.py
│   │   └── templates/        # Jinja2 — artistas, álbumes, canciones, productos, eventos
│   └── Dockerfile
├── frontend/                 # SPA estática
│   ├── index.html
│   └── static/
│       ├── js/main.js
│       └── img/
├── nginx.conf
├── docker-compose.yml
└── .env                      # No incluido en git
```

---

## Testing

### Unit tests + API tests (sin Docker)

Prueban modelos y endpoints usando SQLite en memoria, no requieren que el stack esté levantado.

```bash
cd backend
pip install -r requirements.txt -r requirements-test.txt
python3 -m pytest tests/ -v
```

### E2E tests (requiere Docker)

Prueban la UI y las APIs reales en el navegador con Playwright.

```bash
# 1. Levanta el stack (si no está ya corriendo)
docker compose up -d

# 2. Instala dependencias E2E (solo la primera vez)
pip install -r tests/e2e/requirements-e2e.txt
python3 -m playwright install chromium

# 3. Ejecuta
cd tests/e2e
python3 -m pytest . -v
```

---

## Credenciales por defecto

| Usuario | Contraseña | Role |
|---------|-----------|------|
| `admin` | `admin123` | admin |

> Las contraseñas se almacenan en texto plano. En un entorno de producción real se usaría bcrypt.

---

## Equipo

| Desarrollador | Rama |
|---------------|------|
| Oriol Torres | `develop-oriol` |
| Niko | `develop-niko` |
| Adria Martinez | `develop-adri` |
| Nuria Font | `develop-nuria` |
| Nacho | `develop-nacho` |

---

## Estado del proyecto

- [x] Infraestructura Docker completa (4 servicios)
- [x] API REST con todos los modelos y rutas
- [x] Sistema de autenticación con roles
- [x] Panel de administración con CRUD completo
- [x] Importación desde MusicBrainz
- [x] Frontend SPA responsive (desktop + móvil)
- [x] Carrusel de artistas con vinilo animado
- [x] Carrito de compra y pedidos con stock real
- [x] Despliegue en producción con Cloudflare Tunnel
- [x] Tests automatizados (unit, API, E2E)
- [ ] Hashing de contraseñas con bcrypt (pendiente)
- [ ] Integración Spotify Web Playback SDK (escalabilidad futura)
- [ ] PWA (escalabilidad futura)
