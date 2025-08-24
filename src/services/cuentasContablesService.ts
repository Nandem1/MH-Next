export interface CuentaContable {
  id: string;
  nombre: string;
  codigo?: string;
  categoria: 'ACTIVOS' | 'GASTOS_OPERACIONALES' | 'GASTOS_GENERALES' | 'OTROS';
  esMasUtilizada?: boolean;
}

// Las categorías más utilizadas están marcadas directamente en los datos

// Lista completa de cuentas contables
const CUENTAS_CONTABLES: CuentaContable[] = [
  // ACTIVOS FIJOS
  { id: '1', nombre: 'MAQUINARIAS Y EQUIPOS', categoria: 'ACTIVOS' },
  { id: '2', nombre: 'MAQUINARIAS', categoria: 'ACTIVOS' },
  { id: '3', nombre: 'VEHICULOS', categoria: 'ACTIVOS' },
  { id: '4', nombre: 'MUEBLES Y UTILES', categoria: 'ACTIVOS' },
  { id: '5', nombre: 'EQUIPOS COMPUTACIONALES', categoria: 'ACTIVOS' },
  { id: '6', nombre: 'HERRAMIENTAS', categoria: 'ACTIVOS' },
  { id: '7', nombre: 'PATENTES', categoria: 'ACTIVOS' },
  
  // DISPONIBLE
  { id: '8', nombre: 'CAJA', categoria: 'ACTIVOS' },
  { id: '9', nombre: 'FONDOS POR RENDIR', categoria: 'ACTIVOS' },
  { id: '10', nombre: 'CUENTA PARTICULAR SOCIO A', categoria: 'ACTIVOS' },
  
  // INVENTARIO
  { id: '11', nombre: 'MERCADERIAS', categoria: 'ACTIVOS' },
  
  // GASTOS OPERACIONALES
  { id: '12', nombre: 'GTOS. OPERACIONALES', categoria: 'GASTOS_OPERACIONALES' },
  { id: '13', nombre: 'HONORARIOS', categoria: 'GASTOS_OPERACIONALES' },
  { id: '14', nombre: 'ARRIENDOS', categoria: 'GASTOS_OPERACIONALES' },
  { id: '15', nombre: 'GTO. COMUNICACIONES', categoria: 'GASTOS_OPERACIONALES' },
  { id: '16', nombre: 'SERVICIOS BASICOS', categoria: 'GASTOS_OPERACIONALES', esMasUtilizada: true },
  { id: '17', nombre: 'MANTENCION Y REPARACION', categoria: 'GASTOS_OPERACIONALES', esMasUtilizada: true },
  { id: '18', nombre: 'UTILES Y ARTICULOS DE OFICINA', categoria: 'GASTOS_OPERACIONALES' },
  { id: '19', nombre: 'GTOS. DE PUBLICIDAD', categoria: 'GASTOS_OPERACIONALES' },
  { id: '20', nombre: 'COMBUSTIBLES Y LUBRICANTES', categoria: 'GASTOS_OPERACIONALES', esMasUtilizada: true },
  { id: '21', nombre: 'REMUNERACIONES', categoria: 'GASTOS_OPERACIONALES', esMasUtilizada: true },
  { id: '22', nombre: 'OTROS GTOS. OPERACIONALES', categoria: 'GASTOS_OPERACIONALES' },
  
  // GASTOS GENERALES
  { id: '23', nombre: 'GTOS. CORRESPONDENCIA', categoria: 'GASTOS_GENERALES' },
  { id: '24', nombre: 'GTOS. COMUNES', categoria: 'GASTOS_GENERALES' },
  { id: '25', nombre: 'GTOS. LOCOMOCION', categoria: 'GASTOS_GENERALES' },
  { id: '26', nombre: 'GTOS. COLACION', categoria: 'GASTOS_GENERALES' },
  { id: '27', nombre: 'GTOS. NOTARIALES', categoria: 'GASTOS_GENERALES' },
  { id: '28', nombre: 'GTOS. DE PEAJES', categoria: 'GASTOS_GENERALES' },
  { id: '29', nombre: 'GTOS. DE FLETES Y TRANSPORTES', categoria: 'GASTOS_GENERALES' },
  { id: '30', nombre: 'GTOS. DE ESTACIONAMIENTO', categoria: 'GASTOS_GENERALES' },
  { id: '31', nombre: 'GTOS. GENERALES', categoria: 'GASTOS_GENERALES' },
  { id: '32', nombre: 'GTOS. BANCARIOS', categoria: 'GASTOS_GENERALES' },
  { id: '33', nombre: 'PATENTES Y CONTRIBUCIONES', categoria: 'GASTOS_GENERALES' },
  { id: '34', nombre: 'SERVICIOS Y ARTICULOS DE ASEO', categoria: 'GASTOS_GENERALES' },
  { id: '35', nombre: 'ROPA DE TRABAJO Y EPP', categoria: 'GASTOS_GENERALES' },
  { id: '36', nombre: 'MATERIALES Y REPUESTOS', categoria: 'GASTOS_GENERALES' },
  
  // OTROS
  { id: '37', nombre: 'CASTIGO DE EXISTENCIAS', categoria: 'OTROS' },
];

class CuentasContablesService {
  
  // Obtener todas las cuentas ordenadas (más utilizadas primero)
  async obtenerCuentasContables(): Promise<CuentaContable[]> {
    // Ordenar poniendo las más utilizadas primero, luego alfabéticamente
    return CUENTAS_CONTABLES.sort((a, b) => {
      if (a.esMasUtilizada && !b.esMasUtilizada) return -1;
      if (!a.esMasUtilizada && b.esMasUtilizada) return 1;
      return a.nombre.localeCompare(b.nombre);
    });
  }
  
  // Obtener cuentas más utilizadas (hardcodeadas)
  async obtenerCuentasMasUtilizadas(): Promise<CuentaContable[]> {
    return CUENTAS_CONTABLES.filter(cuenta => cuenta.esMasUtilizada);
  }
  
  // Registrar uso de una cuenta (no hace nada, mantenido por compatibilidad)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async registrarUsoCuenta(_cuentaId: string): Promise<void> {
      // No hacemos nada ya que no trackearemos frecuencia
      
    }
  
  // Método eliminado - las estadísticas ahora son monetarias y se calculan desde los gastos
  
  // Buscar cuentas por texto
  async buscarCuentas(texto: string): Promise<CuentaContable[]> {
    const cuentas = await this.obtenerCuentasContables();
    const textoLower = texto.toLowerCase();
    
    return cuentas.filter(cuenta => 
      cuenta.nombre.toLowerCase().includes(textoLower)
    );
  }
  
  // Obtener cuenta por ID
  async obtenerCuentaPorId(id: string): Promise<CuentaContable | null> {
    const cuentas = await this.obtenerCuentasContables();
    return cuentas.find(c => c.id === id) || null;
  }
  
  // Método eliminado
}

export const cuentasContablesService = new CuentasContablesService();
