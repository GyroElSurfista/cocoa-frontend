import { MenuItem, Button, TextField, FormControl, InputAdornment } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs, { Dayjs } from 'dayjs'
import { AccountCircle } from '@mui/icons-material'
import { DateValidationError, PickerChangeHandlerContext } from '@mui/x-date-pickers'
import { ActivityProps } from '../ActivityPage'

type DialogActivityProps = {
  activity: ActivityProps | null
  isVisible: boolean
  onHide: () => void
  onSave: () => void
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onChangeInitialDate: (value: Dayjs | null, context: PickerChangeHandlerContext<DateValidationError>) => void
  onChangeFinalDate: (value: Dayjs | null, context: PickerChangeHandlerContext<DateValidationError>) => void
  isEditMode: boolean
  responsables: string[]
}

const DialogActivity = ({
  activity,
  isVisible,
  onHide,
  onSave,
  onChange,
  onChangeInitialDate,
  onChangeFinalDate,
  isEditMode,
  responsables,
}: DialogActivityProps) => {
  return (
    <FormControl
      className={`shadow-lg h-fit mb-6 transform transition-transform ${isVisible ? 'translate-x-0 w-[35%] p-4' : 'translate-x-full w-[0%]'}`}
    >
      {activity && (
        <>
          <div className="flex justify-between items-center">
            {isEditMode ? (
              <TextField
                name="nombreActividad"
                onChange={onChange}
                placeholder="Nombre de la Actividad"
                sx={{
                  width: '100%',
                  '& .MuiOutlinedInput-root': {
                    padding: 0, // Quitar padding
                    '& fieldset': {
                      border: 'none',
                    },
                    '& .MuiInputBase-input': {
                      padding: '8px', // Ajustar padding interno del input
                      width: '100%',
                    },
                  },
                  '& .MuiInputBase-input::placeholder': {
                    fontSize: '1.25rem', // Aumentar tamaño del placeholder
                  },
                }}
              ></TextField>
            ) : (
              <h2 className="text-xl">{activity?.nombre}</h2>
            )}
            <Button onClick={onHide} className="text-black">
              X
            </Button>
          </div>
          <hr className="border-[1.5px] border-[#c6caff]" />

          <h3 className="text-lg font-bold my-4">Duración</h3>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              name="fechaInicio"
              value={dayjs(activity.fechaInici)}
              onChange={onChangeInitialDate}
              label="Fecha de Inicio"
              className="mb-2 w-2/5"
              format="DD/MM/YYYY"
              disabled={!isEditMode}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              name="fechaFin"
              value={dayjs(activity.fechaFin)}
              onChange={onChangeFinalDate}
              label="Fecha de Fin"
              className="my-2 w-2/5"
              format="DD/MM/YYYY"
              disabled={!isEditMode}
            />
          </LocalizationProvider>

          <h3 className="text-lg font-bold mb-2">Descripción</h3>
          <TextField
            name="descripcion"
            value={activity.descripcion}
            onChange={onChange}
            variant="outlined"
            className="mb-4"
            disabled={!isEditMode}
            multiline
          />

          <h3 className="text-lg font-bold mb-2">Responsable</h3>
          <div className="flex justify-between ">
            <p className="text-sm w-full">Persona asignada</p>
            {
              <TextField
                name="responsable"
                value={activity.responsable}
                onChange={onChange}
                label="Nombre del responsable"
                select
                fullWidth
                disabled={!isEditMode}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle />
                      </InputAdornment>
                    ),
                  },
                }}
                variant="standard"
              >
                {responsables.map((responsable, index) => (
                  <MenuItem key={index} value={responsable}>
                    {responsable}
                  </MenuItem>
                ))}
              </TextField>
            }
          </div>

          <h3 className="text-lg font-bold mb-2">Resultado</h3>
          <TextField
            name="resultado"
            value={activity.resultado}
            onChange={onChange}
            variant="outlined"
            className="mb-4"
            disabled={!isEditMode}
            multiline
          />

          {isEditMode && (
            <div className="flex justify-end">
              <button onClick={onHide} className="button-secondary_outlined mx-1">
                Cancelar
              </button>
              <button onClick={onSave} className="button-primary mx-1">
                Guardar
              </button>
            </div>
          )}
        </>
      )}
    </FormControl>
  )
}

export default DialogActivity
