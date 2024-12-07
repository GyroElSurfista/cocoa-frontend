// src/components/ProjectSelectorModalEvaluacion.tsx
import React, { useState, useEffect } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { useNavigate } from 'react-router-dom'
import * as Evaluacion from './../../../../interfaces/evaluacion.interface'
import {
  getAllPlanificaciones,
  getAllObjetivosEntregables,
  getObjetivesWhitoutPlanilla,
  postGeneratePlanillas,
} from '../../../../services/planillaEvaGen.service'

const ProjectSelectorModalEvaluacion: React.FC<Evaluacion.ProjectSelectorModalProps> = ({ isOpen, onClose }) => {
  const [projects, setProjects] = useState<Evaluacion.Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Evaluacion.Project | null>(null)
  const [inputValue, setInputValue] = useState<string>('')
  const [showAlreadyGeneratedMessage, setShowAlreadyGeneratedMessage] = useState<boolean>(false)
  const [isViewingPlanillas, setIsViewingPlanillas] = useState<boolean>(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Fetch objetivos y planificaciones en paralelo
        const [objetivosResponse, planificacionesResponse] = await Promise.all([getAllObjetivosEntregables(), getAllPlanificaciones()])

        const objetivosData = await objetivosResponse.data
        const planificacionesData = await planificacionesResponse.data

        // Obtener la fecha actual
        const today = new Date(localStorage.getItem('date'))

        // Filtrar planificaciones que están en curso
        const planificacionesEnCursoIds = new Set(
          planificacionesData
            .filter((plan: any) => {
              const fechaInicio = new Date(plan.fechaInici)
              const fechaFin = new Date(plan.fechaFin)
              return today >= fechaInicio && today <= fechaFin // Entre fechaInicio y fechaFin
            })
            .map((plan: any) => plan.identificador) // Solo necesitamos los identificadores
        )

        // Filtrar objetivos cuyos identificadores de planificación estén en curso
        const uniqueProjects = Array.from(
          new Map(
            objetivosData
              .filter((item: any) => planificacionesEnCursoIds.has(item.identificadorPlani)) // Filtrar por identificadorPlani
              .map((item: any) => [
                item.nombrePlani,
                {
                  identificadorPlani: item.identificadorPlani,
                  nombrePlani: item.nombrePlani,
                  fechaEvaluFinalGener: item.fechaEvaluFinalGener,
                },
              ])
          ).values()
        )

        // Actualizar el estado con los proyectos únicos
        setProjects(uniqueProjects)
      } catch (error) {
        console.error('Error al cargar los proyectos:', error)
      }
    }

    if (isOpen) fetchProjects()
  }, [isOpen])

  const resetModalState = () => {
    setSelectedProject(null)
    setInputValue('')
    setShowAlreadyGeneratedMessage(false)
    setIsViewingPlanillas(false)
  }

  const checkAndGeneratePlanillas = async (projectId: number) => {
    try {
      const checkResponse = await getObjetivesWhitoutPlanilla()
      const checkData = await checkResponse.data
      const pendingObjectives = checkData.filter((obj: any) => obj.identificadorPlani === projectId)

      if (pendingObjectives.length === 0) {
        setShowAlreadyGeneratedMessage(true)
        setIsViewingPlanillas(true)
        return
      }

      const requests = pendingObjectives.map(async (objetivo: any) => {
        const planillasData = [
          { identificadorObjet: objetivo.identificador, fecha: '2024-09-03', identificador: Date.now() },
          { identificadorObjet: objetivo.identificador, fecha: '2024-09-10', identificador: Date.now() + 1 },
          { identificadorObjet: objetivo.identificador, fecha: '2024-09-17', identificador: Date.now() + 2 },
        ]
        await postGeneratePlanillas(objetivo.identificador, planillasData)
      })

      await Promise.all(requests)

      // Obtener nuevamente los datos del proyecto actualizado
      const refreshedResponse = await getAllObjetivosEntregables()
      const refreshedData = await refreshedResponse.data

      // Buscar el proyecto actualizado por su identificador
      const updatedProject = refreshedData.find((obj: any) => obj.identificadorPlani === projectId)

      // Redirigir con los datos actualizados
      navigate('/planilla-evaluacion', {
        state: {
          identificadorPlani: updatedProject?.identificadorPlani,
          nombrePlani: updatedProject?.nombrePlani,
          success: true,
          message: `Planillas generadas correctamente para ${updatedProject?.nombrePlani}`,
          fechaEvaluFinalGener: updatedProject?.fechaEvaluFinalGener, // Pasar la fecha actualizada
        },
      })

      resetModalState()
      onClose() // Cierra el modal solo después de generar nuevas planillas
    } catch (error) {
      console.error('Error al generar planillas:', error)
      navigate('/planilla-evaluacion', {
        state: {
          identificadorPlani: selectedProject?.identificadorPlani,
          nombrePlani: selectedProject?.nombrePlani,
          success: false,
          message: 'Error al generar planillas. Intente más tarde.',
          fechaEvaluFinalGener: selectedProject?.fechaEvaluFinalGener,
        },
      })
      resetModalState()
      onClose() // Cierra el modal en caso de error
    }
  }

  const handleAccept = () => {
    if (selectedProject) {
      console.log(selectedProject)
      if (isViewingPlanillas) {
        // Navega para ver las planillas sin cerrar el modal cuando ya existen
        navigate('/planilla-evaluacion', {
          state: {
            identificadorPlani: selectedProject.identificadorPlani,
            nombrePlani: selectedProject.nombrePlani,
            success: true,
            message: `Mostrando planillas de ${selectedProject.nombrePlani}`,
            fechaEvaluFinalGener: selectedProject?.fechaEvaluFinalGener,
          },
        })
        resetModalState()
        onClose() // Solo cerrar el modal después de la navegación
      } else {
        checkAndGeneratePlanillas(selectedProject.identificadorPlani)
        // No llamamos a onClose aquí directamente, lo hacemos después de generar nuevas planillas
      }
    } else {
      console.error('No se ha seleccionado un proyecto')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white w-[375px] max-w-lg p-6 rounded-[20px] shadow-lg">
        <h5 className="text-xl font-semibold text-center">Generar Planilla de Evaluación</h5>
        <hr className="border-[1.5px] mb-4 mt-4" />
        <p>Selecciona el proyecto para generar planillas de evaluación a los objetivos correspondientes.</p>

        <h6 className="flex font-medium mb-3">
          Proyecto <p className="text-red-600">*</p>
        </h6>
        <Autocomplete
          options={projects}
          getOptionLabel={(option) => option.nombrePlani}
          value={selectedProject}
          onChange={(_event, newValue) => {
            setSelectedProject(newValue)
            setShowAlreadyGeneratedMessage(false)
            setIsViewingPlanillas(false)
          }}
          inputValue={inputValue}
          onInputChange={(_event, newInputValue) => setInputValue(newInputValue)}
          renderInput={(params) => <TextField {...params} label="Nombre proyecto" variant="outlined" className="w-full mb-2" />}
        />

        {showAlreadyGeneratedMessage && (
          <p className="text-sm text-gray-500 mb-2">
            El proyecto seleccionado ya cuenta con planillas generadas. ¿Deseas ver las planillas?
          </p>
        )}

        <div className="mt-4 flex justify-end gap-2">
          <button
            className="button-secondary_outlined"
            onClick={() => {
              resetModalState()
              onClose()
            }}
          >
            Cancelar
          </button>
          <button
            className={`button-primary ${isViewingPlanillas ? 'bg-[#462FA4]' : ''}`}
            onClick={handleAccept}
            disabled={!selectedProject}
          >
            {isViewingPlanillas ? 'Ver Planillas' : 'Generar'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProjectSelectorModalEvaluacion
