import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPropiedadById, editarPropiedad } from '../api/propiedades';
import { getZonas } from '../api/zonas';
import type { IZona } from '../types/zona'

const EditarPropiedadPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [zonas, setZonas] = useState<IZona[]>([])
  const [cargando, setCargando] = useState(false)
  const [cargandoDatos, setCargandoDatos] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    tipo: 'casa',
    operacion: 'venta',
    precio: '',
    moneda: 'USD',
    ambientes: '',
    dormitorios: '',
    banos: '',
    superficieTotal: '',
    superficieCubierta: '',
    cochera: false,
    antiguedad: '',
    estado: 'disponible',
    destacada: false,
    publicada: true,
    zona: '',
    calle: '',
    ficha: '',
  })

  useEffect(() => {
    const cargar = async () => {
      try {
        const [propiedad, zonasData] = await Promise.all([
          getPropiedadById(id!),
          getZonas(),
        ])
        setZonas(zonasData)
        setForm({
          titulo: propiedad.titulo || '',
          descripcion: propiedad.descripcion || '',
          tipo: propiedad.tipo || 'casa',
          operacion: propiedad.operacion || 'venta',
          precio: propiedad.precio || '',
          moneda: propiedad.moneda || 'USD',
          ambientes: propiedad.ambientes || '',
          dormitorios: propiedad.dormitorios || '',
          banos: propiedad.banos || '',
          superficieTotal: propiedad.superficieTotal || '',
          superficieCubierta: propiedad.superficieCubierta || '',
          cochera: propiedad.cochera || false,
          antiguedad: propiedad.antiguedad || '',
          estado: propiedad.estado || 'disponible',
          destacada: propiedad.destacada || false,
          publicada: propiedad.publicada ?? true,
          zona: propiedad.zona?._id || '',
          calle: propiedad.calle || '',
          ficha: propiedad.ficha || '',
        })
      } catch (error) {
        console.error(error)
      } finally {
        setCargandoDatos(false)
      }
    }
    cargar()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setCargando(true)

    try {
      const payload: Record<string, unknown> = {
        ...form,
        precio: Number(form.precio),
        ambientes: form.ambientes ? Number(form.ambientes) : undefined,
        dormitorios: form.dormitorios ? Number(form.dormitorios) : undefined,
        banos: form.banos ? Number(form.banos) : undefined,
        superficieTotal: form.superficieTotal ? Number(form.superficieTotal) : undefined,
        superficieCubierta: form.superficieCubierta ? Number(form.superficieCubierta) : undefined,
        antiguedad: form.antiguedad ? Number(form.antiguedad) : undefined,
        ficha: form.ficha ? Number(form.ficha) : undefined,
      }

      await editarPropiedad(id!, payload)
      navigate(`/propiedades/${id}`)
    } catch (err) {
      setError('Error al guardar los cambios. Revisá los campos.')
    } finally {
      setCargando(false)
    }
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

  const fieldStyle = { marginBottom: '16px' }

  if (cargandoDatos) return <p style={{ color: '#888' }}>Cargando...</p>

  return (
    <div style={{ maxWidth: '700px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <button
          onClick={() => navigate(`/propiedades/${id}`)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: '14px' }}
        >
          ← Volver
        </button>
        <h1 style={{ fontSize: '22px', fontWeight: 500 }}>Editar propiedad</h1>
      </div>

      {error && (
        <div style={{ background: '#fff0f0', color: '#c0392b', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ ...fieldStyle, gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Título *</label>
            <input name="titulo" value={form.titulo} onChange={handleChange} required style={inputStyle} />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Tipo *</label>
            <select name="tipo" value={form.tipo} onChange={handleChange} style={inputStyle}>
              <option value="casa">Casa</option>
              <option value="departamento">Departamento</option>
              <option value="local">Local</option>
              <option value="terreno">Terreno</option>
              <option value="oficina">Oficina</option>
              <option value="cochera">Cochera</option>
            </select>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Operación *</label>
            <select name="operacion" value={form.operacion} onChange={handleChange} style={inputStyle}>
              <option value="venta">Venta</option>
              <option value="alquiler">Alquiler</option>
              <option value="alquiler-temporal">Alquiler temporal</option>
            </select>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Precio *</label>
            <input name="precio" type="number" value={form.precio} onChange={handleChange} required style={inputStyle} />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Moneda</label>
            <select name="moneda" value={form.moneda} onChange={handleChange} style={inputStyle}>
              <option value="USD">USD</option>
              <option value="ARS">ARS</option>
            </select>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Zona *</label>
            <select name="zona" value={form.zona} onChange={handleChange} required style={inputStyle}>
              <option value="">Seleccioná una zona</option>
              {zonas.map(z => (
                <option key={z._id} value={z._id}>{z.nombre}</option>
              ))}
            </select>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Calle</label>
            <input name="calle" value={form.calle} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Ambientes</label>
            <input name="ambientes" type="number" value={form.ambientes} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Dormitorios</label>
            <input name="dormitorios" type="number" value={form.dormitorios} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Baños</label>
            <input name="banos" type="number" value={form.banos} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Sup. total (m²)</label>
            <input name="superficieTotal" type="number" value={form.superficieTotal} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Sup. cubierta (m²)</label>
            <input name="superficieCubierta" type="number" value={form.superficieCubierta} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Antigüedad (años)</label>
            <input name="antiguedad" type="number" value={form.antiguedad} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Ficha</label>
            <input name="ficha" type="number" value={form.ficha} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Estado</label>
            <select name="estado" value={form.estado} onChange={handleChange} style={inputStyle}>
              <option value="disponible">Disponible</option>
              <option value="reservado">Reservado</option>
              <option value="vendido">Vendido</option>
              <option value="alquilado">Alquilado</option>
            </select>
          </div>

          <div style={{ ...fieldStyle, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input name="cochera" type="checkbox" checked={form.cochera} onChange={handleChange} />
            <label style={{ fontSize: '13px', color: '#555' }}>Tiene cochera</label>
          </div>

          <div style={{ ...fieldStyle, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input name="destacada" type="checkbox" checked={form.destacada} onChange={handleChange} />
            <label style={{ fontSize: '13px', color: '#555' }}>Destacada</label>
          </div>

          <div style={{ ...fieldStyle, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input name="publicada" type="checkbox" checked={form.publicada} onChange={handleChange} />
            <label style={{ fontSize: '13px', color: '#555' }}>Publicada en la web</label>
          </div>

          <div style={{ ...fieldStyle, gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Descripción</label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              rows={4}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={cargando}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: cargando ? '#aaa' : '#1a1a2e',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '15px',
            cursor: cargando ? 'not-allowed' : 'pointer',
            marginTop: '8px',
          }}
        >
          {cargando ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  )
}

export default EditarPropiedadPage;