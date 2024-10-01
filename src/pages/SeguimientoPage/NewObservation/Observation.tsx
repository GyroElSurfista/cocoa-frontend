import { useState, useRef, useEffect } from 'react'
import { Theme, useTheme } from '@mui/material/styles'
import OutlinedInput from '@mui/material/OutlinedInput'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Trash from '../../../assets/trash.svg'

interface Activity {
  id: number
  name: string
}

interface ObservationProps {
  observation: string
  observationId: number
  activities: Activity[]
  selectedActivities: Activity[] // Recibe las actividades seleccionadas
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

function getStyles(name: string, selectedActivities: readonly string[], theme: Theme) {
  return {
    fontWeight: selectedActivities.includes(name) ? theme.typography.fontWeightMedium : theme.typography.fontWeightRegular,
  }
}

const MultipleSelectPlaceholder: React.FC<{
  selectedActivities: Activity[]
  setSelectedActivities: React.Dispatch<React.SetStateAction<Activity[]>>
  activities: Activity[]
}> = ({ selectedActivities, setSelectedActivities, activities }) => {
  const theme = useTheme()

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event
    const selected = typeof value === 'string' ? value.split(',') : value

    // Log for debugging
    console.log('handleChange called, selected values:', selected)

    const updatedActivities = activities.filter((activity) => selected.includes(activity.name))

    // Log the activities before updating state
    console.log('Updated activities:', updatedActivities)
    console.log('Current selected activities:', selectedActivities)

    // Evitamos un ciclo infinito verificando si el nuevo conjunto de actividades seleccionadas es diferente
    if (
      updatedActivities.length !== selectedActivities.length ||
      updatedActivities.some((a, index) => a.id !== selectedActivities[index]?.id)
    ) {
      console.log('Updating selected activities state')
      setSelectedActivities(updatedActivities)
    }
  }

  return (
    <FormControl
      sx={{
        m: 0,
        width: {
          xs: '150px', // Small screens
          sm: '200px', // Medium screens
          md: '250px', // Large screens
        },
        my: 1,
        padding: 0,
      }}
    >
      <Select
        multiple
        displayEmpty
        value={selectedActivities.map((activity) => activity.name)}
        onChange={handleChange}
        input={<OutlinedInput />}
        renderValue={(selected) => {
          if (selected.length === 0) {
            return <em>Seleccionar Actividad</em>
          }

          return selected.join(', ')
        }}
        MenuProps={MenuProps}
        inputProps={{ 'aria-label': 'Without label' }}
        sx={{
          fontSize: '12px', // Reduced font size in Select
          padding: 0, // Remove padding in Select
        }}
      >
        <MenuItem disabled value="" sx={{ padding: 0 }}>
          <em style={{ fontSize: '12px' }}>Seleccionar Actividad</em>
        </MenuItem>
        {activities.map((activity) => (
          <MenuItem
            key={activity.id}
            value={activity.name}
            style={getStyles(
              activity.name,
              selectedActivities.map((a) => a.name),
              theme
            )}
            sx={{
              fontSize: '12px', // Reduced font size in MenuItem
              paddingTop: 0, // Remove padding in MenuItem
            }}
          >
            {activity.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export const Observation: React.FC<ObservationProps> = ({
  observation,
  activities,
  selectedActivities,
  observationId,
  onSave,
  onDelete,
}) => {
  const [editableObservation, setEditableObservation] = useState<string>(observation)
  const [currentSelectedActivities, setCurrentSelectedActivities] = useState<Activity[]>(selectedActivities)
  const [error, setError] = useState<string>('')

  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.focus()
    }
    console.log('useEffect: Component mounted, textarea focused')
  }, [])

  const handleObservationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    console.log('Observation change:', newValue)

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
      console.log('Enter key pressed')
      validateAndSave()
    }
  }

  const handleBlur = () => {
    console.log('Textarea blur event')
    if (editableObservation !== observation || currentSelectedActivities !== selectedActivities) {
      validateAndSave()
    }
  }

  const validateAndSave = async () => {
    console.log('Validating and saving observation')

    if (!editableObservation.trim()) {
      setError('La observación no puede estar vacía.')
      return
    }

    if (!currentSelectedActivities || currentSelectedActivities.length === 0) {
      setError('Debe seleccionar al menos una actividad.')
      return
    }

    if (editableObservation !== observation || currentSelectedActivities !== selectedActivities) {
      console.log('Changes detected, saving...')

      try {
        const response = await fetch('https://cocoabackend.onrender.com/api/crear-observacion', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            descripcion: editableObservation,
            fecha: new Date().toISOString().split('T')[0], // Fecha actual
            identificadorPlaniSegui: 2, // Cambia esto si lo necesitas dinámico
            identificadorActiv: currentSelectedActivities[0].id, // Usa el primer ID de actividad seleccionada
          }),
        })

        if (response.ok) {
          const data = await response.json()
          console.log('Observation saved successfully:', data)
          onSave(editableObservation, currentSelectedActivities)
        } else {
          const errorMessage = await response.text()
          console.error('Failed to save observation:', errorMessage)
          setError('Error al guardar la observación. Inténtalo de nuevo.')
        }
      } catch (error) {
        console.error('Error in fetch:', error)
        setError('Error en la conexión al servidor.')
      }
    }
  }

  // Nueva funcionalidad para eliminar la observación
  const handleDelete = async () => {
    console.log('Deleting observation with ID:', observationId)

    try {
      const response = await fetch(`https://cocoabackend.onrender.com/api/observaciones/${observationId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        console.log('Observation deleted successfully')
        onDelete(observationId) // Llama a la función de eliminación para actualizar el estado en el componente padre
      } else {
        const errorMessage = await response.text()
        console.error('Failed to delete observation:', errorMessage)
        setError('Error al eliminar la observación. Inténtalo de nuevo.')
      }
    } catch (error) {
      console.error('Error in fetch:', error)
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
          onBlur={handleBlur} // Handle when textarea loses focus
        />
        <div className="ml-4 flex">
          <MultipleSelectPlaceholder
            selectedActivities={currentSelectedActivities}
            setSelectedActivities={setCurrentSelectedActivities}
            activities={activities}
          />
          {/* Botón de eliminación */}
          <img
            className="mx-4 cursor-pointer"
            src={Trash}
            alt="Trash icon"
            onClick={handleDelete} // Deletes the component
          />
        </div>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}
