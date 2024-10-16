import { Autocomplete, Checkbox, TextField } from '@mui/material'
import ActivityRowDelete from './Components/ActivityRowDelete'
import DeleteIcon from '@mui/icons-material/Delete'
import SearchIcon from '@mui/icons-material/Search'
import ReplayIcon from '@mui/icons-material/Replay'
import { useEffect, useState } from 'react'
import { deleteManyActivities, getActivities, searchActivitiesWithoutObjective } from '../../services/activity.service'
import { ActivityRowProps } from '../../interfaces/activity.interface'

const DeleteActivityPage = (): JSX.Element => {
  const [activities, setActivities] = useState<ActivityRowProps[]>([])
  const [selectedActivities, setSelectedActivities] = useState<number[]>([])
  const [searchNotFound, setSearchNotFound] = useState<boolean>(false)

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      let actividades

      if (e.target.value === '') {
        actividades = (await getActivities(1)).data.map((actividad) => ({
          ...actividad,
          fechaInici: new Date(actividad.fechaInici),
          fechaFin: new Date(actividad.fechaFin),
        }))
      } else {
        actividades = (await searchActivitiesWithoutObjective(e.target.value, 1)).data.map((actividad: ActivityRowProps) => ({
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

  const handleCheckboxChange = (id: number) => {
    setSelectedActivities((prevSelected) =>
      prevSelected.includes(id) ? prevSelected.filter((selectedId) => selectedId !== id) : [...prevSelected, id]
    )
  }

  const handleDeleteClick = () => {
    // console.log('Actividades a eliminar:', selectedActivities)
    deleteManyActivities(selectedActivities)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const actividades = (await getActivities(1)).data.map((actividad) => ({
          ...actividad,
          fechaInici: new Date(actividad.fechaInici),
          fechaFin: new Date(actividad.fechaFin),
        }))
        setActivities(actividades)
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
          <SearchIcon className="mx-2 cursor-pointer" fontSize="small" />
          <div className="rounded-[10px] border border-[#888888] p-0.5">
            <form>
              <input
                className="border border-transparent focus:outline-none focus:ring-2 focus:ring-transparent placeholder-gray-500 rounded-[5px] p-2"
                placeholder="Buscar actividad"
                onChange={handleSearch}
              />
            </form>
          </div>

          <label className="mx-2">Filtrar:</label>
          <Autocomplete
            disablePortal
            options={['hola', 'adios', 'algomas']}
            renderInput={(params) => <TextField {...params} label="Objetivo" />}
            className="w-48"
            size="small"
          />
          <ReplayIcon fontSize="small" className="mx-2 cursor-pointer" />
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
          />
        ))
      )}
    </>
  )
}

export default DeleteActivityPage
