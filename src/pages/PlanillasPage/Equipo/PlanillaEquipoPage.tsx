import { useState, useEffect, useCallback } from 'react'
import { Snackbar, SnackbarCloseReason, SnackbarContent } from '@mui/material'
import { RowInformationUser } from './Components/RowInformationUser'
import axios from 'axios'
import { SavePlanillaEquipoModal } from './Components/SavePlanillaEquipoModal'
import { EntregableDinamicoAccordion } from './Components/EntregableDinamicoAccordion'
import { AddActivitiesObservations } from './Components/AddActivitiesObservations'
import NewEntregableDinamicoModal from './Components/NewEntregableDinamicoModal'
import { useLocation } from 'react-router-dom'
import { Planificacion } from '../../../interfaces/project.interface'

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

const PlanillaEquipoPage = () => {
  const location = useLocation()

  // Extraer datos del estado de navegación
  const { observations, objectiveId, planillaDate, objectiveName, identificadorPlani, planillaSeguiId, fechas } = location.state || {}
  const [entregables, setEntregables] = useState<Entregable[]>([])
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [usuarios, setUsuarios] = useState<User[]>([])
  const [empresa, setEmpresa] = useState<Planificacion | null>(null)
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

  const fetchEmpresaYUsuarios = async () => {
    try {
      const grupoResponse = await axios.get('https://cocoabackend.onrender.com/api/planificaciones')
      const planificacionData = grupoResponse.data.find((e: Planificacion) => identificadorPlani === e.identificador)

      if (!planificacionData) {
        console.error(`Empresa con identificador ${identificadorPlani} no encontrada`)
        return
      }

      setEmpresa(planificacionData)
      setEmpresaId(planificacionData.identificadorGrupoEmpre)

      // Usa directamente el valor obtenido
      const usuariosResponse = await axios.get(
        `https://cocoabackend.onrender.com/api/grupoEmpresas/${planificacionData.identificadorGrupoEmpre}/usuarios`
      )
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
    fetchEmpresaYUsuarios()
    const fetchAsistencias = async () => {
      try {
        const response = await axios.get(
          `https://cocoabackend.onrender.com/api/asistencia?grupoEmpresaId=${empresaId}&fecha=${planillaDate}`
        )
        console.log(identificadorPlani, planillaDate)
        console.log(response)
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
      console.log(
        '------------------------------------------------Guardado de asistencias ------------------------------------------------------'
      )
      console.log(usuario.id)
      console.log(planillaDate)

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
      fetchEmpresaYUsuarios()
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

  useEffect(() => {
    if (identificadorPlani && planillaDate) {
      fetchAsistenciasWithFaltas(identificadorPlani, planillaDate)
    }
  }, [identificadorPlani, planillaDate, usuarios])

  const handleCloseSnackbar = (_event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') return
    setSnackbarOpen(false)
  }

  const handleDeleteActivity = (activityIndex: number) => {
    setActivities((prevActivities) => prevActivities.filter((_, index) => index !== activityIndex))
    setValidationStates((prevStates) => prevStates.filter((_, index) => index !== activityIndex))
  }

  const handleDeleteObservation = (activityIndex: number, observationIndex: number) => {
    const updatedActivities = [...activities]

    // Eliminar la observación correspondiente
    updatedActivities[activityIndex].observaciones = updatedActivities[activityIndex].observaciones.filter(
      (_, idx) => idx !== observationIndex
    )

    // Actualizar el estado de actividades
    setActivities(updatedActivities)
  }

  const handleValidationChange = useCallback((activityIndex: number, isValid: boolean) => {
    setValidationStates((prev) => {
      const updatedStates = [...prev]

      // Prevenir cambios inconsistentes
      if (!isValid && updatedStates[activityIndex]) {
        updatedStates[activityIndex] = false // Forzar false
      } else {
        updatedStates[activityIndex] = isValid
      }

      // Revalida el estado global
      validateGlobalState(updatedStates)
      return updatedStates
    })
  }, [])

  const validateGlobalState = (validationStates: boolean[]) => {
    const isEverythingValid = validationStates.every(Boolean)

    setAllValid(isEverythingValid)
  }

  useEffect(() => {
    const isEverythingValid = validationStates.every(Boolean)
    setAllValid(isEverythingValid)

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
    <div className="">
      <h1 className="font-bold text-3xl">Llenar planilla de Seguimiento</h1>
      <hr className="border-[1.5px] border-[#c6caff] mt-3 mb-3" />
      <div className="flex justify-between">
        <h2 className="flex font-bold text-2xl">
          <p>
            {objectiveName} {'>'} Planilla #
            {new Date(new Date(planillaDate).setDate(new Date(planillaDate).getDate() + 1)).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })}
          </p>
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

        <div className="my-3 px-[5%]">
          {usuarios.map((usuario) => (
            <RowInformationUser
              key={usuario.id}
              userName={usuario.name}
              companyName={empresa?.grupo_empresa.nombreCorto || ''}
              userId={usuario.id}
              planillaDate={planillaDate}
              isReadOnly={isReadOnly}
              asistenciaData={asistencias[usuario.id]} // Actualizado dinámicamente desde el estado
              onChangeAsistencia={handleChangeAsistencia}
              onValidationChange={handleValidationChangeRows}
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
        {activities.length > 0 ? (
          activities.map((activity, activityIndex) => (
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
          ))
        ) : (
          <p className="text-gray-500 text-center mt-4">No existen Actividades de Seguimiento</p>
        )}
      </div>

      <h2 className="font-bold text-3xl">Entregables</h2>
      <hr className="border-[1.5px] border-[#c6caff] mt-3 mb-6" />
      <EntregableDinamicoAccordion
        entregables={entregables}
        fechas={fechas}
        isReadOnly={isReadOnly}
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
