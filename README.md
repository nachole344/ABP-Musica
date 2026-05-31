# 🎵 MuseHub - Catálogo de Artistas & Tienda Sostenible

Bienvenido a **MuseHub** (disponible en producción en [musehub.mom](https://musehub.mom)), una plataforma web interactiva diseñada para explorar catálogos de artistas musicales, álbumes, canciones y eventos en vivo, integrando a su vez una tienda enfocada en la comercialización de productos sostenibles y ecológicos.

---

## 👥 Integrantes del Proyecto
* Nikolai
* Oriol
* Nacho
* Adriá
* Nuria

---

## 📝 Descripción del Trabajo
El proyecto consiste en una aplicación SPA (Single Page Application) que une la pasión por la música con la conciencia ecológica. El frontend consume de forma dinámica una API REST que gestiona la persistencia de datos relacionados con la industria musical y el comercio electrónico. 

La interfaz cuenta con un diseño premium en modo oscuro con efectos de *glassmorphism*, navegación fluida sin recarga de pantalla, pasarela de visualización de discografías completas por artista y un sistema interactivo de carrito de compras y gestión de pedidos históricos.

---

## 🔌 Endpoints de la API Utilizados
Todos los recursos y peticiones de datos de la aplicación se realizan de forma centralizada bajo el dominio principal. A continuación se detallan los endpoints de lectura (`GET`) consumidos por el cliente:

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| **GET** | `https://musehub.mom/api/artists/` | Obtiene la lista completa de artistas, incluyendo detalles de procedencia, descripción, videos de fondo y sus respectivas discografías (álbumes y canciones). |
| **GET** | `https://musehub.mom/api/shop/` | Recupera el catálogo de productos disponibles en la tienda con sus precios, imágenes descriptivas, tipos de producto y stock actual. |
| **GET** | `https://musehub.mom/api/events/` | Obtiene los eventos activos, tours, conciertos y series especiales programadas. |
| **GET** | `https://musehub.mom/api/orders/` | Recupera el listado general de los pedidos realizados por el usuario para validar su estado de pago y entrega. |
| **GET** | `https://musehub.mom/api/orders/items/` | Obtiene el desglose detallado de los productos asociados a cada pedido, utilizado también para calcular los productos más vendidos (*Featured Products*). |

*Nota: Todas las peticiones anteriores se realizan incluyendo las credenciales de sesión (`credentials: 'include'`).*

---

## 🛠️ Estado del Proyecto y Avances

- [x] Arquitectura de navegación global (Tienda, Extras, Sostenibilidad, Artistas).
- [x] Rediseño Visual Premium (Modo Oscuro, Glassmorphism).
- [x] Lógica de navegación SPA (Single Page Application) sin recarga.
- [x] Implementación y renderizado dinámico de la Tienda Global.
- [x] Implementación visual de la sección de Sostenibilidad.
- [x] Renderizado de Eventos y Tours desde la API de Extras.
- [x] Consumo y vinculación de Endpoints de lectura de Artistas (Backend - Python/Flask).
- [x] Conexión real de Tienda con la tabla `products` de la BBDD.
- [x] Conexión real de Extras con la tabla `events` de la BBDD.
- [x] Lógica e interfaz del carrito de compra (Añadir, calcular totales y vaciar).
- [x] Visualización del historial de Pedidos e ítems por pedido.

---
*MuseHub 2026 - Música y Sostenibilidad en un solo lugar.*
