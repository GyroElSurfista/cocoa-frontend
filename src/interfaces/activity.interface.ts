import { DateValidationError, PickerChangeHandlerContext } from '@mui/x-date-pickers'
import { Dayjs } from 'dayjs'
import { ObjectiveData } from '../services/objective.service'
import { SyntheticEvent } from 'react'

export type ActivityProps = {
  identificador: number
  nombre: string
  descripcion: string
  fechaInici: Date
  fechaFin: Date
  responsable: string | null
  identificadorUsua: number
  identificadorObjet: number
  resultados: string[]
  objetivo: string
}

export type ActivityRowProps = {
  identificador: number
  index: number
  nombre: string
  objetivo: string
  proyecto: string
  esEliminable: boolean
  fechaInici: Date
  fechaFin: Date
  responsable: string | null
}

export interface ActivityData {
  identificador?: number
  nombre: string
  descripcion: string
  fechaInici: Date
  fechaFin: Date
  identificadorUsua: number
  identificadorObjet: number
  resultados: string[]
}

export type DialogActivityProps = {
  activity: ActivityProps | null
  isVisible: boolean
  onHide: () => void
  onSave: () => Promise<boolean>
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onChangeObjective: (
    event: SyntheticEvent<Element, Event>,
    value: { identificadorObjet: number | undefined; nombre: string } | null
  ) => void
  onChangeInitialDate: (value: Dayjs | null, context: PickerChangeHandlerContext<DateValidationError>) => void
  onChangeFinalDate: (value: Dayjs | null, context: PickerChangeHandlerContext<DateValidationError>) => void
  isEditMode: boolean
  responsables: string[]
  objetivos: ObjectiveData[]
}

export interface ActivityErrors {
  nombre: string[]
  descripcion: string[]
  responsable: string[]
  fechaInici: string[]
  fechaFin: string[]
  objetivo: string[]
  resultados: string[]
}

export interface ActivityMessageErrors {
  error: string
  message: string
  errors: {
    nombre: [string]
  }
}
