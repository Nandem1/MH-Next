# Sistema de Vencimientos con Escáner de Códigos de Barras

## 🎯 Resumen

Se ha implementado un sistema completo para capturar fechas de vencimiento de productos usando códigos de barras. El sistema incluye:

- **Escáner de códigos de barras** usando la cámara del teléfono
- **Formulario de captura** con validaciones
- **API REST** para registrar vencimientos
- **Validación de duplicados** según la estructura de base de datos
- **Interfaz responsive** optimizada para móviles

## 🚀 Características

### 📱 Escáner de Códigos de Barras
- **Compatibilidad**: Funciona en dispositivos móviles y desktop
- **Formatos soportados**: EAN-13, EAN-8, Code 128, Code 39, UPC, Codabar, etc.
- **Cámara trasera**: Usa automáticamente la cámara trasera en móviles
- **Feedback visual**: Muestra líneas verdes cuando detecta un código

### 📝 Formulario de Captura
- **Código de barras**: Escaneado automático o entrada manual
- **Fecha de vencimiento**: Selector de fecha nativo
- **Cantidad**: Campo numérico (opcional, por defecto 1)
- **Lote**: Campo de texto (opcional)
- **Validaciones**: Campos requeridos y formatos correctos

### 🛡️ Validaciones de Negocio
- **Duplicados**: No permite el mismo código + fecha + lote
- **Cantidad**: Debe ser mayor a 0
- **Campos requeridos**: Código de barras y fecha de vencimiento
- **Múltiples vencimientos**: Un producto puede tener diferentes fechas

## 📁 Estructura de Archivos

```
src/
├── app/
│   ├── dashboard/
│   │   └── vencimientos/
│   │       └── page.tsx                    # Página principal
│   └── api/
│       └── vencimientos/
│           └── route.ts                    # API endpoints
├── components/
│   └── dashboard/
│       ├── VencimientosPageContent.tsx     # Componente principal
│       └── BarcodeScanner.tsx              # Escáner de códigos
├── hooks/
│   └── useVencimientosForm.ts              # Hook del formulario
└── types/
    └── quagga.d.ts                         # Tipos para QuaggaJS
```

## 🛠️ Instalación

### 1. Dependencias
```bash
npm install quagga
```

### 2. Configuración de Tipos
El archivo `src/types/quagga.d.ts` ya está incluido para TypeScript.

### 3. Navegación
La ruta `/dashboard/vencimientos` ya está agregada al sidebar.

## 🗄️ Base de Datos

### Estructura Requerida
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

### Restricciones
- **UNIQUE**: `(codigo_barras, fecha_vencimiento, lote)`
- **Permite**: Múltiples fechas para el mismo código de barras
- **Evita**: Duplicados exactos de código + fecha + lote

## 🔌 API Endpoints

### POST /api/vencimientos
Registra un nuevo vencimiento.

**Request:**
```json
{
  "codigo_barras": "7802900414016",
  "fecha_vencimiento": "2025-07-26",
  "cantidad": 5,
  "lote": "LOT001"
}
```

**Response (201):**
```json
{
  "message": "Vencimiento registrado correctamente",
  "vencimiento": {
    "id": 1,
    "codigo_barras": "7802900414016",
    "fecha_vencimiento": "2025-07-26",
    "cantidad": 5,
    "lote": "LOT001"
  }
}
```

**Error (409):**
```json
{
  "error": "Ya existe un vencimiento registrado para este código de barras, fecha y lote"
}
```

### GET /api/vencimientos
Obtiene todos los vencimientos o filtra por código de barras.

**Query params:**
- `codigo_barras` (opcional): Filtra por código específico

## 📱 Uso del Escáner

### En Dispositivos Móviles
1. **Permisos**: El navegador solicitará acceso a la cámara
2. **Cámara trasera**: Se activa automáticamente
3. **Enfoque**: Apunta hacia el código de barras
4. **Detección**: Líneas verdes indican detección exitosa
5. **Resultado**: El código se llena automáticamente en el formulario

### En Desktop
1. **Cámara web**: Usa la cámara principal
2. **Mismo proceso**: Funciona igual que en móviles

## 🎨 Interfaz de Usuario

### Formulario Principal
- **Diseño responsive**: Se adapta a diferentes tamaños de pantalla
- **Validación en tiempo real**: Muestra errores inmediatamente
- **Estados de carga**: Indicadores visuales durante el envío
- **Feedback de éxito**: Mensajes de confirmación

### Escáner
- **Diálogo modal**: Se abre en una ventana separada
- **Controles intuitivos**: Botón de cancelar y cierre automático
- **Estados visuales**: Loading, error, y escaneo activo

## 🔧 Configuración del Backend

### Reemplazar Mock Data
En `src/app/api/vencimientos/route.ts`, reemplazar el mock con consultas reales:

```typescript
// Ejemplo con PostgreSQL
import { sql } from '@vercel/postgres';

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // Verificar duplicado
  const existing = await sql`
    SELECT id FROM control_vencimientos_cantera 
    WHERE codigo_barras = ${body.codigo_barras}
    AND fecha_vencimiento = ${body.fecha_vencimiento}
    AND lote = ${body.lote || null}
  `;
  
  if (existing.rows.length > 0) {
    return NextResponse.json(
      { error: "Ya existe un vencimiento registrado..." },
      { status: 409 }
    );
  }
  
  // Insertar nuevo vencimiento
  const result = await sql`
    INSERT INTO control_vencimientos_cantera 
    (codigo_barras, fecha_vencimiento, cantidad, lote)
    VALUES (${body.codigo_barras}, ${body.fecha_vencimiento}, ${body.cantidad}, ${body.lote || null})
    RETURNING *
  `;
  
  return NextResponse.json({ 
    message: "Vencimiento registrado correctamente",
    vencimiento: result.rows[0]
  });
}
```

## 🚨 Consideraciones de Seguridad

### HTTPS Requerido
- **Cámara**: Solo funciona en HTTPS en producción
- **Permisos**: El navegador maneja los permisos de cámara
- **Datos**: Los códigos de barras se envían de forma segura

### Validaciones
- **Frontend**: Validación inmediata para mejor UX
- **Backend**: Validación completa para seguridad
- **SQL Injection**: Usar consultas parametrizadas

## 🔄 Flujo de Trabajo

1. **Usuario accede** a `/dashboard/vencimientos`
2. **Escanea código** o lo ingresa manualmente
3. **Completa formulario** con fecha, cantidad y lote
4. **Sistema valida** duplicados y formato
5. **Se registra** en la base de datos
6. **Se muestra** confirmación de éxito

## 🎯 Casos de Uso

### Escenario 1: Producto Nuevo
- Escanear código → Llenar fecha → Registrar

### Escenario 2: Múltiples Fechas
- Mismo código, diferentes fechas de vencimiento

### Escenario 3: Diferentes Lotes
- Mismo código y fecha, pero lotes diferentes

### Escenario 4: Duplicado
- Sistema previene registro duplicado

## 🚀 Próximos Pasos

1. **Conectar base de datos real**
2. **Agregar búsqueda de productos**
3. **Implementar reportes de vencimientos**
4. **Agregar notificaciones de productos próximos a vencer**
5. **Integrar con sistema de inventario**

## 📞 Soporte

Para problemas con:
- **Escáner**: Verificar permisos de cámara y HTTPS
- **API**: Revisar logs del servidor
- **Base de datos**: Verificar conexión y estructura de tabla 