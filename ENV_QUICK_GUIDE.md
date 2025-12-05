# ⚡ Guía Rápida: Cambiar entre Desarrollo y Producción

## 🎯 Respuesta Rápida

### Para Desarrollo
```bash
npm run dev
```
**Usa:** `.env.development` (o `.env.local`)

### Para Producción Local
```bash
npm run build
npm run start
```
**Usa:** `.env.production`

---

## 📁 Archivos que Necesitas Crear

### 1. `.env.development` (Para `npm run dev`)

```env
NODE_ENV=development
NEXT_PUBLIC_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=https://apidemercadohouse.app
NEXT_PUBLIC_GO_API_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_ENABLE_DEBUG=true
```

### 2. `.env.production` (Para `npm run build` + `npm run start`)

```env
NODE_ENV=production
NEXT_PUBLIC_ENV=production
NEXT_PUBLIC_SITE_URL=https://mercadohouse.cl
NEXT_PUBLIC_API_URL=https://apidemercadohouse.app
NEXT_PUBLIC_GO_API_URL=https://tu-backend-go-produccion.com/api/v1
NEXT_PUBLIC_ENABLE_DEBUG=false
```

---

## 🔄 Cómo Funciona

| Comando | Entorno | Archivo que Usa |
|---------|---------|-----------------|
| `npm run dev` | 🟢 Development | `.env.development` |
| `npm run build` | 🔴 Production | `.env.production` |
| `npm run start` | 🔴 Production | `.env.production` |

**⚠️ Importante:** Si tienes `.env.local`, este **siempre** sobrescribe todo. Úsalo solo para cambios temporales.

---

## ✅ Pasos para Configurar

1. **Crea `.env.development`** con valores de desarrollo
2. **Crea `.env.production`** con valores de producción
3. **Ejecuta `npm run dev`** → usa desarrollo
4. **Ejecuta `npm run build && npm run start`** → usa producción

---

## 🔍 Verificar qué Está Cargando

Crea `src/app/api/debug-env/route.ts`:

```typescript
import { ENV } from '@/config/env';

export async function GET() {
  return Response.json({
    nodeEnv: ENV.NODE_ENV,
    apiUrl: ENV.API_URL,
    siteUrl: ENV.SITE_URL,
  });
}
```

Visita: `http://localhost:3000/api/debug-env`

---

## 📚 Documentación Completa

Para más detalles: [`docs/local-environments.md`](docs/local-environments.md)

