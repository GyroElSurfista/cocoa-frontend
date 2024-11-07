import { Autocomplete, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { getObjectivesFromPlanification, getPlannings, ObjectiveData } from '../../../services/objective.service'
import { formatDateToDMY } from '../../../utils/formatDate'
import { verificarLlenadoObj } from '../../../services/planiEvaObj.service'
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
        console.log(response.data)
        if (response.data.puedeSerLlenado) {
          navigate(`/planilla-evaluacion/${selectedObjective.identificador}`)
        } else {
          setError('El objetivo seleccionado no puede ser llenado')
        }
      }
    } catch (error) {
      console.log(error)
    }
    // Proceed with your generate logic
  }

  const fetchProjects = async () => {
    try {
      const response = await getPlannings()
      setProjects(response.data)
    } catch (error) {
      console.error('Error fetching projects:', error)
    }
  }

  const fetchObjectives = async (idProject: number) => {
    try {
      const response = await getObjectivesFromPlanification(idProject)
      setObjectives(response.data)
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
      setObjectives([]) // Clear objectives if no project is selected
      setSelectedObjective(null) // Reset selected objective
    }
  }, [selectedProject])

  const today = new Date()

  if (!isOpen) return null

  return (
    <div>
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white w-full max-w-lg p-6 rounded-[20px] shadow-lg">
          <div className="flex justify-center items-center py-3">
            <h5 className="text-xl font-semibold">Llenar planilla de evaluación de Objetivo</h5>
          </div>
          <hr className="border-[1.5px] mb-4" />
          <p className="pb-3">Selecciona el proyecto y el objetivo para el cual deseas generar la planilla de evaluación</p>
          <div className="pb-2 font-medium">
            Proyecto <span className="text-red-500">*</span>
          </div>
          <Autocomplete
            options={projects}
            getOptionLabel={(option) => `${option.nombre}: ${formatDateToDMY(option.fechaInici)} - ${formatDateToDMY(option.fechaFin)}`}
            getOptionDisabled={(option) => {
              const startDate = new Date(option.fechaInici)
              const endDate = new Date(option.fechaFin)
              return today < startDate || today > endDate
            }}
            value={selectedProject}
            onChange={(event, newValue) => {
              setSelectedProject(newValue)
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
            onChange={(event, newValue) => {
              setSelectedObjective(newValue)
              setError(null) // Clear error when a valid selection is made
            }}
            renderInput={(params) => <TextField {...params} label="Selecciona un objetivo" variant="outlined" />}
            disabled={!selectedProject} // Disable the field if no project is selected
          />
          {error && <p className="text-red-500 text-sm pt-2">{error}</p>}
          <div className="flex justify-end pt-4">
            <button onClick={handleCancel} className="button-secondary_outlined mr-2">
              Cancelar
            </button>
            <button onClick={handleGenerate} className="button-primary">
              Generar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SelectorPlaniEvaObj
