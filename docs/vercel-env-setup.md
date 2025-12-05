# 🚀 Configuración de Variables de Entorno en Vercel

Guía paso a paso para configurar variables de entorno en Vercel Dashboard.

---

## 📋 Índice

- [Acceso a la Configuración](#acceso-a-la-configuración)
- [Variables Requeridas](#variables-requeridas)
- [Configuración por Entorno](#configuración-por-entorno)
- [Verificación](#verificación)
- [Troubleshooting](#troubleshooting)

---

## 🔑 Acceso a la Configuración

### Paso 1: Ir al Dashboard de Vercel

1. Ve a [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Inicia sesión con tu cuenta
3. Selecciona tu proyecto **MH-Next** (o el nombre que tenga)

### Paso 2: Navegar a Environment Variables

1. En el menú superior del proyecto, haz clic en **Settings**
2. En el menú lateral izquierdo, busca y haz clic en **Environment Variables**

---

## 📝 Variables Requeridas

### Variables Mínimas (Obligatorias)

Agrega estas variables en Vercel:

| Variable | Valor de Ejemplo | Descripción |
|----------|------------------|-------------|
| `NEXT_PUBLIC_SITE_URL` | `https://mercadohouse.cl` | URL base del sitio |
| `NEXT_PUBLIC_API_URL` | `https://apidemercadohouse.app` | URL del backend principal |
| `NEXT_PUBLIC_ENV` | `production` | Entorno de ejecución |

### Variables Opcionales (Recomendadas)

| Variable | Valor de Ejemplo | Descripción |
|----------|------------------|-------------|
| `NEXT_PUBLIC_GO_API_URL` | `https://go-backend.railway.app/api/v1` | URL del backend Go |
| `NEXT_PUBLIC_GOOGLE_VERIFICATION` | `tu-codigo-google` | Código de verificación de Google |
| `NEXT_PUBLIC_ENABLE_DEBUG` | `false` | Habilitar debug (false en producción) |
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | `true` | Habilitar analytics |

---

## 🎯 Configuración por Entorno

Vercel permite configurar variables para **3 entornos diferentes**:

1. **Production** - Para el dominio principal (mercadohouse.cl)
2. **Preview** - Para los previews de Pull Requests
3. **Development** - Para los branches de desarrollo

### Cómo Agregar Variables

1. En la página de **Environment Variables**, verás un formulario con:
   - **Key** (Nombre de la variable)
   - **Value** (Valor de la variable)
   - **Environment** (Dónde aplica)

2. Para cada variable:
   - Escribe el **Key** (ej: `NEXT_PUBLIC_SITE_URL`)
   - Escribe el **Value** (ej: `https://mercadohouse.cl`)
   - Selecciona los **Environments** donde aplica:
     - ☑️ Production
     - ☑️ Preview (opcional, puede usar las mismas que production)
     - ☑️ Development (opcional, para branches de desarrollo)

3. Haz clic en **Save**

### Ejemplo de Configuración Completa

```
┌─────────────────────────────────────────────────────────┐
│ Key: NEXT_PUBLIC_SITE_URL                               │
│ Value: https://mercadohouse.cl                          │
│ Environments: ☑️ Production  ☑️ Preview  ☐ Development │
│ [Save]                                                   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Key: NEXT_PUBLIC_API_URL                                │
│ Value: https://apidemercadohouse.app                   │
│ Environments: ☑️ Production  ☑️ Preview  ☐ Development │
│ [Save]                                                   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Key: NEXT_PUBLIC_GO_API_URL                             │
│ Value: https://go-backend.railway.app/api/v1           │
│ Environments: ☑️ Production  ☑️ Preview  ☐ Development │
│ [Save]                                                   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Key: NEXT_PUBLIC_ENV                                    │
│ Value: production                                       │
│ Environments: ☑️ Production  ☑️ Preview  ☐ Development │
│ [Save]                                                   │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 Después de Configurar

### Importante: Hacer un Nuevo Deploy

**Las variables de entorno solo se aplican en nuevos deploys.** Si ya tienes un deploy activo:

1. **Opción 1: Deploy Automático**
   - Haz un push a tu repositorio
   - Vercel detectará los cambios y hará un nuevo deploy automáticamente

2. **Opción 2: Redeploy Manual**
   - Ve a la pestaña **Deployments**
   - Encuentra el último deployment
   - Haz clic en los **3 puntos** (⋯) → **Redeploy**
   - Confirma el redeploy

---

## ✅ Verificación

### Método 1: Verificar en los Logs del Build

1. Ve a **Deployments** en Vercel
2. Haz clic en el último deployment
3. Revisa los **Build Logs**
4. Busca si hay errores relacionados con variables de entorno

### Método 2: Usar el Endpoint de Debug

Si tienes el endpoint `/api/debug-env` configurado:

1. Visita: `https://mercadohouse.cl/api/debug-env`
2. Deberías ver un JSON con todas las variables cargadas

**Nota**: Asegúrate de que `NEXT_PUBLIC_ENABLE_DEBUG=true` esté configurado si quieres ver este endpoint en producción (o temporalmente para verificar).

### Método 3: Verificar en el Código

Agrega temporalmente en cualquier página:

```typescript
import { ENV } from '@/config/env';

console.log('Site URL:', ENV.SITE_URL);
console.log('API URL:', ENV.API_URL);
console.log('Environment:', ENV.NEXT_PUBLIC_ENV);
```

Luego revisa la consola del navegador en producción.

---

## 🎨 Configuración Avanzada

### Diferentes Variables para Preview

Si quieres que los previews usen un backend de staging:

```
┌─────────────────────────────────────────────────────────┐
│ Key: NEXT_PUBLIC_API_URL                                │
│ Value: https://api-staging.mercadohouse.app            │
│ Environments: ☐ Production  ☑️ Preview  ☐ Development │
│ [Save]                                                   │
└─────────────────────────────────────────────────────────┘
```

**Nota**: Si una variable está configurada para múltiples entornos, Vercel usará la que tenga mayor prioridad (Production > Preview > Development).

### Variables Secretas (Sin NEXT_PUBLIC_)

Si necesitas variables que solo estén disponibles en el servidor:

```
┌─────────────────────────────────────────────────────────┐
│ Key: DATABASE_URL                                       │
│ Value: postgresql://user:pass@host:5432/db            │
│ Environments: ☑️ Production  ☑️ Preview  ☐ Development │
│ [Save]                                                   │
└─────────────────────────────────────────────────────────┘
```

**Importante**: Estas variables NO estarán disponibles en el cliente (navegador).

---

## 🐛 Troubleshooting

### Las variables no se están aplicando

**Solución:**
1. ✅ Verifica que hiciste un **nuevo deploy** después de agregar las variables
2. ✅ Verifica que seleccionaste el **entorno correcto** (Production, Preview, etc.)
3. ✅ Verifica que el **nombre de la variable** es exacto (case-sensitive)
4. ✅ Verifica que no hay **espacios** antes o después del valor

### Variables undefined en producción

**Solución:**
1. ✅ Verifica que las variables empiezan con `NEXT_PUBLIC_` si las necesitas en el cliente
2. ✅ Verifica que hiciste un redeploy después de agregar las variables
3. ✅ Revisa los logs del build en Vercel para ver si hay errores

### Quiero cambiar una variable

**Solución:**
1. Ve a **Settings** → **Environment Variables**
2. Encuentra la variable que quieres cambiar
3. Haz clic en los **3 puntos** (⋯) → **Edit**
4. Cambia el valor
5. Haz clic en **Save**
6. **Haz un nuevo deploy** para aplicar los cambios

### Quiero eliminar una variable

**Solución:**
1. Ve a **Settings** → **Environment Variables**
2. Encuentra la variable que quieres eliminar
3. Haz clic en los **3 puntos** (⋯) → **Delete**
4. Confirma la eliminación
5. **Haz un nuevo deploy** para aplicar los cambios

---

## 📋 Checklist de Configuración

Antes de hacer deploy a producción, verifica:

- [ ] `NEXT_PUBLIC_SITE_URL` configurada con la URL de producción
- [ ] `NEXT_PUBLIC_API_URL` configurada con la URL del backend de producción
- [ ] `NEXT_PUBLIC_GO_API_URL` configurada (si aplica)
- [ ] `NEXT_PUBLIC_ENV` configurada como `production`
- [ ] `NEXT_PUBLIC_ENABLE_DEBUG` configurada como `false` (en producción)
- [ ] Todas las variables tienen el entorno **Production** seleccionado
- [ ] Se hizo un nuevo deploy después de configurar las variables
- [ ] Se verificó que las variables se están cargando correctamente

---

## 🔗 Referencias

- [Documentación Oficial de Vercel - Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)

---

## 💡 Tips

1. **Usa diferentes valores para Preview**: Configura un backend de staging para los previews de PRs
2. **No pongas secretos en NEXT_PUBLIC_**: Las variables `NEXT_PUBLIC_*` son visibles en el cliente
3. **Documenta tus variables**: Mantén una lista de todas las variables que usas
4. **Verifica antes de deployar**: Usa el endpoint de debug para verificar que todo está correcto

