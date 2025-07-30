# 📋 Sistema de Nóminas - Integración Backend/Frontend

## 🎯 Resumen Ejecutivo

**Estado del Sistema:** ✅ **REFACTORIZADO** - Backend completamente migrado a nóminas híbridas
**Compatibilidad:** ✅ **TOTAL** - Todas las nóminas existentes funcionan con nueva estructura
**Tipos de Nómina:** `cheques` | `facturas` | `mixta`

---

## 🔧 Estructura de Datos del Backend

### 1. Tipos de Nómina
```typescript
type TipoNomina = 'cheques' | 'facturas' | 'mixta';
```

### 2. Estructura Principal de Nómina (Backend Response)
```typescript
interface NominaCanteraResponse {
  id: number;
  numero_nomina: string;
  fecha_emision: string;
  estado: string;
  local_origen: string;
  creado_por: string;
  created_at: string;
  updated_at: string;
  nombre_usuario: string;
  id_usuario: number;
  monto_total: number;
  cantidad_cheques: number;
  tipo_nomina: string;
  cantidad_facturas?: number;
  total_facturas?: number;
  total_cheques?: number;
  balance?: number;
  cheques?: ChequeAsignadoResponse[];
  facturas?: FacturaAsignadaResponse[];
  tracking_envio?: TrackingEnvioResponse;
}
```

### 3. Estructura Detallada de Nómina (Nueva API)
```typescript
interface NominaDetalleResponse {
  success: boolean;
  data: {
    id: number;
    numero_nomina: string;
    fecha_emision: string;
    estado: string;
    local_origen: string;
    creado_por: string;
    created_at: string;
    updated_at: string;
    tipo_nomina: string;
    nombre_usuario: string;
    id_usuario: number;
    
    // Sección principal: Facturas con información de cheques
    facturas: FacturaConChequeResponse[];
    
    // Sección de cheques: Para compatibilidad y gestión
    cheques: ChequeDetalleResponse[];
    
    // Sección de tracking
    tracking_envio: TrackingEnvioDetalleResponse;
    
    // Resumen completo
    resumen: ResumenNominaResponse;
  };
}
```

---

## 🚀 Endpoints del Backend

### 1. **Obtener Nóminas (Lista)**
```http
GET /api-beta/nominas?page=1&limit=20&tipo=mixta&local=Santiago&estado=pendiente
Authorization: Bearer {token}
```

**Query Parameters:**
- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 20)
- `tipo`: Tipo de nómina (`cheques`, `facturas`, `mixta`)
- `local`: Filtro por local
- `estado`: Filtro por estado
- `usuario`: Filtro por usuario
- `numero_nomina`: Búsqueda por número
- `fecha_desde`: Filtro desde fecha
- `fecha_hasta`: Filtro hasta fecha

**Response:**
```json
{
  "success": true,
  "data": {
    "nominas": [
      {
        "id": 1,
        "numero_nomina": "NOM-2024-001",
        "fecha_emision": "2024-12-19",
        "estado": "pendiente",
        "tipo_nomina": "mixta",
        "local_origen": "Santiago",
        "monto_total": 100000,
        "cantidad_cheques": 2,
        "cantidad_facturas": 1,
        "total_facturas": 50000,
        "total_cheques": 50000,
        "balance": 0
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "hasNext": true
    }
  }
}
```

### 2. **Obtener Nómina por ID (Detalle Completo)**
```http
GET /api-beta/nominas/{id}
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "numero_nomina": "NOM-2024-001",
    "fecha_emision": "2024-12-19",
    "estado": "pendiente",
    "tipo_nomina": "mixta",
    "local_origen": "Santiago",
    "creado_por": "Juan Pérez",
    "created_at": "2024-12-19T10:00:00Z",
    "updated_at": "2024-12-19T10:00:00Z",
    "nombre_usuario": "Juan Pérez",
    "id_usuario": 1,
    
    "facturas": [
      {
        "id": 123,
        "folio": "FAC-001",
        "monto": 50000,
        "estado": 1,
        "fecha_factura": "2024-12-15",
        "nombre_proveedor": "ABC Ltda",
        "rut_proveedor": "12345678-9",
        "nombre_local": "Santiago",
        "nombre_usuario_factura": "Juan Pérez",
        "monto_asignado": 50000,
        "fecha_asignacion": "2024-12-19T10:00:00Z",
        "cheque_asignado": {
          "id": 456,
          "correlativo": "CHK-001",
          "monto": 50000,
          "monto_asignado": 50000,
          "nombre_usuario_cheque": "Juan Pérez",
          "fecha_asignacion_cheque": "2024-12-19T10:00:00Z"
        },
        "notas_credito": []
      }
    ],
    
    "cheques": [
      {
        "id": 456,
        "correlativo": "CHK-001",
        "monto": 50000,
        "created_at": "2024-12-19T10:00:00Z",
        "asignado_a_nomina": true,
        "nombre_usuario_cheque": "Juan Pérez",
        "id_usuario_cheque": 1,
        "monto_asignado": 50000,
        "fecha_asignacion": "2024-12-19T10:00:00Z",
        "facturas": [
          {
            "id": 123,
            "folio": "FAC-001",
            "monto": 50000,
            "estado": 1,
            "fecha_factura": "2024-12-15",
            "nombre_proveedor": "ABC Ltda",
            "rut_proveedor": "12345678-9",
            "nombre_local": "Santiago",
            "nombre_usuario_factura": "Juan Pérez",
            "monto_asignado": 50000,
            "fecha_asignacion_factura": "2024-12-19T10:00:00Z",
            "notas_credito": []
          }
        ]
      }
    ],
    
    "tracking_envio": {
      "id": 1,
      "estado": "EN_ORIGEN",
      "local_origen": "Santiago",
      "local_destino": "Valparaíso"
    },
    
    "resumen": {
      "cantidad_cheques": 2,
      "cantidad_facturas": 1,
      "cantidad_facturas_sin_cheque": 0,
      "cantidad_facturas_con_cheque": 1,
      "monto_total_asignado": 100000,
      "monto_total_cheques": 50000,
      "monto_total_facturas": 50000,
      "monto_total_notas_credito": 0,
      "monto_neto": 100000,
      "balance_valido": true,
      "diferencia": 0,
      "porcentaje_asignado": 100
    }
  }
}
```

### 3. **Crear Nómina**
```http
POST /api-beta/nominas
Content-Type: application/json
Authorization: Bearer {token}

{
  "numero_nomina": "NOM-2024-001",
  "fecha_emision": "2024-12-19",
  "local_origen": "Santiago",
  "tipo_nomina": "cheques",
  "creado_por": "Juan Pérez"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "numero_nomina": "NOM-2024-001",
    "tipo_nomina": "cheques",
    "estado": "pendiente",
    "monto_total": 0,
    "cantidad_cheques": 0,
    "cantidad_facturas": 0
  }
}
```

### 4. **Crear Nómina Mixta**
```http
POST /api-beta/nominas/mixta
Content-Type: application/json
Authorization: Bearer {token}

{
  "numero_nomina": "NOM-2024-001",
  "fecha_emision": "2024-12-19",
  "local_origen": "Santiago",
  "facturas": [
    {
      "idFactura": 123,
      "montoAsignado": 50000
    }
  ],
  "cheques": [
    {
      "idCheque": 456,
      "montoAsignado": 50000
    }
  ]
}
```

### 5. **Asignar Cheques a Nómina**
```http
POST /api-beta/nominas/{id}/cheques
Content-Type: application/json
Authorization: Bearer {token}

{
  "cheques": [
    {
      "idCheque": 456,
      "montoAsignado": 50000
    }
  ]
}
```

### 6. **Asignar Facturas a Nómina**
```http
POST /api-beta/nominas/{id}/facturas
Content-Type: application/json
Authorization: Bearer {token}

{
  "facturas": [
    {
      "idFactura": 123,
      "montoAsignado": 50000
    }
  ]
}
```

### 7. **Obtener Facturas Disponibles**
```http
GET /api-beta/facturas/disponibles?page=1&limit=20&proveedor=ABC
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 123,
      "folio": "FAC-001",
      "proveedor": "ABC Ltda",
      "monto": 50000,
      "estado": 1,
      "fecha_ingreso": "2024-12-15",
      "asignado_a_nomina": false,
      "nombre_proveedor": "ABC Ltda",
      "rut_proveedor": "12345678-9"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "hasNext": true
  }
}
```

### 8. **Validar Balance de Nómina**
```http
GET /api-beta/nominas/{id}/balance
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "balance_valido": true,
    "total_facturas": 50000,
    "total_cheques": 50000,
    "diferencia": 0,
    "mensaje": "Nómina balanceada correctamente"
  }
}
```

### 9. **Convertir Nómina a Mixta**
```http
PUT /api-beta/nominas/{id}/convertir-mixta
Content-Type: application/json
Authorization: Bearer {token}

{
  "facturas": [
    {
      "idFactura": 123,
      "montoAsignado": 50000
    }
  ]
}
```

---

## 📊 Estructuras de Datos del Frontend

### 1. **Transformación de Datos (Frontend)**
```typescript
// Función de transformación del backend al frontend
const transformNominaResponse = (response: NominaCanteraResponse): NominaCantera => {
  return {
    id: response.id.toString(),
    numeroNomina: response.numero_nomina,
    fechaEmision: response.fecha_emision,
    local: response.local_origen,
    montoTotal: response.monto_total,
    estado: response.estado as any,
    idUsuario: response.id_usuario.toString(),
    createdAt: response.created_at,
    updatedAt: response.updated_at,
    creadoPor: response.creado_por,
    tipoNomina: response.tipo_nomina as any,
    cheques: response.cheques?.map(transformChequeResponse),
    facturas: response.facturas?.map(transformFacturaResponse),
    trackingEnvio: response.tracking_envio ? transformTrackingResponse(response.tracking_envio) : undefined,
    totalCheques: response.cantidad_cheques,
    totalFacturas: response.cantidad_facturas,
    balance: response.balance,
    fechaCreacion: response.created_at
  };
};
```

### 2. **Tipos del Frontend**
```typescript
interface NominaCantera {
  id: string;
  numeroNomina: string;
  fechaEmision: string;
  local: string;
  montoTotal: number;
  estado: "pendiente" | "pagada" | "vencida" | "enviada" | "recibida" | "cancelada";
  idUsuario: string;
  createdAt: string;
  updatedAt: string;
  creadoPor: string;
  tipoNomina: "cheques" | "facturas" | "mixta";
  cheques?: ChequeAsignado[];
  facturas?: FacturaAsignada[];
  trackingEnvio?: TrackingEnvio;
  totalCheques?: number;
  totalFacturas?: number;
  balance?: number;
  fechaCreacion?: string;
}
```

---

## 🔄 Servicios del Frontend

### 1. **NominaChequeService**
```typescript
// Obtener nóminas con filtros
async getNominas(filtros: FiltrosNominas = {}): Promise<{
  nominas: NominaCantera[], 
  pagination: PaginationInfo, 
  filtros: FiltrosNominas 
}>

// Obtener nómina por ID
async getNomina(id: string): Promise<NominaCantera>

// Obtener nómina completa con detalles
async getNominaCompleta(id: string): Promise<NominaCantera>

// Crear nueva nómina
async crearNomina(request: CrearNominaRequest): Promise<NominaCantera>

// Asignar facturas a nómina
async asignarFacturasANomina(nominaId: string, facturas: AsignarFacturaRequest[]): Promise<NominaCantera>

// Convertir nómina a mixta
async convertirNominaAMixta(nominaId: string, facturas: AsignarFacturaRequest[]): Promise<NominaCantera>

// Obtener nóminas por tipo
async getNominasPorTipo(tipo: string, filtros: FiltrosNominas = {}): Promise<{
  nominas: NominaCantera[], 
  pagination: PaginationInfo, 
  filtros: FiltrosNominas 
}>
```

### 2. **FacturaService**
```typescript
// Obtener facturas disponibles (no asignadas)
async getFacturasDisponibles(filtros: {
  page?: number;
  limit?: number;
  proveedor?: string;
} = {}): Promise<{
  data: Factura[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
  };
}>

// Obtener facturas asignadas a una nómina
async getFacturasAsignadas(nominaId: string): Promise<Factura[]>
```

---

## ⚡ Validaciones del Backend

### 1. **Balance de Nóminas Mixtas**
```sql
-- Validar que total_facturas = total_cheques
SELECT ABS(total_facturas - total_cheques) < 0.01 as balance_valido
FROM v_nominas_completas 
WHERE id = ? AND tipo_nomina = 'mixta';
```

### 2. **Factura Única por Nómina**
```sql
-- Una factura no puede estar en múltiples nóminas
SELECT COUNT(*) = 0 as factura_disponible
FROM nomina_factura 
WHERE id_factura = ? AND id_nomina != ?;
```

### 3. **Monto Válido**
```sql
-- El monto asignado no puede exceder el monto de la factura
SELECT monto_asignado <= monto_factura as monto_valido
FROM facturas f
JOIN nomina_factura nf ON f.id = nf.id_factura
WHERE nf.id_factura = ? AND nf.id_nomina = ?;
```

---

## 🔧 Headers Requeridos

### **Autenticación**
```typescript
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`,
  'X-Requested-With': 'XMLHttpRequest'
});
```

### **Credenciales**
```typescript
// Incluir en todas las requests
credentials: "include"
```

---

## 📋 Resumen de Integración

### **Lo que envía el Frontend:**
1. **Headers de autenticación** en todas las requests
2. **Query parameters** para filtros y paginación
3. **JSON payload** para crear/modificar nóminas
4. **IDs de recursos** para operaciones específicas

### **Lo que recibe el Frontend:**
1. **Estructura estandarizada** con `success` y `data`
2. **Datos transformados** para el frontend
3. **Información de paginación** para listas
4. **Detalles completos** para vistas individuales

### **Compatibilidad:**
- ✅ **Nóminas existentes** funcionan sin cambios
- ✅ **Nuevas funcionalidades** disponibles gradualmente
- ✅ **Migración automática** de tipos de nómina
- ✅ **Validaciones** del backend protegen la integridad

---

## 🚀 Próximos Pasos

### **Frontend:**
1. ✅ Implementar servicios de nóminas híbridas
2. ✅ Crear componentes para gestión de facturas
3. ✅ Agregar validaciones de balance
4. ✅ Implementar filtros por tipo de nómina

### **Backend:**
1. ✅ Migración de base de datos completada
2. ✅ APIs refactorizadas implementadas
3. ✅ Validaciones de integridad activas
4. ✅ Documentación actualizada

---

## 📞 Información de Contacto

**Archivos de Referencia:**
- **Tipos TypeScript:** `src/types/nominaCheque.d.ts`
- **Servicios:** `src/services/nominaChequeService.ts`
- **Migraciones:** `migrations/nominas_hibridas.sql`
- **Documentación Backend:** `docs/nominas-hibridas-backend.md` 