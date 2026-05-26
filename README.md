# ABP Música — Módulo Admin (develop-niko)

Panel de administración web para gestionar artistas, álbumes, canciones, eventos y productos de una tienda de música. Construido con Flask + PostgreSQL, con importación de datos desde la API de MusicBrainz.

---

## Contexto y proceso de desarrollo

### Punto de partida: `artist-app`

El proyecto original (`artist-app`) tenía un endpoint de importación de artistas via MusicBrainz que devolvía **error 500** de forma sistemática. Se identificaron dos causas:

1. **User-Agent bloqueado por MusicBrainz**: la app usaba `admin@example.com` como contacto en la cabecera `User-Agent`. MusicBrainz detecta emails placeholder y bloquea las peticiones. Se corrigió usando un email real.

2. **CSRF y Flask-WTF**: las rutas de la API JSON tenían el middleware CSRF activo, lo que provocaba que todas las peticiones `fetch` desde el frontend fallaran con 403 o 500 sin mensaje claro.

### Solución: reescritura desde la versión funcional de una compañera

Para no seguir depurando sobre una base rota, se tomó como referencia la implementación de MusicBrainz que sí funcionaba en el proyecto de otra compañera del equipo (`/APPABP/nuria`), que usaba un approach más simple y directo:

- Sin Flask-WTF ni CSRF en las rutas API
- `requests` directo sin `HTTPAdapter` ni reintentos automáticos que enmascararan errores
- `time.sleep(1.1)` entre llamadas para respetar el rate limit de MusicBrainz (1 req/s)

A partir de esa base se construyó toda la funcionalidad del panel.

---

## Funcionalidades implementadas

### Panel de administración (`/admin`)

Todas las rutas están bajo el prefijo `/admin` para distinguirlas de la API pública.

| Sección | Ruta | Descripción |
|---|---|---|
| Inicio | `/admin` | Dashboard con últimos artistas y álbumes |
| Artistas | `/admin/artistas` | CRUD completo |
| Álbumes | `/admin/albumes` | CRUD completo |
| Canciones | `/admin/canciones` | CRUD completo |
| Eventos | `/admin/eventos` | CRUD completo con filtro por tipo |
| Tienda | `/admin/productos` | CRUD completo con filtro por tipo |
| Importar | `/admin/import` | Importación desde MusicBrainz |

### Importación desde MusicBrainz

Página de importación con 4 tabs independientes:

- **Artistas**: búsqueda por nombre o UUID de MusicBrainz. Extrae nombre real, nombre artístico, país, redes sociales y descripción de Wikipedia.
- **Álbumes**: búsqueda por nombre de artista + nombre de álbum (o UUID). Extrae portada desde Cover Art Archive y enlace de Spotify.
- **Canciones**: búsqueda por álbum o canción. Extrae todas las pistas con duración.
- **Eventos**: búsqueda por artista. Si MusicBrainz no tiene eventos, genera una plantilla para rellenar manualmente.

### Problemas resueltos durante el desarrollo

**MusicBrainz devuelve 0 resultados al buscar álbum + artista**

El query original usaba el campo `artistid:` que no existe en la búsqueda de releases de MusicBrainz. El campo correcto es `arid:` (artist release id). Ejemplo:

```
# Incorrecto
release:She%20Wolf AND artistid:bf24ca37-...

# Correcto
release:She%20Wolf AND arid:bf24ca37-...
```

**Total de pistas llega a 0**

El fetch de releases solo incluía `?inc=url-rels`. Para obtener el track-count es necesario incluir también `recordings`:

```
/release/{id}?inc=recordings+url-rels&fmt=json
```

**Búsqueda de álbum solo por nombre bloqueada**

La validación tanto en el backend como en el frontend exigía que se proporcionara al menos un artista. Se corrigió para permitir buscar únicamente por nombre de álbum.

---

## Stack técnico

| Capa | Tecnología |
|---|---|
| Backend | Python 3.12, Flask 3.1 |
| ORM | Flask-SQLAlchemy 3.1, Flask-Migrate 4.1 |
| Base de datos | PostgreSQL 15 (Docker) |
| Frontend | Bootstrap 5.3, Bootstrap Icons |
| API externa | MusicBrainz WS2, Cover Art Archive, Wikipedia REST API |

---

## Estructura del proyecto

```
Nuria/
├── app/
│   ├── __init__.py          # Factory de la app Flask
│   ├── config.py            # Configuración (SECRET_KEY, DATABASE_URL)
│   ├── models.py            # Modelos: Artist, Album, Song, Event, Product
│   ├── routes.py            # Todas las rutas web y API interna
│   ├── musicbrainz_service.py  # Integración con MusicBrainz
│   └── templates/
│       ├── base.html        # Layout base con navbar
│       ├── index.html       # Dashboard
│       ├── artists/         # list, view, form
│       ├── albums/          # list, view, form
│       ├── songs/           # list, view, form
│       ├── events/          # list, view, form
│       ├── products/        # list, view, form
│       └── musicbrainz/     # import.html
├── migrations/              # Migraciones Alembic
├── run.py                   # Punto de entrada
├── requirements.txt
└── .gitignore
```

---

## Base de datos

```
artists ──< albums ──< songs
        ──< events
        ──< products
```

| Tabla | Campos clave |
|---|---|
| `artists` | `real_name`, `artist_name`, `country`, `mb_id` (UUID MusicBrainz) |
| `albums` | `album_title`, `release_date`, `total_track`, `cover_album`, `mb_album_id` |
| `songs` | `song_title`, `duration`, `video_url`, `mb_song_id` |
| `events` | `event_name`, `event_type`, `event_date`, `location`, `poster` |
| `products` | `product_name`, `product_type`, `price`, `stock`, `image_url` |

---

## Instalación y ejecución

### Requisitos

- Docker y Docker Compose
- Python 3.12+

### Pasos

```bash
# 1. Levantar PostgreSQL
cd /ruta/al/proyecto/APPABP
docker-compose up -d postgres

# 2. Crear entorno virtual e instalar dependencias
cd Nuria
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 3. Inicializar la base de datos
flask --app run db upgrade

# 4. Arrancar la app
python run.py
```

La app queda disponible en `http://localhost:5001/admin`.

Para acceso desde otros dispositivos de la red local, usar la IP del servidor en lugar de `localhost`.

### Conexión a la base de datos

| Parámetro | Valor |
|---|---|
| Host | localhost |
| Puerto | 5432 |
| Base de datos | musicdb |
| Usuario | nunu |
| Contraseña | nunu123 |
