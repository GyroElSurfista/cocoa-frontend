import React, { useState, useEffect } from 'react'
import * as Entregables from './../../../interfaces/entregable.interface'
import Drop from '../../../assets/icon-drop.svg'

interface EntregableAccordionProps {
  objetivoIds: number[]
  refreshTrigger?: boolean // Nueva prop para forzar la recarga de datos
}

const EntregableAccordion: React.FC<EntregableAccordionProps> = ({ objetivoIds, refreshTrigger }) => {
  const [expandedObjectives, setExpandedObjectives] = useState<{ [key: number]: boolean }>({})
  const [expandedDeliverable, setExpandedDeliverable] = useState<number | null>(null)
  const [data, setData] = useState<Entregables.Objetivo[]>([])

  // Obtener los datos de los entregables para cada objetivoId
  useEffect(() => {
    const fetchData = async () => {
      if (objetivoIds.length === 0) return

      try {
        const results = await Promise.all(
          objetivoIds.map(async (objetivoId) => {
            const response = await fetch(`https://cocoabackend.onrender.com/api/objetivos/${objetivoId}/entregables-criterios`)
            if (!response.ok) throw new Error(`Error fetching data for objetivoId ${objetivoId}`)
            return response.json()
          })
        )
        setData(results.filter((obj: Entregables.Objetivo) => obj.entregable.length > 0)) // Filtrar objetivos sin entregables
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [objetivoIds, refreshTrigger]) // Escuchar cambios en refreshTrigger

  const toggleObjective = (id: number) => {
    setExpandedObjectives((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const toggleDeliverable = (index: number) => {
    setExpandedDeliverable(expandedDeliverable === index ? null : index)
  }

  return (
    <div className="accordion-container">
      {data.length === 0 ? (
        <p className="text-gray-500 text-center">No existen entregable(s) para este proyecto</p>
      ) : (
        data.map((objetivo, objetivoIndex) => (
          <div className="bg-[#e0e3ff] rounded my-3" key={objetivo.identificador}>
            <div
              className="hover:bg-[#c6caff] w-full border rounded border-[#c6caff] p-4 cursor-pointer flex"
              onClick={() => toggleObjective(objetivo.identificador)}
            >
              <div className="flex flex-row w-full justify-start items-center">
                <div className="w-auto border-r-2 pr-2 border-[#c6caff]">
                  <span className="text-center text-[#1c1c1c] text-lg font-semibold">Objetivo {objetivoIndex + 1}</span>
                </div>
                <span className="ml-1 text-gray-600 font-normal w-auto border-r-2 pr-2 border-[#c6caff]">{objetivo.nombre}</span>
              </div>
              <div className="w-auto border-l-2 pl-2 border-[#c6caff] flex items-center space-x-2">
                <div>
                  <img src={Drop} alt="dropdown icon" />
                </div>
              </div>
            </div>

            {/* Contenido desplegable del objetivo */}
            {expandedObjectives[objetivo.identificador] && (
              <div className="py-4 bg-[#E0E3FF] rounded-b-md px-8">
                <div className="mt-4 space-y-2">
                  {objetivo.entregable.map((entregable, entregableIndex) => (
                    <div
                      key={entregable.identificador}
                      className="px-2 bg-[#EEF0FF] rounded-md pt-4 cursor-pointer"
                      onClick={() => toggleDeliverable(entregable.identificador!)}
                    >
                      <div className="flex items-center pb-4">
                        <span className="font-semibold border-r-2 pr-2 border-[#E0E3FF]">Entregable {entregableIndex + 1}</span>
                        <span className="text-sm ml-4">{entregable.nombre}</span>
                      </div>
                      <hr className="border-[1.5px] border-[#e0e3ff]" />

                      {/* Criterios desplegables para cada entregable */}
                      {expandedDeliverable === entregable.identificador && (
                        <div className="mt-2 px-4 py-4 rounded-md">
                          {entregable.criterio_aceptacion_entregable.map((criterio, criterioIndex) => (
                            <p key={criterio.identificador} className="text-gray-700 text-sm">
                              {criterioIndex + 1}. {criterio.descripcion}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}

export default EntregableAccordion
