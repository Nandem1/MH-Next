# 🚀 Guía Rápida: Configuración de Variables de Entorno

## Para Desarrollo Local

1. **Crea el archivo `.env.local`** en la raíz del proyecto:

```bash
# En la raíz del proyecto (donde está package.json)
touch .env.local
```

2. **Copia este contenido en `.env.local`**:

```env
# ==============================================
# DESARROLLO LOCAL
# ==============================================
NODE_ENV=development
NEXT_PUBLIC_ENV=development

# URLs
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=https://apidemercadohouse.app
NEXT_PUBLIC_GO_API_URL=http://localhost:8080/api/v1

# Debug (opcional)
NEXT_PUBLIC_ENABLE_DEBUG=true
```

3. **Ajusta las URLs** según tu configuración local:
   - Si tu backend local corre en otro puerto, cambia `NEXT_PUBLIC_API_URL`
   - Si tu backend Go local corre en otro puerto, cambia `NEXT_PUBLIC_GO_API_URL`

4. **Reinicia el servidor de desarrollo**:
```bash
npm run dev
```

---

## Para Producción (Vercel)

📖 **[Guía Completa: Configuración en Vercel](docs/vercel-env-setup.md)** - Paso a paso detallado

**Resumen rápido:**

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. **Settings** → **Environment Variables**
3. Agrega estas variables (selecciona **☑️ Production**):

```
NEXT_PUBLIC_SITE_URL = https://mercadohouse.cl
NEXT_PUBLIC_API_URL = https://apidemercadohouse.app
NEXT_PUBLIC_GO_API_URL = https://tu-backend-go.com/api/v1
NEXT_PUBLIC_ENV = production
```

4. Haz clic en **Save** para cada variable
5. **Haz un nuevo deploy** para que los cambios surtan efecto

---

## 📝 Notas Importantes

- ✅ El archivo `.env.local` está en `.gitignore` - no se subirá al repositorio
- ✅ Las variables `NEXT_PUBLIC_*` son públicas (visibles en el cliente)
- ✅ Las variables sin `NEXT_PUBLIC_` solo están en el servidor
- ✅ Después de cambiar `.env.local`, reinicia el servidor de desarrollo

---

## 🔍 Verificar que Funciona

Abre tu navegador en `http://localhost:3000` y en la consola del navegador:

```javascript
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
```

Deberías ver la URL configurada.

---

## 🔄 Cambiar entre Desarrollo y Producción

¿Quieres saber cómo cambiar entre entornos localmente?

📖 **[Guía Rápida](ENV_QUICK_GUIDE.md)** - Cambio rápido entre entornos  
📚 **[Guía Completa](docs/local-environments.md)** - Explicación detallada

---

## 📚 Documentación Completa

Para más detalles, consulta: [`docs/environment-variables.md`](docs/environment-variables.md)

