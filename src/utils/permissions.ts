// Utilidades centralizadas de permisos y rutas

export const ROLES = {
  ADMIN: 1,
  SUPERVISOR: 2,
  EMPLEADO: 3,
} as const;

export const LOCALES = {
  LOCAL_1: 1,
  LOCAL_2: 2,
  LOCAL_3: 3,
} as const;

export interface AuthLikeUser {
  rol_id?: number;
  id_local?: number | null;
}

export const isAdmin = (user?: AuthLikeUser): boolean =>
  user?.rol_id === ROLES.ADMIN;
export const isSupervisor = (user?: AuthLikeUser): boolean =>
  user?.rol_id === ROLES.SUPERVISOR;
export const isEmpleado = (user?: AuthLikeUser): boolean =>
  user?.rol_id === ROLES.EMPLEADO;

export const isLocal = (user?: AuthLikeUser, localId?: number): boolean => {
  if (localId == null) return false;
  return user?.id_local === localId;
};

// Política actual: rutas restringidas visibles si es Admin o pertenece al Local 1
export const canAccessRestrictedRoutes = (user?: AuthLikeUser): boolean => {
  return Boolean(user) && (isAdmin(user) || isLocal(user, LOCALES.LOCAL_1));
};

// Reglas por ruta (escalables por rol y local)
export interface RouteRule {
	allowedRoles?: number[];
	allowedLocales?: number[];
}

export const ROUTE_RULES: Record<string, RouteRule> = {
	"/dashboard/auditoria-carteleria": { allowedRoles: [ROLES.SUPERVISOR], allowedLocales: [LOCALES.LOCAL_1] },
	"/dashboard/vencimientos": { allowedRoles: [ROLES.SUPERVISOR], allowedLocales: [LOCALES.LOCAL_1] },
	"/dashboard/control-vencimientos": { allowedRoles: [ROLES.SUPERVISOR], allowedLocales: [LOCALES.LOCAL_1] },
	"/dashboard/zebrai": { allowedRoles: [ROLES.SUPERVISOR], allowedLocales: [LOCALES.LOCAL_1] },
	"/dashboard/lector-dte": { allowedRoles: [ROLES.SUPERVISOR], allowedLocales: [LOCALES.LOCAL_1] },
  "/dashboard/bodega/inicio": { allowedRoles: [ROLES.SUPERVISOR], allowedLocales: [LOCALES.LOCAL_1] },
  "/dashboard/bodega/nuevo-movimiento": { allowedRoles: [ROLES.SUPERVISOR], allowedLocales: [LOCALES.LOCAL_1] },
  "/dashboard/bodega/stock-general": { allowedRoles: [ROLES.SUPERVISOR], allowedLocales: [LOCALES.LOCAL_1] },
  "/dashboard/rinde-gastos": {}, // Acceso permitido para todos los usuarios
};

export const canAccessRoute = (path: string, user?: AuthLikeUser): boolean => {
	// Admin siempre puede acceder
	if (isAdmin(user)) return true;

	const rule = ROUTE_RULES[path];
	if (!rule) return true; // Si no hay regla, acceso permitido

	const roleOk = !rule.allowedRoles || (user?.rol_id != null && rule.allowedRoles.includes(user.rol_id));
	const localOk = !rule.allowedLocales || (user?.id_local != null && rule.allowedLocales.includes(user.id_local));

	return roleOk && localOk;
};
