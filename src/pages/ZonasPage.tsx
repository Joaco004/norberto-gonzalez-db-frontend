import { useEffect, useState } from "react";
import { getZonas, crearZona, eliminarZona } from "../api/zonas";
import type { IZona } from '../types/zona';

const ZonasPage = () => {
    const [zonas, setZonas] = useState<IZona[]>([])
    const [cargando, setCargando] = useState(true)
    const [mostrarForm, setMostrarForm] = useState(false)
    const [error, setError] = useState('')
    const [form, setForm] = useState({
        nombre: '',
        partido: '',
        provincia: 'Buenos Aires',
    })

    const cargarZonas = async () => {
        try {
            const data = await getZonas()
            setZonas(data)
        } catch (error) {
            console.error(error)
        } finally {
            setCargando(false)
        }
    }

    useEffect(() => {
        cargarZonas()
    }, [])

    const handleCrear = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        try {
            await crearZona(form)
            setForm({ nombre: '', partido: '', provincia: 'Buenos Aires' })
            setMostrarForm(false)
            cargarZonas()
        } catch (err) {
            setError('Error al crear la zona. Puede que ya exista.')
        }
    }

    const handleEliminar = async (id: string) => {
        if (!confirm('¿Estás seguro que querés eliminar esta zona?')) return
        await eliminarZona(id)
        cargarZonas()
    }

    const inputStyle = {
        width: '100%',
        padding: '10px 12px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        fontSize: '14px',
        boxSizing: 'border-box' as const,
    }

    const labelStyle = {
        display: 'block',
        fontSize: '13px',
        color: '#555',
        marginBottom: '6px',
    }

    return (
        <div style={{ maxWidth: '700px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '22px', fontWeight: 500 }}>Zonas</h1>
                    <p style={{ color: '#888', fontSize: '14px' }}>{zonas.length} zonas registradas</p>
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
                    {mostrarForm ? 'Cancelar' : '+ Nueva zona'}
                </button>
            </div>

            {mostrarForm && (
                <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '16px', fontWeight: 500, marginBottom: '16px' }}>Nueva zona</h2>
                    {error && (
                        <div style={{ background: '#fff0f0', color: '#c0392b', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleCrear}>
                        <div style={{ marginBottom: '12px' }}>
                            <label style={labelStyle}>Nombre</label>
                            <input
                                value={form.nombre}
                                onChange={e => setForm({ ...form, nombre: e.target.value })}
                                placeholder="Ej: Caseros"
                                required
                                style={inputStyle}
                            />
                        </div>
                        <div style={{ marginBottom: '12px' }}>
                            <label style={labelStyle}>Partido</label>
                            <input
                                value={form.partido}
                                onChange={e => setForm({ ...form, partido: e.target.value })}
                                placeholder="Ej: Tres de Febrero"
                                required
                                style={inputStyle}
                            />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={labelStyle}>Provincia</label>
                            <input
                                value={form.provincia}
                                onChange={e => setForm({ ...form, provincia: e.target.value })}
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
                            Crear zona
                        </button>
                    </form>
                </div>
            )}

            {cargando ? (
                <p style={{ color: '#888', fontSize: '14px' }}>Cargando...</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {zonas.map(z => (
                        <div
                            key={z._id}
                            style={{
                                backgroundColor: 'white',
                                borderRadius: '12px',
                                padding: '20px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <div>
                                <p style={{ fontWeight: 500, fontSize: '15px', marginBottom: '4px' }}>{z.nombre}</p>
                                <p style={{ fontSize: '13px', color: '#888' }}>{z.partido} — {z.provincia}</p>
                            </div>
                            <button
                                onClick={() => handleEliminar(z._id)}
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
                    ))}
                </div>
            )}
        </div>
    )
}

export default ZonasPage;