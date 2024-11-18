import { CircularProgress, TextField } from '@mui/material'
import {
  CrearPlantillaEvaluacionFinal,
  CriterioEvaluacionFinal,
  ParametroEvaluacionFinal,
  Rubrica,
} from '../../interfaces/plantilla.interface'
import { useEffect, useState } from 'react'
import { getAllCriteriosEvaluacion } from '../../services/criterio.service'
import { getAllParametrosEvaluacion } from '../../services/parametro.service'
import RubricaItem from './Components/RubricaItem'
import { FieldErrors, Resolver, useForm } from 'react-hook-form'
import { createPlantillaEvaluacionFinal } from '../../services/plantilla.service'
import { AxiosError } from 'axios'

const resolver: Resolver<CrearPlantillaEvaluacionFinal> = async (values) => {
  const errors: FieldErrors<CrearPlantillaEvaluacionFinal> = {}

  if (!values.nombre || values.nombre.trim() === '')
    errors.nombre = {
      type: 'required',
      message: 'El nombre de la plantilla es obligatorio',
    }
  else if (values.nombre.trim().length < 5)
    errors.nombre = {
      type: 'minLength',
      message: 'El nombre de la plantilla debe tener al menos 5 caracteres',
    }
  else if (values.nombre.trim().length > 50)
    errors.nombre = {
      type: 'maxLength',
      message: 'El nombre de la plantilla no puede exceder los 50 caracteres',
    }

  return {
    values: Object.keys(errors).length === 0 ? values : {},
    errors,
  }
}

const CrearPlantillaPage = (): JSX.Element => {
  const [originalCriterios, setOriginalCriterios] = useState<CriterioEvaluacionFinal[]>([])
  const [criterios, setCriterios] = useState<CriterioEvaluacionFinal[]>([])
  const [parametros, setParametros] = useState<ParametroEvaluacionFinal[]>([])
  const [plantilla, setPlantilla] = useState<CrearPlantillaEvaluacionFinal>({ nombre: '', descripcion: '', puntaje: 0, rubricas: [] })
  const [rubricas, setRubricas] = useState<{ id: number; data: Rubrica }[]>([
    {
      id: 0,
      data: { identificadorCriteEvaluFinal: null, identificadorParamEvalu: parametros[0]?.identificador, valorMaxim: 0 },
    },
  ])
  const [rubricaCounter, setRubricaCounter] = useState<number>(1) // Contador de rubricas

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm<CrearPlantillaEvaluacionFinal>({ resolver, mode: 'onChange' })
  const onSubmit = handleSubmit(async (data) => {
    try {
      await createPlantillaEvaluacionFinal({
        ...plantilla,
        nombre: data.nombre.trim(),
        rubricas: rubricas.map((rubrica) => {
          const parametro = parametros.find((parametro) => rubrica.data.identificadorParamEvalu === parametro.identificador)

          if (parametro && parametro.tipo === 'cualitativo') return rubrica.data
          else {
            const { valorMaxim, ...rubricaSinValorMaxim } = rubrica.data
            return rubricaSinValorMaxim
          }
        }),
      })
    } catch (error) {
      const axiosError = error as AxiosError<unknown>

      if (axiosError.response?.data?.errors) {
        const backendErrors = axiosError.response.data.errors
        if (backendErrors?.nombre) {
          setError('nombre', {
            type: 'backend',
            message: backendErrors.nombre[0],
          })
        }
      }
    }
  })

  const handleChangeCriterios = (id: number, newCriterioId: number | null) => {
    setRubricas((prevRubricas) =>
      prevRubricas.map((rubrica) =>
        rubrica.id === id ? { ...rubrica, data: { ...rubrica.data, identificadorCriteEvaluFinal: newCriterioId } } : rubrica
      )
    )
  }

  useEffect(() => {
    setCriterios(() =>
      originalCriterios.filter(
        (criterio) => !rubricas.some((rubrica) => rubrica.data.identificadorCriteEvaluFinal === criterio.identificador)
      )
    )
  }, [rubricas, originalCriterios])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [criteriosResponse, parametrosResponse] = await Promise.all([getAllCriteriosEvaluacion(), getAllParametrosEvaluacion()])
        setOriginalCriterios(criteriosResponse.data)
        setCriterios(criteriosResponse.data)
        setParametros(parametrosResponse.data)
        setRubricas([
          {
            id: 0,
            data: { identificadorCriteEvaluFinal: null, identificadorParamEvalu: parametrosResponse.data[0].identificador, valorMaxim: 0 },
          },
        ])
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    setPlantilla((prevPlantilla) => ({
      ...prevPlantilla,
      puntaje: rubricas.reduce((total, rubrica) => total + rubrica.data.valorMaxim, 0),
    }))
  }, [rubricas])

  const addRubrica = () => {
    const newRubrica = {
      id: rubricaCounter,
      data: { identificadorParamEvalu: parametros[0].identificador, identificadorCriteEvaluFinal: null, valorMaxim: 0 },
    }

    setRubricas((prevRubricas) => [...prevRubricas, newRubrica])
    setRubricaCounter((prevCounter) => prevCounter + 1)
  }

  const quitRubrica = (id: number) => {
    setRubricas((prevRubricas) => prevRubricas.filter((rubrica) => rubrica.id !== id))
  }

  return (
    <form onSubmit={onSubmit}>
      <h1 className="text-4xl font-semibold text-black">Crear plantilla de Evaluación Final</h1>
      <hr className="border-[1.5px] border-[#c6caff] mt-2.5" />
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={
            !isValid ||
            Boolean(rubricas.find((rubrica) => rubrica.data.identificadorCriteEvaluFinal === null)) ||
            Boolean(rubricas.length === 0) ||
            plantilla.puntaje === 0
          }
          className="button-primary mt-2.5 disabled:bg-zinc-200 disabled:text-black"
        >
          Crear plantilla
        </button>
      </div>

      <hr className="border-[1.5px] border-[#c6caff] mt-2.5" />

      <section className="flex items-center justify-between">
        <div className="flex flex-col">
          <label className="text-black text-xl font-semibold">Nombre de plantilla</label>
          <TextField
            className="w-96 mt-1"
            placeholder="Nombre de plantilla"
            size="small"
            {...register('nombre')}
            error={Boolean(errors.nombre)}
            helperText={errors?.nombre?.message}
          ></TextField>
        </div>

        <div className="text-xl font-semibold space-y-1">
          <div className="flex justify-end items-center">
            <span className="text-black mr-1.5">Puntaje total:</span>
            <span className="text-[#f60c2e] mr-2.5">{plantilla.puntaje}</span>
          </div>

          {plantilla.puntaje === 0 && <p className="text-xs text-[#f60c2e] mr-2.5">El puntaje total debe ser al menos 1</p>}
        </div>
      </section>

      <hr className="border-[1.5px] border-[#c6caff] mt-2.5" />

      <h2 className="text-2xl font-semibold text-black mt-2">Criterios de Evaluación</h2>

      <hr className="border-[1.5px] border-[#c6caff] mt-2.5" />

      <section className="mt-4 space-y-6">
        {rubricas.length === 0 && (
          <p className="text-[#f60c2e] text-lg text-center">
            Debes tener al menos un criterio para poder crear una plantilla de evaluación final
          </p>
        )}
        {criterios.length > 0 && parametros.length > 0 ? (
          rubricas.map((rubrica) => (
            <RubricaItem
              key={rubrica.id}
              index={rubrica.id}
              criterios={criterios}
              parametros={parametros}
              quitRubrica={quitRubrica}
              setRubricas={setRubricas}
              changeCriterios={handleChangeCriterios}
            />
          ))
        ) : (
          <div className="flex justify-center items-center h-16">
            <CircularProgress />
          </div>
        )}
      </section>

      <div className="flex justify-center">
        <button type="button" onClick={addRubrica} className="button-primary my-2.5">
          + Nuevo Criterio
        </button>
      </div>
    </form>
  )
}

export default CrearPlantillaPage
