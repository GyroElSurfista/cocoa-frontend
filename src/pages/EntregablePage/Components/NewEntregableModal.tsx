import React, { useState, useEffect, useCallback, useRef } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { useForm, SubmitHandler } from 'react-hook-form'
import IconClose from '../../../assets/icon-close.svg'
import IconBack from '../../../assets/icon-back.svg'
import IconEdit from '../../../assets/icon-edit.svg'
import IconTrash from '../../../assets/trash.svg'
import * as Entregables from './../../../interfaces/entregable.interface'
import { getAllObjetivosEntregables, getEntregablesWithObjetive, postEntregables } from '../../../services/entregable.service'

const NewEntregableModal: React.FC<Entregables.NewEntregableModalProps> = ({ isOpen, onClose, onCreate, nombrePlani }) => {
  const { handleSubmit, setValue, reset } = useForm<Entregables.FormData>()
  const [view, setView] = useState<number>(1)
  const [filteredObjetivos, setFilteredObjetivos] = useState<Entregables.Objetivo[]>([])
  const [entregables, setEntregables] = useState<Entregables.Entregable[]>([])
  const [currentEntregable, setCurrentEntregable] = useState<Entregables.Entregable>({
    nombre: '',
    descripcion: '',
    identificadorObjet: 0,
    criteriosAcept: [],
    criterio_aceptacion_entregable: [],
  })

  const [criterios, setCriterios] = useState<string[]>([''])
  const [selectedObjetivo, setSelectedObjetivo] = useState<Entregables.Objetivo | null>(null)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string[] } | null>(null)
  const [lengthError, setLengthError] = useState('')
  const [generalError, setGeneralError] = useState('')

  const scrollRef = useRef(null)

  useEffect(() => {
    if (isOpen) fetchObjetivos()
  }, [isOpen])

  const fetchObjetivos = useCallback(async () => {
    try {
      const response = await getAllObjetivosEntregables()
      const data: Entregables.Objetivo[] = await response.data

      // Aquí filtras los objetivos por nombrePlani
      const filtered = data.filter((objetivo) => objetivo.nombrePlani === nombrePlani) // Cambia el nombre según necesites
      setFilteredObjetivos(filtered)
    } catch (error) {
      console.error('Error fetching objetivos:', error)
    }
  }, [])

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
    updatedCriterios[index] = value.slice(0, 55) // Limitar caracteres a 55
    setCriterios(updatedCriterios)

    // Validar duplicados al actualizar
    if (!validateDuplicates(updatedCriterios)) {
      setGeneralError('No se permiten criterios duplicados.')
    } else {
      setGeneralError('')
    }

    // Validar longitud de caracteres
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
    if (!validateDuplicates(criterios)) {
      setGeneralError('No se permiten criterios duplicados.')
      return
    }

    // Validar nombre usando el endpoint para verificar duplicados
    if (selectedObjetivo) {
      try {
        const response = await getEntregablesWithObjetive(selectedObjetivo.identificador)

        const existingEntregables = await response.data
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
    if (trimmedName.length === 0) {
      setErrorMessage('Debe llenar el campo Nombre del entregable')
      return
    }

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
      if (criterios.length === 0) {
        setGeneralError('Debe agregar al menos un criterio.')
      } else {
        setGeneralError('Todos los criterios deben ser llenados correctamente.')
      }

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

  const resetEntregableForm = () => {
    setCurrentEntregable({
      identificador: 0, // Valor inicial predeterminado
      nombre: '',
      descripcion: '',
      dinamico: false, // Valor predeterminado
      fechaCreac: new Date().toISOString(), // Fecha actual como valor inicial
      identificadorObjet: selectedObjetivo ? selectedObjetivo.identificador : 0,
      criteriosAcept: [], // Mantén esto si aún es necesario para compatibilidad
      criterio_aceptacion_entregable: [], // Array vacío como valor inicial
    })
    setCriterios([''])
    setValidationErrors({})
    setErrorMessage('')
    setLengthError('')
    setGeneralError('')
  }

  const removeCriterio = (index: number) => {
    const updatedCriterios = [...criterios]
    updatedCriterios.splice(index, 1)
    setCriterios(updatedCriterios)

    // Limpiar el error si no hay duplicados
    if (validateDuplicates(updatedCriterios)) {
      setGeneralError('')
    }

    // Limpiar errores específicos del criterio eliminado
    const newValidationErrors = { ...validationErrors }
    delete newValidationErrors[`criteriosAcept.${index}.descripcion`]
    setValidationErrors(newValidationErrors)
  }

  const handleEditEntregable = (index: number) => {
    const entregableToEdit = entregables[index]
    setCurrentEntregable(entregableToEdit)
    setCriterios(entregableToEdit.criteriosAcept.map((c: any) => c.descripcion))
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
      identificador: 0, // Valor inicial predeterminado
      nombre: '',
      descripcion: '',
      dinamico: false, // Valor predeterminado
      fechaCreac: new Date().toISOString(), // Fecha actual como valor inicial
      identificadorObjet: selectedObjetivo ? selectedObjetivo.identificador : 0,
      criteriosAcept: [], // Mantén esto si aún es necesario para compatibilidad
      criterio_aceptacion_entregable: [], // Array vacío como valor inicial
    })
    setSelectedObjetivo(null)
    setView(1)
    setValidationErrors(null) // Limpiar errores al reiniciar
  }
  const onSubmit: SubmitHandler<FormData> = async () => {
    setErrorMessage(null)
    setValidationErrors(null)
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

        try {
          const response = await postEntregables(payload)

          if (response.status !== 201) {
            setErrorMessage(response.data.message || 'Error al crear el entregable.')
            setValidationErrors(response.data.errors || null)
            return
          }
        } catch (error: any) {
          if (error.response) {
            setErrorMessage(error.response.data.message || 'Error al crear el entregable.')
            setValidationErrors(error.response.data.errors || null)
          } else {
            setErrorMessage('Error de red o del servidor.')
          }
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

  useEffect(() => {
    // Desplaza el scroll al final después de agregar un criterio
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [criterios])

  const validateDuplicates = (criteriosList: string[]) => {
    const uniqueCriterios = new Set(criteriosList.map((c) => c.trim()))
    return uniqueCriterios.size === criteriosList.length // Devuelve false si hay duplicados
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white w-[475px] max-w-lg p-6 rounded-[20px] shadow-lg max-h-[85vh] overflow-y-auto min-w-[300px] ">
        {view === 1 && (
          <>
            <h5 className="text-xl font-semibold text-center">Registrar Entregable(s)</h5>
            <hr className="border-[1.5px] my-2" />
            <p className="text-sm my-2">Selecciona el objetivo asociado para el cual deseas registrar los entregables.</p>

            <h2 className="pb-2 font-medium">Objetivo asociado</h2>
            <Autocomplete
              id="objetivo-autocomplete"
              options={filteredObjetivos}
              getOptionLabel={(option) => option.nombre}
              value={selectedObjetivo}
              onChange={handleObjetivoSelect}
              renderInput={(params) => <TextField {...params} label="Selecciona un objetivo" variant="outlined" />}
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
            <div ref={scrollRef} className="max-h-40 overflow-y-auto">
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
                  {validationErrors?.[`criteriosAcept.${index}.descripcion`] && (
                    <div className="text-red-500 text-sm my-1">{validationErrors[`criteriosAcept.${index}.descripcion`].join(', ')}</div>
                  )}
                </div>
              ))}
            </div>

            {generalError && <div className="text-red-500 text-sm my-2">{generalError}</div>}

            <div className="flex justify-center">
              <button type="button" onClick={addCriterio} className="button-primary mb-4">
                + Nuevo Criterio
              </button>
            </div>
            <hr className="border-[1.5px] my-2" />
            <div className="flex justify-between">
              <div
                onClick={() => {
                  setView(1)
                  setCriterios([''])
                }}
                className="flex items-center cursor-pointer"
              >
                <img src={IconBack} alt="Back" className="mr-2" /> Atrás
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={handleCancel} className="button-secondary_outlined">
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={saveEntregable}
                  className={`button-primary ${generalError ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!!generalError} // Deshabilitado si hay un error general
                >
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

            <div className="max-h-64 overflow-y-auto">
              {' '}
              {/* Contenedor con scroll */}
              {entregables.map((e, index) => (
                <div key={index} className="flex items-center mb-2 relative">
                  <input
                    type="text"
                    value={`${e.nombre} - ${e.criteriosAcept.length} ${e.criteriosAcept.length === 1 ? 'Criterio' : 'Criterios'}`}
                    readOnly
                    className="border text-gray-900 rounded-lg block w-full p-2.5 pr-16" // Añade pr-12 para espacio a la derecha
                  />

                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                    <img src={IconEdit} alt="Edit" className="cursor-pointer" onClick={() => handleEditEntregable(index)} />
                    <img src={IconTrash} alt="Delete" onClick={() => removeEntregable(index)} className="cursor-pointer" />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => {
                  setCurrentEntregable({
                    identificador: 0, // Valor inicial predeterminado
                    nombre: '',
                    descripcion: '',
                    dinamico: false, // Valor predeterminado
                    fechaCreac: new Date().toISOString(), // Fecha actual como valor inicial
                    identificadorObjet: selectedObjetivo ? selectedObjetivo.identificador : 0,
                    criteriosAcept: [], // Mantén esto si aún es necesario para compatibilidad
                    criterio_aceptacion_entregable: [], // Array vacío como valor inicial
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
