import { rowTracker } from '../../SeguimientoPage/Components/ObjectiveTracker'

export interface Objective {
  identificador: number
  iniDate: string
  finDate: string
  objective: string
  nombrePlani: string
  valueP: string
  planillasGener: boolean
  planilla_seguimiento?: Array<rowTracker>
}
