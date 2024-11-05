import { useState } from 'react'
import SelectorObservationModal from '../pages/SeguimientoPage/NewObservation/Components/Selector/SelectorObservationModal'
import ObservationPage from '../pages/SeguimientoPage/NewObservation/ObservationPage'
import PlanillaEquipoPage from './PlanillasPage/Equipo/PlanillaEquipoPage'
import SelectorPlanillaEquipoModal from './PlanillasPage/Equipo/Components/SelectorPlanillaEquipoModal'
import SelectorPlaniEvaObj from './LlenarPlaniEvaObjPage/Components/SelectorPlaniEvaObj'

export const SelectorServices = () => {
  const [observations, setObservations] = useState<any[] | null>(null)
  const [objectiveId, setObjectiveId] = useState<number | null>(null)
  const [planiSeguiId, setplaniSeguiId] = useState<number | null>(null)
  const [planillaDate, setPlanillaDate] = useState<string | null>(null)
  const [observartionPage, setObservationPage] = useState(false)
  const [teamPage, setTeamPage] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)
  // Función que maneja la redirección del modal
  const handleRedirectObservations = (obs: any[], objectiveId: number, date: string) => {
    setObservations(obs)
    setObjectiveId(objectiveId)
    setPlanillaDate(date)
    setObservationPage(true)
  }

  const handleRedirectTeams = (obs: any[], objectiveId: number, date: string, planiId: number) => {
    console.log('Received planiId:', planiId) // Verificar el identificador de planilla recibido
    setObservations(obs)
    setObjectiveId(objectiveId)
    setPlanillaDate(date)
    setplaniSeguiId(planiId) // Almacenar el ID de planilla de seguimiento
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
  if (observations && objectiveId && planillaDate && teamPage && planiSeguiId !== null) {
    // Si todos los datos están presentes y `planiSeguiId` no es null, renderizamos `PlanillaEquipoPage`
    return (
      <PlanillaEquipoPage
        observations={observations}
        objectiveId={objectiveId}
        planillaDate={planillaDate}
        planillaSeguiId={planiSeguiId} // Ya estamos seguros de que no es `null`
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

      {/* Renderizamos el modal de observaciones */}
      <SelectorObservationModal onRedirect={handleRedirectObservations} />

      <SelectorPlanillaEquipoModal onRedirect={handleRedirectTeams} />

      <div className="h-10 px-5 py-2.5 my-2 bg-[#eef0ff] rounded-lg justify-between items-center flex cursor-pointer" onClick={openModal}>
        <div>Servicio de llenado de planilla de evaluacion de un objetivo</div>
      </div>
      <SelectorPlaniEvaObj isOpen={isModalOpen} onClose={closeModal} />
    </div>
  )
}

export default SelectorServices
