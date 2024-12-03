import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import logo from '../assets/Logo Project.png'
import dayjs, { Dayjs } from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useState } from 'react'

const NavBar = (): JSX.Element => {
  const [value, setValue] = useState<Dayjs>(dayjs(localStorage.getItem('date') ?? '2024-10-28')) // Si es null entonces le pasamos la fecha inicial

  function disablePrevDates(date: Dayjs) {
    const startSeconds = Date.parse(date.toISOString().split('T')[0])
    return (date: Dayjs) => {
      return Date.parse(date.toISOString().split('T')[0]) < startSeconds
    }
  }

  return (
    <div className="w-full h-20 bg-[#e0e3ff] shadow">
      <div className="flex h-full py-4 sm:mx-4 pl-10 items-center justify-between">
        <img src={logo} className="h-10 sm:h-full" alt="Logo Proyecto Cocoa" />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={dayjs(value)}
            onChange={(value) => {
              if (value) {
                setValue(value)
                localStorage.setItem('date', value.toISOString().split('T')[0])
              }
            }}
            label="Fecha en la que te encuentras actualmente"
            format="DD/MM/YYYY"
            shouldDisableDate={disablePrevDates(value)}
          />
        </LocalizationProvider>
      </div>
    </div>
  )
}

export default NavBar
