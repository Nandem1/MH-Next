# ⚡ Configuración Rápida en Vercel

## 🎯 Pasos Rápidos

1. **Ve a Vercel Dashboard** → Tu Proyecto → **Settings** → **Environment Variables**

2. **Agrega estas variables** (una por una):

| Variable | Valor | Entornos |
|----------|-------|----------|
| `NEXT_PUBLIC_SITE_URL` | `https://mercadohouse.cl` | ☑️ Production |
| `NEXT_PUBLIC_API_URL` | `https://apidemercadohouse.app` | ☑️ Production |
| `NEXT_PUBLIC_GO_API_URL` | `https://tu-backend-go.com/api/v1` | ☑️ Production |
| `NEXT_PUBLIC_ENV` | `production` | ☑️ Production |

3. **Haz clic en "Save"** para cada variable

4. **Haz un nuevo deploy**:
   - Ve a **Deployments**
   - Haz clic en los **3 puntos** (⋯) del último deployment
   - Selecciona **Redeploy**

---

## 📋 Formulario en Vercel

```
┌─────────────────────────────────────────────┐
│ Key: NEXT_PUBLIC_SITE_URL                  │
│ Value: https://mercadohouse.cl             │
│                                             │
│ Environments:                               │
│ ☑️ Production                               │
│ ☐ Preview                                   │
│ ☐ Development                               │
│                                             │
│ [Save]                                      │
└─────────────────────────────────────────────┘
```

---

## ✅ Verificar que Funciona

Visita: `https://mercadohouse.cl/api/debug-env`

Deberías ver un JSON con todas las variables cargadas.

---

## 📚 Guía Completa

Para más detalles: [`docs/vercel-env-setup.md`](docs/vercel-env-setup.md)

