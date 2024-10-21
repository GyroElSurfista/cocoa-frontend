import { useState, useEffect } from 'react'
import Checkbox from '@mui/material/Checkbox'

interface Observation {
  identificador: number
  descripcion: string
  identificadorPlaniSegui: number
  identificadorActiv: number
  identificadorObjet: number
}

interface DeleteObservationAccordionProps {
  selectedObjective: number | null
  selectedPlanilla: number | null
  onSelectObservation: (id: number) => void
  selectedObservations: number[]
  setAllObservations: (ids: number[]) => void
}

export const DeleteObservationAccordion = ({
  selectedObjective,
  selectedPlanilla,
  onSelectObservation,
  selectedObservations,
  setAllObservations,
}: DeleteObservationAccordionProps) => {
  const [observations, setObservations] = useState<Observation[]>([])
  const [filteredObservations, setFilteredObservations] = useState<Observation[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAllObservations = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch('https://cocoabackend.onrender.com/api/objetivos')
        if (!response.ok) throw new Error('Error al obtener los objetivos')

        const objectives = await response.json()

        const allObservationsPromises = objectives.map(async (objective: any) => {
          const response = await fetch(`https://cocoabackend.onrender.com/api/objetivos/${objective.identificador}/planillas-seguimiento`)
          if (!response.ok) throw new Error('Error al obtener observaciones para un objetivo')

          const data = await response.json()
          return data.flatMap((plani: any) =>
            plani.observacion.map((obs: Observation) => ({
              ...obs,
              identificadorObjet: objective.identificador,
            }))
          )
        })

        const observationsArrays = await Promise.all(allObservationsPromises)
        const combinedObservations = observationsArrays.flat()

        setObservations(combinedObservations)
        setFilteredObservations(combinedObservations)
        setAllObservations(combinedObservations.map((obs) => obs.identificador))
      } catch (error) {
        setError('Error al cargar los datos')
      } finally {
        setLoading(false)
      }
    }

    fetchAllObservations()
  }, [setAllObservations])

  useEffect(() => {
    let filtered = observations

    if (selectedObjective) {
      filtered = filtered.filter((obs) => obs.identificadorObjet === selectedObjective)
    }

    if (selectedPlanilla) {
      filtered = filtered.filter((obs) => obs.identificadorPlaniSegui === selectedPlanilla)
    }

    setFilteredObservations(filtered)
  }, [selectedObjective, selectedPlanilla, observations])

  return (
    <div>
      {loading ? (
        <p className="text-gray-500 text-center py-4">Cargando observaciones...</p>
      ) : error ? (
        <p className="text-red-500 text-center py-4">{error}</p>
      ) : observations.length === 0 ? ( // Condición para "No existen observaciones disponibles"
        <p className="text-gray-500 text-center py-4">No existen observaciones disponibles</p>
      ) : filteredObservations.length === 0 ? ( // Condición para "No existen coincidencias"
        <p className="text-gray-500 text-center py-4">No existen coincidencias</p>
      ) : (
        filteredObservations.map((obs) => (
          <div
            key={obs.identificador}
            className="flex my-4 items-center gap-[20px] self-stretch rounded-[8px] border-[2px] border-[#FFC3CC] bg-white shadow-md w-full"
          >
            <textarea
              className="text-left mx-2 w-full resize-none border-none rounded-lg focus:outline-none"
              value={obs.descripcion}
              readOnly
            />
            <input
              type="text"
              value={`Actividad ${obs.identificadorActiv}`}
              readOnly
              className="flex justify-end items-center p-[3px] gap-[10px] flex-[1_0_0] rounded-[8px] bg-[#FFC3CC] text-center w-28"
            />
            <Checkbox
              checked={selectedObservations.includes(obs.identificador)} // Sincronizar con el estado global
              onChange={() => onSelectObservation(obs.identificador)}
            />
          </div>
        ))
      )}
    </div>
  )
}
