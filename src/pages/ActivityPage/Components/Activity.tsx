import { AccountCircle, Delete } from '@mui/icons-material'
import Divider from '@mui/material/Divider'

type ActivityProps = {
  identificador: number
  orden: number
  nombre: string
  fechaInici: Date
  fechaFin: Date
  descripcion: string
  responsable: string | null
  resultado: string
  onClick: () => void
  onDelete: () => void
}

const Activity: React.FC<ActivityProps> = ({ orden, nombre, responsable, onClick, onDelete }) => {
  return (
    <div onClick={onClick} className="flex text-sm bg-[#EEF0FF] my-2 py-2 items-center cursor-pointer justify-between">
      <div className="flex items-center">
        <div className="flex flex-shrink-0 items-center">
          <p className="text-center mx-2">Actividad {orden}</p>
          <Divider orientation="vertical" flexItem variant="fullWidth" color="black" />
        </div>
        <p className="truncate mx-2">{nombre}</p>
      </div>

      <div className="flex items-center sm:opacity-0 lg:opacity-100">
        <AccountCircle fontSize="large" />
        <p className="mx-2">{responsable === null || responsable === undefined ? 'No asignado' : responsable}</p>
        <Delete
          fontSize="large"
          className="mx-2 hover:fill-red-600"
          onClick={(event) => {
            event.stopPropagation()
            onDelete()
          }}
        />
      </div>
    </div>
  )
}

export default Activity
