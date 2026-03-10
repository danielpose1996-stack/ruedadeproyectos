# RuedaPro UNIPAZ - Plataforma Web

## Descripción del Proyecto
RuedaPro UNIPAZ es una plataforma web desarrollada para la gestión, evaluación y publicación de resultados de la **Rueda de Proyectos de Ingeniería Informática** de UNIPAZ. Permite a estudiantes, docentes y administradores interactuar con los proyectos presentados, evaluarlos y gestionar la información de manera centralizada.

## Características Principales
- **Autenticación Basada en Roles:** Acceso diferenciado para Estudiantes, Docentes y Administradores.
- **Gestión de Proyectos:** Visualización y galería de los proyectos presentados.
- **Evaluación:** Sistema de calificación de proyectos por parte de los docentes.
- **Panel de Control (Dashboard):** Vistas personalizadas para cada tipo de usuario (Admin, Docente, Estudiante).
- **Soporte para Modo Oscuro/Claro:** Interfaz de usuario adaptable y moderna.
- **Arquitectura SPA (Single Page Application):** Carga dinámica de vistas usando JavaScript nativo (Vanilla JS).

## Arquitectura y Tecnologías
Este proyecto está construido con un stack de tecnologías frontend ligero y backend como servicio (BaaS):

- **Frontend:**
  - HTML5, CSS3 (Vanilla CSS).
  - JavaScript (Vanilla JS) organizado en módulos (Vistas, Enrutador, Autenticación).
  - Iconos de FontAwesome.
  - Fuentes de Google (Inter).
- **Backend / Base de Datos:**
  - **Supabase:** Plataforma Backend-as-a-Service utilizada para autenticación, base de datos (PostgreSQL), y almacenamiento.

## Estructura del Proyecto
```text
/
├── assets/
│   ├── css/
│   │   └── styles.css       # Estilos principales de la aplicación y variables de tema
│   └── images/              # Recursos gráficos y logos
├── js/
│   ├── views/               # Controladores de las distintas vistas de la SPA
│   │   ├── adminDashboardView.js
│   │   ├── authView.js
│   │   ├── docenteDashboardView.js
│   │   ├── estudianteDashboardView.js
│   │   ├── evaluacionView.js
│   │   ├── galeriaView.js
│   │   ├── homeView.js
│   │   └── resultsView.js
│   ├── auth.js              # Lógica de autenticación con Supabase
│   ├── config.js            # Configuración global y credenciales de Supabase
│   ├── main.js              # Punto de entrada de la aplicación
│   └── router.js            # Enrutador personalizado para la SPA
├── sql/
│   └── rls_security_hardening.sql # Scripts de seguridad y políticas RLS para PostgreSQL en Supabase
├── index.html               # Plantilla principal (App Shell)
└── README.md                # Documentación del proyecto
```

## Configuración y Despliegue

### Requisitos Previos
- Un servidor local (ej. Live Server en VSCode, Node.js `http-server`, o extensión similar) para ejecutar el frontend.
- Una cuenta en [Supabase](https://supabase.com/).

### Instalación
1. Clonar el repositorio.
2. Abrir la carpeta del proyecto.
3. El archivo `js/config.js` contiene las claves de conexión a Supabase (`SUPABASE_URL` y `SUPABASE_ANON_KEY`). Si tienes tu propia instancia de base de datos, debes actualizar estas constantes.
4. Para la configuración de la base de datos de Supabase, ejecuta el script `sql/rls_security_hardening.sql` en el panel SQL de tu proyecto en Supabase para aplicar las políticas de seguridad (RLS).
5. Sirve el directorio raíz del proyecto con tu servidor web local preferido.

### Ejecución Local
Si usas VSCode, puedes instalar la extensión **Live Server** y hacer clic derecho sobre `index.html` -> "Open with Live Server".

## Notas de Desarrollo
- **Enrutamiento:** El cambio entre páginas se hace interceptando los enlaces (`data-route`) a través de `router.js` y cargando dinámicamente HTML en la etiqueta `<main id="app-content">`.
- **Estado de Sesión:** La sesión del usuario se mantiene asíncronamente a través de Supabase y el estado de la UI (botones de header) se actualiza de acuerdo al rol (`auth.js`).
- **Seguridad (RSL):** La seguridad de lectura/escritura a la base de datos se controla directamente desde Supabase usando Row Level Security (RLS) configurado en los scripts SQL.