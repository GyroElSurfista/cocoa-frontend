import DangerIcon from '../../../assets/ico-danger.svg'
import TaskAltIcon from '@mui/icons-material/TaskAlt'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  porcentaje: number
}

const ConfirmationModal = ({ isOpen, onClose, onConfirm, porcentaje }: ConfirmationModalProps) => {
  const handleCancel = () => {
    onClose()
  }
  const handleAccept = () => {
    onConfirm()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-lg p-5 rounded-[20px] shadow-lg">
        <div className="flex justify-center items-center pb-3">
          <img src={DangerIcon} alt="Danger Icon" />
        </div>
        <div className="text-center">
          <p className="font-bold text-red text-[#f20519]">{porcentaje}% de los criterios cumplido</p>
          <p className="">
            La planilla
            <span className="font-bold uppercase"> {porcentaje === 100 ? 'SI' : 'NO'}</span> está habilitada para su pago
          </p>
          <p className="pb-1 pt-3 font-bold text-lg">¿Desea guardar esta planilla?</p>
        </div>
        <div className="flex justify-center pt-4">
          <button onClick={handleCancel} className="button-secondary_outlined mr-3">
            Cancelar
          </button>
          <button onClick={handleAccept} className="button-primary">
            Aceptar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal
