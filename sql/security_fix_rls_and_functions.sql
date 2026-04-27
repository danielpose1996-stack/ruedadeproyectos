-- ============================================================
-- SECURITY FIX: Applied 2026-04-27
-- Replaces user_metadata references in RLS with perfiles.rol
-- Locks down function execution permissions
-- ============================================================

-- ============================================================
-- PART 1: RLS Policy Fixes (user_metadata → perfiles.rol)
-- ============================================================

-- 1. perfiles: "Admin write perfiles"
DROP POLICY IF EXISTS "Admin write perfiles" ON public.perfiles;
CREATE POLICY "Admin write perfiles" ON public.perfiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.perfiles p WHERE p.id = auth.uid() AND p.rol = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.perfiles p WHERE p.id = auth.uid() AND p.rol = 'admin')
  );

-- 2. proyectos: "Admin write proyectos"
DROP POLICY IF EXISTS "Admin write proyectos" ON public.proyectos;
CREATE POLICY "Admin write proyectos" ON public.proyectos
  FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.perfiles WHERE perfiles.id = auth.uid() AND perfiles.rol = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.perfiles WHERE perfiles.id = auth.uid() AND perfiles.rol = 'admin')
  );

-- 3. proyecto_evaluadores: "Admin write proyecto_evaluadores"
DROP POLICY IF EXISTS "Admin write proyecto_evaluadores" ON public.proyecto_evaluadores;
CREATE POLICY "Admin write proyecto_evaluadores" ON public.proyecto_evaluadores
  FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.perfiles WHERE perfiles.id = auth.uid() AND perfiles.rol = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.perfiles WHERE perfiles.id = auth.uid() AND perfiles.rol = 'admin')
  );

-- 4. proyecto_evaluadores: "Docente read own assignments"
DROP POLICY IF EXISTS "Docente read own assignments" ON public.proyecto_evaluadores;
CREATE POLICY "Docente read own assignments" ON public.proyecto_evaluadores
  FOR SELECT
  TO authenticated
  USING (
    evaluador_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.perfiles WHERE perfiles.id = auth.uid() AND perfiles.rol = 'admin')
  );

-- 5. proyecto_estudiantes: "Admin write proyecto_estudiantes"
DROP POLICY IF EXISTS "Admin write proyecto_estudiantes" ON public.proyecto_estudiantes;
CREATE POLICY "Admin write proyecto_estudiantes" ON public.proyecto_estudiantes
  FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.perfiles WHERE perfiles.id = auth.uid() AND perfiles.rol = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.perfiles WHERE perfiles.id = auth.uid() AND perfiles.rol = 'admin')
  );

-- 6. evaluaciones: "Admins can read all evaluaciones"
DROP POLICY IF EXISTS "Admins can read all evaluaciones" ON public.evaluaciones;
CREATE POLICY "Admins can read all evaluaciones" ON public.evaluaciones
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.perfiles WHERE perfiles.id = auth.uid() AND perfiles.rol = 'admin')
  );

-- 7. evaluaciones: "Docentes insert their evaluaciones"
DROP POLICY IF EXISTS "Docentes insert their evaluaciones" ON public.evaluaciones;
CREATE POLICY "Docentes insert their evaluaciones" ON public.evaluaciones
  FOR INSERT
  TO authenticated
  WITH CHECK (
    evaluador_id = auth.uid()
    AND EXISTS (SELECT 1 FROM public.perfiles WHERE perfiles.id = auth.uid() AND perfiles.rol = 'docente')
  );

-- ============================================================
-- PART 2: Function Security Fixes
-- ============================================================

-- Revoke EXECUTE on handle_new_user from everyone except service_role/postgres
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, PUBLIC;

-- Revoke EXECUTE on update_postulacion_timestamp from PUBLIC
REVOKE EXECUTE ON FUNCTION public.update_postulacion_timestamp() FROM PUBLIC;

-- Set immutable search_path on both functions
ALTER FUNCTION public.handle_new_user() SET search_path = '';
ALTER FUNCTION public.update_postulacion_timestamp() SET search_path = '';
