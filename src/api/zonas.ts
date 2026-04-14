import client from './client'

export const getZonas = async () => {
  const { data } = await client.get('/zonas')
  return data
}

export const crearZona = async (zona: Record<string, unknown>) => {
  const { data } = await client.post('/zonas', zona)
  return data
}

export const eliminarZona = async (id: string) => {
  const { data } = await client.delete(`/zonas/${id}`)
  return data
}