import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPropiedadById, eliminarPropiedad } from "../api/propiedades";
import { useAuthStore } from "../store/authStore";

const PropiedadDetallePage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const usuario = useAuthStore(state => state.usuario)
  const [propiedad, setPropiedad] = useState<any>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await getPropiedadById(id!)
        setPropiedad(data)
      } catch (error) {
        console.error(error)
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [id])

  const handleEliminar = async () => {
    if (!confirm('¿Estás seguro que querés eliminar esta propiedad?')) return
    try {
      await eliminarPropiedad(id!)
      navigate('/propiedades')
    } catch (error) {
      console.error(error)
    }
  }

  if (cargando) return <p style={{ color: '#888' }}>Cargando...</p>
  if (!propiedad) return <p style={{ color: '#888' }}>Propiedad no encontrada.</p>

  const puedeEditar = usuario?.esAdmin || usuario?.id === propiedad.vendedor?._id

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <button
          onClick={() => navigate('/propiedades')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: '14px' }}
        >
          ← Volver
        </button>

        {puedeEditar && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => navigate(`/propiedades/${id}/editar`)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                backgroundColor: 'white',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Editar
            </button>
            <button
              onClick={handleEliminar}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#e74c3c',
                color: 'white',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Eliminar
            </button>
          </div>
        )}
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 500, marginBottom: '6px' }}>{propiedad.titulo}</h1>
            <p style={{ color: '#888', fontSize: '14px' }}>{propiedad.zona?.nombre} — {propiedad.calle}</p>
          </div>
          <span style={{
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '13px',
            backgroundColor: propiedad.estado === 'disponible' ? '#e8f5e9' : '#fff3e0',
            color: propiedad.estado === 'disponible' ? '#27ae60' : '#f39c12',
          }}>
            {propiedad.estado}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Tipo', valor: propiedad.tipo },
            { label: 'Operación', valor: propiedad.operacion },
            { label: 'Precio', valor: `${propiedad.moneda} ${propiedad.precio?.toLocaleString()}` },
            { label: 'Ambientes', valor: propiedad.ambientes },
            { label: 'Dormitorios', valor: propiedad.dormitorios },
            { label: 'Baños', valor: propiedad.banos },
            { label: 'Sup. total', valor: propiedad.superficieTotal ? `${propiedad.superficieTotal} m²` : '-' },
            { label: 'Sup. cubierta', valor: propiedad.superficieCubierta ? `${propiedad.superficieCubierta} m²` : '-' },
            { label: 'Cochera', valor: propiedad.cochera ? 'Sí' : 'No' },
            { label: 'Antigüedad', valor: propiedad.antiguedad ? `${propiedad.antiguedad} años` : '-' },
            { label: 'Ficha', valor: propiedad.ficha ? `#${propiedad.ficha}` : '-' },
            { label: 'Cargado por', valor: propiedad.vendedor?.nombre },
          ].map(item => (
            <div key={item.label} style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '12px' }}>
              <p style={{ fontSize: '12px', color: '#aaa', marginBottom: '4px' }}>{item.label}</p>
              <p style={{ fontSize: '14px', textTransform: 'capitalize' }}>{item.valor ?? '-'}</p>
            </div>
          ))}
        </div>

        {propiedad.descripcion && (
          <div>
            <p style={{ fontSize: '12px', color: '#aaa', marginBottom: '6px' }}>Descripción</p>
            <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#555' }}>{propiedad.descripcion}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PropiedadDetallePage;