import { useState, useEffect, useCallback } from 'react'
import IconTrash from '../../../../../assets/trash.svg'
import IconRefresh from '../../../../../assets/ico-refresh.svg'
import IconDanger from '../../../../../assets/ico-danger.svg'
import Checkbox from '@mui/material/Checkbox'
import { DeleteObservationAccordion } from './DeleteObservationAccordion'
import Snackbar from '@mui/material/Snackbar'
import SnackbarContent from '@mui/material/SnackbarContent'

interface Objective {
  identificador: number
  nombre: string
}

interface Planilla {
  identificador: number
  fecha: string
}

const DeleteObservationPage = () => {
  const [objectives, setObjectives] = useState<Objective[]>([])
  const [selectedObjective, setSelectedObjective] = useState<number | null>(null)
  const [planillas, setPlanillas] = useState<Planilla[]>([])
  const [selectedPlanilla, setSelectedPlanilla] = useState<number | null>(null)
  const [selectedObservations, setSelectedObservations] = useState<number[]>([])
  const [showModal, setShowModal] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [allObservations, setAllObservations] = useState<number[]>([])
  const [reloadKey, setReloadKey] = useState<number>(0) // <-- Cambiamos a un contador

  useEffect(() => {
    const fetchObjectives = async () => {
      try {
        const response = await fetch('https://cocoabackend.onrender.com/api/objetivos')
        const data = await response.json()
        setObjectives(data)
      } catch (error) {
        setError('Error al cargar los objetivos')
      }
    }
    fetchObjectives()
  }, [])

  useEffect(() => {
    if (selectedObjective) {
      const fetchPlanillas = async () => {
        try {
          const response = await fetch(`https://cocoabackend.onrender.com/api/objetivos/${selectedObjective}/planillas-seguimiento`)
          const data = await response.json()
          setPlanillas(data)
        } catch (error) {
          setError('Error al cargar las planillas')
        }
      }
      fetchPlanillas()
    } else {
      setPlanillas([])
    }
  }, [selectedObjective])

  const handleRefresh = useCallback(() => {
    setReloadKey((prevKey) => prevKey + 1) // <-- Incrementamos el contador
  }, [])

  const handleSelectObservation = (observationId: number) => {
    setSelectedObservations((prev) => (prev.includes(observationId) ? prev.filter((id) => id !== observationId) : [...prev, observationId]))
  }

  const handleSelectAll = (isChecked: boolean) => {
    setSelectedObservations(isChecked ? allObservations : [])
  }

  const handleDeleteClick = () => {
    setShowModal(true)
  }

  const handleConfirmDelete = async () => {
    try {
      await Promise.all(
        selectedObservations.map((observationId) =>
          fetch(`https://cocoabackend.onrender.com/api/observaciones/${observationId}`, { method: 'DELETE' })
        )
      )
      setShowModal(false)
      setSnackbarOpen(true)
      setSelectedObservations([])
    } catch (error) {
      setError('Error al eliminar observaciones')
    }
  }

  return (
    <div className="mx-28">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-3xl">Eliminar Observaciones</h1>
        <div className="flex space-x-4 items-center">
          <div className="flex items-center space-x-4">
            <h3 className="font-bold text-xl">Objetivo:</h3>
            <select
              id="objetivo"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md block w-48 p-1"
              onChange={(e) => setSelectedObjective(Number(e.target.value))}
            >
              <option value="">Selecciona un objetivo</option>
              {objectives.map((objective) => (
                <option key={objective.identificador} value={objective.identificador}>
                  {objective.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-4">
            <h3 className="font-bold text-xl">Planilla:</h3>
            <select
              id="planilla"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md block w-48 p-1"
              onChange={(e) => setSelectedPlanilla(Number(e.target.value))}
              disabled={!selectedObjective}
            >
              <option value="">Selecciona una planilla</option>
              {planillas.map((planilla) => (
                <option key={planilla.identificador} value={planilla.identificador}>
                  {planilla.fecha}
                </option>
              ))}
            </select>
          </div>
          <img
            src={IconRefresh}
            alt="Refresh"
            className="cursor-pointer"
            onClick={handleRefresh} // <-- Manejador del clic
          />
        </div>
      </div>

      <hr className="border-[1.5px] border-[#c6caff] mt-3 mb-3" />

      <div className="flex justify-end items-center space-x-2">
        <p>Eliminar</p>
        <Checkbox onChange={(e) => handleSelectAll(e.target.checked)} />
        <button onClick={handleDeleteClick}>
          <img src={IconTrash} alt="Trash" />
        </button>
      </div>

      <DeleteObservationAccordion
        key={reloadKey} // <-- Usamos el contador como clave única
        selectedObjective={selectedObjective}
        selectedPlanilla={selectedPlanilla}
        onSelectObservation={handleSelectObservation}
        selectedObservations={selectedObservations}
        setAllObservations={setAllObservations}
      />

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white w-full max-w-lg p-6 rounded-[20px] shadow-lg flex flex-col items-center">
            <div className="flex flex-col justify-center items-center py-3">
              <img src={IconDanger} alt="" className="mb-4" />
              <h5 className="text-xl font-semibold text-center">¿Está seguro de eliminar la(s) observación(es) seleccionada(s)?</h5>
            </div>
            <hr className="border-[1.5px] mb-4 w-full" />
            <div className="flex justify-center space-x-4 mt-4">
              <button onClick={() => setShowModal(false)} className="button-secondary_outlined">
                Cancelar
              </button>
              <button onClick={handleConfirmDelete} className="button-primary">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <Snackbar open={snackbarOpen} autoHideDuration={5000} onClose={() => setSnackbarOpen(false)}>
        <SnackbarContent message="Observación eliminada exitosamente" style={{ backgroundColor: '#D3FFD2', color: '#00A407' }} />
      </Snackbar>

      {error && <p className="text-red-500 text-sm pt-2">{error}</p>}
    </div>
  )
}

export default DeleteObservationPage
