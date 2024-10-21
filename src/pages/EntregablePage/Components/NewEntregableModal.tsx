import React, { useState, useEffect, useCallback } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'

// Tipos
interface NewEntregableModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (newEntregable: Entregable[]) => void
}

interface Objetivo {
  identificador: number
  nombre: string
}

interface Entregable {
  identificador?: number
  nombre: string
  descripcion: string
  identificadorObjet: number
}

interface TempEntregable {
  nombre: string
}

interface FormData {
  objetivoId: number
}

// Componente principal
const NewEntregableModal: React.FC<NewEntregableModalProps> = ({ isOpen, onClose, onCreate }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<FormData>()
  const [objetivos, setObjetivos] = useState<Objetivo[]>([])
  const [filteredObjetivos, setFilteredObjetivos] = useState<Objetivo[]>([])
  const [entregables, setEntregables] = useState<TempEntregable[]>([{ nombre: '' }])
  const [inputObjetivoValue, setInputObjetivoValue] = useState<string>('')
  const [selectedObjetivo, setSelectedObjetivo] = useState<number | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)
  const [objetivoValidado, setObjetivoValidado] = useState<boolean>(false)
  const [entregableErrors, setEntregableErrors] = useState<string[]>([])

  useEffect(() => {
    if (isOpen) fetchObjetivos()
  }, [isOpen])

  const fetchObjetivos = useCallback(async () => {
    try {
      const response = await fetch('https://cocoabackend.onrender.com/api/objetivos')
      if (!response.ok) throw new Error('Error al cargar los objetivos')
      const data = await response.json()
      setObjetivos(data)
    } catch (error) {
      console.error('Error fetching objetivos:', error)
      setApiError('Error al cargar los objetivos. Por favor, intente de nuevo.')
    }
  }, [])

  const handleAddEntregable = () => setEntregables([...entregables, { nombre: '' }])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value
    setEntregables((prev) => prev.map((entregable, idx) => (idx === index ? { nombre: value } : entregable)))

    // Validación de tamaño de caracteres y gestión de errores
    const error = value.length < 5 || value.length > 50 ? 'El nombre debe tener entre 5 y 50 caracteres.' : ''
    setEntregableErrors((prevErrors) => prevErrors.map((errorMsg, idx) => (idx === index ? error : errorMsg)))
  }, [])

  const handleObjetivoInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setInputObjetivoValue(value)
      setObjetivoValidado(false)
      setSelectedObjetivo(null)
      setValue('objetivoId', 0) // Resetear el valor para evitar que el formulario dependa del select

      // Filtrar sugerencias basadas en el input
      if (value.trim()) {
        const filtered = objetivos.filter((obj) => obj.nombre.toLowerCase().includes(value.toLowerCase()))
        setFilteredObjetivos(filtered)
      } else {
        setFilteredObjetivos([])
      }
    },
    [objetivos, setValue]
  )

  const handleObjetivoSelect = (id: number, nombre: string) => {
    setSelectedObjetivo(id)
    setInputObjetivoValue(nombre)
    setObjetivoValidado(true)
    setFilteredObjetivos([])
    setValue('objetivoId', id) // Asignar manualmente el valor del objetivoId en el formulario
    setApiError(null) // Asegura que no se muestre un error innecesario
  }

  const validateObjetivo = () => {
    if (selectedObjetivo) {
      // Ya hay un objetivo seleccionado y validado, no hacer nada
      setApiError(null)
      return true
    }

    // Validar si el texto ingresado corresponde a un objetivo existente
    const objetivo = objetivos.find((obj) => obj.nombre.toLowerCase() === inputObjetivoValue.trim().toLowerCase())
    if (objetivo) {
      setSelectedObjetivo(objetivo.identificador)
      setObjetivoValidado(true)
      setValue('objetivoId', objetivo.identificador)
      setApiError(null)
      return true
    } else if (inputObjetivoValue.trim()) {
      setApiError('El objetivo ingresado no existe. Seleccione uno de la lista o escriba un objetivo válido.')
      return false
    } else {
      setApiError('Debe seleccionar un objetivo válido o escribir uno existente.')
      return false
    }
  }

  const resetModal = () => {
    reset()
    setEntregables([{ nombre: '' }])
    setInputObjetivoValue('')
    setApiError(null)
    setObjetivoValidado(false)
    setSelectedObjetivo(null)
    setEntregableErrors([])
  }

  const validateEntregables = () => {
    let isValid = true
    const newErrors = entregables.map((entregable) => {
      if (entregable.nombre.length < 5) {
        isValid = false
        return 'El nombre del entregable debe tener al menos 5 caracteres.'
      }
      if (entregable.nombre.length > 50) {
        isValid = false
        return 'El nombre del entregable no puede exceder los 50 caracteres.'
      }
      return ''
    })
    setEntregableErrors(newErrors)
    return isValid
  }

  const onSubmit: SubmitHandler<FormData> = async () => {
    // Validar si el objetivo ingresado es correcto solo al intentar guardar
    if (!validateObjetivo()) return

    // Validar los entregables antes de enviar
    if (!validateEntregables()) {
      setApiError('')
      return
    }

    const validEntregables = entregables.filter((e) => e.nombre.trim())

    if (!validEntregables.length) {
      setApiError('Debe añadir al menos un entregable.')
      return
    }

    try {
      const response = await fetch('https://cocoabackend.onrender.com/api/entregables')
      const existingEntregables: Entregable[] = await response.json()

      const entregablesDelObjetivo = existingEntregables.filter((e) => e.identificadorObjet === selectedObjetivo)

      const newEntregables: Entregable[] = validEntregables.map((e) => ({
        identificadorObjet: selectedObjetivo!,
        nombre: e.nombre,
        descripcion: '',
      }))

      const hasDuplicate = newEntregables.some((ne) =>
        entregablesDelObjetivo.some((e) => e.nombre.toLowerCase() === ne.nombre.toLowerCase())
      )

      if (hasDuplicate) {
        setApiError('Existe un entregable duplicado para este objetivo.')
        return
      }

      await Promise.all(
        newEntregables.map((e) =>
          fetch('https://cocoabackend.onrender.com/api/objetivos/entregables', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(e),
          })
        )
      )

      onCreate(newEntregables)
      resetModal()
      onClose()
    } catch (error) {
      console.error('Error creando el entregable:', error)
      setApiError('Error creando el entregable. Inténtelo de nuevo más tarde.')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white w-[375px] max-w-lg p-6 rounded-[20px] shadow-lg max-h-[85vh] overflow-y-auto">
        <h5 className="text-xl font-semibold text-center">Nuevo Entregable</h5>
        <hr className="border-[1.5px] mb-4 mt-4" />
        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="objetivo" className="block mb-1 text-sm font-medium text-gray-900">
            Objetivo asociado <span className="text-[#f60c2e]">*</span>
          </label>
          <div className="flex mb-4">
            <input
              type="text"
              id="objetivo"
              placeholder="Seleccione un Objetivo"
              className="bg-gray-50 border text-gray-900 rounded-l-lg focus:ring-blue-500 w-full p-2.5"
              value={inputObjetivoValue}
              onChange={handleObjetivoInputChange}
              autoComplete="off"
            />
            <select
              id="objetivoDropdown"
              className="bg-gray-50 border text-gray-900 rounded-r-lg focus:ring-blue-500 w-4 p-2.5"
              value={selectedObjetivo ?? ''}
              onChange={(e) => {
                const id = Number(e.target.value)
                const objetivo = objetivos.find((obj) => obj.identificador === id)
                if (objetivo) handleObjetivoSelect(id, objetivo.nombre)
              }}
            >
              <option value="">Seleccione un objetivo</option>
              {objetivos.map((obj) => (
                <option key={obj.identificador} value={obj.identificador}>
                  {obj.nombre}
                </option>
              ))}
            </select>
          </div>
          {filteredObjetivos.length > 0 && (
            <ul className="bg-white border border-gray-300 rounded-lg max-h-40 overflow-y-auto">
              {filteredObjetivos.map((objetivo) => (
                <li
                  key={objetivo.identificador}
                  className="p-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleObjetivoSelect(objetivo.identificador, objetivo.nombre)}
                >
                  {objetivo.nombre}
                </li>
              ))}
            </ul>
          )}
          {errors.objetivoId && <p className="text-red-500 text-sm">{errors.objetivoId.message}</p>}
          <label htmlFor="nombre" className="block mb-1 text-sm font-medium text-gray-900">
            Entregables
          </label>
          <div className="max-h-40 overflow-y-auto">
            {entregables.map((e, idx) => (
              <div key={idx} className="mb-2">
                <input
                  type="text"
                  value={e.nombre}
                  onChange={(ev) => handleInputChange(ev, idx)}
                  placeholder="¿Cual es el entregable?"
                  className="border text-gray-900 rounded-lg block w-full p-2.5"
                  maxLength={55}
                />
                {entregableErrors[idx] && <p className="text-red-500 text-sm">{entregableErrors[idx]}</p>}
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <button type="button" onClick={handleAddEntregable} className="button-primary mb-4">
              +
            </button>
          </div>
          {apiError && <p className="text-red-500 text-sm mt-4">{apiError}</p>}
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                resetModal()
                onClose()
              }}
              className="button-secondary_outlined"
            >
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
