import { useEffect, useState } from 'react'
import Activity from './Components/Activity'
import DialogActivity from './Components/DialogActivity'
import { Dayjs } from 'dayjs'

type SelectedActivityState = ActivityProps | null

import React from 'react'
import { ActivityProps } from '../../interfaces/activity.interface'
import { SelectChangeEvent } from '@mui/material/Select'
import { getUsuariosGrupoEmpresa } from '../../services/grupoempresa.service'
import { UserData } from '../../interfaces/user.interface'
import { getObjectivesFromPlanification, ObjectiveData } from '../../services/objective.service'
import { createActivity, getActivities } from '../../services/activity.service'

const ActivityPage = () => {
  const [activities, setActivities] = useState<ActivityProps[]>([])
  const [selectedActivity, setSelectedActivity] = useState<SelectedActivityState>(null)
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const [responsables, setResponsables] = useState<Array<string>>([])
  const [objetivos, setObjetivos] = useState<Array<string>>([])

  useEffect(() => {
    const handleData = async () => {
      const actividades = (await getActivities()).data
      const actividadesConResultados = actividades.map((actividad: ActivityProps) => ({
        ...actividad,
        fechaInici: new Date(actividad.fechaInici),
        fechaFin: new Date(actividad.fechaFin),
      }))
      setActivities(actividadesConResultados)

      const usuarios = (await getUsuariosGrupoEmpresa()).data
      const nombresUsuarios = usuarios.map((usuario: UserData) => usuario.name)
      setResponsables(nombresUsuarios)

      const objetivos = (await getObjectivesFromPlanification()).data
      const nombresObjetivos = objetivos.map((objetivo: ObjectiveData) => objetivo.nombre)
      setObjetivos(nombresObjetivos)
    }

    handleData()
  }, [responsables, objetivos])

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
      createActivity({ ...selectedActivity, identificadorUsua: 1, identificadorObjet: 1 })
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
      resultados: [''],
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
                resultados={activity.resultados}
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
