// EntregablePage.tsx
import { useEffect, useState } from 'react'
import { Snackbar, SnackbarContent, SnackbarCloseReason } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import NewEntregableModal from './Components/NewEntregableModal'
import EntregableAccordion from './Components/EntregableAccordion'
import * as Entregables from './../../interfaces/entregable.interface'
import { getAllObjetivosEntregables, getAllEntregables } from '../../services/entregable.service'

const EntregablePage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { identificadorPlani, objetivoIds, nombrePlani } = location.state || {}

  // Estados locales sincronizados con location.state
  const [currentPlani, setCurrentPlani] = useState({
    identificadorPlani: identificadorPlani || null,
    objetivoIds: objetivoIds || [],
    nombrePlani: nombrePlani || '',
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [entregables, setEntregables] = useState<Entregables.Entregable[]>([])
  const [availableObjetivos, setAvailableObjetivos] = useState<Entregables.Objetivo[]>([])
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarColor, setSnackbarColor] = useState('')
  const [refreshTrigger, setRefreshTrigger] = useState(false)

  // Sincroniza el estado local con location.state cuando cambia
  useEffect(() => {
    if (identificadorPlani && nombrePlani && objetivoIds) {
      setCurrentPlani({ identificadorPlani, nombrePlani, objetivoIds })
    } else {
      // Redirigir si falta algún dato
      navigate('/selector-proyecto')
    }
  }, [identificadorPlani, nombrePlani, objetivoIds, navigate])

  // Fetch entregables
  const fetchEntregables = async () => {
    try {
      const response = await getAllEntregables()
      const data = await response.data
      setEntregables(data)
    } catch (error) {
      console.error('Error al cargar los entregables:', error)
    }
  }

  // Fetch objetivos
  const fetchObjetivos = async () => {
    try {
      const response = await getAllObjetivosEntregables()
      const data = response.data // Aquí obtienes los datos directamente del servicio
      setAvailableObjetivos(data.filter((obj: any) => currentPlani.objetivoIds?.includes(obj.identificador)))
    } catch (error) {
      console.error('Error al cargar los objetivos:', error)
    }
  }

  useEffect(() => {
    fetchEntregables()
    fetchObjetivos()
  }, [currentPlani])

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const handleCloseSnackbar = (_event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') return
    setOpenSnackbar(false)
  }

  const handleCreateEntregable = async (newEntregables: Entregables.Entregable[]) => {
    setEntregables([...entregables, ...newEntregables])
    setRefreshTrigger((prev) => !prev)
    setSnackbarMessage('Entregable(s) agregado(s) correctamente')
    setSnackbarColor('#D3FFD2')
    setOpenSnackbar(true)
    await fetchEntregables()
  }

  return (
    <div className="px-2 mx-6">
      <h2 className="text-lg font-semibold ">
        <span className="text-3xl font-bold ">Agregar entregables</span>
      </h2>
      <hr className="border-[1.5px] border-[#c6caff] my-3" />
      <div className="flex justify-between">
        <h2 className="text-2xl font-semibold">Proyecto {currentPlani.nombrePlani}</h2>
        <button onClick={openModal} className="button-primary">
          + Añadir entregable
        </button>
      </div>

      <hr className="border-[1.5px] border-[#c6caff] my-3" />
      <p className="font-semibold text-lg">Entregables:</p>

      <div className="mt-4">
        <EntregableAccordion objetivoIds={currentPlani.objetivoIds} refreshTrigger={refreshTrigger} />
      </div>

      <hr className="border-[1.5px] border-[#c6caff] mt-4" />

      <NewEntregableModal
        key={currentPlani.nombrePlani} // Usar nombrePlani como key
        isOpen={isModalOpen}
        onClose={closeModal}
        onCreate={handleCreateEntregable}
        nombrePlani={currentPlani.nombrePlani}
      />

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

export default EntregablePage
