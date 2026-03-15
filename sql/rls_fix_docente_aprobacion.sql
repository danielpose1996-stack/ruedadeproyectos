-- ============================================================
-- FIX: Permisos para que el docente pueda crear proyectos
-- al aprobar una postulación (auto-promoción).
-- Ejecutar en Supabase → SQL Editor
-- ============================================================

-- Permitir a docentes y admins insertar en proyectos
CREATE POLICY "docentes_admin_insert_proyectos"
ON proyectos FOR INSERT TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM perfiles
        WHERE id = auth.uid() AND rol IN ('docente', 'admin')
    )
);

-- Permitir a docentes y admins insertar en proyecto_estudiantes
CREATE POLICY "docentes_admin_insert_proyecto_estudiantes"
ON proyecto_estudiantes FOR INSERT TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM perfiles
        WHERE id = auth.uid() AND rol IN ('docente', 'admin')
    )
);
