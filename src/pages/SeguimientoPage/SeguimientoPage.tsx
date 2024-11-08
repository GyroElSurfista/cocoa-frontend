import { Snackbar, SnackbarCloseReason, SnackbarContent } from '@mui/material'
import { useEffect, useState } from 'react'
import { getObjectives } from '../../services/objective.service'
import GenerateTrackerModal from './GenerateTrackerModal/GenerateTrackerModal'
import ObjectiveTracker from './Components/ObjectiveTracker'
import { Objective } from '../ObjectivePage/Models/objective'

const SeguimientoPage = () => {
  const [objetivos, setObjetivos] = useState<Objective[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarColor, setSnackbarColor] = useState('')

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const handleGenerateTracker = () => {
    cargarObjetivos()
    setSnackbarMessage('Planilla de seguimiento semanal generada exitosamente')
    setSnackbarColor('#D3FFD2')
    setOpenSnackbar(true)
  }

  const handleCloseSnackbar = (_event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenSnackbar(false)
  }

  const cargarObjetivos = async () => {
    try {
      const response = await getObjectives()
      console.log('objSegui', response.data)
      const objetivosFiltrados = response.data
        .map((obj: any) => ({
          identificador: obj.identificador,
          iniDate: obj.fechaInici,
          finDate: obj.fechaFin,
          objective: obj.nombre,
          valueP: obj.valorPorce,
          planillasGener: obj.planillasGener,
          nombrePlani: obj.nombrePlani,
        }))
        .filter((objetivo: Objective) => objetivo.planillasGener) // Filtrar solo los objetivos con planillasGener: true

      setObjetivos(objetivosFiltrados)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    cargarObjetivos()
  }, [])

  return (
    <div>
      <h2 className="text-black text-3xl font-semibold">Generar Planillas de Seguimiento</h2>
      <hr className="border-[1.5px] border-[#c6caff] mt-3 mb-6" />

      {objetivos.length > 0 ? (
        objetivos.map((objetivo, index) => <ObjectiveTracker key={index} objective={objetivo} index={index} />)
      ) : (
        <p className="text-center font-semibold mt-4">No existen objetivos disponibles.</p>
      )}

      <hr className="border-[1.5px] border-[#c6caff] mt-4 mb-4" />
      <div className="flex justify-center pb-3">
        <button onClick={openModal} className="button-primary">
          Generar Planillas
        </button>
      </div>

      <GenerateTrackerModal isOpen={isModalOpen} onClose={closeModal} onGenerate={handleGenerateTracker} />

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
            color: snackbarColor === '#D3FFD2' ? '#00A407' : '#A40000',
          }}
          message={snackbarMessage}
        />
      </Snackbar>
    </div>
  )
}

export default SeguimientoPage
