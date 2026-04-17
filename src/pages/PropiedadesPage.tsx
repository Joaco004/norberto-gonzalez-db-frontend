import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPropiedades } from "../api/propiedades";
import { getZonas } from "../api/zonas";
import type { IZona } from '../types/zona';

const PropiedadesPage = () => {
  const [propiedades, setPropiedades] = useState<any[]>([])
  const [cargando, setCargando] = useState(true)
  const [zonas, setZonas] = useState<IZona[]>([])
  const [filtros, setFiltros] = useState({
    tipo: '',
    operacion: '',
    estado: '',
    orderBy: '',
    zona: '',
  })

  const navigate = useNavigate()

  const cargarPropiedades = async () => {
    try {
      setCargando(true)
      const filtrosActivos = Object.fromEntries(
        Object.entries(filtros).filter(([_, v]) => v !== '')
      )
      const data = await getPropiedades(filtrosActivos)
      setPropiedades(data)
    } catch (error) {
      console.error(error)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    const cargarZonas = async () => {
      const data = await getZonas()
      setZonas(data)
    }
    cargarZonas()
  }, [])

  useEffect(() => {
    cargarPropiedades()
  }, [filtros])

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 500 }}>Propiedades</h1>
          <p style={{ color: '#888', fontSize: '14px' }}>{propiedades.length} propiedades encontradas</p>
        </div>
        <button
          onClick={() => navigate('/propiedades/nueva')}
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
          + Nueva propiedad
        </button>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <select
          value={filtros.tipo}
          onChange={e => setFiltros({ ...filtros, tipo: e.target.value })}
          style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }}
        >
          <option value="">Todos los tipos</option>
          <option value="casa">Casa</option>
          <option value="departamento">Departamento</option>
          <option value="local">Local</option>
          <option value="terreno">Terreno</option>
          <option value="oficina">Oficina</option>
          <option value="cochera">Cochera</option>
        </select>

        <select
          value={filtros.operacion}
          onChange={e => setFiltros({ ...filtros, operacion: e.target.value })}
          style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }}
        >
          <option value="">Todas las operaciones</option>
          <option value="venta">Venta</option>
          <option value="alquiler">Alquiler</option>
          <option value="alquiler-temporal">Alquiler temporal</option>
        </select>

        <select
          value={filtros.estado}
          onChange={e => setFiltros({ ...filtros, estado: e.target.value })}
          style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }}
        >
          <option value="">Todos los estados</option>
          <option value="disponible">Disponible</option>
          <option value="reservado">Reservado</option>
          <option value="vendido">Vendido</option>
          <option value="alquilado">Alquilado</option>
        </select>

        <select
          value={filtros.orderBy}
          onChange={e => setFiltros({ ...filtros, orderBy: e.target.value })}
          style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }}
        >
          <option value="">Más recientes</option>
          <option value="antiguos">Más antiguos</option>
          <option value="precio_asc">Precio: menor a mayor</option>
          <option value="precio_desc">Precio: mayor a menor</option>
        </select>

        <select
          value={filtros.zona}
          onChange={e => setFiltros({ ...filtros, zona: e.target.value })}
          style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }}
        >
          <option value="">Todas las zonas</option>
          {zonas.map(z => (
            <option key={z._id} value={z._id}>{z.nombre}</option>
          ))}
        </select>
      </div>

      {cargando ? (
        <p style={{ color: '#888', fontSize: '14px' }}>Cargando...</p>
      ) : propiedades.length === 0 ? (
        <p style={{ color: '#888', fontSize: '14px' }}>No hay propiedades con esos filtros.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {propiedades.map(p => (
            <div
              key={p._id}
              onClick={() => navigate(`/propiedades/${p._id}`)}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '20px',
                cursor: 'pointer',
                border: '1px solid #eee',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: '#888', textTransform: 'capitalize' }}>{p.tipo}</span>
                <span style={{
                  fontSize: '11px',
                  padding: '2px 8px',
                  borderRadius: '20px',
                  backgroundColor: p.estado === 'disponible' ? '#e8f5e9' : '#fff3e0',
                  color: p.estado === 'disponible' ? '#27ae60' : '#f39c12',
                }}>
                  {p.estado}
                </span>
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 500, marginBottom: '6px' }}>{p.titulo}</h3>
              <p style={{ fontSize: '13px', color: '#888', marginBottom: '12px' }}>
                {p.zona?.nombre} — {p.calle}
              </p>
              <p style={{ fontSize: '16px', fontWeight: 500, color: '#1a1a2e' }}>
                {p.moneda} {p.precio?.toLocaleString()}
              </p>
              <p style={{ fontSize: '12px', color: '#aaa', marginTop: '8px' }}>
                Cargado por {p.vendedor?.nombre}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PropiedadesPage;