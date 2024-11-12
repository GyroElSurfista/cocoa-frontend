import { MenuItem, Button, TextField, FormControl, InputAdornment, Autocomplete } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import { AccountCircle } from '@mui/icons-material'
import { ActivityErrors, ActivityProps, DialogActivityProps } from '../../../interfaces/activity.interface'
import { useEffect, useState } from 'react'
import { Planificacion } from '../../../interfaces/project.interface'
import { getObjectivesFromPlanification, ObjectiveData } from '../../../services/objective.service'

const INITIAL_STATE_ERRORS = {
  nombre: [''],
  descripcion: [''],
  responsable: [''],
  fechaInici: [''],
  fechaFin: [''],
  objetivo: [''],
  proyecto: [''],
  resultados: [],
}

const isDefaultActivity = (activity: ActivityProps) => {
  const defaultActivity = {
    identificador: 0,
    nombre: '',
    fechaInici: new Date().toDateString(),
    fechaFin: new Date().toDateString(),
    descripcion: '',
    responsable: null,
    resultados: [''],
    objetivo: '',
    identificadorUsua: 1,
    identificadorObjet: 0,
    proyecto: '',
  }

  return (
    activity.identificador === defaultActivity.identificador &&
    activity.nombre === defaultActivity.nombre &&
    activity.fechaInici.toDateString() === defaultActivity.fechaInici &&
    activity.fechaFin.toDateString() === defaultActivity.fechaFin &&
    activity.descripcion === defaultActivity.descripcion &&
    activity.responsable === defaultActivity.responsable &&
    JSON.stringify(activity.resultados) === JSON.stringify(defaultActivity.resultados) &&
    activity.objetivo === defaultActivity.objetivo &&
    activity.identificadorUsua === defaultActivity.identificadorUsua &&
    activity.identificadorObjet === defaultActivity.identificadorObjet &&
    activity.proyecto === defaultActivity.proyecto
  )
}

const DialogActivity = ({
  activity,
  isVisible,
  onHide,
  onSave,
  onChange,
  onChangeProjectOrObjective,
  onChangeInitialDate,
  onChangeFinalDate,
  isEditMode,
  responsables,
  proyectos,
}: DialogActivityProps): JSX.Element => {
  const [objetivos, setObjetivos] = useState<ObjectiveData[] | null>(null)
  const [selectedProject, setSelectedProject] = useState<Planificacion | null>(null)
  const [selectedObjective, setSelectedObjective] = useState<ObjectiveData | null>(null)
  const [errors, setErrors] = useState<ActivityErrors>(INITIAL_STATE_ERRORS)

  const inicializarAutocompletesDialogActivity = (): void => {
    setObjetivos(null)
    setSelectedProject(null)
    setSelectedObjective(null)
  }

  useEffect(() => {
    if (activity) {
      setErrors({
        nombre: [''],
        descripcion: [''],
        responsable: [''],
        fechaInici: [''],
        fechaFin: [''],
        objetivo: [''],
        proyecto: [''],
        resultados: [],
      })

      if (activity.proyecto && activity.objetivo) {
        setSelectedProject((prevProject) => ({
          ...prevProject,
          nombre: activity.proyecto,
        }))
        setSelectedObjective((prevObjective) => ({
          ...prevObjective,
          nombre: activity.objetivo,
        }))
      } else if (isDefaultActivity(activity)) {
        inicializarAutocompletesDialogActivity()
      }
    }
  }, [activity])

  const validateFields = async (): Promise<boolean> => {
    const newErrors: ActivityErrors = {
      nombre: [''],
      descripcion: [''],
      responsable: [''],
      fechaInici: [''],
      fechaFin: [''],
      objetivo: [''],
      proyecto: [''],
      resultados: Array(activity?.resultados?.length).fill(''),
    }

    if (!activity?.nombre || activity?.nombre.length === 0) newErrors.nombre[0] = 'El título es obligatorio'
    else if (activity?.nombre.trim() === '') newErrors.nombre[0] = 'El título no puede contener solo espacios en blanco'
    else if (activity?.nombre.trim().length < 5) newErrors.nombre[0] = 'El título debe tener al menos 5 caracteres'
    else if (activity?.nombre.trim().length > 50) newErrors.nombre[0] = 'El título no puede exceder 50 caracteres'

    if (!activity?.descripcion || activity?.descripcion.length === 0) newErrors.descripcion[0] = 'La descripción es obligatoria'
    else if (activity?.descripcion.trim() === '') newErrors.descripcion[0] = 'La descripción no puede contener solo espacios en blanco'
    else if (activity?.descripcion.trim().length < 5) newErrors.descripcion[0] = 'La descripción debe tener al menos 5 caracteres'
    else if (activity?.descripcion.trim().length > 255) newErrors.descripcion[0] = 'La descripción no puede exceder 255 caracteres'

    if (!activity?.responsable || activity?.responsable.length === 0) {
      newErrors.responsable[0] = 'El responsable es obligatorio'
    }

    if (!activity?.fechaInici) {
      newErrors.fechaInici[0] = 'La fecha de inicio es obligatoria'
    }

    if (!activity?.fechaFin) {
      newErrors.fechaFin[0] = 'La fecha de fin es obligatoria'
    }

    // Validación: fechaInici no puede ser mayor o igual a fechaFin
    if (activity?.fechaInici && activity?.fechaFin) {
      const fechaInici = dayjs(activity?.fechaInici)
      const fechaFin = dayjs(activity?.fechaFin)
      if (fechaInici.toDate() >= fechaFin.toDate()) {
        newErrors.fechaInici[0] = 'La fecha de inicio no puede ser posterior o igual a la fecha de fin'
      }
    }

    if (!selectedProject) {
      newErrors.proyecto[0] = 'El proyecto es obligatorio'
    }

    if (!selectedObjective) {
      newErrors.objetivo[0] = 'El objetivo es obligatorio'
    }

    activity?.resultados?.forEach((resultado, index) => {
      if (!resultado || resultado.length === 0) newErrors.resultados[index] = 'El resultado es obligatorio'
      else if (resultado.trim() === '') newErrors.resultados[index] = 'El resultado no puede contener solo espacios en blanco'
      else if (resultado.trim().length < 5) newErrors.resultados[index] = 'El resultado debe tener al menos 5 caracteres'
      else if (resultado.trim().length > 255) newErrors.resultados[index] = 'El resultado no puede exceder 255 caracteres'
      resultado = resultado.trim()
    })

    setErrors(newErrors)
    const hasErrors = Object.values(newErrors).some((error) => {
      if (Array.isArray(error)) {
        return error.some((err) => err)
      }
      return Boolean(error)
    })

    return !hasErrors
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
    if ((await validateFields()) && selectedObjective) {
      const endpointErrors = await onSave(selectedObjective.identificador)
      if (endpointErrors) {
        if (endpointErrors.response.data.errors) setErrors({ ...errors, ...endpointErrors.response.data.errors })
        else if (
          endpointErrors.response.data.error === 'La fecha de fin de la actividad no puede ser posterior a la fecha de fin del objetivo.'
        )
          setErrors({ ...errors, fechaFin: [endpointErrors.response.data.error] })
        else setErrors({ ...errors, fechaInici: [endpointErrors.response.data.error] })
      }
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
                error={Boolean(errors.nombre[0])}
                helperText={errors.nombre[0]}
                slotProps={{ htmlInput: { maxLength: 50 } }}
              />
            ) : (
              <h2 className="text-xl">{activity?.nombre}</h2>
            )}
            <Button
              onClick={() => {
                onHide()
                setErrors(INITIAL_STATE_ERRORS)
              }}
              className="text-[#1c1c1c] font-semibold mb-1"
            >
              X
            </Button>
          </div>
          <hr className="border-[1.5px] border-[#c6caff]" />

          <h3 className="text-lg font-semibold my-4">Proyecto asociado</h3>
          <Autocomplete
            disablePortal
            options={proyectos.map((proyecto) => proyecto)}
            getOptionLabel={(option) => option.nombre}
            value={selectedProject}
            renderInput={(params) => <TextField {...params} label="Proyecto" />}
            onChange={async (_event, value) => {
              setSelectedProject(value)
              if (value) {
                setObjetivos((await getObjectivesFromPlanification(value.identificador)).data)
                onChangeProjectOrObjective('proyecto', value.nombre)
              }
              setSelectedObjective(null)
            }}
            disabled={!isEditMode}
            size="small"
          />
          {errors.proyecto[0] && <p className="text-red-600 text-xs mb-2 pl-3">{errors.proyecto[0]}</p>}

          <h3 className="text-lg font-semibold mb-4">Objetivo asociado</h3>
          <Autocomplete
            disablePortal
            options={objetivos ? objetivos.map((objetivo) => objetivo) : []}
            getOptionLabel={(option) => option.nombre}
            value={selectedProject ? selectedObjective : null}
            onChange={(_event, value) => {
              if (value) {
                setSelectedObjective(value)
                onChangeProjectOrObjective('objetivo', value.nombre)
              }
            }}
            renderInput={(params) => <TextField {...params} label="Objetivo" />}
            disabled={!isEditMode || selectedProject === null || objetivos === null}
            size="small"
          />
          {errors.objetivo[0] && <p className="text-red-600 text-xs mb-2 pl-3">{errors.objetivo[0]}</p>}

          <h3 className="text-lg font-semibold mb-4">Duración</h3>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              name="fechaInici"
              value={dayjs(activity.fechaInici)}
              onChange={onChangeInitialDate}
              label="Fecha de Inicio"
              className={`${errors.fechaInici[0] ? '' : 'mb-2'} w-36`}
              format="DD/MM/YYYY"
              disabled={!isEditMode}
              slotProps={{ textField: { required: true } }}
            />
          </LocalizationProvider>
          {errors.fechaInici[0] && <p className="text-red-600 text-xs mb-4 pl-3">{errors.fechaInici[0]}</p>}

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
          {errors.fechaFin[0] && <p className="text-red-600 text-xs mb-2 pl-3">{errors.fechaFin[0]}</p>}

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
            error={Boolean(errors.descripcion[0])}
            helperText={errors.descripcion[0]}
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
            error={Boolean(errors.responsable[0])}
            helperText={errors.responsable[0]}
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

              {isEditMode && activity.resultados.length > 1 ? (
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
                    setErrors(INITIAL_STATE_ERRORS)
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
