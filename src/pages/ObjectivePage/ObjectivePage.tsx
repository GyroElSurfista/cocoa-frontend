import { useEffect, useState } from 'react'
import ObjectiveAccordion from './Components/ObjectiveAccordion/ObjectiveAccordion'
import NewObjectiveModal from './Components/NewObjectiveModal/NewObjectiveModal'

// Propio de ActivityPage
import { getObjectives, ObjectiveData } from '../../services/objective.service'

export type ActivityProps = {
  identificador: number
  nombre: string
  fechaInici: Date
  fechaFin: Date
  descripcion: string
  responsable: string | null
  resultado: string
}

interface Objective {
  identificador: number
  iniDate: string
  finDate: string
  objective: string
  valueP: string
  activities: ActivityProps[] // Añadir las actividades aquí
}

const ObjectivePage = () => {
  // Propio de ActivityPage
  const [objectives, setObjectives] = useState<Objective[]>([]) // Estado para almacenar los objetivos

  // Utilizados por el ObjectiveAccordion

  // Propio de ObjectivePage

  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  // Función para añadir un nuevo objetivo
  const handleCreateObjective = (newObjective: any) => {
    const transformedObjective: Objective = {
      identificador: newObjective.identificador,
      iniDate: newObjective.fechaInici,
      finDate: newObjective.fechaFin,
      objective: newObjective.nombre,
      valueP: newObjective.valorPorce.toString(),
      activities: [], // Set this as an empty array initially
    }
    setObjectives([...objectives, transformedObjective])
  }

  useEffect(() => {
    const cargarObjetivos = async () => {
      try {
        const response = await getObjectives()
        console.log(response)
        const objetivos = response.data.map((obj: ObjectiveData) => ({
          identificador: obj.identificador,
          iniDate: obj.fechaInici,
          finDate: obj.fechaFin,
          objective: obj.nombre,
          valueP: obj.valorPorce,
          activities: [], // Inicializa las actividades si es necesario
        }))

        setObjectives(objetivos)
      } catch (error) {
        console.log(error)
      }
    }

    cargarObjetivos()
  }, [])

  return (
    <div className="px-2 mx-6">
      <h2 className="text-2xl font-bold">Objetivos</h2>
      <hr className="border-[1.5px] border-[#c6caff] my-3" />
      <div className="">
        {objectives.length < 0 && <p className="font-semibold text-center">No existen objetivos registrados</p>}
        {objectives.map((obj, index) => (
          <div key={index}>
            <ObjectiveAccordion objective={obj} indexObj={index + 1} key={index} />
          </div>
        ))}
        <hr className="border-[1.5px] border-[#c6caff] mt-4" />

        <div className="flex justify-center pt-3">
          <button onClick={openModal} className="button-primary">
            + Nuevo Objetivo
          </button>
        </div>
      </div>

      <NewObjectiveModal isOpen={isModalOpen} onClose={closeModal} onCreate={handleCreateObjective} />
    </div>
  )
}

export default ObjectivePage
