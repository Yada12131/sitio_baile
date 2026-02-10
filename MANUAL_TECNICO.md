# Manual Técnico - Club Deportivo Ritmos

Este documento detalla la estructura, instalación, mantenimiento y parametrización del sitio web del Club Deportivo Ritmos.

## 1. Tecnologías Utilizadas

El proyecto está construido sobre un stack moderno y eficiente:

*   **Frontend Framework**: [Next.js 14](https://nextjs.org/) (App Router).
*   **Lenguaje**: TypeScript.
*   **Estilos**: Tailwind CSS.
*   **Iconos**: Lucide React.
*   **Animaciones**: Framer Motion.
*   **Base de Datos**: PostgreSQL (alojada en Neon).
*   **Imágenes**: Cloudinary (para subida y optimización de imágenes).
*   **Despliegue**: Netlify (compatible con Next.js).

## 2. Instalación y Ejecución Local

Para ejecutar el proyecto en un entorno local de desarrollo:

### Requisitos Previos
*   [Node.js](https://nodejs.org/) (Versión 18 o superior).
*   [Git](https://git-scm.com/).

### Pasos
1.  **Clonar el repositorio** o descargar el código fuente.
2.  **Instalar dependencias**:
    ```bash
    npm install
    ```
3.  **Configurar Variables de Entorno**:
    Crear un archivo `.env` en la raíz del proyecto con las siguientes variables (ejemplo):
    ```env
    DATABASE_URL="postgres://usuario:password@host/neondb?sslmode=require"
    ADMIN_PASSWORD="admin123"
    ```
4.  **Ejecutar el servidor de desarrollo**:
    ```bash
    npm run dev
    ```
    El sitio estará disponible en `http://localhost:3000`.

## 3. Estructura del Proyecto

*   **`/app`**: Contiene las rutas y páginas del sitio (App Router).
    *   `/(public)`: Páginas públicas (Inicio, Nosotros, Servicios, etc.).
    *   `/admin`: Páginas del panel administrativo (protegidas).
    *   `/api`: Endpoints de la API (Backend) para manejar datos y autenticación.
*   **`/components`**: Componentes reutilizables de React (Navbar, Footer, ImageUpload, Formularios).
*   **`/lib`**: Utilidades y configuración.
    *   `db.ts`: Configuración de la conexión a Base de Datos y scripts de migración/inicialización.
*   **`/public`**: Archivos estáticos (imágenes fijas, favicon).

## 4. Base de Datos

El sistema utiliza PostgreSQL. La estructura se inicializa automáticamente en `lib/db.ts`.

### Tablas Principales
*   **`settings`**: Almacena configuración global (clave-valor) como títulos, colores, logos, links de redes sociales.
*   **`team_members`**: Miembros del equipo (nombre, rol, descripción, foto).
*   **`services`**: Servicios ofrecidos (título, precio, categoría, imagen).
*   **`events`**: Eventos programados.
*   **`classes`**: Clases disponibles (horarios, cupos, fotos).
*   **`messages`**: Mensajes recibidos desde el formulario de contacto.
*   **`registrations`**: Inscripciones a clases.

## 5. Panel Administrativo y Parametrización

El sitio cuenta con un CMS (Gestor de Contenido) integrado en la ruta `/admin`.

### Acceso
1.  Ir a `tudominio.com/admin/login` (o enlace oculto si existe).
2.  **Contraseña**: La definida en la variable de entorno `ADMIN_PASSWORD`.
    *   *Por defecto (si no se configura):* `admin123`.

### Módulos de Gestión

#### A. Configuración del Sitio (Sitio)
Aquí se parametrizan los aspectos visuales y de contenido global:
*   **Identidad**: Nombre del sitio, Logo (subida de imagen).
*   **Colores**:
    *   **Primario/Secundario**: Afectan botones, degradados y toques de color.
    *   **Barra de Navegación**: Personalización de color de fondo y texto del menú superior.
*   **Textos**: Títulos y descripciones de la página de Inicio (Hero, Destacados), Sobre Nosotros y Contacto.
*   **Redes Sociales**: URLs de Facebook, Instagram, TikTok.

#### B. Gestión de Contenido (Equipo, Servicios, Eventos, Clases)
Permite Crear, Editar y Eliminar registros.
*   **Imágenes**: Todos los formularios integran un cargador de imágenes conectado a Cloudinary.
    *   *Nota*: Para el **Equipo**, se recomienda usar fotos verticales (tipo retrato, ~600x800px).
    *   *Nota*: Para **Clases/Eventos**, fotos horizontales o cuadradas funcionan bien.

#### C. Mensajes e Inscripciones
Buzón de entrada para ver qué usuarios han escrito o se han inscrito a clases.

## 6. Mantenimiento y Despliegue

### Migraciones de Base de Datos
El archivo `lib/db.ts` contiene una función `initDb` que se ejecuta (o se puede invocar via `/api/test-seed`) para crear tablas si no existen.
Si se agregan nuevas columnas (como se hizo con `image` en `classes`), se deben agregar sentencias `ALTER TABLE` en este archivo para asegurar que la base de datos se actualice sin perder datos.

### Despliegue en Producción
Para desplegar cambios:
1.  Hacer **Commit** y **Push** al repositorio (GitHub/GitLab).
2.  La plataforma de despliegue (Netlify/Vercel) detectará el cambio y reconstruirá el sitio.
3.  **Importante**: Asegurarse de que las Variables de Entorno (`DATABASE_URL`, `ADMIN_PASSWORD`) estén configuradas en el panel de la plataforma de hosting.
