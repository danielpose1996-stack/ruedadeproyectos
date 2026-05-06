import { createContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore session on mount
  useEffect(() => {
    restoreSession()
  }, [])

  async function restoreSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error

      if (session && session.user) {
        const currentUser = session.user
        setUser(currentUser)

        // SECURITY: Always get role from the database (perfiles table),
        // NEVER from user_metadata which is user-editable
        const { data: pData, error: profileError } = await supabase
          .from('perfiles')
          .select('nombre, rol, avatar_url')
          .eq('id', currentUser.id)
          .single()

        if (profileError || !pData) {
          // If we can't verify the role from DB, do not grant any access
          console.error('Could not load profile from DB:', profileError?.message)
          setProfile(null)
          return
        }

        setProfile({
          id: currentUser.id,
          nombre: pData.nombre || currentUser.email,
          rol: pData.rol,
          avatar_url: pData.avatar_url || null,
        })
      }
    } catch (e) {
      console.error('Session restore err:', e)
    } finally {
      setLoading(false)
    }
  }

  async function login(email, password, expectedRole) {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      throw new Error('Autenticación fallida: Credenciales incorrectas o cuenta inexistente.')
    }

    const currentUser = authData.user
    setUser(currentUser)

    // SECURITY: Always get role from the database, never from user_metadata
    const { data: pData, error: profileError } = await supabase
      .from('perfiles')
      .select('nombre, rol, avatar_url')
      .eq('id', currentUser.id)
      .single()

    if (profileError || !pData) {
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
      throw new Error('No se pudo verificar tu perfil. Contacta al administrador.')
    }

    const profileData = {
      id: currentUser.id,
      nombre: pData.nombre || currentUser.email,
      rol: pData.rol,
      avatar_url: pData.avatar_url || null,
    }

    // Verify role matches
    if (profileData.rol !== expectedRole) {
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
      throw new Error(`No tienes permiso de "${expectedRole}". Tu rol asignado es: "${profileData.rol}".`)
    }

    setProfile(profileData)
    return profileData
  }

  async function logout() {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
