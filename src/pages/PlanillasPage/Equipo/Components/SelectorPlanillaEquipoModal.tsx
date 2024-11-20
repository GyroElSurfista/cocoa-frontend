import { useState, useEffect } from 'react'
import { Autocomplete, TextField, Snackbar } from '@mui/material'
import * as Equipo from './../../../../interfaces/equipo.interface'
import PlaniSeguiIcon from '../../../../assets/PlaniSeguiIcon'

export const SelectorPlanillaEquipoModal = ({ onRedirect }: Equipo.SelectorObservationModalProps) => {
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

  useEffect(() => {
    const fetchObjectives = async () => {
      try {
        const response = await fetch('https://cocoabackend.onrender.com/api/objetivos')
        const data: Equipo.Objective[] = await response.json()

        // Filtrar objetivos con "(en curso)" en nombrePlani
        const filteredObjectives = data.filter((obj) => obj.nombre.includes('(en curso)'))

        // Obtener nombres únicos de proyectos con "(en curso)"
        const uniqueProjects = Array.from(new Set(filteredObjectives.map((obj) => obj.nombrePlani)))

        // Establecer estados
        setObjectives(filteredObjectives) // Guardar los objetivos filtrados
        setProjectOptions(uniqueProjects) // Guardar los nombres únicos
      } catch (error) {
        console.error('Error al cargar los objetivos:', error)
      }
    }

    fetchObjectives()
  }, [])

  useEffect(() => {
    if (selectedProject) {
      const filtered = objectives.filter((obj) => obj.nombrePlani === selectedProject)
      setFilteredObjectives(filtered)
    }
  }, [selectedProject, objectives])

  useEffect(() => {
    if (selectedObjective) {
      setLoadingPlanillas(true)
      const fetchPlanillas = async () => {
        try {
          const response = await fetch(
            `https://cocoabackend.onrender.com/api/objetivos/${selectedObjective.identificador}/planillas-seguimiento`
          )
          const data: Equipo.Planilla[] = await response.json()
          setPlanillas(data)

          // Extraer las fechas de las planillas
          const fechas = data.map((planilla) => planilla.fecha)
          setFechasPlanillas(fechas)
        } catch (error) {
          console.error('Error al cargar las planillas', error)
        } finally {
          setLoadingPlanillas(false)
        }
      }
      fetchPlanillas()
    } else {
      setPlanillas([])
      setFechasPlanillas([]) // Limpiar las fechas si no hay un objetivo seleccionado
    }
  }, [selectedObjective])

  const handleProjectNext = () => {
    if (selectedProject) {
      setShowProjectModal(false)
      setShowObjectivePlanillaModal(true)
    }
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
        fechasPlanillas
      )
      setShowObjectivePlanillaModal(false)
      setPlanillaError(false)
    } else {
      setPlanillaError(true)
    }
  }

  const isCurrentPage = location.pathname.startsWith('/planillas-seguimiento/')

  return (
    <>
      <div
        className={`hover:text-[#6344e7] py-3 px-2.5 text-base font-normal gap-1 items-center flex cursor-pointer ${
          isCurrentPage ? 'bg-[#e0e3ff] text-[#6344e7] border-l-2 border-[#6344e7]' : ''
        }`}
        onClick={() => setShowProjectModal(true)}
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
              <button type="button" onClick={() => setShowProjectModal(false)} className="button-secondary_outlined">
                Cancelar
              </button>
              <button type="button" onClick={handleProjectNext} className="button-primary" disabled={!selectedProject}>
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

            <div>
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
                renderInput={(params) => (
                  <TextField {...params} label="Selecciona un objetivo" variant="outlined" className="w-full mb-4" />
                )}
              />
            </div>

            <div className="mb-2">
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
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setShowObjectivePlanillaModal(false)} className="button-secondary_outlined">
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
