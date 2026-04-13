import { Routes, Route } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import ProtectedRoute from './components/shared/ProtectedRoute'

import HomePage from './pages/HomePage'
import GaleriaPage from './pages/GaleriaPage'
import ResultsPage from './pages/ResultsPage'
import LoginPage from './pages/LoginPage'
import EvaluacionPage from './pages/EvaluacionPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import DocenteDashboard from './pages/docente/DocenteDashboard'
import EstudianteDashboard from './pages/estudiante/EstudianteDashboard'

export default function App() {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-base">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-[3px] border-primary-200 border-t-primary rounded-full animate-spin mx-auto"></div>
          <p className="section-label">Cargando RuedaPro...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg-base">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/galeria" element={<GaleriaPage />} />
          <Route path="/resultados" element={<ResultsPage />} />
          <Route path="/login/:role" element={<LoginPage />} />

          <Route path="/dashboard/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/docente" element={<ProtectedRoute allowedRoles={['docente']}><DocenteDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/estudiante" element={<ProtectedRoute allowedRoles={['estudiante']}><EstudianteDashboard /></ProtectedRoute>} />
          <Route path="/evaluacion/:projectId" element={<ProtectedRoute allowedRoles={['docente']}><EvaluacionPage /></ProtectedRoute>} />

          <Route path="*" element={
            <div className="min-h-[60vh] flex items-center justify-center">
              <div className="text-center space-y-3">
                <div className="text-7xl font-bold text-slate-100">404</div>
                <p className="text-sm font-medium text-slate-400">Página no encontrada</p>
                <a href="/" className="btn-primary inline-flex text-xs">Volver al inicio</a>
              </div>
            </div>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
