import { useState, useEffect } from 'react'
import { Snackbar, SnackbarCloseReason, SnackbarContent } from '@mui/material'
import { RowInformationUser } from './Components/RowInformationUser'
import axios from 'axios'
import { SavePlanillaEquipoModal } from './Components/SavePlanillaEquipoModal'
import { EntregableDinamicoAccordion } from './Components/EntregableDinamicoAccordion'
import { AddActivitiesObservations } from './Components/AddActivitiesObservations'
import NewEntregableDinamicoModal from './Components/NewEntregableDinamicoModal'

interface Observation {
  identificador: number // Añadimos identificador
  descripcion: string
}

interface Activity {
  identificador: number
  nombre: string
  observaciones: Observation[] // Usamos el tipo Observation[]
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
  objectiveName: string
  fechas: string[]
  onBack: () => void
}

interface Entregable {
  identificador: number
  nombre: string
  descripcion: string | null
  identificadorObjet: number
  identificadorPlaniSegui?: number
  dinamico?: boolean
  fechaCreac?: string
  criterio_aceptacion_entregable: CriterioAceptacion[]
}

interface CriterioAceptacion {
  identificador: number
  descripcion: string
  identificadorEntre: number
}

const PlanillaEquipoPage: React.FC<ObservationPageProps> = ({
  objectiveId,
  planillaDate,
  planillaSeguiId,
  objectiveName,
  fechas,
  onBack,
}) => {
  const [entregables, setEntregables] = useState<Entregable[]>([])
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [usuarios, setUsuarios] = useState<User[]>([])
  const [empresa, setEmpresa] = useState<Empresa | null>(null)
  const [asistencias, setAsistencias] = useState<Record<number, { valor: boolean; identificadorMotiv: number | null }>>({})
  const [isReadOnly, setIsReadOnly] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [activities, setActivities] = useState<Activity[]>([])
  const [modalOpenEntregable, setModalOpenEntregable] = useState(false) // Estado para controlar el modal

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

  useEffect(() => {
    const fetchAndStoreEntregables = async () => {
      const allEntregables: any[] = [] // Para almacenar todos los entregables

      try {
        for (const fecha of planillaDate) {
          const response = await axios.get(
            `https://cocoabackend.onrender.com/api/entregables-dinamicos?identificadorObjet=${objectiveId}&fecha=${fecha}`
          )
          const entregables = response.data.data
          allEntregables.push(...entregables) // Agrega los entregables obtenidos
        }

        setEntregables(allEntregables) // Actualiza el estado con todos los entregables obtenidos
      } catch (error) {
        console.error('Error al obtener entregables dinámicos:', error)
      }
    }

    fetchAndStoreEntregables()
  }, [objectiveId, planillaDate])

  useEffect(() => {
    fetchEmpresaYUsuarios(1)
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
      } catch (error) {
        console.error('Error al obtener asistencias:', error)
      }
    }

    fetchAsistencias()
  }, [planillaDate])

  // PlanillaEquipoPage.tsx

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get(`https://cocoabackend.onrender.com/api/planilla-seguimiento/${planillaSeguiId}/actividades`)

        // Transformamos los datos para asegurar que la estructura sea compatible con el componente
        const transformedData = response.data.data.map((activity: any) => ({
          ...activity,
          observaciones: activity.observacion || [], // Renombramos "observacion" a "observaciones"
        }))

        setActivities(transformedData)
      } catch (error) {
        console.error('Error al obtener actividades:', error)
      }
    }

    fetchActivities()
  }, [planillaSeguiId])

  const handleAddActivity = () => {
    setActivities([
      ...activities,
      {
        identificador: Date.now(), // Genera un identificador temporal único
        nombre: '',
        observaciones: [{ identificador: Date.now(), descripcion: '' }],
      },
    ])
  }

  const loadEntregables = async () => {
    try {
      const response = await axios.get(
        `https://cocoabackend.onrender.com/api/entregables-dinamicos?identificadorObjet=${objectiveId}&fecha=${planillaDate}`
      )
      setEntregables(response.data.data)
    } catch (error) {
      console.error('Error al obtener entregables dinámicos:', error)
    }
  }

  // Recarga los entregables tras registrar o editar un entregable
  const handleEntregableCreatedOrUpdated = () => {
    loadEntregables()
  }

  // Abre el modal para registrar un nuevo entregable
  const openEntregableModal = () => {
    setModalOpenEntregable(true)
  }

  // Cierra el modal después de crear un entregable y actualiza la lista
  const handleCloseEntregableModal = () => {
    setModalOpenEntregable(false)
    handleEntregableCreatedOrUpdated()
  }

  useEffect(() => {
    loadEntregables()
  }, [planillaDate, objectiveId])

  const handleChangeAsistencia = (userId: number, valor: boolean, identificadorMotiv: number | null) => {
    setAsistencias((prevState) => ({
      ...prevState,
      [userId]: { valor, identificadorMotiv },
    }))
  }

  const handleCloseSnackbar = (_event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') return
    setSnackbarOpen(false)
  }

  const handleAddObservationToActivity = (activityIndex: number) => {
    const newActivities = [...activities]
    newActivities[activityIndex].observaciones.push({ identificador: Date.now(), descripcion: '' })
    setActivities(newActivities)
  }

  const handleDeleteActivity = (activityIndex: number) => {
    const newActivities = activities.filter((_, index) => index !== activityIndex)
    setActivities(newActivities)
  }

  const handleDeleteObservation = (activityIndex: number, observationIndex: number) => {
    const newActivities = [...activities]
    newActivities[activityIndex].observaciones = newActivities[activityIndex].observaciones.filter((_, index) => index !== observationIndex)
    setActivities(newActivities)
  }

  const handleActivityChange = (activityIndex: number, newValue: string) => {
    const newActivities = [...activities]
    newActivities[activityIndex].nombre = newValue
    setActivities(newActivities)
  }

  const handleObservationChange = (activityIndex: number, observationIndex: number, newValue: string) => {
    const newActivities = [...activities]
    newActivities[activityIndex].observaciones[observationIndex].descripcion = newValue
    setActivities(newActivities)
  }

  const handleGuardarPlanilla = async () => {
    const solicitudes = usuarios.map(async (usuario) => {
      const asistencia = asistencias[usuario.id]

      if (asistencia && asistencia.valor && asistencia.identificadorMotiv === null) {
        return axios.post('https://cocoabackend.onrender.com/api/asistencias-asistencia', {
          identificadorUsuar: usuario.id,
          fecha: planillaDate,
          valor: true,
        })
      } else if (asistencia && asistencia.identificadorMotiv !== null) {
        return axios.post('https://cocoabackend.onrender.com/api/asistencias-inasistencia', {
          identificadorUsuar: usuario.id,
          fecha: planillaDate,
          valor: false,
          identificadorMotiv: asistencia.identificadorMotiv,
        })
      }
    })

    try {
      await Promise.all(solicitudes)

      for (const activity of activities) {
        await axios.post('https://cocoabackend.onrender.com/api/actividad-seguimiento', {
          nombre: activity.nombre,
          identificadorPlaniSegui: planillaSeguiId,
          observaciones: activity.observaciones,
        })
      }

      setSnackbarMessage('Planilla y actividades guardadas exitosamente')
      setSnackbarOpen(true)
      setIsReadOnly(true)
      setModalOpen(false)
      fetchEmpresaYUsuarios(1)
      console.log(objectiveName)
    } catch (error) {
      console.error('Error al guardar asistencia o actividades:', error)
      setSnackbarMessage('Error al guardar la planilla o actividades')
      setSnackbarOpen(true)
    }
  }

  return (
    <div className="mx-28">
      <h1 className="font-bold text-3xl">Llenar planilla de Seguimiento</h1>
      <hr className="border-[1.5px] border-[#c6caff] mt-3 mb-3" />
      <div className="flex justify-between">
        <h2 className="font-bold text-2xl">
          <button onClick={onBack}>{objectiveName}</button> {'>'} Planilla #{planillaDate}
        </h2>
        {!isReadOnly && (
          <button onClick={() => setModalOpen(true)} className="button-primary">
            Guardar Planillas
          </button>
        )}
      </div>

      {modalOpen && <SavePlanillaEquipoModal onConfirm={handleGuardarPlanilla} onCancel={() => setModalOpen(false)} />}

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
              onChangeAsistencia={handleChangeAsistencia}
            />
          ))}
        </div>
        <div className="flex justify-between">
          <h2 className="font-bold text-2xl">Actividades de seguimiento</h2>
          {!isReadOnly && (
            <button onClick={handleAddActivity} className="button-primary">
              + Nueva Actividad
            </button>
          )}
        </div>
        <hr className="border-[1.5px] border-[#c6caff] mt-3 mb-6" />
        {activities.map((activity, activityIndex) => (
          <AddActivitiesObservations
            key={activity.identificador}
            activity={activity}
            activityIndex={activityIndex}
            onActivityChange={handleActivityChange}
            onAddObservation={() => handleAddObservationToActivity(activityIndex)}
            onObservationChange={handleObservationChange}
            onDeleteActivity={() => handleDeleteActivity(activityIndex)}
            onDeleteObservation={(observationIndex) => handleDeleteObservation(activityIndex, observationIndex)}
            isReadOnly={isReadOnly}
          />
        ))}
      </div>

      <h2 className="font-bold text-3xl">Entregables</h2>
      <hr className="border-[1.5px] border-[#c6caff] mt-3 mb-6" />
      <EntregableDinamicoAccordion entregables={entregables} onEntregableUpdated={handleEntregableCreatedOrUpdated} fechas={fechas} />

      <NewEntregableDinamicoModal
        isOpen={modalOpenEntregable}
        onClose={handleCloseEntregableModal} // Cierra el modal y recarga la lista
        onCreate={handleEntregableCreatedOrUpdated}
        entregable={entregables}
        objectiveId={objectiveId}
        planillaSeguiId={planillaSeguiId}
        fechas={fechas}
      />

      {!isReadOnly && (
        <div className="flex justify-center items-center ">
          <button onClick={() => setModalOpenEntregable(true)} className="button-primary">
            + Nuevo Entregable
          </button>
        </div>
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
