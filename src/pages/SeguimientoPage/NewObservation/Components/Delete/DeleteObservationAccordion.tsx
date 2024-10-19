// DeleteObservationAccordion.tsx
import { useState, useEffect } from 'react'
import Checkbox from '@mui/material/Checkbox'

interface Observation {
  identificador: number
  descripcion: string
  identificadorPlaniSegui: number
  identificadorActiv: number
}

interface DeleteObservationAccordionProps {
  selectedObjective: number | null
  selectedPlanilla: number | null
  onSelectObservation: (id: number) => void
  setAllObservations: (ids: number[]) => void
}

export const DeleteObservationAccordion = ({
  selectedObjective,
  selectedPlanilla,
  onSelectObservation,
  setAllObservations,
}: DeleteObservationAccordionProps) => {
  const [observations, setObservations] = useState<Observation[]>([])
  const [loading, setLoading] = useState<boolean>(false) // Estado de carga
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (selectedObjective && selectedPlanilla) {
      const fetchObservations = async () => {
        setLoading(true) // Iniciar carga
        setError(null) // Limpiar errores

        try {
          const response = await fetch(`https://cocoabackend.onrender.com/api/objetivos/${selectedObjective}/planillas-seguimiento`)

          if (!response.ok) {
            throw new Error('Error al obtener las observaciones')
          }

          const data = await response.json()

          if (data.length === 0) {
            setError('No se encuentran observaciones relacionadas con la búsqueda')
          } else {
            setObservations(data)
            setAllObservations(data.map((obs: Observation) => obs.identificador))
          }
        } catch (error) {
          setError('Error al cargar las observaciones')
        } finally {
          setLoading(false) // Terminar carga
        }
      }

      fetchObservations()
    }
  }, [selectedObjective, selectedPlanilla, setAllObservations])

  return (
    <div className="bg-white rounded-lg shadow-md w-full">
      {loading ? (
        <p className="text-gray-500 text-center py-4">Cargando observaciones...</p>
      ) : error ? (
        <p className="text-red-500 text-center py-4">{error}</p>
      ) : observations.length > 0 ? (
        observations.map((obs) => (
          <div key={obs.identificador} className="flex items-center border rounded-lg w-full p-2 mb-2">
            <textarea
              className="text-left mx-2 w-full resize-none border-none rounded-lg focus:outline-none bg-gray-100"
              value={obs.descripcion}
              readOnly
            />
            <input
              type="text"
              value={`Actividad ${obs.identificadorActiv}`}
              readOnly
              className="flex p-1 justify-end items-center gap-2 flex-[1_0_0] rounded-lg bg-gray-100"
            />
            <Checkbox onChange={() => onSelectObservation(obs.identificador)} />
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center py-4">No hay observaciones disponibles</p>
      )}
    </div>
  )
}
