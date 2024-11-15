import React, { useState, useEffect, useCallback } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { useForm, SubmitHandler } from 'react-hook-form'
import IconClose from '../../../assets/icon-close.svg'
import IconBack from '../../../assets/icon-back.svg'
import IconEdit from '../../../assets/icon-edit.svg'
import IconTrash from '../../../assets/trash.svg'
import * as Entregables from './../../../interfaces/entregable.interface'
import { Entregable } from '../../../interfaces/entregable.interface'

interface NewEntregableModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (newEntregable: Entregables.Entregable[]) => void
}

export interface FormData {
  objetivoId: number
}

const NewEntregableModal: React.FC<NewEntregableModalProps> = ({ isOpen, onClose, onCreate }) => {
  const { register, handleSubmit, setValue, reset } = useForm<FormData>()
  const [view, setView] = useState<number>(1)
  const [objetivos, setObjetivos] = useState<Entregables.Objetivo[]>([])
  const [filteredObjetivos, setFilteredObjetivos] = useState<Entregables.Objetivo[]>([])
  const [proyectos, setProyectos] = useState<string[]>([])
  const [entregables, setEntregables] = useState<Entregable[]>([])
  const [currentEntregable, setCurrentEntregable] = useState<Entregable>({
    nombre: '',
    descripcion: '',
    identificadorObjet: 0,
    criteriosAcept: [],
  })
  const [criterios, setCriterios] = useState<string[]>([''])
  const [selectedObjetivo, setSelectedObjetivo] = useState<Entregables.Objetivo | null>(null)
  const [selectedProyecto, setSelectedProyecto] = useState<string | null>(null)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [projectError, setProjectError] = useState<string | null>(null) // <-- Agregado aquí
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string[] } | null>(null)
  const [lengthError, setLengthError] = useState('')
  const [generalError, setGeneralError] = useState('')

  useEffect(() => {
    if (isOpen) fetchObjetivos()
  }, [isOpen])

  const fetchObjetivos = useCallback(async () => {
    try {
      const response = await fetch('https://cocoabackend.onrender.com/api/objetivos')
      const data = await response.json()
      const proyectosUnicosSinIniciar: string[] = Array.from(
        new Set(data.filter((item: any) => item.nombrePlani.includes('(sin iniciar)')).map((item: any) => item.nombrePlani))
      )
      setObjetivos(data)
      setProyectos(proyectosUnicosSinIniciar)
    } catch (error) {
      console.error('Error fetching objetivos:', error)
    }
  }, [])

  const handleProyectoSelect = (_event: any, newProyecto: string | null) => {
    setSelectedProyecto(newProyecto)
    setSelectedObjetivo(null)
    setFilteredObjetivos(newProyecto ? objetivos.filter((obj) => obj.nombrePlani === newProyecto) : [])
  }

  const handleObjetivoSelect = (_event: React.SyntheticEvent, newObjetivo: Entregables.Objetivo | null) => {
    setSelectedObjetivo(newObjetivo)
    if (newObjetivo) setValue('objetivoId', newObjetivo.identificador)
  }

  const validateCriterios = (criteriosList: string[]) => {
    const validCriterios = criteriosList.filter((criterio) => {
      const trimmed = criterio.trim()
      return trimmed.length >= 10 && trimmed.length <= 50
    })

    if (validCriterios.length === 0) {
      setGeneralError('Debe agregar al menos un criterio válido')
      return false
    }

    return true
  }

  const addCriterio = () => setCriterios([...criterios, ''])

  {
    /*Aqui esta la seccion para verificacion de caracteres */
  }
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let trimmedValue = e.target.value
    if (trimmedValue.length > 55) {
      trimmedValue = trimmedValue.slice(0, 55)
    }

    setCurrentEntregable({ ...currentEntregable, nombre: trimmedValue })
    setErrorMessage('')

    if (!errorMessage) {
      if (trimmedValue.length === 0) {
        setLengthError('')
      } else if (trimmedValue.length < 5) {
        setLengthError('El nombre del entregable no puede tener menos de 5 caracteres')
      } else if (trimmedValue.length > 50) {
        setLengthError('El nombre del entregable no puede tener más de 50 caracteres')
      } else {
        setLengthError('')
      }
    } else {
      setLengthError('')
    }
  }

  const updateCriterio = (index: number, value: string) => {
    const updatedCriterios = [...criterios]
    updatedCriterios[index] = value.slice(0, 55) // Limit to 55 characters
    setCriterios(updatedCriterios)
    setGeneralError('')

    const newValidationErrors = { ...validationErrors }
    if (value.trim().length < 10) {
      newValidationErrors[`criteriosAcept.${index}.descripcion`] = ['El criterio debe tener al menos 10 caracteres']
    } else if (value.trim().length > 50) {
      newValidationErrors[`criteriosAcept.${index}.descripcion`] = ['El criterio no puede tener más de 50 caracteres']
    } else {
      delete newValidationErrors[`criteriosAcept.${index}.descripcion`]
    }
    setValidationErrors(newValidationErrors)
  }

  const saveEntregable = async () => {
    // Limpiar errores previos, manteniendo solo el mensaje de longitud
    setErrorMessage('')
    setLengthError('')
    setValidationErrors(null)
    setGeneralError('')

    // Validar nombre usando el endpoint para verificar duplicados
    if (selectedObjetivo) {
      try {
        const response = await fetch(`https://cocoabackend.onrender.com/api/objetivos/${selectedObjetivo.identificador}/entregables`)
        const existingEntregables = await response.json()
        const exists = existingEntregables.some((e: { nombre: string }) => e.nombre === currentEntregable.nombre.trim())

        if (exists) {
          setErrorMessage('El nombre del entregable ya está registrado para el objetivo seleccionado.')
          return
        }
      } catch (error) {
        console.error('Error al verificar duplicados:', error)
        setErrorMessage('Error al verificar el nombre del entregable. Intente nuevamente.')
        return
      }
    }

    // Validar nombre localmente
    const trimmedName = currentEntregable.nombre.trim()
    if (trimmedName.length < 5 || trimmedName.length > 50) {
      setErrorMessage('El nombre del entregable debe tener entre 5 y 50 caracteres.')
      return
    }

    const isLocalDuplicate = entregables.some((e, index) => {
      if (editIndex !== null && index === editIndex) return false
      return e.nombre === trimmedName
    })

    if (isLocalDuplicate) {
      setErrorMessage('El nombre del entregable ya está registrado localmente.')
      return
    }

    // Validar criterios
    if (!validateCriterios(criterios)) {
      setGeneralError('Todos los criterios deben ser válidos.')
      return
    }

    const newValidationErrors: { [key: string]: string[] } = {}
    let allCriteriosValid = true

    criterios.forEach((criterio, index) => {
      const trimmedValue = criterio.trim().slice(0, 55) // Limitar a 55 caracteres
      criterios[index] = trimmedValue // Actualizar el criterio con el valor truncado

      if (trimmedValue.length < 10) {
        newValidationErrors[`criteriosAcept.${index}.descripcion`] = ['El criterio debe tener al menos 10 caracteres']
        allCriteriosValid = false
      } else if (trimmedValue.length > 50) {
        newValidationErrors[`criteriosAcept.${index}.descripcion`] = ['El criterio no puede tener más de 50 caracteres']
        allCriteriosValid = false
      }
    })

    setValidationErrors(newValidationErrors)

    if (!allCriteriosValid) {
      setGeneralError('Debe agregar al menos un criterio válido.')
      return
    }

    // Crear nuevo entregable con criterios válidos
    const validCriterios = criterios.filter((c) => {
      const trimmed = c.trim()
      return trimmed.length >= 10 && trimmed.length <= 50
    })

    const newEntregable = {
      ...currentEntregable,
      nombre: trimmedName,
      criteriosAcept: validCriterios.map((desc) => ({ descripcion: desc.trim() })),
    }

    // Guardar o actualizar el entregable
    if (editIndex !== null) {
      const updatedEntregables = [...entregables]
      updatedEntregables[editIndex] = newEntregable
      setEntregables(updatedEntregables)
      setEditIndex(null)
    } else {
      setEntregables([...entregables, newEntregable])
    }

    resetEntregableForm()
    setView(2)
  }

  // Modificación de validateName para validar el nombre en modo edición
  const validateName = async (name: string, currentIndex: number | null): Promise<boolean> => {
    const trimmedName = name.trim()

    // Verificar si el nombre está duplicado en el estado actual de entregables
    const isDuplicate = entregables.some((e, index) => {
      if (currentIndex !== null && index === currentIndex) return false
      return e.nombre === trimmedName
    })

    if (isDuplicate) {
      setErrorMessage('Los nombres de los entregables no pueden ser iguales.')
      return false
    }

    // Validar longitud
    if (trimmedName.length < 5 || trimmedName.length > 50) {
      setErrorMessage('El nombre del entregable debe tener entre 5 y 50 caracteres.')
      return false
    }

    // Validar duplicado en API si hay objetivo seleccionado
    if (selectedObjetivo) {
      try {
        const response = await fetch(`https://cocoabackend.onrender.com/api/objetivos/${selectedObjetivo.identificador}/entregables`)
        const existingEntregables = await response.json()
        const exists = existingEntregables.some((e: { nombre: string }) => e.nombre === trimmedName)

        if (exists) {
          setErrorMessage('El nombre del entregable ya está registrado para el objetivo seleccionado.')
          return false
        }
      } catch (error) {
        console.error('Error al verificar duplicados:', error)
        setErrorMessage('Error al verificar el nombre del entregable. Intente nuevamente.')
        return false
      }
    }

    setErrorMessage('')
    return true
  }

  const resetEntregableForm = () => {
    setCurrentEntregable({
      nombre: '',
      descripcion: '',
      identificadorObjet: selectedObjetivo?.identificador || 0,
      criteriosAcept: [],
    })
    setCriterios([''])
    setValidationErrors({})
    setErrorMessage('')
    setLengthError('')
    setGeneralError('')
  }

  const removeCriterio = (index) => {
    const updatedCriterios = [...criterios]
    updatedCriterios.splice(index, 1)
    setCriterios(updatedCriterios)

    // Limpiar el error correspondiente al índice eliminado
    const newValidationErrors = { ...validationErrors }
    delete newValidationErrors[`criteriosAcept.${index}.descripcion`]
    setValidationErrors(newValidationErrors)
  }

  const handleEditEntregable = (index: number) => {
    const entregableToEdit = entregables[index]
    setCurrentEntregable(entregableToEdit)
    setCriterios(entregableToEdit.criteriosAcept.map((c) => c.descripcion))
    setEditIndex(index)
    setView(3)
    setValidationErrors(null)
  }
  const removeEntregable = (index: number) => setEntregables(entregables.filter((_, i) => i !== index))
  const handleCancel = () => {
    resetForm()
    onClose()
  }

  const resetForm = () => {
    setErrorMessage('')
    reset()
    setEntregables([])
    setCriterios([])
    setCurrentEntregable({
      nombre: '',
      descripcion: '',
      identificadorObjet: selectedObjetivo?.identificador || 0,
      criteriosAcept: [],
    })
    setSelectedObjetivo(null)
    setSelectedProyecto(null)
    setView(1)
    setValidationErrors(null) // Limpiar errores al reiniciar
  }
  const onSubmit: SubmitHandler<FormData> = async () => {
    setErrorMessage(null)
    setProjectError(null)
    setValidationErrors(null)
    if (!selectedProyecto) {
      setProjectError('Debe seleccionar un proyecto.')
      return
    }
    try {
      if (entregables.length === 0 || entregables.some((e) => e.criteriosAcept.length === 0)) {
        alert('Debe haber al menos un entregable con criterios de aceptación.')
        return
      }

      for (const e of entregables) {
        const payload = {
          identificadorObjet: selectedObjetivo?.identificador || 0,
          nombre: e.nombre,
          descripcion: '',
          criteriosAcept: e.criteriosAcept,
        }

        const response = await fetch('https://cocoabackend.onrender.com/api/objetivos/entregables', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (response.status !== 201) {
          const responseBody = await response.json()
          setErrorMessage(responseBody.message || 'Error al crear el entregable.')
          setValidationErrors(responseBody.errors || null)
          return
        }
      }
      onCreate(entregables)
      resetForm()
      onClose()
    } catch (error) {
      console.error('Error creando el entregable:', error)
      setErrorMessage('Error desconocido al crear el entregable.')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white w-[475px] max-w-lg p-6 rounded-[20px] shadow-lg max-h-[85vh] overflow-y-auto min-w-[300px] ">
        {view === 1 && (
          <>
            <h5 className="text-xl font-semibold text-center">Registrar Entregable(s)</h5>
            <hr className="border-[1.5px] my-2" />
            <p className="text-sm my-2">Selecciona el proyecto y el objetivo asociado para el cual deseas registrar los entregables.</p>

            <h2 className="pb-2 font-medium">Proyectos</h2>
            <Autocomplete
              id="proyecto-autocomplete"
              options={proyectos}
              value={selectedProyecto}
              onChange={handleProyectoSelect}
              renderInput={(params) => <TextField {...params} label="Selecciona un proyecto" variant="outlined" />}
              className="mb-4"
            />
            {projectError && <div className="text-red-500 text-sm">{projectError}</div>}

            <h2 className="pb-2 font-medium">Objetivos</h2>
            <Autocomplete
              id="objetivo-autocomplete"
              options={filteredObjetivos}
              getOptionLabel={(option) => option.nombre}
              value={selectedObjetivo}
              onChange={handleObjetivoSelect}
              renderInput={(params) => <TextField {...params} label="Selecciona un objetivo" variant="outlined" />}
              disabled={!selectedProyecto}
              className="mb-4"
            />
            {validationErrors?.['identificadorObjet'] && (
              <div className="text-red-500 text-sm">{validationErrors['identificadorObjet'].join(', ')}</div>
            )}

            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={handleCancel} className="button-secondary_outlined">
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  setView(2)
                }}
                className="button-primary"
                disabled={!selectedObjetivo}
              >
                Siguiente
              </button>
            </div>
          </>
        )}

        {view === 3 && (
          <>
            <h5 className="text-xl font-semibold text-center">Registrar Entregable(s)</h5>
            <hr className="border-[1.5px] my-2" />
            <h5 className="text-base font-semibold">Entregables para {selectedObjetivo ? selectedObjetivo.nombre : 'No seleccionado'}</h5>
            <h6 className="flex my-2">
              Entregable <p className="text-red-600">*</p>
            </h6>
            <input
              type="text"
              placeholder="Nombre del entregable"
              className="border text-gray-900 rounded-lg block w-full p-2.5 mb-2"
              value={currentEntregable.nombre}
              onChange={handleNameChange}
            />
            {lengthError && <p className="text-red-500 text-sm">{lengthError}</p>}
            {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
            {validationErrors?.['nombre'] && <div className="text-red-500 text-sm">{validationErrors['nombre'].join(', ')}</div>}

            <h6 className="text-base mb-2 flex">
              Criterios de aceptación para Entregable <p className="text-red-600">*</p>
            </h6>
            <div className="max-h-40 overflow-y-auto">
              {criterios.map((criterio, index) => (
                <div className="mb-4" key={index}>
                  <div className="flex items-center relative">
                    <input
                      type="text"
                      placeholder="Criterio de aceptación"
                      value={criterio}
                      onChange={(e) => updateCriterio(index, e.target.value)}
                      className="border text-gray-900 rounded-lg block w-full p-2.5 pr-8"
                    />
                    <img
                      src={IconClose}
                      alt="Close"
                      onClick={() => removeCriterio(index)}
                      className="w-6 h-6 absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    />
                  </div>
                  {/* Mostrar error específico para cada input de criterio */}
                  {validationErrors?.[`criteriosAcept.${index}.descripcion`] && (
                    <div className="text-red-500 text-sm mt-1">{validationErrors[`criteriosAcept.${index}.descripcion`].join(', ')}</div>
                  )}
                </div>
              ))}
            </div>

            {/* Mostrar error general si no hay criterios válidos */}
            {generalError && <div className="text-red-500 text-sm mt-2">{generalError}</div>}

            <div className="flex justify-center">
              <button type="button" onClick={addCriterio} className="button-primary mb-4">
                + Nuevo Criterio
              </button>
            </div>
            <hr className="border-[1.5px] my-2" />
            <div className="flex justify-between">
              <div onClick={() => setView(1)} className="flex items-center cursor-pointer">
                <img src={IconBack} alt="Back" className="mr-2" /> Atrás
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={handleCancel} className="button-secondary_outlined">
                  Cancelar
                </button>
                <button type="button" onClick={saveEntregable} className="button-primary">
                  Siguiente
                </button>
              </div>
            </div>
          </>
        )}

        {view === 2 && (
          <>
            <h5 className="text-xl font-semibold text-center">Registrar Entregable(s)</h5>
            <hr className="border-[1.5px] my-2" />
            <h5 className="text-base my-2 font-semibold">
              Entregables para {selectedObjetivo ? selectedObjetivo.nombre : 'No seleccionado'}
            </h5>

            {entregables.map((e, index) => (
              <div key={index} className="flex items-center mb-2 relative">
                <input
                  type="text"
                  value={`${e.nombre} - ${e.criteriosAcept.length} Criterios`}
                  readOnly
                  className="border text-gray-900 rounded-lg block w-full p-2.5"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                  <img src={IconEdit} alt="Edit" className="cursor-pointer" onClick={() => handleEditEntregable(index)} />
                  <img src={IconTrash} alt="Delete" onClick={() => removeEntregable(index)} className="cursor-pointer" />
                </div>
              </div>
            ))}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => {
                  setCurrentEntregable({
                    nombre: '',
                    descripcion: '',
                    identificadorObjet: selectedObjetivo ? selectedObjetivo.identificador : 0,
                    criteriosAcept: [],
                  })
                  setView(3)
                }}
                className="button-primary mb-4"
              >
                + Nuevo Entregable
              </button>
            </div>
            <hr className="border-[1.5px] my-2" />
            {errorMessage && <div className="text-red-500 text-sm text-center mb-2">{errorMessage}</div>}
            <div className="flex justify-end gap-2">
              <button type="button" onClick={handleCancel} className="button-secondary_outlined">
                Cancelar
              </button>
              <button type="submit" onClick={handleSubmit(onSubmit)} className="button-primary">
                Registrar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default NewEntregableModal
