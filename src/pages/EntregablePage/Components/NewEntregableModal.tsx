import React, { useState, useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'

interface NewEntregableModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (newEntregable: Entregable[]) => void
}

interface Objetivo {
  identificador: number
  nombre: string
  fechaInici: string
  fechaFin: string
  valorPorce: string
  planillasGener: boolean
  identificadorPlani: number
}

interface Entregable {
  identificador?: number // Hacer que este campo sea opcional
  nombre: string
  descripcion: string
  identificadorObjet: number
}

interface TempEntregable {
  nombre: string
}

const NewEntregableModal: React.FC<NewEntregableModalProps> = ({ isOpen, onClose, onCreate }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{ objetivoId: number }>()

  const [objetivos, setObjetivos] = useState<Objetivo[]>([])
  const [entregables, setEntregables] = useState<TempEntregable[]>([])
  const [currentEntregable, setCurrentEntregable] = useState<string>('')
  const [selectedObjetivo, setSelectedObjetivo] = useState<number | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [inputObjetivoValue, setInputObjetivoValue] = useState<string>('')

  // Fetch objetivos cuando el modal se abre
  useEffect(() => {
    const fetchObjetivos = async () => {
      try {
        const response = await fetch('https://cocoabackend.onrender.com/api/objetivos')
        if (!response.ok) {
          throw new Error('Error al cargar los objetivos')
        }
        const data = await response.json()
        setObjetivos(data)
      } catch (error) {
        console.error('Error fetching objetivos:', error)
        setApiError('Error al cargar los objetivos. Por favor, intente de nuevo.')
      }
    }

    if (isOpen) {
      fetchObjetivos()
    }
  }, [isOpen])

  const handleAddEntregable = () => {
    if (currentEntregable.trim()) {
      if (currentEntregable.length > 50) {
        setValidationError('El nombre del entregable no puede exceder los 50 caracteres')
        return
      }
      setValidationError(null) // Limpiar cualquier error previo
      const newEntregable: TempEntregable = {
        nombre: currentEntregable,
      }
      setEntregables([...entregables, newEntregable])
      setCurrentEntregable('') // Limpiar el input
    }
  }
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    // Limitar el input a 50 caracteres, pero permitir que muestre el mensaje de error
    setCurrentEntregable(value)

    if (value.length > 50) {
      setValidationError('El nombre del entregable no puede exceder los 50 caracteres')
    } else {
      setValidationError(null) // Limpiar cualquier error previo si está dentro del límite
    }
  }

  // Filtrado de objetivos mientras se escribe
  const [filteredObjetivos, setFilteredObjetivos] = useState<Objetivo[]>([])

  const handleObjetivoInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputObjetivoValue(value) // Actualizamos el estado con el valor del input

    // Filtrar objetivos en base al valor escrito
    const filtered = objetivos.filter((objetivo) => objetivo.nombre.toLowerCase().includes(value.toLowerCase()))
    setFilteredObjetivos(filtered)
  }

  const handleObjetivoSelect = (id: number, nombre: string) => {
    setSelectedObjetivo(id) // Guardar el id del objetivo seleccionado
    setInputObjetivoValue(nombre) // Autocompletar el input con el nombre del objetivo
    setFilteredObjetivos([]) // Limpiar las sugerencias después de seleccionar
  }

  const onSubmit: SubmitHandler<{ objetivoId: number }> = async (data) => {
    setApiError(null)

    if (!entregables.length) {
      setApiError('Debe añadir al menos un entregable')
      return
    }

    if (!selectedObjetivo) {
      setApiError('Debe seleccionar un objetivo')
      return
    }

    // Primero, obtener los entregables existentes del servidor
    try {
      const response = await fetch('https://cocoabackend.onrender.com/api/entregables')
      const existingEntregables: Entregable[] = await response.json()

      // Filtrar los entregables que pertenecen al objetivo seleccionado (mismo identificadorObjet)
      const entregablesDelObjetivo = existingEntregables.filter(
        (entregableExistente) => entregableExistente.identificadorObjet === selectedObjetivo
      )

      // Verificar si alguno de los entregables nuevos tiene un nombre duplicado dentro del mismo objetivo
      for (const nuevoEntregable of entregables) {
        const nombreDuplicado = entregablesDelObjetivo.some(
          (entregableExistente) => entregableExistente.nombre.toLowerCase() === nuevoEntregable.nombre.toLowerCase()
        )

        if (nombreDuplicado) {
          setApiError(`El entregable con nombre "${nuevoEntregable.nombre}" ya existe para este objetivo. Por favor, elige otro nombre.`)
          return // Detenemos el guardado si hay un nombre duplicado en el mismo objetivo
        }
      }

      // Si no hay duplicados, procedemos a enviar los entregables al servidor
      const newEntregables: Entregable[] = entregables.map((entregable) => ({
        identificadorObjet: selectedObjetivo!,
        nombre: entregable.nombre,
        descripcion: '', // Descripción vacía como indicaste
      }))

      for (const entregable of newEntregables) {
        const postResponse = await fetch('https://cocoabackend.onrender.com/api/objetivos/entregables', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(entregable),
        })

        if (!postResponse.ok) {
          throw new Error('Error en la respuesta del servidor')
        }
      }

      // Crear una lista con identificadores temporales para el cliente
      const createdEntregables: Entregable[] = newEntregables.map((entregable, index) => ({
        identificador: Date.now() + index, // Identificador temporal
        identificadorObjet: entregable.identificadorObjet,
        nombre: entregable.nombre,
        descripcion: entregable.descripcion,
      }))

      onCreate(createdEntregables)
      reset()
      setEntregables([]) // Limpiar los entregables
      onClose() // Cerrar el modal
    } catch (error) {
      setApiError('Error creando el entregable. Inténtelo de nuevo más tarde.')
      console.error('Error creando el entregable:', error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white w-[375px] max-w-lg p-6 rounded-[20px] shadow-lg">
        <h5 className="text-xl font-semibold text-center">Nuevo Entregable</h5>
        <hr className="border-[1.5px] mb-4 mt-4" />
        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="objetivo" className="block width mb-1 text-sm font-medium text-gray-900">
            Objetivo asociado <span className="text-[#f60c2e]">*</span>
          </label>
          <div className="flex mb-4">
            {/* Input para escribir y filtrar objetivos */}
            <input
              type="text"
              id="objetivo"
              placeholder="Seleccione un Objetivo"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-l-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
              value={inputObjetivoValue} // Vinculamos el estado al input
              onChange={handleObjetivoInputChange} // Actualizamos el estado al escribir
            />

            {/* Dropdown para seleccionar un objetivo */}
            <select
              id="objetivoDropdown"
              {...register('objetivoId', { required: 'Debe seleccionar un objetivo' })}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-r-lg focus:ring-blue-500 focus:border-blue-500 w-4 p-2.5"
              value={selectedObjetivo ?? ''} // Aseguramos que el valor seleccionado se mantenga
              onChange={(e) => {
                const objetivoId = Number(e.target.value)
                const objetivoSeleccionado = objetivos.find((obj) => obj.identificador === objetivoId)

                if (objetivoSeleccionado) {
                  setSelectedObjetivo(objetivoId) // Guardar el id del objetivo
                  setInputObjetivoValue(objetivoSeleccionado.nombre) // Autocompletar el input
                }
              }}
            >
              <option value="">Seleccione un objetivo</option>
              {objetivos.map((objetivo) => (
                <option key={objetivo.identificador} value={objetivo.identificador}>
                  {objetivo.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Mostrar opciones filtradas */}
          {filteredObjetivos.length > 0 && (
            <ul className="bg-white border border-gray-300 rounded-lg max-h-40 overflow-y-auto">
              {filteredObjetivos.map((objetivo) => (
                <li
                  key={objetivo.identificador}
                  className="p-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleObjetivoSelect(objetivo.identificador, objetivo.nombre)} // Llamamos a la función pasando id y nombre
                >
                  {objetivo.nombre}
                </li>
              ))}
            </ul>
          )}

          {/* Mostrar error si no se selecciona un objetivo */}
          {errors.objetivoId && <p className="text-red-500 text-sm">{errors.objetivoId.message}</p>}

          {/* Mostramos los entregables añadidos como inputs de solo lectura */}
          <label htmlFor="nombre" className="block mb-1 text-sm font-medium text-gray-900">
            Entregables
          </label>
          {entregables.map((entregable, index) => (
            <div key={index} className="mb-2">
              <input
                type="text"
                value={entregable.nombre}
                readOnly
                className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
              />
            </div>
          ))}

          {/* Input para añadir nuevos entregables */}
          <input
            type="text"
            id="nombre"
            value={currentEntregable}
            onChange={handleInputChange}
            maxLength={50} // Limita el número de caracteres a 50
            className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-2 ${
              validationError ? 'border-red-500' : ''
            }`}
            placeholder="¿Cual es el entregable?"
          />

          {/* Mostrar error si excede los 50 caracteres */}
          {validationError && <p className="text-red-500 text-sm">{validationError}</p>}

          <div className="flex justify-center">
            <button type="button" onClick={handleAddEntregable} className="button-primary mb-4">
              +Añadir
            </button>
          </div>

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
