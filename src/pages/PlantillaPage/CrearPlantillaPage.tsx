import { TextField } from '@mui/material'
import { CriterioEvaluacionFinal, ParametroEvaluacionFinal } from '../../interfaces/plantilla.interface'
import { useEffect, useState } from 'react'
import { getAllCriteriosEvaluacion } from '../../services/criterio.service'
import { getAllParametrosEvaluacion } from '../../services/parametro.service'
import RubricaItem from './Components/RubricaItem'

const CrearPlantillaPage = (): JSX.Element => {
  const [criterios, setCriterios] = useState<CriterioEvaluacionFinal[]>([])
  const [parametros, setParametros] = useState<ParametroEvaluacionFinal[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response
        response = await getAllCriteriosEvaluacion()
        setCriterios(response.data)

        response = await getAllParametrosEvaluacion()
        setParametros(response.data)
      } catch (error) {
        console.error('Error fetching criterios:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <>
      <h1 className="text-4xl font-semibold text-black">Crear plantilla de Evaluación Final</h1>
      <hr className="border-[1.5px] border-[#c6caff] mt-2.5" />
      <div className="flex justify-end">
        <button className="button-primary mt-2.5">Crear plantilla</button>
      </div>

      <hr className="border-[1.5px] border-[#c6caff] mt-2.5" />

      <section className="flex items-center justify-between">
        <div className="flex flex-col">
          <label className="text-black text-xl font-semibold">Nombre de plantilla</label>
          <TextField className="w-96 mt-1" placeholder="Nombre de plantilla" size="small"></TextField>
        </div>

        <div className="text-xl font-semibold">
          <span className="text-black">Puntaje total: </span>
          <span className="text-[#f60c2e] mr-2.5">90</span>
        </div>
      </section>

      <hr className="border-[1.5px] border-[#c6caff] mt-2.5" />

      <h2 className="text-2xl font-semibold text-black mt-2">Criterios de Evaluación</h2>

      <hr className="border-[1.5px] border-[#c6caff] mt-2.5" />

      <section className="mt-4 space-y-6">
        <RubricaItem criterios={criterios} parametros={parametros} />
        <RubricaItem criterios={criterios} parametros={parametros} />
        <RubricaItem criterios={criterios} parametros={parametros} />
      </section>

      <div className="flex justify-center">
        <button className="button-primary my-2.5">+ Nuevo Criterio</button>
      </div>
    </>
  )
}

export default CrearPlantillaPage
