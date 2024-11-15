import { Autocomplete, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { getPlannings } from '../../../services/objective.service'
import { generateWeeklyTracking, getObjectivesFromProject } from '../../../services/planillaSeguimiento.service'
import { Planificacion } from '../../../interfaces/project.interface'
import dayjs from 'dayjs'

interface Objective {
  identificador: number
  nombre: string
  fechaInici: string
  fechaFin: string
  valueP: string
  planillasGener: boolean
  nombrePlani: string
}

interface GenerateTrackerModalProps {
  isOpen: boolean
  onClose: () => void
  onGenerate: () => void
}

const GenerateTrackerModal: React.FC<GenerateTrackerModalProps> = ({ isOpen, onClose, onGenerate }) => {
  const [projects, setProjects] = useState<Array<Planificacion>>([])
  const [selectedProject, setSelectedProject] = useState<Planificacion | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCancel = () => {
    setSelectedProject(null)
    setError(null)
    onClose()
  }

  const handleGenerate = async () => {
    try {
      const response = await generateWeeklyTracking(1)
      console.log(response)
      onGenerate()
      handleCancel()
    } catch (error) {
      console.error('Error generating tracking sheet:', error)
      setError('Ocurrió un error al generar la planilla de seguimiento. Inténtalo de nuevo.')
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
    } catch (error) {
      console.error('Error fetching projects', error)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  if (!isOpen) return null

  return (
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
          onChange={(_, newValue) => {
            setSelectedProject(newValue)
            setError(null)
          }}
          renderInput={(params) => <TextField {...params} label="Selecciona un proyecto" variant="outlined" />}
        />
        {error && <p className="text-red-500 text-sm pt-2">{error}</p>}
        <div className="flex justify-end pt-4">
          <button onClick={handleCancel} className="button-secondary_outlined mr-2">
            Cancelar
          </button>
          <button onClick={handleGenerate} className="button-primary">
            Siguiente
          </button>
        </div>
      </div>
    </div>
  )
}

export default GenerateTrackerModal
