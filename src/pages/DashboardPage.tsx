import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { getPropiedades } from "../api/propiedades";

const DashboardPage = () => {
  const usuario = useAuthStore(state => state.usuario)
  const [stats, setStats] = useState({
    total: 0,
    disponibles: 0,
    vendidas: 0,
    alquiladas: 0,
  })
  useEffect(() => {
    const cargarStats = async () => {
      try {
        const propiedades = await getPropiedades()
        setStats({
          total: propiedades.length,
          disponibles: propiedades.filter((p: any) => p.estado === 'disponible').length,
          vendidas: propiedades.filter((p: any) => p.estado === 'vendido').length,
          alquiladas: propiedades.filter((p: any) => p.estado === 'alquilado').length,
        })
      } catch (error) {
        console.error(error)
      }
    }

    cargarStats()
  }, [])

  const cards = [
    { label: 'Total propiedades', valor: stats.total, color: '#1a1a2e' },
    { label: 'Disponibles', valor: stats.disponibles, color: '#27ae60' },
    { label: 'Vendidas', valor: stats.vendidas, color: '#e74c3c' },
    { label: 'Alquiladas', valor: stats.alquiladas, color: '#f39c12' },
  ]

  return (
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: 500, marginBottom: '8px' }}>
        Bienvenido, {usuario?.nombre}
      </h1>
      <p style={{ color: '#888', fontSize: '14px', marginBottom: '32px' }}>
        Resumen general del sistema
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px',
      }}>
        {cards.map(card => (
          <div
            key={card.label}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              borderLeft: `4px solid ${card.color}`,
            }}
          >
            <p style={{ fontSize: '13px', color: '#888', marginBottom: '8px' }}>
              {card.label}
            </p>
            <p style={{ fontSize: '32px', fontWeight: 500, color: card.color }}>
              {card.valor}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DashboardPage;