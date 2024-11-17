import { Autocomplete, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { getPlannings } from '../../../services/objective.service'
import { generateWeeklyTracking } from '../../../services/planillaSeguimiento.service'
import { Planificacion } from '../../../interfaces/project.interface'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'

const GenerateTrackerModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [projects, setProjects] = useState<Array<Planificacion>>([])
  const [selectedProject, setSelectedProject] = useState<Planificacion | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [hasTrackers, setHasTrackers] = useState(false)

  const navigate = useNavigate()

  const handleOpen = () => setIsOpen(true)
  const handleClose = () => {
    setSelectedProject(null)
    setHasTrackers(false)
    setError(null)
    setIsOpen(false)
  }

  const handleGenerate = async () => {
    if (!selectedProject) {
      setError('Debe seleccionar un proyecto para continuar.')
      return
    }
    if (hasTrackers) {
      navigate(`/planillas-seguimiento/${selectedProject.identificador}`, {
        state: { project: selectedProject, generated: false },
      })
      return
    } else {
      try {
        const response = await generateWeeklyTracking(selectedProject.identificador)
        console.log(response.data)
        navigate(`/planillas-seguimiento/${selectedProject.identificador}`, {
          state: { project: response.data, generated: true },
        })
      } catch (error) {
        console.error('Error generating tracking sheet:', error)
        setError('Ocurrió un error al generar la planilla de seguimiento. Inténtalo de nuevo.')
      }
    }
  }

  const fetchProjects = async () => {
    try {
      const response = await getPlannings()
      const currentDate = dayjs()

      // Filter only projects that are currently in progress
      const filteredProjects = response.data.filter((project: Planificacion) => {
        const startDate = dayjs(project.fechaInici)
        const endDate = dayjs(project.fechaFin)

        // Check if the current date is within the project's date range
        return currentDate.isAfter(startDate) && currentDate.isBefore(endDate)
      })
      setProjects(filteredProjects)
      console.log(filteredProjects)
    } catch (error) {
      console.error('Error fetching projects', error)
    }
    return
  }

  const handleProjectChange = (project: Planificacion | null) => {
    setSelectedProject(project)
    setError(null) // Clear error when a project is selected

    if (project?.planillasSeguiGener) {
      setHasTrackers(true)
    } else {
      setHasTrackers(false)
    }
  }

  useEffect(() => {
    if (isOpen) fetchProjects()
  }, [isOpen])

  return (
    <>
      {/* Botón para abrir el modal */}
      <div className="h-10 px-5 py-2.5 my-2 bg-[#eef0ff] rounded-lg justify-between items-center flex cursor-pointer" onClick={handleOpen}>
        <p>Servicio de generación de planillas de seguimiento semanal</p>
      </div>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white w-full max-w-lg p-6 rounded-[20px] shadow-lg">
            <div className="flex justify-center items-center py-3">
              <h5 className="text-xl font-semibold">Generar Planillas de Seguimiento</h5>
            </div>
            <hr className="border-[1.5px] mb-4" />
            <p className="pb-3">Selecciona el proyecto para generar planillas de seguimiento a los objetivos correspondientes.</p>
            <div className="pb-2 font-medium">
              Proyecto <span className="text-red-500">*</span>
            </div>
            <Autocomplete
              options={projects}
              getOptionLabel={(option) => option.nombre}
              value={selectedProject}
              onChange={(_, newValue) => handleProjectChange(newValue)}
              renderInput={(params) => <TextField {...params} label="Selecciona un proyecto" variant="outlined" />}
            />
            {error && <p className="text-red-500 text-sm pt-2">{error}</p>}
            {hasTrackers && (
              <p className="text-yellow-600 text-sm pt-2">
                El proyecto seleccionado ya cuenta con planillas generadas. ¿Deseas ver las planillas?
              </p>
            )}
            <div className="flex justify-end pt-4">
              <button onClick={handleClose} className="button-secondary_outlined mr-2">
                Cancelar
              </button>
              <button onClick={handleGenerate} className={hasTrackers ? 'button-primary_purple' : 'button-primary'}>
                {hasTrackers ? 'Ver planillas' : 'Siguiente'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default GenerateTrackerModal
