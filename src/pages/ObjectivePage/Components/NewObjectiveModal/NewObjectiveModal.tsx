import React, { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { ActivityProps } from '../../ObjectivePage'
import { createObjective } from '../../../../services/objective.service'

interface Objective {
  iniDate: string
  finDate: string
  objective: string
  valueP: string
  activities: ActivityProps[] // Añadir las actividades aquí
}

interface NewObjectiveModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (newObjective: Objective) => void
}

const NewObjectiveModal: React.FC<NewObjectiveModalProps> = ({ isOpen, onClose, onCreate }) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }, watch,
    reset,
  } = useForm<Objective>()
  const [apiError, setApiError] = useState<string | null>(null) // State to hold API error
  const [equivalence, setEquivalence] = useState<number>(0)
  const planningCost = 140000 // Costo de la planificación constante

  const valueP = watch('valueP') // Observa el valor porcentual

  const onCloseHandler = () => {
    reset() // Reinicia el formulario al cerrar el modal
    onClose() // Llama a la función para cerrar el modal
  } 

  const onSubmit: SubmitHandler<Objective> = async (data) => {
    try {
      console.log(data)

      const createdObjective = await createObjective({
        identificadorPlani: 1,
        nombre: data.objective,
        fechaInici: data.iniDate,
        fechaFin: data.finDate,
        valorPorce: parseFloat(data.valueP),
      })

      console.log(createObjective)
      // Clear any previous errors
      setApiError(null)

      // Se pasa el nuevo objetivo al componente padre
      onCreate(createdObjective)

      // Reset form and close modal
      reset()
      onClose()
    } catch (error: any) {
      // Set API error if the request fails
      console.log(error)
      const errorData = error.response?.data

      // General error message
      //setApiError(errorData?.message || 'Error creating the objective')

      // Field-specific errors
      if (errorData?.errors) {
        // Map the backend errors to the respective fields
        if (errorData.errors.fechaInici) {
          setError('iniDate', {
            type: 'manual',
            message: errorData.errors.fechaInici.join('. '), // Combine error messages for this field
          })
        }
        if (errorData.errors.fechaFin) {
          setError('finDate', {
            type: 'manual',
            message: errorData.errors.fechaFin.join(', '),
          })
        }
      }
    }
  }

  useEffect(() => {
    if (valueP) {
      const value = parseFloat(valueP)
      if (!isNaN(value)) {
        setEquivalence((value / 100) * planningCost) // Aplica el valor porcentual al costo de la planificación
      } else {
        setEquivalence(0)
      }
    } else {
      setEquivalence(0)
    }
  }, [valueP])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 ">
      <div className="bg-white w-full max-w-lg p-6 rounded-[20px] shadow-lg">
        <div className="flex justify-center items-center py-3">
          <h5 className="text-xl font-semibold">Añadir un nuevo Objetivo</h5>
        </div>
        <hr className="border-[1.5px] mb-4" />
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-4">
            <div className="">
              <label htmlFor="iniDate" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
                Fecha de inicio
                <span className="text-[#f60c2e] text-base font-normal">*</span>
              </label>
              <input
                type="date"
                id="iniDate"
                {...register('iniDate', { required: 'La fecha de inicio es obligatoria' })} // Asocia el campo a React Hook Form
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              {errors.iniDate && <p className="text-red-500 text-sm">{errors.iniDate.message}</p>}
            </div>
            <div className="col-2">
              <label htmlFor="finDate" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
                Fecha de fin
                <span className="text-[#f60c2e] text-base font-normal">*</span>
              </label>
              <input
                type="date"
                id="finDate"
                {...register('finDate', { required: 'La fecha de fin es obligatoria' })}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              {errors.finDate && <p className="text-red-500 text-sm">{errors.finDate.message}</p>}
            </div>
          </div>
          <div className="pt-4">
            <label htmlFor="objective" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
              Objetivo
              <span className="text-[#f60c2e] text-base font-normal">*</span>
            </label>
            <input
              type="text"
              id="objective"
              {...register('objective', { required: 'El objetivo es obligatorio' })}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="¿Cuál es el objetivo?"
            />
            {errors.objective && <p className="text-red-500 text-sm">{errors.objective.message}</p>}
          </div>
          <div className="pt-4">
            <div className="grid grid-cols-5 gap-4">
              <div className="col-span-3">
                <label htmlFor="valueP" className="block mb-1 text-base font-normal text-[#1c1c1c] dark:text-white">
                  Valor porcentual
                  <span className="text-[#f60c2e] text-base font-normal">*</span>
                </label>
                <input
                  type="text"
                  id="valueP"
                  {...register('valueP', {
                    required: 'El valor porcentual es obligatorio',
                    pattern: {
                      value: /^[0-9]+(\.[0-9]{1,2})?$/,
                      message: 'Por favor, ingresa un número válido',
                    },
                  })}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="¿Cuál es el valor del objetivo?"
                />
                {errors.valueP && <p className="text-red-500 text-sm">{errors.valueP.message}</p>}
              </div>
              <div className="text-center pt-4 col-span-2">
                <p className="text-lg font-semibold">Equivalencia:</p>
                <p className="text-gray-500">Bs. {equivalence}</p>
              </div>
            </div>
            {apiError && <p className="text-red-500 text-sm mt-4">{apiError}</p>}
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button onClick={onCloseHandler} className="button-secondary_outlined">
              Cancelar
            </button>
            <button type="submit" className="button-primary">
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NewObjectiveModal
