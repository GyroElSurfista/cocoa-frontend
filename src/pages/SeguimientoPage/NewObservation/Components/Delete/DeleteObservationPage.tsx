import { useState, useEffect, useCallback } from 'react'
import Checkbox from '@mui/material/Checkbox'
import Snackbar from '@mui/material/Snackbar'
import SnackbarContent from '@mui/material/SnackbarContent'
import Autocomplete from '@mui/material/Autocomplete' // Autocompletado
import TextField from '@mui/material/TextField' // Input para el autocompletado
import { DeleteObservationAccordion } from './DeleteObservationAccordion'
import IconTrash from '../../../../../assets/trash.svg'
import IconRefresh from '../../../../../assets/ico-refresh.svg'
import IconDanger from '../../../../../assets/ico-danger.svg'

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
  const [selectedObjective, setSelectedObjective] = useState<Objective | null>(null)
  const [planillas, setPlanillas] = useState<Planilla[]>([])
  const [selectedPlanilla, setSelectedPlanilla] = useState<number | null>(null)
  const [selectedObservations, setSelectedObservations] = useState<number[]>([])
  const [showModal, setShowModal] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [allObservations, setAllObservations] = useState<number[]>([])
  const [reloadKey, setReloadKey] = useState<number>(0)

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
          const response = await fetch(
            `https://cocoabackend.onrender.com/api/objetivos/${selectedObjective.identificador}/planillas-seguimiento`
          )
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
    setSelectedObjective(null)
    setSelectedPlanilla(null)
    setReloadKey((prevKey) => prevKey + 1)
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

      setAllObservations((prev) => prev.filter((id) => !selectedObservations.includes(id)))
      setReloadKey((prevKey) => prevKey + 1)
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

            <Autocomplete
              id="objetivo-autocomplete"
              options={objectives}
              getOptionLabel={(option) => option.nombre}
              value={selectedObjective}
              onChange={(event, newValue) => setSelectedObjective(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Selecciona un objetivo"
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    sx: {
                      height: '30px', // Controla el alto del input
                      fontSize: '14px', // Texto seleccionado
                      backgroundColor: '#f9fafb', // bg-gray-50
                      borderColor: '#d1d5db', // border-gray-300
                      color: '#111827', // text-gray-900
                      paddingLeft: '0.75rem', // Padding interno para separar texto del borde izquierdo
                      alignItems: 'center', // Alinea verticalmente el contenido
                    },
                  }}
                  InputLabelProps={{
                    sx: {
                      fontSize: '12px', // Placeholder de 12px
                      left: '1rem', // Margen a la izquierda del label
                      top: '50%', // Centrado vertical inicial
                      transform: 'translateY(-50%)', // Centrado vertical exacto
                      transition: 'all 0.2s ease-in-out', // Animación suave
                      '&.MuiInputLabel-shrink': {
                        fontSize: '10px', // Mantener tamaño reducido del label
                        top: '-6px', // Ajustar posición cuando sube
                        left: '1rem', // Mantener el mismo margen al subir
                        transform: 'none', // Eliminar transformaciones adicionales
                      },
                    },
                  }}
                  sx={{
                    width: '12rem', // Ancho w-48
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '0.375rem', // rounded-md
                      padding: '0.25rem', // p-1
                    },
                    '& .MuiOutlinedInput-root.Mui-focused': {
                      borderColor: '#d1d5db', // Mantener color del borde al enfocar
                    },
                  }}
                />
              )}
            />
          </div>

          <div className="flex items-center space-x-4">
            <h3 className="font-bold text-xl">Planilla:</h3>
            <select
              id="planilla"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md block w-48 p-1"
              value={selectedPlanilla || ''}
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
          <img src={IconRefresh} alt="Refresh" className="cursor-pointer" onClick={handleRefresh} />
        </div>
      </div>

      <hr className="border-[1.5px] border-[#c6caff] mt-3" />

      <div className="flex justify-end items-center space-x-2">
        <p>Eliminar</p>
        <Checkbox onChange={(e) => handleSelectAll(e.target.checked)} />
        <button onClick={handleDeleteClick}>
          <img src={IconTrash} alt="Trash" />
        </button>
      </div>
      <hr className="border-[1.5px] border-[#c6caff]  mb-3" />
      <DeleteObservationAccordion
        key={reloadKey}
        selectedObjective={selectedObjective?.identificador ?? null}
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
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      <Snackbar
        open={snackbarOpen}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
      >
        <SnackbarContent
          style={{
            display: 'flex',
            width: '325px',
            padding: '15px 20px',
            justifyContent: 'start',
            alignItems: 'center',
            gap: '10px',
            borderRadius: '10px',
            background: '#D3FFD2',
            color: '#00A407',
          }}
          message="Observación eliminada exitosamente"
        />
      </Snackbar>

      {error && <p className="text-red-500 text-sm pt-2">{error}</p>}
    </div>
  )
}

export default DeleteObservationPage
