import NewPlanillaEvaluacionModal from './Components/NewPlanillaEvaluacionModal'
import { PlanillasEvaluacionAccordion } from './Components/PlanillasEvaluacionAccordion'
import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Snackbar, SnackbarContent, SnackbarCloseReason } from '@mui/material'

const EvaluacionPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0) // Estado para forzar la recarga de los accordions

  // Estado para el control del snackbar
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarColor, setSnackbarColor] = useState('')

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)
  const location = useLocation()
  const { identificadorPlani, nombrePlani } = location.state || {}

  const handleShowSnackbar = (message: string, color: string) => {
    setSnackbarMessage(message)
    setSnackbarColor(color)
    setOpenSnackbar(true)
  }
  const handleCloseSnackbar = (_event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenSnackbar(false)
  }

  // Función que actualiza la clave de recarga y cierra el modal
  const handlePlanillasGenerated = () => {
    setRefreshKey((prevKey) => prevKey + 1) // Incrementa la clave para forzar la recarga
    handleShowSnackbar('Generación de planilla exitosa.', '#D3FFD2')
    closeModal()
  }

  return (
    <div className="mx-28">
      <h1 className="font-bold text-3xl">Generar planillas de evaluacion</h1>

      <div>
        <hr className="border-[1.5px] border-[#c6caff] mt-3 mb-3" />
        <PlanillasEvaluacionAccordion identificadorPlani={identificadorPlani} nombrePlani={nombrePlani} key={refreshKey} />
        <hr className="border-[1.5px] border-[#c6caff] mt-3 mb-6" />
      </div>

      {/* Contenedor para centrar el botón */}
      <div className="flex justify-center">
        <button className="button-primary" onClick={openModal}>
          Generar Planillas
        </button>
      </div>

      <NewPlanillaEvaluacionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onPlanillasGenerated={handlePlanillasGenerated}
        identificadorPlani={identificadorPlani}
      />

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

export default EvaluacionPage
