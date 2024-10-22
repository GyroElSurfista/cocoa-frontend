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

export const PlanillasEvaluacionAccordion: React.FC = () => {
  const [planillas, setPlanillas] = useState<Planilla[]>([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [deliverables, setDeliverables] = useState<Deliverable[]>([])
  const [selectedObjetivo, setSelectedObjetivo] = useState<number | null>(null)
  const [selectedFechaFin, setSelectedFechaFin] = useState<string | null>(null)

  // Fetch de las planillas de seguimiento para todos los objetivos
  useEffect(() => {
    const fetchAllPlanillas = async () => {
      try {
        const response = await fetch(`https://cocoabackend.onrender.com/api/objetivos-con-planilla-evaluacion-generada`)
        const data = await response.json()
        setPlanillas(data)
      } catch (error) {
        console.error('Error al cargar las planillas:', error)
      }
    }

    fetchAllPlanillas()
  }, [])

  // Fetch deliverables for a specific objective
  const fetchDeliverables = async (identificadorObjet: number, fechaFin: string) => {
    try {
      const response = await fetch(`https://cocoabackend.onrender.com/api/objetivos/${identificadorObjet}/entregables`)
      const data = await response.json()
      setDeliverables(data)
      setSelectedObjetivo(identificadorObjet)
      setSelectedFechaFin(fechaFin)
      setIsModalVisible(true)
    } catch (error) {
      console.error('Error al cargar los entregables:', error)
    }
  }

  // Close modal
  const handleAccept = () => {
    setIsModalVisible(false)
  }

  return (
    <div>
      {planillas.length > 0 ? (
        planillas.map((planilla) => (
          <div key={planilla.identificador} className="bg-[#e0e3ff] rounded my-3">
            <div
              className="hover:bg-[#c6caff] w-full border rounded border-[#c6caff] p-4"
              onClick={() => fetchDeliverables(planilla.evaluacion_objetivo[0].identificadorObjet, planilla.fechaFin)}
            >
              <div className="flex flex-row w-full justify-between items-center">
                <div className="w-auto border-r-2 pr-2 border-[#c6caff]">
                  <span className="text-center text-[#1c1c1c] text-lg font-semibold">
                    Objetivo {planilla.evaluacion_objetivo[0].identificadorObjet}
                  </span>
                </div>
                <span className="ml-1 text-gray-600 font-normal w-auto border-r-2 pr-2 border-[#c6caff]">
                  {planilla.evaluacion_objetivo.length > 0 ? planilla.nombre : 'Sin observaciones'}
                </span>

                <div className="ml-auto flex flex-row items-center space-x-4">
                  <div className="w-auto border-l-2 pl-2 border-[#c6caff]">
                    <span>Fecha Inicio: </span>
                    <span className="bg-[#FFC3CC] rounded px-1">{planilla.fechaInici}</span>
                    <span> - </span>
                    <span className="bg-[#C6CAFF] rounded px-1">{planilla.fechaFin}</span>
                  </div>
                  <div className="w-auto border-l-2 pl-2 border-[#c6caff] flex items-center space-x-2">
                    <span>
                      <b>COCOA</b>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 font-bold">No existen objetivos disponibles.</p>
      )}

      {/* Modal */}
      {isModalVisible && selectedFechaFin && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white w-[375px] max-w-lg p-6 rounded-[20px] shadow-lg">
            <h5 className="text-xl font-semibold text-center">Información de planilla</h5>
            <hr className="border-[1.5px] mb-4 mt-4" />
            <div className="flex">
              <p className="font-inter font-normal mb-2 text-sm">Fecha de evaluación: </p>
              <p className="font-inter font-normal mb-2 text-sm mx-2">{selectedFechaFin}</p>
            </div>
            <p className="font-semibold">Entregables:</p>
            <div className="px-[10%]">
              {deliverables.length > 0 ? (
                deliverables.map((deliverable) => (
                  <div
                    key={deliverable.identificador}
                    className="flex rounded-md py-0.5 px-1 my-2 items-center gap-10 align-self-stretch border-radius-4 bg-[#E0E3FF]"
                  >
                    <p>{deliverable.nombre}</p>
                  </div>
                ))
              ) : (
                <p>No hay entregables disponibles.</p>
              )}
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={handleAccept} className="button-primary">
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
