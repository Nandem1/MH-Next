-- Migración para implementar nóminas híbridas
-- Fecha: 2024-12-19

-- 1. Agregar campo tipo_nomina a nominas_cantera
ALTER TABLE nominas_cantera 
ADD COLUMN tipo_nomina TEXT DEFAULT 'cheques' CHECK (tipo_nomina IN ('cheques', 'facturas', 'mixta'));

-- 2. Crear tabla nomina_factura
CREATE TABLE nomina_factura (
  id SERIAL PRIMARY KEY,
  id_nomina INTEGER NOT NULL REFERENCES nominas_cantera(id) ON DELETE CASCADE,
  id_factura INTEGER NOT NULL REFERENCES facturas(id) ON DELETE CASCADE,
  monto_asignado NUMERIC(12,2) NOT NULL CHECK (monto_asignado > 0),
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Índices para optimizar consultas
  CONSTRAINT idx_nomina_factura_unique UNIQUE(id_nomina, id_factura)
);

-- 3. Crear índices para nomina_factura
CREATE INDEX idx_nomina_factura_nomina ON nomina_factura(id_nomina);
CREATE INDEX idx_nomina_factura_factura ON nomina_factura(id_factura);
CREATE INDEX idx_nomina_factura_created_at ON nomina_factura(created_at);

-- 4. Agregar campo asignado_a_nomina a facturas
ALTER TABLE facturas 
ADD COLUMN asignado_a_nomina BOOLEAN DEFAULT FALSE;

-- 5. Crear índice para optimizar consultas de facturas no asignadas
CREATE INDEX idx_facturas_asignado_a_nomina ON facturas(asignado_a_nomina) WHERE asignado_a_nomina = FALSE;

-- 6. Crear función para validar balance de nóminas mixtas
CREATE OR REPLACE FUNCTION validar_balance_nomina_mixta(nomina_id INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
  total_facturas NUMERIC(12,2);
  total_cheques NUMERIC(12,2);
BEGIN
  -- Calcular total de facturas en la nómina
  SELECT COALESCE(SUM(monto_asignado), 0) INTO total_facturas
  FROM nomina_factura
  WHERE id_nomina = nomina_id;
  
  -- Calcular total de cheques en la nómina
  SELECT COALESCE(SUM(monto_asignado), 0) INTO total_cheques
  FROM nomina_cheque
  WHERE id_nomina = nomina_id;
  
  -- Retornar true si los montos son iguales (con tolerancia de 0.01)
  RETURN ABS(total_facturas - total_cheques) < 0.01;
END;
$$ LANGUAGE plpgsql;

-- 7. Crear trigger para actualizar asignado_a_nomina en facturas
CREATE OR REPLACE FUNCTION actualizar_asignado_a_nomina_factura()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Marcar factura como asignada
    UPDATE facturas 
    SET asignado_a_nomina = TRUE 
    WHERE id = NEW.id_factura;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Verificar si la factura sigue asignada a otra nómina
    IF NOT EXISTS (
      SELECT 1 FROM nomina_factura 
      WHERE id_factura = OLD.id_factura AND id_nomina != OLD.id_nomina
    ) THEN
      -- Marcar factura como no asignada
      UPDATE facturas 
      SET asignado_a_nomina = FALSE 
      WHERE id = OLD.id_factura;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 8. Crear trigger para nomina_factura
CREATE TRIGGER trigger_actualizar_asignado_a_nomina_factura
  AFTER INSERT OR DELETE ON nomina_factura
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_asignado_a_nomina_factura();

-- 9. Crear vista para nóminas con información completa
CREATE OR REPLACE VIEW v_nominas_completas AS
SELECT 
  nc.id,
  nc.numero_nomina,
  nc.fecha_emision,
  nc.estado,
  nc.tipo_nomina,
  nc.local_origen,
  nc.creado_por,
  nc.created_at,
  nc.updated_at,
  u.nombre as nombre_usuario,
  nc.id_usuario,
  
  -- Totales de facturas
  COALESCE(SUM(nf.monto_asignado), 0) as total_facturas,
  COUNT(DISTINCT nf.id_factura) as cantidad_facturas,
  
  -- Totales de cheques
  COALESCE(SUM(nc2.monto_asignado), 0) as total_cheques,
  COUNT(DISTINCT nc2.id_cheque) as cantidad_cheques,
  
  -- Balance
  (COALESCE(SUM(nf.monto_asignado), 0) - COALESCE(SUM(nc2.monto_asignado), 0)) as balance
  
FROM nominas_cantera nc
LEFT JOIN usuarios u ON nc.id_usuario = u.id
LEFT JOIN nomina_factura nf ON nc.id = nf.id_nomina
LEFT JOIN nomina_cheque nc2 ON nc.id = nc2.id_nomina
GROUP BY nc.id, nc.numero_nomina, nc.fecha_emision, nc.estado, nc.tipo_nomina, 
         nc.local_origen, nc.creado_por, nc.created_at, nc.updated_at, u.nombre, nc.id_usuario;

-- 10. Crear índice para optimizar la vista
CREATE INDEX idx_nominas_cantera_tipo_nomina ON nominas_cantera(tipo_nomina);

-- Comentarios para documentación
COMMENT ON COLUMN nominas_cantera.tipo_nomina IS 'Tipo de nómina: cheques, facturas, o mixta';
COMMENT ON TABLE nomina_factura IS 'Tabla intermedia para asignar facturas a nóminas';
COMMENT ON COLUMN facturas.asignado_a_nomina IS 'Indica si la factura está asignada a una nómina';
COMMENT ON FUNCTION validar_balance_nomina_mixta IS 'Valida que el total de facturas sea igual al total de cheques en una nómina mixta'; 