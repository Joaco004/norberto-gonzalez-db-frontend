export interface IFoto {
  url: string
  urlThumbnail: string
  orden: number
  principal: boolean
}

export interface IZona {
  _id: string
  nombre: string
  partido: string
}

export interface IPropiedad {
  _id: string
  titulo: string
  descripcion?: string
  tipo: string
  subtipo?: string
  operacion: string
  precio: number
  moneda: string
  ambientes?: number
  dormitorios?: number
  banos?: number
  superficieTotal?: number
  superficieCubierta?: number
  cochera: boolean
  antiguedad?: number
  estado: string
  destacada: boolean
  publicada: boolean
  zona: IZona
  vendedor: { _id: string; nombre: string; email: string }
  fotos: IFoto[]
  caracteristicas: { nombre: string; categoria: string }[]
  calle?: string
  ficha?: number
  createdAt: string
}