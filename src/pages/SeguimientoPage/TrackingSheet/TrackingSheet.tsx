import { useState } from 'react'
import { useParams } from 'react-router-dom'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { AddObservation } from '../NewObservation/AddObservation'

const TrackingSheet = () => {
  const { idObjetivo } = useParams()

  const [isOpen, setIsOpen] = useState(false)

  const toggleAccordion = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="mx-6">
      <h3 className="text-xl font-semibold pb-2">Objetivo {idObjetivo}</h3>
      <div className="w-full h-[55px] px-5 py-2.5 bg-[#eef0ff] rounded-lg border-b-2 border-[#c6caff] justify-between items-center inline-flex">
        <div className="text-black text-lg font-semibold">Semana 1: 02/09/24</div>
        <button className="w-[35px] h-[35px] relative" onClick={toggleAccordion}>
          {isOpen ? <KeyboardArrowUpIcon /> : <ExpandMoreIcon />}
        </button>
      </div>
      {isOpen && (
        <div className="flex justify-center">
          <AddObservation />
        </div>
      )}
    </div>
  )
}

export default TrackingSheet
