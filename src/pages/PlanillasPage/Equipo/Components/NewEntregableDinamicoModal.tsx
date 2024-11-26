import React, { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import axios from 'axios'
import IconClose from '../../../../assets/icon-close.svg'
import * as Equipo from './../../../../interfaces/equipo.interface'

const NewEntregableDinamicoModal: React.FC<Equipo.NewEntregableModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  onShowSnackbar,
  initialData,
  fechas,
  objectiveId,
  objectiveName,
  planillaSeguiId,
}) => {
  const { handleSubmit, reset } = useForm<FormData>()
  const [criterios, setCriterios] = useState<string[]>(initialData?.criterio_aceptacion_entregable.map((c) => c.descripcion) || [''])
  const [nombre, setNombre] = useState(initialData?.nombre || '')
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({})
  const [generalError, setGeneralError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  // Manejar cambios en el nombre del entregable
  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGeneralError('')
    const newNombre = e.target.value.slice(0, 55)
    setNombre(newNombre)

    if (!newNombre.trim()) {
      setValidationErrors((prev) => {
        const { nombre, ...rest } = prev
        return rest
      })
      return
    }

    if (newNombre.trim().length < 5 || newNombre.trim().length > 50) {
      setValidationErrors((prev) => ({
        ...prev,
        nombre: 'El nombre del entregable debe tener entre 5 y 50 caracteres.',
      }))
    } else {
      setValidationErrors((prev) => {
        const { nombre, ...rest } = prev
        return rest
      })
    }
  }

  // Manejar cambios en los criterios
  const handleCriterioChange = (index: number, value: string) => {
    setGeneralError('')
    const newCriterios = [...criterios]
    newCriterios[index] = value.slice(0, 155)
    setCriterios(newCriterios)

    if (!value.trim()) {
      setValidationErrors((prev) => {
        const { [`criterio_${index}`]: _, ...rest } = prev
        return rest
      })
      return
    }

    if (value.trim().length < 10 || value.trim().length > 150) {
      setValidationErrors((prev) => ({
        ...prev,
        [`criterio_${index}`]: 'El criterio debe tener entre 10 y 150 caracteres.',
      }))
    } else {
      setValidationErrors((prev) => {
        const { [`criterio_${index}`]: _, ...rest } = prev
        return rest
      })
    }
  }

  // Eliminar un criterio
  const removeCriterio = (index: number) => {
    const updatedCriterios = [...criterios]
    updatedCriterios.splice(index, 1)
    setCriterios(updatedCriterios)

    // Limpiar el error correspondiente al índice eliminado
    const newValidationErrors = { ...validationErrors }
    delete newValidationErrors[`criterio_${index}`]
    setValidationErrors(newValidationErrors)
  }

  // Validar entradas antes de guardar
  const validateInputs = (): boolean => {
    const errors: { [key: string]: string } = {}
    if (nombre.trim().length < 5 || nombre.trim().length > 50) {
      errors['nombre'] = 'El nombre del entregable debe tener entre 5 y 50 caracteres.'
    }
    if (criterios.length === 0 || !criterios.some((criterio) => criterio.trim().length >= 10)) {
      errors['criterios'] = 'Debe agregar al menos un criterio válido y cumplir con las validaciones.'
    }

    criterios.forEach((criterio, index) => {
      if (criterio.trim().length < 10 || criterio.trim().length > 150) {
        errors[`criterio_${index}`] = 'El criterio debe tener entre 10 y 150 caracteres.'
      }
    })

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Verificar si el nombre está duplicado
  const checkNombreDuplicado = async (): Promise<boolean> => {
    try {
      // Verificar nombres dinámicos con fechas
      for (const fecha of fechas) {
        const response = await axios.get(
          `https://cocoabackend.onrender.com/api/entregables-dinamicos?identificadorObjet=${objectiveId}&fecha=${fecha}`
        )
        const entregablesDinamicos = response.data.data
        const existsDinamico = entregablesDinamicos.some(
          (e: { nombre: string }) => e.nombre.toLowerCase().trim() === nombre.toLowerCase().trim()
        )

        if (existsDinamico) {
          setGeneralError(`El nombre "${nombre}" ya está registrado para el objetivo y fecha seleccionados.`)
          return true
        }
      }

      // Verificar nombres estáticos
      const responseStatic = await axios.get('https://cocoabackend.onrender.com/api/entregables')
      const entregablesEstaticos = responseStatic.data
      const existsEstatico = entregablesEstaticos.some(
        (e: { nombre: string }) => e.nombre.toLowerCase().trim() === nombre.toLowerCase().trim()
      )

      if (existsEstatico) {
        setGeneralError(`El nombre "${nombre}" ya está registrado en los entregables existentes.`)
        return true
      }
    } catch (error) {
      console.error('Error al verificar duplicados:', error)
      setGeneralError('Error al verificar el nombre del entregable. Intente nuevamente.')
      return true
    }

    return false
  }

  // Guardar entregable
  const saveEntregable: SubmitHandler<FormData> = async () => {
    setGeneralError('')
    setValidationErrors({})
    setIsSaving(true)

    // Verificar duplicados (dinámicos y estáticos)
    if (await checkNombreDuplicado()) {
      setIsSaving(false)
      return
    }

    // Validar entradas
    if (!validateInputs()) {
      setGeneralError('Debe agregar al menos un criterio válido y cumplir con las validaciones.')
      setIsSaving(false)
      return
    }

    try {
      const updatedEntregable = {
        nombre,
        descripcion: '',
        criterios: criterios.map((desc, index) => ({
          identificador: initialData?.criterio_aceptacion_entregable[index]?.identificador || 0,
          descripcion: desc,
        })),
        identificadorObjet: initialData?.identificadorObjet || objectiveId,
        identificadorPlaniSegui: initialData?.identificadorPlaniSegui || planillaSeguiId,
      }

      const response = initialData
        ? await axios.put(`https://cocoabackend.onrender.com/api/entregables/update/${initialData.identificador}`, updatedEntregable)
        : await axios.post('https://cocoabackend.onrender.com/api/entregable', updatedEntregable)

      if (response.status === 200 || response.status === 201) {
        onCreate(response.data)
        onShowSnackbar(initialData ? 'Entregable actualizado exitosamente' : 'Entregable registrado exitosamente')
        onClose()
      }
    } catch (error) {
      console.error('Error al guardar el entregable:', error)
      setGeneralError('Error al guardar el entregable. Intente nuevamente.')
    } finally {
      setIsSaving(false)
      resetForm()
    }
  }

  // Resetear formulario
  const resetForm = () => {
    reset()
    setCriterios([''])
    setNombre('')
    setValidationErrors({})
    setGeneralError('')
  }

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white w-[575px] max-w-lg p-6 rounded-[20px] shadow-lg max-h-[85vh] min-w-[300px]">
          <h5 className="text-xl font-semibold text-center">
            {initialData ? 'Editar Entregable Dinamico' : 'Registrar Entregable Dinamico'}
          </h5>
          <hr className="border-[1.5px] my-2" />
          <p className="text-base font-semibold">Entregable para el Objetivo {objectiveName}</p>

          <h6 className="my-2 text-base flex">
            Entregable <p className="text-red-600">*</p>
          </h6>
          <input
            type="text"
            placeholder="Nombre del entregable"
            className="border text-gray-900 rounded-lg block w-full p-2.5 mb-2"
            value={nombre}
            onChange={handleNombreChange}
            disabled={isSaving}
          />
          {validationErrors['nombre'] && <p className="text-red-500 text-sm">{validationErrors['nombre']}</p>}

          <h6 className="text-base mb-2 flex">
            Criterios de aceptación para Entregable <p className="text-red-600">*</p>
          </h6>

          {/* Contenedor con scroll limitado solo para los inputs de criterios */}
          <div className="max-h-[40vh] overflow-y-auto">
            {criterios.map((criterio, index) => (
              <div key={index} className="mb-4 relative">
                <input
                  type="text"
                  value={criterio}
                  onChange={(e) => handleCriterioChange(index, e.target.value)}
                  placeholder="Criterio de aceptación"
                  className="border text-gray-900 rounded-lg block w-full p-2.5 pr-8"
                  disabled={isSaving}
                />
                <img
                  src={IconClose}
                  alt="Eliminar"
                  onClick={() => removeCriterio(index)}
                  className="w-6 h-6 absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                />
                {validationErrors[`criterio_${index}`] && <p className="text-red-500 text-sm">{validationErrors[`criterio_${index}`]}</p>}
              </div>
            ))}
          </div>

          <div className="flex justify-center items-center">
            <button onClick={() => setCriterios([...criterios, ''])} className="button-primary mb-4" disabled={isSaving}>
              + Nuevo Criterio
            </button>
          </div>

          {generalError && <p className="text-red-500 text-sm my-2">{generalError}</p>}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                resetForm()
                onClose()
              }}
              className="button-secondary_outlined"
              disabled={isSaving}
            >
              Cancelar
            </button>
            <button type="button" onClick={handleSubmit(saveEntregable)} className="button-primary" disabled={isSaving}>
              {initialData ? 'Guardar Cambios' : 'Registrar'}
            </button>
          </div>
        </div>
      </div>
    )
  )
}

export default NewEntregableDinamicoModal
