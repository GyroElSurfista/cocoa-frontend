import { useEffect, useState } from 'react'
import { enviarRevision, getEntregablesConCriterios } from '../../services/planiEvaObj.service'
import { Entregable } from './Models/planiEvaObj'
import EntregableComponent from './Components/EntregableComponent'
import { useParams } from 'react-router-dom'
import ConfirmationModal from './Components/ConfirmationModal'
import { Snackbar, SnackbarCloseReason, SnackbarContent } from '@mui/material'
import IconDanger from '../../assets/ico-danger.svg'

interface Objective {
  identificador: number
  nombre: string
  entregables: Array<Entregable>
}

type CriteriaState = {
  [entregableId: number]: {
    [criterioId: number]: boolean
  }
}

const LlenarPlaniEvaObjPage = () => {
  const [objective, setObjective] = useState<Objective | undefined>()
  const [criteriaState, setCriteriaState] = useState<CriteriaState>({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarColor, setSnackbarColor] = useState('')
  const [isSaveButtonVisible, setIsSaveButtonVisible] = useState(true)

  const { idObjetivo } = useParams()

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const handleCloseSnackbar = (_event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenSnackbar(false)
  }

  const handleToggleCriteria = (entregableId: number, criterioId: number) => {
    setCriteriaState((prev) => ({
      ...prev,
      [entregableId]: {
        ...prev[entregableId],
        [criterioId]: !prev[entregableId][criterioId],
      },
    }))
  }

  const handleSave = async () => {
    const markedCriteria = Object.values(criteriaState).flatMap((criterios) =>
      Object.keys(criterios)
        .filter((criterioId) => criterios[parseInt(criterioId)])
        .map((id) => parseInt(id))
    )

    try {
      console.log('Saving marked criteria:', markedCriteria)
      const response = await enviarRevision(markedCriteria, true)
      setIsModalOpen(false)
      setSnackbarMessage(response.data.message)
      setSnackbarColor('#D3FFD2')
      setOpenSnackbar(true)
      setIsSaveButtonVisible(false) // Hide button after successful save
    } catch (error) {
      console.log('error Revision', error)
    }
  }

  const fetchObjective = async () => {
    try {
      if (idObjetivo) {
        const response = await getEntregablesConCriterios(idObjetivo)
        setObjective({
          identificador: response.data.identificador,
          nombre: response.data.nombre,
          entregables: response.data.entregable,
        })
      }
    } catch (error) {
      console.log('error Obj', error)
    }
  }

  useEffect(() => {
    fetchObjective()
  }, [])

  useEffect(() => {
    if (objective) {
      const initialCriteriaState = objective.entregables.reduce((acc, entregable) => {
        acc[entregable.identificador] = entregable.criterio_aceptacion_entregable.reduce(
          (cAcc, criterio) => {
            cAcc[criterio.identificador] = criterio.isChecked || false
            return cAcc
          },
          {} as { [criterioId: number]: boolean }
        )
        return acc
      }, {} as CriteriaState)
      setCriteriaState(initialCriteriaState)
    }
  }, [objective])

  return (
    <div className="px-10">
      <h3 className="font-semibold text-3xl">Llenar planilla de evaluación de objetivo</h3>
      <hr className="my-2 border-[1.5px] border-[#c6caff]" />
      <p className="text-lg font-medium">Evaluación del Objetivo {objective?.nombre}</p>
      <hr className="mt-2 mb-8 border-[1.5px] border-[#c6caff]" />
      {objective?.entregables.map((entregable) => (
        <EntregableComponent key={entregable.identificador} entregable={entregable} onToggleCriteria={handleToggleCriteria} />
      ))}
      <ConfirmationModal isOpen={isModalOpen} onClose={closeModal} onConfirm={handleSave} />
      <div className="flex justify-end py-2">
        {isSaveButtonVisible && (
          <button onClick={openModal} className="button-primary">
            Guardar Evaluación
          </button>
        )}
      </div>
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
            padding: '10px 15px',
            justifyContent: 'start',
            alignItems: 'center',
            gap: '10px',
            borderRadius: '10px',
            background: snackbarColor,
            color: snackbarColor === '#D3FFD2' ? '#00A407' : '#A40000',
          }}
          message={
            <span className="inline-flex w-full items-center">
              <img src={IconDanger} alt="icon-danger" className="w-6 pr-1" />
              {snackbarMessage}
            </span>
          }
        />
      </Snackbar>
    </div>
  )
}

export default LlenarPlaniEvaObjPage
