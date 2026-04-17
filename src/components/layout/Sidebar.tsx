import { NavLink } from "react-router-dom";
import { useAuthStore } from '../../store/authStore'

const Sidebar = () => {
    const usuario = useAuthStore(state => state.usuario)

    const linkStyle = {
        display: 'block',
        padding: '10px 16px',
        borderRadius: '8px',
        textDecoration: 'none',
        fontSize: '14px',
        color: '#555',
        marginBottom: '4px',
    }

    const activeLinkStyle = {
        ...linkStyle,
        backgroundColor: '#f0f0f0',
        color: '#1a1a2e',
        fontWeigth: 500,
    }
    return (
        <div style={{
            width: '220px',
            backgroundColor: 'white',
            borderRight: '1px solid #eee',
            padding: '24px 16px',
            display: 'flex',
            flexDirection: 'column',
        }}>
            <div style={{ marginBottom: '32px', paddingLeft: '8px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 500 }}>Norberto González</h2>
                <p style={{ fontSize: '12px', color: '#aaa', marginTop: '4px' }}>Panel interno</p>
            </div>

            <nav>
                <NavLink to="/" end style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}
                >
                    Dashboard
                </NavLink>
                <NavLink
                    to="/propiedades"
                    style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}
                >
                    Propiedades
                </NavLink>

                {usuario?.esAdmin && (
                    <>
                        <NavLink
                            to="/vendedores"
                            style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}
                        >
                            Vendedores
                        </NavLink>
                        <NavLink to="/zonas" style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}>
                            Zonas
                        </NavLink>
                        <NavLink
                            to="/historial"
                            style={({ isActive }) => isActive ? activeLinkStyle : linkStyle}
                        >
                            Centro de registros
                        </NavLink>
                    </>
                )}
            </nav>
        </div>
    )
}

export default Sidebar;