import React, { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import axios from 'axios'

interface NewEntregableModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (entregable: Entregable) => void
  initialData?: Entregable
  entregable: Entregable[]
  objectiveId: number // Nuevo prop para recibir el identificador del objetivo
  planillaSeguiId?: number // Nuevo prop para recibir el identificador de planilla de seguimiento
}

interface Entregable {
  identificador: number
  nombre: string
  descripcion: string | null
  identificadorObjet: number
  identificadorPlaniSegui?: number
  dinamico?: boolean
  fechaCreac?: string
  criterio_aceptacion_entregable: CriterioAceptacion[]
}

interface CriterioAceptacion {
  identificador: number
  descripcion: string
  identificadorEntre: number
}

const NewEntregableDinamicoModal: React.FC<NewEntregableModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  initialData,
  entregable,
  objectiveId,
  planillaSeguiId,
}) => {
  const { register, handleSubmit, reset } = useForm<FormData>()
  const [criterios, setCriterios] = useState<string[]>(initialData?.criterio_aceptacion_entregable.map((c) => c.descripcion) || [''])
  const [nombre, setNombre] = useState(initialData?.nombre || '')

  // Función para manejar el guardado de datos
  const saveEntregable: SubmitHandler<FormData> = async () => {
    try {
      // Definimos el nuevo entregable
      const updatedEntregable = {
        nombre,
        descripcion: '',
        criterios: criterios.map((desc, index) => ({
          identificador: initialData?.criterio_aceptacion_entregable[index]?.identificador || 0,
          descripcion: desc,
        })),
        identificadorObjet: initialData?.identificadorObjet || objectiveId, // Usa el objectiveId en caso de nuevo entregable
        identificadorPlaniSegui: initialData?.identificadorPlaniSegui || planillaSeguiId, // Usa el planillaSeguiId en caso de nuevo entregable
      }
      console.log(updatedEntregable)
      // Verificamos si es una edición o creación
      if (initialData) {
        // Editar entregable existente
        const response = await axios.put(
          `https://cocoabackend.onrender.com/api/entregables/update/${initialData.identificador}`,
          updatedEntregable
        )
        if (response.status === 200) {
          onCreate(response.data) // Actualizar lista en el componente padre
          onClose()
        }
      } else {
        // Crear nuevo entregable
        const response = await axios.post('https://cocoabackend.onrender.com/api/entregable', updatedEntregable)
        if (response.status === 201) {
          onCreate(response.data) // Agregar a la lista en el componente padre
          onClose()
        }
      }

      // Limpiar formulario
      reset()
      setCriterios([''])
      setNombre('')
    } catch (error) {
      console.error('Error al guardar el entregable:', error)
    }
  }

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white w-[375px] max-w-lg p-6 rounded-[20px] shadow-lg max-h-[85vh] overflow-y-auto min-w-[300px]">
          <h5 className="text-xl font-semibold text-center">
            {initialData ? 'Editar Entregable Dinamico' : 'Registrar Entregable Dinamico'}
          </h5>
          <hr className="border-[1.5px] my-2" />
          <p className="text-base font-semibold">Entregable para el Objetivo {objectiveId}</p>

          <h6 className="my-2 text-base">Entregable *</h6>
          <input
            type="text"
            placeholder="Nombre del entregable"
            className="border text-gray-900 rounded-lg block w-full p-2.5 mb-2"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <h6 className="text-base mb-2">Criterios de aceptación para Entregable *</h6>
          {criterios.map((criterio, index) => (
            <input
              key={index}
              type="text"
              value={criterio}
              onChange={(e) => {
                const newCriterios = [...criterios]
                newCriterios[index] = e.target.value
                setCriterios(newCriterios)
              }}
              placeholder="Criterio de aceptación"
              className="border text-gray-900 rounded-lg block w-full p-2.5 mb-2"
            />
          ))}
          <div className="flex justify-center items-center ">
            <button onClick={() => setCriterios([...criterios, ''])} className="button-primary mb-4">
              + Nuevo Criterio
            </button>
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="button-secondary_outlined">
              Cancelar
            </button>
            <button type="button" onClick={handleSubmit(saveEntregable)} className="button-primary">
              {initialData ? 'Guardar Cambios' : 'Registrar'}
            </button>
          </div>
        </div>
      </div>
    )
  )
}

export default NewEntregableDinamicoModal
