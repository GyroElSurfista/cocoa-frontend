import { Autocomplete, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { getObjectives } from '../../../services/objective.service'
import { generateWeeklyTracking } from '../../../services/planillaSeguimiento.service'

interface Objective {
  identificador: number
  nombre: string
  iniDate: string
  finDate: string
  objective: string
  valueP: string
  planillasGener: boolean
  nombrePlani: string
}

interface GenerateTrackerModalProps {
  isOpen: boolean
  onClose: () => void
  onGenerate: () => void
}

const GenerateTrackerModal: React.FC<GenerateTrackerModalProps> = ({ isOpen, onClose, onGenerate }) => {
  const [objectives, setObjectives] = useState<Array<Objective>>([])
  const [selectedObjective, setSelectedObjective] = useState<Objective | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCancel = () => {
    setSelectedObjective(null)
    onClose()
  }

  const handleGenerate = async () => {
    if (!selectedObjective) {
      setError('Por favor, selecciona un objetivo.')
      return
    }

    try {
      const response = await generateWeeklyTracking(selectedObjective.identificador)
      console.log(response)
      onGenerate()
      setSelectedObjective(null)
      fetchObjectives()
      onClose()
    } catch (error) {
      console.error('Error generating tracking sheet:', error)
      setError('Ocurrió un error al generar la planilla de seguimiento. Inténtalo de nuevo.')
    }
  }

  const fetchObjectives = async () => {
    try {
      const response = await getObjectives()
      console.log(response.data)
      const filteredObjectives = response.data.filter((obj: Objective) => !obj.planillasGener)
      setObjectives(filteredObjectives)
    } catch (error) {
      console.error('Error fetching objectives:', error)
      setError('Ocurrió un error al cargar los objetivos.')
    }
  }

  useEffect(() => {
    fetchObjectives()
  }, [])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-lg p-6 rounded-[20px] shadow-lg">
        <div className="flex justify-center items-center py-3">
          <h5 className="text-xl font-semibold">Generar Planillas de Seguimiento</h5>
        </div>
        <hr className="border-[1.5px] mb-4" />
        <p className="pb-3">Selecciona el objetivo para el cual deseas generar las planillas de seguimiento.</p>
        <div className="pb-2 font-medium">
          Objetivo <span className="text-red-500">*</span>
        </div>
        <Autocomplete
          options={objectives}
          getOptionLabel={(option) => `${option.nombre} - ${option.nombrePlani}`}
          value={selectedObjective}
          onChange={(event, newValue) => {
            setSelectedObjective(newValue)
            setError(null) // Clear error when a valid selection is made
          }}
          renderInput={(params) => <TextField {...params} label="Selecciona un objetivo" variant="outlined" />}
        />
        {error && <p className="text-red-500 text-sm pt-2">{error}</p>}
        <div className="flex justify-end pt-4">
          <button onClick={handleCancel} className="button-secondary_outlined mr-2">
            Cancelar
          </button>
          <button onClick={handleGenerate} className="button-primary">
            Aceptar
          </button>
        </div>
      </div>
    </div>
  )
}

export default GenerateTrackerModal
