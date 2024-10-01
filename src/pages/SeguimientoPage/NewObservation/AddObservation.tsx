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
  actividades: Activity[]
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
      const mappedObservations = data.map((obs: any) => ({
        identificador: obs.identificador,
        descripcion: obs.descripcion,
        fecha: obs.fecha,
        identificadorPlaniSegui: obs.identificadorPlaniSegui,
        identificadorActiv: obs.identificadorActiv,
        actividades: [{ id: obs.identificadorActiv, name: `Actividad ${obs.identificadorActiv}` }],
      }))
      setObservations(mappedObservations)
    } catch (error) {
      console.error('Error en la carga de datos:', error)
    }
  }

  const handleAddObjective = () => {
    setNewObservationData({
      identificador: Date.now(),
      descripcion: 'Nueva observación agregada',
      fecha: new Date().toISOString().split('T')[0],
      identificadorPlaniSegui: 1,
      identificadorActiv: 1,
      actividades: [{ id: 1, name: 'Actividad 1' }],
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
          identificadorActiv: 1,
          actividades,
        },
      ])
      setNewObservationData(null)
      setIsAddingObservation(false) // Hide the form after saving
    }
  }

  const handleDeleteObservation = () => {
    setNewObservationData(null)
    setIsAddingObservation(false) // Hide the form if user cancels
  }

  useEffect(() => {
    fetchObservations()
  }, [])

  return (
    <div className="bg-[#EEF0FF] p-7 w-11/12">
      <div className="rounded-lg mx-auto">
        <div className="flex flex-wrap justify-center gap-6">
          {/* Existing observations */}
          {observations.map((observationData) => (
            <Observation
              key={observationData.identificador}
              observation={observationData.descripcion}
              activities={observationData.actividades}
              onSave={handleSaveObservation}
              onDelete={handleDeleteObservation} // Pass the delete function
            />
          ))}

          {/* Render new observation form if the user clicked "+ Nueva Observación" */}
          {isAddingObservation && newObservationData && (
            <Observation
              observation={newObservationData.descripcion}
              activities={newObservationData.actividades}
              onSave={handleSaveObservation}
              onDelete={handleDeleteObservation} // Pass the delete function
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
