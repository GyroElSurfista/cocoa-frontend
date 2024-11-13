import { Autocomplete, Box, Slider, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { CriterioEvaluacionFinal, ParametroEvaluacionFinal } from '../../../interfaces/plantilla.interface'
import DeleteIcon from '@mui/icons-material/Delete'

interface RubricaItemProps {
  index: number
  criterios: CriterioEvaluacionFinal[]
  parametros: ParametroEvaluacionFinal[]
  quitRubrica: (index: number) => void
}

const RubricaItem = ({ index, criterios, parametros, quitRubrica }: RubricaItemProps): JSX.Element => {
  const [selectedCriterio, setSelectedCriterio] = useState<CriterioEvaluacionFinal | null>(null)
  const [selectedParametro, setSelectedParametro] = useState<ParametroEvaluacionFinal>(parametros[0] || null)

  useEffect(() => {
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
          onChange={(_event, newValue) => setSelectedCriterio(newValue)}
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
              label="Seleccionar Parámetro"
              sx={{
                '& .MuiInputBase-root': {
                  fontSize: '0.9rem',
                  color: '#454545',
                },
                '& .MuiInputLabel-root': {
                  fontSize: '0.875rem',
                },
              }}
            />
          )}
        />

        <div className="flex items-center text-xl font-semibold w-1/5 justify-end">
          <span onClick={() => console.log(index)} className="text-black mr-2.5 ">
            Puntaje:{' '}
          </span>
          {selectedParametro.tipo === 'cualitativo' ? (
            <TextField
              className="w-[40%]"
              size="small"
              defaultValue={0}
              type="number"
              sx={{
                '& .MuiInputBase-input': {
                  color: '#f60c2e',
                },
              }}
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                const sanitizedValue = e.target.value.replace(/[+\-.]/g, '')
                let numericValue = parseInt(sanitizedValue, 10)

                if (isNaN(numericValue)) numericValue = 0
                else if (numericValue > 100) numericValue = 100
                e.target.value = numericValue.toString()
              }}
            />
          ) : (
            <span className="text-[#f60c2e] text-xl font-semibold">{selectedParametro.valorMaxim}</span>
          )}
        </div>
      </section>

      <section className="w-full p-5 rounded-lg border border-gray-400 flex items-center justify-between">
        <div className="w-2/5 mr-4">
          <h3 className="text-xl font-semibold text-black">{selectedCriterio ? selectedCriterio.nombre : 'Nombre del criterio'}</h3>
          <p className="text-sm text-gray-500">{selectedCriterio ? selectedCriterio.descripcion : 'Descripción del criterio'}</p>
        </div>

        <div className="flex items-center w-3/5">
          <div className="flex gap-7 mr-6 w-full justify-end">
            {selectedParametro?.tipo === 'cualitativo' ? (
              selectedParametro?.campos.map((parametro) => {
                return (
                  <div key={parametro.identificador} className="flex flex-col items-center space-y-1">
                    <input type="radio" disabled name={parametro.nombre} className="size-5" />
                    <label className="text-xs text-black">{parametro.nombre}</label>
                  </div>
                )
              })
            ) : (
              <Box className="w-full">
                <Slider
                  defaultValue={selectedParametro?.valorMinim}
                  marks
                  min={selectedParametro?.valorMinim}
                  max={selectedParametro?.valorMaxim}
                  valueLabelDisplay="auto"
                  sx={{
                    color: '#b0b0b0', // Color grisáceo personalizado
                    '& .MuiSlider-thumb': {
                      backgroundColor: '#9e9e9e', // Color del control deslizante
                    },
                    '& .MuiSlider-rail': {
                      backgroundColor: '#e0e0e0', // Color del fondo de la barra
                    },
                    '& .MuiSlider-track': {
                      backgroundColor: '#b0b0b0', // Color de la barra activa
                    },
                  }}
                />
              </Box>
            )}
          </div>
          <DeleteIcon
            onClick={(_e) => quitRubrica(index)}
            fontSize="large"
            className="fill-[#f60c2e] hover:bg-red-100  hover:rounded-full cursor-pointer p-1"
          />
        </div>
      </section>
    </>
  )
}

export default RubricaItem
