# 📋 API de Nóminas de Gastos - Documentación Frontend

## 🎯 **Descripción General**

API para gestionar nóminas de gastos con filtros avanzados y estadísticas contextuales. Las nóminas se generan automáticamente al reiniciar ciclos de rendición.

---

## 🔗 **Endpoints Disponibles**

### 1. **GET** `/api-beta/nominas-gastos`
**Obtener nóminas con filtros y estadísticas**

#### **Parámetros de Query:**

| Parámetro | Tipo | Requerido | Descripción | Ejemplo |
|-----------|------|-----------|-------------|---------|
| `usuario_id` | `integer` | No | Filtrar por ID de usuario | `?usuario_id=123` |
| `local_id` | `integer` | No | Filtrar por ID de local | `?local_id=456` |
| `estado` | `string` | No | Estado de la nómina | `?estado=generada` |
| `fecha_desde` | `date` | No | Fecha inicio (YYYY-MM-DD) | `?fecha_desde=2024-01-01` |
| `fecha_hasta` | `date` | No | Fecha fin (YYYY-MM-DD) | `?fecha_hasta=2024-12-31` |
| `monto_min` | `number` | No | Monto mínimo | `?monto_min=100.50` |
| `monto_max` | `number` | No | Monto máximo | `?monto_max=5000.00` |
| `pagina` | `integer` | No | Página (default: 1) | `?pagina=2` |
| `limite` | `integer` | No | Límite por página (default: 20, max: 100) | `?limite=50` |
| `include_stats` | `boolean` | No | Incluir estadísticas (default: false) | `?include_stats=true` |

#### **Estados Válidos:**
- `generada` - Nómina generada
- `reembolsada` - Nómina reembolsada  
- `pendiente` - Nómina pendiente

#### **Ejemplo de Request:**
```bash
GET /api-beta/nominas-gastos?usuario_id=123&local_id=456&include_stats=true&pagina=1&limite=20
```

#### **Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "usuario_id": 123,
      "nombre_usuario": "Juan Pérez",
      "monto_total_rendicion": 2500.75,
      "cantidad_gastos": 15,
      "estado": "generada",
      "observaciones": "Nómina del ciclo enero 2024",
      "fecha_creacion": "2024-01-15T10:30:00.000Z",
      "fecha_reembolso": null,
      "fecha_reinicio_ciclo": "2024-01-01T00:00:00.000Z",
      "observaciones_reinicio": "Inicio de nuevo ciclo",
      "locales_afectados": [
        {
          "local_id": 456,
          "nombre_local": "Local Centro"
        },
        {
          "local_id": 789,
          "nombre_local": "Local Norte"
        }
      ]
    }
  ],
  "meta": {
    "pagina": 1,
    "limite": 20,
    "total": 45,
    "totalPaginas": 3,
    "tieneSiguiente": true,
    "tieneAnterior": false
  },
  "estadisticas": {
    "contexto": "usuario_local",
    "total_gastado": 2500.75,
    "total_gastos": 15,
    "promedio_gasto": 166.72,
    "primera_fecha": "2024-01-01",
    "ultima_fecha": "2024-01-14",
    "top_usuarios": [
      {
        "usuario_id": 123,
        "nombre_usuario": "Juan Pérez",
        "total_gastado": 2500.75
      }
    ],
    "top_locales": [
      {
        "local_id": 456,
        "nombre_local": "Local Centro",
        "total_gastado": 1800.50
      }
    ],
    "por_categoria": [
      {
        "categoria_principal": "GASTOS_OPERATIVOS",
        "categoria_nombre": "Gastos Operativos",
        "total_gastado": 1200.00,
        "cantidad_gastos": 8,
        "porcentaje": 48.0,
        "subcategorias_top": [
          {
            "subcategoria": "Combustible",
            "total": 800.00,
            "cantidad": 5
          },
          {
            "subcategoria": "Alimentación",
            "total": 400.00,
            "cantidad": 3
          }
        ]
      }
    ]
  }
}
```

---

### 2. **GET** `/api-beta/nominas-gastos/:id`
**Obtener detalle de una nómina específica**

#### **Parámetros de Path:**
| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `id` | `integer` | Sí | ID de la nómina |

#### **Ejemplo de Request:**
```bash
GET /api-beta/nominas-gastos/123
```

#### **Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "id": 123,
    "usuario_id": 456,
    "nombre_usuario": "María García",
    "monto_total_rendicion": 3200.50,
    "cantidad_gastos": 22,
    "estado": "reembolsada",
    "observaciones": "Nómina completada y reembolsada",
    "fecha_creacion": "2024-01-15T10:30:00.000Z",
    "fecha_reembolso": "2024-01-20T14:15:00.000Z",
    "fecha_reinicio_ciclo": "2024-01-01T00:00:00.000Z",
    "observaciones_reinicio": "Inicio de nuevo ciclo",
    "gastos_incluidos": [
      {
        "id": 1001,
        "descripcion": "Combustible para vehículo",
        "monto": 150.00,
        "fecha": "2024-01-10",
        "local_asignado_id": 789,
        "local_nombre": "Local Norte",
        "cuenta_contable_id": 5,
        "cuenta_contable_nombre": "Combustible",
        "comprobante": "factura_001.pdf"
      },
      {
        "id": 1002,
        "descripcion": "Almuerzo de trabajo",
        "monto": 85.50,
        "fecha": "2024-01-12",
        "local_asignado_id": 456,
        "local_nombre": "Local Centro",
        "cuenta_contable_id": 8,
        "cuenta_contable_nombre": "Alimentación",
        "comprobante": "recibo_002.jpg"
      }
    ]
  }
}
```

---

## ⚠️ **Respuestas de Error**

### **Error de Validación (400):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "El ID de usuario debe ser un número entero positivo"
  }
}
```

### **Nómina No Encontrada (404):**
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Nómina no encontrada"
  }
}
```

### **Error Interno (500):**
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Error interno del servidor",
    "details": "Detalles del error (solo en desarrollo)"
  }
}
```

---

## 🔐 **Autenticación**

Todos los endpoints requieren autenticación JWT:
```bash
Authorization: Bearer <token>
```

---

## 📊 **Contextos de Estadísticas**

Las estadísticas se adaptan según los filtros aplicados:

| Filtros Aplicados | Contexto | Descripción |
|-------------------|----------|-------------|
| Sin filtros | `general` | Estadísticas globales del sistema |
| Solo `usuario_id` | `usuario` | Estadísticas del usuario específico |
| Solo `local_id` | `local` | Estadísticas del local específico |
| `usuario_id` + `local_id` | `usuario_local` | Estadísticas del usuario en el local específico |

---

## 🎨 **Casos de Uso Frontend**

### **1. Vista General de Nóminas**
```javascript
// Obtener todas las nóminas con estadísticas
const response = await fetch('/api-beta/nominas-gastos?include_stats=true');
```

### **2. Filtro por Usuario**
```javascript
// Nóminas de un usuario específico
const response = await fetch('/api-beta/nominas-gastos?usuario_id=123&include_stats=true');
```

### **3. Filtro por Local**
```javascript
// Nóminas de un local específico
const response = await fetch('/api-beta/nominas-gastos?local_id=456&include_stats=true');
```

### **4. Filtro Combinado**
```javascript
// Nóminas de un usuario en un local específico
const response = await fetch('/api-beta/nominas-gastos?usuario_id=123&local_id=456&include_stats=true');
```

### **5. Filtro por Rango de Fechas**
```javascript
// Nóminas del último mes
const fechaDesde = new Date();
fechaDesde.setMonth(fechaDesde.getMonth() - 1);
const response = await fetch(`/api-beta/nominas-gastos?fecha_desde=${fechaDesde.toISOString().split('T')[0]}&include_stats=true`);
```

### **6. Paginación**
```javascript
// Segunda página con 50 elementos
const response = await fetch('/api-beta/nominas-gastos?pagina=2&limite=50');
```

---

## 🚀 **Implementación Recomendada**

### **Componente React Ejemplo:**
```jsx
import React, { useState, useEffect } from 'react';

const NominasGastos = () => {
  const [nominas, setNominas] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [filtros, setFiltros] = useState({
    usuario_id: '',
    local_id: '',
    estado: '',
    fecha_desde: '',
    fecha_hasta: '',
    monto_min: '',
    monto_max: ''
  });
  const [paginacion, setPaginacion] = useState({
    pagina: 1,
    limite: 20
  });

  const cargarNominas = async () => {
    try {
      const params = new URLSearchParams({
        ...filtros,
        ...paginacion,
        include_stats: 'true'
      });

      const response = await fetch(`/api-beta/nominas-gastos?${params}`);
      const data = await response.json();

      if (data.success) {
        setNominas(data.data);
        setEstadisticas(data.estadisticas);
        setPaginacion(data.meta);
      }
    } catch (error) {
      console.error('Error cargando nóminas:', error);
    }
  };

  useEffect(() => {
    cargarNominas();
  }, [filtros, paginacion.pagina]);

  return (
    <div>
      {/* Filtros */}
      <div className="filtros">
        <input 
          type="number" 
          placeholder="Usuario ID"
          value={filtros.usuario_id}
          onChange={(e) => setFiltros({...filtros, usuario_id: e.target.value})}
        />
        <input 
          type="number" 
          placeholder="Local ID"
          value={filtros.local_id}
          onChange={(e) => setFiltros({...filtros, local_id: e.target.value})}
        />
        <select 
          value={filtros.estado}
          onChange={(e) => setFiltros({...filtros, estado: e.target.value})}
        >
          <option value="">Todos los estados</option>
          <option value="generada">Generada</option>
          <option value="reembolsada">Reembolsada</option>
          <option value="pendiente">Pendiente</option>
        </select>
      </div>

      {/* Estadísticas */}
      {estadisticas && (
        <div className="estadisticas">
          <h3>Estadísticas ({estadisticas.contexto})</h3>
          <p>Total gastado: ${estadisticas.total_gastado}</p>
          <p>Total gastos: {estadisticas.total_gastos}</p>
          <p>Promedio: ${estadisticas.promedio_gasto}</p>
        </div>
      )}

      {/* Lista de Nóminas */}
      <div className="nominas">
        {nominas.map(nomina => (
          <div key={nomina.id} className="nomina-card">
            <h4>{nomina.nombre_usuario}</h4>
            <p>Monto: ${nomina.monto_total_rendicion}</p>
            <p>Estado: {nomina.estado}</p>
            <p>Gastos: {nomina.cantidad_gastos}</p>
          </div>
        ))}
      </div>

      {/* Paginación */}
      <div className="paginacion">
        <button 
          disabled={!paginacion.tieneAnterior}
          onClick={() => setPaginacion({...paginacion, pagina: paginacion.pagina - 1})}
        >
          Anterior
        </button>
        <span>Página {paginacion.pagina} de {paginacion.totalPaginas}</span>
        <button 
          disabled={!paginacion.tieneSiguiente}
          onClick={() => setPaginacion({...paginacion, pagina: paginacion.pagina + 1})}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default NominasGastos;
```

---

## 📝 **Notas Importantes**

1. **Generación Automática**: Las nóminas se crean automáticamente al reiniciar ciclos, no hay endpoint POST.

2. **Estadísticas Contextuales**: Las estadísticas se adaptan según los filtros aplicados para mostrar información relevante.

3. **Paginación**: El límite máximo es 100 elementos por página.

4. **Fechas**: Usar formato ISO (YYYY-MM-DD) para filtros de fecha.

5. **Montos**: Los montos se manejan como números decimales.

6. **Locales Múltiples**: Una nómina puede afectar múltiples locales, por eso `locales_afectados` es un array.

7. **Subcategorías**: Las estadísticas incluyen las top 3 subcategorías por categoría principal.

---

## 🔄 **Flujo de Trabajo**

1. **Vista General**: Mostrar todas las nóminas con estadísticas globales
2. **Filtrado**: Permitir filtrar por usuario, local, fechas, montos
3. **Estadísticas Dinámicas**: Mostrar estadísticas relevantes según filtros
4. **Detalle**: Al hacer clic en una nómina, mostrar el detalle completo
5. **Paginación**: Navegar entre páginas de resultados
