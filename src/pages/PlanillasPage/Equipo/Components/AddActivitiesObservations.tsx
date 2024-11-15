import React, { useState, useEffect } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'

interface AddActivitiesObservationsProps {
  activity: { nombre: string; observaciones: { descripcion: string }[] }
  activityIndex: number
  onActivityChange: (activityIndex: number, newValue: string) => void
  onAddObservation: () => void
  onObservationChange: (activityIndex: number, observationIndex: number, newValue: string) => void
  onDeleteActivity: () => void
  onDeleteObservation: (activityIndex: number, observationIndex: number) => void
  isReadOnly: boolean
}

export const AddActivitiesObservations: React.FC<AddActivitiesObservationsProps> = ({
  activity,
  activityIndex,
  onActivityChange,
  onAddObservation,
  onObservationChange,
  onDeleteActivity,
  isReadOnly,
}) => {
  const [errors, setErrors] = useState<{
    nombre?: string
    observaciones: { [key: number]: string }
  }>({ observaciones: {} })

  // Real-time validation for activity name
  const validateActivityName = (name: string) => {
    if (name.trim().length === 0) return ''
    if (name.length < 5) return 'El nombre debe tener al menos 5 caracteres.'
    if (name.length > 50) return 'El nombre debe tener como máximo 50 caracteres.'
    return ''
  }

  // Real-time validation for observation description
  const validateObservation = (description: string) => {
    if (description.trim().length === 0) return ''
    if (description.length < 5) return 'La observación debe tener al menos 5 caracteres.'
    if (description.length > 255) return 'La observación debe tener como máximo 255 caracteres.'
    return ''
  }

  // Handle activity name change with validation
  const handleActivityNameChange = (newValue: string) => {
    const error = validateActivityName(newValue)
    setErrors((prev) => ({
      ...prev,
      nombre: error,
    }))
    onActivityChange(activityIndex, newValue)
  }

  // Handle observation change with validation
  const handleObservationChange = (observationIndex: number, newValue: string) => {
    const error = validateObservation(newValue)
    setErrors((prev) => ({
      ...prev,
      observaciones: {
        ...prev.observaciones,
        [observationIndex]: error,
      },
    }))
    onObservationChange(activityIndex, observationIndex, newValue)
  }

  // Clear errors when values are valid
  useEffect(() => {
    const nameError = validateActivityName(activity.nombre)
    const observationErrors = (activity.observaciones || []).reduce(
      (acc, obs, index) => {
        const error = validateObservation(obs.descripcion)
        if (error) acc[index] = error
        return acc
      },
      {} as { [key: number]: string }
    )

    setErrors({
      nombre: nameError,
      observaciones: observationErrors,
    })
  }, [activity])

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
      {!isReadOnly && (
        <div className="flex justify-center items-center ">
          <button
            onClick={onAddObservation}
            className="my-4 px-4 py-1 rounded-lg bg-[#8D0F21] text-white shadow-md text-base font-normal transition duration-300 ease-in-out hover:bg-[#4a171f] whitespace-nowrap"
          >
            + Nueva Observación
          </button>
        </div>
      )}
    </div>
  )
}
