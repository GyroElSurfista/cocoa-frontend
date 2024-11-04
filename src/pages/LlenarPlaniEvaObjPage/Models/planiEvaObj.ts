export interface CriterioAceptacionEntreg {
  identificador: number
  descripcion: string
  identificadorEntre: number
}

export interface Entregable {
  identificador: number
  nombre: string
  descripcion: string
  identificadorObjet: number
  criterio_aceptacion_entregable: Array<CriterioAceptacionEntreg>
}
