import { Snackbar, SnackbarCloseReason, SnackbarContent } from '@mui/material'
import { useEffect, useState } from 'react'
import { generateWeeklyTracking } from '../../services/planillaSeguimiento.service'
import { getObjectives } from '../../services/objective.service'
import GenerateTrackerModal from './GenerateTrackerModal/GenerateTrackerModal'
import ObjectiveTracker from './Components/ObjectiveTracker'

interface Objective {
  id: number
  nombre: string
  iniDate: string
  finDate: string
  objective: string
  valueP: string
  planillasGener: boolean
}

const SeguimientoPage = () => {
  // Lista de objetivos con su estado individual
  const [objetivos, setObjetivos] = useState<Objective[]>([])

  const [isModalOpen, setIsModalOpen] = useState(false)

  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarColor, setSnackbarColor] = useState('')

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const handleGenerateTracker = () => {}

  // Función para generar la planilla de un objetivo específico
  const handleClick = async (id: number) => {
    try {
      const response = await generateWeeklyTracking(id)
      console.log('generar planilla', response.data)
      // Actualiza el objetivo específico en el estado
      setObjetivos((prev) => prev.map((obj) => (obj.id === id ? { ...obj, planillasGener: true } : obj)))

      // Configura el Snackbar para éxito
      setSnackbarMessage('Planilla generada exitosamente')
      setSnackbarColor('#D3FFD2')
      setOpenSnackbar(true)
    } catch (error) {
      console.log('error al generar las planillas', error)
    }
  }

  const handleCloseSnackbar = (_event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenSnackbar(false)
  }

  useEffect(() => {
    const cargarObjetivos = async () => {
      try {
        const response = await getObjectives()
        console.log(response)
        const objetivos = response.data.map((obj: any) => ({
          id: obj.identificador,
          nombre: obj.nombre,
          iniDate: obj.fechaInici,
          finDate: obj.fechaFin,
          objective: obj.nombre,
          valueP: obj.valorPorce,
          planillasGener: obj.planillasGener,
        }))

        setObjetivos(objetivos)
      } catch (error) {
        console.log(error)
      }
    }

    cargarObjetivos()
  }, [])
  return (
    <div>
      <h2 className="text-black text-3xl font-semibold pl-6">Generar Planillas de Seguimiento</h2>
      <hr className="border-[1.5px] border-[#c6caff] mt-3 mb-6" />
      <>
        {objetivos.map((objetivo, index) => (
          <ObjectiveTracker key={index} objective={objetivo} />
        ))}
        <div className="flex justify-center pt-3">
          <button onClick={openModal} className="button-primary">
            Generar Planillas
          </button>
        </div>

        <GenerateTrackerModal isOpen={isModalOpen} onClose={closeModal} onGenerate={handleGenerateTracker} />
        {/* Snackbar para mostrar los mensajes de éxito o error */}
        <Snackbar
          open={openSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          autoHideDuration={5000}
          onClose={handleCloseSnackbar}
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
              background: snackbarColor,
              color: snackbarColor === '#D3FFD2' ? '#00A407' : '#A40000', // Cambia el color del texto basado en el tipo de mensaje
            }}
            message={snackbarMessage}
          />
        </Snackbar>
      </>
    </div>
  )
}

export default SeguimientoPage
