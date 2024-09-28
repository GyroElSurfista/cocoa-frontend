import { AccountCircle } from '@mui/icons-material'
import Divider from '@mui/material/Divider'

type ActivityProps = {
  nroActividad: number
  nombreActividad: string
  fechaInicio: Date
  fechaFin: Date
  descripcion: string
  responsable: string | null
  resultado: string
  onClick: () => void
}

const Activity: React.FC<ActivityProps> = ({ nroActividad, nombreActividad, responsable, onClick }) => {
  return (
    <div onClick={onClick} className="flex text-sm bg-[#EEF0FF] my-2 py-2 items-center cursor-pointer justify-between">
      <div className="flex items-center">
        <div className="flex flex-shrink-0 items-center">
          <p className="text-center mx-2">Actividad {nroActividad}</p>
          <Divider orientation="vertical" flexItem variant="fullWidth" color="black" />
        </div>
        <p className="truncate mx-2">{nombreActividad}</p>
      </div>

      <div className="flex items-center sm:opacity-0 lg:opacity-100">
        <AccountCircle fontSize="large" />
        <p className="mx-2">{responsable === null ? 'No asignado' : responsable}</p>
      </div>
    </div>
  )
}

export default Activity