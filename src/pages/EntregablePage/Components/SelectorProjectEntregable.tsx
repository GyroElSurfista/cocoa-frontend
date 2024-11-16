// SelectorProjectEntregable.tsx
import { useState, useEffect, useCallback } from 'react'
import { Modal, Autocomplete, TextField } from '@mui/material'

interface ProjectSelectorModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (identificadorPlani: number, objetivoIds: number[], nombrePlani: string) => void
}

const SelectorProjectEntregable: React.FC<ProjectSelectorModalProps> = ({ isOpen, onClose, onSelect }) => {
  const [projects, setProjects] = useState<{ nombre: string; identificadorPlani: number; nombrePlani: string }[]>([])
  const [selectedProject, setSelectedProject] = useState<{ nombre: string; identificadorPlani: number; nombrePlani: string } | null>(null)
  const [allObjectives, setAllObjectives] = useState<any[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const fetchProyectosUnicos = useCallback(async () => {
    try {
      const response = await fetch('https://cocoabackend.onrender.com/api/objetivos')
      const data = await response.json()

      // Almacenar todos los objetivos
      setAllObjectives(data)

      // Filtrar proyectos "(sin iniciar)" y asegurarse de que sean únicos
      const proyectosUnicosSinIniciar = Array.from(
        new Map(
          data
            .filter((item: any) => item.nombrePlani.includes('(sin iniciar)'))
            .map((item: any) => [
              item.nombrePlani,
              { nombre: item.nombrePlani, identificadorPlani: item.identificadorPlani, nombrePlani: item.nombrePlani },
            ])
        ).values()
      )

      setProjects(proyectosUnicosSinIniciar)
    } catch (error) {
      console.error('Error fetching proyectos:', error)
      setErrorMessage('No se pudieron cargar los proyectos. Inténtalo nuevamente.')
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      fetchProyectosUnicos()
    }
  }, [isOpen, fetchProyectosUnicos])

  const handleSelect = () => {
    if (selectedProject) {
      // Obtener los identificadores de los objetivos que comparten el `nombrePlani` seleccionado
      const objetivoIds = allObjectives.filter((obj) => obj.nombrePlani === selectedProject.nombre).map((obj) => obj.identificador)
      console.log(objetivoIds)
      onSelect(selectedProject.identificadorPlani, objetivoIds, selectedProject.nombrePlani)
    } else {
      setErrorMessage('Debe seleccionar un proyecto.')
    }
  }

  if (!isOpen) return null

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white w-[475px] max-w-lg p-6 rounded-[20px] shadow-lg max-h-[85vh] overflow-y-auto min-w-[300px]">
          <h5 className="text-xl font-semibold text-center">Seleccionar Proyecto</h5>
          <hr className="border-[1.5px] my-2" />
          <p className="text-sm my-2">Selecciona un proyecto para continuar con la creación de entregables asociados.</p>

          <h2 className="pb-2 font-medium">Proyectos</h2>
          <Autocomplete
            id="proyecto-autocomplete"
            options={projects}
            getOptionLabel={(option) => option.nombre}
            value={selectedProject}
            onChange={(_, newValue) => {
              setSelectedProject(newValue)
              setErrorMessage(null)
            }}
            renderInput={(params) => <TextField {...params} label="Selecciona un proyecto" variant="outlined" />}
            className="mb-4"
          />
          {errorMessage && <div className="text-red-500 text-sm">{errorMessage}</div>}

          <div className="mt-4 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="button-secondary_outlined">
              Cancelar
            </button>
            <button type="button" onClick={handleSelect} className="button-primary" disabled={!selectedProject}>
              Seleccionar
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default SelectorProjectEntregable
