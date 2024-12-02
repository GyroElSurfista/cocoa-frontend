import { Planificacion } from './project.interface'
export interface NewEntregableModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (entregable: Entregable) => void
  onShowSnackbar: (message: string) => void // Función para mostrar Snackbar
  initialData?: Entregable
  entregable: Entregable[]
  objectiveId: number
  objectiveName: string
  planillaSeguiId?: number
  fechas: string[]
}

export interface Planificacion {
  identificador: number
  nombre: string
  fechaInici: string
  fechaFin: string
  costo: string
  identificadorGrupoEmpre: number
  diaRevis: string
  planillasSeguiGener: boolean
  fechaPlaniSeguiGener: string
  grupo_empresa: {
    identificador: number
    nombreLargo: string
    nombreCorto: string
  }
}

export interface Observation {
  identificador: number // Añadimos identificador
  descripcion: string
}

export interface Activity {
  identificador: number
  nombre: string
  observaciones: Observation[] // Usamos el tipo Observation[]
}

export interface User {
  id: number
  name: string
  email: string
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

export interface SavePlanillaEquipoModalProps {
  onConfirm: () => void
  onCancel: () => void
}

export interface RowInformationUserProps {
  userName: string
  companyName: string
  userId: number
  planillaDate: string
  isReadOnly: boolean
  asistenciaData?: {
    valor: boolean
    identificadorMotiv: number | null
    faltas?: number
  }
  onChangeAsistencia: (userId: number, valor: boolean, identificadorMotiv: number | null) => void
  onValidationChange: (userId: number, isValid: boolean) => void // Validación para el padre
}

export interface EntregableDinamicoAccordionProps {
  entregables: Entregable[]
  fechas: string[]
  objectiveName: string
  isReadOnly: boolean
  onEntregableUpdated: () => void // Para actualizar la lista de entregables
  onShowSnackbar: (message: string) => void // Función para mostrar Snackbar
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

export interface ButtonAddObservationProps {
  onAddObservation: () => void
}

export interface AddActivitiesObservationsProps {
  activity: { nombre: string; observaciones: { descripcion: string }[] }
  activityIndex: number
  onActivityChange: (activityIndex: number, newValue: string) => void
  onAddObservation: () => void
  onObservationChange: (activityIndex: number, observationIndex: number, newValue: string) => void
  onDeleteActivity: () => void
  onDeleteObservation: (activityIndex: number, observationIndex: number) => void
  onValidationChange: (activityIndex: number, isValid: boolean) => void // Callback for validation state
  isReadOnly: boolean
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
  identificadorPlani: number
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
  llenada?: boolean
}

export interface SelectorObservationModalProps {
  onRedirect: (
    observations: any[],
    objectiveId: number,
    planillaDate: string,
    planiId: number,
    objectiveName: string,
    identificadorPlani: number,
    fechas: string[]
  ) => void
}
