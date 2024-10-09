import { MenuItem, Button, TextField, FormControl, InputAdornment, Select } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import { AccountCircle } from '@mui/icons-material'
import { DialogActivityProps } from '../../../interfaces/activity.interface'

const DialogActivity = ({
  activity,
  isVisible,
  onHide,
  onSave,
  onChange,
  onChangeObjective,
  onChangeInitialDate,
  onChangeFinalDate,
  isEditMode,
  responsables,
  objetivos,
}: DialogActivityProps) => {
  return (
    <FormControl
      className={`shadow-lg h-fit mb-6 transform transition-transform ${isVisible ? 'translate-x-0 w-[35%] p-4' : 'translate-x-full w-[0%]'}`}
    >
      {activity && (
        <>
          <div className="flex justify-between items-start">
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
            <Button onClick={onHide} className="text-[#1c1c1c] font-semibold mb-1">
              X
            </Button>
          </div>
          <hr className="border-[1.5px] border-[#c6caff]" />

          <h3 className="text-lg font-semibold my-4">Duración</h3>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              name="fechaInicio"
              value={dayjs(activity.fechaInici)}
              onChange={onChangeInitialDate}
              label="Fecha de Inicio"
              className="mb-2 w-36"
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
              className="my-2 w-36"
              format="DD/MM/YYYY"
              disabled={!isEditMode}
            />
          </LocalizationProvider>

          <h3 className="text-lg font-semibold mb-2">Objetivo asociado</h3>
          <Select
            name="objetivo"
            value={activity.objetivo}
            onChange={onChangeObjective}
            size="small"
            className="w-48"
            label="Objetivo"
            disabled={!isEditMode}
          >
            {objetivos.map((objetivo) => {
              return <MenuItem value={objetivo}>{objetivo}</MenuItem>
            })}
          </Select>

          <h3 className="text-lg font-semibold mb-2">Descripción</h3>
          <TextField
            name="descripcion"
            placeholder="Descripción"
            value={activity.descripcion}
            onChange={onChange}
            variant="outlined"
            className="mb-4"
            disabled={!isEditMode}
            multiline
            size="small"
          />

          <h3 className="text-lg font-semibold mb-2">Responsable</h3>
          <TextField
            name="responsable"
            value={activity.responsable}
            onChange={onChange}
            label="Nombre del responsable"
            select
            fullWidth
            className="mb-2"
            disabled={!isEditMode}
            size="small"
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

          <h3 className="text-lg font-semibold mb-2">Resultado</h3>
          {activity.resultado.map((resultado: string, index: number) => (
            <div key={index} className="flex items-center mb-2">
              <TextField
                name="resultado"
                value={resultado}
                onChange={onChange}
                placeholder="Describe el resultado"
                variant="outlined"
                disabled={!isEditMode}
                size="small"
                className="w-full"
                multiline={!isEditMode}
              />

              {isEditMode ? (
                <Button className="ml-2" color="secondary">
                  X
                </Button>
              ) : null}
            </div>
          ))}

          {isEditMode && (
            <>
              <div className="flex justify-center">
                <button className="button-primary mt-2 mb-6">+ Resultado</button>
              </div>

              <div className="flex justify-end">
                <button onClick={onHide} className="button-secondary_outlined mx-1">
                  Cancelar
                </button>
                <button onClick={onSave} className="button-primary mx-1">
                  Guardar
                </button>
              </div>
            </>
          )}
        </>
      )}
    </FormControl>
  )
}

export default DialogActivity
