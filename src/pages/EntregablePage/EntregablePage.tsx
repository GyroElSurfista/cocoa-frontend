import { useEffect, useState } from 'react'
import { useLocation, NavLink } from 'react-router-dom'
import NewEntregableModal from './Components/NewEntregableModal'
import EntregableAccordion from './Components/EntregableAccordion'

interface Entregable {
  identificador?: number // Hacer identificador opcional aquí también
  nombre: string
  descripcion: string
  identificadorObjet: number
}

interface Objetivo {
  identificador: number
  nombre: string
  fechaInici: string
  fechaFin: string
  valorPorce: string
  planillasGener: boolean
  identificadorPlani: number
}

const EntregablePage = () => {
  const location = useLocation()
  const { identificadorObjet } = location.state || {}

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [entregables, setEntregables] = useState<Entregable[]>([])
  const [availableObjetivos, setAvailableObjetivos] = useState<Objetivo[]>([])

  // Fetch entregables
  useEffect(() => {
    const fetchEntregables = async () => {
      try {
        const response = await fetch('https://cocoabackend.onrender.com/api/entregables')
        const data = await response.json()
        setEntregables(data)
      } catch (error) {
        console.error('Error al cargar los entregables:', error)
      }
    }
    fetchEntregables()
  }, [])

  // Fetch objetivos
  useEffect(() => {
    const fetchObjetivos = async () => {
      try {
        const response = await fetch('https://cocoabackend.onrender.com/api/objetivos')
        const data = await response.json()
        setAvailableObjetivos(data)
      } catch (error) {
        console.error('Error al cargar los objetivos:', error)
      }
    }
    fetchObjetivos()
  }, [])

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const handleCreateEntregable = (newEntregables: Entregable[]) => {
    setEntregables([...entregables, ...newEntregables])
  }

  return (
    <div className="px-2 mx-6">
      <h2 className="text-lg font-semibold">
        <NavLink to="/objetivos" className="text-2xl font-bold transition duration-300 ease-in-out px-2 py-1 rounded-[10px]">
          Objetivos
        </NavLink>{' '}
        {'>'}
        {identificadorObjet && (
          <>
            <span className="text-base font-bold ml-2">Objetivo {identificadorObjet}</span> {'>'}
          </>
        )}
        <span className="text-base font-bold ml-2">Entregables</span>
      </h2>
      <hr className="border-[1.5px] border-[#c6caff] my-3" />

      <div className="mt-4">
        {entregables.length > 0 ? (
          entregables
            .filter((entregable) => entregable.identificador !== undefined)
            .map((entregable, index) => (
              <EntregableAccordion key={entregable.identificador} entregable={entregable} indexEntregable={index + 1} />
            ))
        ) : (
          <p className="text-sm text-center text-gray-500">No existen entregables disponibles</p>
        )}
      </div>

      <hr className="border-[1.5px] border-[#c6caff] mt-4" />
      <div className="flex justify-center pt-3">
        <button onClick={openModal} className="button-primary">
          + Nuevo entregable
        </button>
      </div>

      <NewEntregableModal isOpen={isModalOpen} onClose={closeModal} onCreate={handleCreateEntregable} />
    </div>
  )
}

export default EntregablePage
