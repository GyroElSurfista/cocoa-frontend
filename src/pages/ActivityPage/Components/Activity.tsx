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
  orden?: number
  onClick: () => void
  isDialogOpen?: boolean
  objetivo: string
  proyecto: string
}

const Activity: React.FC<ActivityProps> = ({ orden, nombre, responsable, onClick, fechaInici, fechaFin, objetivo, proyecto }) => {
  return (
    <div onClick={onClick} className="h-18 my-2 py-2 text-sm text-[#1c1c1c] overflow-hidden bg-[#eef0ff] cursor-pointer">
      <div className="flex justify-between items-center mx-2">
        {/* Sección izquierda con nombre y orden */}
        <div className="flex items-center flex-shrink-0 max-w-[30%]">
          <p className="whitespace-nowrap text-gray-700">Actividad {orden}</p>
          <Divider orientation="vertical" flexItem className="border-l border-[#1c1c1c] mx-2" />
          <p className="text-[#5d5d5d] truncate">{nombre}</p>
        </div>

        {/* Sección derecha con fechas, objetivo y responsable */}
        <div className="flex justify-end items-center md:space-x-6 w-full max-w-[70%]">
          {/* <p className="truncate text-gray-600 min-w-[150px] max-w-[150px]">Objetivo: {objetivo}</p> */}

          <div className="flex items-center">
            <span className="p-1 bg-[#c6caff] rounded-lg text-xs">{fechaInici.toLocaleDateString()}</span>
            <hr className="w-2 border-[#1c1c1c] mx-1" />
            <span className="p-1 bg-[#c6caff] rounded-lg text-xs">{fechaFin.toLocaleDateString()}</span>
          </div>

          <div className="flex items-center">
            <AccountCircle fontSize="large" />
            <span className="truncate text-gray-700 max-w-[80px]">{responsable || 'No asignado'}</span>
          </div>
        </div>
      </div>

      <hr className="border-[1px] border-[#c6caff]" />

      <div className="flex items-center justify-between">
        <p className="ml-6 text-[#5d5d5d]">Objetivo: {objetivo}</p>
        <p className="mr-6 text-[#5d5d5d]">
          Proyecto: <b>{proyecto}</b>
        </p>
      </div>
    </div>
  )
}

export default Activity
