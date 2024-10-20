import { useEffect, useState } from 'react'
import ObservationPage from '../../ObservationPage'
import { getObjectives } from '../../../../../services/objective.service'
import ObjectiveTracker from '../../../Components/ObjectiveTracker'
import { Objective } from '../../../../ObjectivePage/Models/objective'

interface Planilla {
  identificador: number
  fecha: string
  observacion: {
    identificador: number
    descripcion: string
    fecha: string
  }[]
}

const SelectorPlanilla = () => {
  const [objetivos, setObjetivos] = useState<Objective[]>([])
  const [objectives, setObjectives] = useState<Objective[]>([])
  const [selectedObjectiveId, setSelectedObjectiveId] = useState<number | null>(null)
  const [planillas, setPlanillas] = useState<Planilla[]>([])
  const [selectedPlanilla, setSelectedPlanilla] = useState<Planilla | null>(null)
  const [viewingObservationPage, setViewingObservationPage] = useState<boolean>(false)

  const cargarObjetivos = async () => {
    try {
      const response = await getObjectives()
      const objetivosFiltrados = response.data
        .map((obj: any) => ({
          identificador: obj.identificador,
          iniDate: obj.fechaInici,
          finDate: obj.fechaFin,
          objective: obj.nombre,
          valueP: obj.valorPorce,
          planillasGener: obj.planillasGener,
        }))
        .filter((objetivo: Objective) => objetivo.planillasGener)

      setObjetivos(objetivosFiltrados)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    cargarObjetivos()
  }, [])
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

      {objetivos.length > 0 ? (
        objetivos.map((objetivo, index) => <ObjectiveTracker key={index} objective={objetivo} />)
      ) : (
        <p className="text-center font-semibold mt-4">No existen objetivos disponibles.</p>
      )}
    </div>
  )
}

export default SelectorPlanilla
