import React, { useState, useEffect } from 'react'

interface NewPlanillaEvaluacionModalProps {
  isOpen: boolean
  onClose: () => void
  onPlanillasGenerated: () => void
}

interface Objetivo {
  identificador: number
  nombre: string
  fechaInici: string
  fechaFin: string
  valorPorce: string
  planillasGener: boolean
}

interface Entregable {
  identificador: number
  nombre: string
  descripcion: string
  identificadorObjet: number
}

const NewPlanillaEvaluacionModal: React.FC<NewPlanillaEvaluacionModalProps> = ({ isOpen, onClose, onPlanillasGenerated }) => {
  const [objetivos, setObjetivos] = useState<Objetivo[]>([])
  const [selectedObjetivo, setSelectedObjetivo] = useState<number | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)

  // Fetch objetivos sin planilla generada y con entregables
  useEffect(() => {
    const fetchObjetivosSinPlanillaConEntregables = async () => {
      try {
        // Obtener los objetivos sin planilla generada
        const response = await fetch('https://cocoabackend.onrender.com/api/objetivos-sin-planilla-evaluacion-generada')
        if (!response.ok) throw new Error('Error al cargar los objetivos')

        const objetivosData = await response.json()

        // Filtrar aquellos que tengan entregables disponibles
        const filteredObjetivos = await Promise.all(
          objetivosData.map(async (objetivo: Objetivo) => {
            const entregablesResponse = await fetch(`https://cocoabackend.onrender.com/api/objetivos/${objetivo.identificador}/entregables`)
            const entregables = await entregablesResponse.json()

            return entregables.length > 0 ? objetivo : null
          })
        )

        setObjetivos(filteredObjetivos.filter(Boolean) as Objetivo[])
      } catch (error) {
        console.error('Error fetching objetivos:', error)
        setApiError('No se pudieron cargar los objetivos.')
      }
    }

    if (isOpen) fetchObjetivosSinPlanillaConEntregables()
  }, [isOpen])

  const handleAccept = async () => {
    if (!selectedObjetivo) {
      setApiError('Debes seleccionar un objetivo.')
      return
    }

    const planillasData = [
      { identificadorObjet: selectedObjetivo, fecha: '2024-09-03', identificador: Date.now() },
      { identificadorObjet: selectedObjetivo, fecha: '2024-09-10', identificador: Date.now() + 1 },
      { identificadorObjet: selectedObjetivo, fecha: '2024-09-17', identificador: Date.now() + 2 },
    ]

    try {
      const response = await fetch(`https://cocoabackend.onrender.com/api/objetivos/${selectedObjetivo}/generar-planilla-evaluacion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(planillasData),
      })

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

        <label htmlFor="objetivo" className="block mb-1 text-sm font-medium text-gray-900">
          Objetivo <span className="text-[#f60c2e]">*</span>
        </label>
        <select
          id="objetivo"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 mb-4"
          value={selectedObjetivo ?? ''}
          onChange={(e) => setSelectedObjetivo(Number(e.target.value))}
        >
          <option value="">Selecciona un objetivo</option>
          {objetivos.map((objetivo) => (
            <option key={objetivo.identificador} value={objetivo.identificador}>
              {objetivo.nombre}
            </option>
          ))}
        </select>

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
