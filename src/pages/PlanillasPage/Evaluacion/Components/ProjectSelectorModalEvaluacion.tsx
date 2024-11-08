// src/components/ProjectSelectorModalEvaluacion.tsx

import React, { useState, useEffect } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom'

interface Project {
  identificadorPlani: number
  nombrePlani: string
}

interface ProjectSelectorModalProps {
  isOpen: boolean
  onClose: () => void
}

const ProjectSelectorModalEvaluacion: React.FC<ProjectSelectorModalProps> = ({ isOpen, onClose }) => {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [inputValue, setInputValue] = useState<string>('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('https://cocoabackend.onrender.com/api/objetivos')
        const data = await response.json()

        // Filtrar nombres únicos de `nombrePlani`
        const uniqueProjects = Array.from(
          new Map(
            data.map((item: any) => [item.nombrePlani, { identificadorPlani: item.identificadorPlani, nombrePlani: item.nombrePlani }])
          ).values()
        )

        setProjects(uniqueProjects)
      } catch (error) {
        console.error('Error al cargar los proyectos:', error)
      }
    }

    if (isOpen) fetchProjects()
  }, [isOpen])

  const handleAccept = () => {
    if (selectedProject) {
      navigate('/planilla-evaluacion', { state: { identificadorPlani: selectedProject.identificadorPlani } })
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white w-[375px] max-w-lg p-6 rounded-[20px] shadow-lg">
        <h5 className="text-xl font-semibold text-center">Selecciona un Proyecto</h5>
        <hr className="border-[1.5px] mb-4 mt-4" />

        <Autocomplete
          options={projects}
          getOptionLabel={(option) => option.nombrePlani}
          value={selectedProject}
          onChange={(event, newValue) => setSelectedProject(newValue)}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
          renderInput={(params) => <TextField {...params} label="Selecciona un proyecto" variant="outlined" className="w-full mb-4" />}
        />

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outlined" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="contained" color="primary" onClick={handleAccept} disabled={!selectedProject}>
            Aceptar
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ProjectSelectorModalEvaluacion
