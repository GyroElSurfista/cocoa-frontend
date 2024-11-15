import React, { useState } from 'react'
import { formatDateToDMY } from '../../../utils/formatDate'
import { getWeeklyTrackers } from '../../../services/planillaSeguimiento.service'
import { Objective } from '../../ObjectivePage/Models/objective'

interface rowTracker {
  identificador: number
  fecha: string
  observacion: []
  identificadorObjet: number
}
interface ObjectiveTrackerProps {
  objective: Objective
  index: number
}

const ObjectiveTracker: React.FC<ObjectiveTrackerProps> = ({ objective, index }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [rowsTracker, setRowsTracker] = useState<Array<rowTracker>>()

  const toggleAccordion = async () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      try {
        const response = await getWeeklyTrackers(objective.identificador + '')
        setRowsTracker(response.data)
      } catch (error) {
        console.log('error in fetch weekly trackers', error)
      }
    }
  }

  return (
    <div className="bg-[rgb(224,227,255)] rounded px-3 mb-3">
      <div className="flex flex-row py-1 items-center border-b border-[#c6caff] w-full justify-between">
        <div className="w-auto pr-2 border-r border-[#c6caff]">
          <p className="text-center text-[#1c1c1c] text-lg font-semibold">Objetivo {index + 1}</p>
        </div>
        <div className="w-8/12 pl-2">{objective.objective} </div>
        <div className="w-auto inline-flex justify-center border-l border-[#c6caff]">
          <p className="flex items-center justify-end pl-3 pr-2">
            Fechas:
            <span className="bg-indigo-200 rounded-xl text-sm ml-1 p-1 font-normal">{formatDateToDMY(objective.iniDate)}</span> -
            <span className="bg-indigo-200 rounded-xl text-sm p-1 ml-1 font-normal">{formatDateToDMY(objective.finDate)}</span>
          </p>
        </div>
        <div className="justify-end pl-2 border-l border-[#c6caff]">
          <button className="py-4 pl-1 font-medium text-gray-800 focus:outline-none" onClick={toggleAccordion}>
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
          {rowsTracker?.map((row, index) => (
            <div key={index} className="h-10 px-5 py-2.5 my-2 bg-[#eef0ff] rounded-lg justify-between items-center flex">
              <div className="text-black text-lg font-semibold">Planilla # {index + 1}</div>
              <div className="text-black text-base font-normal">
                Día de seguimiento: <span className="text-[#5736cc] text-base font-bold">{formatDateToDMY(row.fecha)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ObjectiveTracker
