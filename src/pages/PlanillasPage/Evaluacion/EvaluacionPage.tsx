import React, { useState, useEffect } from 'react'
import { Snackbar, SnackbarContent, SnackbarCloseReason } from '@mui/material'
import { useLocation } from 'react-router-dom'
import { PlanillasEvaluacionAccordion } from './Components/PlanillasEvaluacionAccordion'

const EvaluacionPage: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0)

  // Estado para el control del snackbar
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarColor, setSnackbarColor] = useState('')

  const location = useLocation()
  const { identificadorPlani, nombrePlani, success, message } = location.state || {}

  useEffect(() => {
    if (message) {
      setSnackbarMessage(message)
      setSnackbarColor(success ? '#D3FFD2' : '#FFD3D3')
      setOpenSnackbar(true)
    }
  }, [message, success])

  const handleCloseSnackbar = (_event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') return
    setOpenSnackbar(false)
  }

  return (
    <div className="mx-28">
      <h1 className="font-bold text-3xl">Generar planillas de evaluacion</h1>

      <div>
        <hr className="border-[1.5px] border-[#c6caff] mt-3 mb-3" />
        <PlanillasEvaluacionAccordion identificadorPlani={identificadorPlani} nombrePlani={nombrePlani} key={refreshKey} />
        <hr className="border-[1.5px] border-[#c6caff] mt-3 mb-6" />
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

export default EvaluacionPage
