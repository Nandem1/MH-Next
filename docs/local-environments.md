# 🔄 Guía: Cambiar entre Entornos Localmente

Esta guía explica cómo cambiar entre desarrollo y producción **localmente** en tu máquina.

---

## 📚 Cómo Funciona Next.js con Variables de Entorno

Next.js carga los archivos `.env` en este orden de **prioridad** (el último sobrescribe al anterior):

### En Desarrollo (`npm run dev`)
1. `.env` - Base para todos los entornos
2. `.env.local` - **Siempre cargado** (ignorado por git)
3. `.env.development` - Solo en desarrollo
4. `.env.development.local` - Solo en desarrollo (ignorado por git)

### En Producción (`npm run build` + `npm run start`)
1. `.env` - Base para todos los entornos
2. `.env.local` - **Siempre cargado** (ignorado por git)
3. `.env.production` - Solo en producción
4. `.env.production.local` - Solo en producción (ignorado por git)

**⚠️ Importante**: `.env.local` siempre se carga y tiene **máxima prioridad**. Si quieres usar diferentes configuraciones, usa `.env.development` y `.env.production`.

---

## 🎯 Estrategia Recomendada

### Opción 1: Usar `.env.local` para Desarrollo (Simple)

**Para desarrollo:**
- Crea `.env.local` con valores de desarrollo
- Ejecuta `npm run dev`

**Para producción local:**
- Renombra temporalmente `.env.local` a `.env.local.dev`
- Crea `.env.production.local` con valores de producción
- Ejecuta `npm run build && npm run start`

### Opción 2: Usar Archivos Específicos (Recomendado)

**Estructura de archivos:**
```
.env                    # Valores base compartidos
.env.development        # Valores específicos de desarrollo
.env.production         # Valores específicos de producción
.env.local              # Overrides locales (opcional, para desarrollo rápido)
```

**Ventajas:**
- ✅ Cambio automático según el comando que ejecutes
- ✅ No necesitas renombrar archivos
- ✅ Más organizado y mantenible

---

## 📝 Configuración Paso a Paso

### Paso 1: Crear `.env` (Valores Base)

Crea `.env` en la raíz del proyecto:

```env
# ==============================================
# VALORES BASE (Compartidos entre entornos)
# ==============================================

# Estas variables se pueden sobrescribir en .env.development o .env.production
NEXT_PUBLIC_GOOGLE_VERIFICATION=
```

### Paso 2: Crear `.env.development` (Desarrollo)

Crea `.env.development`:

```env
# ==============================================
# DESARROLLO
# ==============================================
NODE_ENV=development
NEXT_PUBLIC_ENV=development

# URLs
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=https://apidemercadohouse.app
NEXT_PUBLIC_GO_API_URL=http://localhost:8080/api/v1

# Debug
NEXT_PUBLIC_ENABLE_DEBUG=true
```

### Paso 3: Crear `.env.production` (Producción)

Crea `.env.production`:

```env
# ==============================================
# PRODUCCIÓN
# ==============================================
NODE_ENV=production
NEXT_PUBLIC_ENV=production

# URLs
NEXT_PUBLIC_SITE_URL=https://mercadohouse.cl
NEXT_PUBLIC_API_URL=https://apidemercadohouse.app
NEXT_PUBLIC_GO_API_URL=https://tu-backend-go-produccion.com/api/v1

# Debug
NEXT_PUBLIC_ENABLE_DEBUG=false
```

### Paso 4: (Opcional) `.env.local` para Overrides Rápidos

Si necesitas hacer cambios temporales sin modificar los archivos principales:

```env
# Este archivo sobrescribe TODO (útil para pruebas rápidas)
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🚀 Cómo Ejecutar en Cada Entorno

### Desarrollo

```bash
# Ejecuta en modo desarrollo
npm run dev
```

**Carga estos archivos:**
- `.env`
- `.env.local` (si existe)
- `.env.development`
- `.env.development.local` (si existe)

### Producción Local

```bash
# 1. Construir la aplicación en modo producción
npm run build

# 2. Ejecutar el servidor de producción
npm run start
```

**Carga estos archivos:**
- `.env`
- `.env.local` (si existe)
- `.env.production`
- `.env.production.local` (si existe)

---

## 🔍 Verificar qué Variables se Están Usando

### Opción 1: Endpoint de Debug

Crea `src/app/api/debug-env/route.ts`:

```typescript
import { ENV } from '@/config/env';

export async function GET() {
  return Response.json({
    nodeEnv: process.env.NODE_ENV,
    publicEnv: process.env.NEXT_PUBLIC_ENV,
    apiUrl: ENV.API_URL,
    siteUrl: ENV.SITE_URL,
    goApiUrl: ENV.GO_API_URL,
    isProduction: ENV.NODE_ENV === 'production',
    isDevelopment: ENV.NODE_ENV === 'development',
  });
}
```

Luego visita: `http://localhost:3000/api/debug-env`

### Opción 2: Console Log

En cualquier componente o página:

```typescript
import { ENV } from '@/config/env';

console.log('Entorno:', ENV.NODE_ENV);
console.log('API URL:', ENV.API_URL);
console.log('Site URL:', ENV.SITE_URL);
```

---

## 🛠️ Scripts Útiles (Opcional)

Puedes agregar estos scripts a `package.json` para facilitar el cambio:

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "start:prod": "NODE_ENV=production next start",
    
    // Nuevos scripts útiles
    "build:prod": "NODE_ENV=production next build",
    "preview": "npm run build && npm run start",
    "env:check": "node -e \"console.log('NODE_ENV:', process.env.NODE_ENV)\""
  }
}
```

---

## ⚠️ Problemas Comunes

### Problema: `.env.local` sobrescribe todo

**Solución**: Si quieres usar `.env.development` o `.env.production`, **no uses** `.env.local`, o úsalo solo para overrides temporales.

### Problema: Las variables no cambian al hacer build

**Solución**: 
1. Asegúrate de tener `.env.production` creado
2. Verifica que no hay `.env.local` con valores que sobrescriban
3. Ejecuta `npm run build` (esto establece `NODE_ENV=production` automáticamente)

### Problema: Quiero probar producción pero con algunas variables de desarrollo

**Solución**: Crea `.env.production.local` con los overrides que necesites:

```env
# .env.production.local
# Esto sobrescribe solo estas variables en producción
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 📋 Resumen Rápido

| Comando | Entorno | Archivos Cargados |
|---------|---------|-------------------|
| `npm run dev` | Development | `.env` → `.env.local` → `.env.development` → `.env.development.local` |
| `npm run build` | Production | `.env` → `.env.local` → `.env.production` → `.env.production.local` |
| `npm run start` | Production | Mismo que build |

---

## 🎯 Recomendación Final

**Para tu caso de uso:**

1. **Crea `.env.development`** con tus valores de desarrollo
2. **Crea `.env.production`** con tus valores de producción
3. **Usa `npm run dev`** para desarrollo
4. **Usa `npm run build && npm run start`** para probar producción localmente
5. **No uses `.env.local`** a menos que necesites hacer cambios temporales

¡Así tendrás cambio automático según el comando que ejecutes! 🚀

