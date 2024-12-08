import logo from '../assets/Logo Project.png'
import { useEffect, useState } from 'react'
import { getSemesters, Semester } from '../services/semester.service'
import { FormControl, InputLabel, MenuItem, Select, Tooltip, Typography, SelectChangeEvent } from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'
import { formatDateToDMY } from '../utils/formatDate'

const NavBar = (): JSX.Element => {
  const [selectedSemester, setSelectedSemester] = useState<string | null>(localStorage.getItem('id-semester'))
  const [semesters, setSemesters] = useState<Array<Semester>>([])

  const handleChange = (event: SelectChangeEvent<string>) => {
    const semesterId = event.target.value
    setSelectedSemester(semesterId)
    localStorage.setItem('id-semester', semesterId)
  }

  useEffect(() => {
    const fetchSemester = async () => {
      try {
        const response = await getSemesters()
        console.log('semester', response.data)
        const semesterData: Semester[] = response.data

        setSemesters(semesterData)

        // Si no hay un semestre seleccionado, seleccionar el primero por defecto
        if (!localStorage.getItem('id-semester') && semesterData[0].identificador) {
          const defaultSemesterId = semesterData[0].identificador.toString()
          setSelectedSemester(defaultSemesterId)
          localStorage.setItem('id-semester', defaultSemesterId)
        }
      } catch (error) {
        console.error('Error fetching semesters:', error)
      }
    }

    fetchSemester()
  }, [])

  const currentSemester = semesters.find((semester) => semester.identificador.toString() === selectedSemester)

  return (
    <div className="w-full h-20 bg-[#e0e3ff] shadow">
      <div className="flex h-full py-4 sm:mx-4 pl-10 items-center justify-between">
        <img src={logo} className="h-10 sm:h-full" alt="Logo Proyecto Cocoa" />
        <div className="flex gap-2 items-center">
          <Tooltip
            title={
              <div>
                <Typography variant="body2">
                  Planificación:{' '}
                  {`${formatDateToDMY(currentSemester?.fechaPlaniInici)} - ${formatDateToDMY(currentSemester?.fechaPlaniFin)}`}
                </Typography>
                <Typography variant="body2">
                  Desarrollo: {`${formatDateToDMY(currentSemester?.fechaDesaInici)} - ${formatDateToDMY(currentSemester?.fechaDesaFin)}`}
                </Typography>
                <Typography variant="body2">
                  Evaluación: {`${formatDateToDMY(currentSemester?.fechaEvaluInici)} - ${formatDateToDMY(currentSemester?.fechaEvaluFin)}`}
                </Typography>
              </div>
            }
            placement="left"
          >
            <InfoIcon />
          </Tooltip>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 160 }}>
            <InputLabel id="semester-select-label">Selecciona el semestre</InputLabel>
            <Select
              labelId="semester-select-label"
              id="semester-select"
              value={selectedSemester || ''}
              onChange={handleChange}
              label="Selecciona el semestre"
            >
              {semesters.map((semester) => (
                <MenuItem value={semester.identificador.toString()} key={semester.identificador}>
                  {semester.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>
    </div>
  )
}

export default NavBar
