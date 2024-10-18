import { useEffect, useState } from 'react'
import ObservationPage from '../../ObservationPage'

interface Objective {
  identificador: number
  nombre: string
}

interface Planilla {
  identificador: number
  fecha: string
  observacion: {
    identificador: number
    descripcion: string
    fecha: string
  }[]
}

const AuxiliaraSelector = () => {
  const [objectives, setObjectives] = useState<Objective[]>([])
  const [selectedObjectiveId, setSelectedObjectiveId] = useState<number | null>(null)
  const [planillas, setPlanillas] = useState<Planilla[]>([])
  const [selectedPlanilla, setSelectedPlanilla] = useState<Planilla | null>(null)
  const [viewingObservationPage, setViewingObservationPage] = useState<boolean>(false)

  useEffect(() => {
    const fetchObjectives = async () => {
      try {
        const response = await fetch('https://cocoabackend.onrender.com/api/objetivos')
        const data = await response.json()
        setObjectives(data)
      } catch (error) {
        console.error('Error fetching objectives:', error)
      }
    }
    fetchObjectives()
  }, [])

  const fetchPlanillas = async (objectiveId: number) => {
    try {
      const response = await fetch(`https://cocoabackend.onrender.com/api/objetivos/${objectiveId}/planillas-seguimiento`)
      const data = await response.json()
      setPlanillas(data)
    } catch (error) {
      console.error('Error fetching planillas:', error)
    }
  }

  const handleObjectiveClick = (objectiveId: number) => {
    setSelectedObjectiveId(objectiveId)
    fetchPlanillas(objectiveId)
  }

  const handlePlanillaClick = (planilla: Planilla) => {
    setSelectedPlanilla(planilla)
    setViewingObservationPage(true)
  }

  const handleBackToObjectives = () => {
    setViewingObservationPage(false)
    setSelectedPlanilla(null)
  }

  if (viewingObservationPage && selectedPlanilla && selectedObjectiveId) {
    return (
      <ObservationPage
        observations={selectedPlanilla.observacion.map((obs) => ({
          id: obs.identificador,
          observation: obs.descripcion,
          activities: [], // Mantén esto vacío o rellénalo según sea necesario
          selectedActivities: obs.descripcion
            ? [{ id: obs.identificador, name: obs.descripcion }] // Mapear strings a Activity[]
            : [],
        }))}
        objectiveId={selectedObjectiveId}
        planillaDate={selectedPlanilla.fecha}
        onBack={handleBackToObjectives}
      />
    )
  }

  return (
    <div>
      <h2>Objetivos</h2>
      {objectives.length === 0 ? (
        <p>Navega para encontrar las planillas</p>
      ) : (
        <ul>
          {objectives.map((objective) => (
            <li key={objective.identificador} onClick={() => handleObjectiveClick(objective.identificador)}>
              Objetivo {objective.identificador}: {objective.nombre}
              {selectedObjectiveId === objective.identificador && planillas.length > 0 && (
                <ul>
                  {planillas.map((planilla) => (
                    <li key={planilla.identificador} onClick={() => handlePlanillaClick(planilla)}>
                      Planilla #{planilla.identificador} (Fecha: {new Date(planilla.fecha).toLocaleDateString()})
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default AuxiliaraSelector
