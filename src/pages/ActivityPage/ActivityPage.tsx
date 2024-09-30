import { useState } from 'react'
import Button from '@mui/material/Button'
import Activity from './Components/Activity'
import DialogActivity from './Components/DialogActivity'
import { Dayjs } from 'dayjs'

export type ActivityProps = {
  identificador: number
  nombre: string
  fechaInici: Date
  fechaFin: Date
  descripcion: string
  responsable: string | null
  resultado: string
}

type SelectedActivityState = ActivityProps | null

function ActivityPage() {
  const [activities, setActivities] = useState<ActivityProps[]>([
    {
      identificador: 1,
      nombre: 'Entrevista a nuestro tutor TIS',
      fechaInici: new Date(),
      fechaFin: new Date(),
      descripcion: 'Descripcion 1 - Elicitación de requerimientos para obtener el Product Backlog.',
      responsable: null,
      resultado: 'Completar las historias de usuario con su estimación y priorización correspondiente',
    },
    {
      identificador: 2,
      nombre: 'Observar procedimiento de evaluaciones TIS',
      fechaInici: new Date(),
      fechaFin: new Date(),
      descripcion:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam mi massa, posuere vel interdum a, posuere at mauris. Cras sem est, malesuada sed libero eget, egestas vulputate turpis. Vivamus eu placerat sem. Vestibulum lobortis velit sit amet nunc faucibus, vel viverra ex accumsan. Ut imperdiet nunc neque, nec sodales risus faucibus vitae. Mauris interdum nulla in elementum vulputate. Phasellus sollicitudin vehicula ornare. Morbi id mauris fermentum, consequat nisl nec, hendrerit neque. Maecenas pharetra mattis quam. Integer quis fringilla nibh, quis lobortis massa. Quisque non vehicula enim. Nullam non lorem in sem vulputate faucibus. Interdum et malesuada fames ac ante ipsum primis in faucibus.',
      responsable: 'Winsor Orellana',
      resultado: 'Completar las historias de usuario con su estimación y priorización correspondiente',
    },
    {
      identificador: 10,
      nombre: 'Prototipado del diseño',
      fechaInici: new Date(),
      fechaFin: new Date(),
      descripcion: 'Prototipado del diseño para discutirlo junto al tutor TIS.',
      responsable: null,
      resultado: 'Prototipo base para programar en el frontend.',
    },
  ])

  const [selectedActivity, setSelectedActivity] = useState<SelectedActivityState>(null)
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)

  const responsables = ['Jairo Maida', 'Mariana Vallejos', 'Emily Callejas', 'Nahuel Torrez', 'Winsor Orellana', 'Walter Sanabria']

  const handleActivityClick = (activity: ActivityProps) => {
    setSelectedActivity(activity)
    setIsEditMode(false)
    setIsDialogOpen(true)
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setSelectedActivity(null)
  }

  const handleNewActivityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSelectedActivity((prevState) => (prevState ? { ...prevState, [name]: value } : null))
  }

  const handleNewInitialDateActivityChange = (value: Dayjs | null) => {
    if (value) {
      setSelectedActivity((prevState) => (prevState ? { ...prevState, fechaInici: value.toDate() } : null))
    }
  }

  const handleNewFinalDateActivityChange = (value: Dayjs | null) => {
    if (value) {
      setSelectedActivity((prevState) => (prevState ? { ...prevState, fechaFin: value.toDate() } : null))
    }
  }

  const handleAddNewActivity = () => {
    if (selectedActivity) {
      setActivities((prevActivities) => [...prevActivities, { ...selectedActivity, identificador: activities.length + 1 }])
      setIsDialogOpen(false)
      setSelectedActivity(null)
    }
  }

  const handleAddActivityClick = () => {
    setSelectedActivity({
      identificador: activities.length + 1,
      nombre: '',
      fechaInici: new Date(),
      fechaFin: new Date(),
      descripcion: '',
      responsable: null,
      resultado: '',
    })
    setIsEditMode(true)
    setIsDialogOpen(true)
  }

  return (
    <>
      <div className={`flex p-4 overflow-x-hidden`}>
        <div className={` ${isDialogOpen ? 'w-[65%] flex-shrink mr-4' : 'w-full'}`}>
          {activities.map((activity) => (
            <Activity
              key={activity.identificador}
              identificador={activity.identificador}
              nombre={activity.nombre}
              fechaInici={activity.fechaInici}
              fechaFin={activity.fechaFin}
              descripcion={activity.descripcion}
              responsable={activity.responsable}
              resultado={activity.resultado}
              onClick={() => handleActivityClick(activity)}
            />
          ))}
          <Button variant="contained" onClick={handleAddActivityClick}>
            Agregar actividad
          </Button>
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
    </>
  )
}

export default ActivityPage
