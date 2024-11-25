import { Alert, CircularProgress, Slider, Snackbar, TextField } from '@mui/material'
import {
  CrearPlantillaEvaluacionFinal,
  CriterioEvaluacionFinal,
  ParametroEvaluacionFinal,
  Plantilla,
  Rubrica,
} from '../../interfaces/plantilla.interface'
import { useEffect, useState } from 'react'
import { getAllCriteriosEvaluacion } from '../../services/criterio.service'
import { getAllParametrosEvaluacion } from '../../services/parametro.service'
import RubricaItem from './Components/RubricaItem'
import { FieldErrors, Resolver, useForm } from 'react-hook-form'
import { createPlantillaEvaluacionFinal } from '../../services/plantilla.service'
import { AxiosError } from 'axios'
import { AccountCircle } from '@mui/icons-material'
import { formatDateToDMY } from '../../utils/formatDate'

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
  const [isLoading, setIsLoading] = useState(false)
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
  const [successfulCreationPlantilla, setSuccessfulCreationPlantilla] = useState<Plantilla | null>(null)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm<CrearPlantillaEvaluacionFinal>({ resolver, mode: 'onChange' })
  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true)
    try {
      const successfulCreation = await createPlantillaEvaluacionFinal({
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
      setSuccessfulCreationPlantilla(successfulCreation.data)
    } catch (error) {
      const axiosError = error as AxiosError<unknown>
      console.error(error)

      if (axiosError.response?.data?.errors) {
        const backendErrors = axiosError.response.data.errors
        if (backendErrors?.nombre) {
          setError('nombre', {
            type: 'backend',
            message: backendErrors.nombre[0],
          })
        }
      }
    } finally {
      setIsLoading(false) // Detiene el estado de carga
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
      puntaje: rubricas.reduce((total, rubrica) => {
        console.log(rubrica.data)
        return total + rubrica.data.valorMaxim
      }, 0),
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

  return !successfulCreationPlantilla ? (
    <form onSubmit={onSubmit}>
      <h1 className="text-4xl font-semibold text-black mx-6">Crear plantilla de Evaluación Final</h1>
      <hr className="border-[1.5px] border-[#c6caff] mt-2.5 mx-6" />
      <div className="flex justify-end mx-6">
        <button
          type="submit"
          disabled={
            !isValid ||
            Boolean(rubricas.find((rubrica) => rubrica.data.identificadorCriteEvaluFinal === null)) ||
            Boolean(rubricas.length === 0) ||
            plantilla.puntaje === 0 ||
            Boolean(rubricas.find((rubrica) => rubrica.data.valorMaxim === 0))
          }
          className="button-primary mt-2.5 disabled:bg-zinc-200 disabled:text-black"
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Crear plantilla'}
        </button>
      </div>

      <hr className="border-[1.5px] border-[#c6caff] mt-2.5 mx-6" />

      <section className="flex items-center justify-between mx-6">
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

      <hr className="border-[1.5px] border-[#c6caff] mt-2.5 mx-6" />

      <h2 className="text-2xl font-semibold text-black mt-2 mx-6">Criterios de Evaluación</h2>

      <hr className="border-[1.5px] border-[#c6caff] mt-2.5 mx-6" />

      <section className="mt-4 space-y-6 mx-6">
        {rubricas.length === 0 && (
          <p className="text-[#f60c2e] text-lg text-center">
            Debes tener al menos un criterio para poder crear una plantilla de evaluación final
          </p>
        )}
        {originalCriterios.length > 0 && parametros.length > 0 ? (
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
        <button
          type="button"
          onClick={addRubrica}
          className="button-primary my-2.5 disabled:bg-zinc-200 disabled:text-black"
          disabled={criterios.length === 0}
        >
          + Nuevo Criterio
        </button>
      </div>
    </form>
  ) : (
    <div className="h-full relative mx-6">
      {/* Encabezado */}
      <div className="relative flex items-center w-full px-4">
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-semibold text-[#1c1c1c]">
          {successfulCreationPlantilla.nombre}
        </h1>

        <div className="ml-auto px-4 flex items-center gap-2">
          <span className="font-semibold text-xl">Puntaje Total:</span>
          <span className="text-[#f60c2e] text-xl font-semibold">{successfulCreationPlantilla.puntaje}</span>
        </div>
      </div>

      <hr className="border-[1.5px] border-[#c6caff] mt-2.5 mx-6" />

      {/* Fecha y creador */}
      <div className="px-6 py-2 flex justify-between items-center text-xl">
        <div className="flex items-center gap-2">
          <span className="font-semibold">Fecha de Creación:</span>
          <span className="text-[#462fa4]">{formatDateToDMY(successfulCreationPlantilla.fechaCreac)}</span>
        </div>
        <div className="flex items-center gap-2">
          <AccountCircle />
          <span className="font-semibold">Creado por:</span>
          <span>{successfulCreationPlantilla.usuario_cread.name}</span>
        </div>
      </div>

      <hr className="border-[1.5px] border-[#c6caff] mx-6" />

      <div className="mt-4 px-6">
        <header className="flex text-lg sm:text-xl md:text-2xl justify-between items-center gap-2.5 font-semibold text-gray-900">
          <h2 className="">Criterios de Evaluación</h2>
          <div className="flex gap-12">
            <span>Escala</span>
            <span>Puntaje</span>
          </div>
        </header>
      </div>

      {/* Lista de rúbricas */}
      <div className="px-6 py-4 space-y-4 pb-[72px]">
        {' '}
        {/* Espacio fijo para el Snackbar */}
        {successfulCreationPlantilla.rubricas.map((rubrica) => (
          <article
            key={rubrica.criterio_evalu_final.identificador}
            className="w-full p-5 rounded-lg border border-gray-300 shadow-sm bg-white flex flex-wrap md:flex-nowrap items-center"
          >
            <div className="w-full md:w-2/5 mb-4 md:mb-0 md:mr-4">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800">{rubrica.criterio_evalu_final.nombre}</h3>
              <p className="text-sm text-gray-500">{rubrica.criterio_evalu_final.descripcion}</p>
            </div>

            <div className="w-full md:w-3/5 flex items-center justify-between gap-6">
              <div className="flex gap-7 w-full items-center justify-end">
                {rubrica.param_evalu.tipo === 'cualitativo' ? (
                  rubrica.param_evalu.campos.map((parametro) => (
                    <div key={parametro.identificador} className="flex flex-col items-center space-y-1 text-center">
                      <input type="radio" disabled name={`param-${rubrica.criterio_evalu_final.identificador}`} className="w-5 h-5" />
                      <label className="text-xs text-gray-700">{parametro.nombre}</label>
                    </div>
                  ))
                ) : (
                  <div className="flex-grow">
                    <Slider
                      defaultValue={rubrica.param_evalu.valorMinim}
                      marks
                      min={rubrica.param_evalu.valorMinim}
                      max={rubrica.param_evalu.valorMaxim}
                      valueLabelDisplay="auto"
                      sx={{
                        color: '#b0b0b0',
                        '& .MuiSlider-thumb': {
                          backgroundColor: '#9e9e9e',
                        },
                        '& .MuiSlider-rail': {
                          backgroundColor: '#e0e0e0',
                        },
                        '& .MuiSlider-track': {
                          backgroundColor: '#b0b0b0',
                        },
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="flex items-center justify-center w-14 h-14 bg-[#e0e3ff] rounded-full text-[#6344e7] text-lg font-semibold">
                {rubrica.valorMaxim}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Snackbar */}
      <Snackbar
        autoHideDuration={5000}
        open={Boolean(successfulCreationPlantilla)}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Alert severity="success">Plantilla de Evaluación creada exitosamente</Alert>
      </Snackbar>
    </div>
  )
}

export default CrearPlantillaPage
