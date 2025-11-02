# 📋 Cambios en Endpoint `/api-beta/nominas-gastos`

## 🆕 Cambios Implementados

### 1. **Estructura de Respuesta - Campo Nuevo: `tipo`**

Ahora el endpoint retorna **dos tipos de registros** combinados:

#### Nóminas Generadas (`tipo: "nomina_generada"`)
Estas son las nóminas ya generadas y reembolsadas (existente).

#### Rendiciones Activas (`tipo: "rendicion_activa"`)
Estas son las rendiciones activas que **aún no tienen nómina generada**.

### 2. **Campos en Cada Tipo de Registro**

#### Para Nóminas Generadas (`tipo: "nomina_generada"`)
```json
{
  "id": "nom_12345678_1",              // ID de la nómina
  "rendicion_id": "rend_xxx",           // ID de la rendición asociada
  "usuario_id": 1,
  "nombre_usuario": "Juan Pérez",
  "monto_total_rendicion": 500000,
  "cantidad_gastos": 5,
  "estado": "generada" | "reembolsada" | "pendiente",
  "observaciones": "...",
  "fecha_creacion": "2024-01-15T10:30:00",
  "fecha_reembolso": "2024-01-20T15:00:00",
  "fecha_reinicio_ciclo": null,
  "observaciones_reinicio": null,
  "tipo": "nomina_generada",            // ⭐ NUEVO CAMPO
  "locales_afectados": [
    {
      "local_id": 1,
      "nombre_local": "Local Centro",
      "monto_local": 300000,
      "cantidad_gastos": 3
    }
  ]
}
```

#### Para Rendiciones Activas (`tipo: "rendicion_activa"`)
```json
{
  "id": "rend_12345678_1",              // ID de la rendición (mismo que rendicion_id)
  "rendicion_id": "rend_12345678_1",    // ID de la rendición
  "usuario_id": 1,
  "nombre_usuario": "Juan Pérez",
  "monto_total_rendicion": 250000,      // Calculado: monto_inicial - monto_final
  "cantidad_gastos": 3,
  "estado": "activa",                   // Siempre "activa"
  "observaciones": null,
  "fecha_creacion": "2024-01-10T08:00:00", // fecha_inicio de la rendición
  "fecha_reembolso": null,              // ⚠️ Siempre null
  "fecha_reinicio_ciclo": null,         // ⚠️ Siempre null
  "observaciones_reinicio": null,       // ⚠️ Siempre null
  "tipo": "rendicion_activa",           // ⭐ NUEVO CAMPO
  "locales_afectados": [
    {
      "local_id": 1,
      "nombre_local": "Local Centro",
      "monto_local": 150000,
      "cantidad_gastos": 2
    }
  ]
}
```

### 3. **Filtro por Estado Actualizado**

Ahora puedes filtrar por estado `'activa'` para obtener solo rendiciones activas:

```javascript
// Obtener solo rendiciones activas
GET /api-beta/nominas-gastos?estado=activa

// Obtener solo nóminas generadas (cualquier estado excepto 'activa')
GET /api-beta/nominas-gastos?estado=reembolsada
```

**Estados válidos actualizados:**
- `'activa'` - Solo rendiciones activas
- `'reembolsada'` - Solo nóminas reembolsadas

Si no se especifica `estado`, retorna **ambos tipos** (nóminas + rendiciones activas).

### 4. **Estructura de Respuesta Completa (sin cambios en estructura general)**

```json
{
  "success": true,
  "data": [
    // ... array de nóminas y rendiciones activas
  ],
  "meta": {
    "pagina": 1,
    "limite": 20,
    "total": 45,                    // Suma de nóminas + rendiciones activas
    "totalPaginas": 3,
    "tieneSiguiente": true,
    "tieneAnterior": false
  },
  "estadisticas": {                // Solo si include_stats=true
    // ... estadísticas históricas (igual que antes)
  }
}
```

## 🔄 Cambios Requeridos en Frontend

### 1. **Manejar el Campo `tipo`**

```typescript
interface NominaRendicion {
  id: string;
  rendicion_id: string;
  usuario_id: number;
  nombre_usuario: string;
  monto_total_rendicion: number;
  cantidad_gastos: number;
  estado: 'activa' | 'generada' | 'reembolsada' | 'pendiente';
  tipo: 'nomina_generada' | 'rendicion_activa'; // ⭐ NUEVO
  fecha_creacion: string;
  fecha_reembolso: string | null;
  fecha_reinicio_ciclo: string | null;
  observaciones_reinicio: string | null;
  locales_afectados: Array<{
    local_id: number;
    nombre_local: string;
    monto_local: number;
    cantidad_gastos: number;
  }>;
}

// Ejemplo de uso
const items: NominaRendicion[] = response.data;

items.forEach(item => {
  if (item.tipo === 'rendicion_activa') {
    // Es una rendición activa - no tiene fecha_reembolso
    console.log('Rendición activa:', item.id);
  } else {
    // Es una nómina generada - puede tener fecha_reembolso
    console.log('Nómina generada:', item.id);
  }
});
```

### 2. **Filtrar por Tipo en el Frontend**

```typescript
// Obtener solo rendiciones activas
const rendicionesActivas = items.filter(item => item.tipo === 'rendicion_activa');

// Obtener solo nóminas generadas
const nominasGeneradas = items.filter(item => item.tipo === 'nomina_generada');
```

### 3. **UI/UX - Diferenciar Visualmente**

```typescript
// Ejemplo de componente
function NominaCard({ item }: { item: NominaRendicion }) {
  const isActiva = item.tipo === 'rendicion_activa';
  
  return (
    <div className={isActiva ? 'card-activa' : 'card-generada'}>
      <Badge variant={isActiva ? 'info' : 'success'}>
        {isActiva ? 'Rendición Activa' : 'Nómina Generada'}
      </Badge>
      {/* ... resto del contenido */}
    </div>
  );
}
```

## 📊 Estadísticas - Implementado

Se implementó soporte para **dos tipos de estadísticas**:

1. **Estadísticas Históricas** - Basadas en nóminas generadas (default)
2. **Estadísticas Activas** - Basadas en rendiciones activas por local (nuevo)

### Uso del Parámetro `stats_tipo`

```javascript
// Estadísticas históricas (default)
GET /api-beta/nominas-gastos?include_stats=true&stats_tipo=historicas

// Solo estadísticas activas por local
GET /api-beta/nominas-gastos?include_stats=true&stats_tipo=activas

// Ambas estadísticas
GET /api-beta/nominas-gastos?include_stats=true&stats_tipo=ambas
```

### Estructura de Respuesta con Estadísticas

#### Con `stats_tipo=historicas` (default):
```json
{
  "success": true,
  "data": [...],
  "meta": {...},
  "estadisticas": {
    "contexto": "general",
    "total_gastado": 1500000,
    "total_gastos": 25,
    "promedio_gasto": 60000,
    "top_usuarios": [...],
    "top_locales": [...],
    "por_categoria": [...]
  }
}
```

#### Con `stats_tipo=activas`:
```json
{
  "success": true,
  "data": [...],
  "meta": {...},
  "estadisticas_activas": {
    "contexto": "activas_por_local",
    "por_local": [
      {
        "local_id": 1,
        "nombre_local": "Local Centro",
        "total_rendiciones_activas": 3,
        "total_usuarios_activos": 2,
        "monto_total_utilizado": 750000,
        "total_gastos_registrados": 15,
        "promedio_por_rendicion": 250000,
        "rendiciones": [
          {
            "rendicion_id": "rend_xxx",
            "usuario_id": 1,
            "nombre_usuario": "Juan Pérez",
            "monto_utilizado": 300000,
            "cantidad_gastos": 5,
            "fecha_inicio": "2024-01-10T08:00:00"
          }
        ]
      }
    ],
    "resumen": {
      "total_rendiciones_activas": 5,
      "total_usuarios_activos": 3,
      "monto_total_utilizado": 1250000,
      "total_gastos_registrados": 30,
      "promedio_por_rendicion": 250000
    }
  }
}
```

#### Con `stats_tipo=ambas`:
```json
{
  "success": true,
  "data": [...],
  "meta": {...},
  "estadisticas_historicas": {...},
  "estadisticas_activas": {...}
}
```

