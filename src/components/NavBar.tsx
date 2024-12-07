import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import logo from '../assets/Logo Project.png'
import dayjs, { Dayjs } from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useEffect, useState } from 'react'
import { getSemester, Semester } from '../services/semester.service'
import { useNavigate } from 'react-router-dom'
import { Tooltip, Typography } from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'
import { formatDateToDMY } from '../utils/formatDate'

const NavBar = (): JSX.Element => {
  const [value, setValue] = useState<Dayjs>(dayjs(localStorage.getItem('date') ?? '2024-08-12')) // Si es null entonces le pasamos la fecha inicial
  const [semester, setSemester] = useState<Semester>()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchSemester = async () => {
      const response = await getSemester()
      const semesterData: Semester = response.data

      setSemester(semesterData)
    }

    fetchSemester()
  }, [])

  function disablePrevDates(date: Dayjs) {
    return (currentDate: Dayjs) => {
      if (!semester) return true // Mientras no cargue el semestre, deshabilitar todas las fechas

      const semesterStart = dayjs(date.toISOString())
      const semesterEnd = dayjs(semester.fechaEvaluFin)
      return currentDate.isBefore(semesterStart, 'day') || currentDate.isAfter(semesterEnd, 'day')
    }
  }

  return (
    <div className="w-full h-20 bg-[#e0e3ff] shadow">
      <div className="flex h-full py-4 sm:mx-4 pl-10 items-center justify-between">
        <img src={logo} className="h-10 sm:h-full" alt="Logo Proyecto Cocoa" />
        <div className="flex gap-2">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Tooltip
              title={
                <div>
                  <Typography variant="body2">
                    Planificación: {`${formatDateToDMY(semester?.fechaPlaniInici)} - ${formatDateToDMY(semester?.fechaPlaniFin)}`}
                  </Typography>
                  <Typography variant="body2">
                    Desarrollo: {`${formatDateToDMY(semester?.fechaDesaInici)} - ${formatDateToDMY(semester?.fechaDesaFin)}`}
                  </Typography>
                  <Typography variant="body2">
                    Evaluación: {`${formatDateToDMY(semester?.fechaEvaluInici)} - ${formatDateToDMY(semester?.fechaEvaluFin)}`}
                  </Typography>
                </div>
              }
              placement="left"
            >
              <InfoIcon />
            </Tooltip>
            <DatePicker
              value={dayjs(value)}
              onChange={(value) => {
                if (value) {
                  setValue(value)
                  localStorage.setItem('date', value.toISOString().split('T')[0])
                  navigate('/')
                }
              }}
              label="Fecha en la que te encuentras actualmente"
              format="DD/MM/YYYY"
              shouldDisableDate={disablePrevDates(value)}
            />
          </LocalizationProvider>
        </div>
      </div>
    </div>
  )
}

export default NavBar
