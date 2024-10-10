import { AccountCircle } from '@mui/icons-material'
import Divider from '@mui/material/Divider'

type ActivityProps = {
  identificador: number
  nombre: string
  fechaInici: Date
  fechaFin: Date
  descripcion: string
  responsable: string | null
  resultados: string[]
  orden?: number // Agrega orden si es necesario
  onClick: () => void
  isDialogOpen?: boolean
}

const Activity: React.FC<ActivityProps> = ({ orden, nombre, responsable, onClick, fechaInici, fechaFin, isDialogOpen }) => {
  return (
    <div
      onClick={onClick}
      className="flex justify-between items-center h-12 my-2 py-2 bg-[#eef0ff] cursor-pointer text-sm text-[#1c1c1c] overflow-hidden"
    >
      <div className="flex items-center flex-shrink-0">
        <p className="mx-2.5 whitespace-nowrap">Actividad {orden}</p>
        <Divider orientation="vertical" flexItem className="border-l border-[#1c1c1c]" />
        <p className={`mx-2 text-[#5d5d5d] truncate ${isDialogOpen ? 'md:w-14 lg:w-32 xl:w-80' : 'md:w-80 lg:w-[28rem] xl:w-[45rem]'}`}>
          {nombre}
        </p>
      </div>

      <div className="flex items-center opacity-0 w-0 md:opacity-100 md:w-auto">
        <div className="flex items-center mx-2.5">
          <span className="p-1 bg-[#ffc3cc] rounded-lg text-xs">{fechaInici.toLocaleDateString()}</span>
          <hr className="mx-1 w-2.5 border-[#1c1c1c]" />
          <span className="p-1 bg-[#c6caff] rounded-lg text-xs">{fechaFin.toLocaleDateString()}</span>
        </div>

        <AccountCircle fontSize="large" />
        <span className="mx-2 whitespace-nowrap">{responsable || 'No asignado'}</span>
      </div>
    </div>
  )
}

export default Activity
