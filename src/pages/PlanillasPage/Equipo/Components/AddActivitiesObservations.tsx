import React from 'react'
import IconTrash from './../../../../assets/trash.svg'

interface AddActivitiesObservationsProps {
  activity: { nombre: string; observaciones: { descripcion: string }[] }
  activityIndex: number
  onActivityChange: (activityIndex: number, newValue: string) => void
  onAddObservation: () => void
  onObservationChange: (activityIndex: number, observationIndex: number, newValue: string) => void
  onDeleteActivity: () => void
  onDeleteObservation: (activityIndex: number, observationIndex: number) => void
  isReadOnly: boolean
}

export const AddActivitiesObservations: React.FC<AddActivitiesObservationsProps> = ({
  activity,
  activityIndex,
  onActivityChange,
  onAddObservation,
  onObservationChange,
  onDeleteActivity,
  isReadOnly,
}) => {
  return (
    <div className="mb-4">
      <h3 className="font-semibold text-xl">Nombre de Actividad</h3>
      <div className="flex">
        <div className="mb-2 items-center gap-[20px] self-stretch rounded-[8px] border-[2px] border-[#FFC3CC] bg-white shadow-md w-full">
          <div className="flex items-center justify-between rounded-lg w-full">
            <input
              type="text"
              value={activity.nombre}
              onChange={(e) => onActivityChange(activityIndex, e.target.value)}
              className="text-left mx-2 w-full resize-none border-none rounded-[8px] focus:outline-none focus:ring-2 focus:ring-blue-500 my-2"
              placeholder="Nombre de actividad"
              disabled={isReadOnly}
            />
          </div>
        </div>
        {!isReadOnly && <img src={IconTrash} alt="Eliminar actividad" onClick={onDeleteActivity} className="cursor-pointer" />}
      </div>

      <h3 className="font-semibold text-xl">Observaciones</h3>
      {(activity.observaciones || []).map((observacion, observationIndex) => (
        <div
          key={observationIndex}
          className="items-center gap-[20px] self-stretch rounded-[8px] border-[2px] border-[#FFC3CC] bg-white shadow-md w-full mb-2"
        >
          <div className="flex items-center justify-between rounded-lg w-full">
            <textarea
              value={observacion.descripcion}
              onChange={(e) => onObservationChange(activityIndex, observationIndex, e.target.value)}
              className="text-left mx-2 w-full resize-none border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 my-2"
              placeholder="Describa su observación"
              disabled={isReadOnly}
            />
          </div>
        </div>
      ))}
      {!isReadOnly && (
        <div className="flex justify-center items-center ">
          <button
            onClick={onAddObservation}
            className="my-4 px-4 py-1 rounded-lg bg-[#8D0F21] text-white shadow-md text-base font-normal transition duration-300 ease-in-out hover:bg-[#4a171f] whitespace-nowrap"
          >
            + Nueva Observación
          </button>
        </div>
      )}
    </div>
  )
}
