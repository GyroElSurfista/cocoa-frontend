import React, { useState, useEffect } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import * as Evaluacion from './../../../../interfaces/evaluacion.interface'
import { getAllObjetivosEntregables, postGeneratePlanillas } from '../../../../services/planillaEvaGen.service'

const NewPlanillaEvaluacionModal: React.FC<Evaluacion.NewPlanillaEvaluacionModalProps> = ({
  isOpen,
  onClose,
  onPlanillasGenerated,
  identificadorPlani,
}) => {
  const [objetivos, setObjetivos] = useState<Evaluacion.Objetivo[]>([])
  const [selectedObjetivo, setSelectedObjetivo] = useState<Evaluacion.Objetivo | null>(null)
  const [inputValue, setInputValue] = useState<string>('') // Para capturar el valor de texto
  const [apiError, setApiError] = useState<string | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null) // Para el error de validación

  // Fetch objetivos sin planilla generada y relacionados con el identificadorPlani
  useEffect(() => {
    const fetchObjetivosRelacionados = async () => {
      console.log(identificadorPlani)
      try {
        const response = await getAllObjetivosEntregables()

        const objetivosData: Evaluacion.Objetivo[] = await response.data

        // Filtrar objetivos según identificadorPlani y planillaEvaluGener === false
        const filteredObjetivos = objetivosData.filter(
          (objetivo) => objetivo.identificadorPlani === identificadorPlani && !objetivo.planillaEvaluGener
        )

        setObjetivos(filteredObjetivos)
      } catch (error) {
        console.error('Error fetching objetivos:', error)
        setApiError('No se pudieron cargar los objetivos.')
      }
    }

    if (isOpen) fetchObjetivosRelacionados()
  }, [isOpen, identificadorPlani])

  const handleAccept = async () => {
    // Validación: verificar si el nombre ingresado en `inputValue` coincide con algún nombre en `objetivos`
    const matchedObjetivo = objetivos.find((objetivo) => objetivo.nombre.toLowerCase() === inputValue.toLowerCase())
    if (!matchedObjetivo) {
      setValidationError('Debe seleccionar un objetivo válido de la lista.')
      return
    }
    setSelectedObjetivo(matchedObjetivo)
    setValidationError(null) // Limpiar el error si hay coincidencia

    const planillasData = [
      { identificadorObjet: matchedObjetivo.identificador, fecha: '2024-09-03', identificador: Date.now() },
      { identificadorObjet: matchedObjetivo.identificador, fecha: '2024-09-10', identificador: Date.now() + 1 },
      { identificadorObjet: matchedObjetivo.identificador, fecha: '2024-09-17', identificador: Date.now() + 2 },
    ]

    try {
      const response = await postGeneratePlanillas(matchedObjetivo.identificador, planillasData)

      if (!response.ok) throw new Error('Error al generar las planillas.')

      onPlanillasGenerated()
      onClose()
    } catch (error) {
      console.error('Error generating planillas:', error)
      setApiError('No se pudieron generar las planillas. Inténtelo más tarde.')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white w-[375px] max-w-lg p-6 rounded-[20px] shadow-lg">
        <h5 className="text-xl font-semibold text-center">Generar planilla de evaluación</h5>
        <hr className="border-[1.5px] mb-4 mt-4" />
        <p className="font-inter font-normal mb-2 text-sm">Selecciona un objetivo con entregables para generar la planilla.</p>

        <label htmlFor="objetivo" className="block mb-3 text-sm font-medium text-gray-900">
          Objetivo <span className="text-[#f60c2e]">*</span>
        </label>

        <Autocomplete
          id="objetivo-autocomplete"
          options={objetivos}
          getOptionLabel={(option) => option.nombre}
          value={selectedObjetivo}
          onChange={(event, newValue) => setSelectedObjetivo(newValue)}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => setInputValue(newInputValue)} // Capturar el valor del input
          renderInput={(params) => (
            <TextField
              {...params}
              label="Selecciona un objetivo"
              variant="outlined"
              className="w-full mb-4"
              error={Boolean(validationError)}
              helperText={validationError}
            />
          )}
        />

        {apiError && <p className="text-red-500 text-sm">{apiError}</p>}

        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="button-secondary_outlined">
            Cancelar
          </button>
          <button type="button" onClick={handleAccept} className="button-primary">
            Aceptar
          </button>
        </div>
      </div>
    </div>
  )
}

export default NewPlanillaEvaluacionModal
