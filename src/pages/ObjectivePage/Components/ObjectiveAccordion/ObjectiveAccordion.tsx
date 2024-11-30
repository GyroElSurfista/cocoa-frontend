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

const ObjectiveAccordion: React.FC<ObjectiveAccordionProps> = ({ objective, indexObj }) => {
  return (
    <div className="bg-[#e0e3ff] rounded my-3">
      <div className="w-full border rounded border-[#c6caff] p-4">
        <div className="flex flex-row w-full justify-between items-center">
          <div className="w-24 border-r-2 border-[#c6caff]">
            <span className="text-center text-[#1c1c1c] text-sm font-bold">Objetivo {indexObj}</span>
          </div>
          <div className="w-6/12 pl-2 text-start">
            <p>{objective.objective}</p>
          </div>
          <div className="w-3/12 pl-3 border-l-2 border-[#c6caff]">
            <p>
              Fechas:
              <span className="bg-indigo-200 rounded-xl text-sm ml-1 p-1 text-gray-600 font-normal">{formatDate(objective.iniDate)}</span> -
              <span className="bg-indigo-200 rounded-xl text-sm p-1 ml-1 text-gray-600 font-normal">{formatDate(objective.finDate)}</span>
            </p>
          </div>
          <div className="pl-2 border-l-2 w-3/12 border-[#c6caff]">
            <p className="uppercase font-bold">{objective.nombrePlani}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ObjectiveAccordion
