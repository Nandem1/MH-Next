# 🔍 Configuración Google Search Console - Mercadohouse

## 📋 Pasos para configurar Google Search Console

### 1. Acceso inicial
- URL: https://search.google.com/search-console
- Iniciar sesión con cuenta de Google

### 2. Agregar propiedad
- Seleccionar "Prefijo de URL"
- Ingresar: `https://mercadohouse.cl/`
- Método de verificación: **DNS record** (recomendado)

### 3. Verificación por DNS
1. Google te proporcionará un registro TXT
2. Agregar en el DNS del dominio:
   ```
   Tipo: TXT
   Nombre: @
   Valor: [código que proporciona Google]
   TTL: 3600 (o por defecto)
   ```

### 4. Configuración post-verificación

#### 4.1 Enviar Sitemap
- Ir a "Sitemaps" en el menú lateral
- Agregar: `https://mercadohouse.cl/sitemap.xml`
- Enviar

#### 4.2 Configurar Core Web Vitals
- Ir a "Core Web Vitals" en el menú lateral
- Monitorear métricas de campo (CrUX)
- Revisar reportes mensuales

#### 4.3 Configurar Inspección de URL
- Usar "Inspección de URL" para verificar indexación
- Probar URLs importantes:
  - `https://mercadohouse.cl/`
  - `https://mercadohouse.cl/#locales`
  - `https://mercadohouse.cl/#nosotros`

### 5. Monitoreo continuo

#### 5.1 Métricas importantes a revisar:
- **Consultas**: Keywords que llevan tráfico
- **Páginas**: URLs más visitadas
- **Países**: Confirmar que Chile es el principal
- **Dispositivos**: Mobile vs Desktop

#### 5.2 Alertas a configurar:
- Errores de rastreo
- Problemas de Core Web Vitals
- URLs no encontradas (404)

### 6. Optimización SEO

#### 6.1 Revisar datos de búsqueda:
- Keywords con mejor posición
- Keywords con más clics
- Oportunidades de mejora

#### 6.2 Mejorar CTR:
- Optimizar títulos y descripciones
- Implementar rich snippets
- Mejorar velocidad de carga

## 📊 Métricas esperadas

### Primer mes:
- **Impresiones**: 100-500
- **Clics**: 10-50
- **CTR**: 2-5%
- **Posición promedio**: 15-25

### Después de 3 meses:
- **Impresiones**: 500-2000
- **Clics**: 50-200
- **CTR**: 3-8%
- **Posición promedio**: 8-15

## 🔗 Enlaces útiles

- [Google Search Console](https://search.google.com/search-console)
- [Documentación oficial](https://support.google.com/webmasters/)
- [Guía de Core Web Vitals](https://web.dev/vitals/)

## 📝 Notas importantes

- Los datos pueden tardar 24-48 horas en aparecer
- La verificación por DNS es más confiable que por archivo HTML
- Revisar Search Console al menos una vez por semana
- Configurar alertas por email para problemas críticos
