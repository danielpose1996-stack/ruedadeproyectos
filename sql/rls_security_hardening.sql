-- ==========================================
-- RUEDAPRO UNIPAZ: SECURITY HARDENING
-- RUN THIS SCRIPT IN YOUR SUPABASE SQL EDITOR
-- ==========================================

-- 1. Restricciones en tabla 'perfiles'
DROP POLICY IF EXISTS "Public read perfiles" ON public.perfiles;

-- Los usuarios logueados pueden ver los perfiles (necesario para selects y asignaciones)
CREATE POLICY "Authenticated read perfiles" ON public.perfiles 
FOR SELECT 
TO authenticated 
USING (true);

-- Los usuarios no logueados (público general) solo pueden leer los nombres de los estudiantes 
-- de proyectos ganadores (en estado 'Evaluado') para que funcione el Ranking Público.
CREATE POLICY "Public read evaluated estudiantes" ON public.perfiles 
FOR SELECT 
TO anon
USING (
    EXISTS (
        SELECT 1 FROM public.proyecto_estudiantes pe
        JOIN public.proyectos p ON p.id = pe.proyecto_id
        WHERE pe.estudiante_id = perfiles.id
        AND p.estado = 'Evaluado'
    )
);

-- 2. Restricciones en tabla 'evaluaciones'
DROP POLICY IF EXISTS "Public read evaluaciones" ON public.evaluaciones;

-- Los docentes, estudiantes y administradores pueden leer evaluaciones
CREATE POLICY "Authenticated read evaluaciones" ON public.evaluaciones 
FOR SELECT 
TO authenticated 
USING (true);

-- Los usuarios públicos (anon) solo pueden consultar evaluaciones de proyectos 'Evaluados'
-- (Para permitir que el tablero de resultados públicos obtenga el puntaje final).
CREATE POLICY "Public read evaluated evaluaciones" ON public.evaluaciones 
FOR SELECT 
TO anon
USING (
    EXISTS (
        SELECT 1 FROM public.proyectos p
        WHERE p.id = evaluaciones.proyecto_id
        AND p.estado = 'Evaluado'
    )
);
