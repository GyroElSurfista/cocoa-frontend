import { Objective } from '../../Models/objective'
import './ObjectiveAccordion.css'

interface ObjectiveAccordionProps {
  objective: Objective
  indexObj: number
}

const formatDate = (dateString: string) => {
  const [year, month, day] = dateString.split('-')
  return `${day}/${month}/${year}`
}

const ObjectiveAccordion: React.FC<ObjectiveAccordionProps> = ({ objective }) => {
  return (
    <div className="bg-[#e0e3ff] rounded my-3">
      <div className="hover:bg-[#c6caff] w-full border rounded border-[#c6caff] p-4">
        <div className="flex flex-row w-full justify-between items-center">
          <div className="w-auto border-r-2 pr-6 border-[#c6caff]">
            <span className="text-center text-[#1c1c1c] text-lg font-semibold">Objetivo {objective.identificador}</span>
          </div>
          <div className="w-8/12 text-start">
            <p>{objective.objective}</p>
          </div>
          <div className="w-auto pl-3 pr-2 flex justify-items-end border-l-2 border-[#c6caff]">
            <p>
              Fechas:
              <span className="bg-red-200 rounded-xl text-sm ml-1 p-1 text-gray-600 font-normal">{formatDate(objective.iniDate)}</span> -
              <span className="bg-indigo-200 rounded-xl text-sm p-1 ml-1 text-gray-600 font-normal">{formatDate(objective.finDate)}</span>
            </p>
          </div>
          <div className="pl-2 border-l-2 border-[#c6caff]">
            <p className="uppercase font-bold">{objective.nombrePlani}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ObjectiveAccordion
