import { MenuItem, Button, TextField, FormControl, InputAdornment, Autocomplete } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import { AccountCircle } from '@mui/icons-material'
import { ActivityErrors, DialogActivityProps } from '../../../interfaces/activity.interface'
import { useEffect, useState } from 'react'

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
}: DialogActivityProps): JSX.Element => {
  const [errors, setErrors] = useState<ActivityErrors>({
    nombre: '',
    descripcion: '',
    responsable: '',
    fechaInici: '',
    fechaFin: '',
    objetivo: '',
    resultados: [],
  })

  useEffect(() => {
    if (activity?.nombre) {
      setErrors({
        nombre: '',
        descripcion: '',
        responsable: '',
        fechaInici: '',
        fechaFin: '',
        objetivo: '',
        resultados: [],
      })
    }
  }, [activity?.nombre])

  const validateFields = () => {
    const newErrors: ActivityErrors = {
      nombre: '',
      descripcion: '',
      responsable: '',
      fechaInici: '',
      fechaFin: '',
      objetivo: '',
      resultados: Array(activity?.resultados?.length).fill(''),
    }

    if (!activity?.nombre || activity?.nombre.length === 0) newErrors.nombre = 'El título es obligatorio'
    else if (activity?.nombre.length < 5) newErrors.nombre = 'El título debe tener al menos 5 caracteres'
    else if (activity?.nombre.length > 50) newErrors.nombre = 'El título no puede exceder 50 caracteres'

    if (!activity?.descripcion || activity?.descripcion.length === 0) newErrors.descripcion = 'La descripción es obligatoria'
    else if (activity?.descripcion.length < 5) newErrors.descripcion = 'La descripción debe tener al menos 5 caracteres'
    else if (activity?.descripcion.length > 255) newErrors.descripcion = 'La descripción no puede exceder 255 caracteres'

    if (!activity?.responsable || activity?.responsable.length === 0) {
      newErrors.responsable = 'El responsable es obligatorio'
    }

    if (!activity?.fechaInici) {
      newErrors.fechaInici = 'La fecha de inicio es obligatoria'
    }

    if (!activity?.fechaFin) {
      newErrors.fechaFin = 'La fecha de fin es obligatoria'
    }

    // Validación: fechaInici no puede ser mayor o igual a fechaFin
    if (activity?.fechaInici && activity?.fechaFin) {
      const fechaInici = dayjs(activity?.fechaInici)
      const fechaFin = dayjs(activity?.fechaFin)
      if (fechaInici.toDate() >= fechaFin.toDate()) {
        newErrors.fechaInici = 'La fecha de inicio no puede ser mayor o igual a la fecha de fin'
      }
    }

    if (!activity?.objetivo || activity?.objetivo.length === 0) {
      newErrors.objetivo = 'El objetivo es obligatorio'
    }

    activity?.resultados?.forEach((resultado, index) => {
      if (!resultado || resultado.length === 0) newErrors.resultados[index] = 'El resultado es obligatorio'
      else if (resultado.length < 5) newErrors.resultados[index] = 'El resultado debe tener al menos 5 caracteres'
      else if (resultado.length > 255) newErrors.resultados[index] = 'El resultado no puede exceder 255 caracteres'
    })

    setErrors(newErrors)
    return Object.keys(newErrors).every((key) => {
      if (key === 'resultados') {
        return newErrors.resultados.every((err) => !err)
      }
      return !newErrors[key as keyof ActivityErrors]
    })
  }

  const handleAddResult = () => {
    onChange({
      target: {
        name: 'resultados',
        value: [...(activity?.resultados ?? []), ''],
      },
    })
  }

  const handleResultChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
    const newResults = [...(activity?.resultados ?? [])]
    newResults[index] = e.target.value

    onChange({
      target: {
        name: 'resultados',
        value: newResults,
      },
    })
  }

  const handleSave = async () => {
    if (validateFields()) {
      const isTitleError = await onSave()
      if (isTitleError) setErrors({ ...errors, nombre: 'El nombre de la actividad ya existe' })
    }
  }

  const handleRemoveResult = (index: number) => {
    const newResults = [...(activity?.resultados ?? [])]
    newResults.splice(index, 1) // Elimina el resultado en el índice dado

    onChange({
      target: {
        name: 'resultados',
        value: newResults,
      },
    })

    // Actualiza también los errores para asegurarte de que el error desaparezca cuando se elimina un resultado
    const newErrors = { ...errors }
    newErrors.resultados.splice(index, 1)
    setErrors(newErrors)
  }

  return (
    <FormControl
      className={`shadow-lg h-fit mb-6 transform transition-transform ${isVisible ? 'translate-x-0 w-[35%] p-4' : 'translate-x-full w-[0%]'}`}
    >
      {activity && (
        <>
          <div className="flex justify-between items-start">
            {isEditMode ? (
              <TextField
                name="nombre"
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
                error={Boolean(errors.nombre)}
                helperText={errors.nombre}
                slotProps={{ htmlInput: { maxLength: 50 } }}
              />
            ) : (
              <h2 className="text-xl">{activity?.nombre}</h2>
            )}
            <Button
              onClick={() => {
                onHide()
                setErrors({
                  nombre: '',
                  descripcion: '',
                  responsable: '',
                  fechaInici: '',
                  fechaFin: '',
                  objetivo: '',
                  resultados: [],
                })
              }}
              className="text-[#1c1c1c] font-semibold mb-1"
            >
              X
            </Button>
          </div>
          <hr className="border-[1.5px] border-[#c6caff]" />

          <h3 className="text-lg font-semibold my-4">Duración</h3>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              name="fechaInici"
              value={dayjs(activity.fechaInici)}
              onChange={onChangeInitialDate}
              label="Fecha de Inicio"
              className={`${errors.fechaInici ? '' : 'mb-2'} w-36`}
              format="DD/MM/YYYY"
              disabled={!isEditMode}
              slotProps={{ textField: { required: true } }}
            />
          </LocalizationProvider>
          {errors.fechaInici && <p className="text-red-600 text-xs mb-4 pl-3">{errors.fechaInici}</p>}

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              name="fechaFin"
              value={dayjs(activity.fechaFin)}
              onChange={onChangeFinalDate}
              label="Fecha de Fin"
              className="my-2 w-36"
              format="DD/MM/YYYY"
              disabled={!isEditMode}
              slotProps={{ textField: { required: true } }}
            />
          </LocalizationProvider>
          {errors.fechaFin && <p className="text-red-600 text-xs mb-2 pl-3">{errors.fechaFin}</p>}

          <h3 className="text-lg font-semibold mb-4">Objetivo asociado</h3>
          <Autocomplete
            disablePortal
            options={objetivos.map((objetivo) => {
              return { identificadorObjet: objetivo.identificador, nombre: objetivo.nombre }
            })}
            getOptionLabel={(option) => option.nombre}
            value={{ identificadorObjet: activity.identificadorObjet, nombre: activity.objetivo }}
            onChange={onChangeObjective}
            renderInput={(params) => <TextField {...params} label="Objetivo" />}
            disabled={!isEditMode}
            size="small"
          />
          {errors.objetivo && <p className="text-red-600 text-xs mb-2 pl-3">{errors.objetivo}</p>}

          <h3 className="text-lg font-semibold mb-2">Descripción</h3>
          <TextField
            name="descripcion"
            placeholder="Descripción"
            value={activity.descripcion}
            onChange={onChange}
            required
            variant="outlined"
            className="mb-4"
            disabled={!isEditMode}
            multiline
            size="small"
            error={Boolean(errors.descripcion)}
            helperText={errors.descripcion}
            slotProps={{ htmlInput: { maxLength: 255 } }}
          />

          <h3 className="text-lg font-semibold mb-2">Responsable</h3>
          <TextField
            name="responsable"
            value={activity.responsable}
            onChange={onChange}
            label="Nombre del responsable"
            select
            fullWidth
            required
            className="mb-2"
            disabled={!isEditMode}
            size="small"
            error={Boolean(errors.responsable)}
            helperText={errors.responsable}
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
          {activity.resultados.map((resultados: string, index: number) => (
            <div key={index} className="flex items-center mb-2">
              <TextField
                name="resultados"
                value={resultados}
                onChange={(e) => handleResultChange(e, index)}
                placeholder="Describe el resultado"
                required
                variant="outlined"
                disabled={!isEditMode}
                size="small"
                className="w-full"
                multiline={!isEditMode}
                error={Boolean(errors.resultados[index])}
                helperText={errors.resultados[index] || ''}
                slotProps={{ htmlInput: { maxLength: 255 } }}
              />

              {isEditMode ? (
                <Button onClick={() => handleRemoveResult(index)} className="ml-2" color="inherit">
                  X
                </Button>
              ) : null}
            </div>
          ))}

          {isEditMode && (
            <>
              <div className="flex justify-center">
                <button onClick={handleAddResult} className="button-primary mt-2 mb-6">
                  +
                </button>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => {
                    onHide()
                    setErrors({
                      nombre: '',
                      descripcion: '',
                      responsable: '',
                      fechaInici: '',
                      fechaFin: '',
                      objetivo: '',
                      resultados: [],
                    })
                  }}
                  className="button-secondary_outlined mx-1"
                >
                  Cancelar
                </button>
                <button onClick={handleSave} className="button-primary mx-1">
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
