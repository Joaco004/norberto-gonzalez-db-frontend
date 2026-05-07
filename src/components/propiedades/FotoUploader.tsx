import { useState, useRef } from 'react'
import { subirFotos, eliminarFoto } from '../../api/propiedades'

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
    const [arrastrando, setArrastrando] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const subirArchivos = async (archivos: FileList | File[]) => {
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
        }
    }

    const handleInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            await subirArchivos(e.target.files)
            e.target.value = ''
        }
    }

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setArrastrando(false)
        const archivos = e.dataTransfer.files
        if (archivos) await subirArchivos(archivos)
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setArrastrando(true)
    }

    const handleDragLeave = () => {
        setArrastrando(false)
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
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => inputRef.current?.click()}
                style={{
                    border: `2px dashed ${arrastrando ? '#1a1a2e' : '#ddd'}`,
                    borderRadius: '10px',
                    padding: '32px',
                    textAlign: 'center',
                    cursor: subiendo ? 'not-allowed' : 'pointer',
                    backgroundColor: arrastrando ? '#f0f0f8' : '#fafafa',
                    marginBottom: '20px',
                    transition: 'all 0.2s',
                }}
            >
                <input
                    ref={inputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleInput}
                    disabled={subiendo}
                    style={{ display: 'none' }}
                />
                <p style={{ fontSize: '32px', marginBottom: '8px' }}>📷</p>
                <p style={{ fontSize: '14px', color: '#555', marginBottom: '4px' }}>
                    {subiendo ? 'Subiendo fotos...' : 'Arrastrá las fotos acá o hacé clic para seleccionarlas'}
                </p>
                <p style={{ fontSize: '12px', color: '#aaa' }}>
                    Podés subir hasta 25 fotos a la vez
                </p>
            </div>

            {error && (
                <p style={{ color: '#e74c3c', fontSize: '13px', marginBottom: '12px' }}>{error}</p>
            )}

            {fotos.length === 0 ? (
                <p style={{ color: '#aaa', fontSize: '14px' }}>No hay fotos cargadas todavía.</p>
            ) : (
                <>
                    <p style={{ fontSize: '13px', color: '#888', marginBottom: '12px' }}>
                        {fotos.length} foto{fotos.length !== 1 ? 's' : ''} cargadas
                    </p>
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
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleEliminar(foto._id)
                                    }}
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
                </>
            )}
        </div>
    )
}

export default FotoUploader