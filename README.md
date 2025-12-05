# 🏪 MH-Next - Sistema de Gestión Mercadohouse

![Next.js](https://img.shields.io/badge/Next.js-15.2.4-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Material-UI](https://img.shields.io/badge/Material--UI-7.0.2-0081CB?style=for-the-badge&logo=mui&logoColor=white)

## 📋 **Descripción General**

**MH-Next** es el sistema de gestión integral para **Mercadohouse**. El sistema maneja operaciones completas de retail incluyendo gestión de nóminas, control de facturas, caja chica, inventarios y administración de usuarios.

### 🏢 **Acerca de Mercadohouse**
- **Empresa**: Mercado House SPA
- **Ubicaciones**: 3 locales (La Cantera, Las Compañías, Balmaceda)
- **Región**: La Serena/Coquimbo, Chile

---

## 🚀 **Stack Tecnológico**

### **Frontend Core**
- **Framework**: Next.js 15.2.4 (App Router)
- **Runtime**: React 19.0.0
- **Lenguaje**: TypeScript 5.8.3
- **Bundler**: Turbopack (desarrollo)

### **UI/UX**
- **Design System**: Material-UI (MUI) v7.0.2
- **Iconografía**: @mui/icons-material + Lucide React
- **Animaciones**: Framer Motion 12.6.3
- **Styling**: Emotion (CSS-in-JS)

### **Estado y Datos**
- **Server State**: TanStack Query 5.71.10
- **Client State**: React Context API + useState/useReducer
- **HTTP Client**: Axios 1.8.4
- **Fecha/Hora**: date-fns 4.1.0

### **Herramientas de Desarrollo**
- **Linting**: ESLint 9 + Next.js config
- **Análisis**: Bundle Analyzer
- **Optimización**: Scripts personalizados para imports
- **Monitoreo**: Vercel Analytics + Speed Insights

### **Funcionalidades Especiales**
- **Escaneo**: Quagga2 (códigos de barras)
- **PDF Generation**: html2canvas
- **Date Pickers**: MUI X Date Pickers

---

## 📊 **Módulos del Sistema**

### 🏠 **Dashboard Principal**
- Panel de métricas y KPIs
- Navegación centralizada
- Prefetch inteligente de datos
- Sistema de notificaciones

### 💰 **Gestión de Nóminas**
- Creación y asignación de cheques
- Gestión de facturas asignadas
- Tracking de envíos
- Sistema de desasignación
- Filtros avanzados y paginación

### 🏦 **Caja Chica**
- Control de gastos menores
- Rendición de gastos
- Autorización por roles
- Integración con usuarios

### 📄 **Facturas y DTE**
- Procesamiento de documentos tributarios
- Integración con servicios externos
- Gestión de notas de crédito
- Lector automático de DTE

### 📦 **Bodega e Inventario**
- Control de stock general
- Movimientos de inventario
- Gestión de productos
- Sistema de códigos de barras

### 👥 **Gestión de Usuarios**
- Sistema de roles y permisos
- Autenticación multi-nivel
- Cambio de contraseñas
- Asignación por locales

### ⚙️ **Configuración**
- Importación de listas de precios
- Configuración por usuario
- Ajustes del sistema

### 📋 **Módulos Adicionales**
- **Control de Vencimientos**: Gestión de fechas críticas
- **Auditoría de Cartelería**: Control de material promocional
- **Zebra Integration**: Impresión especializada
- **Rinde de Gastos**: Rendición de gastos empresariales

---

## 🛠️ **Comandos de Desarrollo**

### **Desarrollo**
```bash
# Instalar dependencias
npm install

# Servidor de desarrollo (con Turbopack)
npm run dev

# Servidor de desarrollo estándar
npm run dev:standard
```

### **Build y Producción**
```bash
# Build de desarrollo
npm run build

# Build de producción
npm run build:prod

# Iniciar servidor de producción
npm start

# Iniciar servidor de producción (con variables)
npm run start:prod
```

### **Calidad de Código**
```bash
# Linting
npm run lint

# Linting con corrección automática
npm run lint:fix

# Verificación de tipos
npm run type-check
```

### **Análisis y Optimización**
```bash
# Análisis de bundle
npm run analyze

# Optimización de imports
npm run optimize

# Corrección de imports
npm run fix

# Limpieza de duplicados
npm run clean

# Corrección de directivas client
npm run fix-client
```

---

## 📁 **Estructura del Proyecto**

```
src/
├── app/                    # App Router (Next.js 15)
│   ├── dashboard/         # Módulos del dashboard
│   │   ├── inicio/       # Panel principal
│   │   ├── nominas/      # Gestión de nóminas
│   │   ├── caja-chica/   # Control de caja chica
│   │   ├── facturas/     # Gestión de facturas
│   │   ├── usuarios/     # Administración de usuarios
│   │   ├── bodega/       # Control de inventario
│   │   └── configuracion/ # Ajustes del sistema
│   ├── login/            # Autenticación
│   ├── api/              # API Routes
│   └── globals.css       # Estilos globales
├── components/            # Componentes reutilizables
│   ├── dashboard/        # Componentes del dashboard
│   ├── ui/               # Componentes base de UI
│   ├── landing/          # Página de aterrizaje
│   ├── layout/           # Componentes de layout
│   └── shared/           # Componentes compartidos
├── hooks/                # Custom hooks
├── services/             # Servicios de API
├── types/                # Definiciones TypeScript
├── utils/                # Utilidades y helpers
├── context/              # Contextos de React
├── providers/            # Providers globales
├── constants/            # Constantes del sistema
└── theme/                # Configuración de tema MUI
```

---

## 🔐 **Autenticación y Seguridad**

### ⚠️ **Estado Actual (Requiere Refactorización)**
El sistema actualmente implementa **autenticación mixta** con múltiples patrones:

- **Context API** (`AuthContext.tsx`)
- **Custom Hooks** (`useAuth.ts`, `useAuthStatus.ts`)
- **Middleware personalizado** (`middleware.ts`)
- **Servicios distribuidos** (`authService.ts`)

### 🎯 **Refactorización Planificada**
- **Migración a NextAuth.js**: Centralización de autenticación
- **Unificación frontend/backend**: Sistema coherente
- **Mejora de seguridad**: Tokens JWT centralizados
- **Simplificación de código**: Reducción de complejidad

---

## 🌐 **Variables de Entorno**

Para configurar las variables de entorno para desarrollo y producción:

📖 **[Guía Rápida de Configuración](ENV_SETUP.md)** - Setup rápido  
📚 **[Documentación Completa](docs/environment-variables.md)** - Guía detallada

### Variables Principales

```env
# URLs
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=https://apidemercadohouse.app
NEXT_PUBLIC_GO_API_URL=http://localhost:8080/api/v1

# Entorno
NEXT_PUBLIC_ENV=development
```

---

## 🚦 **Inicio Rápido**

### **1. Clonar el Repositorio**
```bash
git clone [repository-url]
cd MH-Next
```

### **2. Instalar Dependencias**
```bash
npm install
```

### **3. Configurar Variables de Entorno**
```bash
# Ver la guía rápida
cat ENV_SETUP.md

# Crear archivo .env.local y configurar variables
# Ver ENV_SETUP.md para más detalles
```

### **4. Iniciar Desarrollo**
```bash
npm run dev
```

### **5. Abrir en Navegador**
```
http://localhost:3000
```

---

## 📚 **Documentación Adicional**

- 📖 **[Guía de Inicio](docs/getting-started.md)** - Setup detallado
- 🏗️ **[Arquitectura](docs/architecture/overview.md)** - Diseño del sistema
- 🔧 **[Módulos](docs/modules/)** - Documentación por módulo
- 🧩 **[Componentes](docs/components/)** - Guía de componentes (WIP)
- 🔗 **[APIs](docs/services/)** - Integración con backend (WIP)
- 🧪 **[Testing](docs/testing/)** - Estrategias de pruebas (WIP)

---

### **Estándares de Código**
- **TypeScript strict mode**
- **ESLint + Prettier**
- **Convenciones de naming**
- **Documentación JSDoc**

---

### **Desarrollo**
- **Framework**: Next.js 15 + React 19
- **UI Library**: Material-UI v7
- **Estado**: TanStack Query + Context API
- **Deployment**: Vercel (recomendado)

---

## 📄 **Licencia**

Proyecto privado - © 2025 Mercado House SPA. Todos los derechos reservados.

---

## 🔄 **Changelog**

### **v0.1.0 - Desarrollo Inicial**
- ✅ Sistema de autenticación
- ✅ Dashboard principal con métricas
- ✅ Módulo de nóminas completo
- ✅ Gestión de caja chica
- ✅ Sistema de facturas y DTE
- ✅ Control de inventario
- ✅ Gestión de usuarios y roles

### **Próximas Versiones**
- 🔄 Migración a NextAuth.js
- 🚀 Optimización de performance
- 📱 Mejoras mobile-first
- 🧪 Suite de testing completa

---

*Última actualización: Septiembre 2025*