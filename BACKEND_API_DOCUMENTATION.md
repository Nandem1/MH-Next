# Documentación Simplificada de APIs - Sistema de Rinde Gastos

## Resumen Ejecutivo

Este documento especifica las APIs REST simplificadas necesarias para soportar el frontend del sistema de Rinde Gastos. Se ha simplificado la arquitectura eliminando funcionalidades complejas y enfocándose en lo esencial.

### Características Implementadas
- ✅ Gestión básica de gastos (CRUD simple)
- ✅ 37 cuentas contables con 4 categorías más utilizadas hardcodeadas
- ✅ Estadísticas monetarias por categoría
- ✅ Interface simplificada y funcional

## Arquitectura Propuesta

### Base URL
```
https://api.tu-dominio.com/v1
```

### Autenticación
- **Método**: Bearer Token (JWT)
- **Header**: `Authorization: Bearer <token>`

## 1. API de Cuentas Contables (Simplificada)

### 1.1 Obtener Todas las Cuentas Contables

**Endpoint**: `GET /cuentas-contables`

**Descripción**: Retorna todas las cuentas contables con las más utilizadas marcadas.

**Headers**:
```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "17",
      "nombre": "MANTENCION Y REPARACION",
      "categoria": "GASTOS_OPERACIONALES",
      "esMasUtilizada": true
    },
    {
      "id": "16",
      "nombre": "SERVICIOS BASICOS",
      "categoria": "GASTOS_OPERACIONALES",
      "esMasUtilizada": true
    },
    {
      "id": "20",
      "nombre": "COMBUSTIBLES Y LUBRICANTES",
      "categoria": "GASTOS_OPERACIONALES",
      "esMasUtilizada": true
    },
    {
      "id": "21",
      "nombre": "REMUNERACIONES",
      "categoria": "GASTOS_OPERACIONALES",
      "esMasUtilizada": true
    },
    {
      "id": "1",
      "nombre": "MAQUINARIAS Y EQUIPOS",
      "categoria": "ACTIVOS",
      "esMasUtilizada": false
    }
  ],
  "meta": {
    "total": 37,
    "masUtilizadas": 4
  }
}
```

### 1.2 Obtener Cuentas Más Utilizadas

**Endpoint**: `GET /cuentas-contables/mas-utilizadas`

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "17",
      "nombre": "MANTENCION Y REPARACION",
      "categoria": "GASTOS_OPERACIONALES"
    },
    {
      "id": "16",
      "nombre": "SERVICIOS BASICOS",
      "categoria": "GASTOS_OPERACIONALES"
    },
    {
      "id": "20",
      "nombre": "COMBUSTIBLES Y LUBRICANTES",
      "categoria": "GASTOS_OPERACIONALES"
    },
    {
      "id": "21",
      "nombre": "REMUNERACIONES",
      "categoria": "GASTOS_OPERACIONALES"
    }
  ]
}
```

## 2. API de Gastos (Simplificada)

### 2.1 Crear Gasto

**Endpoint**: `POST /gastos`

**Request Body**:
```json
{
  "descripcion": "Compra de combustible",
  "monto": 50000,
  "fecha": "2024-01-15",
  "categoria": "COMBUSTIBLES Y LUBRICANTES",
  "cuentaContableId": "20",
  "comprobante": "https://example.com/comprobante.pdf",
  "observaciones": "Tanque lleno"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "gasto_1705123456789_abc123def",
    "descripcion": "Compra de combustible",
    "monto": 50000,
    "fecha": "2024-01-15",
    "categoria": "COMBUSTIBLES Y LUBRICANTES",
    "cuentaContableId": "20",
    "estado": "pendiente",
    "fechaCreacion": "2024-01-15T10:30:00Z",
    "comprobante": "https://example.com/comprobante.pdf",
    "observaciones": "Tanque lleno",
    "usuarioId": "usuario_actual",
    "nombreUsuario": "Usuario Actual"
  }
}
```

### 2.2 Obtener Gastos

**Endpoint**: `GET /gastos`

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "gasto_1705123456789_abc123def",
      "descripcion": "Compra de combustible",
      "monto": 50000,
      "fecha": "2024-01-15",
      "categoria": "COMBUSTIBLES Y LUBRICANTES",
      "estado": "aprobado",
      "fechaCreacion": "2024-01-15T10:30:00Z"
    }
  ],
  "meta": {
    "total": 1
  }
}
```

### 2.3 Obtener Gasto por ID

**Endpoint**: `GET /gastos/{id}`

**Response**: Mismo formato que crear gasto

### 2.4 Eliminar Gasto

**Endpoint**: `DELETE /gastos/{id}`

**Response**:
```json
{
  "success": true,
  "message": "Gasto eliminado correctamente"
}
```

## 3. API de Estadísticas (Simplificada)

### 3.1 Estadísticas Monetarias por Categoría

**Endpoint**: `GET /estadisticas/categorias-monetarias`

**Descripción**: Retorna el total gastado por cada categoría (calculado desde los gastos aprobados).

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "categoria": "COMBUSTIBLES Y LUBRICANTES",
      "totalGasto": 450000,
      "cantidadGastos": 8,
      "porcentaje": 45.5
    },
    {
      "categoria": "SERVICIOS BASICOS",
      "totalGasto": 280000,
      "cantidadGastos": 4,
      "porcentaje": 28.3
    },
    {
      "categoria": "MANTENCION Y REPARACION",
      "totalGasto": 180000,
      "cantidadGastos": 3,
      "porcentaje": 18.2
    },
    {
      "categoria": "REMUNERACIONES",
      "totalGasto": 80000,
      "cantidadGastos": 2,
      "porcentaje": 8.0
    }
  ],
  "meta": {
    "totalGeneral": 990000,
    "totalGastos": 17
  }
}
```

## 4. Estructura de Base de Datos Simplificada

### Tabla: cuentas_contables
```sql
CREATE TABLE cuentas_contables (
    id VARCHAR(36) PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    categoria ENUM('ACTIVOS', 'GASTOS_OPERACIONALES', 'GASTOS_GENERALES', 'OTROS'),
    es_mas_utilizada BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabla: gastos
```sql
CREATE TABLE gastos (
    id VARCHAR(36) PRIMARY KEY,
    descripcion TEXT NOT NULL,
    monto DECIMAL(15,2) NOT NULL,
    fecha DATE NOT NULL,
    categoria VARCHAR(255),
    cuenta_contable_id VARCHAR(36),
    usuario_id VARCHAR(36) NOT NULL,
    comprobante VARCHAR(500),
    observaciones TEXT,
    estado ENUM('pendiente', 'aprobado', 'rechazado') DEFAULT 'pendiente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cuenta_contable_id) REFERENCES cuentas_contables(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
```

## 5. Datos Iniciales (Seed Data)

### Cuentas Contables Más Utilizadas
```sql
-- Marcar las 4 cuentas más utilizadas
UPDATE cuentas_contables SET es_mas_utilizada = TRUE 
WHERE nombre IN (
    'MANTENCION Y REPARACION',
    'SERVICIOS BASICOS', 
    'COMBUSTIBLES Y LUBRICANTES',
    'REMUNERACIONES'
);
```

## 6. Consideraciones de Implementación

### 6.1 Performance
- **Índices recomendados**:
  - `gastos(usuario_id, estado, fecha)`
  - `gastos(categoria, estado)`
  - `cuentas_contables(es_mas_utilizada)`

### 6.2 Validaciones
- Validar montos positivos (máximo $10.000.000)
- Validar fechas no futuras
- Validar que la cuenta contable existe
- Validar descripción no vacía

### 6.3 Reglas de Negocio
- Solo gastos con estado 'aprobado' cuentan para el saldo
- Las 4 cuentas más utilizadas están hardcodeadas
- Las estadísticas son puramente monetarias

## 7. Códigos de Error Estándar

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Los datos proporcionados no son válidos",
    "details": [
      {
        "field": "monto",
        "message": "El monto debe ser mayor a 0"
      }
    ]
  }
}
```

### Códigos de Error:
- `VALIDATION_ERROR` (400): Errores de validación
- `UNAUTHORIZED` (401): Token inválido
- `NOT_FOUND` (404): Recurso no encontrado
- `INTERNAL_ERROR` (500): Error interno del servidor

## 8. Ejemplos de Integración Frontend

### 8.1 Crear gasto con cuenta más utilizada
```typescript
const crearGasto = async (gastoData: any) => {
  const response = await fetch('/api/v1/gastos', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      descripcion: gastoData.descripcion,
      monto: gastoData.monto,
      fecha: gastoData.fecha,
      categoria: gastoData.categoria,
      cuentaContableId: gastoData.cuentaContableId,
      observaciones: gastoData.observaciones
    })
  });
  
  return response.json();
};
```

### 8.2 Obtener estadísticas monetarias
```typescript
const obtenerEstadisticas = async () => {
  const response = await fetch('/api/v1/estadisticas/categorias-monetarias', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  return data.data; // Array de estadísticas por categoría
};
```

## 9. Variables de Entorno

```env
# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=rinde_gastos
DB_USER=usuario
DB_PASSWORD=password

# JWT
JWT_SECRET=tu_jwt_secret_muy_seguro
JWT_EXPIRES_IN=24h

# Limits
MAX_GASTO_AMOUNT=10000000
```

---

**Fecha**: Enero 2024  
**Versión**: 2.1 (Simplificada)  
**Autor**: Sistema de Gestión MH-Next  
**Estado**: ✅ Frontend Implementado - Backend Simplificado

### 📋 Checklist de Implementación Backend Simplificado
- [ ] Configurar base de datos (2 tablas principales)
- [ ] Implementar autenticación JWT básica
- [ ] Crear endpoints de gastos (4 endpoints)
- [ ] Crear endpoints de cuentas contables (2 endpoints)
- [ ] Crear endpoint de estadísticas monetarias (1 endpoint)
- [ ] Insertar datos iniciales de cuentas contables
- [ ] Configurar validaciones básicas
- [ ] Testing de APIs

**Total de endpoints requeridos: 7** (vs 25+ en la versión compleja)

Esta documentación refleja la implementación simplificada y funcional del sistema, eliminando complejidades innecesarias y enfocándose en las funcionalidades core requeridas.