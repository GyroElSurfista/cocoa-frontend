import { useEffect, useState } from 'react'
import { Entregable } from '../Models/planiEvaObj'

interface EntregableComponentProps {
  entregable: Entregable
  onToggleCriteria: (entregableId: number, criterioId: number) => void
  isEvaluationSaved: boolean
}

const EntregableComponent = ({ entregable, onToggleCriteria, isEvaluationSaved }: EntregableComponentProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [criteriaCheckedState, setCriteriaCheckedState] = useState<{ [key: number]: boolean }>({})

  useEffect(() => {
    // Initialize checked state based on `cumple` from `revision_criterio_entregable`
    const initialCheckedState: { [key: number]: boolean } = {}
    entregable.criterio_aceptacion_entregable.forEach((criterio) => {
      const cumpleStatus = criterio.revision_criterio_entregable.some((revision) => revision.cumple)
      initialCheckedState[criterio.identificador] = cumpleStatus
    })
    setCriteriaCheckedState(initialCheckedState)
  }, [entregable])

  const toggleAccordion = () => {
    setIsExpanded((prev) => !prev)
  }

  const handleCheckboxChange = (criterioId: number) => {
    if (!isEvaluationSaved) {
      // Only allow toggling if evaluation is not saved
      setCriteriaCheckedState((prev) => ({
        ...prev,
        [criterioId]: !prev[criterioId],
      }))
      onToggleCriteria(entregable.identificador, criterioId)
    }
  }

  return (
    <div className="w-full mb-4">
      <div className="flex flex-row bg-[#eef0ff] rounded-[10px] border-b border-[#c6caff] cursor-pointer" onClick={toggleAccordion}>
        <div className="w-auto py-4 px-3 border-r border-[#c6caff]">
          <p className="font-medium">Entregable {entregable.identificador}</p>
        </div>
        <div className="flex items-center">
          <p className="px-8">{entregable.nombre}</p>
        </div>
      </div>
      {isExpanded && (
        <div className="pl-28 pb-5 w-full">
          <table className="table-auto text-left w-full mt-4">
            <thead>
              <tr>
                <th className="pr-1">Criterios de Evaluación</th>
                <th className="text-center">¿Se cumple el criterio?</th>
              </tr>
            </thead>
            <tbody>
              {entregable.criterio_aceptacion_entregable.map((criterio, index) => (
                <tr key={criterio.identificador} className="border-b border-[#8680f9] text-[#1c1c1c]">
                  <td className="flex py-2.5 pr-1">
                    <div className="pr-5">{index + 1}.</div>
                    <p>{criterio.descripcion}</p>
                  </td>
                  <td>
                    <div className="flex items-center justify-center">
                      <input
                        id={`checkbox-${entregable.identificador}-${criterio.identificador}`}
                        type="checkbox"
                        checked={criteriaCheckedState[criterio.identificador] || false}
                        onChange={() => handleCheckboxChange(criterio.identificador)}
                        disabled={isEvaluationSaved} // Disable checkbox if evaluation is saved
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label htmlFor={`checkbox-${entregable.identificador}-${criterio.identificador}`} className="sr-only">
                        checkbox
                      </label>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default EntregableComponent
