import { AccountCircle } from '@mui/icons-material'
import { Checkbox, Divider } from '@mui/material'
import { ActivityRowProps } from '../../../interfaces/activity.interface'

interface ActivityRowDeleteProps extends ActivityRowProps {
  onCheckboxChange: (id: number) => void
  checked: boolean
}

const ActivityRowDelete = ({
  fechaFin,
  fechaInici,
  index,
  nombre,
  responsable,
  identificador,
  onCheckboxChange,
  checked,
}: ActivityRowDeleteProps): JSX.Element => {
  return (
    <div className="flex justify-between items-center h-12 my-2 py-2 bg-[#eef0ff] text-sm text-[#1c1c1c] overflow-hidden">
      <div className="flex items-center flex-shrink-0">
        <p className="mx-2.5 whitespace-nowrap">Actividad {index}</p>
        <Divider orientation="vertical" flexItem className="border-l border-[#1c1c1c]" />
        <p className={`mx-2 text-[#5d5d5d]`}>{nombre}</p>
      </div>

      <div className="flex items-center opacity-0 w-0 md:opacity-100 md:w-auto">
        <div className="flex items-center mx-2.5">
          <span className="p-1 bg-[#ffc3cc] rounded-lg text-xs">{fechaInici.toLocaleDateString()}</span>
          <hr className="mx-1 w-2.5 border-[#1c1c1c]" />
          <span className="p-1 bg-[#c6caff] rounded-lg text-xs">{fechaFin.toLocaleDateString()}</span>
        </div>

        <AccountCircle fontSize="large" />
        <span className="mx-2 whitespace-nowrap">{responsable || 'No asignado'}</span>
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
      </div>
    </div>
  )
}

export default ActivityRowDelete
