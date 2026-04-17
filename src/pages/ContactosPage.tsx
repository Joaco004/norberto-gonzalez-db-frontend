import { useEffect, useState } from "react";
import client from "../api/client";

const ContactosPage = () => {
    const [contactos, setContactos] = useState<any[]>([])
    const [cargando, setCargando] = useState(true)
    const [filtro, setFiltro] = useState('')

    const cargarContactos = async () => {
        try {
            const { data } = await client.get('/contactos')
            setContactos(data)
        } catch (error) {
            console.error(error)
        } finally {
            setCargando(false)
        }
    }

    useEffect(() => {
        cargarContactos()
    }, [])

    const handleMarcarLeido = async (id: string) => {
        await client.patch(`/contactos/${id}/leido`)
        cargarContactos()
    }

    const handleCambiarEstado = async (id: string, estado: string) => {
        await client.patch(`/contactos/${id}/estado`, { estado })
        cargarContactos()
    }

    const handleEliminar = async (id: string) => {
        if (!confirm('¿Eliminar este contacto?')) return
        await client.delete(`/contacto/${id}`)
        cargarContactos()
    }

    const colorEstado = (estado: string) => {
        if (estado === 'pendiente') return { bg: '#fff3e0', color: '#f39c12' }
        if (estado === 'respondido') return { bg: '#e8f5e9', color: '#27ae60' }
        return { bg: '#f5f5f5', color: '#888' }
    }

    const formatFecha = (fecha: string) => {
        return new Date(fecha).toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    const contactosFiltrados = filtro
        ? contactos.filter(c => c.estado === filtro)
        : contactos

    const sinLeer = contactos.filter(c => !c.leido).length

    return (
        <div style={{ maxWidth: '800px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '22px', fontWeight: 500 }}>Contactos</h1>
                    <p style={{ color: '#888', fontSize: '14px' }}>
                        {contactos.length} consultas
                        {sinLeer > 0 && (
                            <span style={{
                                marginLeft: '8px',
                                backgroundColor: '#e74c3c',
                                color: 'white',
                                borderRadius: '20px',
                                padding: '2px 8px',
                                fontSize: '12px',
                            }}>
                                {sinLeer} sin leer
                            </span>
                        )}
                    </p>
                </div>

                <select
                    value={filtro}
                    onChange={e => setFiltro(e.target.value)}
                    style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }}
                >
                    <option value="">Todos</option>
                    <option value="pendiente">Pendientes</option>
                    <option value="respondido">Respondidos</option>
                    <option value="descartado">Descartados</option>
                </select>
            </div>

            {cargando ? (
                <p style={{ color: '#888', fontSize: '14px' }}>Cargando...</p>
            ) : contactosFiltrados.length === 0 ? (
                <p style={{ color: '#888', fontSize: '14px' }}>No hay contactos.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {contactosFiltrados.map(c => {
                        const { bg, color } = colorEstado(c.estado)
                        return (
                            <div
                                key={c._id}
                                style={{
                                    backgroundColor: 'white',
                                    borderRadius: '12px',
                                    padding: '20px',
                                    borderLeft: c.leido ? 'none' : '4px solid #1a1a2e',
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                            <p style={{ fontWeight: 500, fontSize: '15px' }}>{c.nombre}</p>
                                            {!c.leido && (
                                                <span style={{ fontSize: '11px', backgroundColor: '#1a1a2e', color: 'white', borderRadius: '20px', padding: '2px 8px' }}>
                                                    Nuevo
                                                </span>
                                            )}
                                        </div>
                                        <p style={{ fontSize: '13px', color: '#888' }}>{c.email} {c.telefono && `· ${c.telefono}`}</p>
                                    </div>
                                    <p style={{ fontSize: '12px', color: '#aaa' }}>{formatFecha(c.createdAt)}</p>
                                </div>

                                {c.propiedad && (
                                    <p style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
                                        Propiedad: {c.propiedad.titulo}
                                    </p>
                                )}

                                <p style={{ fontSize: '14px', color: '#555', marginBottom: '16px', lineHeight: '1.5' }}>
                                    {c.mensaje}
                                </p>

                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    <span style={{ fontSize: '12px', padding: '3px 10px', borderRadius: '20px', backgroundColor: bg, color }}>
                                        {c.estado}
                                    </span>

                                    {!c.leido && (
                                        <button
                                            onClick={() => handleMarcarLeido(c._id)}
                                            style={{ padding: '4px 12px', borderRadius: '8px', border: '1px solid #ddd', backgroundColor: 'white', fontSize: '12px', cursor: 'pointer' }}
                                        >
                                            Marcar como leído
                                        </button>
                                    )}

                                    <select
                                        value={c.estado}
                                        onChange={e => handleCambiarEstado(c._id, e.target.value)}
                                        style={{ padding: '4px 8px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '12px' }}
                                    >
                                        <option value="pendiente">Pendiente</option>
                                        <option value="respondido">Respondido</option>
                                        <option value="descartado">Descartado</option>
                                    </select>

                                    <button
                                        onClick={() => handleEliminar(c._id)}
                                        style={{ padding: '4px 12px', borderRadius: '8px', border: 'none', backgroundColor: '#e74c3c', color: 'white', fontSize: '12px', cursor: 'pointer' }}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default ContactosPage;