import { useState } from 'react';
import { subirFotos, eliminarFoto } from '../../api/propiedades';

interface Foto {
    _id: string
    url: string
    principal: boolean
    orden: number
}

interface Props {
    propiedadId: string
    fotos: Foto[]
    onActualizar: () => void
}

const FotoUploader = ({ propiedadId, fotos, onActualizar }: Props) => {
    const [subiendo, setSubiendo] = useState(false)
    const [error, setError] = useState('')

    const handleSubir = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const archivos = e.target.files
        if (!archivos || archivos.length === 0) return

        setSubiendo(true)
        setError('')

        try {
            const formData = new FormData()
            Array.from(archivos).forEach(archivo => {
                formData.append('fotos', archivo)
            })
            await subirFotos(propiedadId, formData)
            onActualizar()
        } catch (err) {
            setError('Error al subir las fotos')
        } finally {
            setSubiendo(false)
            e.target.value = ''
        }
    }

    const handleEliminar = async (fotoId: string) => {
        if (!confirm('¿Eliminar esta foto?')) return
        try {
            await eliminarFoto(propiedadId, fotoId)
            onActualizar()
        } catch (err) {
            setError('Error al eliminar la foto')
        }
    }

    return (
        <div>
            <div style={{ marginBottom: '16px' }}>
                <label
                    style={{
                        display: 'inline-block',
                        padding: '10px 20px',
                        backgroundColor: '#1a1a2e',
                        color: 'white',
                        borderRadius: '8px',
                        cursor: subiendo ? 'not-allowed' : 'pointer',
                        fontSize: '14px',
                        opacity: subiendo ? 0.7 : 1,
                    }}
                >
                    {subiendo ? 'Subiendo...' : '+ Agregar fotos'}
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleSubir}
                        disabled={subiendo}
                        style={{ display: 'none' }}
                    />
                </label>
                <span style={{ fontSize: '13px', color: '#888', marginLeft: '12px' }}>
                    {fotos.length} foto{fotos.length !== 1 ? 's' : ''}
                </span>
            </div>

            {error && (
                <p style={{ color: '#e74c3c', fontSize: '13px', marginBottom: '12px' }}>{error}</p>
            )}

            {fotos.length === 0 ? (
                <p style={{ color: '#aaa', fontSize: '14px' }}>No hay fotos cargadas todavía.</p>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                    gap: '12px',
                }}>
                    {fotos.map(foto => (
                        <div
                            key={foto._id}
                            style={{
                                position: 'relative',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                border: foto.principal ? '3px solid #1a1a2e' : '1px solid #eee',
                            }}
                        >
                            <img
                                src={foto.url}
                                alt="foto propiedad"
                                style={{ width: '100%', height: '120px', objectFit: 'cover', display: 'block' }}
                            />
                            {foto.principal && (
                                <span style={{
                                    position: 'absolute',
                                    top: '6px',
                                    left: '6px',
                                    backgroundColor: '#1a1a2e',
                                    color: 'white',
                                    fontSize: '10px',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                }}>
                                    Principal
                                </span>
                            )}
                            <button
                                onClick={() => handleEliminar(foto._id)}
                                style={{
                                    position: 'absolute',
                                    top: '6px',
                                    right: '6px',
                                    backgroundColor: '#e74c3c',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    width: '24px',
                                    height: '24px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default FotoUploader;