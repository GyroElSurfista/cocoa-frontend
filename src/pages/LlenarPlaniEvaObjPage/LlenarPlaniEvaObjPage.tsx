import { useEffect, useState } from 'react'
import { getEntregablesConCriterios } from '../../services/planiEvaObj.service'
import { Entregable } from './Models/planiEvaObj'
import EntregableComponent from './Components/EntregableComponent'

interface Objective {
  identificador: number
  nombre: string
  entregables: Array<Entregable>
}

// Define type for criteriaState
type CriteriaState = {
  [entregableId: number]: {
    [criterioId: number]: boolean
  }
}

const LlenarPlaniEvaObjPage = () => {
  const [objective, setObjective] = useState<Objective | undefined>()
  const [criteriaState, setCriteriaState] = useState<CriteriaState>({})

  const handleToggleCriteria = (entregableId: number, criterioId: number) => {
    setCriteriaState((prev) => ({
      ...prev,
      [entregableId]: {
        ...prev[entregableId],
        [criterioId]: !prev[entregableId][criterioId],
      },
    }))
  }

  const handleSave = () => {
    const markedCriteria = Object.keys(criteriaState).reduce(
      (acc, entregableId) => {
        const criterios = Object.keys(criteriaState[parseInt(entregableId)])
          .filter((criterioId) => criteriaState[parseInt(entregableId)][parseInt(criterioId)])
          .map((id) => parseInt(id))
        if (criterios.length) acc[parseInt(entregableId)] = criterios
        return acc
      },
      {} as { [entregableId: number]: number[] }
    )

    console.log('Saving marked criteria:', markedCriteria)
    // API call logic goes here
  }

  const fetchObjective = async () => {
    const response = await getEntregablesConCriterios()
    setObjective({
      identificador: response.data.identificador,
      nombre: response.data.nombre,
      entregables: response.data.entregable,
    })
  }

  useEffect(() => {
    fetchObjective()
  }, [])

  // Initialize criteriaState after objective is set
  useEffect(() => {
    if (objective) {
      const initialCriteriaState = objective.entregables.reduce((acc, entregable) => {
        acc[entregable.identificador] = entregable.criterio_aceptacion_entregable.reduce(
          (cAcc, criterio) => {
            cAcc[criterio.identificador] = criterio.isChecked || false
            return cAcc
          },
          {} as { [criterioId: number]: boolean }
        )
        return acc
      }, {} as CriteriaState)
      setCriteriaState(initialCriteriaState)
    }
  }, [objective])

  return (
    <div className="px-10">
      <h3 className="font-semibold text-3xl">Llenar planilla de evaluación de objetivo</h3>
      <hr className="my-2 border-[1.5px] border-[#c6caff]" />
      <p className="text-lg font-medium">Evaluación del Objetivo {objective?.nombre}</p>
      <hr className="mt-2 mb-8 border-[1.5px] border-[#c6caff]" />
      {objective?.entregables.map((entregable) => (
        <EntregableComponent key={entregable.identificador} entregable={entregable} onToggleCriteria={handleToggleCriteria} />
      ))}
      <hr className="my-5 border-[1.5px] border-[#c6caff]" />
      <div className="flex justify-end py-2">
        <button onClick={handleSave} className="button-primary">
          Guardar Evaluación
        </button>
      </div>
    </div>
  )
}

export default LlenarPlaniEvaObjPage
