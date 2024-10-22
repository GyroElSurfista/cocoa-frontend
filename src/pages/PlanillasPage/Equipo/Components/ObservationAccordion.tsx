import { useState, useEffect } from 'react'
import IconModeEdit from '../../../../assets/icon-modeEdit.svg'

interface Activity {
  id: number
  name: string
}

interface ObservationProps {
  observation: string
  observationId: number | null // Puede ser null para las nuevas observaciones
  identificadorPlaniSegui: number
  identificadorActiv: number | null
  objectiveId: number
  selectedActivities: Activity[]
  onSave: (observation: string, activities: Activity[]) => void
  existingObservations: string[] // Lista de observaciones existentes para verificar duplicados
}

const ObservationAccordion: React.FC<ObservationProps> = ({
  observation,
  observationId,
  identificadorPlaniSegui,
  identificadorActiv,
  objectiveId,
  selectedActivities = [],
  onSave,
  existingObservations,
}) => {
  const [editableObservation, setEditableObservation] = useState<string>(observation)
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(selectedActivities.length > 0 ? selectedActivities[0] : null)
  const [availableActivities, setAvailableActivities] = useState<Activity[]>([])
  const [error, setError] = useState<string>('')

  const [isEditing, setIsEditing] = useState(observationId === null) // Inicia en modo edición si la observación es nueva

  // Fetch actividades para el objetivo seleccionado
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(`https://cocoabackend.onrender.com/api/objetivos/${objectiveId}/actividades`)
        if (response.ok) {
          const data = await response.json()
          const formattedActivities = data.map((item: any) => ({
            id: item.identificador,
            name: item.nombre,
          }))
          setAvailableActivities(formattedActivities)
        } else {
          setError('Error al cargar las actividades.')
        }
      } catch (error) {
        setError('Error en la conexión al servidor.')
      }
    }

    fetchActivities()
  }, [objectiveId])

  const handleActivityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(event.target.value)
    const selected = availableActivities.find((activity) => activity.id === selectedId)

    if (selected && (!selectedActivity || selected.id !== selectedActivity.id)) {
      setSelectedActivity(selected)
      setIsEditing(true)
    }
  }

  const handleObservationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditableObservation(e.target.value)
  }

  const validateAndSave = async () => {
    if (!editableObservation.trim()) {
      setError('La observación no puede estar vacía.')
      return
    }

    if (!selectedActivity) {
      setError('Debe seleccionar una actividad.')
      return
    }

    // Verificar si ya existe una observación con el mismo nombre para la misma actividad
    const duplicateObservation = existingObservations.find(
      (obs) => obs.observation.trim() === editableObservation.trim() && obs.identificadorActiv === selectedActivity.id
    )

    if (duplicateObservation) {
      setError('Ya existe una observación con el mismo nombre para esta actividad.')
      return
    }

    // Guardar la observación si no es duplicada
    try {
      const response = await fetch(`https://cocoabackend.onrender.com/api/crear-observacion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          descripcion: editableObservation,
          fecha: new Date().toISOString().split('T')[0], // Fecha actual en formato "YYYY-MM-DD"
          identificadorPlaniSegui,
          identificadorActiv: selectedActivity.id,
        }),
      })

      if (response.ok) {
        const createdObservation = await response.json()
        console.log('Observación creada:', createdObservation)
        onSave(editableObservation, [selectedActivity])
        setError('') // Limpiar mensaje de error tras guardar correctamente
        setIsEditing(false)
      } else {
        const errorMessage = await response.text()
        setError('Error al guardar la observación. Inténtalo de nuevo.')
      }
    } catch (error) {
      setError('Error en la conexión al servidor.')
    }
  }

  const toggleEditing = () => {
    if (isEditing) {
      validateAndSave() // Si está en modo edición, guardamos los cambios
    } else {
      setIsEditing(true) // Si no está en edición, activamos el modo edición
    }
  }

  return (
    <div className="my-4 items-center gap-[20px] self-stretch rounded-[8px] border-[2px] border-[#FFC3CC] bg-white shadow-md w-full">
      <div className="flex items-center justify-between rounded-lg w-full">
        <textarea
          className="text-left mx-2 w-full resize-none border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={editableObservation}
          onChange={handleObservationChange}
          disabled={!isEditing}
          placeholder="Describa su observación"
        />
        <div className="mx-4 flex items-center">
          <select
            value={selectedActivity?.id || ''}
            onChange={handleActivityChange}
            className="flex justify-end items-center p-[3px] gap-[10px] flex-[1_0_0] rounded-[8px] bg-[#FFC3CC] text-center w-28"
            disabled={!isEditing}
          >
            <option value="" disabled>
              Seleccionar Actividad
            </option>
            {availableActivities.map((activity) => (
              <option key={activity.id} value={activity.id}>
                Actividad {activity.id}
              </option>
            ))}
          </select>

          {isEditing && (
            <div onClick={toggleEditing} className="cursor-pointer ml-2 flex items-center justify-center">
              <img
                src={IconModeEdit}
                alt="Modo Edición"
                className="h-6 w-6" // Tamaño fijo para que no se haga pequeño
                style={{ minWidth: '24px', minHeight: '24px' }} // Añade un tamaño mínimo para evitar que se encoja
              />
            </div>
          )}
        </div>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}

export default ObservationAccordion
