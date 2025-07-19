# 📦 API de Stock Interno - Documentación Completa

## 🗄️ Estructura de Base de Datos

### Tabla: `stock_bodega_cantera`
Almacena el stock actual de productos y packs por local.

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `id` | SERIAL | ID único del registro | `1` |
| `codigo_producto` | VARCHAR(255) | Código del producto o pack | `"PROD001"` |
| `tipo_item` | VARCHAR(20) | Tipo: 'producto' o 'pack' | `"producto"` |
| `cantidad_actual` | INTEGER | Stock actual disponible | `150` |
| `cantidad_minima` | INTEGER | Stock mínimo para alertas | `10` |
| `id_local` | INTEGER | ID del local/sucursal | `1` |
| `created_at` | TIMESTAMP | Fecha de creación | `2024-01-15 10:30:00` |
| `updated_at` | TIMESTAMP | Última actualización | `2024-01-15 15:45:00` |

### Tabla: `stock_movimientos_cantera`
Historial completo de entradas y salidas de stock.

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `id` | SERIAL | ID único del movimiento | `1` |
| `codigo_producto` | VARCHAR(255) | Código del producto | `"PROD001"` |
| `tipo_item` | VARCHAR(20) | Tipo: 'producto' o 'pack' | `"producto"` |
| `tipo_movimiento` | VARCHAR(20) | 'entrada' o 'salida' | `"entrada"` |
| `cantidad` | INTEGER | Cantidad movida | `50` |
| `cantidad_anterior` | INTEGER | Stock antes del movimiento | `100` |
| `cantidad_nueva` | INTEGER | Stock después del movimiento | `150` |
| `motivo` | TEXT | Razón del movimiento | `"compra_proveedor"` |
| `id_usuario` | INTEGER | ID del usuario que realizó el movimiento | `1` |
| `id_local` | INTEGER | ID del local | `1` |
| `observaciones` | TEXT | Observaciones adicionales | `"Lote 2024-001"` |
| `created_at` | TIMESTAMP | Fecha y hora del movimiento | `2024-01-15 10:30:00` |

---

## 🚀 Endpoints Disponibles

### Base URL
```
https://tu-backend.com/api-beta/stock
```

---

## 📥 1. Entrada Individual de Stock

### Endpoint
```http
POST /api-beta/stock/entrada
```

### Payload
```json
{
  "codigo_producto": "PROD001",
  "tipo_item": "producto",
  "cantidad": 100,
  "cantidad_minima": 10,
  "motivo": "compra_proveedor",
  "id_local": 1,
  "id_usuario": 1,
  "observaciones": "Compra proveedor XYZ"
}
```

### Parámetros
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `codigo_producto` | string | ✅ | Código del producto o pack |
| `tipo_item` | string | ❌ | 'producto' o 'pack' (default: 'producto') |
| `cantidad` | number | ✅ | Cantidad a ingresar |
| `cantidad_minima` | number | ❌ | Stock mínimo para alertas |
| `motivo` | string | ✅ | Razón de la entrada |
| `id_local` | number | ✅ | ID del local |
| `id_usuario` | number | ✅ | ID del usuario |
| `observaciones` | string | ❌ | Observaciones adicionales |

### Respuesta Exitosa (200)
```json
{
  "success": true,
  "message": "✅ Entrada de stock registrada correctamente",
  "data": {
    "codigo_producto": "PROD001",
    "tipo_item": "producto",
    "cantidad_anterior": 50,
    "cantidad_nueva": 150,
    "cantidad_ingresada": 100,
    "motivo": "compra_proveedor",
    "id_local": 1,
    "id_usuario": 1,
    "observaciones": "Compra proveedor XYZ",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### Respuesta de Error (400/500)
```json
{
  "success": false,
  "error": "Stock insuficiente. Disponible: 50, Solicitado: 100",
  "details": "Error específico del servidor"
}
```

---

## 📤 2. Salida Individual de Stock

### Endpoint
```http
POST /api-beta/stock/salida
```

### Payload
```json
{
  "codigo_producto": "PROD001",
  "tipo_item": "producto",
  "cantidad": 20,
  "motivo": "reposicion_sala",
  "id_local": 1,
  "id_usuario": 1,
  "observaciones": "Reposición a sala de ventas"
}
```

### Parámetros
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `codigo_producto` | string | ✅ | Código del producto o pack |
| `tipo_item` | string | ❌ | 'producto' o 'pack' (default: 'producto') |
| `cantidad` | number | ✅ | Cantidad a retirar |
| `motivo` | string | ✅ | Razón de la salida |
| `id_local` | number | ✅ | ID del local |
| `id_usuario` | number | ✅ | ID del usuario |
| `observaciones` | string | ❌ | Observaciones adicionales |

### Respuesta Exitosa (200)
```json
{
  "success": true,
  "message": "✅ Salida de stock registrada correctamente",
  "data": {
    "codigo_producto": "PROD001",
    "tipo_item": "producto",
    "cantidad_anterior": 150,
    "cantidad_nueva": 130,
    "cantidad_retirada": 20,
    "motivo": "reposicion_sala",
    "id_local": 1,
    "id_usuario": 1,
    "observaciones": "Reposición a sala de ventas",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## 🛒 3. Entrada Múltiple (Tipo POS)

### Endpoint
```http
POST /api-beta/stock/entrada-multiple
```

### Payload
```json
{
  "productos": [
    {
      "codigo_producto": "PROD001",
      "tipo_item": "producto",
      "cantidad": 100,
      "cantidad_minima": 10
    },
    {
      "codigo_producto": "PACK001",
      "tipo_item": "pack",
      "cantidad": 50,
      "cantidad_minima": 5
    }
  ],
  "motivo": "compra_proveedor",
  "id_local": 1,
  "id_usuario": 1,
  "observaciones": "Compra mensual proveedor"
}
```

### Parámetros
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `productos` | array | ✅ | Array de productos a ingresar |
| `productos[].codigo_producto` | string | ✅ | Código del producto |
| `productos[].tipo_item` | string | ❌ | 'producto' o 'pack' |
| `productos[].cantidad` | number | ✅ | Cantidad a ingresar |
| `productos[].cantidad_minima` | number | ❌ | Stock mínimo |
| `motivo` | string | ✅ | Razón de la entrada |
| `id_local` | number | ✅ | ID del local |
| `id_usuario` | number | ✅ | ID del usuario |
| `observaciones` | string | ❌ | Observaciones adicionales |

### Respuesta Exitosa (200)
```json
{
  "success": true,
  "message": "✅ Entrada múltiple de stock registrada correctamente",
  "total_productos": 2,
  "resultados": [
    {
      "codigo_producto": "PROD001",
      "tipo_item": "producto",
      "cantidad": 100,
      "cantidad_nueva": 250,
      "success": true
    },
    {
      "codigo_producto": "PACK001",
      "tipo_item": "pack",
      "cantidad": 50,
      "cantidad_nueva": 150,
      "success": true
    }
  ],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Respuesta con Errores (400)
```json
{
  "success": false,
  "message": "Algunos productos no pudieron ser procesados",
  "resultados": [
    {
      "codigo_producto": "PROD001",
      "tipo_item": "producto",
      "cantidad": 100,
      "cantidad_nueva": 250,
      "success": true
    }
  ],
  "errores": [
    {
      "codigo_producto": "PROD002",
      "error": "Código de producto y cantidad son requeridos y cantidad debe ser > 0"
    }
  ]
}
```

---

## 🛒 4. Salida Múltiple (Tipo POS)

### Endpoint
```http
POST /api-beta/stock/salida-multiple
```

### Payload
```json
{
  "productos": [
    {
      "codigo_producto": "PROD001",
      "tipo_item": "producto",
      "cantidad": 20
    },
    {
      "codigo_producto": "PACK001",
      "tipo_item": "pack",
      "cantidad": 10
    }
  ],
  "motivo": "reposicion_sala",
  "id_local": 1,
  "id_usuario": 1,
  "observaciones": "Reposición múltiple a sala"
}
```

### Respuesta Exitosa (200)
```json
{
  "success": true,
  "message": "✅ Salida múltiple de stock registrada correctamente",
  "total_productos": 2,
  "resultados": [
    {
      "codigo_producto": "PROD001",
      "tipo_item": "producto",
      "cantidad": 20,
      "cantidad_nueva": 230,
      "success": true
    },
    {
      "codigo_producto": "PACK001",
      "tipo_item": "pack",
      "cantidad": 10,
      "cantidad_nueva": 140,
      "success": true
    }
  ],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 📊 5. Consultar Stock por Local

### Endpoint
```http
GET /api-beta/stock/local/{id_local}
```

### Parámetros URL
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id_local` | number | ID del local a consultar |

### Respuesta Exitosa (200)
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "codigo_producto": "PROD001",
      "tipo_item": "producto",
      "cantidad_actual": 230,
      "cantidad_minima": 10,
      "id_local": 1,
      "updated_at": "2024-01-15T10:30:00.000Z",
      "nombre_producto": "Producto Ejemplo",
      "codigo_barras": "123456789"
    },
    {
      "id": 2,
      "codigo_producto": "PACK001",
      "tipo_item": "pack",
      "cantidad_actual": 140,
      "cantidad_minima": 5,
      "id_local": 1,
      "updated_at": "2024-01-15T10:30:00.000Z",
      "nombre_producto": "Pack Ejemplo",
      "codigo_barras": "987654321"
    }
  ],
  "total_productos": 2,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## ⚠️ 6. Productos con Stock Bajo

### Endpoint
```http
GET /api-beta/stock/bajo-stock/{id_local}
```

### Respuesta Exitosa (200)
```json
{
  "success": true,
  "data": [
    {
      "id": 3,
      "codigo_producto": "PROD003",
      "tipo_item": "producto",
      "cantidad_actual": 5,
      "cantidad_minima": 10,
      "id_local": 1,
      "nombre_producto": "Producto Crítico",
      "codigo_barras": "111222333"
    }
  ],
  "total_alertas": 1,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 📈 7. Historial de Movimientos

### Endpoint
```http
GET /api-beta/stock/movimientos/{id_local}?limit=50&offset=0
```

### Parámetros Query
| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `limit` | number | 50 | Número máximo de registros |
| `offset` | number | 0 | Registros a saltar (paginación) |

### Respuesta Exitosa (200)
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "codigo_producto": "PROD001",
      "tipo_item": "producto",
      "tipo_movimiento": "entrada",
      "cantidad": 100,
      "cantidad_anterior": 150,
      "cantidad_nueva": 250,
      "motivo": "compra_proveedor",
      "id_usuario": 1,
      "id_local": 1,
      "observaciones": "Lote 2024-001",
      "created_at": "2024-01-15T10:30:00.000Z",
      "nombre_usuario": "Juan Pérez",
      "nombre_producto": "Producto Ejemplo"
    }
  ],
  "total_movimientos": 1,
  "limit": 50,
  "offset": 0,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 📊 8. Productos Más Movidos

### Endpoint
```http
GET /api-beta/stock/productos-movidos/{id_local}?tipo=mas&limit=10
```

### Parámetros Query
| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `tipo` | string | "mas" | "mas" o "menos" movidos |
| `limit` | number | 10 | Número máximo de productos |

### Respuesta Exitosa (200)
```json
{
  "success": true,
  "data": [
    {
      "codigo_producto": "PROD001",
      "tipo_item": "producto",
      "total_movimientos": 25,
      "total_entradas": 1500,
      "total_salidas": 1200,
      "nombre_producto": "Producto Más Movido"
    }
  ],
  "tipo_consulta": "mas",
  "total_productos": 1,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 📋 9. Reporte Completo de Stock

### Endpoint
```http
GET /api-beta/stock/reporte/{id_local}
```

### Respuesta Exitosa (200)
```json
{
  "success": true,
  "data": {
    "resumen": {
      "total_productos": 150,
      "total_packs": 25,
      "productos_stock_bajo": 5,
      "valor_total_estimado": 150000
    },
    "stock_actual": [
      {
        "codigo_producto": "PROD001",
        "tipo_item": "producto",
        "cantidad_actual": 230,
        "cantidad_minima": 10,
        "nombre_producto": "Producto Ejemplo",
        "estado": "normal"
      }
    ],
    "alertas_stock_bajo": [
      {
        "codigo_producto": "PROD003",
        "tipo_item": "producto",
        "cantidad_actual": 5,
        "cantidad_minima": 10,
        "nombre_producto": "Producto Crítico",
        "estado": "bajo"
      }
    ],
    "movimientos_recientes": [
      {
        "id": 1,
        "codigo_producto": "PROD001",
        "tipo_movimiento": "entrada",
        "cantidad": 100,
        "motivo": "compra_proveedor",
        "created_at": "2024-01-15T10:30:00.000Z"
      }
    ]
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 🔍 10. Consultar Stock de Producto Específico

### Endpoint
```http
GET /api-beta/stock/producto/{codigo_producto}?id_local=1
```

### Parámetros Query
| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `id_local` | number | ✅ | ID del local |

### Respuesta Exitosa (200)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "codigo_producto": "PROD001",
    "tipo_item": "producto",
    "cantidad_actual": 230,
    "cantidad_minima": 10,
    "id_local": 1,
    "updated_at": "2024-01-15T10:30:00.000Z",
    "nombre_producto": "Producto Ejemplo",
    "codigo_barras": "123456789",
    "estado": "normal"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 🏗️ 11. Inicializar Stock (Primera Vez)

### Endpoint
```http
POST /api-beta/stock/inicializar
```

### Payload
```json
{
  "productos": [
    {
      "codigo_producto": "PROD001",
      "tipo_item": "producto",
      "cantidad_inicial": 100,
      "cantidad_minima": 10
    }
  ],
  "id_local": 1,
  "id_usuario": 1,
  "observaciones": "Inicialización de stock"
}
```

### Respuesta Exitosa (200)
```json
{
  "success": true,
  "message": "✅ Stock inicializado correctamente",
  "total_productos": 1,
  "resultados": [
    {
      "codigo_producto": "PROD001",
      "tipo_item": "producto",
      "cantidad_inicial": 100,
      "cantidad_minima": 10,
      "success": true
    }
  ],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 📝 Códigos de Estado HTTP

| Código | Descripción |
|--------|-------------|
| `200` | ✅ Operación exitosa |
| `400` | ❌ Error en los datos enviados |
| `401` | ❌ No autorizado |
| `404` | ❌ Recurso no encontrado |
| `500` | ❌ Error interno del servidor |

---

## 🎯 Motivos de Movimiento Predefinidos

### Entradas
- `compra_proveedor` - Compra a proveedor
- `ajuste_inventario_positivo` - Ajuste positivo por conteo físico
- `traspaso_entrada` - Traspaso desde otro local

### Salidas
- `reposicion_sala` - Reposición a sala de ventas
- `merma_bodega` - Pérdida por merma en bodega
- `traspaso_salida` - Traspaso a otro local
- `ajuste_inventario_negativo` - Ajuste negativo por conteo físico

---

## 🔧 Características Especiales

### ✅ Flexibilidad Total
- Funciona con cualquier código de producto
- No requiere que el producto exista en tablas específicas
- Crea registros temporales si no encuentra el producto

### ✅ Sistema de Packs
- Los packs automáticamente actualizan productos individuales
- Descompone packs según `cantidad_articulo` en `pack_listados`

### ✅ Validaciones
- Previene stock negativo
- Valida datos requeridos
- Rollback automático en errores

### ✅ Auditoría Completa
- Historial de todos los movimientos
- Usuario que realizó cada operación
- Timestamps precisos

### ✅ Sistema Tipo POS
- Múltiples productos en una transacción
- Respuestas detalladas con éxitos y errores
- Rollback automático si algún producto falla

---

## 🚀 Ejemplos de Uso Frontend

### React/JavaScript
```javascript
// Entrada múltiple de stock
const entradaMultiple = async (productos) => {
  try {
    const response = await fetch('/api-beta/stock/entrada-multiple', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        productos: productos,
        motivo: 'compra_proveedor',
        id_local: 1,
        id_usuario: 1,
        observaciones: 'Compra mensual proveedor'
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Entrada exitosa:', data.resultados);
    } else {
      console.error('❌ Errores:', data.errores);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

// Consultar stock
const consultarStock = async (idLocal) => {
  try {
    const response = await fetch(`/api-beta/stock/local/${idLocal}`);
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Vue.js
```javascript
// Salida múltiple de stock
async salidaMultiple() {
  try {
    const response = await this.$http.post('/api-beta/stock/salida-multiple', {
      productos: this.productosSeleccionados,
      motivo: 'reposicion_sala',
      id_local: this.idLocal,
      id_usuario: this.idUsuario,
      observaciones: 'Reposición POS'
    });
    
    if (response.data.success) {
      this.$toast.success('Salida registrada correctamente');
      this.actualizarStock();
    } else {
      this.$toast.error('Errores en algunos productos');
    }
  } catch (error) {
    this.$toast.error('Error en el servidor');
  }
}
```

---

## 📞 Soporte

Para dudas o problemas con la API de stock interno, contacta al equipo de desarrollo.

**Versión:** 1.0.0  
**Última actualización:** Enero 2024 