import { Autocomplete, Checkbox, TextField } from '@mui/material'
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
import { getObjectivesFromPlanification, ObjectiveData } from '../../services/objective.service'

const DeleteActivityPage = (): JSX.Element => {
  const [activities, setActivities] = useState<ActivityRowProps[]>([])
  const [objectives, setObjectives] = useState<ObjectiveData[]>([])
  const [selectedObjective, setSelectedObjective] = useState<ObjectiveData | null>(null) // Almacenar el objetivo seleccionado
  const [selectedActivities, setSelectedActivities] = useState<number[]>([])
  const [searchNotFound, setSearchNotFound] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>('') // Almacenar el término de búsqueda
  const [resetKey, setResetKey] = useState<number>(0)

  // Función para manejar la búsqueda
  const handleSearch = async () => {
    try {
      let actividades
      if (searchTerm === '' || searchTerm === undefined) {
        // Si no hay término de búsqueda
        if (selectedObjective) {
          // Si solo hay un objetivo seleccionado
          actividades = (await getActivitiesByObjective(selectedObjective.identificador)).data.map((actividad) => ({
            ...actividad,
            fechaInici: new Date(actividad.fechaInici),
            fechaFin: new Date(actividad.fechaFin),
          }))
        } else {
          // Si no hay búsqueda ni objetivo, obtener todas las actividades
          actividades = (await getActivities(1)).data.map((actividad) => ({
            ...actividad,
            fechaInici: new Date(actividad.fechaInici),
            fechaFin: new Date(actividad.fechaFin),
          }))
        }
      } else if (selectedObjective) {
        // Si hay un objetivo y también una búsqueda
        actividades = (await searchActivitiesWithObjective(searchTerm, selectedObjective.identificador, 1)).data.map(
          (actividad: ActivityRowProps) => ({
            ...actividad,
            fechaInici: new Date(actividad.fechaInici),
            fechaFin: new Date(actividad.fechaFin),
          })
        )
      } else {
        // Si solo hay búsqueda pero no hay objetivo
        actividades = (await searchActivitiesWithoutObjective(searchTerm, 1)).data.map((actividad: ActivityRowProps) => ({
          ...actividad,
          fechaInici: new Date(actividad.fechaInici),
          fechaFin: new Date(actividad.fechaFin),
        }))
      }

      setSearchNotFound(false)
      setActivities(actividades)
    } catch (error) {
      console.error('Error al buscar actividades', error)
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
    if (selectedActivities.length === activities.length) {
      setSelectedActivities([]) // Desmarcar todos
    } else {
      const allActivityIds = activities.map((activity) => activity.identificador)
      setSelectedActivities(allActivityIds) // Marcar todos
    }
  }

  // Función para eliminar las actividades seleccionadas
  const handleDeleteClick = () => {
    deleteManyActivities(selectedActivities)
  }

  // Función para manejar la selección de un objetivo
  const handleObjectiveSelect = async (event: SyntheticEvent<Element, Event>, value: ObjectiveData | null) => {
    setSelectedObjective(value)
  }

  const handleReset = async () => {
    setSearchTerm('')
    setSelectedObjective(null)
    setSearchNotFound(false)
    setResetKey((prevKey) => prevKey + 1)
    const actividades = (await getActivities(1)).data.map((actividad) => ({
      ...actividad,
      fechaInici: new Date(actividad.fechaInici),
      fechaFin: new Date(actividad.fechaFin),
    }))
    setActivities(actividades)
  }

  // Cargar actividades y objetivos al cargar la página
  useEffect(() => {
    const fetchData = async () => {
      try {
        const actividades = (await getActivities(1)).data.map((actividad) => ({
          ...actividad,
          fechaInici: new Date(actividad.fechaInici),
          fechaFin: new Date(actividad.fechaFin),
        }))
        setActivities(actividades)
        const objetivos = (await getObjectivesFromPlanification()).data
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
        <h2 className="text-black text-2xl font-semibold">Eliminar actividades</h2>
        <div className="flex items-center">
          <SearchIcon className="mx-2 cursor-pointer" fontSize="small" onClick={handleSearch} />
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
            getOptionLabel={(option) => option.nombre}
            value={selectedObjective || null}
            onChange={handleObjectiveSelect}
            renderInput={(params) => <TextField {...params} label="Objetivo" />}
            className="w-48"
            size="small"
          />
          <ReplayIcon fontSize="small" className="mx-2 cursor-pointer" onClick={handleReset} />
        </div>
      </div>

      <hr className="border-[1.5px] border-[#c6caff]" />
      <div className="flex justify-end items-center">
        <label>Eliminar</label>
        <DeleteIcon fontSize="medium" onClick={handleDeleteClick} />
        <Checkbox
          sx={{
            color: 'black',
            '&.Mui-checked': {
              color: 'black',
            },
          }}
          checked={selectedActivities.length === activities.length} // Controlar si está marcado
          onChange={handleToggleAllCheckboxes}
        />
      </div>
      <hr className="border-[1.5px] border-[#c6caff]" />

      {searchNotFound ? (
        <h3 className="flex justify-center font-semibold mt-2">No se encuentran actividades relacionadas con la búsqueda</h3>
      ) : (
        activities.map((actividad, index) => (
          <ActivityRowDelete
            key={actividad.identificador}
            fechaFin={actividad.fechaFin}
            fechaInici={actividad.fechaInici}
            index={index + 1}
            nombre={actividad.nombre}
            responsable={actividad.responsable}
            identificador={actividad.identificador}
            onCheckboxChange={handleCheckboxChange}
            checked={selectedActivities.includes(actividad.identificador)}
          />
        ))
      )}
    </>
  )
}

export default DeleteActivityPage
