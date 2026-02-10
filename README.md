# Sitio Web Institucional - Municipalidad de Estación General Paz

Portal web institucional desarrollado con Next.js 16, TypeScript, MUI v5, Redux Toolkit y Supabase.

## 📋 Tabla de Contenidos

- [Stack Tecnológico](#stack-tecnológico)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración de Supabase](#configuración-de-supabase)
- [Variables de Entorno](#variables-de-entorno)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Scripts Disponibles](#scripts-disponibles)
- [Características](#características)
- [Convenciones de Código](#convenciones-de-código)

---

## 🚀 Stack Tecnológico

- **Frontend**: Next.js 16 (App Router), TypeScript, React 19
- **UI**: Material-UI v5 (MUI), Emotion
- **State Management**: Redux Toolkit, Redux Persist
- **Backend**: Supabase (Auth + Database + Storage)
- **HTTP Client**: Axios
- **Formularios**: React Hook Form + Yup
- **Notificaciones**: Notistack

---

## 📦 Requisitos Previos

- Node.js 18+
- npm o yarn
- Cuenta de Supabase (gratis en [supabase.com](https://supabase.com))

---

## 🛠️ Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd municipalidad-general-paz
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear archivo `.env.local` en la raíz del proyecto:

```bash
cp .env.example .env.local
```

Editar `.env.local` con tus credenciales de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

---

## 🗄️ Configuración de Supabase

### Paso 1: Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. Espera a que el proyecto esté listo (2-3 minutos)

### Paso 2: Ejecutar Script SQL

1. En el panel de Supabase, ve a **SQL Editor**
2. Crea una nueva query
3. Copia y pega el contenido del archivo `documentation/supabase-schema.sql`
4. Ejecuta el script (botón **Run** o `Ctrl+Enter`)

Este script creará:
- 7 tablas (news, authorities, services, regulations, contact_info, site_settings, news_attachments)
- Índices para optimizar queries
- Row Level Security (RLS) policies
- Triggers para updated_at
- Datos de prueba iniciales

### Paso 3: Configurar Storage Buckets

Sigue las instrucciones en `documentation/supabase-storage-config.md`:

1. Ve a **Storage** en Supabase
2. Crea los siguientes buckets (todos públicos):
   - `news-images`
   - `news-attachments`
   - `authority-photos`
   - `service-images`
   - `regulations-pdfs`

3. Configura las políticas RLS para cada bucket (ver archivo de documentación)

### Paso 4: Crear Usuario Administrador

1. Ve a **Authentication** > **Users**
2. Click en **Add user**
3. Email: `admin@municipalidadgeneralpaz.gob.ar` (o el que prefieras)
4. Password: (contraseña segura)
5. Marca **Auto confirm user**: ✅

---

## 🔐 Variables de Entorno

### Obtener Credenciales de Supabase

1. Ve a **Settings** > **API** en tu proyecto Supabase
2. Copia:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Archivo `.env.local`

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# API (opcional - para desarrollo local)
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

⚠️ **IMPORTANTE**: Nunca commitees el archivo `.env.local` al repositorio.

---

## 📁 Estructura del Proyecto

```
municipalidad-general-paz/
├── app/                          # Rutas de Next.js (App Router)
│   ├── (public)/                 # Portal público
│   │   ├── layout.tsx            # Layout con Header/Footer
│   │   ├── page.tsx              # Página de inicio
│   │   ├── municipalidad/        # Sección Municipalidad
│   │   ├── novedades/            # Noticias
│   │   ├── servicios/            # Servicios municipales
│   │   ├── normativa/            # Ordenanzas
│   │   └── contacto/             # Contacto
│   ├── admin/                    # Panel de administración
│   │   ├── layout.tsx            # Layout admin con sidebar
│   │   ├── page.tsx              # Dashboard
│   │   ├── novedades/            # CRUD noticias
│   │   ├── servicios/            # CRUD servicios
│   │   ├── autoridades/          # CRUD autoridades
│   │   ├── normativa/            # CRUD ordenanzas
│   │   └── configuracion/        # Configuración del sitio
│   ├── login/                    # Login
│   └── layout.tsx                # Layout raíz
│
├── components/                   # Componentes globales reutilizables
│   ├── LoadingSpinner.tsx
│   ├── ErrorMessage.tsx
│   └── ...
│
├── constants/                    # Constantes globales
│   ├── routes.ts                 # Rutas del sitio
│   ├── categories.ts             # Categorías
│   ├── menu.ts                   # Menús de navegación
│   └── storage.ts                # Configuración de storage
│
├── hooks/                        # Hooks personalizados
│   ├── useAuth.ts
│   ├── useFileUpload.ts
│   ├── usePagination.ts
│   └── useDebounce.ts
│
├── state/                        # State management
│   ├── redux/
│   │   ├── store.ts              # Redux store
│   │   ├── app/                  # Slice app
│   │   ├── auth/                 # Slice autenticación
│   │   ├── news/                 # Slice noticias
│   │   ├── authorities/          # Slice autoridades
│   │   ├── services/             # Slice servicios
│   │   ├── regulations/          # Slice normativa
│   │   ├── contact/              # Slice contactos
│   │   ├── settings/             # Slice configuración
│   │   └── admin/                # Slice admin
│   ├── axios/
│   │   └── config.ts             # Configuración Axios
│   └── supabase/
│       └── config.ts             # Cliente Supabase
│
├── theme/                        # Tema y estilos
│   ├── mui.ts                    # Theme MUI personalizado
│   └── global.css                # Estilos CSS globales
│
├── types/                        # Tipos TypeScript
│   ├── global.ts
│   ├── auth.ts
│   ├── admin.ts
│   ├── news.ts
│   ├── authorities.ts
│   ├── services.ts
│   ├── regulations.ts
│   ├── contact.ts
│   └── settings.ts
│
├── utils/                        # Funciones utilitarias
│   ├── dates.ts
│   ├── numbers.ts
│   └── strings.ts
│
├── documentation/                # Documentación
│   ├── supabase-schema.sql
│   └── supabase-storage-config.md
│
├── .env.example                  # Ejemplo de variables de entorno
├── CLAUDE.md                     # Convenciones del proyecto
└── README.md                     # Este archivo
```

---

## 🎯 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Inicia servidor de desarrollo (http://localhost:3000)

# Producción
npm run build            # Compila la aplicación para producción
npm run start            # Inicia servidor de producción

# Linting
npm run lint             # Ejecuta ESLint
```

---

## ✨ Características

### Portal Público

- ✅ Página de inicio con noticias destacadas
- ✅ Sección Municipalidad (Intendente, Gabinete, Concejo, Historia)
- ✅ Novedades/Noticias con paginación y filtros
- ✅ Servicios municipales (Salud, Cultura, Deporte, Trámites)
- ✅ Normativa/Ordenanzas con descarga de PDFs
- ✅ Contacto/Números útiles
- ✅ Diseño responsive (mobile, tablet, desktop)
- ✅ Accesibilidad (WCAG 2.1)

### Panel de Administración

- ✅ Login con Supabase Auth
- ✅ Dashboard con estadísticas
- ✅ CRUD completo de novedades
- ✅ Upload de imágenes y documentos
- ✅ CRUD de servicios
- ✅ CRUD de autoridades
- ✅ CRUD de normativa
- ✅ Configuración del sitio (historia, misión, visión)
- ✅ Gestión de números útiles
- ✅ Rutas protegidas con autenticación

---

## 📝 Convenciones de Código

Ver archivo [CLAUDE.md](./CLAUDE.md) para convenciones detalladas.

### Resumen

1. **Componentes**: Arrow functions + export default al final
2. **Estilos**: NO usar `sx` inline, siempre en archivo `classes.ts`
3. **Tipos**: Usar `type` en lugar de `interface`
4. **Imports**: Usar alias `@/` para imports desde raíz
5. **Redux Slices**: Estructura con `api.ts`, `thunk.ts`, `extraReducers.ts`, `initialState.ts`, `index.ts`

### Ejemplo de Componente

```typescript
import { Box, Typography } from '@mui/material';
import classes from './classes';

const MiComponente = () => {
  return (
    <Box sx={classes.container}>
      <Typography variant="h1" sx={classes.title}>
        Hola Mundo
      </Typography>
    </Box>
  );
};

export default MiComponente;
```

### Ejemplo de classes.ts

```typescript
const classes = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    padding: 3,
  },
  title: {
    color: 'primary.main',
    fontWeight: 600,
  },
};

export default classes;
```

---

## 🎨 Theme

### Colores Institucionales

- **Primary (Azul institucional)**: `#003F87`
- **Secondary (Rojo/Granate)**: `#E63946`
- **Success (Verde)**: `#2E7D32`
- **Background**: `#F5F5F5`

### Breakpoints

- **xs**: 0px (mobile)
- **sm**: 600px (tablet)
- **md**: 960px (desktop pequeño)
- **lg**: 1280px (desktop)
- **xl**: 1920px (desktop grande)

---

## 🔒 Seguridad

- ✅ Row Level Security (RLS) configurado en Supabase
- ✅ Rutas admin protegidas con autenticación
- ✅ Validación de archivos (tipo, tamaño)
- ✅ Variables de entorno no expuestas en frontend
- ✅ Sanitización de inputs
- ✅ HTTPS en producción

---

## 📱 Acceso al Sistema

### Portal Público

```
URL: http://localhost:3000
Acceso: Libre (sin autenticación)
```

### Panel de Administración

```
URL: http://localhost:3000/login
Email: admin@municipalidadgeneralpaz.gob.ar (el que creaste en Supabase)
Password: (la contraseña que configuraste)
```

---

## 🐛 Troubleshooting

### Error: "Supabase no está configurado"

**Solución**: Verifica que tu archivo `.env.local` tenga las credenciales correctas de Supabase.

### Error: "Store does not have a valid reducer"

**Solución**: Asegúrate de haber ejecutado `npm install` y que el archivo `state/redux/store.ts` esté correctamente configurado.

### Error al subir imágenes

**Solución**:
1. Verifica que los buckets de storage estén creados en Supabase
2. Verifica que las políticas RLS estén configuradas correctamente
3. Verifica que el usuario esté autenticado

### Errores de compilación con Next.js

**Solución**:
1. Elimina `.next` y `node_modules`
2. Ejecuta `npm install`
3. Ejecuta `npm run dev`

---

## 📚 Documentación Adicional

- [Next.js Documentation](https://nextjs.org/docs)
- [MUI Documentation](https://mui.com/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Supabase Documentation](https://supabase.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

---

## 🤝 Contribución

Para contribuir al proyecto:

1. Crea una rama feature: `git checkout -b feature/nueva-funcionalidad`
2. Haz commit de tus cambios: `git commit -m "Agregar nueva funcionalidad"`
3. Push a la rama: `git push origin feature/nueva-funcionalidad`
4. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es propiedad de la Municipalidad de Estación General Paz.

---

## 👨‍💻 Autor

**Grande Fernando Javier**
Desarrollador del Sitio Web Institucional
Municipalidad de Estación General Paz

---

## 📞 Soporte

Para soporte técnico o consultas sobre el proyecto, contactar a:
- Email: admin@municipalidadgeneralpaz.gob.ar
- Teléfono: (0341) 123-4567

---

**Última actualización**: Enero 2025
