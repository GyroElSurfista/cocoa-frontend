// EntregablePage.tsx
import { useEffect, useState } from 'react'
import { Snackbar, SnackbarContent, SnackbarCloseReason } from '@mui/material'
import { useLocation, NavLink } from 'react-router-dom'
import NewEntregableModal from './Components/NewEntregableModal'
import EntregableAccordion from './Components/EntregableAccordion'
import * as Entregables from './../../interfaces/entregable.interface'

const EntregablePage = () => {
  const location = useLocation()
  const { identificadorObjet } = location.state || {}

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [entregables, setEntregables] = useState<Entregables.Entregable[]>([])
  const [availableObjetivos, setAvailableObjetivos] = useState<Entregables.Objetivo[]>([])

  // Estados para controlar el Snackbar
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarColor, setSnackbarColor] = useState('')

  // Fetch entregables
  const fetchEntregables = async () => {
    try {
      const response = await fetch('https://cocoabackend.onrender.com/api/entregables')
      const data = await response.json()
      setEntregables(data)
    } catch (error) {
      console.error('Error al cargar los entregables:', error)
    }
  }

  useEffect(() => {
    fetchEntregables()
  }, [])

  // Fetch objetivos
  useEffect(() => {
    const fetchObjetivos = async () => {
      try {
        const response = await fetch('https://cocoabackend.onrender.com/api/objetivos')
        const data = await response.json()
        setAvailableObjetivos(data)
      } catch (error) {
        console.error('Error al cargar los objetivos:', error)
      }
    }
    fetchObjetivos()
  }, [])

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  // Maneja el cierre del Snackbar
  const handleCloseSnackbar = (_event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenSnackbar(false)
  }

  // Maneja la creación del entregable en tiempo real
  const handleCreateEntregable = async (newEntregables: Entregables.Entregable[]) => {
    // Aquí actualizamos el estado local inmediatamente después de guardar el entregable
    setEntregables([...entregables, ...newEntregables])

    // Configurar el mensaje del Snackbar
    setSnackbarMessage('Entregable(s) agregado(s) correctamente')
    setSnackbarColor('#D3FFD2') // Color verde
    setOpenSnackbar(true) // Mostrar el Snackbar

    // Volver a cargar los entregables desde la API
    await fetchEntregables()
  }

  return (
    <div className="px-2 mx-6">
      <h2 className="text-lg font-semibold">
        <NavLink to="/objetivos" className="text-2xl font-bold transition duration-300 ease-in-out px-2 py-1 rounded-[10px]">
          Objetivos
        </NavLink>{' '}
        {'>'}
        {identificadorObjet && (
          <>
            <span className="text-base font-bold ml-2">Objetivo {identificadorObjet}</span> {'>'}
          </>
        )}
        <span className="text-base font-bold ml-2">Entregables</span>
      </h2>
      <hr className="border-[1.5px] border-[#c6caff] my-3" />

      <div className="mt-4">
        {entregables.length > 0 ? (
          entregables
            .filter((entregable) => entregable.identificador !== undefined)
            .map((entregable, index) => (
              <EntregableAccordion key={entregable.identificador} entregable={entregable} indexEntregable={index + 1} />
            ))
        ) : (
          <p className="text-sm text-center text-gray-500">No existen entregables disponibles</p>
        )}
      </div>

      <hr className="border-[1.5px] border-[#c6caff] mt-4" />
      <div className="flex justify-center pt-3">
        <button onClick={openModal} className="button-primary">
          + Nuevo entregable
        </button>
      </div>

      <NewEntregableModal isOpen={isModalOpen} onClose={closeModal} onCreate={handleCreateEntregable} />

      {/* Snackbar para mostrar mensajes */}
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
