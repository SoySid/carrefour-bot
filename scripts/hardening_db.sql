-- Script de endurecimiento y control de acceso para PostgreSQL en Neon
-- Ejecutar en la consola SQL de Neon

-- 1. Habilitar extensión Row Level Security (RLS) en las tablas públicas
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE historial_precios ENABLE ROW LEVEL SECURITY;

-- 2. Eliminar políticas existentes si las hubiera para evitar duplicados
DROP POLICY IF EXISTS p_read_productos ON productos;
DROP POLICY IF EXISTS p_modify_productos ON productos;
DROP POLICY IF EXISTS p_read_historial ON historial_precios;
DROP POLICY IF EXISTS p_modify_historial ON historial_precios;

-- 3. Políticas de lectura pública: cualquier rol puede consultar datos
CREATE POLICY p_read_productos ON productos
    FOR SELECT
    USING (true);

CREATE POLICY p_read_historial ON historial_precios
    FOR SELECT
    USING (true);

-- 4. Políticas de escritura restringidas al rol propietario/administrador
-- Nota: En Neon el usuario inicial creado suele ser neondb_owner o postgres
CREATE POLICY p_modify_productos ON productos
    FOR ALL
    TO CURRENT_USER
    USING (true)
    WITH CHECK (true);

CREATE POLICY p_modify_historial ON historial_precios
    FOR ALL
    TO CURRENT_USER
    USING (true)
    WITH CHECK (true);

-- 5. Creación de rol de solo lectura opcional para la aplicación Web (Vercel)
-- Permite que la API pública no tenga capacidad destructiva ante fuga de credenciales
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'web_readonly') THEN
        CREATE ROLE web_readonly WITH LOGIN PASSWORD 'definir_password_seguro_aqui';
    END IF;
END
$$;

GRANT CONNECT ON DATABASE neondb TO web_readonly;
GRANT USAGE ON SCHEMA public TO web_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO web_readonly;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO web_readonly;
