import { useEffect, useState } from 'react'
import ObjectiveAccordion from './Components/ObjectiveAccordion/ObjectiveAccordion'
import NewObjectiveModal from './Components/NewObjectiveModal/NewObjectiveModal'

// Propio de ActivityPage
import DialogActivity from '../ActivityPage/Components/DialogActivity'
import { Dayjs } from 'dayjs'
import { getObjectives, ObjectiveData } from '../../services/objective.service'
import { createActivity } from '../../services/activity.service'

export type ActivityProps = {
  nroActividad: number
  nombreActividad: string
  fechaInicio: Date
  fechaFin: Date
  descripcion: string
  responsable: string | null
  resultado: string
}

type SelectedActivityState = ActivityProps | null

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
  const [selectedObjectiveIndex, setSelectedObjectiveIndex] = useState<number | null>(null) // Para almacenar el índice del objetivo seleccionado
  const [selectedActivity, setSelectedActivity] = useState<SelectedActivityState>(null)
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const responsables = ['Jairo Maida', 'Mariana Vallejos', 'Emily Callejas', 'Nahuel Torrez', 'Winsor Orellana', 'Walter Sanabria']

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setSelectedActivity(null)
    setSelectedObjectiveIndex(null)
  }

  const handleNewActivityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSelectedActivity((prevState) => (prevState ? { ...prevState, [name]: value } : null))
  }

  const handleNewInitialDateActivityChange = (value: Dayjs | null) => {
    if (value) {
      setSelectedActivity((prevState) => (prevState ? { ...prevState, fechaInicio: value.toDate() } : null))
    }
  }

  const handleNewFinalDateActivityChange = (value: Dayjs | null) => {
    if (value) {
      setSelectedActivity((prevState) => (prevState ? { ...prevState, fechaFin: value.toDate() } : null))
    }
  }

  const handleAddNewActivity = async () => {
    if (selectedActivity !== null && selectedObjectiveIndex !== null) {
      console.log('Valor identificador de objective ', objectives[selectedObjectiveIndex].identificador)
      createActivity({
        nombre: selectedActivity.nombreActividad,
        descripcion: selectedActivity.descripcion,
        fechaInici: selectedActivity.fechaInicio,
        fechaFin: selectedActivity.fechaFin,
        identificadorUsua: 1,
        identificadorObjet: objectives[selectedObjectiveIndex].identificador,
      })

      const updatedObjectives = [...objectives]
      updatedObjectives[selectedObjectiveIndex].activities.push({
        ...selectedActivity,
        nroActividad: updatedObjectives[selectedObjectiveIndex].activities.length + 1,
      })
      setObjectives(updatedObjectives)
      handleDialogClose()
    }
  }

  // Utilizados por el ObjectiveAccordion
  const handleDeleteActivityClick = (objectiveIndex: number, activityIndex: number) => {
    setObjectives((prevObjectives) => {
      const updatedObjectives = [...prevObjectives]
      // console.log(objectiveIndex, activityIndex)
      updatedObjectives[objectiveIndex].activities = updatedObjectives[objectiveIndex].activities.filter(
        (_, index) => index !== activityIndex
      )
      return updatedObjectives
    })
  }

  const handleActivityClick = (activity: ActivityProps, objectiveIndex: number) => {
    setSelectedActivity(activity)
    setSelectedObjectiveIndex(objectiveIndex)
    setIsEditMode(false)
    setIsDialogOpen(true)
  }

  const handleAddActivityClick = (objectiveIndex: number) => {
    setSelectedActivity({
      nroActividad: 0,
      nombreActividad: '',
      fechaInicio: new Date(),
      fechaFin: new Date(),
      descripcion: '',
      responsable: null,
      resultado: '',
    })
    setSelectedObjectiveIndex(objectiveIndex)
    setIsEditMode(true)
    setIsDialogOpen(true)
  }

  // Propio de ObjectivePage

  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  // Función para añadir un nuevo objetivo
  const handleCreateObjective = (newObjective: Objective) => {
    setObjectives([...objectives, { ...newObjective, activities: [] }])
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
          activities: obj.actividad,
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
      <div className={'flex overflow-x-hidden'}>
        <div className={`${isDialogOpen ? 'w-[65%] flex-shrink mr-4' : 'w-full'}`}>
          {objectives.map((obj, index) => (
            <>
              <ObjectiveAccordion
                objective={obj}
                indexObj={index + 1}
                key={index}
                activities={obj.activities}
                handleActivityClick={(activity) => handleActivityClick(activity, index)}
                handleAddActivityClick={() => handleAddActivityClick(index)}
                handleDeleteActivityClick={(activityIndex) => handleDeleteActivityClick(index, activityIndex)}
              />
            </>
          ))}
          <hr className="border-[1.5px] border-[#c6caff] mt-4" />

          <div className="flex justify-center pt-3">
            <button onClick={openModal} className="button-primary">
              + Nuevo Objetivo
            </button>
          </div>
        </div>

        <DialogActivity
          activity={selectedActivity}
          isVisible={isDialogOpen}
          onHide={handleDialogClose}
          onSave={handleAddNewActivity}
          onChange={handleNewActivityChange}
          onChangeInitialDate={handleNewInitialDateActivityChange}
          onChangeFinalDate={handleNewFinalDateActivityChange}
          isEditMode={isEditMode}
          responsables={responsables}
        />
      </div>

      <NewObjectiveModal isOpen={isModalOpen} onClose={closeModal} onCreate={handleCreateObjective} />
    </div>
  )
}

export default ObjectivePage
