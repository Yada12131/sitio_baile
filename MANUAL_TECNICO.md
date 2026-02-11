# Manual Técnico y de Operaciones
## Club Deportivo Ritmos - Plataforma Web

---

**Versión del Documento:** 1.0.0
**Fecha de Actualización:** 10 de Febrero de 2026
**Confidencialidad:** Uso Interno Exclusivo

---

## Tabla de Contenidos

1.  [Introducción](#1-introducción)
2.  [Arquitectura del Sistema](#2-arquitectura-del-sistema)
3.  [Requisitos del Entorno](#3-requisitos-del-entorno)
4.  [Instalación y Despliegue Local](#4-instalación-y-despliegue-local)
5.  [Estructura del Código](#5-estructura-del-código)
6.  [Base de Datos y Modelo de Datos](#6-base-de-datos-y-modelo-de-datos)
7.  [Personalización y CMS](#7-personalización-y-cms)
8.  [Seguridad](#8-seguridad)
9.  [Mantenimiento y Solución de Problemas](#9-mantenimiento-y-solución-de-problemas)

---

## 1. Introducción

Este documento técnico tiene como objetivo proporcionar una guía exhaustiva sobre la infraestructura, el código fuente y los procedimientos operativos de la plataforma web del **Club Deportivo Ritmos**. Está dirigido a desarrolladores, administradores de sistemas y personal encargado del mantenimiento de la plataforma.

## 2. Arquitectura del Sistema

La solución está construida utilizando una arquitectura moderna basada en **Next.js** (React), optimizada para rendimiento, SEO y escalabilidad.

```mermaid
graph TD
    User[Usuario Final] -->|HTTPS| CDN[Netlify Edge / Vercel]
    CDN -->|Renderizado| NextJS[Servidor Next.js (SSR/API)]
    NextJS -->|Consultas SQL| DB[(PostgreSQL @ Neon)]
    NextJS -->|Gestión Media| Cloudinary[Cloudinary (Imágenes)]
    Admin[Administrador] -->|Panel Seguro| NextJS
```

### Stack Tecnológico
*   **Frontend & Backend**: [Next.js 14](https://nextjs.org/) (App Router).
*   **Lenguaje de Programación**: TypeScript (Tipado estático para mayor robustez).
*   **Estilos**: Tailwind CSS (Diseño responsivo y personalizable).
*   **Base de Datos**: PostgreSQL (Relacional, alojada en Neon).
*   **Almacenamiento de Archivos**: Cloudinary (Optimización automática de imágenes).
*   **UI/UX**: Lucide React (Iconos), Framer Motion (Animaciones).

## 3. Requisitos del Entorno

Para ejecutar el proyecto en un entorno de desarrollo, se requiere:

*   **Node.js**: Versión 18.x (LTS) o superior.
*   **Gestor de Paquetes**: NPM (v9+) o Yarn.
*   **Git**: Para control de versiones.
*   **Conexión a Internet**: Necesaria para conectar con la Base de Datos en la nube y Cloudinary.

## 4. Instalación y Despliegue Local

Siga estos pasos para levantar el entorno de desarrollo:

1.  **Clonar el Repositorio**:
    ```bash
    git clone <url-del-repositorio>
    cd site
    ```

2.  **Instalar Dependencias**:
    ```bash
    npm install
    ```

3.  **Configuración de Variables de Entorno**:
    Cree un archivo `.env.local` en la raíz del proyecto. Este archivo **NO** debe subirse al repositorio.
    
    ```env
    # Conexión a Base de Datos (PostgreSQL)
    DATABASE_URL="postgres://usuario:password@host/neondb?sslmode=require"

    # Credenciales de Administrador
    ADMIN_PASSWORD="TuContraseñaSegura"

    # Configuración de Cloudinary (Imágenes)
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="dcph4xznt"
    NEXT_PUBLIC_CLOUDINARY_PRESET="club_baile"
    ```

4.  **Iniciar Servidor de Desarrollo**:
    ```bash
    npm run dev
    ```
    Acceda a `http://localhost:3000` en su navegador.

## 5. Estructura del Código

El proyecto sigue la estructura estándar de **Next.js App Router**:

| Directorio | Descripción |
| :--- | :--- |
| `app/` | Núcleo de la aplicación. Contiene rutas, layouts y páginas. |
| `app/(public)/` | Rutas públicas accesibles por cualquier usuario (Home, About, etc.). |
| `app/admin/` | Panel de administración protegido. |
| `app/api/` | Endpoints backend (API REST) para manejo de datos. |
| `components/` | Componentes de React reutilizables (Botones, Navbar, Grillas, etc.). |
| `lib/` | Librerías y utilidades. `db.ts` maneja la conexión a BD. |
| `public/` | Archivos estáticos (imágenes fijas, íconos, fuentes). |

## 6. Base de Datos y Modelo de Datos

El sistema utiliza un esquema relacional. La inicialización de tablas es automática a través de `lib/db.ts`.

### Esquema de Tablas

1.  **`settings`** (Configuración Global)
    *   `key` (PK, Texto): Clave de configuración (ej. `primaryColor`, `siteName`).
    *   `value` (Texto): Valor de la configuración.

2.  **`team_members`** (Equipo)
    *   `id` (PK), `name`, `role`, `description`, `image`, `created_at`.

3.  **`classes`** (Clases)
    *   `id` (PK), `name`, `instructor`, `schedule`, `capacity`, `image`.

4.  **`events`** (Eventos)
    *   `id` (PK), `title`, `description`, `date`, `image`.

5.  **`services`** (Servicios)
    *   `id` (PK), `title`, `description`, `price`, `category`, `image`.

6.  **`messages`** (Contacto)
    *   Recibe los datos del formulario de contacto.

## 7. Personalización y CMS

El sistema incluye un **Panel de Administración (CMS)** robusto para gestionar el contenido sin tocar código.

### Acceso al Panel
*   **URL**: `/admin/login`
*   **Credenciales**: Controladas por la variable `ADMIN_PASSWORD`.

### Funcionalidades del CMS
1.  **Gestión de Marca (Branding)**: 
    *   Cambio de Logo y **control de tamaño** (slider en px).
    *   Definición de **Paleta de Colores** (Primario, Secundario, Navbar).
    *   **Tipografía**: Control de colores de texto y escala de fuente global.
2.  **Gestión de Contenido**:
    *   Crear/Editar/Eliminar Clases, Eventos, Servicios y Miembros del Equipo.
    *   Carga de imágenes integrada.
3.  **Configuración de Textos**:
    *   Edición de textos del Home, Misión, Visión y Footer.
154: 
155: ### 7.3. Gestión de Afiliados (NUEVO)
156: 
157: El sistema incorpora un módulo dinámico para la gestión de afiliaciones.
158: 
159: *   **Listado de Registros**:
160:     *   Ubicación: `/admin/dashboard/affiliates` (Pestaña "Registros").
161:     *   Permite visualizar todos los usuarios que han completado el formulario.
162:     *   Búsqueda en tiempo real por cualquier dato (nombre, cédula, correo).
163:     *   **Exportación a CSV**: Botón verde para descargar todos los datos en formato compatible con Excel.
164: 
165: *   **Constructor de Formulario (Form Builder)**:
166:     *   Ubicación: `/admin/dashboard/affiliates` (Pestaña "Configurar Formulario").
167:     *   Permite **Agregar, Editar, Eliminar y Reordenar** los campos del formulario público.
168:     *   Tipos de campo soportados: Texto, Email, Teléfono, Número, Fecha, Texto Largo, Lista Desplegable.
169:     *   Los cambios se reflejan **automáticamente** en la página pública `/affiliates`.

## 8. Seguridad

*   **Autenticación Admin**: Basada en Cookies seguras (`HttpOnly`). La sesión expira en 24 horas.
*   **Protección de API**: Las rutas de escritura (`POST`, `PUT`, `DELETE`) en `/api/` (excepto contacto) verifican la presencia de la cookie de administración.
*   **Inyección SQL**: El uso de consultas parametrizadas (`$1`, `$2`) en `lib/db.ts` previene ataques de inyección SQL.

## 9. Mantenimiento y Solución de Problemas

### Problema: Las imágenes no cargan
*   **Causa**: Fallo en Cloudinary o URL mal formada.
*   **Solución**: Verificar `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` en `.env`.

### Problema: Cambios de diseño no se reflejan
*   **Causa**: Caché del navegador o de Next.js.
*   **Solución**: Forzar recarga (`Ctrl + F5`) o reiniciar el servidor de desarrollo.

### Problema: Error de conexión a Base de Datos
*   **Causa**: URL de conexión incorrecta o base de datos dormida (Neon free tier).
*   **Solución**: Verificar `DATABASE_URL`. Si usa Neon Free Tier, espere 10 segundos y recargue para que la BD despierte.

---
*Este documento es propiedad del Club Deportivo Ritmos. Prohibida su distribución no autorizada.*
