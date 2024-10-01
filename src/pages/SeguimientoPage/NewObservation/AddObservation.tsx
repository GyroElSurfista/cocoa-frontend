import { useEffect, useState } from 'react'
import { Observation } from './Observation.tsx'

interface Activity {
  id: number
  name: string
}

interface ObservationData {
  identificador: number
  descripcion: string
  fecha: string
  identificadorPlaniSegui: number
  identificadorActiv: number
  activities: Activity[]
  selectedActivities: Activity[] // Nuevo campo para almacenar las actividades seleccionadas
}

export const AddObservation: React.FC = () => {
  const [observations, setObservations] = useState<ObservationData[]>([])
  const [isAddingObservation, setIsAddingObservation] = useState(false) // To control the add form visibility
  const [newObservationData, setNewObservationData] = useState<ObservationData | null>(null)

  const fetchObservations = async () => {
    try {
      const response = await fetch('https://cocoabackend.onrender.com/api/observaciones')
      if (!response.ok) {
        throw new Error('Error al cargar los datos del servidor')
      }
      const data = await response.json()
      const mappedObservations = data.map((obs: any) => {
        const activities = [{ id: obs.identificadorActiv, name: `Actividad ${obs.identificadorActiv}` }]

        // Filtra y selecciona la actividad correcta basada en identificadorActiv
        const selectedActivities = activities.filter((activity) => activity.id === obs.identificadorActiv)

        return {
          identificador: obs.identificador,
          descripcion: obs.descripcion,
          fecha: obs.fecha,
          identificadorPlaniSegui: obs.identificadorPlaniSegui,
          identificadorActiv: obs.identificadorActiv,
          activities,
          selectedActivities, // Almacena la actividad seleccionada
        }
      })
      setObservations(mappedObservations)
    } catch (error) {
      console.error('Error en la carga de datos:', error)
    }
  }

  const handleAddObjective = () => {
    setNewObservationData({
      identificador: Date.now(),
      descripcion: '',
      fecha: new Date().toISOString().split('T')[0],
      identificadorPlaniSegui: 1,
      identificadorActiv: 1,
      activities: [{ id: 1, name: 'Actividad 1' }],
      selectedActivities: [{ id: 1, name: 'Actividad 1' }], // La actividad predeterminada seleccionada
    })
    setIsAddingObservation(true) // Show the observation form
  }

  const handleSaveObservation = (observation?: string, activities: Activity[] = []) => {
    if (newObservationData && !observation && activities.length === 0) {
      setObservations([...observations, newObservationData])
      setNewObservationData(null)
      setIsAddingObservation(false) // Hide the form after saving
    } else if (observation && activities) {
      setObservations([
        ...observations,
        {
          identificador: Date.now(),
          descripcion: observation,
          fecha: new Date().toISOString().split('T')[0],
          identificadorPlaniSegui: 1,
          identificadorActiv: activities[0].id,
          activities,
          selectedActivities: activities, // Actualiza las actividades seleccionadas
        },
      ])
      setNewObservationData(null)
      setIsAddingObservation(false) // Hide the form after saving
    }
  }

  const handleDeleteObservation = (observationId: number) => {
    setObservations(observations.filter((obs) => obs.identificador !== observationId))
    setNewObservationData(null)
    setIsAddingObservation(false) // Hide the form if user cancels
  }

  useEffect(() => {
    fetchObservations()
  }, [])

  return (
    <div className="bg-[#EEF0FF] p-7 w-11/12">
      <div className="rounded-lg mx-auto">
        <div className="flex flex-wrap justify-center gap-4">
          {/* Existing observations */}
          {observations.map((observationData) => (
            <Observation
              key={observationData.identificador}
              observationId={observationData.identificador} // Pasamos el identificador
              observation={observationData.descripcion}
              activities={observationData.activities}
              selectedActivities={observationData.selectedActivities} // Pasa las actividades seleccionadas
              onSave={handleSaveObservation}
              onDelete={() => handleDeleteObservation(observationData.identificador)} // Pasamos el identificador a la función de eliminación
            />
          ))}

          {/* Render new observation form if the user clicked "+ Nueva Observación" */}
          {isAddingObservation && newObservationData && (
            <Observation
              observationId={newObservationData.identificador} // Pasamos el identificador de la nueva observación
              observation={newObservationData.descripcion}
              activities={newObservationData.activities}
              selectedActivities={newObservationData.selectedActivities} // Pasa las actividades seleccionadas
              onSave={handleSaveObservation}
              onDelete={() => handleDeleteObservation(newObservationData.identificador)} // Pasamos el identificador a la función de eliminación
            />
          )}
        </div>

        {/* Button for adding a new observation */}
        {!isAddingObservation && (
          <div className="w-[calc(100%-3rem)] bg-[#eef0ff] flex justify-center mt-4">
            <div className="pl-[5px] pr-2.5 bg-[#251b4d] rounded-lg shadow justify-center items-center inline-flex">
              <button onClick={handleAddObjective} className="button-primary w-auto">
                + Nueva Observación
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
