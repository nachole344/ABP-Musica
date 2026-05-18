# 🎵 SoundScape - Catálogo de Artistas & Tienda Sostenible

Este proyecto es una plataforma para explorar artistas, álbumes, canciones y eventos, con un enfoque en la venta de productos sostenibles.

---

## 🚀 Cómo ejecutar el proyecto

Sigue estos pasos cada vez que quieras poner en marcha el entorno de desarrollo.

### 1. Preparar la Base de Datos (Fuera de este entorno)
Asegúrate de tener tu base de datos **PostgreSQL** corriendo (ya sea en Docker o localmente) y que las tablas de artistas estén creadas según tu esquema.

### 2. Configurar el Backend (Python Flask)

1. **Entrar en la carpeta del backend:**
   ```bash
   cd backend
   ```

2. **Crear un entorno virtual (Solo la primera vez):**
   ```bash
   python -m venv venv
   ```

3. **Activar el entorno virtual:**
   - **Windows:** `.\venv\Scripts\activate`
   - **Linux/Mac:** `source venv/bin/activate`

4. **Instalar dependencias (Si hay cambios):**
   ```bash
   pip install -r requirements.txt
   ```

5. **Configurar variables de entorno:**
   Revisa el archivo `.env` en la carpeta `backend/` y asegúrate de que la URL de la base de datos es correcta:
   ```env
   DATABASE_URL=postgresql://tu_usuario:tu_password@localhost:5432/artists_db
   ```

6. **Ejecutar la API:**
   ```bash
   python run.py
   ```
   *La API estará disponible en `http://localhost:5000`*

### 3. Ejecutar el Frontend (HTML/JS)

Como es una aplicación estática (HTML puro + Tailwind + Bootstrap), puedes abrirla de dos formas:

- **Opción A:** Abrir el archivo `frontend/index.html` directamente en tu navegador.
- **Opción B (Recomendada):** Usa la extensión "Live Server" de VS Code o ejecuta un servidor simple desde la carpeta `frontend/`:
  ```bash
  cd frontend
  python -m http.server 8000
  ```
  *El frontend estará disponible en `http://localhost:8000`*

---

## 🛠️ Estado del Proyecto: Responsabilidad de Artistas & Globales

- [x] Arquitectura de navegación global (Tienda, Extras, Sostenibilidad, Artistas).
- [x] **Rediseño Visual Premium (Modo Oscuro, Glassmorphism).**
- [x] Lógica de navegación SPA (Single Page Application) sin recarga.
- [x] **Implementación visual de Tienda Global.**
- [x] **Implementación visual de Sostenibilidad.**
- [x] **Implementación visual de Extras (Tours y Series).**
- [ ] Endpoints de lectura de Artistas (Backend - Python/Flask).
- [ ] Conexión real de Tienda con la tabla `products` de la BBDD.
- [ ] Conexión real de Extras con la tabla `events` de la BBDD.
- [ ] Lógica del carrito de compra.

---

*Nota: Este archivo se irá actualizando a medida que añadamos nuevas funcionalidades.*
