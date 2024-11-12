export interface RevisionCriterio {
  identificador: number
  cumple: boolean
  fecha: string
}

export interface CriterioAceptacionEntreg {
  identificador: number
  descripcion: string
  identificadorEntre: number
  revision_criterio_entregable: Array<RevisionCriterio>
}

export interface Entregable {
  identificador: number
  nombre: string
  descripcion: string
  identificadorObjet: number
  criterio_aceptacion_entregable: Array<CriterioAceptacionEntreg>
}
