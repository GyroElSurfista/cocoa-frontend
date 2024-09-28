import { Snackbar, SnackbarCloseReason, SnackbarContent } from '@mui/material'
import { useState } from 'react'

const SeguimientoPage = () => {
  const [open, setOpen] = useState(false)

  const handleClick = () => {
    setOpen(true)
  }

  const handleClose = (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return
    }

    setOpen(false)
  }
  return (
    <div>
      <h2 className="text-black text-3xl font-semibold pl-6">Seguimiento</h2>
      <hr className="border-[1.5px] border-[#c6caff] mt-3 mb-6" />
      <div className="w-full h-[58px] pr-2.5 mb-3 bg-[#e0e3ff] rounded justify-between items-center inline-flex">
        <div className="px-2.5 py-[15px] border-r border-[#c6caff] justify-center items-center gap-2.5 flex">
          <div className="text-center text-[#1c1c1c] text-lg font-semibold">Objetivo 1</div>
        </div>
        <div className="px-2.5 py-[5px] justify-center items-center gap-2.5 flex">
          <button className="button-primary">Generar Planilla</button>
        </div>
      </div>
      <div className="w-full h-[58px] pr-2.5 mb-3 bg-[#e0e3ff] rounded justify-between items-center inline-flex">
        <div className="px-2.5 py-[15px] border-r border-[#c6caff] justify-center items-center gap-2.5 flex">
          <div className="text-center text-[#1c1c1c] text-lg font-semibold">Objetivo 1</div>
        </div>
        <div className="px-2.5 py-[5px] justify-center items-center gap-2.5 flex">
          <button className="button-primary" onClick={handleClick}>
            Generar Planilla
          </button>
        </div>
      </div>
      <Snackbar
        open={open}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        autoHideDuration={5000}
        onClose={handleClose}
        message="This Snackbar will be dismissed in 5 seconds."
      >
        <SnackbarContent
          style={{
            display: 'flex',
            width: '325px',
            padding: '15px 20px',
            justifyContent: 'start',
            alignItems: 'center',
            gap: '10px',
            borderRadius: '10px',
            background: '#D3FFD2',
            color: '#00A407',
          }}
          message="Snackbar personalizado con colores!"
        />
      </Snackbar>
    </div>
  )
}

export default SeguimientoPage
