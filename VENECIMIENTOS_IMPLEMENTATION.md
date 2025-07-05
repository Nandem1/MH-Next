# Implementación de Vencimientos en Cartelería

## Resumen

Se ha implementado la funcionalidad de vencimientos para las tarjetas de cartelería, manteniendo el diseño existente y agregando una nueva sección que muestra información de fechas de vencimiento de los artículos. Los vencimientos se obtienen del mismo endpoint de auditoría de cartelería para optimizar el rendimiento.

## Cambios Realizados

### 1. Tipos de Datos (`src/types/carteleria.d.ts`)

- Agregado array `fechas_vencimiento` en la interfaz `Carteleria`:
  ```typescript
  fechas_vencimiento?: Array<{
    fecha_vencimiento: string;
    cantidad: number;
    lote?: string | null;
  }>;
  ```

- Mantenida interfaz `Vencimiento` para futuras expansiones

### 2. Servicio (`src/services/carteleriaService.ts`)

- Mantenida la función `getAuditoriaCarteleria()` existente
- Los vencimientos se obtienen automáticamente con la respuesta de auditoría

### 3. Componente (`src/components/dashboard/VencimientosSection.tsx`)

- Componente reutilizable que muestra la información de vencimientos
- Recibe el array `fechas_vencimiento` como prop
- Características:
  - **Expandible**: Se puede expandir/contraer para ver detalles
  - **Indicadores visuales**: Chips de colores para diferentes estados
  - **Cálculo automático**: Días hasta vencimiento y estado (vencido, próximo, ok)
  - **Resumen**: Muestra número de lotes, unidades totales y alertas
  - **Múltiples vencimientos**: Maneja múltiples fechas de vencimiento por producto

### 4. Integración en Tarjeta (`src/components/dashboard/CarteleriaCard.tsx`)

- Agregado `VencimientosSection` a la tarjeta existente
- Mantiene el diseño original sin cambios significativos
- Sección ubicada entre los precios de lista y la información de actualización
- Pasa el array `fechas_vencimiento` desde los datos de cartelería

## Estructura de Base de Datos

La implementación está diseñada para trabajar con la tabla:

```sql
CREATE TABLE control_vencimientos_cantera (
    id SERIAL PRIMARY KEY,
    codigo_barras VARCHAR(50) NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    cantidad INT DEFAULT 1,
    lote VARCHAR(50),
    UNIQUE(codigo_barras, fecha_vencimiento, lote)
);
```

## Estructura de Respuesta del Backend

El endpoint `/api-beta/auditoria-carteleria` debe incluir el array `fechas_vencimiento` en cada objeto de cartelería:

```json
[
  {
    "carteleria_id": 3,
    "codigo_barras": "7802900414016",
    "tipo_carteleria": "GONDOLA",
    "producto": "DULCE DE LECHE ",
    "descripcion": "SOPROLE 500GR",
    "carteleria_precio_detalle": 2590,
    "carteleria_precio_mayorista": 2290,
    "origen": "producto",
    "codigo_producto": "A003762",
    "nombre_producto": "MANJAR SOPROLE DULCE DE LECHE EN BOLSA 500 GR - 000414-001",
    "lista_precio_detalle": 2590,
    "lista_precio_mayorista": 2290,
    "lista_updated_at": "2025-07-04T22:10:35.960Z",
    "fechas_vencimiento": [
      {
        "fecha_vencimiento": "2025-07-26",
        "cantidad": 5,
        "lote": null
      },
      {
        "fecha_vencimiento": "2025-09-13",
        "cantidad": 20,
        "lote": null
      }
    ]
  }
]
```

### Query SQL Sugerida para el Backend

```sql
SELECT 
    c.*,
    COALESCE(
        json_agg(
            json_build_object(
                'fecha_vencimiento', vc.fecha_vencimiento,
                'cantidad', vc.cantidad,
                'lote', vc.lote
            )
        ) FILTER (WHERE vc.id IS NOT NULL),
        '[]'::json
    ) as fechas_vencimiento
FROM carteleria c
LEFT JOIN control_vencimientos_cantera vc ON c.codigo_barras = vc.codigo_barras
GROUP BY c.carteleria_id, c.codigo_barras, c.tipo_carteleria, /* ... otros campos ... */
ORDER BY c.carteleria_id;
```

## Características de la UI

### Estados de Vencimiento
- **Vencido** (rojo): Productos que ya vencieron
- **Próximo** (amarillo): Productos que vencen en 30 días o menos
- **OK** (verde): Productos con más de 30 días hasta vencimiento

### Información Mostrada
- Número total de lotes
- Cantidad total de unidades
- Fechas de vencimiento individuales
- Números de lote (si están disponibles)
- Días hasta vencimiento o días vencidos
- Estado visual con chips de colores

### Interactividad
- Sección expandible/contraíble
- Indicadores visuales inmediatos
- Carga instantánea (sin llamadas adicionales a la API)
- Manejo de múltiples vencimientos por producto

## Ventajas de esta Implementación

1. **Mejor Rendimiento**: Una sola llamada a la API
2. **Menos Complejidad**: Eliminación de hooks y endpoints adicionales
3. **Mejor UX**: Carga instantánea de vencimientos sin estados de loading
4. **Menos Código**: Reducción significativa de archivos y líneas de código
5. **Mejor Mantenibilidad**: Lógica centralizada en un solo endpoint
6. **Compatibilidad**: Funciona con la estructura actual del backend
7. **Flexibilidad**: Maneja múltiples vencimientos por producto

## Próximos Pasos

1. **Verificar Backend**: Confirmar que el endpoint incluya el array `fechas_vencimiento`
2. **Optimizaciones**:
   - Agregar filtros por fecha de vencimiento
   - Implementar búsqueda por lote
   - Ordenar vencimientos por fecha

3. **Funcionalidades Adicionales**:
   - Exportar reportes de vencimientos
   - Alertas automáticas para productos próximos a vencer
   - Historial de vencimientos

## Uso

La funcionalidad se activa automáticamente en todas las tarjetas de cartelería cuando el backend incluya el array `fechas_vencimiento` en la respuesta. Los vencimientos se muestran inmediatamente sin necesidad de cargas adicionales.

### Campos Requeridos en el Backend
- `fechas_vencimiento`: Array de objetos con:
  - `fecha_vencimiento`: Fecha de vencimiento (formato ISO string)
  - `cantidad`: Cantidad de unidades (número)
  - `lote`: Número de lote (opcional, string o null) 