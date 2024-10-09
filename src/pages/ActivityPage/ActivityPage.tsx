import { useEffect, useState } from 'react'
import Activity from './Components/Activity'
import DialogActivity from './Components/DialogActivity'
import { Dayjs } from 'dayjs'

type SelectedActivityState = ActivityProps | null

import React from 'react'
import { ActivityProps } from '../../interfaces/activity.interface'
import { SelectChangeEvent } from '@mui/material/Select'

const ActivityPage = () => {
  const [activities, setActivities] = useState<ActivityProps[]>([
    {
      identificador: 1,
      nombre:
        'Observar procedimiento de evaluaciones TIS, Observar procedimiento de evaluaciones TIS, Observar procedimiento de evaluaciones TIS',
      fechaInici: new Date(),
      fechaFin: new Date(),
      descripcion: 'Descripcion 1 - Elicitación de requerimientos para obtener el Product Backlog.',
      responsable: null,
      resultado: ['Completar las historias de usuario con su estimación y priorización correspondiente', 'Res 2'],
      objetivo: 'Objetivo 1: Registros iniciales',
    },
    {
      identificador: 2,
      nombre: 'Observar procedimiento de evaluaciones TIS, Observar procedimiento de evaluaciones TIS',
      fechaInici: new Date(),
      fechaFin: new Date(),
      descripcion:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam mi massa, posuere vel interdum a, posuere at mauris. Cras sem est, malesuada sed libero eget, egestas vulputate turpis. Vivamus eu placerat sem. Vestibulum lobortis velit sit amet nunc faucibus, vel viverra ex accumsan. Ut imperdiet nunc neque, nec sodales risus faucibus vitae. Mauris interdum nulla in elementum vulputate. Phasellus sollicitudin vehicula ornare. Morbi id mauris fermentum, consequat nisl nec, hendrerit neque. Maecenas pharetra mattis quam. Integer quis fringilla nibh, quis lobortis massa. Quisque non vehicula enim. Nullam non lorem in sem vulputate faucibus. Interdum et malesuada fames ac ante ipsum primis in faucibus.',
      responsable: 'Winsor Orellana',
      resultado: ['Completar las historias de usuario con su estimación y priorización correspondiente', 'Resultado 2'],
      objetivo: 'Objetivo 2: Generar planillas completas',
    },
    {
      identificador: 10,
      nombre: 'Prototipado del diseño',
      fechaInici: new Date(),
      fechaFin: new Date(),
      descripcion: 'Prototipado del diseño para discutirlo junto al tutor TIS.',
      responsable: null,
      resultado: ['Prototipo base para programar en el frontend.', 'Resultado 2', 'Resultado 3'],
      objetivo: 'Objetivo 3: Registros iniciales y generar planillas completas',
    },
  ])
  const [selectedActivity, setSelectedActivity] = useState<SelectedActivityState>(null)
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const [responsables, setResponsables] = useState<Array<string>>([])
  const [objetivos, setObjetivos] = useState<Array<string>>([])

  useEffect(() => {
    setResponsables(['Jairo Maida', 'Mariana Vallejos', 'Emily Callejas', 'Nahuel Torrez', 'Winsor Orellana', 'Walter Sanabria'])
    setObjetivos([
      'Objetivo 1: Registros iniciales',
      'Objetivo 2: Generar planillas completas',
      'Objetivo 3: Registros iniciales y generar planillas completas',
    ])
  }, [])

  const handleActivityClick = (activity: ActivityProps) => {
    setSelectedActivity(activity)
    setIsEditMode(false)
    setIsDialogOpen(true)
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setSelectedActivity(null)
  }

  const handleNewActivityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setSelectedActivity((prevState) => (prevState ? { ...prevState, [name]: value } : null))
  }

  const handleNewObjectiveActivityChange = (e: SelectChangeEvent<string>) => {
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
      resultado: [''],
      objetivo: '',
    })
    setIsEditMode(true)
    setIsDialogOpen(true)
  }

  return (
    <>
      <h2 className="text-black text-2xl font-semibold">Actividades</h2>
      <hr className="border-[1.5px] border-[#c6caff]" />
      <div className={'flex overflow-x-hidden'}>
        <div className={`${isDialogOpen ? 'w-[65%] mr-4' : 'w-full'}`}>
          {activities.length > 0 ? (
            activities.map((activity, index) => (
              <Activity
                key={activity.identificador}
                identificador={activity.identificador}
                nombre={activity.nombre}
                fechaInici={activity.fechaInici}
                fechaFin={activity.fechaFin}
                descripcion={activity.descripcion}
                responsable={activity.responsable}
                resultado={activity.resultado}
                orden={index + 1}
                onClick={() => handleActivityClick(activity)}
                isDialogOpen={isDialogOpen}
              />
            ))
          ) : (
            <h3 className="my-2 text-center text-black text-xl font-semibold">No existen actividades registradas</h3>
          )}
          <hr className="border-[1.5px] border-[#c6caff]" />
          <div className="flex justify-center mt-4">
            <button onClick={handleAddActivityClick} className="button-primary">
              + Nueva Actividad
            </button>
          </div>
        </div>

        <DialogActivity
          activity={selectedActivity}
          isVisible={isDialogOpen}
          onHide={handleDialogClose}
          onSave={handleAddNewActivity}
          onChange={handleNewActivityChange}
          onChangeObjective={handleNewObjectiveActivityChange}
          onChangeInitialDate={handleNewInitialDateActivityChange}
          onChangeFinalDate={handleNewFinalDateActivityChange}
          isEditMode={isEditMode}
          responsables={responsables}
          objetivos={objetivos}
        />
      </div>
    </>
  )
}

export default ActivityPage
