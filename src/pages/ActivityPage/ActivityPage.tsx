import { useEffect, useState, useCallback, SyntheticEvent } from 'react'
import Activity from './Components/Activity'
import DialogActivity from './Components/DialogActivity'
import { Dayjs } from 'dayjs'
import { ActivityProps } from '../../interfaces/activity.interface'
import { getUsuariosGrupoEmpresa } from '../../services/grupoempresa.service'
import { UserData } from '../../interfaces/user.interface'
import { getObjectivesFromPlanification, ObjectiveData } from '../../services/objective.service'
import { createActivity, getActivities } from '../../services/activity.service'
import { Alert, Snackbar } from '@mui/material'

const ActivityPage = (): JSX.Element => {
  const [activities, setActivities] = useState<ActivityProps[]>([])
  const [selectedActivity, setSelectedActivity] = useState<ActivityProps | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const [responsables, setResponsables] = useState<string[]>([])
  const [objetivos, setObjetivos] = useState<ObjectiveData[]>([])
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)

  // Cargar actividades, responsables y objetivos solo una vez al montar el componente
  useEffect(() => {
    const loadData = async () => {
      try {
        // Obtener actividades y convertir fechas a Date
        const actividades = (await getActivities(1)).data.map((actividad) => ({
          ...actividad,
          fechaInici: new Date(actividad.fechaInici),
          fechaFin: new Date(actividad.fechaFin),
        }))
        setActivities(actividades)

        // Obtener responsables
        const usuarios = (await getUsuariosGrupoEmpresa()).data
        const nombresUsuarios = usuarios.map((usuario: UserData) => usuario.name)
        setResponsables(nombresUsuarios)

        // Obtener objetivos
        const objetivosData = (await getObjectivesFromPlanification()).data
        setObjetivos(objetivosData)
      } catch (error) {
        console.error('Error al cargar los datos', error)
      }
    }

    loadData()
  }, []) // Se ejecuta solo una vez al montar el componente

  // Manejo de eventos
  const handleActivityClick = useCallback((activity: ActivityProps) => {
    setSelectedActivity(activity)
    setIsEditMode(false)
    setIsDialogOpen(true)
  }, [])

  const handleDialogClose = useCallback(() => {
    setIsDialogOpen(false)
    setSelectedActivity(null)
  }, [])

  const handleNewActivityChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setSelectedActivity((prev) => (prev ? { ...prev, [name]: value } : null))
  }, [])

  const handleNewObjectiveActivityChange = useCallback(
    (_event: SyntheticEvent<Element, Event>, value: { identificadorObjet: number | undefined; nombre: string } | null) => {
      console.log('value', value)
      setSelectedActivity((prev) =>
        prev
          ? {
              ...prev,
              objetivo: value?.nombre === undefined ? '' : value.nombre,
              identificadorObjet: value?.identificadorObjet,
            }
          : null
      )
    },
    []
  )

  const handleNewInitialDateActivityChange = useCallback((value: Dayjs | null) => {
    if (value) {
      setSelectedActivity((prev) => (prev ? { ...prev, fechaInici: value.toDate() } : null))
    }
  }, [])

  const handleNewFinalDateActivityChange = useCallback((value: Dayjs | null) => {
    if (value) {
      setSelectedActivity((prev) => (prev ? { ...prev, fechaFin: value.toDate() } : null))
    }
  }, [])

  const handleAddNewActivity = useCallback(() => {
    if (selectedActivity) {
      setActivities((prevActivities) => [...prevActivities, { ...selectedActivity, identificador: activities.length + 1 }])
      createActivity({ ...selectedActivity })
      setIsDialogOpen(false)
      setSelectedActivity(null)
      setOpenSnackbar(true)
    }
  }, [selectedActivity, activities.length])

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
      identificadorUsua: 1,
      identificadorObjet: 0,
    })
    setIsEditMode(true)
    setIsDialogOpen(true)
  }

  const handleCloseSnackbar = (_event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenSnackbar(false)
  }

  return (
    <>
      <h2 className="text-black text-2xl font-semibold">Actividades</h2>
      <hr className="border-[1.5px] border-[#c6caff]" />
      <div className="flex overflow-x-hidden">
        <div className={`${isDialogOpen ? 'w-[65%] mr-4' : 'w-full'}`}>
          {activities.length > 0 ? (
            activities.map((activity, index) => (
              <Activity
                key={activity.identificador}
                {...activity}
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

        <Snackbar
          autoHideDuration={5000}
          open={openSnackbar}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Alert severity="success">Actividad creada exitosamente</Alert>
        </Snackbar>
      </div>
    </>
  )
}

export default ActivityPage
