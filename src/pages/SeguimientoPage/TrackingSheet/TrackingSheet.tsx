import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { AddObservation } from '../NewObservation/Components/NewObservationModal'
import { getWeeklyTrackers } from '../../../services/planillaSeguimiento.service'

interface Observacion {
  identificador: number
  descripcion: string
  fecha: string
  identificadorPlaniSegui: number
  identificadorActiv: number
}

interface WeeklyTracker {
  fecha: string
  identificador: number
  identificadorObjet: number
  observacion: Observacion[]
}

const formatDate = (dateString: string): string => {
  const [year, month, day] = dateString.split('-')
  return `${day}/${month}/${year}`
}

const TrackingSheet = () => {
  const { idObjetivo } = useParams()

  const [weeklyTrackers, setWeeklyTrackers] = useState<WeeklyTracker[]>([]) // Array tipado correctamente
  const [openWeek, setOpenWeek] = useState<number | null>(null) // Para controlar qué semana está expandida

  const toggleAccordion = (index: number) => {
    setOpenWeek(openWeek === index ? null : index) // Alterna entre expandir o colapsar
  }

  const fetchDataPlanillas = async () => {
    if (idObjetivo) {
      try {
        const response = await getWeeklyTrackers(idObjetivo)
        setWeeklyTrackers(response.data)
      } catch (error) {
        console.error('Error fetching weekly trackers:', error)
      }
    }
  }

  useEffect(() => {
    fetchDataPlanillas()
  }, [idObjetivo])

  return (
    <div className="mx-6">
      <h3 className="text-xl font-semibold pb-2">Objetivo {idObjetivo}</h3>
      {weeklyTrackers.map((week, index) => (
        <div key={week.identificador} className="mb-3">
          <div className="w-full h-[55px] px-5 py-2.5 bg-[#eef0ff] rounded-lg border-b-2 border-[#c6caff] justify-between items-center inline-flex">
            <div className="text-black text-lg font-semibold">
              Semana {index + 1}: {formatDate(week.fecha)} {/* Mostrar la fecha como string */}
            </div>
            <button className="w-[35px] h-[35px] relative" onClick={() => toggleAccordion(index)}>
              {openWeek === index ? <KeyboardArrowUpIcon /> : <ExpandMoreIcon />}
            </button>
          </div>
          {openWeek === index && (
            <div className="flex justify-center">
              <AddObservation />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default TrackingSheet
