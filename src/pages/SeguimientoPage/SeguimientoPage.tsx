import { Snackbar, SnackbarCloseReason, SnackbarContent } from '@mui/material'
import { useState } from 'react'
import { Link } from 'react-router-dom'

interface Objetivo {
  id: number
  nombre: string
  planillaGenerada: boolean
  planillaUrl: string | null
}

const SeguimientoPage = () => {
  // Lista de objetivos con su estado individual
  const [objetivos, setObjetivos] = useState<Objetivo[]>([
    { id: 1, nombre: 'Objetivo 1', planillaGenerada: false, planillaUrl: null },
    { id: 2, nombre: 'Objetivo 2', planillaGenerada: false, planillaUrl: null },
    { id: 3, nombre: 'Objetivo 3', planillaGenerada: false, planillaUrl: null },
  ])

  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarColor, setSnackbarColor] = useState('')

  // Función para generar la planilla de un objetivo específico
  const handleClick = async (id: number) => {
    // Actualiza el objetivo específico en el estado
    setObjetivos((prev) => prev.map((obj) => (obj.id === id ? { ...obj, planillaGenerada: true, planillaUrl: 'url' } : obj)))

    // Configura el Snackbar para éxito
    setSnackbarMessage('Planilla generada exitosamente')
    setSnackbarColor('#D3FFD2')
    setOpenSnackbar(true)
  }

  const handleCloseSnackbar = (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenSnackbar(false)
  }

  return (
    <div>
      <h2 className="text-black text-3xl font-semibold pl-6">Seguimiento</h2>
      <hr className="border-[1.5px] border-[#c6caff] mt-3 mb-6" />

      {objetivos.map((objetivo) => (
        <div key={objetivo.id} className="w-full h-[58px] pr-2.5 mb-3 bg-[#e0e3ff] rounded justify-between items-center inline-flex">
          <div className="px-2.5 py-[15px] border-r border-[#c6caff] justify-center items-center gap-2.5 flex">
            <div className="text-center text-[#1c1c1c] text-lg font-semibold">{objetivo.nombre}</div>
          </div>
          <div className="px-2.5 py-[5px] justify-center items-center gap-2.5 flex">
            {!objetivo.planillaGenerada ? (
              <button className="button-primary" onClick={() => handleClick(objetivo.id)}>
                Generar Planilla
              </button>
            ) : (
              <Link to={objetivo.planillaUrl || '#'} className="button-primary">
                Ver Planilla
              </Link>
            )}
          </div>
        </div>
      ))}

      {/* Snackbar para mostrar los mensajes de éxito o error */}
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
            background: snackbarColor,
            color: snackbarColor === '#D3FFD2' ? '#00A407' : '#A40000', // Cambia el color del texto basado en el tipo de mensaje
          }}
          message={snackbarMessage}
        />
      </Snackbar>
    </div>
  )
}

export default SeguimientoPage
