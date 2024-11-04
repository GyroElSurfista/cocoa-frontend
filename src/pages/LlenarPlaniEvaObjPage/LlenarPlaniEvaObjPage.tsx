import { useEffect, useState } from 'react'
import { getEntregablesConCriterios } from '../../services/planiEvaObj.service'
import { Entregable } from './Models/PlaniEvaObj'
import EntregableComponent from './Components/EntregableComponent'

interface Objective {
  identificador: number
  nombre: string
  entregables: Array<Entregable>
}

const LlenarPlaniEvaObjPage = () => {
  const [objective, setObjective] = useState<Objective>()

  const handleToggleCriteria = () => {}

  const fetchObjective = async () => {
    const response = await getEntregablesConCriterios()
    console.log(response.data)
    setObjective({ identificador: response.data.identificador, nombre: response.data.nombre, entregables: response.data.entregable })
  }

  useEffect(() => {
    fetchObjective()
  }, [])

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
        <button className="button-primary">Guardar Evaluación</button>
      </div>
    </div>
  )
}

export default LlenarPlaniEvaObjPage
