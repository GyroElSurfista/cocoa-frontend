import WarningIcon from '@mui/icons-material/Warning'
import { Box, Modal } from '@mui/material'

interface ModalConfirmation {
  open: boolean
  text: string
  handleConfirm: () => void
  handleClose: () => void
}

const ModalConfirmation = ({ open, text, handleConfirm, handleClose }: ModalConfirmation): JSX.Element => {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: '10px',
    boxShadow: 24,
    p: '18px 8px 18px 8px',
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <div className="flex justify-center">
          <WarningIcon fontSize="large" color="error" />
        </div>

        <p className="text-center text-black text-xl font-semibold">{text}</p>

        <div className="flex justify-center items-center gap-3 mt-2">
          <button onClick={handleClose} className="button-secondary_outlined">
            Cancelar
          </button>
          <button onClick={handleConfirm} className="button-primary">
            Aceptar
          </button>
        </div>
      </Box>
    </Modal>
  )
}

export default ModalConfirmation
