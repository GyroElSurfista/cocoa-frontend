import { useState, useEffect } from 'react'
import { Snackbar, SnackbarCloseReason, SnackbarContent } from '@mui/material'
import ObservationAccordion from './Components/ObservationAccordion'
import { ButtonAddObservation } from './Components/ButtonAddObservation'
import { RowInformationUser } from './Components/RowInformationUser'
import axios from 'axios' // Para realizar las peticiones a los endpoints

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

interface User {
  id: number
  name: string
  email: string
}

interface Empresa {
  identificador: number
  nombreLargo: string
  nombreCorto: string
}

interface ObservationPageProps {
  observations: Observation[]
  objectiveId: number
  planillaDate: string
  planillaSeguiId?: number
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
  const [usuarios, setUsuarios] = useState<User[]>([])
  const [empresa, setEmpresa] = useState<Empresa | null>(null)

  // Obtener datos de empresa y usuarios
  useEffect(() => {
    const fetchEmpresaYUsuarios = async () => {
      try {
        // Obtener datos de la empresa
        const grupoResponse = await axios.get('https://cocoabackend.onrender.com/api/grupoEmpresas')
        const empresaData = grupoResponse.data.find((e: Empresa) => e.identificador === 1) // Usar ID 1 por defecto
        setEmpresa(empresaData)

        // Obtener usuarios asociados a la empresa
        const usuariosResponse = await axios.get(
          `https://cocoabackend.onrender.com/api/grupoEmpresas/${empresaData.identificador}/usuarios`
        )
        setUsuarios(usuariosResponse.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchEmpresaYUsuarios()
  }, [])

  // Función para agregar una nueva observación
  const handleAddObservation = () => {
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

  // Manejar el guardado de observaciones
  const handleSaveObservation = (observation: string, activities: Activity[]) => {
    setSnackbarMessage('Observación agregada exitosamente ')
    setSnackbarOpen(true)
  }

  // Manejar el cierre del Snackbar
  const handleCloseSnackbar = (_event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') return
    setSnackbarOpen(false)
  }

  // Crear un array de observaciones existentes (nombres)
  const existingObservations = observations.map((obs) => ({
    observation: obs.observation,
    identificadorActiv: obs.identificadorActiv,
  }))

  return (
    <div className="mx-28">
      <h1 className="font-bold text-3xl">Llenar planilla de Seguimiento</h1>
      <hr className="border-[1.5px] border-[#c6caff] mt-3 mb-3" />
      <h2 className="font-bold text-2xl">
        <button onClick={onBack}>Objetivo {objectiveId}</button> {'>'} Planilla #{planillaDate}
      </h2>

      <div>
        <hr className="border-[1.5px] border-[#c6caff] mt-3 mb-3" />
        <h2 className="font-bold text-2xl">Asistencia</h2>
        <hr className="border-[1.5px] border-[#c6caff] mt-3 " />
        <div className="my-3 px-[7%]">
          {usuarios.map((usuario) => (
            <RowInformationUser
              key={usuario.id}
              userName={usuario.name}
              companyName={empresa?.nombreCorto || ''}
              userId={usuario.id}
              planillaDate={planillaDate}
            />
          ))}
        </div>
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
            existingObservations={existingObservations}
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
