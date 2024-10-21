import { useState, useEffect, useRef } from 'react'
import { useTheme } from '@mui/material/styles'
import OutlinedInput from '@mui/material/OutlinedInput'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import IconEdit from '../../../../../assets/icon-edit.svg'
import IconEditMode from '../../../../../assets/icon-modeEdit.svg'

interface Activity {
  id: number
  name: string
}

interface ObservationProps {
  observation: string
  observationId: number
  identificadorPlaniSegui: number
  identificadorActiv: number
  objectiveId: number
  planillaId: number
  selectedActivities: Activity[]
  onSave: (observation: string, activities: Activity[]) => void
}

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}
const EditObservationAccordion: React.FC<ObservationProps> = ({
  observation,
  observationId,
  objectiveId,
  identificadorPlaniSegui,
  planillaId,
  selectedActivities = [], // Valor predeterminado
  onSave,
}) => {
  const [editableObservation, setEditableObservation] = useState<string>(observation)
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(selectedActivities.length > 0 ? selectedActivities[0] : null)
  const [availableActivities, setAvailableActivities] = useState<Activity[]>([])
  const [error, setError] = useState<string>('')

  const [isEditing, setIsEditing] = useState(false)
  const theme = useTheme()
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

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

  const handleActivityChange = (event: SelectChangeEvent<string>) => {
    const selectedName = event.target.value
    const selected = availableActivities.find((activity) => `Actividad ${activity.id}` === selectedName)

    if (selected && (!selectedActivity || selected.id !== selectedActivity.id)) {
      setSelectedActivity(selected)
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

    // Actualizar observación con PATCH
    try {
      const response = await fetch(`https://cocoabackend.onrender.com/api/observaciones`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identificador: observationId,
          descripcion: editableObservation,
          identificadorPlaniSegui,
          identificadorActiv: selectedActivity.id,
        }),
      })

      if (response.ok) {
        const updatedObservation = await response.json()
        console.log('Observación actualizada:', updatedObservation)
        console.log(identificadorPlaniSegui)
        onSave(editableObservation, [selectedActivity])
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
      validateAndSave()
      console.log(observation, observationId, objectiveId, planillaId, selectedActivities)
    } else {
      setIsEditing(true)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md w-full">
      <div className="flex items-center justify-between rounded-lg w-full">
        <textarea
          ref={textAreaRef}
          className="text-left mx-2 w-full resize-none border-none rounded-lg focus:margin focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={editableObservation}
          onChange={handleObservationChange}
          disabled={!isEditing}
        />
        <div className="mx-4 flex items-center">
          <FormControl
            sx={{
              m: 0,
              width: {
                xs: '150px',
                sm: '150px',
                md: '150px',
              },
              my: 1,
              padding: 0,
            }}
            disabled={!isEditing}
          >
            <Select
              displayEmpty
              value={selectedActivity ? `Actividad ${selectedActivity.id}` : ''}
              onChange={handleActivityChange}
              input={<OutlinedInput />}
              renderValue={(selected) => {
                if (!selected) {
                  return <em>Seleccionar Actividad</em>
                }
                return selected
              }}
              MenuProps={MenuProps}
              inputProps={{ 'aria-label': 'Without label' }}
              sx={{
                // Estilos solicitados
                display: 'inline-flex',
                padding: '5px',
                alignItems: 'center',
                gap: '5px',
                borderRadius: '6px',
                border: '0.5px solid var(--Port-Gore-300, #A4A7FD)',
                background: 'var(--Port-Gore-100, #E0E3FF)',
                fontSize: '12px',
                // Altura reducida
                height: '30px',
                minHeight: '30px', // Establecemos una altura mínima para evitar expansiones no deseadas
              }}
            >
              <MenuItem disabled value="">
                <em>Seleccionar Actividad</em>
              </MenuItem>
              {availableActivities.map((activity) => (
                <MenuItem
                  key={activity.id}
                  value={`Actividad ${activity.id}`}
                  style={{
                    fontWeight:
                      selectedActivity && selectedActivity.id === activity.id
                        ? theme.typography.fontWeightMedium
                        : theme.typography.fontWeightRegular,
                  }}
                  sx={{ fontSize: '12px', paddingTop: 0 }}
                >
                  Actividad {activity.id}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <div onClick={toggleEditing} className="cursor-pointer ml-2">
            {isEditing ? (
              <img src={IconEditMode} alt="Modo Edición" className="h-6 w-6" />
            ) : (
              <img src={IconEdit} alt="Editar" className="h-6 w-6" />
            )}
          </div>
        </div>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}

export default EditObservationAccordion
