import { Snackbar, SnackbarCloseReason, SnackbarContent } from '@mui/material'
import { useEffect, useState } from 'react'
import ObjectiveTracker from './Components/ObjectiveTracker'
import { Objective } from '../ObjectivePage/Models/objective'
import { useLocation, useParams } from 'react-router-dom'
import { getWeeklyTrackers } from '../../services/planillaSeguimiento.service'
import { formatDateToDMY } from '../../utils/formatDate'

const SeguimientoPage = () => {
  const [objetivos, setObjetivos] = useState<Objective[]>([])
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarColor, setSnackbarColor] = useState('')

  const location = useLocation()
  const { idProject } = useParams()
  const { project, generated } = location.state

  const handleCloseSnackbar = (_event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenSnackbar(false)
  }

  const cargarObjetivos = async () => {
    try {
      if (idProject) {
        const response = await getWeeklyTrackers(idProject)

        // Mapea los datos del backend al formato de la interfaz `Objective`
        console.log('fetch', response.data)
        const mappedObjectives = response.data.map((obj: any) => ({
          identificador: obj.identificador,
          iniDate: obj.fechaInici,
          finDate: obj.fechaFin,
          objective: obj.nombre,
          nombrePlani: obj.identificadorPlani.toString(), // Convierte a string si es necesario
          valueP: obj.valorPorce,
          planillasGener: obj.planillasGener,
          planilla_seguimiento: obj.planilla_seguimiento,
        }))

        setObjetivos(mappedObjectives)
        console.log('objSegui', mappedObjectives)
      }
    } catch (error) {
      console.error('Error cargando objetivos:', error)
    }
  }

  useEffect(() => {
    cargarObjetivos()
    console.log(project)
    if (generated) {
      setSnackbarMessage('Planilla de seguimiento semanal generada exitosamente')
      setSnackbarColor('#D3FFD2')
      setOpenSnackbar(true)
    }
  }, [idProject])

  return (
    <div className="pb-3">
      <h2 className="text-black text-[33px] font-semibold">Generar Planillas de Seguimiento</h2>
      <hr className="border-[1.5px] border-[#c6caff] mt-3 mb-3" />
      <div className="flex flex-row justify-between">
        <p className="text-[28px] font-semibold">Proyecto {project.nombre}</p>
        <p className="text-base font-normal">
          Generado el: <span className="text-[#462fa4] text-base font-normal">{formatDateToDMY(project.fechaPlaniSeguiGener)}</span>
        </p>
      </div>
      <hr className="border-[1.5px] border-[#c6caff] mt-3 mb-3" />
      <div className="flex flex-row justify-between pb-6">
        <p className="text-xl font-semibold">Planillas de seguimiento de objetivo</p>
        <p className="text-xl font-semibold">
          Día de revisón: <span className="text-[#462fa4] text-xl font-semibold">{project.diaRevis}</span>
        </p>
      </div>

      {objetivos.length > 0 ? (
        objetivos.map((objetivo, index) => <ObjectiveTracker key={index} objective={objetivo} index={index} opened={generated} />)
      ) : (
        <p className="text-center font-semibold mt-4">No existen objetivos disponibles.</p>
      )}

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
            color: snackbarColor === '#D3FFD2' ? '#00A407' : '#A40000',
          }}
          message={snackbarMessage}
        />
      </Snackbar>
    </div>
  )
}

export default SeguimientoPage
