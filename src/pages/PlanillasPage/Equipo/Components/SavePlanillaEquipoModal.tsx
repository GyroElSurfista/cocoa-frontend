import IconDanger from '../../../../assets/ico-danger.svg'
import * as Equipo from './../../../../interfaces/equipo.interface'

export const SavePlanillaEquipoModal: React.FC<Equipo.SavePlanillaEquipoModalProps> = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white w-[375px] max-w-lg p-6 rounded-[20px] shadow-lg">
        <div className="flex justify-center">
          <img src={IconDanger} alt="" />
        </div>
        <h5 className="text-xl font-semibold text-center my-2">¿Guardar planilla de seguimiento?</h5>
        <p className="font-inter font-normal mb-2 text-sm text-center">
          Al guardar esta planilla, ya no podrá eliminar observaciones ni editar planilla.
        </p>
        <div className="mt-4 flex justify-center gap-2">
          <button type="button" className="button-secondary_outlined" onClick={onCancel}>
            Cancelar
          </button>
          <button type="button" className="button-primary" onClick={onConfirm}>
            Aceptar
          </button>
        </div>
      </div>
    </div>
  )
}
