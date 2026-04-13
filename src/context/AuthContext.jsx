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

        const userMeta = currentUser.user_metadata || {}
        let profileData = {
          id: currentUser.id,
          nombre: userMeta.nombre || currentUser.email,
          rol: userMeta.rol || 'estudiante',
        }

        // Override with actual DB values
        const { data: pData } = await supabase
          .from('perfiles')
          .select('nombre, rol, avatar_url')
          .eq('id', currentUser.id)
          .single()

        if (pData) {
          if (pData.nombre) profileData.nombre = pData.nombre
          if (pData.rol) profileData.rol = pData.rol
          if (pData.avatar_url) profileData.avatar_url = pData.avatar_url
        }

        setProfile(profileData)
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

    const userMeta = currentUser.user_metadata || {}
    let profileData = {
      id: currentUser.id,
      nombre: userMeta.nombre || currentUser.email,
      rol: userMeta.rol || 'estudiante',
    }

    // Override with DB data
    const { data: pData } = await supabase
      .from('perfiles')
      .select('nombre, rol, avatar_url')
      .eq('id', currentUser.id)
      .single()

    if (pData) {
      if (pData.nombre) profileData.nombre = pData.nombre
      if (pData.rol) profileData.rol = pData.rol
      if (pData.avatar_url) profileData.avatar_url = pData.avatar_url
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
