import { useState } from 'react'
import { Snackbar, SnackbarCloseReason, SnackbarContent } from '@mui/material'
import ObservationAccordion from './Components/ObservationAccordion'
import { ButtonAddObservation } from './Components/ButtonAddObservation'

interface Activity {
  id: number
  name: string
}

interface Observation {
  id: number | null
  observation: string
  activities: Activity[]
  selectedActivities: Activity[]
  identificadorPlaniSegui?: number
  identificadorActiv: number | null
}

interface ObservationPageProps {
  observations: Observation[]
  objectiveId: number
  planillaDate: string
  planillaSeguiId?: number // Hacer que `planillaSeguiId` sea opcional
  onBack: () => void
}

const PlanillaEquipoPage: React.FC<ObservationPageProps> = ({
  observations: initialObservations,
  objectiveId,
  planillaDate,
  planillaSeguiId,
  onBack,
}) => {
  const [observations, setObservations] = useState<Observation[]>(initialObservations)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')

  // Función para agregar una nueva observación, utilizando el `identificadorPlaniSegui` inicial
  const handleAddObservation = () => {
    console.log('Adding observation with planillaSeguiId:', planillaSeguiId) // Verificar valor de `planillaSeguiId`

    const newObservation: Observation = {
      id: null, // Nueva observación
      observation: '',
      activities: [],
      selectedActivities: [],
      identificadorPlaniSegui: planillaSeguiId, // Usamos el `planillaSeguiId` inicial
      identificadorActiv: null,
    }

    setObservations([...observations, newObservation])
  }

  const handleSaveObservation = (observation: string, activities: Activity[]) => {
    setSnackbarMessage('Observación agregada exitosamente ')
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
      <h1 className="font-bold text-3xl">Llenar planilla de Seguimiento</h1>
      <hr className="border-[1.5px] border-[#c6caff] mt-3 mb-3" />
      <h2 className="font-bold text-2xl">
        <button onClick={onBack}>Objetivo {objectiveId}</button> {'>'} Planilla #{planillaDate}
      </h2>

      <div>
        <hr className="border-[1.5px] border-[#c6caff] mt-3 mb-6" />
        <h2 className="font-bold text-2xl">Observaciones</h2>
        <hr className="border-[1.5px] border-[#c6caff] mt-3 mb-6" />
      </div>

      {observations.length === 0 ? (
        <p>No existen observaciones disponibles</p>
      ) : (
        observations.map((obs, index) => (
          <ObservationAccordion
            key={index}
            observation={obs.observation}
            observationId={obs.id}
            identificadorPlaniSegui={planillaSeguiId ?? 0} // Usamos siempre el `planillaSeguiId` inicial
            identificadorActiv={obs.identificadorActiv}
            onSave={handleSaveObservation}
            selectedActivities={obs.selectedActivities}
            objectiveId={objectiveId}
          />
        ))
      )}

      <ButtonAddObservation onAddObservation={handleAddObservation} />

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
            background: '#D3FFD2',
            color: '#00A407',
          }}
          message={snackbarMessage}
        />
      </Snackbar>
    </div>
  )
}

export default PlanillaEquipoPage
