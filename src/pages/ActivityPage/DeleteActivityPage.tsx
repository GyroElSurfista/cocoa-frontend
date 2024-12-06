import { Alert, Autocomplete, Checkbox, Snackbar, SnackbarCloseReason, TextField } from '@mui/material'
import ActivityRowDelete from './Components/ActivityRowDelete'
import DeleteIcon from '@mui/icons-material/Delete'
import SearchIcon from '@mui/icons-material/Search'
import ReplayIcon from '@mui/icons-material/Replay'
import { SyntheticEvent, useEffect, useState } from 'react'
import {
  deleteManyActivities,
  getActivities,
  getActivitiesByObjective,
  searchActivitiesWithObjective,
  searchActivitiesWithoutObjective,
} from '../../services/activity.service'
import { ActivityRowProps } from '../../interfaces/activity.interface'
import { getObjectives, getObjectivesFromPlanification, ObjectiveData } from '../../services/objective.service'
import ModalConfirmation from '../../components/ModalConfirmation'

const DeleteActivityPage = (): JSX.Element => {
  const [activities, setActivities] = useState<ActivityRowProps[]>([])
  const [objectives, setObjectives] = useState<ObjectiveData[]>([])
  const [selectedObjective, setSelectedObjective] = useState<ObjectiveData | null>(null) // Almacenar el objetivo seleccionado
  const [selectedActivities, setSelectedActivities] = useState<number[]>([])
  const [searchNotFound, setSearchNotFound] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>('') // Almacenar el término de búsqueda
  const [resetKey, setResetKey] = useState<number>(0)
  const [open, setOpen] = useState<boolean>(false)
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
  const [noErrors, setNoErrors] = useState<boolean>(true)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  // Función para manejar la búsqueda
  const handleSearch = async () => {
    try {
      let actividades
      if (searchTerm === '' || searchTerm === undefined) {
        // Si no hay término de búsqueda
        if (selectedObjective) {
          // Si solo hay un objetivo seleccionado
          actividades = (await getActivitiesByObjective(selectedObjective.identificador)).data.data.map((actividad) => ({
            ...actividad,
            fechaInici: new Date(actividad.fechaInici),
            fechaFin: new Date(actividad.fechaFin),
          }))
        } else {
          // Si no hay búsqueda ni objetivo, obtener todas las actividades
          actividades = (await getActivities(3)).data.data.map((actividad) => ({
            ...actividad,
            fechaInici: new Date(actividad.fechaInici),
            fechaFin: new Date(actividad.fechaFin),
          }))
        }
      } else if (selectedObjective) {
        // Si hay un objetivo y también una búsqueda
        actividades = (await searchActivitiesWithObjective(searchTerm, selectedObjective.identificador, 3)).data.map(
          (actividad: ActivityRowProps) => ({
            ...actividad,
            fechaInici: new Date(actividad.fechaInici),
            fechaFin: new Date(actividad.fechaFin),
          })
        )
      } else {
        // Si solo hay búsqueda pero no hay objetivo
        actividades = (await searchActivitiesWithoutObjective(searchTerm, 3)).data.map((actividad: ActivityRowProps) => ({
          ...actividad,
          fechaInici: new Date(actividad.fechaInici),
          fechaFin: new Date(actividad.fechaFin),
        }))
      }

      if (actividades.length === 0) setSearchNotFound(true)
      else setSearchNotFound(false)
      // setActivities(actividades)
      setActivities(actividades.filter((actividad) => actividad.esEliminable === true))
    } catch (error) {
      console.error('Error al buscar actividades', error)
      setActivities([])
      setSearchNotFound(true)
    }
  }

  // Manejar el cambio en el Checkbox
  const handleCheckboxChange = (id: number) => {
    setSelectedActivities((prevSelected) =>
      prevSelected.includes(id) ? prevSelected.filter((selectedId) => selectedId !== id) : [...prevSelected, id]
    )
  }

  const handleToggleAllCheckboxes = () => {
    if (selectedActivities.length === activities.filter((actividad) => actividad.esEliminable).length) {
      setSelectedActivities([]) // Desmarcar todos
    } else {
      const allActivityIds = activities.filter((actividad) => actividad.esEliminable).map((actividad) => actividad.identificador)
      console.log(allActivityIds)
      setSelectedActivities(allActivityIds as number[]) // Marcar todos los eliminables
    }
  }

  // Función para eliminar las actividades seleccionadas
  const handleDeleteClick = async () => {
    await deleteManyActivities(selectedActivities)
    const actividades = (await getActivities(3)).data.data.map((actividad) => ({
      ...actividad,
      fechaInici: new Date(actividad.fechaInici),
      fechaFin: new Date(actividad.fechaFin),
    }))
    setActivities(actividades.filter((actividad) => actividad.esEliminable === true))
    setSelectedActivities([])
    setOpen(false)
    setNoErrors(true)
    setOpenSnackbar(true)
  }

  // Función para manejar la selección de un objetivo
  const handleObjectiveSelect = async (_event: SyntheticEvent<Element, Event>, value: ObjectiveData | null) => {
    if (value) setSelectedObjective(value)
    else setSelectedObjective(null)
  }

  const handleReset = async () => {
    setSearchTerm('')
    setSelectedObjective(null)
    setSearchNotFound(false)
    setResetKey((prevKey) => prevKey + 1)
    const actividades = (await getActivities(3)).data.data.map((actividad) => ({
      ...actividad,
      fechaInici: new Date(actividad.fechaInici),
      fechaFin: new Date(actividad.fechaFin),
    }))
    setActivities(actividades.filter((actividad) => actividad.esEliminable === true))
  }

  const handleCloseSnackbar = (_event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenSnackbar(false)
  }

  // Cargar actividades y objetivos al cargar la página
  useEffect(() => {
    const fetchData = async () => {
      try {
        const actividades = (await getActivities(3)).data.data.map((actividad) => ({
          ...actividad,
          fechaInici: new Date(actividad.fechaInici),
          fechaFin: new Date(actividad.fechaFin),
        }))
        setActivities(actividades) // setActivities(actividades.filter((actividad) => actividad.esEliminable === true))
        const objetivos = (await getObjectivesFromPlanification(3)).data
        setObjectives(objetivos)
      } catch (error) {
        console.error('Error al cargar los datos', error)
      }
    }

    fetchData()
  }, [])

  return (
    <>
      <div className="flex justify-between items-end mb-2">
        <h2 className="text-black text-2xl font-semibold mx-6">Eliminar actividades</h2>
        <div className="flex items-center">
          <SearchIcon className="hover:fill-blue-400 mx-2 cursor-pointer" fontSize="small" onClick={handleSearch} />
          <div className="rounded-[10px] border border-[#888888] p-0.5">
            <form>
              <input
                className="border border-transparent focus:outline-none focus:ring-2 focus:ring-transparent placeholder-gray-500 rounded-[5px] p-2"
                placeholder="Buscar actividad"
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setSearchTerm(e.target.value)
                }}
              />
            </form>
          </div>

          <label className="mx-2">Filtrar:</label>
          <Autocomplete
            key={resetKey}
            disablePortal
            options={objectives}
            getOptionLabel={(option) => `${option.nombre}`}
            value={selectedObjective || null}
            onChange={handleObjectiveSelect}
            renderInput={(params) => <TextField {...params} label="Objetivo" />}
            className="w-48"
            size="small"
          />
          <ReplayIcon fontSize="small" className="hover:fill-blue-400 mx-2 cursor-pointer" onClick={handleReset} />
        </div>
      </div>

      <hr className="border-[1.5px] border-[#c6caff]" />
      <div className="flex justify-end items-center">
        <label>Eliminar</label>
        <DeleteIcon
          fontSize="medium"
          onClick={() => {
            if (selectedActivities.length > 0) handleOpen()
            else {
              setNoErrors(false)
              setOpenSnackbar(true)
            }
          }}
          className="hover:fill-red-500 cursor-pointer"
        />
        <Checkbox
          sx={{
            color: 'black',
            '&.Mui-checked': {
              color: 'black',
            },
          }}
          checked={
            selectedActivities.length === activities.filter((actividad) => actividad.esEliminable).length &&
            activities.filter((actividad) => actividad.esEliminable).length > 0
          } // Controlar si está marcado
          onChange={handleToggleAllCheckboxes}
        />
      </div>
      <hr className="border-[1.5px] border-[#c6caff]" />

      {searchNotFound ? (
        <h3 className="flex justify-center font-semibold mt-2">No existen coincidencias</h3>
      ) : activities.length === 0 ? (
        <h3 className="flex justify-center font-semibold mt-2">No existen actividades disponibles</h3>
      ) : (
        activities.map(
          (actividad, index) =>
            !actividad.esEliminable && (
              <ActivityRowDelete
                key={actividad.identificador}
                fechaFin={actividad.fechaFin}
                fechaInici={actividad.fechaInici}
                index={index + 1}
                nombre={actividad.nombre}
                responsable={actividad.responsable}
                identificador={actividad.identificador}
                objetivo={actividad.objetivo}
                proyecto={actividad.proyecto}
                onCheckboxChange={handleCheckboxChange}
                checked={selectedActivities.includes(actividad.identificador)}
                esEliminable={true}
              />
            )
        )
      )}

      <ModalConfirmation
        open={open}
        text="¿Esta seguro de eliminar la(s) actividad(es) seleccionada(s)?"
        handleClose={handleClose}
        handleConfirm={handleDeleteClick}
      />

      <Snackbar
        autoHideDuration={5000}
        open={openSnackbar}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {noErrors ? (
          <Alert severity="success">Actividad(es) eliminada(s) existosamente</Alert>
        ) : (
          <Alert severity="warning">No seleccionaste ninguna actividad para eliminar</Alert>
        )}
      </Snackbar>
    </>
  )
}

export default DeleteActivityPage
