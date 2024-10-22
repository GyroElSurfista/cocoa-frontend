import { useState, useEffect } from 'react'

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
    identificadorPlaniSegui: number
    identificadorActiv: number
  }[]
}

interface SelectorObservationModalProps {
  onRedirect: (observations: any[], objectiveId: number, planillaDate: string, planiId: number) => void
}

export const SelectorPlanillaEquipoModal = ({ onRedirect }: SelectorObservationModalProps) => {
  const [showModal, setShowModal] = useState(false)
  const [objectives, setObjectives] = useState<Objective[]>([])
  const [selectedObjective, setSelectedObjective] = useState<number | null>(null)
  const [planillas, setPlanillas] = useState<Planilla[]>([])
  const [selectedPlanilla, setSelectedPlanilla] = useState<number | null>(null)
  const [loadingPlanillas, setLoadingPlanillas] = useState(false)

  useEffect(() => {
    const fetchObjectives = async () => {
      try {
        const response = await fetch('https://cocoabackend.onrender.com/api/objetivos')
        const data = await response.json()
        setObjectives(data)
      } catch (error) {
        console.error('Error al cargar los objetivos', error)
      }
    }
    fetchObjectives()
  }, [])

  useEffect(() => {
    if (selectedObjective) {
      setLoadingPlanillas(true)
      const fetchPlanillas = async () => {
        try {
          const response = await fetch(`https://cocoabackend.onrender.com/api/objetivos/${selectedObjective}/planillas-seguimiento`)
          const data = await response.json()
          setPlanillas(data)
        } catch (error) {
          console.error('Error al cargar las planillas', error)
        } finally {
          setLoadingPlanillas(false)
        }
      }
      fetchPlanillas()
    } else {
      setPlanillas([])
    }
  }, [selectedObjective])

  const handleAccept = () => {
    if (selectedObjective && selectedPlanilla) {
      const selectedPlanillaData = planillas.find((p) => p.identificador === selectedPlanilla)
      if (!selectedPlanillaData) return

      const observations = selectedPlanillaData.observacion.map((obs) => ({
        id: obs.identificador,
        observation: obs.descripcion,
        identificadorPlaniSegui: obs.identificadorPlaniSegui,
        identificadorActiv: obs.identificadorActiv,
        selectedActivities: [{ id: obs.identificadorActiv, name: `Actividad ${obs.identificadorActiv}` }],
        activities: [],
      }))

      console.log('Redirecting with planiId:', selectedPlanillaData.identificador) // Verificar el identificador
      // Redirigir incluyendo `planiId`
      onRedirect(observations, selectedObjective, selectedPlanillaData.fecha, selectedPlanillaData.identificador)
    }
  }

  return (
    <>
      <div
        className="h-10 px-5 py-2.5 my-2 bg-[#eef0ff] rounded-lg justify-between items-center flex cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        <div>Servicio de planilla de equipos</div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white w-[375px] max-w-lg p-6 rounded-[20px] shadow-lg max-h-[85vh] overflow-y-auto">
            <h5 className="text-xl font-semibold text-center">Llenar planilla de Seguimiento</h5>
            <hr className="border-[1.5px] mb-4 mt-4" />
            <p className="font-sm my-2">Selecciona el objetivo y la planilla correspondiente para la cual desees agregar la observación</p>

            <div className="flex gap-4">
              <div className="w-1/2">
                <label htmlFor="objetivo" className="block mb-1 text-sm font-medium text-gray-900">
                  Objetivo<span className="text-[#f60c2e]">*</span>
                </label>
                <select
                  id="objetivo"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 w-full p-1.5"
                  value={selectedObjective ?? ''}
                  onChange={(e) => setSelectedObjective(Number(e.target.value))}
                >
                  <option value="">Objetivo</option>
                  {objectives.map((obj) => (
                    <option key={obj.identificador} value={obj.identificador}>
                      {obj.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-1/2">
                <label htmlFor="planilla" className="block mb-1 text-sm font-medium text-gray-900">
                  Planilla <span className="text-[#f60c2e]">*</span>
                </label>
                <select
                  id="planilla"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 w-full p-1.5"
                  value={selectedPlanilla ?? ''}
                  onChange={(e) => setSelectedPlanilla(Number(e.target.value))}
                  disabled={!selectedObjective || loadingPlanillas}
                >
                  <option value="">Planilla</option>
                  {loadingPlanillas ? (
                    <option>Cargando...</option>
                  ) : (
                    planillas.map((planilla) => (
                      <option key={planilla.identificador} value={planilla.identificador}>
                        {planilla.fecha}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button type="button" className="button-secondary_outlined" onClick={() => setShowModal(false)}>
                Cancelar
              </button>
              <button type="button" className="button-primary" onClick={handleAccept} disabled={!selectedPlanilla}>
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default SelectorPlanillaEquipoModal
