import * as Equipo from './../../../../interfaces/equipo.interface'

export const ButtonAddObservation: React.FC<Equipo.ButtonAddObservationProps> = ({ onAddObservation }) => {
  return (
    <div className="flex my-4 justify-center items-center py-1 px-2 cursor-pointer w-fit mx-auto button-primary" onClick={onAddObservation}>
      + Nueva Observación
    </div>
  )
}
