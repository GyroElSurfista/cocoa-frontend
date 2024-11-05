import { TextField } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

const CriterioItem = ({
  criterioName,
  criterioDescription,
  options,
}: {
  criterioName: string
  criterioDescription: string
  options: string[]
}) => (
  <>
    <section className="flex items-center justify-between w-full">
      <div className="h-7 px-1 py-0.5 bg-[#e0e3ff] rounded border border-[#8680f9] flex items-center w-2/5">
        <div className="grow self-stretch px-2 py-1 flex items-center gap-2">
          <div className="text-xs text-[#454545]">Criterio</div>
        </div>
      </div>

      <div className="h-7 px-1 py-0.5 bg-[#e0e3ff] rounded border border-[#8680f9] flex items-center w-2/5 mx-2.5">
        <div className="grow self-stretch px-2 py-1 flex items-center gap-2">
          <div className="text-xs text-[#454545]">Parámetro</div>
        </div>
      </div>

      <div className="flex items-center text-xl font-semibold w-1/5">
        <span className="text-black mr-2.5">Puntaje: </span>
        <TextField className="text-[#f60c2e]" size="small"></TextField>
      </div>
    </section>

    <section className="w-full p-5 rounded-lg border border-gray-400 flex items-center justify-between">
      <div>
        <h3 className="text-xl font-semibold text-black">{criterioName}</h3>
        <p className="text-sm text-gray-500">{criterioDescription}</p>
      </div>

      <div className="flex items-center ">
        <div className="flex gap-6 mr-6">
          {options.map((option, index) => (
            <div key={index} className="flex flex-col text-center">
              <input type="radio" id={option} name={criterioName} />
              <label htmlFor={option} className="text-xs text-black">
                {option}
              </label>
            </div>
          ))}
        </div>
        <DeleteIcon fontSize="large" className="fill-[#f60c2e] hover:bg-red-100  hover:rounded-full cursor-pointer p-1" />
      </div>
    </section>
  </>
)

const CrearPlantillaPage = (): JSX.Element => {
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

      {/* Sección de criterios */}
      <section className="mt-4 space-y-6">
        <CriterioItem
          criterioName="Nombre del criterio 1"
          criterioDescription="Descripción del criterio 1"
          options={['De acuerdo', 'Indiferente', 'En desacuerdo']}
        />
        <CriterioItem
          criterioName="Nombre del criterio 2"
          criterioDescription="Descripción del criterio 2"
          options={['Muy de acuerdo', 'De acuerdo', 'Indiferente', 'En desacuerdo', 'Muy en desacuerdo']}
        />
        <CriterioItem criterioName="Nombre del criterio 3" criterioDescription="Descripción del criterio 3" options={['Sí', 'No']} />
      </section>

      <div className="flex justify-center">
        <button className="button-primary my-2.5">+ Nuevo Criterio</button>
      </div>
    </>
  )
}

export default CrearPlantillaPage
