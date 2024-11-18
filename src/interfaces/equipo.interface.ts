export interface NewEntregableModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (entregable: Entregable) => void
  initialData?: Entregable
  entregable: Entregable[]
  objectiveId: number
  planillaSeguiId?: number
  fechas: string[]
}

export interface Entregable {
  identificador: number
  nombre: string
  descripcion: string | null
  identificadorObjet: number
  identificadorPlaniSegui?: number
  dinamico?: boolean
  fechaCreac?: string
  criterio_aceptacion_entregable: CriterioAceptacion[]
}

export interface CriterioAceptacion {
  identificador: number
  descripcion: string
  identificadorEntre: number
}

export interface Objective {
  identificador: number
  nombre: string
  nombrePlani: string
}

export interface Observacion {
  identificador: number
  descripcion: string
  fecha: string
  identificadorActivSegui: number
}

export interface ActividadSeguimiento {
  identificador: number
  nombre: string
  identificadorPlaniSegui: number
  observacion: Observacion[]
}

export interface Planilla {
  identificador: number
  fecha: string
  identificadorObjet: number
  actividad_seguimiento: ActividadSeguimiento[]
}

export interface SelectorObservationModalProps {
  onRedirect: (
    observations: any[],
    objectiveId: number,
    planillaDate: string,
    planiId: number,
    objectiveName: string,
    fechas: string[]
  ) => void
}
