# 🚀 Sistema de Monitoreo en Tiempo Real

## 📋 Descripción

Sistema completo de monitoreo en tiempo real para el backend MH, que incluye:

- **WebSockets** para actualizaciones en tiempo real
- **Métricas de performance** automáticas
- **Monitoreo de caché** con estadísticas detalladas
- **Alertas automáticas** para problemas
- **Portal web** profesional para visualización

## 🎯 Características

### ✅ Monitoreo Automático
- **Requests HTTP**: Tiempo de respuesta, códigos de estado, endpoints más usados
- **Base de datos**: Conexiones activas, queries lentos, estadísticas
- **Caché Redis**: Hit rate, memoria usada, compresión
- **Sistema**: Memoria heap, uptime, CPU

### ✅ Alertas en Tiempo Real
- **Requests lentos** (>5 segundos)
- **Errores del servidor** (500+)
- **Queries lentos** (>3 segundos)
- **Problemas de conexión**

### ✅ Portal Web Profesional
- **Dashboard en tiempo real** con WebSockets
- **Gráficos interactivos** con Chart.js
- **Logs en vivo** con filtros
- **Controles de administración**

## 🚀 Instalación

### 1. Dependencias
```bash
npm install socket.io
```

### 2. Configuración
El sistema se inicializa automáticamente en `server.js`:

```javascript
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Inicializar servicio de monitoreo
const monitoringService = initializeMonitoring(io);
```

## 📊 Endpoints de Monitoreo

### Métricas en Tiempo Real
```bash
GET /api/monitoring/metrics
```
**Respuesta:**
```json
{
  "requests": {
    "total": 1250,
    "byEndpoint": {
      "GET /api-beta/productos": {
        "count": 450,
        "avgTime": 125,
        "totalTime": 56250
      }
    },
    "slowRequests": [...],
    "errors": [...]
  },
  "performance": {
    "avgResponseTime": 145,
    "maxResponseTime": 2500,
    "minResponseTime": 12
  },
  "cache": {
    "hitRate": 0.85,
    "totalHits": 850,
    "totalMisses": 150,
    "memoryUsage": 15728640
  },
  "database": {
    "activeConnections": 5,
    "totalQueries": 1250,
    "slowQueries": [...]
  },
  "system": {
    "memoryUsage": "45.2 MB",
    "uptime": 3600,
    "cpuUsage": "2.3s"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Resetear Métricas
```bash
POST /api/monitoring/metrics/reset
```

### Estadísticas de Caché
```bash
GET /api/monitoring/cache/stats
```

### Limpiar Caché
```bash
POST /api/monitoring/cache/clear
Content-Type: application/json

{
  "pattern": "auditoria_carteleria:*"
}
```

### Estadísticas de Base de Datos
```bash
GET /api/monitoring/database/stats
```

### Estadísticas del Sistema
```bash
GET /api/monitoring/system/stats
```

### Logs Recientes
```bash
GET /api/monitoring/logs/recent
```

### Health Check Completo
```bash
GET /api/monitoring/health
```

## 📡 WebSocket Events

### Conectar al WebSocket
```javascript
const socket = io('http://localhost:5000', {
    transports: ['websocket', 'polling']
});
```

### Eventos Disponibles

#### 📊 Métricas en Tiempo Real
```javascript
socket.on('metrics', (data) => {
  console.log('Métricas actualizadas:', data);
  // Actualizar UI con nuevas métricas
});
```

#### 🚨 Alertas
```javascript
socket.on('alert', (alert) => {
  console.log('Alerta:', alert.message);
  console.log('Severidad:', alert.severity); // 'info', 'warning', 'error'
  console.log('Timestamp:', alert.timestamp);
});
```

#### 🔌 Estados de Conexión
```javascript
socket.on('connect', () => {
  console.log('Conectado al servidor de monitoreo');
});

socket.on('disconnect', () => {
  console.log('Desconectado del servidor de monitoreo');
});
```

## 🖥️ Portal Web

### Acceso
1. Abrir `monitoring-portal.html` en el navegador
2. El portal se conecta automáticamente al WebSocket
3. Las métricas se actualizan cada 5 segundos

### Características del Portal

#### 📈 Dashboard en Tiempo Real
- **Performance**: Requests totales, tiempos de respuesta
- **Caché**: Hit rate, memoria, hits/misses
- **Sistema**: Memoria heap, uptime, conexiones DB
- **Gráficos**: Requests por endpoint con Chart.js

#### 🎛️ Controles de Administración
- **Resetear Métricas**: Limpiar contadores
- **Limpiar Caché**: Invalidar caché por patrón
- **Logs en Vivo**: Ver alertas y errores recientes

#### 🚨 Alertas Visuales
- **Notificaciones emergentes** para alertas importantes
- **Indicador de conexión** con animación
- **Logs con colores** según severidad

## 🔧 Configuración Avanzada

### Variables de Entorno
```bash
# URL del frontend para CORS de WebSocket
FRONTEND_URL=http://localhost:5500

# Entorno (development/production)
NODE_ENV=development
```

### Personalizar Alertas
En `app/middlewares/monitoringMiddleware.js`:

```javascript
// Cambiar umbrales de alertas
if (responseTime > 5000) { // Cambiar de 5000ms a otro valor
  monitoringService.emitAlert('slow_request', ...);
}

if (queryTime > 3000) { // Cambiar de 3000ms a otro valor
  monitoringService.emitAlert('slow_query', ...);
}
```

### Personalizar Métricas
En `app/services/monitoringService.js`:

```javascript
// Cambiar frecuencia de actualización (5 segundos por defecto)
setInterval(async () => {
  await this.getSystemMetrics();
  await this.getCacheMetrics();
  this.emitMetrics();
}, 5000); // Cambiar a 10000 para cada 10 segundos
```

## 📊 Métricas Disponibles

### Requests HTTP
- **Total de requests**
- **Requests por endpoint**
- **Tiempo promedio/máximo/mínimo**
- **Requests lentos** (>1 segundo)
- **Errores** (400+)

### Caché Redis
- **Hit rate** (porcentaje de aciertos)
- **Total hits/misses**
- **Memoria usada**
- **Compresión** (si está habilitada)
- **Claves por prefijo**

### Base de Datos
- **Conexiones activas**
- **Total de queries**
- **Queries lentos** (>1 segundo)
- **Estadísticas de tablas**
- **Tamaños de tablas**

### Sistema
- **Memoria heap** (MB)
- **Uptime** (horas)
- **CPU usage**
- **Versión de Node.js**
- **Plataforma**

## 🚨 Alertas Automáticas

### Tipos de Alertas
1. **slow_request**: Request > 5 segundos
2. **server_error**: Error 500+
3. **slow_query**: Query > 3 segundos
4. **connection_lost**: Desconexión de WebSocket

### Severidades
- **info**: Información general
- **warning**: Advertencia (amarillo)
- **error**: Error crítico (rojo)

## 🔍 Troubleshooting

### WebSocket no conecta
1. Verificar que el servidor esté corriendo
2. Verificar CORS en configuración
3. Verificar URL en el frontend

### Métricas no se actualizan
1. Verificar que Redis esté disponible
2. Verificar logs del servidor
3. Verificar conexión a base de datos

### Portal no carga
1. Verificar que `monitoring-portal.html` esté en la raíz
2. Verificar que Chart.js y Socket.IO estén disponibles
3. Verificar consola del navegador para errores

## 🎯 Casos de Uso

### Monitoreo de Producción
- **Dashboard 24/7** para supervisión
- **Alertas automáticas** para problemas
- **Métricas históricas** para análisis

### Desarrollo
- **Debugging** de performance
- **Optimización** de queries
- **Testing** de carga

### DevOps
- **Health checks** automáticos
- **Métricas** para escalado
- **Logs** para troubleshooting

## 📈 Próximas Mejoras

- [ ] **Persistencia** de métricas históricas
- [ ] **Gráficos** más avanzados
- [ ] **Notificaciones** por email/Slack
- [ ] **API** para integración externa
- [ ] **Métricas** de usuarios concurrentes
- [ ] **Dashboard** personalizable

---

**¡El sistema está listo para usar! 🚀**

Abre `monitoring-portal.html` en tu navegador y disfruta del monitoreo en tiempo real. 