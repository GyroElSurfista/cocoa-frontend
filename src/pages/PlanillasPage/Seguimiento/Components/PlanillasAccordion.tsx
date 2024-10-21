import { useState, useEffect } from 'react'
import Drop from '../../../../assets/icon-drop.svg'

interface Observacion {
  identificador: number
  descripcion: string
  fecha: string
  identificadorPlaniSegui: number
  identificadorActiv: number
}

interface Planilla {
  identificador: number
  fecha: string // Fecha final
  observacion: Observacion[]
  identificadorObjet: number
}

export const PlanillasAccordion: React.FC = () => {
  const [planillas, setPlanillas] = useState<Planilla[]>([])
  const [isDropdownVisible, setIsDropdownVisible] = useState<number | null>(null) // Controla qué dropdown está abierto

  // Fetch de las planillas de seguimiento para todos los objetivos
  useEffect(() => {
    const fetchAllPlanillas = async () => {
      const objetivosIds = [1, 2, 3, 4] // Aquí puedes poner el rango de los objetivos que quieras obtener

      try {
        const allPlanillas: Planilla[] = []

        // Hacemos una solicitud por cada objetivo
        for (const id of objetivosIds) {
          const response = await fetch(`https://cocoabackend.onrender.com/api/objetivos/${id}/planillas-seguimiento`)
          const data = await response.json()
          allPlanillas.push(...data) // Añadimos las planillas de cada objetivo al array
        }

        setPlanillas(allPlanillas) // Guardamos todas las planillas en el estado
      } catch (error) {
        console.error('Error al cargar las planillas:', error)
      }
    }

    fetchAllPlanillas()
  }, [])

  // Alterna el dropdown de una planilla específica
  const toggleDropdown = (id: number) => {
    setIsDropdownVisible(isDropdownVisible === id ? null : id)
  }

  return (
    <div>
      {planillas.length > 0 ? (
        planillas.map((planilla) => (
          <div key={planilla.identificador} className="bg-[#e0e3ff] rounded my-3">
            <div
              className="hover:bg-[#c6caff] w-full border rounded border-[#c6caff] p-4"
              onClick={() => toggleDropdown(planilla.identificador)}
            >
              <div className="flex flex-row w-full justify-between items-center">
                {/* Parte Izquierda */}
                <div className="w-auto border-r-2 pr-2 border-[#c6caff]">
                  <span className="text-center text-[#1c1c1c] text-lg font-semibold">Objetivo {planilla.identificadorObjet}</span>
                </div>
                <span className="ml-1 text-gray-600 font-normal w-auto border-r-2 pr-2 border-[#c6caff]">
                  {planilla.observacion[0]?.descripcion || 'Sin observaciones'}
                </span>

                {/* Parte Derecha */}
                <div className="ml-auto flex flex-row items-center space-x-4">
                  <div className="w-auto border-l-2 pl-2 border-[#c6caff]">
                    <span>Fecha Inicio: </span>
                    <span className="bg-[#FFC3CC] rounded px-1">{planilla.observacion[0]?.fecha || 'N/A'}</span>
                    <span> - </span>
                    <span className="bg-[#C6CAFF] rounded px-1">{planilla.fecha}</span>
                  </div>
                  <div className="w-auto border-l-2 pl-2 border-[#c6caff] flex items-center space-x-2">
                    <span>
                      <b>COCOA</b>
                    </span>
                    <img src={Drop} alt="Dropdown Icon" onClick={() => toggleDropdown(planilla.identificador)} className="cursor-pointer" />
                  </div>
                </div>
              </div>

              {/* Contenido desplegable */}
              {isDropdownVisible === planilla.identificador && (
                <div className="mt-4 bg-[#eef0ff] border border-[#c6caff] rounded p-4">
                  <p className="text-[#1c1c1c]">Aquí va el contenido desplegable relacionado con esta planilla.</p>
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 font-bold">
          No existen objetivos para los cuales se hayan generado planillas de seguimiento semanal.
        </p>
      )}
    </div>
  )
}
