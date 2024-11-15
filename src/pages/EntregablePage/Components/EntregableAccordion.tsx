import React, { useState } from 'react'
import * as Entregables from './../../../interfaces/entregable.interface'
import Drop from '../../../assets/icon-drop.svg'

const EntregableAccordion: React.FC<Entregables.EntregableAccordionProps> = ({ objetivoIds }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedDeliverable, setExpandedDeliverable] = useState<number | null>(null)

  const toggleAccordion = () => {
    setIsOpen(!isOpen)
  }

  const toggleDeliverable = (index: number) => {
    setExpandedDeliverable(expandedDeliverable === index ? null : index)
  }

  return (
    <div className="bg-[#e0e3ff] rounded my-3">
      <div className="hover:bg-[#c6caff] w-full border rounded border-[#c6caff] p-4 cursor-pointer flex" onClick={toggleAccordion}>
        <div className="flex flex-row w-full justify-start items-center">
          <div className="w-auto border-r-2 pr-2 border-[#c6caff]">
            {/* Mostrar el número del objetivo en lugar del entregable */}
            <span className="text-center text-[#1c1c1c] text-lg font-semibold">Objetivo</span>
          </div>
          <span className="ml-1 text-gray-600 font-normal w-auto border-r-2 pr-2 border-[#c6caff]">Nombre del objetivo</span>
        </div>
        <div className="w-auto border-l-2 pl-2 border-[#c6caff] flex items-center space-x-2">
          <div>
            <img src={Drop} alt="dropdown icon" />
          </div>
        </div>
      </div>

      {/* Contenido desplegable del objetivo */}
      {isOpen && (
        <div className="py-4 bg-[#E0E3FF] rounded-b-md px-8">
          {/* Lista de entregables dentro del objetivo */}
          <div className="mt-4 space-y-2">
            {/* Entregable 1 */}
            <div className="px-2 bg-[#EEF0FF] rounded-md pt-4 cursor-pointer" onClick={() => toggleDeliverable(1)}>
              <div className="flex items-center pb-4">
                <span className="font-semibold border-r-2 pr-2 border-[#E0E3FF]">Entregable 1</span>
                <span className="text-sm ml-4">Nombre del Entregable 1</span>
              </div>
              <hr className="border-[1.5px] border-[#e0e3ff]" />

              {/* Criterios desplegables para Entregable 1 */}
              {expandedDeliverable === 1 && (
                <div className="mt-2 px-4 py-2] rounded-md">
                  <p className="text-gray-700 text-sm">Criterio 1: Descripción del criterio 1 para Entregable 1</p>
                  <p className="text-gray-700 text-sm">Criterio 2: Descripción del criterio 2 para Entregable 1</p>
                </div>
              )}
            </div>

            {/* Entregable 2 */}
            <div className="px-2 bg-[#EEF0FF] rounded-md pt-4 cursor-pointer " onClick={() => toggleDeliverable(2)}>
              <div className="flex items-center pb-4">
                <span className="font-semibold border-r-2 pr-2 border-[#c6caff]  ">Entregable 2</span>
                <span className="text-sm ml-4 ">Nombre del Entregable 2</span>
              </div>
              <hr className="border-[1.5px] border-[#e0e3ff]" />

              {/* Criterios desplegables para Entregable 2 */}
              {expandedDeliverable === 2 && (
                <div className="mt-2 px-4 py-2 rounded-md">
                  <p className="text-gray-700 text-sm">Criterio 1: Descripción del criterio 1 para Entregable 2</p>
                  <p className="text-gray-700 text-sm">Criterio 2: Descripción del criterio 2 para Entregable 2</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EntregableAccordion
