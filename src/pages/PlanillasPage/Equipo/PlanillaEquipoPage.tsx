import { useState, useEffect, useCallback } from 'react'
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
  identificadorPlani: number
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
  identificadorPlani,
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
  const [modalOpenEntregable, setModalOpenEntregable] = useState(false)

  const [validationStates, setValidationStates] = useState<boolean[]>([false])
  const [errorMessage, setErrorMessage] = useState('') // Message to show when validations fail
  const [allValid, setAllValid] = useState(false) // Nuevo estado para controlar la habilitación del botón de guardar
  const [empresaId, setEmpresaId] = useState<number | null>(null)
  const [validRows, setValidRows] = useState<Record<number, boolean>>({}) // Estado para las filas
  const [allValidRows, setAllValidRows] = useState(false) // Indica si todas las filas son válidas

  const fetchEmpresaYUsuarios = async (empresaId: number) => {
    try {
      const grupoResponse = await axios.get('https://cocoabackend.onrender.com/api/grupoEmpresas')
      const empresaData = grupoResponse.data.find((e: Empresa) => e.identificador === empresaId)

      if (!empresaData) {
        console.error(`Empresa con ID ${empresaId} no encontrada`)
        return
      }

      setEmpresa(empresaData)
      setEmpresaId(empresaData.identificador) // Guarda el ID de la empresa

      const usuariosResponse = await axios.get(`https://cocoabackend.onrender.com/api/grupoEmpresas/${empresaId}/usuarios`)
      setUsuarios(usuariosResponse.data)
    } catch (error) {
      console.error('Error al obtener empresa o usuarios:', error)
    }
  }

  const fetchAsistenciasWithFaltas = async (identificadorPlani: number, fecha: string) => {
    try {
      // Llama al endpoint con GET y parámetros de consulta
      const response = await axios.get('https://cocoabackend.onrender.com/api/grupo-empresa/asistencia', {
        params: {
          identificadorGrupoEmpre: identificadorPlani,
          fecha,
        },
      })

      const data = response.data
      const asistenciaMap: Record<number, { valor: boolean; identificadorMotiv: number | null; faltas: number }> = {}

      data.forEach((registro: any) => {
        asistenciaMap[registro.identificadorUsuar] = {
          valor: registro.valor,
          identificadorMotiv: registro.identificador,
          faltas: registro.faltas,
        }
      })

      setAsistencias(asistenciaMap) // Actualiza el estado con los datos de asistencia
    } catch (error) {
      console.error('Error al obtener asistencias:', error)
    }
  }

  useEffect(() => {
    if (identificadorPlani && planillaDate) {
      fetchAsistenciasWithFaltas(identificadorPlani, planillaDate)
    }
  }, [identificadorPlani, planillaDate])

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
        const response = await axios.get(
          `https://cocoabackend.onrender.com/api/asistencia?grupoEmpresaId=${identificadorPlani}&fecha=${planillaDate}`
        )
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
    } catch (error) {
      console.error('Error al guardar asistencia o actividades:', error)
      setSnackbarMessage('Error al guardar la planilla o actividades')
      setSnackbarOpen(true)
    }
  }

  const handleAddActivity = () => {
    setActivities((prevActivities) => [
      ...prevActivities,
      {
        identificador: Date.now(),
        nombre: '',
        observaciones: [{ identificador: Date.now(), descripcion: '' }],
      },
    ])
    setValidationStates((prevStates) => [...prevStates, false]) // Nueva actividad no válida inicialmente
  }

  // Recarga los entregables tras registrar o editar un entregable
  const handleEntregableCreatedOrUpdated = () => {
    loadEntregables()
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

  const handleDeleteActivity = (activityIndex: number) => {
    setActivities((prevActivities) => prevActivities.filter((_, index) => index !== activityIndex))
    setValidationStates((prevStates) => prevStates.filter((_, index) => index !== activityIndex))
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

    const activity = newActivities[activityIndex]
    const hasErrors = activity.nombre.trim().length < 5 || activity.observaciones.some((obs) => obs.descripcion.trim().length < 5)
    handleValidationChange(activityIndex, !hasErrors)
  }

  const handleValidationChange = useCallback((activityIndex: number, isValid: boolean) => {
    setValidationStates((prev) => {
      const updatedStates = [...prev]
      updatedStates[activityIndex] = isValid

      console.log('Validation state updated Padre:', updatedStates)

      // Revalida el estado global
      validateGlobalState(updatedStates)
      return updatedStates
    })
  }, [])

  const validateGlobalState = (validationStates: boolean[]) => {
    const isEverythingValid = validationStates.every(Boolean)
    console.log('Validating global state Padres:', { validationStates, allValid: isEverythingValid })
    setAllValid(isEverythingValid)
  }

  useEffect(() => {
    const isEverythingValid = validationStates.every(Boolean)
    setAllValid(isEverythingValid)

    console.log('Validation state updated Padre:', {
      validationStates,
      allValid: isEverythingValid,
    })

    if (isEverythingValid) {
      setErrorMessage('')
    } else {
      setErrorMessage('Por favor corrige los errores antes de guardar la planilla.')
    }
  }, [validationStates])

  const handleOpenModal = () => {
    if (allValidRows && allValid) {
      setModalOpen(true)
      setErrorMessage('')
    } else {
      setErrorMessage('Por favor corrige los errores antes de guardar la planilla.')
    }
  }

  const handleValidationChangeRows = (userId: number, isValid: boolean) => {
    setValidRows((prev) => {
      const updatedRows = { ...prev, [userId]: isValid }
      const allValid = Object.values(updatedRows).every(Boolean)
      setAllValidRows(allValid) // Recalcula el estado global de las filas
      return updatedRows
    })
  }
  useEffect(() => {
    setAllValidRows(Object.values(validRows).every(Boolean))
  }, [validRows])

  useEffect(() => {
    setValidationStates((prevStates) => {
      const updatedStates = activities.map((_, index) => prevStates[index] || false)
      return updatedStates
    })
  }, [activities])

  const handleShowSnackbar = (message: string) => {
    setSnackbarMessage(message)
    setSnackbarOpen(true)
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
          <button
            onClick={handleOpenModal}
            disabled={!allValidRows || !allValid} // Botón deshabilitado si las filas o actividades no son válidas
            className={`button-primary ${allValidRows && allValid ? 'bg-green-500 text-white' : 'bg-gray-400 text-gray-200 cursor-not-allowed'}`}
          >
            Guardar planilla
          </button>
        )}
      </div>

      {modalOpen && validationStates.every(Boolean) && (
        <SavePlanillaEquipoModal onConfirm={handleGuardarPlanilla} onCancel={() => setModalOpen(false)} />
      )}

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
              onValidationChange={handleValidationChangeRows} // Nuevo manejo de validación
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
            onDeleteObservation={(observationIndex) => handleDeleteObservation(activityIndex, observationIndex)}
            onActivityChange={(idx, newValue) => {
              const updatedActivities = [...activities]
              updatedActivities[idx].nombre = newValue
              setActivities(updatedActivities)
            }}
            onAddObservation={() => {
              const updatedActivities = [...activities]
              updatedActivities[activityIndex].observaciones.push({
                identificador: Date.now(),
                descripcion: '',
              })
              setActivities(updatedActivities)
            }}
            onObservationChange={(idx, obsIdx, newValue) => {
              const updatedActivities = [...activities]
              updatedActivities[idx].observaciones[obsIdx].descripcion = newValue
              setActivities(updatedActivities)
            }}
            onDeleteActivity={() => handleDeleteActivity(activityIndex)}
            onValidationChange={handleValidationChange}
            isReadOnly={isReadOnly}
          />
        ))}
      </div>

      <h2 className="font-bold text-3xl">Entregables</h2>
      <hr className="border-[1.5px] border-[#c6caff] mt-3 mb-6" />
      <EntregableDinamicoAccordion
        entregables={entregables}
        fechas={fechas}
        objectiveName={objectiveName}
        onEntregableUpdated={handleEntregableCreatedOrUpdated}
        onShowSnackbar={handleShowSnackbar} // Pasa la función al acordeón
      />

      <NewEntregableDinamicoModal
        isOpen={modalOpenEntregable}
        onClose={handleCloseEntregableModal}
        onCreate={handleEntregableCreatedOrUpdated}
        onShowSnackbar={handleShowSnackbar} // Pasa la función al modal
        entregable={entregables}
        objectiveId={objectiveId}
        objectiveName={objectiveName}
        planillaSeguiId={planillaSeguiId}
        fechas={fechas}
      />

      <div className="flex justify-center items-center ">
        <button onClick={() => setModalOpenEntregable(true)} className="button-primary">
          + Nuevo Entregable
        </button>
      </div>

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
