export function formatearRut(rut: string): string {
  // Dejar solo números y la letra K o k
  rut = rut.replace(/[^0-9kK]/g, '').toUpperCase();

  if (rut.length < 2) {
    return rut; // No tiene sentido formatear
  }

  const cuerpo = rut.slice(0, -1);
  const dv = rut.slice(-1);

  // Formatear el cuerpo con puntos
  let cuerpoFormateado = '';
  for (let i = cuerpo.length - 1, j = 1; i >= 0; i--, j++) {
    cuerpoFormateado = cuerpo[i] + cuerpoFormateado;
    if (j % 3 === 0 && i !== 0) {
      cuerpoFormateado = '.' + cuerpoFormateado;
    }
  }

  return `${cuerpoFormateado}-${dv}`;
}
