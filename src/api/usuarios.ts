import client from "./client";

export const getUsuarios = async () => {
    const { data } = await client.get('/usuarios')
    return data
}

export const crearUsuario = async (usuario: Record<string, unknown>) => {
    const { data } = await client.post('/usuarios', usuario)
    return data
}

export const toggleUsuario = async (id: string) => {
    const { data } = await client.patch(`/usuarios/${id}/toggle`)
    return data
}

export const eliminarUsuario = async (id: string) => {
    const { data } = await client.delete(`/usuarios/${id}`)
    return data
}