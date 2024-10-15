import React, { useState } from 'react'
import { formatDateToDMY } from '../../../utils/formatDate'

interface Objective {
  id: number
  nombre: string
  iniDate: string
  finDate: string
  objective: string
  valueP: string
  planillasGener: boolean
}

interface ObjectiveTrackerProps {
  objective: Objective
}

const ObjectiveTracker: React.FC<ObjectiveTrackerProps> = ({ objective }) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleAccordion = () => {
    setIsOpen(!isOpen)
  }
  return (
    <div className="bg-[rgb(224,227,255)] rounded px-3 mb-3">
      <div className="flex flex-row py-1 items-center border-b border-[#c6caff] w-full">
        <div className="w-auto pr-2 border-r border-[#c6caff]">
          <p className="text-center text-[#1c1c1c] text-lg font-semibold">Objetivo {objective.id}</p>
        </div>
        <div className="w-8/12 pl-2">{objective.nombre} </div>
        <div className="w-[90px]"></div>
        <div className="w-auto inline-flex justify-center border-l border-[#c6caff]">
          <p className="flex items-center justify-end pl-3">
            Fechas:
            <span className="bg-red-200 rounded-xl text-sm ml-1 p-1 text-gray-600 font-normal">{formatDateToDMY(objective.finDate)}</span> -
            <span className="bg-indigo-200 rounded-xl text-sm p-1 ml-1 text-gray-600 font-normal">
              {formatDateToDMY(objective.finDate)}
            </span>
          </p>
          <button className="py-4 pl-3 font-medium text-gray-800 focus:outline-none" onClick={toggleAccordion}>
            <svg
              className={`w-6 h-6 transform ${isOpen ? 'rotate-180' : 'rotate-0'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="py-4 px-20 text-gray-600">
          <div className="h-10 px-5 py-2.5 bg-[#eef0ff] rounded-lg justify-between items-center flex">
            <div className="text-black text-lg font-semibold">Planilla # 1</div>
            <div className="text-black text-base font-normal">Fecha: 02/09/24</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ObjectiveTracker
