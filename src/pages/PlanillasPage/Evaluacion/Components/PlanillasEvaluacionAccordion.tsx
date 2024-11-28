import { useState, useEffect } from 'react'
import Drop from '../../../../assets/icon-drop.svg'
import * as Evaluacion from './../../../../interfaces/evaluacion.interface'
import { getEntregablesWithObjetive, getObjetivesWhitPlanilla } from '../../../../services/planillaEvaGen.service'

export const PlanillasEvaluacionAccordion: React.FC<Evaluacion.PlanillasEvaluacionAccordionProps> = ({
  identificadorPlani,
  nombrePlani,
}) => {
  const [planillas, setPlanillas] = useState<Evaluacion.Planilla[]>([])
  const [expandedPlanillas, setExpandedPlanillas] = useState<{ [key: number]: Evaluacion.Deliverable[] }>({})

  // Fetch de las planillas de seguimiento para todos los objetivos
  useEffect(() => {
    const fetchAllPlanillas = async () => {
      try {
        const response = await getObjetivesWhitPlanilla()
        const data = await response.data
        const filteredPlanillas = data
          .filter(
            (planilla: Evaluacion.Planilla) => planilla.evaluacion_objetivo.length > 0 && planilla.identificadorPlani === identificadorPlani
          )
          .sort(
            (a: Evaluacion.Planilla, b: Evaluacion.Planilla) =>
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
      const response = await getEntregablesWithObjetive(identificadorObjet)
      const data = await response.data
      return data
    } catch (error) {
      console.error('Error al cargar los entregables:', error)
      return []
    }
  }

  const toggleDropdown = async (planillaId: number, identificadorObjet: number) => {
    setExpandedPlanillas((prevState) => {
      if (prevState[planillaId]) {
        // Si ya está expandido, lo colapsamos
        const { [planillaId]: _, ...rest } = prevState
        return rest
      } else {
        // Expandimos y buscamos los entregables
        fetchDeliverables(identificadorObjet).then((deliverables) => {
          setExpandedPlanillas((currentState) => ({
            ...currentState,
            [planillaId]: deliverables,
          }))
        })
        return { ...prevState }
      }
    })
  }

  return (
    <div>
      {planillas.length > 0 ? (
        // Ordenamos las planillas por fechaFin
        [...planillas]
          .sort((a, b) => new Date(a.fechaFin).getTime() - new Date(b.fechaFin).getTime())
          .map((planilla, index) => (
            <div key={planilla.identificador} className="bg-[#e0e3ff] rounded my-3">
              <div
                className="hover:bg-[#c6caff] w-full border rounded border-[#c6caff] p-4"
                onClick={() => toggleDropdown(planilla.identificador, planilla.evaluacion_objetivo[0]?.identificadorObjet)}
              >
                <div className="flex flex-row w-full justify-between items-center">
                  <div className="w-auto border-r-2 pr-2 border-[#c6caff]">
                    <span className="text-center text-[#1c1c1c] text-lg font-semibold">
                      {planilla.evaluacion_objetivo.length > 0 ? `Planilla ${index + 1}` : 'Sin objetivos'}
                    </span>
                  </div>

                  <span className="flex ml-1 text-gray-600 font-normal w-auto border-r-2 pr-2 border-[#c6caff]">
                    <p className="mr-1 font-bold text-black">Objetivo:</p>
                    {planilla.evaluacion_objetivo.length > 0 ? planilla.nombre : 'Sin observaciones'}
                  </span>

                  <div className="ml-auto flex flex-row items-center space-x-4">
                    <div className="w-auto border-l-2 pl-2 border-[#c6caff]">
                      <span className="mr-1">Fecha fin: </span>
                      <span className="bg-[#C6CAFF] rounded px-1 text-sm">
                        {new Date(new Date(planilla.fechaFin).setDate(new Date(planilla.fechaFin).getDate() + 1)).toLocaleDateString(
                          'es-ES',
                          {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          }
                        )}
                      </span>
                    </div>
                    <div className="w-auto border-l-2 pl-2 border-[#c6caff] flex items-center space-x-2">
                      <div>
                        <img src={Drop} alt="dropdown icon" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Dropdown content */}
              {expandedPlanillas[planilla.identificador] && (
                <div className="py-4 bg-[#E0E3FF] rounded-b-md px-14">
                  <span className="flex font-bold text-base">
                    <p className="mr-1">Fecha de evaluación:</p>
                    {new Date(new Date(planilla.fechaFin).setDate(new Date(planilla.fechaFin).getDate() + 1)).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </span>
                  {expandedPlanillas[planilla.identificador].length > 0 ? (
                    expandedPlanillas[planilla.identificador].map((deliverable, index) => (
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
