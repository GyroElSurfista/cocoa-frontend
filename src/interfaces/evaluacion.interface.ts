export interface Project {
  identificadorPlani: number
  nombrePlani: string
  fechaEvaluFinalGener: string
}

export interface ProjectSelectorModalProps {
  isOpen: boolean
  onClose: () => void
}

export interface EvaluacionObjetivo {
  identificador: number
  fecha: string
  habilitadoPago: boolean
  sePago: boolean
  observacion: string
  identificadorObjet: number
}

export interface Planilla {
  identificador: number
  nombre: string
  fechaInici: string
  fechaFin: string
  valorPorce: string
  planillasGener: boolean
  identificadorPlani: number
  planillaEvaluGener: boolean
  evaluacion_objetivo: EvaluacionObjetivo[]
}

export interface Deliverable {
  identificador: number
  nombre: string
  descripcion: string
  identificadorObjet: number
}

export interface PlanillasEvaluacionAccordionProps {
  identificadorPlani: number
  nombrePlani: string
}

export interface NewPlanillaEvaluacionModalProps {
  isOpen: boolean
  onClose: () => void
  onPlanillasGenerated: () => void
  identificadorPlani: number // Nuevo prop para filtrar objetivos
}

export interface Objetivo {
  identificador: number
  nombre: string
  fechaInici: string
  fechaFin: string
  valorPorce: string
  planillasGener: boolean
  planillaEvaluGener: boolean
  identificadorPlani: number
}
