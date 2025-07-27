# 📋 Nóminas Híbridas - Especificaciones Backend

## 🎯 Resumen Ejecutivo

**¿Es una migración o funcionalidad nueva?**
- ✅ **MIGRACIÓN GRADUAL** - La funcionalidad antigua sigue funcionando igual
- ✅ **EXTENSIÓN** - Agregamos soporte para nóminas de facturas y mixtas
- ✅ **COMPATIBILIDAD** - Todas las nóminas existentes se convierten automáticamente a tipo "cheques"

**Estrategia de Implementación:**
1. **Fase 1:** Migración de base de datos (ya completada)
2. **Fase 2:** Backend APIs (actual)
3. **Fase 3:** Frontend gradual
4. **Fase 4:** Migración completa a nóminas mixtas

---

## 🗄️ Base de Datos (Ya Implementada)

### Migraciones Aplicadas:
- ✅ Campo `tipo_nomina` en `nominas_cantera` (default: 'cheques')
- ✅ Tabla `nomina_factura` para asignar facturas
- ✅ Campo `asignado_a_nomina` en `facturas`
- ✅ Vista `v_nominas_completas` con información consolidada
- ✅ Triggers automáticos para mantener consistencia

### Compatibilidad:
```sql
-- Todas las nóminas existentes mantienen su funcionalidad
UPDATE nominas_cantera SET tipo_nomina = 'cheques' WHERE tipo_nomina IS NULL;
```

---

## 🔧 Nuevos Endpoints Requeridos

### 1. Crear Nómina Mixta
```http
POST /api-beta/nominas/mixta
Content-Type: application/json
Authorization: Bearer {token}

{
  "numeroNomina": "NOM-2024-001",
  "fechaEmision": "2024-12-19",
  "localOrigen": "Santiago",
  "facturas": [
    {
      "idFactura": "123",
      "montoAsignado": 50000
    }
  ],
  "cheques": [
    {
      "idCheque": "456",
      "montoAsignado": 50000
    }
  ]
}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "numero_nomina": "NOM-2024-001",
    "tipo_nomina": "mixta",
    "balance": 0,
    "total_facturas": 50000,
    "total_cheques": 50000
  }
}
```

### 2. Asignar Facturas a Nómina Existente
```http
POST /api-beta/nominas/{id}/facturas
Content-Type: application/json
Authorization: Bearer {token}

{
  "facturas": [
    {
      "idFactura": "123",
      "montoAsignado": 25000
    }
  ]
}
```

### 3. Obtener Facturas Disponibles (no asignadas)
```http
GET /api-beta/facturas/disponibles?page=1&limit=20&proveedor=ABC&estado=pendiente
Authorization: Bearer {token}
```

**Respuesta:**
```json
{
  "data": [
    {
      "id": 123,
      "folio": "FAC-001",
      "proveedor": "ABC Ltda",
      "monto": 50000,
      "estado": "pendiente",
      "fecha_ingreso": "2024-12-15",
      "asignado_a_nomina": false
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

### 4. Obtener Nómina con Detalles Completos
```http
GET /api-beta/nominas/{id}/completa
Authorization: Bearer {token}
```

**Respuesta:**
```json
{
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
  "monto_total": 100000,
  "cantidad_cheques": 2,
  "cantidad_facturas": 1,
  "total_facturas": 50000,
  "total_cheques": 50000,
  "balance": 0,
  "cheques": [...],
  "facturas": [...],
  "tracking_envio": {...}
}
```

### 5. Validar Balance de Nómina Mixta
```http
GET /api-beta/nominas/{id}/balance
Authorization: Bearer {token}
```

**Respuesta:**
```json
{
  "balance_valido": true,
  "total_facturas": 50000,
  "total_cheques": 50000,
  "diferencia": 0,
  "mensaje": "Nómina balanceada correctamente"
}
```

### 6. Obtener Nóminas por Tipo
```http
GET /api-beta/nominas?tipo=mixta&page=1&limit=20
Authorization: Bearer {token}
```

### 7. Convertir Nómina a Mixta
```http
PUT /api-beta/nominas/{id}/convertir-mixta
Content-Type: application/json
Authorization: Bearer {token}

{
  "facturas": [
    {
      "idFactura": "123",
      "montoAsignado": 50000
    }
  ]
}
```

---

## 🔍 Consultas SQL Principales

### 1. Obtener Nóminas con Información Completa
```sql
SELECT * FROM v_nominas_completas 
WHERE tipo_nomina IN ('mixta', 'facturas')
ORDER BY created_at DESC;
```

### 2. Facturas Disponibles (no asignadas)
```sql
SELECT f.*, p.nombre as nombre_proveedor
FROM facturas f
JOIN proveedores p ON f.id_proveedor = p.id
WHERE f.asignado_a_nomina = FALSE
AND f.estado = 'pendiente'
ORDER BY f.fecha_ingreso DESC;
```

### 3. Validar Balance de Nómina Mixta
```sql
SELECT 
  validar_balance_nomina_mixta(1) as balance_valido,
  COALESCE(SUM(nf.monto_asignado), 0) as total_facturas,
  COALESCE(SUM(nc.monto_asignado), 0) as total_cheques
FROM nominas_cantera nom
LEFT JOIN nomina_factura nf ON nom.id = nf.id_nomina
LEFT JOIN nomina_cheque nc ON nom.id = nc.id_nomina
WHERE nom.id = 1;
```

---

## 🔄 Rutas Existentes que Necesitan Extensión

### Rutas de Nóminas (Ya implementadas):
```javascript
// Rutas existentes en mainRoutes.js
router.post('/nominas', authenticateToken, validateNomina, crearNominaController);
router.get('/nominas', authenticateToken, getAllNominasController);
router.get('/nominas/:id', authenticateToken, validateNominaId, getNominaByIdController);
router.get('/nominas/numero/:numero', authenticateToken, validateNominaNumero, getNominaByNumeroController);
router.put('/nominas/:id', authenticateToken, validateNominaId, validateNomina, actualizarNominaController);
router.delete('/nominas/:id', authenticateToken, validateNominaId, eliminarNominaController);
router.post('/nominas/:id/cheques', authenticateToken, validateNominaId, validateAsignacionChequeNomina, asignarChequeANominaController);
```

### Rutas de Facturas (Ya implementadas):
```javascript
// Rutas existentes en mainRoutes.js
router.get('/facturas', getAllFacturasController);
router.get('/facturas/:folio', getFactura);
router.get('/facturas/id/:id', validateFacturaId, cacheFacturaId, getFacturaByIdController);
router.patch('/facturas/:folio/estado', authenticateToken, cambiarEstadoFactura);
router.put('/facturas/:id/monto', authenticateToken, actualizarMontoFactura);
router.put('/facturas/:id/metodo-pago', authenticateToken, validateMetodoPago, actualizarMetodoPagoFactura);
```

### Extensiones Requeridas:

#### 1. Modificar `getAllNominasController`:
```javascript
// Agregar filtro por tipo_nomina
router.get('/nominas', authenticateToken, getAllNominasController);
// Query params: ?tipo=mixta&page=1&limit=20
```

#### 2. Modificar `getNominaByIdController`:
```javascript
// Incluir información de facturas asignadas
router.get('/nominas/:id', authenticateToken, validateNominaId, getNominaByIdController);
// Response debe incluir: facturas, total_facturas, balance
```

#### 3. Modificar `crearNominaController`:
```javascript
// Agregar soporte para tipo_nomina en el request
router.post('/nominas', authenticateToken, validateNomina, crearNominaController);
// Request body debe incluir: tipoNomina (opcional, default: 'cheques')
```

#### 4. Agregar nueva ruta para facturas disponibles:
```javascript
// Nueva ruta para facturas no asignadas
router.get('/facturas/disponibles', authenticateToken, getFacturasDisponiblesController);
// Query params: ?page=1&limit=20&proveedor=ABC&estado=pendiente
```

---

## ⚡ Validaciones Requeridas

### 1. Balance en Nóminas Mixtas
```sql
-- Validar que total_facturas = total_cheques
SELECT ABS(total_facturas - total_cheques) < 0.01 as balance_valido
FROM v_nominas_completas 
WHERE id = ? AND tipo_nomina = 'mixta';
```

### 2. Factura Única por Nómina
```sql
-- Una factura no puede estar en múltiples nóminas
SELECT COUNT(*) = 0 as factura_disponible
FROM nomina_factura 
WHERE id_factura = ? AND id_nomina != ?;
```

### 3. Monto Válido
```sql
-- monto_asignado <= monto_factura
SELECT f.monto >= ? as monto_valido
FROM facturas f 
WHERE f.id = ?;
```

### 4. Estado de Factura
```sql
-- Solo facturas pendientes pueden asignarse
SELECT estado = 'pendiente' as estado_valido
FROM facturas 
WHERE id = ?;
```

---

## 🔄 Flujo de Trabajo

### Crear Nómina Mixta:
1. **Validar datos de entrada**
2. **Verificar que facturas y cheques existan**
3. **Confirmar que facturas no estén asignadas**
4. **Calcular balance automáticamente**
5. **Insertar en `nomina_factura` y `nomina_cheque`**
6. **Actualizar `tipo_nomina` a 'mixta'**

### Asignar Facturas:
1. **Verificar disponibilidad de facturas**
2. **Validar montos asignados**
3. **Actualizar `asignado_a_nomina` en `facturas`**
4. **Recalcular balance de la nómina**
5. **Actualizar `tipo_nomina` si es necesario**

### Validar Balance:
1. **Usar función `validar_balance_nomina_mixta()`**
2. **Retornar estado de validación**
3. **Incluir detalles de diferencia si no está balanceado**

---

## 📁 Archivos de Referencia Frontend

### Tipos TypeScript (Ya actualizados):
- `src/types/nominaCheque.d.ts` - Tipos extendidos para nóminas híbridas

### Servicios (Necesitan extensión):
- `src/services/nominaChequeService.ts` - Agregar métodos para facturas
- `src/services/facturaService.ts` - Agregar método para facturas disponibles

### Componentes (Nuevos necesarios):
- `src/components/dashboard/NominaMixtaContent.tsx`
- `src/components/dashboard/AsignarFacturasModal.tsx`

---

## 🎯 Estrategia de Migración

### Fase 1: Base de Datos ✅
- Migraciones SQL aplicadas
- Compatibilidad con sistema existente

### Fase 2: Backend APIs (Actual)
- Implementar nuevos endpoints
- Mantener compatibilidad con APIs existentes

### Fase 3: Frontend Gradual
- Nuevos componentes para nóminas mixtas
- Sistema existente sigue funcionando

### Fase 4: Migración Completa
- Convertir nóminas existentes a mixtas
- Unificar interfaz de usuario

---

## ⚠️ Consideraciones Importantes

### Compatibilidad:
- ✅ **Nóminas existentes:** Siguen funcionando como "cheques"
- ✅ **APIs existentes:** No se modifican
- ✅ **Frontend actual:** No se rompe

### Migración Gradual:
- 🔄 **Nuevas nóminas:** Pueden ser mixtas desde el inicio
- 🔄 **Nóminas existentes:** Se pueden convertir a mixtas manualmente
- 🔄 **Sistema unificado:** Eventualmente todo será mixto

### Validaciones:
- ⚡ **Balance automático:** Nóminas mixtas deben estar balanceadas
- ⚡ **Facturas únicas:** Una factura solo puede estar en una nómina
- ⚡ **Estados válidos:** Solo facturas pendientes se pueden asignar

---

## 📞 Información de Contacto

### Archivos de Referencia:
- **Base de datos:** `migrations/nominas_hibridas.sql`
- **Tipos TypeScript:** `src/types/nominaCheque.d.ts`
- **Esquema actualizado:** `railway.dbml`

### Próximos Pasos:
1. **Implementar endpoints** según especificaciones
2. **Crear servicios** para gestión de facturas en nóminas
3. **Implementar validaciones** de balance
4. **Actualizar endpoints existentes** para incluir `tipo_nomina`
5. **Crear tests** para validar funcionalidad

---

## 🎯 Controladores que Necesitan Modificación

### 1. `nominaCanteraController.js`
**Métodos a modificar:**
- `crearNominaController` - Agregar soporte para `tipoNomina`
- `getAllNominasController` - Agregar filtro por `tipo_nomina`
- `getNominaByIdController` - Incluir información de facturas
- `actualizarNominaController` - Permitir cambio de tipo

**Nuevos métodos a crear:**
- `crearNominaMixtaController`
- `asignarFacturasANominaController`
- `validarBalanceNominaController`
- `convertirNominaAMixtaController`

### 2. `facturaController.js`
**Métodos a modificar:**
- `getAllFacturasController` - Agregar filtro por `asignado_a_nomina`

**Nuevos métodos a crear:**
- `getFacturasDisponiblesController`
- `getFacturasAsignadasController`

### 3. Nuevos Controladores
**Crear:**
- `nominaFacturaController.js` - Gestión de asignación facturas-nóminas
- `balanceNominaController.js` - Validaciones de balance

### 4. Middlewares de Validación
**Agregar a `validation.js`:**
- `validateAsignacionFacturaNomina`
- `validateBalanceNomina`
- `validateTipoNomina`

---

## 📋 Resumen de Implementación Backend

### **Archivos a Modificar:**
1. **`mainRoutes.js`** - Agregar nuevas rutas
2. **`nominaCanteraController.js`** - Extender controladores existentes
3. **`facturaController.js`** - Agregar métodos para facturas disponibles
4. **`validation.js`** - Nuevos middlewares de validación

### **Archivos a Crear:**
1. **`nominaFacturaController.js`** - Gestión de asignación facturas-nóminas
2. **`balanceNominaController.js`** - Validaciones de balance

### **Nuevas Rutas en `mainRoutes.js`:**
```javascript
// Nuevas rutas para nóminas híbridas
router.post('/nominas/mixta', authenticateToken, validateNomina, crearNominaMixtaController);
router.post('/nominas/:id/facturas', authenticateToken, validateNominaId, validateAsignacionFacturaNomina, asignarFacturasANominaController);
router.get('/nominas/:id/completa', authenticateToken, validateNominaId, getNominaCompletaController);
router.get('/nominas/:id/balance', authenticateToken, validateNominaId, validarBalanceNominaController);
router.put('/nominas/:id/convertir-mixta', authenticateToken, validateNominaId, convertirNominaAMixtaController);

// Nueva ruta para facturas disponibles
router.get('/facturas/disponibles', authenticateToken, getFacturasDisponiblesController);
```

### **Modificaciones en Rutas Existentes:**
```javascript
// Modificar para soportar filtro por tipo
router.get('/nominas', authenticateToken, getAllNominasController);
// Query params: ?tipo=mixta&page=1&limit=20

// Modificar para incluir información de facturas
router.get('/nominas/:id', authenticateToken, validateNominaId, getNominaByIdController);
// Response extendido con: facturas, total_facturas, balance
```

---

## 🚀 Plan de Implementación Backend

### **Paso 1: Preparación (1-2 días)**
- ✅ Migraciones SQL (ya completadas)
- ✅ Tipos TypeScript (ya actualizados)
- 📝 Crear nuevos controladores base

### **Paso 2: Controladores Core (3-4 días)**
- 📝 Implementar `nominaFacturaController.js`
- 📝 Implementar `balanceNominaController.js`
- 📝 Extender `nominaCanteraController.js`

### **Paso 3: Validaciones (1-2 días)**
- 📝 Agregar middlewares en `validation.js`
- 📝 Implementar validaciones de balance
- 📝 Validaciones de facturas únicas

### **Paso 4: Rutas y Testing (2-3 días)**
- 📝 Agregar nuevas rutas en `mainRoutes.js`
- 📝 Testing de endpoints
- 📝 Validación de compatibilidad

### **Paso 5: Documentación y Deploy (1 día)**
- 📝 Documentar APIs
- 📝 Deploy a staging
- 📝 Testing en producción

---

## ⚡ Consideraciones Técnicas

### **Performance:**
- 🚀 Usar la vista `v_nominas_completas` para consultas optimizadas
- 🚀 Implementar caché para facturas disponibles
- 🚀 Índices ya creados en migraciones

### **Seguridad:**
- 🔒 Validar permisos de usuario para asignar facturas
- 🔒 Validar que facturas pertenezcan al usuario
- 🔒 Sanitizar inputs de montos

### **Compatibilidad:**
- ✅ Mantener todas las APIs existentes
- ✅ Nóminas existentes siguen funcionando
- ✅ Migración gradual sin breaking changes

---

## 📞 Información Final

### **Archivos de Referencia:**
- **Base de datos:** `migrations/nominas_hibridas.sql`
- **Tipos TypeScript:** `src/types/nominaCheque.d.ts`
- **Rutas actuales:** `mainRoutes.js`
- **Esquema actualizado:** `railway.dbml`

### **Contacto para Implementación:**
- **Prefijo API:** `/api-beta/`
- **Autenticación:** Bearer Token
- **Validaciones:** Middlewares existentes + nuevos
- **Caché:** Redis (ya implementado)

### **Próximos Pasos:**
1. **Revisar documentación** con el equipo backend
2. **Implementar controladores** según especificaciones
3. **Testing** de funcionalidad
4. **Deploy** gradual
5. **Frontend** (Fase 3)

---

## 🚀 Respuesta a la Pregunta Principal

**¿Es migración o funcionalidad nueva?**

**RESPUESTA:** Es una **MIGRACIÓN GRADUAL** que mantiene toda la funcionalidad existente y agrega nuevas capacidades.

**¿Usaremos mixta para ambas?**

**RESPUESTA:** **SÍ**, eventualmente todas las nóminas serán mixtas, pero la migración es gradual:

1. **Ahora:** Nóminas existentes siguen siendo de "cheques"
2. **Nuevas:** Pueden ser "cheques", "facturas" o "mixtas"
3. **Futuro:** Todas serán "mixtas" con capacidad de manejar ambos tipos

**Ventajas de este enfoque:**
- ✅ No rompe funcionalidad existente
- ✅ Permite migración gradual
- ✅ Mantiene compatibilidad
- ✅ Facilita testing y validación 