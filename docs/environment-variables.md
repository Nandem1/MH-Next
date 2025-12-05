# 🌐 Configuración de Variables de Entorno

Esta guía explica cómo configurar y usar variables de entorno para diferentes ambientes (desarrollo, producción).

## 📋 Índice

- [Estructura de Archivos](#estructura-de-archivos)
- [Variables Disponibles](#variables-disponibles)
- [Configuración por Entorno](#configuración-por-entorno)
- [Uso en el Código](#uso-en-el-código)
- [Configuración en Vercel](#configuración-en-vercel)

---

## 📁 Estructura de Archivos

Next.js carga las variables de entorno en el siguiente orden de prioridad:

1. `.env.local` - **Siempre cargado** (ignorado por git)
2. `.env.development` - Solo en desarrollo (`npm run dev`)
3. `.env.production` - Solo en producción (`npm run build`)
4. `.env` - Valores por defecto para todos los entornos

**Recomendación**: Usa `.env.local` para desarrollo local y configura las variables en Vercel para producción.

---

## 🔧 Variables Disponibles

### Variables Requeridas

```env
# URL base del sitio (usado para SEO, sitemap, robots.txt)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# URL del backend principal (Node.js/Python)
NEXT_PUBLIC_API_URL=https://apidemercadohouse.app

# URL del backend Go (para stock, métricas, etc.)
NEXT_PUBLIC_GO_API_URL=http://localhost:8080/api/v1
```

### Variables Opcionales

```env
# Entorno
NODE_ENV=development
NEXT_PUBLIC_ENV=development

# SEO
NEXT_PUBLIC_GOOGLE_VERIFICATION=your-google-verification-code

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_DEBUG=false
```

### Variables Futuras (NextAuth.js)

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_JWT_SECRET=your-jwt-secret-here
```

---

## 🚀 Configuración por Entorno

### Desarrollo Local

1. **Crear archivo `.env.local`** en la raíz del proyecto:

```env
# ==============================================
# DESARROLLO LOCAL
# ==============================================
NODE_ENV=development
NEXT_PUBLIC_ENV=development

# URLs
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_GO_API_URL=http://localhost:8080/api/v1

# Debug
NEXT_PUBLIC_ENABLE_DEBUG=true
```

2. **El archivo `.env.local` está en `.gitignore`** - no se subirá al repositorio.

### Producción (Vercel)

Las variables se configuran en el dashboard de Vercel.

📖 **[Guía Completa de Configuración en Vercel](vercel-env-setup.md)** - Paso a paso detallado

**Resumen rápido:**

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. **Settings** → **Environment Variables**
3. Agrega las siguientes variables:

```env
NEXT_PUBLIC_SITE_URL=https://mercadohouse.cl
NEXT_PUBLIC_API_URL=https://apidemercadohouse.app
NEXT_PUBLIC_GO_API_URL=https://your-go-backend.com/api/v1
NEXT_PUBLIC_ENV=production
```

4. Selecciona el entorno: **☑️ Production** (y opcionalmente Preview/Development)
5. Haz clic en **Save**
6. **Haz un nuevo deploy** para aplicar los cambios

**Importante**: 
- Las variables `NEXT_PUBLIC_*` son públicas y se exponen al cliente
- Las variables sin `NEXT_PUBLIC_` solo están disponibles en el servidor
- Después de agregar variables en Vercel, necesitas hacer un nuevo deploy

---

## 💻 Uso en el Código

### ✅ Forma Recomendada (Usando el Config Centralizado)

```typescript
import { ENV, isProduction, getApiUrl } from '@/config/env';

// Usar variables directamente
const apiUrl = ENV.API_URL;
const siteUrl = ENV.SITE_URL;

// Verificar entorno
if (isProduction()) {
  // Lógica solo para producción
}

// Obtener URLs
const apiEndpoint = `${getApiUrl()}/api-beta/users`;
```

### ⚠️ Forma Alternativa (Directa - No Recomendada)

```typescript
// Solo si necesitas acceso directo
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

**Nota**: El archivo `src/config/env.ts` centraliza todas las variables y proporciona valores por defecto seguros.

---

## 🔄 Migración de Código Existente

Si tienes código que usa `process.env.NEXT_PUBLIC_API_URL` directamente, puedes migrarlo gradualmente:

**Antes:**
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL;
```

**Después:**
```typescript
import { ENV } from '@/config/env';
const API_URL = ENV.API_URL;
```

---

## 🧪 Verificación

### Verificar Variables en Desarrollo

```bash
# Ver todas las variables disponibles
npm run dev

# En el código, puedes hacer:
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
```

### Verificar Variables en Producción

1. En Vercel, ve a tu deployment
2. Revisa los logs del build
3. O agrega temporalmente un endpoint de debug:

```typescript
// src/app/api/debug-env/route.ts
export async function GET() {
  return Response.json({
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
    env: process.env.NEXT_PUBLIC_ENV,
  });
}
```

---

## 📝 Ejemplo de Archivos .env

### `.env.local` (Desarrollo - No se sube a git)

```env
NODE_ENV=development
NEXT_PUBLIC_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_GO_API_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_ENABLE_DEBUG=true
```

### Variables en Vercel (Producción)

```
NEXT_PUBLIC_SITE_URL=https://mercadohouse.cl
NEXT_PUBLIC_API_URL=https://apidemercadohouse.app
NEXT_PUBLIC_GO_API_URL=https://go-backend.railway.app/api/v1
NEXT_PUBLIC_ENV=production
```

---

## 🔒 Seguridad

### ✅ Variables Seguras (Servidor)

Las variables **sin** `NEXT_PUBLIC_` solo están disponibles en el servidor:

```env
# Solo disponible en servidor (API routes, Server Components)
DATABASE_URL=postgresql://...
API_SECRET_KEY=secret123
```

### ⚠️ Variables Públicas (Cliente)

Las variables **con** `NEXT_PUBLIC_` se exponen al cliente:

```env
# Disponible en cliente (puede ser vista en el navegador)
NEXT_PUBLIC_API_URL=https://api.example.com
```

**Nunca** pongas secretos en variables `NEXT_PUBLIC_*`.

---

## 🐛 Troubleshooting

### Las variables no se cargan

1. **Reinicia el servidor de desarrollo** después de cambiar `.env.local`
2. **Verifica el nombre del archivo** (debe ser exactamente `.env.local`)
3. **Verifica que las variables empiecen con `NEXT_PUBLIC_`** si las necesitas en el cliente

### Variables diferentes en desarrollo vs producción

1. **Verifica que `.env.local` tenga los valores correctos** para desarrollo
2. **Verifica las variables en Vercel** para producción
3. **Haz un nuevo deploy** después de cambiar variables en Vercel

### Variables undefined

1. **Verifica que el archivo `.env.local` existe** en la raíz del proyecto
2. **Verifica que no hay espacios** alrededor del `=` en el archivo .env
3. **Usa el config centralizado** (`src/config/env.ts`) que tiene valores por defecto

---

## 📚 Referencias

- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

