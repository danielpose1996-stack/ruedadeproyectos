-- ============================================================
-- STORAGE POLICIES: bucket "postulaciones-docs"
-- Ejecutar en Supabase → SQL Editor
-- ============================================================

-- Permitir a usuarios autenticados subir archivos
CREATE POLICY "Autenticados pueden subir postulaciones"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'postulaciones-docs');

-- Permitir a usuarios autenticados leer/descargar archivos
CREATE POLICY "Autenticados pueden leer postulaciones"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'postulaciones-docs');

-- Permitir al dueño del archivo eliminarlo (opcional)
CREATE POLICY "Dueño puede eliminar su postulacion"
ON storage.objects FOR DELETE TO authenticated
USING (
    bucket_id = 'postulaciones-docs'
    AND (storage.foldername(name))[1] = auth.uid()::text
);
