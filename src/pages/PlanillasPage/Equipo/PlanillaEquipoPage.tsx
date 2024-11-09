import { useState, useEffect } from 'react'
import { Snackbar, SnackbarCloseReason, SnackbarContent } from '@mui/material'
import ObservationAccordion from './Components/ObservationAccordion'
import { ButtonAddObservation } from './Components/ButtonAddObservation'
import { RowInformationUser } from './Components/RowInformationUser'
import axios from 'axios'
import { SavePlanillaEquipoModal } from './Components/SavePlanillaEquipoModal'

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
  const [asistencias, setAsistencias] = useState<Record<number, { valor: boolean; identificadorMotiv: number | null }>>({})
  const [isReadOnly, setIsReadOnly] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  // Función para obtener empresa y usuarios
  const fetchEmpresaYUsuarios = async (empresaId: number) => {
    try {
      const grupoResponse = await axios.get('https://cocoabackend.onrender.com/api/grupoEmpresas')
      const empresaData = grupoResponse.data.find((e: Empresa) => e.identificador === empresaId)

      if (!empresaData) {
        console.error(`Empresa con ID ${empresaId} no encontrada`)
        return
      }

      setEmpresa(empresaData)

      const usuariosResponse = await axios.get(`https://cocoabackend.onrender.com/api/grupoEmpresas/${empresaId}/usuarios`)
      setUsuarios(usuariosResponse.data)
    } catch (error) {
      console.error('Error al obtener empresa o usuarios:', error)
    }
  }

  // Obtener empresa, usuarios y asistencias al montar el componente
  useEffect(() => {
    fetchEmpresaYUsuarios(1) // Usamos el ID 1 por ahora

    const fetchAsistencias = async () => {
      try {
        const response = await axios.get(`https://cocoabackend.onrender.com/api/asistencia?grupoEmpresaId=1&fecha=${planillaDate}`)
        const data = response.data
        const asistenciaMap: Record<number, { valor: boolean; identificadorMotiv: number | null }> = {}

        data.forEach((registro: any) => {
          asistenciaMap[registro.identificadorUsuar] = { valor: registro.valor, identificadorMotiv: registro.identificadorMotiv }
        })

        setAsistencias(asistenciaMap)
        setIsReadOnly(data.length > 0)
        console.log(isReadOnly) // Si hay datos de asistencia, el modo es solo lectura
      } catch (error) {
        console.error('Error al obtener asistencias:', error)
      }
    }

    fetchAsistencias()
  }, [planillaDate])

  const handleAddObservation = () => {
    const newObservation: Observation = {
      id: null,
      observation: '',
      activities: [],
      selectedActivities: [],
      identificadorPlaniSegui: planillaSeguiId,
      identificadorActiv: null,
    }
    setObservations([...observations, newObservation])
  }

  const handleSaveObservation = (observation: string, activities: Activity[]) => {
    setSnackbarMessage('Observación agregada exitosamente')
    setSnackbarOpen(true)
  }

  // Nueva función para manejar la eliminación de observaciones
  const handleDeleteObservation = async (observationId: number) => {
    try {
      // Solicitud para eliminar la observación
      await axios.delete(`https://cocoabackend.onrender.com/api/observaciones/${observationId}`)
      // Actualizar el estado de las observaciones después de eliminar
      setObservations((prevObservations) => prevObservations.filter((obs) => obs.id !== observationId))
      setSnackbarMessage('Observación eliminada exitosamente')
      setSnackbarOpen(true)
    } catch (error) {
      console.log(observations)
      console.error('Error al eliminar observación:', error)
      setSnackbarMessage('Error al eliminar la observación')
      setSnackbarOpen(true)
    }
  }

  const handleCloseSnackbar = (_event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') return
    setSnackbarOpen(false)
  }

  // Manejar cambios del checkbox y motivo de asistencia
  const handleChangeAsistencia = (userId: number, valor: boolean, identificadorMotiv: number | null) => {
    setAsistencias((prevState) => ({
      ...prevState,
      [userId]: { valor, identificadorMotiv },
    }))
  }

  // Función para guardar la planilla
  const handleGuardarPlanilla = async () => {
    const solicitudes = usuarios.map(async (usuario) => {
      const asistencia = asistencias[usuario.id]

      // Si el usuario tiene el checkbox marcado (asistencia) o seleccionó un motivo (inasistencia)
      if (asistencia.valor && asistencia.identificadorMotiv === null) {
        // Guardar asistencia
        return axios.post('https://cocoabackend.onrender.com/api/asistencias-asistencia', {
          identificadorUsuar: usuario.id,
          fecha: planillaDate,
          valor: true,
        })
      } else if (asistencia.identificadorMotiv !== null) {
        // Guardar inasistencia con motivo
        return axios.post('https://cocoabackend.onrender.com/api/asistencias-inasistencia', {
          identificadorUsuar: usuario.id,
          fecha: planillaDate,
          valor: false, // Asumimos que es una ausencia
          identificadorMotiv: asistencia.identificadorMotiv,
        })
      }
    })

    try {
      await Promise.all(solicitudes)
      setSnackbarMessage('Asistencia guardada exitosamente')
      setSnackbarOpen(true)
      setIsReadOnly(true)
      fetchEmpresaYUsuarios(1) // Refrescar datos para reflejar el estado no editable
    } catch (error) {
      console.error('Error al guardar asistencia:', error)
      setSnackbarMessage('Error al guardar la asistencia')
      setSnackbarOpen(true)
    }
  }

  return (
    <div className="mx-28">
      <h1 className="font-bold text-3xl">Llenar planilla de Seguimiento</h1>
      <hr className="border-[1.5px] border-[#c6caff] mt-3 mb-3" />
      <div className="flex justify-between">
        <h2 className="font-bold text-2xl">
          <button onClick={onBack}>Objetivo {objectiveId}</button> {'>'} Planilla #{planillaDate}
        </h2>
        {!isReadOnly && (
          <button onClick={() => setModalOpen(true)} className="button-primary">
            Guardar Planillas
          </button>
        )}
      </div>
      <div>
        <hr className="border-[1.5px] border-[#c6caff] mt-3 mb-3" />
        <h2 className="font-bold text-2xl">Asistencia</h2>
        <hr className="border-[1.5px] border-[#c6caff] mt-3" />

        <div className="my-3 px-[7%]">
          {usuarios.map((usuario) => (
            <RowInformationUser
              key={usuario.id}
              userName={usuario.name}
              companyName={empresa?.nombreCorto || ''}
              userId={usuario.id}
              planillaDate={planillaDate}
              isReadOnly={isReadOnly}
              asistenciaData={asistencias[usuario.id]}
              onChangeAsistencia={handleChangeAsistencia} // Prop para manejar cambios de asistencia
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
            identificadorPlaniSegui={planillaSeguiId ?? 0}
            identificadorActiv={obs.identificadorActiv}
            onSave={handleSaveObservation}
            onDelete={handleDeleteObservation} // Nueva función para eliminar observaciones
            selectedActivities={obs.selectedActivities}
            isReadOnly={isReadOnly}
            objectiveId={objectiveId}
            existingObservations={observations.map((o) => o.observation)}
          />
        ))
      )}

      {/* Mostrar el botón de añadir observación solo si no está en modo de solo lectura */}
      {!isReadOnly && <ButtonAddObservation onAddObservation={handleAddObservation} />}

      {/* Modal de confirmación para guardar planilla */}
      {modalOpen && (
        <SavePlanillaEquipoModal
          onConfirm={() => {
            handleGuardarPlanilla()
            setModalOpen(false)
          }}
          onCancel={() => setModalOpen(false)}
        />
      )}

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
