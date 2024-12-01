import { useEffect, useState } from 'react'
import { enviarRevision, getEntregablesConCriterios, verificarLlenadoObj } from '../../services/planiEvaObj.service'
import { Entregable } from './Models/planiEvaObj'
import EntregableComponent from './Components/EntregableComponent'
import { useLocation, useParams } from 'react-router-dom'
import ConfirmationModal from './Components/ConfirmationModal'
import { Snackbar, SnackbarCloseReason, SnackbarContent } from '@mui/material'
import IconDanger from '../../assets/ico-danger.svg'
import { formatDateToDMY } from '../../utils/formatDate'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'

interface Objective {
  identificador: number
  nombre: string
  entregables: Array<Entregable>
  fechaFin: string
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
  const [isEvaluationSaved, setIsEvaluationSaved] = useState<boolean>(false)
  const [markedPercentage, setMarkedPercentage] = useState(0)

  const { idObjetivo } = useParams()
  const location = useLocation()
  const { project } = location.state || {}

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const handleCloseSnackbar = (_event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenSnackbar(false)
  }

  const handleToggleCriteria = (entregableId: number, criterioId: number) => {
    if (isEvaluationSaved) return // Evita modificaciones si la evaluación está guardada
    setCriteriaState((prev) => {
      const newState = {
        ...prev,
        [entregableId]: {
          ...prev[entregableId],
          [criterioId]: !prev[entregableId][criterioId],
        },
      }
      setMarkedPercentage(calculateMarkedPercentage(newState))
      return newState
    })
  }

  const calculateMarkedPercentage = (criteria: CriteriaState): number => {
    let totalCriteria = 0
    let markedCriteria = 0

    Object.values(criteria).forEach((criterios) => {
      Object.values(criterios).forEach((isChecked) => {
        totalCriteria++
        if (isChecked) markedCriteria++
      })
    })

    return totalCriteria > 0 ? parseFloat(((markedCriteria / totalCriteria) * 100).toFixed(2)) : 0
  }

  const handleSave = async () => {
    const markedCriteria = Object.values(criteriaState).flatMap((criterios) =>
      Object.keys(criterios)
        .filter((criterioId) => criterios[parseInt(criterioId)])
        .map((id) => parseInt(id))
    )

    try {
      if (idObjetivo) {
        const response = await enviarRevision(markedCriteria, true, idObjetivo)
        console.log('Saving marked criteria:', response.data)
        fetchObjective()
        setIsModalOpen(false)
        setSnackbarMessage(response.data.message)
        setSnackbarColor('#D3FFD2')
        setOpenSnackbar(true)
        setIsEvaluationSaved(true) // Marca la evaluación como guardada después de guardar
      }
    } catch (error: any) {
      console.log('error Revision', error)
      setIsModalOpen(false)
      setSnackbarMessage(error.data.error)
      setSnackbarColor('#FFCDD2')
      setOpenSnackbar(true)
    }
  }

  const fetchObjective = async () => {
    try {
      if (idObjetivo) {
        const response = await getEntregablesConCriterios(idObjetivo)
        console.log(response.data)
        setObjective({
          identificador: response.data.identificador,
          nombre: response.data.nombre,
          entregables: response.data.entregable,
          fechaFin: response.data.fechaFin,
        })
      }
    } catch (error) {
      console.log('error Obj', error)
    }
  }

  const verify = async () => {
    if (objective) {
      try {
        const response = await verificarLlenadoObj(objective.identificador)
        console.log('verify', response.data)

        setIsEvaluationSaved(!response.data.puedeSerLlenado)
      } catch (error) {
        console.log('verify', error)
      }
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
            // Check if any revision indicates the criterion is met
            const isMet = criterio.revision_criterio_entregable.some((revision) => revision.cumple)
            cAcc[criterio.identificador] = isMet
            return cAcc
          },
          {} as { [criterioId: number]: boolean }
        )
        return acc
      }, {} as CriteriaState)
      setCriteriaState(initialCriteriaState)
      setMarkedPercentage(calculateMarkedPercentage(initialCriteriaState))
      verify() // Verifica si la evaluación está guardada después de cargar el objetivo
    }
  }, [objective])

  return (
    <div className="px-10">
      <h3 className="font-semibold text-4xl">Llenar planilla de evaluación de objetivo</h3>
      <hr className="my-2 border-[1.5px] border-[#c6caff]" />
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row items-center">
          <p className="text-xl font-semibold">
            Proyecto {project} <KeyboardArrowRightIcon />
          </p>
          <p className="text-lg font-semibold">Evaluación del Objetivo {objective?.nombre}</p>
        </div>
        <p className="font-semibold text-lg">
          Fecha:
          <span className="text-[#462fa4] text-lg"> {formatDateToDMY(objective?.fechaFin)}</span>
        </p>
      </div>
      <hr className="mt-2 mb-8 border-[1.5px] border-[#c6caff]" />
      {objective?.entregables.map((entregable, index) => (
        <EntregableComponent
          key={entregable.identificador}
          entregable={entregable}
          onToggleCriteria={handleToggleCriteria}
          isEvaluationSaved={isEvaluationSaved}
          index={index}
        />
      ))}
      <ConfirmationModal isOpen={isModalOpen} onClose={closeModal} onConfirm={handleSave} porcentaje={markedPercentage} />
      <div className="flex justify-end py-2">
        {!isEvaluationSaved && (
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
          message={<span className="inline-flex w-full items-center">{snackbarMessage}</span>}
        />
      </Snackbar>
    </div>
  )
}

export default LlenarPlaniEvaObjPage
