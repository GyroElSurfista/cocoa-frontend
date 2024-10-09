import { SelectChangeEvent } from '@mui/material/Select'
import { DateValidationError, PickerChangeHandlerContext } from '@mui/x-date-pickers'
import { Dayjs } from 'dayjs'

export type ActivityProps = {
  identificador: number
  nombre: string
  fechaInici: Date
  fechaFin: Date
  descripcion: string
  responsable: string | null
  resultado: string[]
  objetivo: string
}

export interface ActivityData {
  identificador?: number
  nombre: string
  descripcion: string
  fechaInici: Date
  fechaFin: Date
  identificadorUsua: number
  identificadorObjet: number
}

export type DialogActivityProps = {
  activity: ActivityProps | null
  isVisible: boolean
  onHide: () => void
  onSave: () => void
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onChangeObjective: (e: SelectChangeEvent<string>) => void
  onChangeInitialDate: (value: Dayjs | null, context: PickerChangeHandlerContext<DateValidationError>) => void
  onChangeFinalDate: (value: Dayjs | null, context: PickerChangeHandlerContext<DateValidationError>) => void
  isEditMode: boolean
  responsables: string[]
  objetivos: string[]
}
