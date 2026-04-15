import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const Navbar = () => {
    const usuario = useAuthStore(state => state.usuario)
    const logout = useAuthStore(state => state.logout)
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <div style={{
            height: '60px',
            backgroundColor: 'white',
            borderBottom: '1px solid #eee',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
        }}>
            <span style={{ fontSize: '14px', color: '#555' }}>
                Hola, {usuario?.nombre}
            </span>

            <button onClick={handleLogout} style={{
                background: 'none',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '6px 14px',
                fontSize: '13px',
                cursor: 'pointer',
                color: '#555',
            }}
            >
                Cerrar sesión
            </button>
        </div>
    )
}

export default Navbar;