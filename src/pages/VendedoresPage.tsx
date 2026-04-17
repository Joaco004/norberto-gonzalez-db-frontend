import { useEffect, useState } from "react";
import { getUsuarios, crearUsuario, toggleUsuario, eliminarUsuario } from "../api/usuarios";

const VendedoresPage = () => {
    const [vendedores, setVendedores] = useState<any[]>([])
    const [cargando, setCargando] = useState(true)
    const [mostrarForm, setMostrarForm] = useState(false)
    const [form, setForm] = useState({ nombre: '', email: '', password: '' })
    const [error, setError] = useState('')

    const cargarVendedores = async () => {
        try {
            const data = await getUsuarios()
            setVendedores(data)
        } catch (error) {
            console.error(error)
        } finally {
            setCargando(false)
        }
    }

    useEffect(() => {
        cargarVendedores()
    }, [])

    const handleCrear = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        try {
            await crearUsuario(form)
            setForm({ nombre: '', email: '', password: '' })
            setMostrarForm(false)
            cargarVendedores()
        } catch (err) {
            setError('Error al crear el vendedor. El email puede estar en uso.')
        }
    }

    const handleToggle = async (id: string) => {
        await toggleUsuario(id)
        cargarVendedores()
    }

    const handleEliminar = async (id: string) => {
        if (!confirm('¿Estás seguro que querés eliminar este vendedor?')) return
        await eliminarUsuario(id)
        cargarVendedores()
    }

    const inputStyle = {
        width: '100%',
        padding: '10px 12px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        fontSize: '14px',
        boxSizing: 'border-box' as const,
    }

    return (
        <div style={{ maxWidth: '700px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '22px', fontWeight: 500 }}>Vendedores</h1>
                    <p style={{ color: '#888', fontSize: '14px' }}>{vendedores.length} vendedores registrados</p>
                </div>
                <button
                    onClick={() => setMostrarForm(!mostrarForm)}
                    style={{
                        backgroundColor: '#1a1a2e',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '10px 20px',
                        fontSize: '14px',
                        cursor: 'pointer',
                    }}
                >
                    {mostrarForm ? 'Cancelar' : '+ Nuevo vendedor'}
                </button>
            </div>

            {mostrarForm && (
                <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '16px', fontWeight: 500, marginBottom: '16px' }}>Nuevo vendedor</h2>
                    {error && (
                        <div style={{ background: '#fff0f0', color: '#c0392b', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleCrear}>
                        <div style={{ marginBottom: '12px' }}>
                            <label style={{ display: 'block', fontSize: '13px', color: '#555', marginBottom: '6px' }}>Nombre</label>
                            <input
                                value={form.nombre}
                                onChange={e => setForm({ ...form, nombre: e.target.value })}
                                required
                                style={inputStyle}
                            />
                        </div>
                        <div style={{ marginBottom: '12px' }}>
                            <label style={{ display: 'block', fontSize: '13px', color: '#555', marginBottom: '6px' }}>Email</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                required
                                style={inputStyle}
                            />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '13px', color: '#555', marginBottom: '6px' }}>Contraseña</label>
                            <input
                                type="password"
                                value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                                required
                                style={inputStyle}
                            />
                        </div>
                        <button
                            type="submit"
                            style={{
                                width: '100%',
                                padding: '10px',
                                backgroundColor: '#1a1a2e',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '14px',
                                cursor: 'pointer',
                            }}
                        >
                            Crear vendedor
                        </button>
                    </form>
                </div>
            )}

            {cargando ? (
                <p style={{ color: '#888', fontSize: '14px' }}>Cargando...</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {vendedores.map(v => (
                        <div
                            key={v._id}
                            style={{
                                backgroundColor: 'white',
                                borderRadius: '12px',
                                padding: '20px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                opacity: v.activo ? 1 : 0.5,
                            }}
                        >
                            <div>
                                <p style={{ fontWeight: 500, fontSize: '15px', marginBottom: '4px' }}>{v.nombre}</p>
                                <p style={{ fontSize: '13px', color: '#888' }}>{v.email}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <span style={{
                                    fontSize: '12px',
                                    padding: '3px 10px',
                                    borderRadius: '20px',
                                    backgroundColor: v.activo ? '#e8f5e9' : '#f5f5f5',
                                    color: v.activo ? '#27ae60' : '#888',
                                }}>
                                    {v.activo ? 'Activo' : 'Inactivo'}
                                </span>
                                <button
                                    onClick={() => handleToggle(v._id)}
                                    style={{
                                        padding: '6px 12px',
                                        borderRadius: '8px',
                                        border: '1px solid #ddd',
                                        backgroundColor: 'white',
                                        fontSize: '13px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {v.activo ? 'Desactivar' : 'Activar'}
                                </button>
                                <button
                                    onClick={() => handleEliminar(v._id)}
                                    style={{
                                        padding: '6px 12px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        backgroundColor: '#e74c3c',
                                        color: 'white',
                                        fontSize: '13px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default VendedoresPage;