import { useState, useEffect } from 'react'
import SelectorObjectiveTracker from './SelectorObjectiveTracker'
import ObservationPage from '../../ObservationPage'
import { getObjectives } from '../../../../../services/objective.service'
import { Objective } from '../../../../ObjectivePage/Models/objective'

interface Planilla {
  identificador: number
  fecha: string
  observacion: {
    identificador: number
    descripcion: string
    fecha: string
    identificadorPlaniSegui: number
    identificadorActiv: number
  }[]
}

const SelectorPlanilla = () => {
  const [objetivos, setObjetivos] = useState<Objective[]>([])
  const [selectedObjectiveId, setSelectedObjectiveId] = useState<number | null>(null)
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

  const handlePlanillaClick = (planilla: Planilla, objectiveId: number) => {
    console.log(planilla)
    setSelectedPlanilla(planilla)
    setSelectedObjectiveId(objectiveId)
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
          activities: [], // Aquí puedes pasar las actividades relacionadas si es necesario
          selectedActivities: [{ id: obs.identificadorActiv, name: `Actividad ${obs.identificadorActiv}` }],
          identificadorPlaniSegui: obs.identificadorPlaniSegui,
          identificadorActiv: obs.identificadorActiv,
        }))}
        objectiveId={selectedObjectiveId}
        planillaDate={selectedPlanilla.fecha}
        onBack={handleBackToObjectives}
      />
    )
  }

  return (
    <div>
      <h2 className="font-bold text-3xl">Objetivos</h2>
      <hr className="border-[1.5px] border-[#c6caff] mt-3 mb-3" />
      {objetivos.length > 0 ? (
        objetivos.map((objetivo, index) => (
          <SelectorObjectiveTracker
            key={index}
            objective={objetivo}
            onPlanillaClick={(planilla) => handlePlanillaClick(planilla, objetivo.identificador)}
          />
        ))
      ) : (
        <p className="text-center font-semibold mt-4">No existen objetivos disponibles.</p>
      )}
    </div>
  )
}

export default SelectorPlanilla
