// SelectorProjectEntregable.tsx
import { useState, useEffect, useCallback } from 'react'
import { Modal, Autocomplete, TextField } from '@mui/material'
import { getAllObjetivosEntregables, getAllPlanificaciones } from '../../../services/entregable.service'

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
      const [objetivosResponse, planificacionesResponse] = await Promise.all([getAllObjetivosEntregables(), getAllPlanificaciones()])

      const objetivosData = await objetivosResponse.data
      const planificacionesData = await planificacionesResponse.data

      // Almacenar todos los objetivos
      setAllObjectives(objetivosData)

      // Obtener la fecha actual
      const today = new Date()

      // Filtrar planificaciones que aún no han iniciado
      const planificacionesValidas = planificacionesData.filter((plan: any) => {
        const fechaInicio = new Date(plan.fechaInici)
        return today < fechaInicio // Solo planificaciones futuras
      })

      // Crear un Set con los identificadores de las planificaciones válidas
      const validPlanificacionIds = new Set(planificacionesValidas.map((plan: any) => plan.identificador))

      // Filtrar objetivos con identificadores de planificación válidos
      const proyectosUnicos = Array.from(
        new Map(
          objetivosData
            .filter((objetivo: any) => validPlanificacionIds.has(objetivo.identificadorPlani)) // Filtrar por identificadorPlani
            .map((objetivo: any) => [
              objetivo.identificadorPlani,
              {
                nombre: objetivo.nombrePlani,
                identificadorPlani: objetivo.identificadorPlani,
                nombrePlani: objetivo.nombrePlani,
              },
            ])
        ).values()
      )

      setProjects(proyectosUnicos)
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
          <p className="text-sm my-2">
            Selecciona un proyecto para continuar con la creación de entregables asociados (solo para proyectos en desarrollo).
          </p>

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
