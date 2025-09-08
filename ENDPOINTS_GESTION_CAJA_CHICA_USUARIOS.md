# 🏦 Endpoints de Gestión de Caja Chica para Usuarios

## 📋 Resumen

Este documento describe los endpoints completos para gestionar la habilitación de caja chica a usuarios en el sistema de rendición de gastos. Estos endpoints permiten a los administradores realizar un CRUD completo:

1. **Ver todos los usuarios** con su estado de caja chica
2. **Habilitar caja chica** a usuarios específicos con inicialización completa del proceso
3. **Editar montos** de caja chica de usuarios autorizados
4. **Deshabilitar caja chica** de usuarios con proceso completo de desautorización

## 🎯 Endpoints Disponibles

### 1. Obtener Usuarios con Estado de Caja Chica

**Endpoint:** `GET /api-beta/usuario-caja-chica/usuarios`

**Descripción:** Obtiene la lista completa de usuarios con su estado de caja chica, incluyendo información de autorización, saldos y rendiciones activas.

**Autenticación:** Requerida (JWT token)

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "authUserId": 1,
      "email": "usuario@ejemplo.com",
      "rolId": 2,
      "tieneCajaChica": false,
      "montoFijo": null,
      "montoActual": null,
      "limiteMinimo": null,
      "fechaUltimoReembolso": null,
      "usuarioId": 1,
      "nombre": "Juan Pérez",
      "whatsappId": "56912345678",
      "localId": 1,
      "nombreLocal": "Local Centro",
      "estadoAutorizacion": "no_autorizado",
      "estadoOperacional": "inactivo",
      "rendicionActivaId": null,
      "rendicionFechaInicio": null,
      "rendicionGastosRegistrados": null,
      "rendicionMontoTotalGastos": null
    },
    {
      "authUserId": 2,
      "email": "admin@ejemplo.com",
      "rolId": 1,
      "tieneCajaChica": true,
      "montoFijo": 2000000,
      "montoActual": 1500000,
      "limiteMinimo": 200000,
      "fechaUltimoReembolso": "2024-01-15T10:30:00Z",
      "usuarioId": 2,
      "nombre": "María González",
      "whatsappId": "56987654321",
      "localId": 2,
      "nombreLocal": "Local Norte",
      "estadoAutorizacion": "autorizado",
      "estadoOperacional": "activo",
      "rendicionActivaId": "rend_1705123456789_2",
      "rendicionFechaInicio": "2024-01-15T10:30:00Z",
      "rendicionGastosRegistrados": 5,
      "rendicionMontoTotalGastos": 500000
    }
  ],
  "total": 2,
  "message": "Lista de usuarios con estado de caja chica obtenida exitosamente"
}
```

### 2. Habilitar Caja Chica a Usuario

**Endpoint:** `POST /api-beta/usuario-caja-chica/habilitar`

**Descripción:** Habilita caja chica a un usuario específico, inicializando completamente el proceso de rendición de gastos. Esto incluye:
- Marcar `tiene_caja_chica = true` en `auth_users`
- Configurar montos de caja chica
- Crear una rendición inicial activa
- Establecer límites y configuraciones

**Autenticación:** Requerida (JWT token)

**Body de la Solicitud:**
```json
{
  "authUserId": 1,
  "montoFijo": 2000000
}
```

**Parámetros:**
- `authUserId` (number, requerido): ID del usuario en la tabla `auth_users`
- `montoFijo` (number, opcional): Monto fijo de caja chica (default: 2,000,000)

**Validaciones:**
- `authUserId` es requerido
- `montoFijo` debe estar entre $1 y $10,000,000
- El usuario no debe tener caja chica ya habilitada

**Respuesta Exitosa (201):**
```json
{
  "success": true,
  "data": {
    "success": true,
    "usuario": {
      "authUserId": 1,
      "email": "usuario@ejemplo.com",
      "nombre": "Juan Pérez",
      "whatsappId": "56912345678",
      "localId": 1,
      "nombreLocal": "Local Centro",
      "tieneCajaChica": true,
      "montoFijo": 2000000,
      "montoActual": 2000000,
      "limiteMinimo": 200000,
      "fechaUltimoReembolso": "2024-01-15T10:30:00Z",
      "estadoAutorizacion": "autorizado",
      "estadoOperacional": "activo"
    },
    "rendicionInicial": {
      "id": "rend_1705123456789_1",
      "fechaInicio": "2024-01-15T10:30:00Z",
      "montoInicial": 2000000,
      "estado": "activa"
    },
    "mensaje": "Caja chica habilitada exitosamente. El usuario puede comenzar a registrar gastos."
  },
  "message": "Caja chica habilitada exitosamente"
}
```

### 3. Editar Caja Chica de Usuario

**Endpoint:** `PUT /api-beta/usuario-caja-chica/editar`

**Descripción:** Edita los montos de caja chica de un usuario específico. Permite modificar el monto fijo y/o el monto actual, actualizando automáticamente el límite mínimo y la rendición activa.

**Autenticación:** Requerida (JWT token)

**Body de la Solicitud:**
```json
{
  "authUserId": 1,
  "montoFijo": 3000000,
  "montoActual": 2500000
}
```

**Parámetros:**
- `authUserId` (number, requerido): ID del usuario en la tabla `auth_users`
- `montoFijo` (number, opcional): Nuevo monto fijo de caja chica
- `montoActual` (number, opcional): Nuevo monto actual de caja chica

**Validaciones:**
- `authUserId` es requerido
- `montoFijo` debe estar entre $1 y $10,000,000
- `montoActual` debe estar entre $0 y $10,000,000
- El usuario debe tener caja chica habilitada
- Al menos uno de los montos debe ser proporcionado

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "success": true,
    "usuario": {
      "authUserId": 1,
      "email": "usuario@ejemplo.com",
      "nombre": "Juan Pérez",
      "whatsappId": "56912345678",
      "localId": 1,
      "nombreLocal": "Local Centro",
      "tieneCajaChica": true,
      "montoFijo": 3000000,
      "montoActual": 2500000,
      "limiteMinimo": 300000,
      "fechaUltimoReembolso": "2024-01-15T10:30:00Z",
      "estadoAutorizacion": "autorizado",
      "estadoOperacional": "activo"
    },
    "cambios": {
      "montoFijo": {
        "anterior": 2000000,
        "nuevo": 3000000
      },
      "montoActual": {
        "anterior": 2000000,
        "nuevo": 2500000
      }
    },
    "mensaje": "Caja chica editada exitosamente"
  },
  "message": "Caja chica editada exitosamente"
}
```

### 4. Deshabilitar Caja Chica de Usuario

**Endpoint:** `DELETE /api-beta/usuario-caja-chica/deshabilitar`

**Descripción:** Deshabilita completamente la caja chica de un usuario, revirtiendo todo el proceso de autorización. Esto incluye:
- Marcar `tiene_caja_chica = false` en `auth_users`
- Limpiar todos los montos y configuraciones
- Cerrar la rendición activa si existe
- Invalidar caché relacionado

**Autenticación:** Requerida (JWT token)

**Body de la Solicitud:**
```json
{
  "authUserId": 1
}
```

**Parámetros:**
- `authUserId` (number, requerido): ID del usuario en la tabla `auth_users`

**Validaciones:**
- `authUserId` es requerido
- El usuario debe tener caja chica habilitada

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "success": true,
    "usuario": {
      "authUserId": 1,
      "email": "usuario@ejemplo.com",
      "nombre": "Juan Pérez",
      "whatsappId": "56912345678",
      "localId": 1,
      "nombreLocal": "Local Centro",
      "tieneCajaChica": false,
      "montoFijo": null,
      "montoActual": null,
      "limiteMinimo": null,
      "fechaUltimoReembolso": null,
      "estadoAutorizacion": "no_autorizado",
      "estadoOperacional": "inactivo"
    },
    "rendicionCerrada": {
      "id": "rend_1705123456789_1",
      "fechaCierre": "2024-01-15T10:30:00Z",
      "estado": "cerrada"
    },
    "mensaje": "Caja chica deshabilitada exitosamente. El usuario ya no puede registrar gastos."
  },
  "message": "Caja chica deshabilitada exitosamente"
}
```

## 🚨 Manejo de Errores

### Errores Comunes

**Usuario no encontrado (404):**
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Usuario no encontrado"
  }
}
```

**Usuario ya tiene caja chica habilitada (400):**
```json
{
  "success": false,
  "error": {
    "code": "BUSINESS_RULE_ERROR",
    "message": "El usuario ya tiene caja chica habilitada"
  }
}
```

**Monto inválido (400):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "El monto fijo debe estar entre $1 y $10,000,000"
  }
}
```

**Error interno del servidor (500):**
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

## 🔧 Proceso de Inicialización

Cuando se habilita caja chica a un usuario, el sistema realiza automáticamente:

### 1. Configuración en `auth_users`
- `tiene_caja_chica = true`
- `monto_fijo_caja_chica = montoFijo`
- `monto_actual_caja_chica = montoFijo`
- `limite_minimo_caja_chica = montoFijo * 0.1` (10%)
- `fecha_ultimo_reembolso = CURRENT_TIMESTAMP`

### 2. Creación de Rendición Inicial
- Se crea un registro en `rendiciones_usuarios`
- Estado: `activa`
- Monto inicial: igual al monto fijo
- Monto final: igual al monto inicial (sin gastos aún)
- Cantidad de gastos: 0

### 3. Transaccionalidad
- Todo el proceso se ejecuta en una transacción
- Si cualquier paso falla, se revierten todos los cambios
- Se garantiza consistencia de datos

## 📊 Estados de Usuario

### Estado de Autorización
- **`autorizado`**: Usuario tiene `tiene_caja_chica = true`
- **`no_autorizado`**: Usuario tiene `tiene_caja_chica = false`

### Estado Operacional
- **`activo`**: Usuario autorizado con saldo suficiente
- **`requiere_reembolso`**: Usuario autorizado con saldo bajo el límite mínimo
- **`inactivo`**: Usuario no autorizado

## 🎯 Casos de Uso

### 1. Administrador habilitando caja chica a un nuevo usuario
```bash
# 1. Obtener lista de usuarios
GET /api-beta/usuario-caja-chica/usuarios

# 2. Habilitar caja chica al usuario seleccionado
POST /api-beta/usuario-caja-chica/habilitar
{
  "authUserId": 5,
  "montoFijo": 3000000
}
```

### 2. Administrador editando montos de caja chica
```bash
# Editar monto fijo y actual de un usuario
PUT /api-beta/usuario-caja-chica/editar
{
  "authUserId": 5,
  "montoFijo": 4000000,
  "montoActual": 3500000
}

# Solo editar monto actual
PUT /api-beta/usuario-caja-chica/editar
{
  "authUserId": 5,
  "montoActual": 2000000
}
```

### 3. Administrador deshabilitando caja chica
```bash
# Deshabilitar caja chica de un usuario
DELETE /api-beta/usuario-caja-chica/deshabilitar
{
  "authUserId": 5
}
```

### 4. Verificar estado de todos los usuarios
```bash
# Obtener estado completo de todos los usuarios
GET /api-beta/usuario-caja-chica/usuarios
```

## 🔐 Seguridad

- **Autenticación JWT**: Todos los endpoints requieren token válido
- **Autorización**: Solo administradores pueden habilitar caja chica
- **Validación de datos**: Validación estricta de parámetros de entrada
- **Transaccionalidad**: Operaciones atómicas para mantener consistencia

## 📝 Notas Importantes

1. **Inicialización Completa**: El endpoint `/habilitar` no solo marca `tiene_caja_chica = true`, sino que inicializa completamente el proceso de rendición de gastos.

2. **Rendición Activa**: Se crea automáticamente una rendición activa para que el usuario pueda comenzar a registrar gastos inmediatamente.

3. **Límite Mínimo**: Se establece automáticamente como el 10% del monto fijo (ej: $200,000 para un monto fijo de $2,000,000).

4. **Consistencia**: El proceso es transaccional, garantizando que todos los cambios se apliquen correctamente o se reviertan en caso de error.

5. **Trazabilidad**: Se registra la fecha de último reembolso para auditoría.

6. **Edición Flexible**: El endpoint `/editar` permite modificar solo el monto fijo, solo el monto actual, o ambos, según las necesidades del administrador.

7. **Deshabilitación Completa**: El endpoint `/deshabilitar` revierte completamente la autorización, cerrando rendiciones activas y limpiando todos los datos relacionados.

8. **Actualización Automática**: Al editar el monto fijo, se actualiza automáticamente el límite mínimo y la rendición activa correspondiente.

## 🚀 Próximos Pasos

Una vez habilitada la caja chica, el usuario puede:
- Registrar gastos usando `POST /api-beta/gastos`
- Ver su estado de caja chica con `GET /api-beta/usuario-caja-chica/estado`
- Consultar su saldo disponible con `GET /api-beta/usuario-caja-chica/saldo`
- Ver historial de rendiciones con `GET /api-beta/usuario-caja-chica/historial`
