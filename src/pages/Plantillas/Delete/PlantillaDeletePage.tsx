import { useState } from 'react'
import { PlantillaDeleteAccordion } from './Components/PlantillaDeleteAccordion'
import Snackbar from '@mui/material/Snackbar'
import SnackbarContent from '@mui/material/SnackbarContent'

export const PlantillaDeletePage = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false)

  const handleDeleteConfirm = () => {
    setOpenSnackbar(true)
  }

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false)
  }

  return (
    <div className="mx-28">
      <h1 className="font-bold text-3xl">Eliminar plantilla de evaluación final de proyecto</h1>

      <div>
        <hr className="border-[1.5px] border-[#c6caff] mt-3 mb-3" />
        <br className="my-4" />
        <hr className="border-[1.5px] border-[#c6caff] mt-3 mb-6" />
      </div>

      <PlantillaDeleteAccordion onDeleteConfirm={handleDeleteConfirm} />

      {/* Snackbar para mostrar mensaje de éxito */}
      <Snackbar
        open={openSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
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
          message="Plantilla eliminada exitosamente"
        />
      </Snackbar>
    </div>
  )
}
