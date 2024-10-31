import { AccountCircle } from '@mui/icons-material'
import { Checkbox, Divider } from '@mui/material'
import { ActivityRowProps } from '../../../interfaces/activity.interface'

interface ActivityRowDeleteProps extends ActivityRowProps {
  onCheckboxChange?: (id: number) => void
  checked?: boolean
}

const ActivityRowDelete = ({
  fechaFin,
  fechaInici,
  index,
  nombre,
  responsable,
  esEliminable,
  identificador,
  proyecto,
  objetivo,
  onCheckboxChange,
  checked,
}: ActivityRowDeleteProps): JSX.Element => {
  return (
    <div className={`h-18 my-2 py-2 text-sm text-[#1c1c1c] overflow-hidden ${esEliminable ? 'bg-[#eef0ff]' : 'bg-[#e7e7e7]'}`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center flex-shrink-0">
          <p className="mx-2.5 whitespace-nowrap">Actividad {index}</p>
          <Divider orientation="vertical" flexItem className="border-l border-[#1c1c1c]" />
          <p className={`mx-2 text-[#5d5d5d]`}>{nombre}</p>
        </div>

        <div className="flex items-center opacity-0 w-0 md:opacity-100 md:w-auto">
          <div className="flex items-center mx-2.5">
            <span className={`p-1 rounded-lg text-xs ${esEliminable ? 'bg-[#c6caff]' : 'bg-[#d1d1d1]'}`}>
              {fechaInici.toLocaleDateString()}
            </span>
            <hr className="mx-1 w-2.5 border-[#1c1c1c]" />
            <span className={`p-1 rounded-lg text-xs ${esEliminable ? 'bg-[#c6caff]' : 'bg-[#d1d1d1]'}`}>
              {fechaFin.toLocaleDateString()}
            </span>
          </div>

          <AccountCircle fontSize="large" />
          <span className={`whitespace-nowrap ${esEliminable ? 'mx-2' : 'mr-12'}`}>{responsable || 'No asignado'}</span>
          {esEliminable ? (
            <Checkbox
              sx={{
                color: 'black',
                '&.Mui-checked': {
                  color: 'black',
                },
              }}
              checked={checked} // Reflejar el estado del checkbox
              onChange={() => onCheckboxChange(identificador)} // Notificar al padre sobre el cambio
            />
          ) : (
            <></>
          )}
        </div>
      </div>

      <hr className="border-[1px] border-[#c6caff]" />

      <div className="flex items-center justify-between">
        <p className="ml-6 text-[#5d5d5d]">Objetivo: {objetivo}</p>
        <p className="mr-12 text-[#5d5d5d]">
          Proyecto: <b>{proyecto}</b>
        </p>
      </div>
    </div>
  )
}

export default ActivityRowDelete
