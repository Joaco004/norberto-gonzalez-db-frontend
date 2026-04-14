import client from './client'

export const getPropiedades = async (filtros?: Record<string, unknown>) => {
  const { data } = await client.get('/propiedades', { params: filtros })
  return data
}

export const getPropiedadById = async (id: string) => {
  const { data } = await client.get(`/propiedades/${id}`)
  return data
}

export const crearPropiedad = async (propiedad: FormData) => {
  const { data } = await client.post('/propiedades', propiedad)
  return data
}

export const editarPropiedad = async (id: string, propiedad: Record<string, unknown>) => {
  const { data } = await client.put(`/propiedades/${id}`, propiedad)
  return data
}

export const eliminarPropiedad = async (id: string) => {
  const { data } = await client.delete(`/propiedades/${id}`)
  return data
}