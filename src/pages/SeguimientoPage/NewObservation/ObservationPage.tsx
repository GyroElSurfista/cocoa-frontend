import { useState } from 'react'
import { Snackbar, SnackbarCloseReason, SnackbarContent } from '@mui/material'
import { NewObservationModal } from './Components/Add/NewObservationModal.tsx'
import EditObservationAccordion from './Components/Edit/EditObservationAccordion.tsx'

interface Activity {
  id: number
  name: string
}

interface Observation {
  id: number
  observation: string
  activities: Activity[]
  selectedActivities: Activity[] // Cambiado a Activity[]
}

interface ObservationPageProps {
  observations: Observation[]
  objectiveId: number // Asegúrate de pasar el objectiveId
  planillaDate: string
  onBack: () => void
}

const ObservationPage: React.FC<ObservationPageProps> = ({ observations, objectiveId, planillaDate, onBack }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarColor, setSnackbarColor] = useState('#D3FFD2')

  const closeModal = () => setIsModalOpen(false)

  const handleSaveObservation = () => {
    setSnackbarMessage('Los cambios se guardaron con éxito')
    setSnackbarColor('#D3FFD2') // Color de éxito
    setSnackbarOpen(true)
    closeModal()
  }

  const handleError = (message: string) => {
    setSnackbarMessage(message)
    setSnackbarColor('#FFD2D2') // Color de error
    setSnackbarOpen(true)
  }

  const handleCloseSnackbar = (_event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackbarOpen(false)
  }

  return (
    <div className="mx-28">
      <h1 className="font-bold text-3xl">Editar Observaciones</h1>
      <hr className="border-[1.5px] border-[#c6caff] mt-3 mb-3" />
      <h2 className="font-bold text-2xl">
        <button onClick={onBack}>Objetivo {objectiveId}</button> {'>'} Planilla #{planillaDate}
      </h2>

      <div>
        <hr className="border-[1.5px] border-[#c6caff] mt-3 mb-3" />
        {observations.length === 0 ? (
          <p>No existen observaciones disponibles</p>
        ) : (
          observations.map((obs) => (
            <EditObservationAccordion
              key={obs.id}
              observation={obs.observation}
              observationId={obs.id}
              onSave={handleSaveObservation} // Llamada al guardar
              selectedActivities={obs.selectedActivities}
              objectiveId={objectiveId}
              planillaId={0}
            />
          ))
        )}
        <hr className="border-[1.5px] border-[#c6caff] mt-3 mb-6" />
      </div>

      {isModalOpen && <NewObservationModal />}

      {/* Aquí va el Snackbar */}
      <Snackbar
        open={snackbarOpen}
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

export default ObservationPage
