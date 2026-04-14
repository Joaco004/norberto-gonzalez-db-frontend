import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import PropiedadesPage from './pages/PropiedadesPage'
import NuevaPropiedadPage from './pages/NuevaPropiedad'
import EditarPropiedadPage from './pages/EditarPropiedad'
import PropiedadDetallePage from './pages/PropiedadDetallePage'
import AppLayout from './components/layout/AppLayout'
import RutaProtegida from './components/layout/RutaProtegida'

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<RutaProtegida />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/propiedades" element={<PropiedadesPage />} />
          <Route path="/propiedades/nueva" element={<NuevaPropiedadPage />} />
          <Route path="/propiedades/:id" element={<PropiedadDetallePage />} />
          <Route path="/propiedades/:id/editar" element={<EditarPropiedadPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App