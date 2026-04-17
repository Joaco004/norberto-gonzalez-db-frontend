import { useEffect, useState } from "react";
import client from "../api/client";

const HistorialPage = () => {
    const [historial, setHistorial] = useState<any[]>([])
    const [cargando, setCargando] = useState(true)

    useEffect(() => {
        const cargar = async () => {
            try {
                const { data } = await client.get('/historial')
                setHistorial(data)
            } catch (error) {
                console.error(error)
            } finally {
                setCargando(false)
            }
        }
        cargar()
    }, [])

    const colorAccion = (accion: string) => {
        if (accion === 'neuva_propiedad') return { bg: '#e8f5e9', color: '#27ae60' }
        if (accion === 'edicion') return { bg: '#fff3e0', color: '#f39c12' }
        return { bg: '#fff0f0', color: '#e74c3c' }
    }

    const labelAccion = (accion: string) => {
        if (accion === 'neuva_propiedad') return 'Nueva propiedad'
        if (accion === 'edicion') return 'Edición'
        return 'Eliminación'
    }

    const formatFecha = (fecha: string) => {
        const d = new Date(fecha)
        return d.toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    return (
        <div style={{ maxWidth: '800px' }}>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '22px', fontWeight: 500 }}>Centro de registros</h1>
                <p style={{ color: '#888', fontSize: '14px' }}>{historial.length} acciones registradas</p>
            </div>

            {cargando ? (
                <p style={{ color: '#888', fontSize: '14px' }}>Cargando...</p>
            ) : historial.length === 0 ? (
                <p style={{ color: '#888', fontSize: '14px' }}>No hay registros todavía.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {historial.map(h => {
                        const { bg, color } = colorAccion(h.accion)
                        return (
                            <div
                                key={h._id}
                                style={{
                                    backgroundColor: 'white',
                                    borderRadius: '12px',
                                    padding: '20px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    gap: '16px',
                                }}
                            >
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                        <span style={{
                                            fontSize: '12px',
                                            padding: '3px 10px',
                                            borderRadius: '20px',
                                            backgroundColor: bg,
                                            color: color,
                                        }}>
                                            {labelAccion(h.accion)}
                                        </span>
                                        <span style={{ fontSize: '13px', fontWeight: 500 }}>
                                            {h.vendedor?.nombre}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: '13px', color: '#555' }}>{h.detalle}</p>
                                </div>
                                <p style={{ fontSize: '12px', color: '#aaa', whiteSpace: 'nowrap' }}>
                                    {formatFecha(h.createdAt)}
                                </p>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default HistorialPage;