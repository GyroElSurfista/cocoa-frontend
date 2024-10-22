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
  selectedActivities: Activity[]
  identificadorPlaniSegui: number
  identificadorActiv: number
}

interface ObservationPageProps {
  observations: Observation[]
  objectiveId: number
  planillaDate: string
  onBack: () => void
}

const ObservationPage: React.FC<ObservationPageProps> = ({ observations: initialObservations, objectiveId, planillaDate, onBack }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [observations, setObservations] = useState(initialObservations) // Estado de las observaciones
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarColor, setSnackbarColor] = useState('#D3FFD2')

  const closeModal = () => setIsModalOpen(false)

  const handleSaveObservation = () => {
    setSnackbarMessage('Los cambios se guardaron con exito')
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

  // Función para simular la actualización de datos
  const refreshObservations = () => {
    // Aquí se haría una llamada a la API para obtener las observaciones actualizadas
    const updatedObservations = [
      // Simulación de nuevos datos
      {
        id: 1,
        observation: 'Observación actualizada',
        activities: [{ id: 1, name: 'Actividad 1' }],
        selectedActivities: [{ id: 1, name: 'Actividad 1' }],
        identificadorPlaniSegui: 123,
        identificadorActiv: 456,
      },
      // Puedes agregar más observaciones aquí
    ]
    setObservations(updatedObservations) // Actualiza el estado con los nuevos datos
  }

  // Función que se ejecuta al presionar el botón onBack
  const handleBack = () => {
    refreshObservations() // Refresca los datos
    onBack() // Llama a la función onBack original
  }

  return (
    <div className="mx-28">
      <h1 className="font-bold text-3xl">Editar Observaciones</h1>
      <hr className="border-[1.5px] border-[#c6caff] mt-3 mb-3" />
      <h2 className="font-bold text-2xl">
        <button onClick={handleBack}>Objetivo {objectiveId}</button> {'>'} Planilla #{planillaDate}
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
              identificadorPlaniSegui={obs.identificadorPlaniSegui}
              identificadorActiv={obs.identificadorActiv}
              onSave={handleSaveObservation}
              selectedActivities={obs.selectedActivities}
              objectiveId={objectiveId}
              planillaId={0}
              observations={observations} // Asegúrate de pasar el array de observaciones
            />
          ))
        )}
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
