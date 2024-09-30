import { Snackbar, SnackbarCloseReason, SnackbarContent } from '@mui/material'
import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { generateWeeklyTracking } from '../../services/planillaSeguimiento.service'
import { getObjectives } from '../../services/objective.service'

interface Objective {
  id: number
  iniDate: string
  finDate: string
  objective: string
  valueP: string
  planillasGener: boolean
}

const SeguimientoPage = () => {
  // Lista de objetivos con su estado individual
  const [objetivos, setObjetivos] = useState<Objective[]>([])

  const location = useLocation()

  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarColor, setSnackbarColor] = useState('')

  // Función para generar la planilla de un objetivo específico
  const handleClick = async (id: number) => {
    try {
      const response = await generateWeeklyTracking(id)
      console.log('generar planilla', response.data)
      // Actualiza el objetivo específico en el estado
      setObjetivos((prev) => prev.map((obj) => (obj.id === id ? { ...obj, planillasGener: true } : obj)))

      // Configura el Snackbar para éxito
      setSnackbarMessage('Planilla generada exitosamente')
      setSnackbarColor('#D3FFD2')
      setOpenSnackbar(true)
    } catch (error) {
      console.log('error al generar las planillas', error)
    }
  }

  const handleCloseSnackbar = (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenSnackbar(false)
  }

  useEffect(() => {
    const cargarObjetivos = async () => {
      try {
        const response = await getObjectives()
        console.log(response)
        const objetivos = response.data.map((obj: any) => ({
          id: obj.identificador,
          iniDate: obj.fechaInici,
          finDate: obj.fechaFin,
          objective: obj.nombre,
          valueP: obj.valorPorce,
          planillasGener: obj.planillasGener,
        }))

        setObjetivos(objetivos)
      } catch (error) {
        console.log(error)
      }
    }

    cargarObjetivos()
  }, [])
  return (
    <div>
      <h2 className="text-black text-3xl font-semibold pl-6">Seguimiento</h2>
      <hr className="border-[1.5px] border-[#c6caff] mt-3 mb-6" />
      {location.pathname === '/seguimiento' ? (
        <>
          {objetivos.map((objetivo, index) => (
            <div key={objetivo.id} className="w-full h-[58px] pr-2.5 mb-3 bg-[#e0e3ff] rounded justify-between items-center inline-flex">
              <div className="px-2.5 py-[15px] border-r border-[#c6caff] justify-center items-center gap-2.5 flex">
                <div className="text-center text-[#1c1c1c] text-lg font-semibold">Objetivo {index + 1}</div>
              </div>
              <div className="px-2.5 py-[5px] justify-center items-center gap-2.5 flex">
                {!objetivo.planillasGener ? (
                  <button className="button-primary" onClick={() => handleClick(objetivo.id)}>
                    Generar Planilla
                  </button>
                ) : (
                  <Link to={`/seguimiento/objetivo/${objetivo.id}`} className="button-primary">
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
        </>
      ) : (
        <Outlet />
      )}
    </div>
  )
}

export default SeguimientoPage
