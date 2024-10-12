import React, { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'

interface NewEntregableModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (newEntregable: Entregable[]) => void
  identificadorObjet: number
  availableObjetivos: { id: number; name: string }[] // Objetivos existentes
}

interface Entregable {
  identificador: number
  nombre: string
  descripcion: string
  identificadorObjet: number
}

const NewEntregableModal: React.FC<NewEntregableModalProps> = ({ isOpen, onClose, onCreate, identificadorObjet, availableObjetivos }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{ objetivoId: number }>()

  const [entregables, setEntregables] = useState<Omit<Entregable, 'identificador' | 'descripcion' | 'identificadorObjet'>[]>([])
  const [currentEntregable, setCurrentEntregable] = useState<string>('')
  const [selectedObjetivo, setSelectedObjetivo] = useState<number | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)

  const handleAddEntregable = () => {
    if (currentEntregable.trim()) {
      setEntregables([...entregables, { nombre: currentEntregable }])
      setCurrentEntregable('') // Limpiar el campo de texto
    }
  }

  const onSubmit: SubmitHandler<{ objetivoId: number }> = async (data) => {
    setApiError(null)
    if (!entregables.length) {
      setApiError('Debe añadir al menos un entregable')
      return
    }

    const newEntregables = entregables.map((entregable) => ({
      ...entregable,
      identificador: Date.now(), // Simulamos un ID único
      descripcion: 'Descripción automática para este entregable',
      identificadorObjet: selectedObjetivo || identificadorObjet, // Usamos el objetivo seleccionado
    }))

    try {
      const response = await fetch('https://cocoabackend.onrender.com/api/objetivos/entregables', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEntregables),
      })

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor')
      }

      onCreate(newEntregables)
      reset()
      setEntregables([]) // Limpiar los entregables
      onClose()
    } catch (error) {
      setApiError('Error creando el entregable. Inténtelo de nuevo más tarde.')
      console.error('Error creando el entregable:', error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white w-[375px] max-w-lg p-6 rounded-[20px] shadow-lg">
        <h5 className="text-xl font-semibold text-center">Registrar Entregable</h5>
        <hr className="border-[1.5px] mb-4 mt-4" />
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Dropdown para seleccionar el objetivo */}
          <label htmlFor="objetivo" className="block mb-1 text-sm font-medium text-gray-900">
            Seleccione un Objetivo <span className="text-[#f60c2e]">*</span>
          </label>
          <select
            id="objetivo"
            {...register('objetivoId', { required: 'Debe seleccionar un objetivo' })}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-4"
            onChange={(e) => setSelectedObjetivo(Number(e.target.value))}
          >
            <option value="">Seleccione un objetivo</option>
            {availableObjetivos.map((objetivo) => (
              <option key={objetivo.id} value={objetivo.id}>
                {objetivo.name}
              </option>
            ))}
          </select>
          {errors.objetivoId && <p className="text-red-500 text-sm">{errors.objetivoId.message}</p>}

          {/* Input para añadir un nuevo entregable */}
          <label htmlFor="nombre" className="block mb-1 text-sm font-medium text-gray-900">
            Añadir Entregable
          </label>
          <input
            type="text"
            id="nombre"
            value={currentEntregable}
            onChange={(e) => setCurrentEntregable(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-2"
            placeholder="Nombre del entregable"
          />
          <button type="button" onClick={handleAddEntregable} className="button-primary mb-4">
            Añadir
          </button>

          {/* Listado de entregables añadidos */}
          <ul className="mb-4">
            {entregables.map((entregable, index) => (
              <li key={index} className="text-sm">
                {entregable.nombre}
              </li>
            ))}
          </ul>

          {apiError && <p className="text-red-500 text-sm mt-4">{apiError}</p>}
          <div className="mt-6 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="button-secondary_outlined">
              Cancelar
            </button>
            <button type="submit" className="button-primary">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NewEntregableModal
