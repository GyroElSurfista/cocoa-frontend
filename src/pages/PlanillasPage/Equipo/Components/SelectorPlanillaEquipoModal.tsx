import { useState, useEffect } from 'react'
import { Autocomplete, TextField, Snackbar } from '@mui/material'
import * as Equipo from './../../../../interfaces/equipo.interface'
import PlaniSeguiIcon from '../../../../assets/PlaniSeguiIcon'
import { useNavigate } from 'react-router-dom'
import {
  getAllObjetivosEntregables,
  getAllPlanificaciones,
  getAsistenciasDate,
  getPlanillasSeguimiento,
} from '../../../../services/equipo.service'

const SelectorPlanillaEquipoModal = ({ onRedirect }: Equipo.SelectorObservationModalProps) => {
  const navigate = useNavigate()
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [showObjectivePlanillaModal, setShowObjectivePlanillaModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [projectOptions, setProjectOptions] = useState<string[]>([])
  const [projectInputValue, setProjectInputValue] = useState('')
  const [showMessageLlenada, setShowMessageLlenada] = useState(false)

  const [objectives, setObjectives] = useState<Equipo.Objective[]>([])
  const [autoSelectedObjective, setAutoSelectedObjective] = useState<Equipo.Objective | null>(null)
  const [recommendedPlanilla, setRecommendedPlanilla] = useState<Equipo.Planilla | null>(null)
  const [showWarning, setShowWarning] = useState(false)
  const [noPlanillasError, setNoPlanillasError] = useState(false)
  const [noObjetivesGenerate, setNoObjetivesGenerate] = useState(false)

  const [planillas, setPlanillas] = useState<Equipo.Planilla[]>([])
  const [selectedPlanilla, setSelectedPlanilla] = useState<Equipo.Planilla | null>(null)
  const [planillaInputValue, setPlanillaInputValue] = useState('')
  const [loadingPlanillas, setLoadingPlanillas] = useState(false)
  const [planillaError, setPlanillaError] = useState(false)
  const [fechasPlanillas, setFechasPlanillas] = useState<string[]>([])

  // Función para cargar proyectos y objetivos
  const fetchProjectsAndObjectives = async () => {
    try {
      const [objetivosResponse, planificacionesResponse] = await Promise.all([getAllObjetivosEntregables(), getAllPlanificaciones()])

      const objetivosData = await objetivosResponse.data
      const planificacionesData = await planificacionesResponse.data

      const today = new Date()
      const planificacionesEnCursoIds = new Set(
        planificacionesData
          .filter((plan) => {
            const fechaInicio = new Date(plan.fechaInici)
            const fechaFin = new Date(plan.fechaFin)
            return today >= fechaInicio && today <= fechaFin
          })
          .map((plan) => plan.identificador)
      )

      const filteredObjectives = objetivosData.filter((obj) => planificacionesEnCursoIds.has(obj.identificadorPlani))
      const uniqueProjects = Array.from(new Set(filteredObjectives.map((obj) => obj.nombrePlani)))

      setObjectives(filteredObjectives)
      setProjectOptions(uniqueProjects)
    } catch (error) {
      console.error('Error al cargar los objetivos y planificaciones:', error)
    }
  }
  useEffect(() => {
    if (!loadingPlanillas && planillas.length === 0 && autoSelectedObjective?.nombre) {
      setNoPlanillasError(true)
    } else {
      setNoPlanillasError(false)
    }
  }, [loadingPlanillas, planillas, selectedProject])

  useEffect(() => {
    if (selectedProject && objectives.length > 0) {
      const today = new Date()

      // Encontrar el objetivo en curso basado en las fechas
      const currentObjective = objectives.find(
        (obj) => obj.nombrePlani === selectedProject && new Date(obj.fechaInici) <= today && new Date(obj.fechaFin) >= today
      )

      if (currentObjective) {
        setAutoSelectedObjective(currentObjective)
      } else {
        setAutoSelectedObjective(null)
      }
    }
  }, [selectedProject, objectives])

  // Recargar opciones cuando se abre el modal del proyecto
  const handleOpenProjectModal = () => {
    setShowProjectModal(true)
    fetchProjectsAndObjectives()
  }

  useEffect(() => {
    if (selectedPlanilla && recommendedPlanilla) {
      // Mostrar advertencia si la planilla seleccionada ya está llenada
      setShowWarning(selectedPlanilla.llenada || selectedPlanilla.identificador !== recommendedPlanilla.identificador)
    } else {
      setShowWarning(false)
    }
  }, [selectedPlanilla, recommendedPlanilla])

  useEffect(() => {
    if (autoSelectedObjective) {
      setLoadingPlanillas(true)

      const fetchAndFilterPlanillas = async () => {
        try {
          const planificacionesResponse = await getAllPlanificaciones()
          const planificacion = planificacionesResponse.data.find(
            (plani) => plani.identificador === autoSelectedObjective.identificadorPlani
          )

          if (!planificacion) {
            console.error(`Planificación con identificador ${autoSelectedObjective.identificadorPlani} no encontrada`)
            setPlanillas([])
            setLoadingPlanillas(false)
            return
          }

          const empresaId = planificacion.identificadorGrupoEmpre

          const planillasResponse = await getPlanillasSeguimiento(autoSelectedObjective.identificador)
          const allPlanillas = planillasResponse.data

          const today = new Date()
          const filteredPlanillas = []

          for (const planilla of allPlanillas) {
            const planillaDate = new Date(planilla.fecha)

            // Verificar si la planilla está dentro del rango de 7 días desde su fecha original
            const planillaEndDate = new Date(planillaDate)
            planillaEndDate.setDate(planillaEndDate.getDate() + 7)

            // Verificar si la planilla ya fue llenada
            const asistenciaResponse = await getAsistenciasDate(empresaId, planilla.fecha)
            const isPlanillaLlenada = asistenciaResponse.data.length > 0

            // Si no ha sido llenada o está en el rango de 7 días, incluirla
            if (!isPlanillaLlenada || (today >= planillaDate && today <= planillaEndDate)) {
              filteredPlanillas.push({
                ...planilla,
                llenada: isPlanillaLlenada, // Marcar si está llenada
              })
            }
            setShowMessageLlenada(isPlanillaLlenada)
          }

          setPlanillas(filteredPlanillas)

          // Preseleccionar la planilla más cercana
          const closestPlanilla = filteredPlanillas.reduce((prev, curr) => {
            const prevDiff = Math.abs(new Date(prev.fecha) - today)
            const currDiff = Math.abs(new Date(curr.fecha) - today)
            return currDiff < prevDiff ? curr : prev
          }, filteredPlanillas[0])

          setRecommendedPlanilla(closestPlanilla)
          setSelectedPlanilla(closestPlanilla) // Preselecciona la más cercana
        } catch (error) {
          console.error('Error al cargar o filtrar planillas:', error)
        } finally {
          setLoadingPlanillas(false)
        }
      }

      fetchAndFilterPlanillas()
    } else {
      setPlanillas([])
      setFechasPlanillas([])
      setRecommendedPlanilla(null)
      setNoPlanillasError(true) // Sin objetivo seleccionado, asumimos error
    }
  }, [autoSelectedObjective])

  const handleCancel = () => {
    // Ocultar modales
    setShowProjectModal(false)
    setShowObjectivePlanillaModal(false)

    // Limpiar campos seleccionados
    setSelectedProject(null)
    setProjectInputValue('')
    setSelectedPlanilla(null)
    setPlanillaInputValue('')
    setPlanillaError(false)
    setNoPlanillasError(false)

    // Reiniciar opciones y datos cargados
    setProjectOptions([])
    setObjectives([])
    setPlanillas([])
    setFechasPlanillas([])

    // Limpiar estados automáticos
    setAutoSelectedObjective(null)
    setRecommendedPlanilla(null)

    // Reiniciar mensajes y advertencias
    setShowWarning(false)
  }

  const handleAccept = () => {
    if (autoSelectedObjective && selectedPlanilla && selectedPlanilla.fecha) {
      const observations = selectedPlanilla.actividad_seguimiento.flatMap((activity) =>
        activity.observacion.map((obs) => ({
          id: obs.identificador,
          observation: obs.descripcion,
          identificadorActivSegui: obs.identificadorActivSegui,
          selectedActivities: [{ id: obs.identificadorActivSegui, name: `Actividad ${obs.identificadorActivSegui}` }],
          activities: [],
        }))
      )

      onRedirect(
        observations,
        autoSelectedObjective.identificador,
        selectedPlanilla.fecha,
        selectedPlanilla.identificador,
        autoSelectedObjective.nombre,
        autoSelectedObjective.identificadorPlani,
        fechasPlanillas
      )

      navigate(`/planilla-equipo/${selectedPlanilla.identificador}`, {
        state: {
          observations,
          objectiveId: autoSelectedObjective.identificador,
          planillaDate: selectedPlanilla.fecha,
          objectiveName: autoSelectedObjective.nombre,
          identificadorPlani: autoSelectedObjective.identificadorPlani,
          planillaSeguiId: selectedPlanilla.identificador,
          fechas: fechasPlanillas,
        },
      })

      handleCancel()
    } else {
      setPlanillaError(true)
    }
  }

  return (
    <>
      <div
        className={`hover:text-[#6344e7] py-3 px-2.5 text-base font-normal gap-1 items-center flex cursor-pointer ${
          location.pathname === '/planillas-seguimiento' ? 'bg-[#e0e3ff] text-[#6344e7] border-l-2 border-[#6344e7]' : ''
        }`}
        onClick={handleOpenProjectModal} // Llama a la función para abrir y recargar datos
      >
        <PlaniSeguiIcon />
        Planillas de Seguimiento Semanal{' '}
      </div>

      {showProjectModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white w-[375px] max-w-lg p-6 rounded-[20px] shadow-lg">
            <h5 className="text-xl font-semibold text-center">Llenar planilla de Seguimiento</h5>
            <hr className="border-[1.5px] mb-4 mt-4" />
            <p className="font-inter font-normal mb-2 text-sm">Selecciona el proyecto para el cual deseas hacer seguimiento.</p>
            <label className="block mb-3 text-sm font-medium text-gray-900">
              Proyecto <span className="text-[#f60c2e]">*</span>
            </label>

            <Autocomplete
              options={projectOptions}
              value={selectedProject}
              onChange={(_, newValue) => setSelectedProject(newValue)}
              inputValue={projectInputValue}
              onInputChange={(_, newValue) => setProjectInputValue(newValue)}
              renderInput={(params) => <TextField {...params} label="Selecciona un proyecto" variant="outlined" className="w-full mb-4" />}
            />

            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={handleCancel} className="button-secondary_outlined">
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => setShowObjectivePlanillaModal(true)}
                className="button-primary"
                disabled={!selectedProject}
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      )}

      {showObjectivePlanillaModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white w-[375px] max-w-lg p-6 rounded-[20px] shadow-lg">
            <h5 className="text-xl font-semibold text-center">Llenar planilla de Seguimiento</h5>
            <hr className="border-[1.5px] mb-4 mt-4" />
            <p className="font-inter font-normal mb-4 text-sm">
              {autoSelectedObjective?.nombre ? (
                <>
                  Planillas para el objetivo en curso: <p className="font-semibold">{autoSelectedObjective.nombre}</p>
                </>
              ) : (
                <p>
                  <b className="text-red-600">No existe objetivos en curso</b> para la planificación:{' '}
                  <p className="font-semibold">{selectedProject}</p>
                </p>
              )}
            </p>

            {recommendedPlanilla && (
              <p className="text-black text-sm mb-4">
                {recommendedPlanilla.llenada ? (
                  <>
                    La planilla <b>{recommendedPlanilla.fecha}</b>, correspondiente a la semana ya ha sido llenada.
                  </>
                ) : (
                  <>
                    La planilla que debe llenar esta semana es: <p className="font-semibold">{recommendedPlanilla.fecha}</p>
                  </>
                )}
              </p>
            )}

            <label className="block mb-3 text-sm font-medium text-gray-900">
              Planilla <span className="text-[#f60c2e]">*</span>
            </label>
            <Autocomplete
              options={planillas}
              getOptionLabel={(option) => option.fecha}
              value={selectedPlanilla}
              onChange={(_, newValue) => setSelectedPlanilla(newValue)}
              inputValue={planillaInputValue}
              onInputChange={(_, newValue) => setPlanillaInputValue(newValue)}
              loading={loadingPlanillas}
              disabled={noPlanillasError}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Selecciona una planilla"
                  variant="outlined"
                  className="w-full mb-4"
                  error={noPlanillasError}
                  helperText={
                    noPlanillasError ? (
                      <>
                        Debe generar las planillas de seguimiento semanal para la planificación:
                        <p className="font-semibold">{selectedProject}</p>
                      </>
                    ) : showWarning ? (
                      selectedPlanilla?.llenada ? (
                        <p className="text-red-600">La planilla ({selectedPlanilla?.fecha}) ya ha sido llenada ¿Desea continuar?</p>
                      ) : (
                        <p className="text-red-600">La planilla ({selectedPlanilla?.fecha}) es una pasada ¿Desea continuar?</p>
                      )
                    ) : (
                      ''
                    )
                  }
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingPlanillas ? 'Cargando...' : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />

            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={handleCancel} className="button-secondary_outlined">
                Cancelar
              </button>
              <button type="button" onClick={handleAccept} className="button-primary" disabled={!selectedPlanilla}>
                {showWarning ? 'Continuar' : 'Aceptar'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Snackbar
        open={planillaError}
        autoHideDuration={3000}
        onClose={() => setPlanillaError(false)}
        message="Por favor, selecciona una planilla válida"
      />
    </>
  )
}

export default SelectorPlanillaEquipoModal
