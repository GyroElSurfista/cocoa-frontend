import React, { useState, useEffect } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import IconClose from '@mui/icons-material/Close'

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
    onDeleteObservation,
    onValidationChange,
    isReadOnly,
  } = props

  const [isActivityNameValid, setIsActivityNameValid] = useState(false) // Estado del nombre de actividad
  const [observationsValidStates, setObservationsValidStates] = useState<boolean[]>([]) // Estado de cada observación

  useEffect(() => {
    const initialStates =
      activity.observaciones.length > 0
        ? activity.observaciones.map(() => false) // Inicializa como inválido para todas las observaciones
        : [] // Sin observaciones, no necesita estados de validación
    setObservationsValidStates(initialStates)

    // Si no hay observaciones, se considera válido
    if (activity.observaciones.length === 0) {
      onValidationChange(activityIndex, isActivityNameValid)
    }
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
    const hasObservations = activity.observaciones.length > 0
    const allObservationsValid = observationsStates.every(Boolean)
    const isValid = isActivityNameValid && (hasObservations ? allObservationsValid : false)

    // Solo llama si cambia el estado
    if (ValidityState[activityIndex] !== isValid) {
      onValidationChange(activityIndex, isValid)
    }
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
  const handleDeleteObservation = (observationIndex: number) => {
    const updatedValidStates = observationsValidStates.filter((_, i) => i !== observationIndex)

    // Eliminar la observación
    onDeleteObservation(activityIndex, observationIndex)

    // Validar inmediatamente después de eliminar la observación
    const isValid = isActivityNameValid && updatedValidStates.length > 0 && updatedValidStates.every(Boolean)
    onValidationChange(activityIndex, isValid)

    if (updatedValidStates.length === 0) {
      setObservationsValidStates([])
      return
    }

    // Actualiza el estado de errores y validaciones después
    setErrors((prev) => {
      const updatedErrors = { ...prev.observaciones }
      delete updatedErrors[observationIndex]
      return { ...prev, observaciones: updatedErrors }
    })
    setObservationsValidStates(updatedValidStates)
  }

  useEffect(() => {
    const hasErrors = activity.nombre.trim().length < 5 || activity.observaciones.some((obs) => obs.descripcion.trim().length < 5)

    // Si no hay observaciones, se ignoran errores de observación
    onValidationChange(activityIndex, activity.observaciones.length === 0 || !hasErrors)
  }, [activity.nombre, activity.observaciones, onValidationChange, activityIndex])

  useEffect(() => {
    const allObservationsValid = observationsValidStates.length > 0 && observationsValidStates.every(Boolean)
    const isValid = isActivityNameValid && allObservationsValid
    const hasDuplicate = activity.observaciones.some((obs, i) =>
      activity.observaciones.some((innerObs, j) => i !== j && obs.descripcion.trim() === innerObs.descripcion.trim())
    )

    const generalError =
      !isActivityNameValid || (activity.observaciones.length > 0 && observationsValidStates.some((valid) => !valid)) || hasDuplicate
        ? 'Debe llenar la actividad y sus respectivas observacione(s) para guardar la planilla.'
        : undefined

    setErrors((prev) => ({
      ...prev,
      general: generalError,
    }))

    // Solo notifica cambios al padre si el estado global cambió
    if (activity.observaciones.length === 0 || isValid !== observationsValidStates.every(Boolean)) {
      onValidationChange(activityIndex, isValid)
    }
  }, [isActivityNameValid, observationsValidStates, activity.observaciones.length, activityIndex, onValidationChange])

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
        <div key={observationIndex}>
          <div className="items-center gap-2 self-stretch rounded-[8px] border-[2px] border-[#FFC3CC] bg-white shadow-md w-full mb-2 relative">
            <div className="flex items-center justify-between rounded-lg w-full">
              <textarea
                value={observacion.descripcion}
                onChange={(e) => handleObservationChange(observationIndex, e.target.value)}
                maxLength={260}
                className="text-left mx-2 w-full resize-none border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 my-2 pr-10"
                placeholder="Describa su observación"
                disabled={isReadOnly}
              />
              {!isReadOnly && (
                <IconClose
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-red-500"
                  onClick={() => handleDeleteObservation(observationIndex)}
                />
              )}
            </div>
            {errors.observaciones[observationIndex] && <p className="text-red-500 text-sm">{errors.observaciones[observationIndex]}</p>}
          </div>
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
