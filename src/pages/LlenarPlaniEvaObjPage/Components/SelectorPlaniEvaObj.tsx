import { Autocomplete, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { getPlannings, ObjectiveData } from '../../../services/objective.service'
import { getObjectivesEvaluables, verificarLlenadoObj } from '../../../services/planiEvaObj.service'
import { useNavigate } from 'react-router-dom'

interface Planning {
  identificador: number
  nombre: string
  fechaInici: string
  fechaFin: string
  costo: number
  identificadorGrupoEmpre: number
  diaRevis: string
}

interface SelectorPlaniEvaObj {
  isOpen: boolean
  onClose: () => void
}

const SelectorPlaniEvaObj = ({ isOpen, onClose }: SelectorPlaniEvaObj) => {
  const [error, setError] = useState<string | null>(null)
  const [projects, setProjects] = useState<Array<Planning>>([])
  const [selectedProject, setSelectedProject] = useState<Planning | null>(null)
  const [objectives, setObjectives] = useState<Array<ObjectiveData>>([])
  const [selectedObjective, setSelectedObjective] = useState<ObjectiveData | null>(null)

  const navigate = useNavigate()

  const handleCancel = () => {
    onClose()
    setSelectedProject(null)
    setSelectedObjective(null)
  }

  const handleGenerate = async () => {
    try {
      if (!selectedProject || !selectedObjective) {
        setError('Selecciona un proyecto y un objetivo')
        return
      }
      if (selectedObjective.identificador) {
        const response = await verificarLlenadoObj(selectedObjective.identificador)
        if (response.data.puedeSerLlenado) {
          navigate(`/planilla-evaluacion/${selectedObjective.identificador}`, { state: { project: `${selectedProject.nombre}` } })
          handleCancel()
        } else {
          setError(response.data.mensaje)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const fetchProjects = async () => {
    try {
      const response = await getPlannings()
      const today = new Date()

      const validProjects = response.data.filter((project: Planning) => {
        const startDate = new Date(project.fechaInici)
        const endDate = new Date(project.fechaFin)
        return startDate <= today && endDate >= today
      })

      setProjects(validProjects)
    } catch (error) {
      console.error('Error fetching projects:', error)
    }
  }

  const fetchObjectives = async (idProject: number) => {
    try {
      const response = await getObjectivesEvaluables(idProject)
      console.log(response.data)
      setObjectives(response.data.data)
    } catch (error) {
      console.error('Error fetching objectives for project:', error)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    if (selectedProject) {
      fetchObjectives(selectedProject.identificador)
    } else {
      setObjectives([])
      setSelectedObjective(null)
    }
  }, [selectedProject])

  if (!isOpen) return null

  return (
    <div>
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white w-full max-w-lg p-6 rounded-[20px] shadow-lg">
          <div className="flex justify-center items-center py-3">
            <h5 className="text-xl font-semibold">Llenar planilla de evaluación de Objetivo</h5>
          </div>
          <hr className="border-[1.5px] mb-4" />
          <p className="pb-3">
            Selecciona el proyecto y el objetivo para el cual deseas llenar la planilla de evaluación (solo para proyectos en desarrollo).
          </p>
          <div className="pb-2 font-medium">
            Proyecto <span className="text-red-500">*</span>
          </div>
          <Autocomplete
            options={projects}
            getOptionLabel={(option) => `${option.nombre}`}
            value={selectedProject}
            onChange={(_, newValue) => {
              setSelectedProject(newValue)
              setSelectedObjective(null)
              setError(null) // Clear error when a valid selection is made
            }}
            renderInput={(params) => <TextField {...params} label="Selecciona un proyecto" variant="outlined" />}
          />
          <div className={`py-2 font-medium ${!selectedProject ? 'text-[#888888]' : ''}`}>
            Objetivo <span className="text-red-500">*</span>
          </div>
          <Autocomplete
            options={objectives}
            getOptionLabel={(option) => option.nombre} // Adjusted to "nombre" assuming "objective" was incorrect
            value={selectedObjective}
            onChange={(_, newValue) => {
              setSelectedObjective(newValue)
              setError(null) // Clear error when a valid selection is made
            }}
            renderInput={(params) => <TextField {...params} label="Selecciona un objetivo" variant="outlined" />}
            disabled={!selectedProject} // Disable the field if no project is selected
            noOptionsText="No existen objetivos que puedan ser evaluados"
          />
          {error && <p className="text-red-500 text-sm pt-2">{error}</p>}
          <div className="flex justify-end pt-4">
            <button onClick={handleCancel} className="button-secondary_outlined mr-2">
              Cancelar
            </button>
            <button onClick={handleGenerate} className="button-primary">
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SelectorPlaniEvaObj
