import { useState } from 'react'
//import SelectorObservationModal from '../pages/SeguimientoPage/NewObservation/Components/Selector/SelectorObservationModal'
import ObservationPage from '../pages/SeguimientoPage/NewObservation/ObservationPage'
import PlanillaEquipoPage from './PlanillasPage/Equipo/PlanillaEquipoPage'
import SelectorPlanillaEquipoModal from './PlanillasPage/Equipo/Components/SelectorPlanillaEquipoModal'
import { useNavigate } from 'react-router-dom'
import ProjectSelectorModalEvaluacion from './PlanillasPage/Evaluacion/Components/ProjectSelectorModalEvaluacion'
import SelectorPlaniEvaObj from './LlenarPlaniEvaObjPage/Components/SelectorPlaniEvaObj'
import SelectorProjectEntregable from './EntregablePage/Components/SelectorProjectEntregable'

export const SelectorServices = () => {
  const [observations, setObservations] = useState<any[] | null>(null)
  const [objectiveId, setObjectiveId] = useState<number | null>(null)
  const [planiSeguiId, setplaniSeguiId] = useState<number | null>(null)
  const [planillaDate, setPlanillaDate] = useState<string | null>(null)
  const [objectiveName, setObjectiveName] = useState<string | null>(null)
  const [observartionPage, setObservationPage] = useState(false)
  const [teamPage, setTeamPage] = useState(false)
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)
  const [isProjectModalEntregableOpen, setIsProjectModalEntregableOpen] = useState(false)

  const openProjectModal = () => setIsProjectModalOpen(true)
  const closeProjectModal = () => setIsProjectModalOpen(false)

  const openProjectModalEntregable = () => setIsProjectModalEntregableOpen(true)
  const closeProjectModalEntregable = () => setIsProjectModalEntregableOpen(false)

  const navigate = useNavigate()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)
  // Función que maneja la redirección del modal
  // const handleRedirectObservations = (obs: any[], objectiveId: number, date: string) => {
  //   setObservations(obs)
  //   setObjectiveId(objectiveId)
  //   setPlanillaDate(date)
  //   setObservationPage(true)
  // }

  const handleProjectSelect = (identificadorPlani: number, objetivoIds: number[], nombrePlani: string) => {
    closeProjectModalEntregable()
    navigate('/objetivos-entregables', { state: { identificadorPlani, objetivoIds, nombrePlani } })
  }

  const handleRedirectTeams = (obs: any[], objectiveId: number, date: string, planiId: number, objectiveName: string) => {
    console.log('Received planiId:', planiId) // Verificar el identificador de planilla recibido
    setObservations(obs)
    setObjectiveId(objectiveId)
    setPlanillaDate(date)
    setplaniSeguiId(planiId)
    setObjectiveName(objectiveName) // Almacenar el ID de planilla de seguimiento
    setTeamPage(true)
  }

  if (observations && objectiveId && planillaDate && observartionPage) {
    // Si hay datos de observación, redirigimos a la página de observaciones
    return (
      <ObservationPage
        observations={observations}
        objectiveId={objectiveId}
        planillaDate={planillaDate}
        onBack={() => {
          // Si volvemos desde la página de observaciones, restablecemos todo
          setObservations(null)
          setObjectiveId(null)
          setPlanillaDate(null)
          setObservationPage(false)
        }}
      />
    )
  }
  if (observations && objectiveId && planillaDate && teamPage && objectiveName && planiSeguiId !== null) {
    // Si todos los datos están presentes y `planiSeguiId` no es null, renderizamos `PlanillaEquipoPage`
    return (
      <PlanillaEquipoPage
        observations={observations}
        objectiveId={objectiveId}
        planillaDate={planillaDate}
        planillaSeguiId={planiSeguiId} // Ya estamos seguros de que no es `null`
        objectiveName={objectiveName}
        onBack={() => {
          // Si volvemos desde la página de observaciones, restablecemos todo
          setObservations(null)
          setObjectiveId(null)
          setplaniSeguiId(null)
          setPlanillaDate(null)
          setTeamPage(false)
        }}
      />
    )
  }

  return (
    <div className="mx-28">
      <h1 className="font-bold text-3xl">Usuario</h1>
      <hr className="border-[1.5px] border-[#c6caff] mt-3 mb-3" />
      <h2 className="font-bold text-2xl">Servicios</h2>
      <div
        className="h-10 px-5 py-2.5 my-2 bg-[#eef0ff] rounded-lg justify-between items-center flex cursor-pointer"
        onClick={() => navigate('/objetivos')}
      >
        <p>Servicio de registro de objetivos</p>
      </div>
      <div
        className="h-10 px-5 py-2.5 my-2 bg-[#eef0ff] rounded-lg justify-between items-center flex cursor-pointer"
        onClick={() => navigate('/seguimiento')}
      >
        <p>Servicio de generacion de planillas de seguimiento semanal</p>
      </div>
      <div
        className="h-10 px-5 py-2.5 my-2 bg-[#eef0ff] rounded-lg justify-between items-center flex cursor-pointer"
        onClick={() => navigate('/eliminar-plantillas')}
      >
        <p>Servicio de eliminación de plantillas de evaluación de un objetivo</p>
      </div>
      <div
        className="h-10 px-5 py-2.5 my-2 bg-[#eef0ff] rounded-lg justify-between items-center flex cursor-pointer"
        onClick={() => navigate('/crear-plantilla')}
      >
        <p>Servicio de creación de plantillas</p>
      </div>
      <div
        className="h-10 px-5 py-2.5 my-2 bg-[#eef0ff] rounded-lg justify-between items-center flex cursor-pointer"
        onClick={() => navigate('/eliminar-actividad')}
      >
        <p>Servicio de eliminación de actividades</p>
      </div>
      <div
        className="h-10 px-5 py-2.5 my-2 bg-[#eef0ff] rounded-lg justify-between items-center flex cursor-pointer"
        onClick={() => navigate('/crear-actividad')}
      >
        <p>Servicio de creación de actividades</p>
      </div>
      {/* Opción para abrir el modal de selección de proyectos */}
      <div
        className="h-10 px-5 py-2.5 my-2 bg-[#eef0ff] rounded-lg justify-between items-center flex cursor-pointer"
        onClick={openProjectModalEntregable}
      >
        <p>Servicio de entregables para un objetivo</p>
      </div>
      <SelectorProjectEntregable
        isOpen={isProjectModalEntregableOpen}
        onClose={closeProjectModalEntregable}
        onSelect={handleProjectSelect}
      />
      {/* Renderizamos el modal de observaciones */}

      <SelectorPlanillaEquipoModal onRedirect={handleRedirectTeams} />
      {/* Servicio para abrir modal de generación */}
      <div
        className="h-10 px-5 py-2.5 my-2 bg-[#eef0ff] rounded-lg justify-between items-center flex cursor-pointer"
        onClick={openProjectModal}
      >
        <p>Servicio de generación de planillas de evaluación de un objetivo</p>
      </div>
      <ProjectSelectorModalEvaluacion isOpen={isProjectModalOpen} onClose={closeProjectModal} />
      <div className="h-10 px-5 py-2.5 my-2 bg-[#eef0ff] rounded-lg justify-between items-center flex cursor-pointer" onClick={openModal}>
        <div>Servicio de llenado de planilla de evaluacion de un objetivo</div>
      </div>
      <SelectorPlaniEvaObj isOpen={isModalOpen} onClose={closeModal} />
    </div>
  )
}

export default SelectorServices
