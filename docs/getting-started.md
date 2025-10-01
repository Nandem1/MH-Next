# 🚀 Guía de Inicio Rápido - MH-Next

## 📋 **Resumen**

Esta guía te llevará paso a paso desde la instalación hasta tener **MH-Next** funcionando completamente en tu entorno de desarrollo local.

**Tiempo estimado:** ⏱️ 15-20 minutos

---

## 📋 **Requisitos del Sistema**

### **Software Obligatorio**

| Herramienta | Versión Mínima | Versión Recomendada | Verificación |
|-------------|----------------|---------------------|--------------|
| **Node.js** | 18.17.0 | 20.x LTS | `node --version` |
| **npm** | 9.6.0 | 10.x | `npm --version` |
| **Git** | 2.34.0 | Latest | `git --version` |

### **Software Opcional pero Recomendado**

| Herramienta | Propósito | Instalación |
|-------------|-----------|-------------|
| **VS Code** | Editor recomendado | [Download](https://code.visualstudio.com/) |
| **Chrome DevTools** | Debugging | Incluido en Chrome |
| **Postman/Insomnia** | Testing de APIs | [Postman](https://www.postman.com/) |

### **Extensiones VS Code Recomendadas**

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

---

## 🔧 **Instalación Paso a Paso**

### **Paso 1: Clonar el Repositorio**

```bash
# Clonar el repositorio
git clone [repository-url] mh-next
cd mh-next

# Verificar que estás en la rama correcta
git branch
# * main (debería mostrar main como rama activa)
```

### **Paso 2: Instalar Dependencias**

```bash
# Instalar dependencias del proyecto
npm install

# Verificar que la instalación fue exitosa
npm list --depth=0
```

**⚠️ Posibles Problemas:**
- **Error de permisos**: Usar `sudo` solo si es necesario
- **Node version**: Verificar versión con `node --version`
- **npm cache**: Limpiar con `npm cache clean --force` si hay errores

### **Paso 3: Configurar Variables de Entorno**

#### **3.1 Crear archivo de configuración**
```bash
# Crear archivo de variables de entorno
touch .env.local

# Abrir en editor (VS Code)
code .env.local
```

#### **3.2 Configuración básica requerida**
```env
# ==============================================
# CONFIGURACIÓN BÁSICA - MH-Next
# ==============================================

# API Backend Configuration
NEXT_PUBLIC_API_URL=https://apidemercadohouse.app
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Development Configuration
NODE_ENV=development
NEXT_PUBLIC_ENV=development

# SEO & Analytics (Opcional en desarrollo)
NEXT_PUBLIC_GOOGLE_VERIFICATION=your-google-verification-code

# ==============================================
# CONFIGURACIÓN FUTURA (NextAuth.js)
# ==============================================
# NEXTAUTH_URL=http://localhost:3000
# NEXTAUTH_SECRET=your-super-secret-key-here
# NEXTAUTH_JWT_SECRET=your-jwt-secret-here
```

#### **3.3 Configuración avanzada (Opcional)**
```env
# ==============================================
# CONFIGURACIÓN AVANZADA (Opcional)
# ==============================================

# Database (Si necesitas conexión directa)
# DATABASE_URL=postgresql://user:password@localhost:5432/mh_database

# External Services
# CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
# SENDGRID_API_KEY=your-sendgrid-api-key

# Monitoring & Analytics
# VERCEL_ANALYTICS_ID=your-analytics-id
# SENTRY_DSN=your-sentry-dsn

# Feature Flags
# NEXT_PUBLIC_ENABLE_ANALYTICS=true
# NEXT_PUBLIC_ENABLE_DEBUG=false
```

### **Paso 4: Verificar Configuración**

```bash
# Verificar que Next.js puede leer las variables
npm run type-check

# Verificar lint
npm run lint

# Si hay errores de lint, corregir automáticamente
npm run lint:fix
```

---

## 🚦 **Iniciar el Servidor de Desarrollo**

### **Opción 1: Desarrollo con Turbopack (Recomendado)**
```bash
# Iniciar con Turbopack para mayor velocidad
npm run dev

# El servidor estará disponible en:
# ➜ Local:   http://localhost:3000
# ➜ Network: http://192.168.x.x:3000
```

### **Opción 2: Desarrollo Estándar**
```bash
# Iniciar sin Turbopack
next dev

# Útil si Turbopack presenta problemas
```

### **Verificar que Todo Funciona**

1. **Abrir navegador**: http://localhost:3000
2. **Verificar landing page**: Debería mostrar la página de Mercadohouse
3. **Probar autenticación**: Ir a `/login`
4. **Verificar dashboard**: Intentar acceso a `/dashboard` (debe redirigir a login)

---

## 🔐 **Configuración de Autenticación**

### **⚠️ Estado Actual**
El sistema usa **autenticación personalizada** que se conecta al backend de Railway:

```typescript
// Variables importantes para autenticación
NEXT_PUBLIC_API_URL=https://apidemercadohouse.app

// Endpoints de autenticación disponibles:
// POST /api-beta/login
// GET  /api-beta/me  
// POST /api-beta/logout
```

### **Credenciales de Testing**
```bash
# Estas credenciales deberían ser proporcionadas por el equipo
Email: test@mercadohouse.com
Password: [solicitar al equipo]

# O crear una cuenta de testing en el backend
```

---

## 🧪 **Verificación de la Instalación**

### **Checklist de Funcionalidades**

#### ✅ **Frontend**
- [ ] Landing page carga correctamente
- [ ] Navegación entre páginas funciona
- [ ] Estilos Material-UI se aplican
- [ ] Animaciones Framer Motion funcionan
- [ ] Dark/Light theme funciona

#### ✅ **Autenticación**
- [ ] Página de login es accesible
- [ ] Redirección a dashboard tras login
- [ ] Middleware protege rutas privadas
- [ ] Logout funciona correctamente

#### ✅ **Dashboard**
- [ ] Sidebar se renderiza
- [ ] Métricas cargan (puede mostrar error si no hay datos)
- [ ] Navegación entre módulos funciona
- [ ] Footer se muestra correctamente

#### ✅ **API Integration**
- [ ] Conexión al backend exitosa
- [ ] Interceptores de Axios funcionan
- [ ] Manejo de errores 401/403 funciona
- [ ] TanStack Query cache funciona

### **Comandos de Verificación**

```bash
# Verificar build de producción
npm run build

# Verificar tipos TypeScript
npm run type-check

# Verificar linting
npm run lint

# Analizar bundle (opcional)
npm run analyze
```

---

## 🛠️ **Comandos de Desarrollo Útiles**

### **Desarrollo Diario**
```bash
# Iniciar desarrollo
npm run dev

# Verificar código
npm run lint:fix && npm run type-check

# Limpiar y reinstalar dependencias
rm -rf node_modules package-lock.json && npm install
```

### **Debugging**
```bash
# Iniciar con debugging de Node.js
NODE_OPTIONS='--inspect' npm run dev

# Verificar variables de entorno
npm run dev -- --debug

# Limpiar cache de Next.js
rm -rf .next && npm run dev
```

### **Optimización**
```bash
# Optimizar imports
npm run optimize

# Limpiar duplicados
npm run clean

# Corregir directivas client
npm run fix-client
```

---

## 🚨 **Troubleshooting Común**

### **Problema 1: Puerto 3000 Ocupado**
```bash
# Error: Port 3000 is already in use
# Solución:
lsof -ti:3000 | xargs kill -9
# O usar otro puerto:
npm run dev -- -p 3001
```

### **Problema 2: Errores de Dependencias**
```bash
# Error: Module not found
# Solución:
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### **Problema 3: Variables de Entorno No Se Leen**
```bash
# Verificar archivo .env.local existe
ls -la | grep env

# Verificar sintaxis (sin espacios alrededor de =)
# ❌ NEXT_PUBLIC_API_URL = https://api.com
# ✅ NEXT_PUBLIC_API_URL=https://api.com

# Reiniciar servidor después de cambios
```

### **Problema 4: Errores de TypeScript**
```bash
# Error: Type errors
# Solución:
npm run type-check

# Si persisten errores, verificar:
# 1. Versión de TypeScript
# 2. Configuración tsconfig.json
# 3. Tipos de dependencias
```

### **Problema 5: Errores de Build**
```bash
# Error durante npm run build
# Verificar:
npm run lint
npm run type-check

# Limpiar cache
rm -rf .next
npm run build
```

### **Problema 6: Conexión API Fallida**
```bash
# Error: API connection failed
# Verificar:
# 1. Variable NEXT_PUBLIC_API_URL en .env.local
# 2. Backend está funcionando
# 3. CORS configurado en backend
# 4. Network tools en DevTools
```

---

## 📊 **Estructura de Desarrollo**

### **Flujo de Trabajo Recomendado**

1. **Iniciar día**:
   ```bash
   git pull origin main
   npm install  # Solo si hay cambios en package.json
   npm run dev
   ```

2. **Durante desarrollo**:
   ```bash
   # Verificar código frecuentemente
   npm run lint:fix
   npm run type-check
   ```

3. **Antes de commit**:
   ```bash
   npm run build  # Verificar que build funciona
   npm run lint   # Sin errores de lint
   ```

### **Organización de Archivos**

```
proyecto/
├── .env.local          # Tu configuración local (NO commitear)
├── .env.example        # Ejemplo de configuración (commitear)
├── src/
│   ├── app/           # Páginas Next.js 15
│   ├── components/    # Componentes React
│   ├── hooks/         # Custom hooks
│   ├── services/      # Servicios API
│   └── types/         # Tipos TypeScript
└── docs/              # Documentación
```

---

## 📚 **Recursos Adicionales**

### **Documentación Técnica**
- 🏗️ **[Arquitectura](./architecture/overview.md)** - Diseño del sistema
- 🧩 **[Componentes](./components/)** - Guía de componentes
- 🔗 **[APIs](./services/)** - Integración con backend
- 🧪 **[Testing](./testing/)** - Estrategias de pruebas

### **Documentación Externa**
- 📖 **[Next.js 15 Docs](https://nextjs.org/docs)** - Framework principal
- 🎨 **[Material-UI v7](https://mui.com/material-ui/)** - Componentes UI
- ⚡ **[TanStack Query](https://tanstack.com/query/latest)** - Estado del servidor
- 🎬 **[Framer Motion](https://www.framer.com/motion/)** - Animaciones

### **Herramientas de Desarrollo**
- 🔍 **[React DevTools](https://react.dev/learn/react-developer-tools)**
- 🔍 **[TanStack Query DevTools](https://tanstack.com/query/latest/docs/react/devtools)** (incluido)
- 🔍 **[Next.js DevTools](https://nextjs.org/docs/app/building-your-application/optimizing/bundle-analyzer)**

---

## 🆘 **Obtener Ayuda**

### **Problemas Técnicos**
1. **Revisar esta guía** completa
2. **Verificar documentación** de arquitectura
3. **Consultar logs** en consola del navegador
4. **Verificar Network tab** en DevTools

### **Problemas de Configuración**
1. **Verificar variables de entorno**
2. **Confirmar versiones** de Node.js/npm
3. **Limpiar cache** y reinstalar
4. **Verificar permisos** de archivos

### **Contacto**
- **Documentación**: Revisar `docs/` folder
- **Issues**: Crear issue con detalles del problema
- **Equipo**: Contactar desarrolladores principales

---

## ✅ **¡Listo para Desarrollar!**

Si has completado todos los pasos, deberías tener:

- ✅ **Servidor funcionando** en http://localhost:3000
- ✅ **Variables configuradas** correctamente  
- ✅ **Autenticación operativa** (login/logout)
- ✅ **Dashboard accesible** tras autenticación
- ✅ **Hot reload** funcionando para desarrollo
- ✅ **DevTools** configuradas y funcionando

**¡Ahora puedes comenzar a desarrollar en MH-Next!** 🚀

---

*Guía actualizada: Septiembre 2025*
