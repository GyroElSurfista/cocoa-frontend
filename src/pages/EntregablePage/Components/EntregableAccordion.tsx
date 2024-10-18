import React, { useState } from 'react'

interface EntregableAccordionProps {
  entregable: Entregable
  indexEntregable: number
}

interface Entregable {
  identificador: number
  nombre: string
  descripcion: string
  identificadorObjet: number
}

const EntregableAccordion: React.FC<EntregableAccordionProps> = ({ entregable }) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleAccordion = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="bg-[#e0e3ff] rounded my-3">
      <div className="hover:bg-[#c6caff] w-full border rounded border-[#c6caff] p-4" onClick={toggleAccordion}>
        <div className="flex flex-row w-full justify-start items-center">
          <div className="w-auto border-r-2 pr-2 border-[#c6caff]">
            {/* Mostrar el número del objetivo en lugar del entregable */}
            <span className="text-center text-[#1c1c1c] text-lg font-semibold">Objetivo {entregable.identificadorObjet}</span>
          </div>
          <span className="ml-1 text-gray-600 font-normal w-auto border-r-2 pr-2 border-[#c6caff]">{entregable.nombre}</span>
        </div>
      </div>
    </div>
  )
}

export default EntregableAccordion
