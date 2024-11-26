import { useState, useEffect } from 'react'
import axios from 'axios'
import { Autocomplete, TextField, Snackbar } from '@mui/material'
import * as Equipo from './../../../../interfaces/equipo.interface'
import PlaniSeguiIcon from '../../../../assets/PlaniSeguiIcon'
import { useNavigate } from 'react-router-dom'

const SelectorPlanillaEquipoModal = ({ onRedirect }: Equipo.SelectorObservationModalProps) => {
  const navigate = useNavigate()
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [showObjectivePlanillaModal, setShowObjectivePlanillaModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [projectOptions, setProjectOptions] = useState<string[]>([])
  const [projectInputValue, setProjectInputValue] = useState('')

  const [objectives, setObjectives] = useState<Equipo.Objective[]>([])
  const [filteredObjectives, setFilteredObjectives] = useState<Equipo.Objective[]>([])
  const [selectedObjective, setSelectedObjective] = useState<Equipo.Objective | null>(null)
  const [objectiveInputValue, setObjectiveInputValue] = useState('')

  const [planillas, setPlanillas] = useState<Equipo.Planilla[]>([])
  const [selectedPlanilla, setSelectedPlanilla] = useState<Equipo.Planilla | null>(null)
  const [planillaInputValue, setPlanillaInputValue] = useState('')
  const [loadingPlanillas, setLoadingPlanillas] = useState(false)
  const [planillaError, setPlanillaError] = useState(false)
  const [fechasPlanillas, setFechasPlanillas] = useState<string[]>([])

  // Función para cargar proyectos y objetivos
  const fetchProjectsAndObjectives = async () => {
    try {
      const [objetivosResponse, planificacionesResponse] = await Promise.all([
        fetch('https://cocoabackend.onrender.com/api/objetivos'),
        fetch('https://cocoabackend.onrender.com/api/planificaciones'),
      ])

      const objetivosData = await objetivosResponse.json()
      const planificacionesData = await planificacionesResponse.json()

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

  // Recargar opciones cuando se abre el modal del proyecto
  const handleOpenProjectModal = () => {
    setShowProjectModal(true)
    fetchProjectsAndObjectives()
  }

  useEffect(() => {
    if (selectedProject) {
      const filtered = objectives.filter((obj) => obj.nombrePlani === selectedProject)
      setFilteredObjectives(filtered)
    }
  }, [selectedProject, objectives])

  useEffect(() => {
    if (selectedObjective) {
      setLoadingPlanillas(true)

      const fetchAndFilterPlanillas = async () => {
        try {
          // Obtener información de planificaciones
          const planificacionesResponse = await axios.get('https://cocoabackend.onrender.com/api/planificaciones')
          const planificacion = planificacionesResponse.data.find((plani) => plani.identificador === selectedObjective.identificadorPlani)

          if (!planificacion) {
            console.error(`Planificación con identificador ${selectedObjective.identificadorPlani} no encontrada`)
            setPlanillas([])
            setLoadingPlanillas(false)
            return
          }

          const empresaId = planificacion.identificadorGrupoEmpre

          // Obtener planillas del objetivo seleccionado
          const planillasResponse = await axios.get(
            `https://cocoabackend.onrender.com/api/objetivos/${selectedObjective.identificador}/planillas-seguimiento`
          )
          const allPlanillas = planillasResponse.data

          // Obtener fecha actual
          const today = new Date()

          // Verificar estado de llenado de cada planilla y filtrar por fecha
          const filteredPlanillas = []
          for (const planilla of allPlanillas) {
            const planillaDate = new Date(planilla.fecha)

            // Ignorar planillas con fecha futura
            if (planillaDate > today) {
              continue
            }

            // Verificar si la planilla ya fue llenada
            const asistenciaResponse = await axios.get(
              `https://cocoabackend.onrender.com/api/asistencia?grupoEmpresaId=${empresaId}&fecha=${planilla.fecha}`
            )

            if (asistenciaResponse.data.length === 0) {
              filteredPlanillas.push(planilla)
            }
          }

          setPlanillas(filteredPlanillas) // Guardar planillas no llenadas y con fecha válida
          setFechasPlanillas(filteredPlanillas.map((planilla) => planilla.fecha))
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
    }
  }, [selectedObjective])

  const handleCancel = () => {
    setShowProjectModal(false)
    setShowObjectivePlanillaModal(false)
    setSelectedProject(null)
    setProjectInputValue('')
    setSelectedObjective(null)
    setObjectiveInputValue('')
    setSelectedPlanilla(null)
    setPlanillaInputValue('')
    setPlanillaError(false)
    setProjectOptions([])
  }

  const handleAccept = () => {
    if (selectedObjective && selectedPlanilla && selectedPlanilla.fecha) {
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
        selectedObjective.identificador,
        selectedPlanilla.fecha,
        selectedPlanilla.identificador,
        selectedObjective.nombre,
        selectedObjective.identificadorPlani,
        fechasPlanillas
      )

      navigate(`/planilla-equipo/${selectedPlanilla.identificador}`, {
        state: {
          observations,
          objectiveId: selectedObjective.identificador,
          planillaDate: selectedPlanilla.fecha,
          objectiveName: selectedObjective.nombre,
          identificadorPlani: selectedObjective.identificadorPlani,
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
          location.pathname.startsWith('/planillas-seguimiento/') ? 'bg-[#e0e3ff] text-[#6344e7] border-l-2 border-[#6344e7]' : ''
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
            <p className="font-inter font-normal mb-2 text-sm">
              Selecciona el objetivo y la planilla correspondiente para la cual desees agregar la observación
            </p>
            <label className="block mb-3 text-sm font-medium text-gray-900">
              Objetivo <span className="text-[#f60c2e]">*</span>
            </label>
            <Autocomplete
              options={filteredObjectives}
              getOptionLabel={(option) => option.nombre}
              value={selectedObjective}
              onChange={(_, newValue) => setSelectedObjective(newValue)}
              inputValue={objectiveInputValue}
              onInputChange={(_, newValue) => setObjectiveInputValue(newValue)}
              renderInput={(params) => <TextField {...params} label="Selecciona un objetivo" variant="outlined" className="w-full mb-4" />}
            />
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
              disabled={!selectedObjective || loadingPlanillas}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Selecciona una planilla"
                  variant="outlined"
                  className="w-full mb-4"
                  error={planillaError}
                  helperText={planillaError ? 'Por favor, selecciona una planilla válida' : ''}
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
                Aceptar
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
