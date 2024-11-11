import React, { useEffect, useState } from 'react'
import IconUser from './../../../../assets/icon-user.svg'
import { NewPlantillaDeleteModal } from './NewPlantillaDeleteModal'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Slider from '@mui/material/Slider'
import * as Plantillas from './../../../../interfaces/plantilla.interface'

interface PlantillaDeleteAccordionProps {
  onDeleteConfirm: () => void
}

export const PlantillaDeleteAccordion: React.FC<PlantillaDeleteAccordionProps> = ({ onDeleteConfirm }) => {
  const [plantillas, setPlantillas] = useState<Plantillas.Plantilla[]>([])
  const [sliderValues, setSliderValues] = useState<{ [key: string]: number }>({})
  const [selectedValues, setSelectedValues] = useState<{ [key: string]: string }>({})
  const [expandedIds, setExpandedIds] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    const fetchPlantillas = async () => {
      try {
        const response = await fetch('https://cocoabackend.onrender.com/api/plantillas-evaluacion-final')
        const data = await response.json()
        setPlantillas(data)
      } catch (error) {
        console.error('Error fetching plantillas:', error)
      }
    }

    fetchPlantillas()
  }, [])

  const toggleExpand = (id: number) => {
    // Cambia el estado de la plantilla específica
    setExpandedIds((prevExpandedIds) => ({
      ...prevExpandedIds,
      [id]: !prevExpandedIds[id],
    }))
  }

  const handleRadioChange = (id: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValues((prevValues) => ({
      ...prevValues,
      [id]: event.target.value,
    }))
  }

  const handleSliderChange = (id: number) => (_event: Event, newValue: number | number[]) => {
    setSliderValues((prevValues) => ({
      ...prevValues,
      [id]: newValue as number,
    }))
  }

  return (
    <div>
      {plantillas.map((plantilla, index) => (
        <div key={plantilla.identificador} className="bg-[#e0e3ff] rounded-xl my-3">
          {/* Cabecera para expandir */}
          <div
            className="hover:bg-[#c6caff] w-full border rounded-xl border-[#c6caff] p-4 cursor-pointer"
            onClick={() => toggleExpand(plantilla.identificador)}
          >
            <div className="flex flex-row w-full justify-between items-center">
              <div className="w-auto border-r-2 pr-2 border-[#c6caff]">
                <span className="text-center text-[#1c1c1c] text-lg font-semibold">Plantilla {index + 1}</span>
              </div>
              <span className="ml-1 text-gray-600 font-normal w-auto">{plantilla.nombre}</span>
              <div className="ml-auto flex flex-row items-center space-x-4">
                <div className="flex items-center w-auto">
                  <span className="font-semibold text-sm mr-1">Creado el: </span>
                  <span className="text-sm">
                    {new Date(plantilla.fechaCreac).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </span>
                  {plantilla.usuario_cread && (
                    <span className="ml-3 flex items-center">
                      <img src={IconUser} alt="" className="w-8" />
                      <span className="text-sm">{plantilla.usuario_cread.name}</span>
                    </span>
                  )}
                </div>
                <div className="w-auto border-l-2 pl-2 border-[#c6caff] flex items-center space-x-2">
                  <span className="flex items-center gap-2">
                    <b>Puntaje:</b>
                    <b className="text-red-600">{plantilla.puntaje}</b>
                    <div
                      className="p-2 flex items-center" // Alineación vertical para el ícono
                      onClick={(e) => e.stopPropagation()} // Detiene la propagación
                    >
                      {plantilla.identificadorUsuar === 1 && (
                        <NewPlantillaDeleteModal
                          plantillaId={plantilla.identificador}
                          eliminadoLogic={plantilla.eliminadoLogic}
                          onDeleteConfirm={() => {
                            setPlantillas(plantillas.filter((p) => p.identificador !== plantilla.identificador))
                            onDeleteConfirm()
                          }}
                        />
                      )}
                    </div>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Contenido desplegable */}
          {expandedIds[plantilla.identificador] && (
            <section className="px-12 pb-1">
              {plantilla.rubricas.map((rubrica) => (
                <div key={rubrica.criterio_evalu_final.identificador} className="border-black border my-[25px] rounded-lg">
                  <div className="justify-between flex p-4">
                    <div>
                      <p className="text-lg font-semibold">{rubrica.criterio_evalu_final.nombre}</p>
                      <p className="text-sm text-[#5D5D5D]">{rubrica.criterio_evalu_final.descripcion}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {rubrica.param_evalu.nombre === 'Likert 3' && (
                        <div className="flex items-center space-x-4">
                          <RadioGroup
                            row
                            value={selectedValues[rubrica.param_evalu.identificador] || ''}
                            onChange={handleRadioChange(rubrica.param_evalu.identificador)}
                            className="flex space-x-4 px-4"
                          >
                            {rubrica.param_evalu.campos?.map((campo) => (
                              <div key={campo.identificador} className="flex flex-col items-center">
                                <Radio value={campo.nombre} />
                                <span className="text-sm">{campo.nombre}</span>
                              </div>
                            ))}
                          </RadioGroup>
                          {/* Esfera para mostrar rubrica.valorMaxim */}
                          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#C6CAFF]">
                            <span className="text-[#5736CC] font-semibold text-center text-lg">{rubrica.valorMaxim}</span>
                          </div>
                        </div>
                      )}
                      {rubrica.param_evalu.nombre === 'Sí/NO' && (
                        <div className="flex items-center space-x-4">
                          <RadioGroup
                            row
                            value={selectedValues[rubrica.param_evalu.identificador] || ''}
                            onChange={handleRadioChange(rubrica.param_evalu.identificador)}
                            className="flex space-x-4 px-4"
                          >
                            {rubrica.param_evalu.campos?.map((campo) => (
                              <div key={campo.identificador} className="flex flex-col items-center">
                                <Radio value={campo.nombre} />
                                <span className="text-sm">{campo.nombre}</span>
                              </div>
                            ))}
                          </RadioGroup>
                          {/* Esfera para mostrar rubrica.valorMaxim */}
                          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#C6CAFF]">
                            <span className="text-[#5736CC] font-semibold text-center text-lg">{rubrica.valorMaxim}</span>
                          </div>
                        </div>
                      )}
                      {rubrica.param_evalu.tipo === 'cuantitativo' && (
                        <div className="flex items-center space-x-4">
                          {/* Valor mínimo del Slider */}
                          <span className="text-sm">{rubrica.param_evalu.valorMinim}</span>
                          <Slider
                            value={sliderValues[rubrica.param_evalu.identificador] || rubrica.param_evalu.valorMinim} // Valor del slider correspondiente
                            onChange={handleSliderChange(rubrica.param_evalu.identificador)} // Identificador único
                            aria-labelledby="continuous-slider"
                            valueLabelDisplay="off"
                            className="w-72"
                            min={rubrica.param_evalu.valorMinim}
                            max={rubrica.param_evalu.valorMaxim}
                          />
                          {/* Valor máximo del Slider */}
                          <span className="text-sm">{rubrica.param_evalu.valorMaxim}</span>
                          {/* Esfera para mostrar el valor máximo */}
                          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#C6CAFF]">
                            <span className="text-[#5736CC] font-semibold text-center text-lg">{rubrica.valorMaxim}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </section>
          )}
        </div>
      ))}
    </div>
  )
}

export default PlantillaDeleteAccordion