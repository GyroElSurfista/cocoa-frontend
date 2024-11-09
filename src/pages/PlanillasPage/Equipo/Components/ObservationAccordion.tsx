import { useState, useEffect } from 'react'
import IconModeEdit from '../../../../assets/icon-modeEdit.svg'
import IconTrash from '../../../../assets/trash.svg'

interface Activity {
  id: number
  name: string
}

interface ObservationProps {
  observation: string
  observationId: number | null
  identificadorPlaniSegui: number
  identificadorActiv: number | null
  objectiveId: number
  selectedActivities: Activity[]
  isReadOnly: boolean
  onSave: (observation: string, activities: Activity[]) => void
  onDelete: (observationId: number) => void
  existingObservations: string[]
}

const ObservationAccordion: React.FC<ObservationProps> = ({
  observation,
  observationId,
  identificadorPlaniSegui,
  identificadorActiv,
  objectiveId,
  selectedActivities = [],
  isReadOnly,
  onSave,
  onDelete,
  existingObservations,
}) => {
  const [editableObservation, setEditableObservation] = useState<string>(observation)
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(selectedActivities.length > 0 ? selectedActivities[0] : null)
  const [availableActivities, setAvailableActivities] = useState<Activity[]>([])
  const [error, setError] = useState<string>('')

  const [isEditing, setIsEditing] = useState(observationId === null)
  const [isSaved, setIsSaved] = useState<boolean>(observationId !== null)

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
    if (editableObservation.trim().length < 5) {
      setError('La observación debe tener al menos 5 caracteres.')
      return
    }

    if (editableObservation.trim().length > 100) {
      setError('La observación no puede tener más de 100 caracteres.')
      return
    }

    if (!editableObservation.trim()) {
      setError('La observación no puede estar vacía.')
      return
    }

    if (!selectedActivity) {
      setError('Debe seleccionar una actividad.')
      return
    }

    const duplicateObservation = existingObservations.find(
      (obs) => obs === editableObservation.trim() && identificadorActiv === selectedActivity.id
    )

    if (duplicateObservation) {
      setError('Ya existe una observación con el mismo nombre para esta actividad.')
      return
    }

    try {
      const response = await fetch(`https://cocoabackend.onrender.com/api/crear-observacion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          descripcion: editableObservation,
          fecha: new Date().toISOString().split('T')[0],
          identificadorPlaniSegui,
          identificadorActiv: selectedActivity.id,
        }),
      })

      if (response.ok) {
        const createdObservation = await response.json()
        onSave(editableObservation, [selectedActivity])
        setError('')
        setIsEditing(false)
        setIsSaved(true)
      } else {
        setError('Error al guardar la observación. Inténtalo de nuevo.')
      }
    } catch (error) {
      setError('Error en la conexión al servidor.')
    }
  }

  const handleDelete = async () => {
    if (isEditing) {
      if (observationId !== null) {
        onDelete(observationId)
      }
    } else {
      setIsEditing(true)
    }
  }

  const toggleEditing = () => {
    console.log(isReadOnly)
    if (isEditing) {
      validateAndSave()
    } else {
      setIsEditing(true)
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

          {/* Condicional para no mostrar los íconos cuando isReadOnly es true */}
          {!isReadOnly && (
            <>
              {!isEditing && isSaved ? (
                <div onClick={handleDelete} className="cursor-pointer ml-2 flex items-center justify-center">
                  <img src={IconTrash} alt="Eliminar" className="h-6 w-6" style={{ minWidth: '24px', minHeight: '24px' }} />
                </div>
              ) : (
                <div onClick={toggleEditing} className="cursor-pointer ml-2 flex items-center justify-center">
                  <img src={IconModeEdit} alt="Editar" className="h-6 w-6" style={{ minWidth: '24px', minHeight: '24px' }} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}

export default ObservationAccordion
