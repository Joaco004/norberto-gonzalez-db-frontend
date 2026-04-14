import { Navigate, Outlet } from "react-router-dom"
import { useAuthStore } from "../../store/authStore"

const RutaProtegida = () => {
    const autenticado = useAuthStore(state => state.autenticado)

    return autenticado ? <Outlet /> : <Navigate to="/login" replace />
}

export default RutaProtegida