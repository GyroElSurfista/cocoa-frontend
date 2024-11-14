import { useState, useEffect } from 'react'
import Drop from '../../../../assets/icon-drop.svg'

interface EvaluacionObjetivo {
  identificador: number
  fecha: string
  habilitadoPago: boolean
  sePago: boolean
  observacion: string
  identificadorObjet: number
}

interface Planilla {
  identificador: number
  nombre: string
  fechaInici: string
  fechaFin: string
  valorPorce: string
  planillasGener: boolean
  identificadorPlani: number
  planillaEvaluGener: boolean
  evaluacion_objetivo: EvaluacionObjetivo[]
}

interface Deliverable {
  identificador: number
  nombre: string
  descripcion: string
  identificadorObjet: number
}

interface PlanillasEvaluacionAccordionProps {
  identificadorPlani: number
  nombrePlani: string
}

export const PlanillasEvaluacionAccordion: React.FC<PlanillasEvaluacionAccordionProps> = ({ identificadorPlani, nombrePlani }) => {
  const [planillas, setPlanillas] = useState<Planilla[]>([])
  const [deliverables, setDeliverables] = useState<Deliverable[]>([])
  const [expandedPlanilla, setExpandedPlanilla] = useState<number | null>(null)

  // Fetch de las planillas de seguimiento para todos los objetivos
  useEffect(() => {
    const fetchAllPlanillas = async () => {
      try {
        const response = await fetch('https://cocoabackend.onrender.com/api/objetivos-con-planilla-evaluacion-generada')
        const data = await response.json()
        const filteredPlanillas = data
          .filter((planilla: Planilla) => planilla.evaluacion_objetivo.length > 0 && planilla.identificadorPlani === identificadorPlani)
          .sort(
            (a: Planilla, b: Planilla) =>
              (a.evaluacion_objetivo[0]?.identificadorObjet || 0) - (b.evaluacion_objetivo[0]?.identificadorObjet || 0)
          ) // Orden ascendente por identificadorObjet
        setPlanillas(filteredPlanillas)
      } catch (error) {
        console.error('Error al cargar las planillas:', error)
      }
    }

    fetchAllPlanillas()
  }, [identificadorPlani])

  // Fetch deliverables for a specific objective
  const fetchDeliverables = async (identificadorObjet: number) => {
    try {
      const response = await fetch(`https://cocoabackend.onrender.com/api/objetivos/${identificadorObjet}/entregables`)
      const data = await response.json()
      setDeliverables(data)
    } catch (error) {
      console.error('Error al cargar los entregables:', error)
    }
  }

  const toggleDropdown = (planillaId: number, identificadorObjet: number) => {
    if (expandedPlanilla === planillaId) {
      setExpandedPlanilla(null)
    } else {
      setExpandedPlanilla(planillaId)
      fetchDeliverables(identificadorObjet)
    }
  }

  return (
    <div>
      {planillas.length > 0 ? (
        planillas.map((planilla, index) => (
          <div key={planilla.identificador} className="bg-[#e0e3ff] rounded my-3">
            <div
              className="hover:bg-[#c6caff] w-full border rounded border-[#c6caff] p-4"
              onClick={() => toggleDropdown(planilla.identificador, planilla.evaluacion_objetivo[0]?.identificadorObjet)}
            >
              <div className="flex flex-row w-full justify-between items-center">
                <div className="w-auto border-r-2 pr-2 border-[#c6caff]">
                  <span className="text-center text-[#1c1c1c] text-lg font-semibold">
                    {planilla.evaluacion_objetivo.length > 0 ? `Objetivo ${index + 1}` : 'Sin objetivos'}
                  </span>
                </div>

                <span className="ml-1 text-gray-600 font-normal w-auto border-r-2 pr-2 border-[#c6caff]">
                  {planilla.evaluacion_objetivo.length > 0 ? planilla.nombre : 'Sin observaciones'}
                </span>

                <div className="ml-auto flex flex-row items-center space-x-4">
                  <div className="w-auto border-l-2 pl-2 border-[#c6caff]">
                    <span>Fecha Inicio: </span>
                    <span className="bg-[#C6CAFF] rounded px-1 text-sm">
                      {new Date(planilla.fechaInici).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </span>
                    <span> - </span>
                    <span className="bg-[#C6CAFF] rounded px-1 text-sm">
                      {new Date(planilla.fechaFin).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="w-auto border-l-2 pl-2 border-[#c6caff] flex items-center space-x-2">
                    <span>
                      <b>{nombrePlani}</b>
                    </span>
                    <div>
                      <img src={Drop} alt="dropdown icon" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Dropdown content */}
            {expandedPlanilla === planilla.identificador && (
              <div className="py-4 bg-[#E0E3FF] rounded-b-md px-14">
                <span className="font-bold text-base">
                  Fecha de evaluación:
                  {new Date(planilla.fechaFin).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </span>
                {deliverables.length > 0 ? (
                  deliverables.map((deliverable, index) => (
                    <div key={deliverable.identificador} className="my-2 px-2 bg-[#EEF0FF] rounded-md py-4">
                      <span className="font-semibold border-r-2 pr-2 border-[#c6caff]">{`Entregable ${index + 1}`}</span>
                      <span className="text-sm ml-4">{deliverable.nombre}</span>
                    </div>
                  ))
                ) : (
                  <p>No hay entregables disponibles.</p>
                )}
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 font-bold">No existen objetivos disponibles.</p>
      )}
    </div>
  )
}
