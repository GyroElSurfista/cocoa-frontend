interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

const ConfirmationModal = ({ isOpen, onClose, onConfirm }: ConfirmationModalProps) => {
  const handleCancel = () => {
    onClose()
  }
  const handleAccept = () => {
    onConfirm()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-lg p-6 rounded-[20px] shadow-lg">
        <div className="flex justify-center items-center py-3">
          <h5 className="text-xl font-semibold">Generar Planillas de Seguimiento</h5>
        </div>
        <hr className="border-[1.5px] mb-4" />
        <p className="pb-3">Selecciona el objetivo para el cual deseas generar las planillas de seguimiento.</p>
        <div className="flex justify-end pt-4">
          <button onClick={handleCancel} className="button-secondary_outlined mr-2">
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
