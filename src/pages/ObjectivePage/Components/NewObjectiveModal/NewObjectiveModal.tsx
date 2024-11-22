import React, { useEffect, useState } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { SubmitHandler, useForm } from 'react-hook-form'
import ObjectiveStepper from '../ObjectiveStepper/ObjectiveStepper'
import { Autocomplete, TextField } from '@mui/material'
import { getPlannings } from '../../../../services/objective.service'
import { createObjective } from '../../../../services/objective.service'
import { Objective } from '../../Models/objective'
import dayjs from 'dayjs'
import { formatDateToDMY } from '../../../../utils/formatDate'

interface NewObjectiveModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (newObjective: Objective) => void
}

interface Planning {
  identificador: number
  nombre: string
  fechaInici: string
  fechaFin: string
  costo: number
  identificadorGrupoEmpre: number
  diaRevis: string
  siguienteFechaIniciDispo: string
  sumavalorporce: number
}
const steps = ['Seleccionar un proyecto', 'Datos del objetivo', 'Valor porcentual del objetivo']

const NewObjectiveModal: React.FC<NewObjectiveModalProps> = ({ isOpen, onClose, onCreate }) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    watch,
    reset,
    clearErrors,
  } = useForm<Objective>({})
  const [apiError, setApiError] = useState<string | null>(null) // State to hold API error
  const [equivalence, setEquivalence] = useState<number>(0)
  const [planningCost, setPlanningCost] = useState<number>(0)
  const [projects, setProjects] = useState<Array<Planning>>([])
  const [selectedProject, setSelectedProject] = useState<Planning | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>('') // State for the error message

  const valueP = watch('valueP') // Observa el valor porcentual

  const [activeStep, setActiveStep] = useState(0)

  const handleNext = handleSubmit((data) => {
    if (activeStep === steps.length - 1) {
      onSubmit(data) // Llama a onSubmit cuando se está en el último paso
    } else if (isStepValid(activeStep)) {
      setErrorMessage('') // Limpia el mensaje de error
      setActiveStep((prevStep) => prevStep + 1)
    } else {
      setErrorMessage('Por favor, selecciona un proyecto para continuar') // Establece el mensaje de error
    }
  })

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1)
    }
    setApiError(null)
  }

  const handleCancel = () => {
    setActiveStep(0)
    reset()
    onClose()
    setErrorMessage('')
    setSelectedProject(null)
  }

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <>
            <p className="pb-2">Selecciona la planificación para la cual deseas registrar el objetivo.</p>
            <div className="pb-2 font-medium">
              Proyecto <span className="text-red-500">*</span>
            </div>
            <Autocomplete
              options={projects}
              getOptionLabel={(option) => `ID: ${option.identificador} - ${option.nombre}`}
              onChange={(_, value) => {
                setSelectedProject(value)
                setPlanningCost(value?.costo || 0) // Establecer el costo del proyecto seleccionado
                setErrorMessage('')
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Selecciona un proyecto"
                  variant="outlined"
                  error={!!errors.identificador}
                  helperText={errors.identificador?.message}
                />
              )}
              value={selectedProject}
            />
          </>
        )
      case 1:
        return (
          <>
            <p className="font-semibold">
              Proyecto seleccionado: <span className="font-normal">{selectedProject?.nombre}</span>
            </p>
            <p className="font-semibold">
              Fecha de inicio y fin:{' '}
              <span className="font-normal">
                {formatDateToDMY(selectedProject?.fechaInici)} - {formatDateToDMY(selectedProject?.fechaFin)}
              </span>
            </p>
            <p className="pb-2 font-semibold">
              Dia de revision: <span className="font-normal">{selectedProject?.diaRevis}</span>
            </p>
            <p className="pb-2 font-semibold">
              Siguiente fecha disponible: <span className="font-normal">{selectedProject?.siguienteFechaIniciDispo}</span>
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="">
                <label htmlFor="iniDate" className="block mb-1 text-md font-medium text-gray-900 dark:text-white">
                  Fecha de inicio
                  <span className="text-[#f60c2e] text-base font-normal">*</span>
                </label>
                <input
                  type="date"
                  id="iniDate"
                  min={selectedProject?.siguienteFechaIniciDispo.toString().split('T')[0]}
                  {...register('iniDate', {
                    required: 'La fecha de inicio es obligatoria',
                    onChange: () => clearErrors('iniDate'),
                    validate: {
                      notPast: (value) => {
                        const today = new Date().toISOString().split('T')[0]
                        return value >= today || 'La fecha de inicio no puede ser anterior a la fecha actual'
                      },
                      afterNextAvailableDate: (value) => {
                        if (selectedProject) {
                          const siguienteFecha = new Date(selectedProject.siguienteFechaIniciDispo)
                          return (
                            value >= siguienteFecha.toISOString().split('T')[0] ||
                            `La fecha de inicio no puede ser anterior a la siguiente fecha disponible ${siguienteFecha.toLocaleDateString()}`
                          )
                        }
                      },
                      beforeEndDate: (value) => {
                        const endDate = watch('finDate')
                        return (
                          !endDate || new Date(value) <= new Date(endDate) || 'La fecha de inicio no puede ser posterior a la fecha de fin'
                        )
                      },
                      withinProjectRange: (value) => {
                        // Verificar si el proyecto está seleccionado
                        if (!selectedProject) {
                          return 'Debe seleccionar un proyecto primero.'
                        }

                        // Extraer las fechas de inicio y fin del proyecto
                        const projectStart = new Date(selectedProject.fechaInici).toISOString().split('T')[0]
                        const projectEnd = new Date(selectedProject.fechaFin).toISOString().split('T')[0]

                        // Validar si la fecha seleccionada está dentro del rango del proyecto
                        if (value < projectStart) {
                          return 'La fecha de inicio no puede ser anterior a la fecha de inicio del proyecto seleccionado'
                        }
                        if (value >= projectEnd) {
                          return 'La fecha de inicio no puede ser posterior o igual a la fecha de fin del proyecto seleccionado'
                        }

                        return true
                      },
                    },
                  })} // Asocia el campo a React Hook Form
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {errors.iniDate && <p className="text-red-500 text-sm">{errors.iniDate.message}</p>}
              </div>
              <div className="col-2">
                <label htmlFor="finDate" className="block mb-1 text-md font-medium text-gray-900 dark:text-white">
                  Fecha de fin
                  <span className="text-[#f60c2e] text-base font-normal">*</span>
                </label>
                <input
                  type="date"
                  id="finDate"
                  min={selectedProject?.siguienteFechaIniciDispo}
                  {...register('finDate', {
                    required: 'La fecha de fin es obligatoria',
                    onChange: () => clearErrors('finDate'),
                    validate: {
                      notPast: (value) => {
                        const today = new Date().toISOString().split('T')[0]
                        return value >= today || 'La fecha de fin no puede ser anterior a la fecha actual'
                      },
                      afterStartDate: (value) => {
                        const startDate = watch('iniDate')
                        return (
                          !startDate ||
                          new Date(value) > new Date(startDate) ||
                          'La fecha de fin no puede ser anterior o igual a la fecha de inicio'
                        )
                      },
                      withinProjectRangeEndDate: (value) => {
                        if (!selectedProject) {
                          return 'Debe seleccionar un proyecto primero.'
                        }

                        const projectStart = new Date(selectedProject.fechaInici).toISOString().split('T')[0]
                        const projectEnd = new Date(selectedProject.fechaFin).toISOString().split('T')[0]

                        if (value < projectStart) {
                          return 'La fecha de fin no puede ser anterior a la fecha de inicio del proyecto seleccionado'
                        }
                        if (value > projectEnd) {
                          return 'La fecha de fin no puede ser posterior a la fecha de fin del proyecto seleccionado'
                        }

                        return true
                      },
                      matchesReviewDay: (value) => {
                        if (selectedProject && selectedProject.diaRevis) {
                          // Parse the date string manually to avoid UTC offset issues
                          const [year, month, day] = value.split('-').map(Number) // assuming "YYYY-MM-DD" format
                          const selectedDate = new Date(year, month - 1, day) // month is 0-indexed in JavaScript Date

                          // Get the day of the week in Spanish
                          const selectedDayOfWeek = selectedDate.toLocaleDateString('es-ES', { weekday: 'long' }).toLowerCase()
                          console.log(selectedDayOfWeek)
                          const projectReviewDay = selectedProject.diaRevis.toLowerCase()

                          // Return true if the day matches, or an error message if it doesn't
                          return selectedDayOfWeek === projectReviewDay || `La fecha de finalización debe caer en un ${projectReviewDay}.`
                        }
                        return true
                      },
                    },
                  })}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {errors.finDate && <p className="text-red-500 text-sm">{errors.finDate.message}</p>}
              </div>
            </div>
            <div className="pt-4">
              <label htmlFor="objective" className="block mb-1 text-md font-medium text-gray-900 dark:text-white">
                Nombre del objetivo
                <span className="text-[#f60c2e] text-base font-normal">*</span>
              </label>
              <input
                type="text"
                id="objective"
                {...register('objective', {
                  required: 'El objetivo es obligatorio',
                  onChange: () => clearErrors('objective'),
                  validate: (value) => {
                    const trimmedValue = value.trim()
                    if (trimmedValue.length < 5) return 'Debe tener al menos 5 caracteres no vacíos'
                    if (trimmedValue.length > 50) return 'Debe tener como máximo 50 caracteres'
                    return true
                  },
                })}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="¿Cuál es el objetivo?"
              />
              {errors.objective && <p className="text-red-500 text-sm">{errors.objective.message}</p>}
            </div>
          </>
        )
      case 2:
        return (
          <>
            <div className="pt-4">
              <p className="pb-2">
                Agrega un valor porcentual a los entregables de este objetivo.
                {selectedProject && (
                  <span className="text-sm text-gray-500">(Porcentaje disponible: {100 - selectedProject?.sumavalorporce}%)</span>
                )}
              </p>
              <div className="grid grid-cols-5 gap-4">
                <div className="col-span-3">
                  <label htmlFor="valueP" className="block mb-1 text-base font-medium text-[#1c1c1c] dark:text-white">
                    Valor porcentual
                    <span className="text-[#f60c2e] text-base font-normal">*</span>
                  </label>
                  <input
                    type="text"
                    id="valueP"
                    {...register('valueP', {
                      required: 'El valor porcentual es obligatorio',
                      onChange: () => clearErrors('valueP'),
                      pattern: {
                        value: /^(100(\.00?)?|[0-9]{1,2}(\.[0-9]{1,2})?)$/, // Valida entre 0 y 100 con hasta dos decimales
                        message: 'Por favor, ingresa un número válido entre 0 y 100 con hasta dos decimales',
                      },
                      validate: {
                        validNumber: (value) => {
                          const numberValue = parseFloat(value)
                          return numberValue > 0 && numberValue <= 100 ? true : 'El valor debe ser mayor a 0 y menor o igual a 100'
                        },
                        lessThanTotal: (value) => {
                          if (selectedProject) {
                            const numberValue = parseFloat(value)
                            return numberValue <= 100 - selectedProject.sumavalorporce
                              ? true
                              : 'El valor porcentual ingresado es mayor al porcentaje disponible'
                          }
                          return true
                        },
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
              {apiError && <p className="text-red-500 text-sm">{apiError}</p>}
            </div>
          </>
        )
      default:
        return null
    }
  }

  const onSubmit: SubmitHandler<Objective> = async (data) => {
    try {
      // Verifica si selectedProject existe y tiene un identificador válido
      if (!selectedProject || !selectedProject.identificador) {
        setApiError('Debe seleccionar un proyecto antes de continuar.')
        return
      }
      console.log(data)
      const createdObjective = await createObjective({
        identificadorPlani: selectedProject.identificador,
        nombre: data.objective.trim(),
        fechaInici: data.iniDate,
        fechaFin: data.finDate,
        nombrePlani: data.nombrePlani,
        valorPorce: parseFloat(data.valueP),
      })
      console.log(createdObjective)

      // Clear any previous errors
      setApiError(null)

      // Se pasa el nuevo objetivo al componente padre
      onCreate(createdObjective.objetivo)

      // Reset form and close modal
      reset()
      onClose()
      setActiveStep(0)
      setSelectedProject(null)
    } catch (error: any) {
      // Set API error if the request fails
      console.log(error)
      const errorData = error.response?.data

      // Set general error message
      //setApiError('No se pudo crear el objetivo porque hay errores. Por favor, revisa los campos.')

      // Field-specific errors
      if (errorData?.errors) {
        // Map the backend errors to the respective fields
        if (errorData.errors.fechaInici) {
          setActiveStep(1)
          setError('iniDate', {
            type: 'manual',
            message: errorData.errors.fechaInici.join('. '), // Combine error messages for this field
          })
        }
        if (errorData.errors.fechaFin) {
          setActiveStep(1)
          setError('finDate', {
            type: 'manual',
            message: errorData.errors.fechaFin.join('. '),
          })
        }
        if (errorData.errors.nombre) {
          setActiveStep(1)
          setError('objective', {
            type: 'manual',
            message: errorData.errors.nombre.join('. '),
          })
        }
        if (errorData.errors.valorPorce) {
          setError('valueP', {
            type: 'manual',
            message: errorData.errors.valorPorce.join('. '),
          })
        }
      } else {
        // Mensaje de error general si no hay errores específicos
        setApiError(errorData?.message || 'Error creating the objective')
      }
    }
  }

  const fetchProjects = async () => {
    try {
      const response = await getPlannings()
      console.log(response.data)
      const currentDate = dayjs()

      // Filter projects that have not yet started and where siguienteFechaIniciDispo is not null
      const filteredProjects = response.data.filter((project: Planning) => {
        const startDate = dayjs(project.fechaInici)

        return currentDate.isBefore(startDate) && project.siguienteFechaIniciDispo !== null
      })
      console.log(filteredProjects)
      setProjects(filteredProjects)
    } catch (error) {
      console.error('Error fetching projects', error)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [selectedProject])

  useEffect(() => {
    if (valueP) {
      const value = parseFloat(valueP)

      // Verificar si el valor tiene más de 2 decimales
      const isTwoDecimalsOrLess = /^-?\d+(\.\d{1,2})?$/.test(valueP)

      if (!isNaN(value) && isTwoDecimalsOrLess) {
        if (value >= 0 && value <= 100) {
          const calculatedEquivalence = (value / 100) * planningCost
          setEquivalence(parseFloat(calculatedEquivalence.toFixed(2))) // Limita a 2 decimales
        } else {
          setEquivalence(0)
        }
      } else {
        setEquivalence(0)
      }
    } else {
      setEquivalence(0)
    }
  }, [valueP, planningCost])

  const isStepValid = (step: number) => {
    switch (step) {
      case 0:
        return selectedProject !== null
      case 1:
        return watch('iniDate') && watch('finDate') && watch('objective')
      case 2:
        return watch('valueP')
      default:
        return false
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 ">
      <div className="bg-white w-full max-w-lg p-6 rounded-[20px] shadow-lg">
        <div className="flex justify-center items-center py-3">
          <h5 className="text-xl font-semibold">Añadir un nuevo Objetivo</h5>
        </div>
        <hr className="border-[1.5px] mb-4" />
        <ObjectiveStepper activeStep={activeStep} renderStepContent={renderStepContent} />
        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
        <div className={`mt-6 flex justify-${activeStep !== 0 ? 'between' : 'end'} gap-2`}>
          {activeStep !== 0 && (
            <button
              onClick={handleBack}
              className="text-gray-600 hover:border-gray-200 hover:border-2 p-2 hover:rounded"
              disabled={activeStep === 0}
            >
              <ArrowBackIcon /> Atrás
            </button>
          )}

          <div className="">
            <button onClick={handleCancel} className="button-secondary_outlined mr-2">
              Cancelar
            </button>
            <button onClick={handleNext} className="button-primary">
              {activeStep === steps.length - 1 ? 'Guardar' : 'Siguiente'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewObjectiveModal
