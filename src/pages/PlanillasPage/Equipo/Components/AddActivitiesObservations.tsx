import React, { useState, useEffect, useCallback } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'

interface AddActivitiesObservationsProps {
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

export const AddActivitiesObservations: React.FC<AddActivitiesObservationsProps> = (props) => {
  const {
    activity,
    activityIndex,
    onActivityChange,
    onAddObservation,
    onObservationChange,
    onDeleteActivity,
    onValidationChange,
    isReadOnly,
  } = props

  const [isActivityNameValid, setIsActivityNameValid] = useState(false) // Estado del nombre de actividad
  const [observationsValidStates, setObservationsValidStates] = useState<boolean[]>([]) // Estado de cada observación

  useEffect(() => {
    setObservationsValidStates(activity.observaciones.map(() => false)) // Inicializa con `false` para todas las observaciones
    console.log(
      `Observations valid states initialized:`,
      activity.observaciones.map(() => false)
    )
  }, [activity.observaciones])

  const [errors, setErrors] = useState<{
    nombre?: string
    observaciones: { [key: number]: string }
    general?: string
  }>({ observaciones: {} })

  const validateActivityName = (name: string) => {
    if (name.trim().length === 0) return ''
    if (name.trim().length < 5) return 'El nombre debe tener al menos 5 caracteres.'
    if (name.trim().length > 50) return 'El nombre debe tener como máximo 50 caracteres.'
    return ''
  }

  const validateObservation = (description: string) => {
    if (description.trim().length === 0) return 'La observación no puede estar vacía o contener solo espacios.'
    if (description.trim().length < 5) return 'La observación debe tener al menos 5 caracteres.'
    if (description.trim().length > 255) return 'La observación debe tener como máximo 255 caracteres.'
    return ''
  }

  const validateGlobalState = (isActivityNameValid: boolean, observationsStates: boolean[]) => {
    const allObservationsValid = observationsStates.every(Boolean)
    const isValid = isActivityNameValid && allObservationsValid

    console.log('Validating global state:', { isActivityNameValid, observationsStates, isValid })

    // Notifica al padre directamente
    onValidationChange(activityIndex, isValid)
  }

  const handleActivityNameChange = (newValue: string) => {
    const error = validateActivityName(newValue)
    const isValid = !error

    setErrors((prev) => ({
      ...prev,
      nombre: error,
    }))

    setIsActivityNameValid(isValid) // Actualiza el estado específico
    onActivityChange(activityIndex, newValue)
    validateGlobalState(isValid, observationsValidStates) // Recalcula el estado global
  }

  const checkForDuplicates = (observations: string[], newValue: string, index: number) => {
    return observations.some((obs, i) => obs.trim() === newValue.trim() && i !== index)
  }

  const handleObservationChange = (observationIndex: number, newValue: string) => {
    const error = validateObservation(newValue)
    const isValid = !error

    const hasDuplicate = checkForDuplicates(
      activity.observaciones.map((obs) => obs.descripcion),
      newValue,
      observationIndex
    )

    console.log(`Validating observation:`, {
      observationIndex,
      newValue,
      error,
      isValid,
      hasDuplicate,
    })

    setErrors((prev) => ({
      ...prev,
      observaciones: {
        ...prev.observaciones,
        [observationIndex]: hasDuplicate ? 'No pueden existir dos observaciones con los mismos datos.' : error,
      },
    }))

    const updatedObservationsValidStates = activity.observaciones.map((obs, i) =>
      i === observationIndex ? newValue.trim().length > 0 && isValid && !hasDuplicate : observationsValidStates[i]
    )

    // Actualizar estados en tiempo real
    setObservationsValidStates(updatedObservationsValidStates)

    // Actualizar el valor de la observación en las props
    onObservationChange(activityIndex, observationIndex, newValue)

    // Validar estado global con los valores actualizados
    validateGlobalState(isActivityNameValid, updatedObservationsValidStates)
  }

  const handleAddObservation = () => {
    onAddObservation()
    onValidationChange(activityIndex, false)
  }

  useEffect(() => {
    const hasErrors = activity.nombre.trim().length < 5 || activity.observaciones.some((obs) => obs.descripcion.trim().length < 5)
    onValidationChange(activityIndex, !hasErrors)
  }, [activity.nombre, activity.observaciones, onValidationChange, activityIndex])

  useEffect(() => {
    const hasDuplicate = activity.observaciones.some((obs, i) =>
      activity.observaciones.some((innerObs, j) => i !== j && obs.descripcion.trim() === innerObs.descripcion.trim())
    )

    const generalError =
      !isActivityNameValid || observationsValidStates.some((valid) => !valid) || hasDuplicate
        ? 'Debe llenar la actividad y sus respectivas observacione(s) para guardar la planilla.'
        : undefined

    setErrors((prev) => ({
      ...prev,
      general: generalError,
    }))
  }, [isActivityNameValid, observationsValidStates, activity.observaciones])

  return (
    <div className="mb-4">
      <h3 className="font-semibold text-xl">Nombre de Actividad</h3>
      <div className="flex items-center">
        <div className="mb-2 items-center gap-[20px] self-stretch rounded-[8px] border-[2px] border-[#FFC3CC] bg-white shadow-md w-full">
          <div className="flex items-center justify-between rounded-lg w-full">
            <input
              type="text"
              value={activity.nombre}
              onChange={(e) => handleActivityNameChange(e.target.value)}
              maxLength={55}
              className="text-left mx-2 w-full resize-none border-none rounded-[8px] focus:outline-none focus:ring-2 focus:ring-blue-500 my-2"
              placeholder="Nombre de actividad"
              disabled={isReadOnly}
            />
          </div>
        </div>
        {!isReadOnly && (
          <div className="flex flex-col items-center cursor-pointer group ml-2" onClick={onDeleteActivity}>
            <DeleteIcon className="text-gray-500 group-hover:text-red-500 transition-colors duration-200 ease-in-out" fontSize="medium" />
            <span className="text-xs text-red-500 group-hover:underline">Eliminar</span>
          </div>
        )}
      </div>
      {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre}</p>}

      <h3 className="font-semibold text-xl">Observaciones</h3>
      {(activity.observaciones || []).map((observacion, observationIndex) => (
        <div
          key={observationIndex}
          className="items-center gap-[20px] self-stretch rounded-[8px] border-[2px] border-[#FFC3CC] bg-white shadow-md w-full mb-2"
        >
          <div className="flex items-center justify-between rounded-lg w-full">
            <textarea
              value={observacion.descripcion}
              onChange={(e) => handleObservationChange(observationIndex, e.target.value)}
              maxLength={260}
              className="text-left mx-2 w-full resize-none border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 my-2"
              placeholder="Describa su observación"
              disabled={isReadOnly}
            />
          </div>
          {errors.observaciones[observationIndex] && <p className="text-red-500 text-sm">{errors.observaciones[observationIndex]}</p>}
        </div>
      ))}
      {!isReadOnly && errors.general && <p className="text-red-500 text-sm">{errors.general}</p>}

      {!isReadOnly && (
        <div className="flex justify-center items-center">
          <button
            onClick={handleAddObservation}
            className="my-4 px-4 py-1 rounded-lg bg-[#8D0F21] text-white shadow-md text-base font-normal transition duration-300 ease-in-out hover:bg-[#4a171f] whitespace-nowrap"
          >
            + Nueva Observación
          </button>
        </div>
      )}
    </div>
  )
}
