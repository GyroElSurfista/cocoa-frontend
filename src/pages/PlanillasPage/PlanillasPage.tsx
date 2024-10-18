import React, { useState } from 'react'
import { PlanillasAccordion } from './Components/PlanillasAccordion'
import NewPlanillaModal from './Components/NewPlanillaModal'
import { Snackbar, SnackbarContent, SnackbarCloseReason } from '@mui/material'

const PlanillasPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Estado para el control del snackbar
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarColor, setSnackbarColor] = useState('')

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

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

  return (
    <div className="mx-28">
      <h1 className="font-bold text-3xl">Generar Planillas de Seguimiento</h1>

      <div>
        <hr className="border-[1.5px] border-[#c6caff] mt-3 mb-3" />
        <PlanillasAccordion />
        <hr className="border-[1.5px] border-[#c6caff] mt-3 mb-6" />
      </div>

      {/* Contenedor para centrar el botón */}
      <div className="flex justify-center">
        <button className="button-primary" onClick={openModal}>
          Generar Planillas
        </button>
      </div>

      <NewPlanillaModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onPlanillasGenerated={() => handleShowSnackbar('Planillas generadas exitosamente', '#D3FFD2')}
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
            color: snackbarColor === '#D3FFD2' ? '#00A407' : '#A40000', // Cambia el color del texto basado en el tipo de mensaje
          }}
          message={snackbarMessage}
        />
      </Snackbar>
    </div>
  )
}

export default PlanillasPage
