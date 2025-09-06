export interface Local {
  id: number;
  nombre: string;
  activo: boolean;
}

/**
 * Mapeo estático de locales del sistema
 * Actualizar según los locales disponibles en la base de datos
 */
export const LOCALES: Local[] = [
  { id: 1, nombre: "LA CANTERA 3055", activo: true },
  { id: 2, nombre: "LIBERTADOR 1476", activo: true },
  { id: 3, nombre: "BALMACEDA 599", activo: true },
  // Agregar más locales según sea necesario
];

/**
 * Obtener locales activos
 */
export function getLocalesActivos(): Local[] {
  return LOCALES.filter(local => local.activo);
}

/**
 * Obtener local por ID
 */
export function getLocalById(id: number): Local | undefined {
  return LOCALES.find(local => local.id === id);
}

/**
 * Obtener local por nombre
 */
export function getLocalByNombre(nombre: string): Local | undefined {
  return LOCALES.find(local => local.nombre.toLowerCase() === nombre.toLowerCase());
}
