import { useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { cambiarPassword } from '../api/auth'

const PerfilPage = () => {
  const usuario = useAuthStore(state => state.usuario)
  const [form, setForm] = useState({
    passwordActual: '',
    passwordNueva: '',
    passwordConfirmar: '',
  })
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setExito('')

    if (form.passwordNueva !== form.passwordConfirmar) {
      setError('Las contraseñas nuevas no coinciden')
      return
    }

    if (form.passwordNueva.length < 6) {
      setError('La contraseña nueva debe tener al menos 6 caracteres')
      return
    }

    setCargando(true)

    try {
      await cambiarPassword(form.passwordActual, form.passwordNueva)
      setExito('Contraseña actualizada correctamente')
      setForm({ passwordActual: '', passwordNueva: '', passwordConfirmar: '' })
    } catch (err) {
      setError('La contraseña actual es incorrecta')
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

  return (
    <div style={{ maxWidth: '500px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: 500, marginBottom: '8px' }}>Mi perfil</h1>
      <p style={{ color: '#888', fontSize: '14px', marginBottom: '32px' }}>
        Administrá tu cuenta
      </p>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
        <p style={{ fontSize: '13px', color: '#aaa', marginBottom: '4px' }}>Nombre</p>
        <p style={{ fontSize: '15px', fontWeight: 500, marginBottom: '16px' }}>{usuario?.nombre}</p>
        <p style={{ fontSize: '13px', color: '#aaa', marginBottom: '4px' }}>Email</p>
        <p style={{ fontSize: '15px' }}>{usuario?.email}</p>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 500, marginBottom: '20px' }}>Cambiar contraseña</h2>

        {error && (
          <div style={{ background: '#fff0f0', color: '#c0392b', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        {exito && (
          <div style={{ background: '#e8f5e9', color: '#27ae60', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
            {exito}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Contraseña actual</label>
            <input
              type="password"
              value={form.passwordActual}
              onChange={e => setForm({ ...form, passwordActual: e.target.value })}
              required
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Contraseña nueva</label>
            <input
              type="password"
              value={form.passwordNueva}
              onChange={e => setForm({ ...form, passwordNueva: e.target.value })}
              required
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Confirmar contraseña nueva</label>
            <input
              type="password"
              value={form.passwordConfirmar}
              onChange={e => setForm({ ...form, passwordConfirmar: e.target.value })}
              required
              style={inputStyle}
            />
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
            }}
          >
            {cargando ? 'Guardando...' : 'Cambiar contraseña'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default PerfilPage