import { useState, useRef, useEffect } from 'react'
import { Theme, useTheme } from '@mui/material/styles'
import OutlinedInput from '@mui/material/OutlinedInput'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Trash from '../../../../assets/trash.svg'

interface Activity {
  id: number
  name: string
}

interface ObservationProps {
  observation: string
  observationId: number
  activities: Activity[]
  selectedActivities: Activity[]
  onSave: (observation: string, activities: Activity[]) => void
  onDelete: (id: number) => void
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

const MultipleSelectPlaceholder: React.FC<{
  selectedActivity: Activity | null
  setSelectedActivity: React.Dispatch<React.SetStateAction<Activity | null>>
  activities: Activity[]
}> = ({ selectedActivity, setSelectedActivity, activities }) => {
  const theme = useTheme()

  const handleChange = (event: SelectChangeEvent<string>) => {
    const selectedName = event.target.value
    const selected = activities.find((activity) => `Actividad ${activity.id}` === selectedName)

    if (selected && (!selectedActivity || selected.id !== selectedActivity.id)) {
      setSelectedActivity(selected)
    }
  }

  return (
    <FormControl
      sx={{
        m: 0,
        width: {
          xs: '150px',
          sm: '200px',
          md: '250px',
        },
        my: 1,
        padding: 0,
      }}
    >
      <Select
        displayEmpty
        value={selectedActivity ? `Actividad ${selectedActivity.id}` : ''}
        onChange={handleChange}
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
          fontSize: '12px',
          padding: 0,
        }}
      >
        <MenuItem disabled value="" sx={{ padding: 0 }}>
          <em style={{ fontSize: '12px' }}>Seleccionar Actividad</em>
        </MenuItem>
        {activities.map((activity) => (
          <MenuItem
            key={activity.id}
            value={`Actividad ${activity.id}`}
            style={{
              fontWeight:
                selectedActivity && selectedActivity.id === activity.id
                  ? theme.typography.fontWeightMedium
                  : theme.typography.fontWeightRegular,
            }}
            sx={{
              fontSize: '12px',
              paddingTop: 0,
            }}
          >
            Actividad {activity.id}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export const ObservationAccordion: React.FC<ObservationProps> = ({
  observation,
  activities,
  selectedActivities,
  observationId,
  onSave,
  onDelete,
}) => {
  const [editableObservation, setEditableObservation] = useState<string>(observation)
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(selectedActivities[0] || null)
  const [availableActivities, setAvailableActivities] = useState<Activity[]>([])
  const [error, setError] = useState<string>('')

  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.focus()
    }

    const fetchActivities = async () => {
      try {
        const response = await fetch('https://cocoabackend.onrender.com/api/actividades/')
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
  }, [])

  const handleObservationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    if (newValue.length <= 256) {
      setEditableObservation(newValue)
      setError('')
    } else {
      setError('La observación no puede exceder los 256 caracteres.')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      validateAndSave()
    }
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

    try {
      const response = await fetch('https://cocoabackend.onrender.com/api/crear-observacion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          descripcion: editableObservation,
          fecha: new Date().toISOString().split('T')[0],
          identificadorPlaniSegui: 2, // Cambia este valor si es necesario
          identificadorActiv: selectedActivity.id,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        onSave(editableObservation, [selectedActivity])
      } else {
        const errorMessage = await response.text()
        setError('Error al guardar la observación. Inténtalo de nuevo.')
      }
    } catch (error) {
      setError('Error en la conexión al servidor.')
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`https://cocoabackend.onrender.com/api/observaciones/${observationId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        onDelete(observationId)
      } else {
        const errorMessage = await response.text()
        setError('Error al eliminar la observación. Inténtalo de nuevo.')
      }
    } catch (error) {
      setError('Error en la conexión al servidor.')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md w-full">
      <div className="flex items-center borde rounded-lg w-full">
        <textarea
          ref={textAreaRef}
          className="text-left mx-2 w-full resize-none border-none rounded-lg focus:margin focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={editableObservation}
          onChange={handleObservationChange}
          onKeyPress={handleKeyPress} // Handle enter key
        />
        <div className="ml-4 flex">
          <MultipleSelectPlaceholder
            selectedActivity={selectedActivity}
            setSelectedActivity={setSelectedActivity}
            activities={availableActivities}
          />

          <img className="mx-4 cursor-pointer" src={Trash} alt="Trash icon" onClick={handleDelete} />
        </div>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}
