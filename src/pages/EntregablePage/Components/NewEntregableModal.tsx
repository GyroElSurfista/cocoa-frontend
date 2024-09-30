import React, { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'

interface NewEntregableModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (newEntregable: Entregable) => void
}

interface Entregable {
  identificador: number
  nombre: string
  descripcion: string
  identificadorObjet: number
}

const NewEntregableModal: React.FC<NewEntregableModalProps> = ({ isOpen, onClose, onCreate }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Entregable>()
  const [apiError, setApiError] = useState<string | null>(null)

  const onSubmit: SubmitHandler<Entregable> = (data) => {
    try {
      // Simulamos la creación del entregable
      const newEntregable = {
        ...data,
        identificador: Date.now(), // Usamos un timestamp como identificador simulado
        descripcion: 'Descripción predeterminada', // Valor simulado
        identificadorObjet: 1, // Suponemos que es para un objetivo con ID 1
      }
      onCreate(newEntregable)
      reset()
      onClose()
    } catch (error) {
      setApiError('Error creando el entregable.')
      console.log(error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white w-[375px] max-w-lg p-6 rounded-[20px] shadow-lg">
        <h5 className="text-xl font-semibold text-center">Registrar Entregable</h5>
        <hr className="border-[1.5px] mb-4 mt-4" />
        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="nombre" className="block mb-1 text-sm font-medium text-gray-900">
            Nombre del Entregable <span className="text-[#f60c2e]">*</span>
          </label>
          <input
            type="text"
            id="nombre"
            {...register('nombre', { required: 'El nombre del entregable es obligatorio' })}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="¿Cuál será el entregable?"
          />
          {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre.message}</p>}
          {apiError && <p className="text-red-500 text-sm mt-4">{apiError}</p>}
          <div className="mt-6 flex justify-end gap-2">
            <button onClick={onClose} className="button-secondary_outlined">
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
