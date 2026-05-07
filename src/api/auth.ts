import client from './client';

export const login = async (email: string, password: string) => {
    const { data } = await client.post('/auth/login', { email, password })
    return data
}

export const getMe = async () => {
    const { data } = await client.get('/auth/me')
    return data
}

export const cambiarPassword = async (passwordActual: string, passwordNueva: string) => {
  const { data } = await client.put('/auth/cambiar-password', { passwordActual, passwordNueva })
  return data
}