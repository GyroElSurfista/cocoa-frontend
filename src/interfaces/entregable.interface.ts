export interface EntregableAccordionProps {
  entregable: Entregable
  indexEntregable: number
  objetivoIds: string[]
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

export interface CriterioAceptacion {
  identificador: number
  descripcion: string
  identificadorEntre: number
}

export interface Entregable {
  identificador?: number
  nombre: string
  descripcion: string
  dinamico?: boolean
  fechaCreac?: string
  identificadorObjet: number
  criteriosAcept: any
  criterio_aceptacion_entregable: CriterioAceptacion[]
}

export interface Objetivo {
  identificador: number
  nombre: string
  fechaInici: string
  fechaFin: string
  valorPorce: string
  planillasGener: boolean
  identificadorPlani: number
  planillaEvaluGener: boolean
  fechaEvaluFinalGener: string | null
  entregable: Entregable[] // Lista de entregables asociados al objetivo
}

export interface EntregableAccordionProps {
  objetivoIds: string[] // Lista de IDs de objetivos a cargar desde la API
}
