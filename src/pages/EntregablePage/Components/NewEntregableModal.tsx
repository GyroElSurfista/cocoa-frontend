import React, { useState, useEffect, useCallback } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import IconClose from '../../../assets/icon-close.svg'
import IconBack from '../../../assets/icon-back.svg'
import IconEdit from '../../../assets/icon-edit.svg'
import IconTrash from '../../../assets/trash.svg'

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
  criteriosAcept: { descripcion: string }[]
}

interface FormData {
  objetivoId: number
}

const NewEntregableModal: React.FC<NewEntregableModalProps> = ({ isOpen, onClose, onCreate }) => {
  const { register, handleSubmit, setValue, reset } = useForm<FormData>()
  const [view, setView] = useState<number>(1)
  const [objetivos, setObjetivos] = useState<Objetivo[]>([])
  const [entregables, setEntregables] = useState<Entregable[]>([])
  const [currentEntregable, setCurrentEntregable] = useState<Entregable>({
    nombre: '',
    descripcion: '',
    identificadorObjet: 0,
    criteriosAcept: [],
  })
  const [criterios, setCriterios] = useState<string[]>([])
  const [selectedObjetivo, setSelectedObjetivo] = useState<number | null>(null)
  const [selectedProyecto, setSelectedProyecto] = useState<string | null>(null) // Estado para el proyecto seleccionado
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [projectError, setProjectError] = useState<string | null>(null) // Estado para error en proyecto

  useEffect(() => {
    if (isOpen) fetchObjetivos()
  }, [isOpen])

  const fetchObjetivos = useCallback(async () => {
    try {
      const response = await fetch('https://cocoabackend.onrender.com/api/objetivos')
      const data = await response.json()
      setObjetivos(data)
    } catch (error) {
      console.error('Error fetching objetivos:', error)
    }
  }, [])

  const handleObjetivoSelect = (id: number) => {
    setSelectedObjetivo(id)
    setValue('objetivoId', id)
  }

  const addCriterio = () => setCriterios([...criterios, ''])
  const removeCriterio = (index: number) => setCriterios(criterios.filter((_, i) => i !== index))
  const updateCriterio = (index: number, value: string) => setCriterios(criterios.map((c, i) => (i === index ? value : c)))

  const saveEntregable = () => {
    const newEntregable = { ...currentEntregable, criteriosAcept: criterios.map((desc) => ({ descripcion: desc })) }

    if (editIndex !== null) {
      const updatedEntregables = [...entregables]
      updatedEntregables[editIndex] = newEntregable
      setEntregables(updatedEntregables)
      setEditIndex(null)
    } else {
      setEntregables([...entregables, newEntregable])
    }

    setCurrentEntregable({ nombre: '', descripcion: '', identificadorObjet: selectedObjetivo!, criteriosAcept: [] })
    setCriterios([])
    setView(2)
  }

  const handleEditEntregable = (index: number) => {
    const entregableToEdit = entregables[index]
    setCurrentEntregable(entregableToEdit)
    setCriterios(entregableToEdit.criteriosAcept.map((c) => c.descripcion))
    setEditIndex(index)
    setView(3)
  }

  const removeEntregable = (index: number) => setEntregables(entregables.filter((_, i) => i !== index))

  const resetForm = () => {
    setErrorMessage('')
    reset()
    setEntregables([])
    setCriterios([])
    setCurrentEntregable({ nombre: '', descripcion: '', identificadorObjet: 0, criteriosAcept: [] })
    setSelectedObjetivo(null)
    setSelectedProyecto(null)
    setView(1)
  }

  const handleCancel = () => {
    resetForm()
    onClose()
  }

  const onSubmit: SubmitHandler<FormData> = async () => {
    setErrorMessage(null)
    setProjectError(null)

    // Validar selección de proyecto
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
          identificadorObjet: selectedObjetivo!,
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
      <div className="bg-white w-[375px] max-w-lg p-6 rounded-[20px] shadow-lg max-h-[85vh] overflow-y-auto min-w-[300px]">
        {view === 1 && (
          <>
            <h5 className="text-xl font-semibold text-center">Registrar Entregable(s)</h5>
            <hr className="border-[1.5px] my-2" />
            <p className="text-sm my-2">Selecciona el proyecto y el objetivo asociado para el cual desear registrar los entregables.</p>
            <div className="my-2">
              <h2 className="pb-2 font-medium">Proyectos</h2>
              <select
                value={selectedProyecto ?? ''}
                onChange={(e) => setSelectedProyecto(e.target.value)}
                className="bg-gray-50 border text-gray-900 rounded-lg w-full p-2.5"
              >
                <option value="">Seleccione un proyecto</option>
                <option value="Cocoa">ID - Cocoa</option>
              </select>
              {projectError && <div className="text-red-500 text-sm">{projectError}</div>}
            </div>

            <h2 className="pb-2 font-medium">Objetivos</h2>

            <div className="flex mb-4">
              <select
                value={selectedObjetivo ?? ''}
                onChange={(e) => handleObjetivoSelect(Number(e.target.value))}
                className="bg-gray-50 border text-gray-900 rounded-lg w-full p-2.5"
              >
                <option value="">Seleccione un objetivo</option>
                {objetivos.map((obj) => (
                  <option key={obj.identificador} value={obj.identificador}>
                    {obj.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={handleCancel} className="button-secondary_outlined">
                Cancelar
              </button>
              <button type="button" onClick={() => setView(2)} className="button-primary" disabled={selectedObjetivo === null}>
                Siguiente
              </button>
            </div>
          </>
        )}

        {view === 3 && (
          <>
            <h5 className="text-xl font-semibold text-center">Registrar Entregable(s)</h5>
            <hr className="border-[1.5px] my-2" />
            <h5 className="text-base font-semibold">Entregables para el Objetivo {selectedObjetivo}</h5>
            <h6>Entregable</h6>
            <input
              type="text"
              placeholder="Nombre del entregable"
              className="border text-gray-900 rounded-lg block w-full p-2.5 mb-2"
              value={currentEntregable.nombre}
              onChange={(e) => setCurrentEntregable({ ...currentEntregable, nombre: e.target.value })}
            />
            <h6 className="text-base mb-2">Criterios de aceptación para Entregable *</h6>
            <div className="max-h-40 overflow-y-auto">
              {criterios.map((criterio, index) => (
                <div key={index} className="flex items-center mb-2 relative">
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
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  />
                </div>
              ))}
            </div>
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
            <h5 className="text-base my-2 font-semibold">Entregables para el Objetivo {selectedObjetivo}</h5>

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
                  setCurrentEntregable({ nombre: '', descripcion: '', identificadorObjet: selectedObjetivo!, criteriosAcept: [] })
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
