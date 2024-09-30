import * as React from 'react'
import { Theme, useTheme } from '@mui/material/styles'
import OutlinedInput from '@mui/material/OutlinedInput'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { useState, useRef, useEffect } from 'react'
import Dots from './../../../assets/dots.svg'

interface Activity {
  id: number
  name: string
}

interface ObservationProps {
  observation: string
  activities: Activity[]
  onSave: (observation: string, activities: Activity[]) => void
  onDelete: () => void // Added for deleting the component
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
  setSelectedActivities: React.Dispatch<React.SetStateAction<Activity[] | null>>
  activities: Activity[]
}> = ({ selectedActivities, setSelectedActivities, activities }) => {
  const theme = useTheme()

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event
    const selected = typeof value === 'string' ? value.split(',') : value
    const updatedActivities = activities.filter((activity) => selected.includes(activity.name))
    setSelectedActivities(updatedActivities)
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

export const Observation: React.FC<ObservationProps> = ({ observation, activities, onSave, onDelete }) => {
  const [selectedActivities, setSelectedActivities] = useState<Activity[] | null>(null)
  const [editableObservation, setEditableObservation] = useState<string>(observation)
  const [error, setError] = useState<string>('')

  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  // Focus on textarea when component is mounted
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.focus()
    }
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

  const handleBlur = () => {
    if (!editableObservation.trim()) {
      setError('La observación no puede estar vacía.')
    } else {
      validateAndSave()
    }
  }

  const validateAndSave = async () => {
    if (!editableObservation.trim()) {
      setError('La observación no puede estar vacía.')
      return
    }

    if (!selectedActivities || selectedActivities.length === 0) {
      setError('Debe seleccionar al menos una actividad.')
      return
    }

    // Preparing the data for the API
    const newObservation = {
      descripcion: editableObservation,
      fecha: new Date().toISOString().split('T')[0], // Automatically generated
      identificadorPlaniSegui: 1, // Static for now
      identificadorActiv: selectedActivities[0].id, // Assume first selected activity for now
    }

    try {
      const response = await fetch('https://cocoabackend.onrender.com/api/crear-observacion/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newObservation),
      })

      const result = await response.json()

      if (response.ok) {
        onSave(editableObservation, selectedActivities)
        setError('')
      } else {
        console.error(result.message)
        setError(result.errors?.descripcion?.[0] || 'Error al guardar la observación')
      }
    } catch (err) {
      console.error('Error al enviar los datos:', err)
      setError('Error de conexión al intentar guardar la observación.')
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
        <div className="ml-4 flex mb-2">
          <MultipleSelectPlaceholder
            selectedActivities={selectedActivities || []}
            setSelectedActivities={setSelectedActivities}
            activities={activities}
          />
          <img
            className="mx-4 mt-2 cursor-pointer"
            src={Dots}
            alt="Dots icon"
            onClick={onDelete} // Deletes the component
          />
        </div>
      </div>
    </div>
  )
}
