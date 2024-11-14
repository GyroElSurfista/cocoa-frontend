export interface Entregable {
  identificador?: number
  nombre: string
  descripcion: string
  identificadorObjet: number
  criteriosAcept: { descripcion: string }[]
}

export interface EntregableAccordionProps {
  entregable: Entregable
  indexEntregable: number
}

export interface Objetivo {
  identificador: number
  nombre: string
  nombrePlani: string
  fechaInici: string
  fechaFin: string
  valorPorce: string
  planillasGener: boolean
  identificadorPlani: number
}
