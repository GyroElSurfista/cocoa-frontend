import { useState, useEffect } from 'react'
import ObservationPage from '../../ObservationPage' // Importar tu componente ObservationPage

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

export const SelectorObservationModal = () => {
  const [showModal, setShowModal] = useState(false)
  const [objectives, setObjectives] = useState<Objective[]>([])
  const [selectedObjective, setSelectedObjective] = useState<number | null>(null)
  const [planillas, setPlanillas] = useState<Planilla[]>([])
  const [selectedPlanilla, setSelectedPlanilla] = useState<number | null>(null)
  const [loadingPlanillas, setLoadingPlanillas] = useState(false)
  const [redirectToObservationPage, setRedirectToObservationPage] = useState(false)
  const [key, setKey] = useState(0) // Estado para forzar la recarga de ObservationPage

  // Cargar objetivos
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

  // Cargar planillas cuando se selecciona un objetivo
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

  // Restablecer valores a su estado por defecto cuando se cancela o cuando se usa el botón onBack
  const handleReset = () => {
    setSelectedObjective(null)
    setSelectedPlanilla(null)
    setShowModal(false)
  }

  // Manejar el clic en "Aceptar" para redirigir a la página de observación
  const handleAccept = () => {
    if (selectedObjective && selectedPlanilla) {
      setRedirectToObservationPage(true)
      setKey((prevKey) => prevKey + 1) // Actualizamos la key para forzar recarga del componente
      setShowModal(false) // Cerrar el modal
    }
  }

  // Lógica de redirección a ObservationPage
  if (redirectToObservationPage && selectedObjective && selectedPlanilla) {
    const selectedPlanillaData = planillas.find((p) => p.identificador === selectedPlanilla)

    if (!selectedPlanillaData) return null // Si no existe planilla, no retornamos nada

    // Formatear las observaciones
    const observations = selectedPlanillaData.observacion.map((obs) => ({
      id: obs.identificador,
      observation: obs.descripcion,
      identificadorPlaniSegui: obs.identificadorPlaniSegui,
      identificadorActiv: obs.identificadorActiv,
      selectedActivities: [{ id: obs.identificadorActiv, name: `Actividad ${obs.identificadorActiv}` }],
      activities: [], // Aseguramos que la propiedad activities esté presente, aunque sea un array vacío
    }))

    // Redirigir a la página ObservationPage con la información de objetivo y planilla seleccionada
    return (
      <ObservationPage
        key={key} // Forzar la recarga del componente al cambiar la key
        observations={observations} // Pasar las observaciones formateadas
        objectiveId={selectedObjective}
        planillaDate={selectedPlanillaData.fecha}
        onBack={() => {
          setRedirectToObservationPage(false)
          handleReset() // Restablecer los valores por defecto al volver
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
        onClick={() => setShowModal(true)}
      >
        <div>Servicio de edición de observaciones</div>
      </div>

      {/* Modal para seleccionar objetivo y planilla */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white w-[375px] max-w-lg p-6 rounded-[20px] shadow-lg max-h-[85vh] overflow-y-auto">
            <h5 className="text-xl font-semibold text-center">Editar Observación</h5>
            <hr className="border-[1.5px] mb-4 mt-4" />
            <p className="font-sm my-2">Selecciona el objetivo y la planilla correspondiente para la cual desees editar la observación</p>

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
              <button
                type="button"
                onClick={handleReset} // Llamar a la función handleReset para cancelar y restablecer los valores
                className="button-secondary_outlined"
              >
                Cancelar
              </button>
              <button type="button" onClick={handleAccept} className="button-primary" disabled={!selectedPlanilla}>
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SelectorObservationModal
