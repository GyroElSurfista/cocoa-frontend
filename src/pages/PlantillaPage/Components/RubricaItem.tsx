import { Autocomplete, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { CriterioEvaluacionFinal, ParametroEvaluacionFinal } from '../../../interfaces/plantilla.interface'
import DeleteIcon from '@mui/icons-material/Delete'

const RubricaItem = ({
  criterios,
  parametros,
}: {
  criterios: CriterioEvaluacionFinal[]
  parametros: ParametroEvaluacionFinal[]
}): JSX.Element => {
  const [selectedParametro, setSelectedParametro] = useState<ParametroEvaluacionFinal>(parametros[0] || null)

  useEffect(() => {
    // Actualizar el valor si los parametros cambian
    if (parametros.length > 0) {
      setSelectedParametro(parametros[0])
    }
  }, [parametros])

  return (
    <>
      <section className="flex items-center justify-between w-full">
        <Autocomplete
          disablePortal
          options={criterios}
          className="bg-[#e0e3ff] w-3/5"
          size="small"
          getOptionLabel={(criterio) => criterio.nombre}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Seleccionar Criterio"
              sx={{
                '& .MuiInputBase-root': {
                  fontSize: '0.9rem', // text-xs
                  color: '#454545', // text-[#454545]
                },
                '& .MuiInputLabel-root': {
                  fontSize: '0.875rem', // text-sm
                },
              }}
            />
          )}
        />

        <Autocomplete
          disablePortal
          options={parametros}
          className="bg-[#e0e3ff] w-1/5 mx-2.5"
          size="small"
          getOptionLabel={(parametro) => parametro.nombre}
          value={selectedParametro}
          disableClearable
          onChange={(_event, newValue) => setSelectedParametro(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Seleccionar Parametro"
              sx={{
                '& .MuiInputBase-root': {
                  fontSize: '0.9rem', // text-xs
                  color: '#454545', // text-[#454545]
                },
                '& .MuiInputLabel-root': {
                  fontSize: '0.875rem', // text-sm
                },
              }}
            />
          )}
        />

        <div className="flex items-center text-xl font-semibold w-1/5 justify-end">
          <span className="text-black mr-2.5 ">Puntaje: </span>
          <TextField className="text-[#f60c2e] w-[25%]" size="small"></TextField>
        </div>
      </section>

      <section className="w-full p-5 rounded-lg border border-gray-400 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-black">{'criterioName'}</h3>
          <p className="text-sm text-gray-500">{'criterioDescription'}</p>
        </div>

        <div className="flex items-center ">
          {/* <div className="flex gap-6 mr-6">
          {criterios.map((option, index) => (
            <div key={index} className="flex flex-col text-center">
              <input type="radio" id={'option'} name={criterioName} />
              <label htmlFor={'option'} className="text-xs text-black">
                {'option'}
              </label>
            </div>
          ))}
        </div> */}
          <DeleteIcon fontSize="large" className="fill-[#f60c2e] hover:bg-red-100  hover:rounded-full cursor-pointer p-1" />
        </div>
      </section>
    </>
  )
}

export default RubricaItem
