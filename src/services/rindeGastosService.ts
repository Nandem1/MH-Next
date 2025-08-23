export type EstadoGasto = 'pendiente' | 'aprobado' | 'rechazado';

export interface Gasto {
  id: string;
  descripcion: string;
  monto: number;
  fecha: Date;
  categoria?: string;
  cuentaContableId?: string;
  comprobante?: string;
  observaciones?: string;
  estado: EstadoGasto;
  fechaCreacion: Date;
  usuarioId?: string;
  nombreUsuario?: string;
}

// Interfaces simplificadas

class RindeGastosService {
  private readonly STORAGE_KEY = 'rinde_gastos_data';
  private readonly USUARIO_ACTUAL = 'usuario_actual'; // En producción vendría del contexto de auth
  
  // Simular datos iniciales para desarrollo
  private gastosIniciales: Gasto[] = [];
  
  private cargarGastos(): Gasto[] {
    if (typeof window === 'undefined') return this.gastosIniciales;
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const gastos = JSON.parse(stored);
        // Convertir strings de fecha a objetos Date
        return gastos.map((gasto: any) => ({
          ...gasto,
          fecha: new Date(gasto.fecha),
          fechaCreacion: new Date(gasto.fechaCreacion),
        }));
      }
      return this.gastosIniciales;
    } catch {
      return this.gastosIniciales;
    }
  }
  
  private guardarGastos(gastos: Gasto[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(gastos));
    } catch (error) {
      console.error('Error guardando gastos:', error);
    }
  }
  
  private generarId(): string {
    return `gasto_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // Método simplificado eliminado
  
  // Obtener todos los gastos
  async obtenerGastos(): Promise<Gasto[]> {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const gastos = this.cargarGastos();
    
    // Ordenar por fecha de creación (más recientes primero)
    return gastos.sort((a, b) => 
      new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()
    );
  }
  
  // Obtener gasto por ID
  async obtenerGastoPorId(id: string): Promise<Gasto | null> {
    const gastos = this.cargarGastos();
    return gastos.find(gasto => gasto.id === id) || null;
  }
  
  // Crear nuevo gasto
  async crearGasto(gastoData: Omit<Gasto, 'id' | 'fechaCreacion' | 'estado'>): Promise<Gasto> {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const gastos = this.cargarGastos();
    
    const nuevoGasto: Gasto = {
      ...gastoData,
      id: this.generarId(),
      estado: 'pendiente',
      fechaCreacion: new Date(),
      usuarioId: this.USUARIO_ACTUAL,
      nombreUsuario: 'Usuario Actual', // En producción vendría del contexto
    };
    
    const gastosActualizados = [nuevoGasto, ...gastos];
    this.guardarGastos(gastosActualizados);
    
    return nuevoGasto;
  }
  
  // Método eliminado para simplificar
  
  // Eliminar gasto
  async eliminarGasto(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const gastos = this.cargarGastos();
    const gastosFiltrados = gastos.filter(gasto => gasto.id !== id);
    
    if (gastos.length === gastosFiltrados.length) {
      throw new Error('Gasto no encontrado');
    }
    
    this.guardarGastos(gastosFiltrados);
  }
  
  // Métodos eliminados para simplificar
  
  // Método eliminado para simplificar
  
  // Método eliminado para simplificar
  
  // Método eliminado para simplificar
  
  // Validar gasto antes de crear/actualizar
  validarGasto(gastoData: Partial<Gasto>): { valido: boolean; errores: string[] } {
    const errores: string[] = [];
    
    if (!gastoData.descripcion?.trim()) {
      errores.push('La descripción es obligatoria');
    }
    
    if (!gastoData.monto || gastoData.monto <= 0) {
      errores.push('El monto debe ser mayor a 0');
    }
    
    if (gastoData.monto && gastoData.monto > 10000000) {
      errores.push('El monto no puede exceder $10.000.000');
    }
    
    if (!gastoData.fecha) {
      errores.push('La fecha es obligatoria');
    }
    
    if (gastoData.fecha && gastoData.fecha > new Date()) {
      errores.push('La fecha no puede ser futura');
    }
    
    return {
      valido: errores.length === 0,
      errores
    };
  }
  
  // Método eliminado
}

export const rindeGastosService = new RindeGastosService();
