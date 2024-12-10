import logo from '../assets/Logo Project.png'
import { FormControl, InputLabel, MenuItem, Select, Tooltip, Typography, SelectChangeEvent } from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'
import { formatDateToDMY } from '../utils/formatDate'
import { useSemester } from '../hooks/useSemester'

const NavBar = (): JSX.Element => {
  const { currentSemester, setCurrentSemester, semesters } = useSemester()

  const handleChange = (event: SelectChangeEvent<string>) => {
    const selectedId = event.target.value as string
    const selectedSemester = semesters?.find((semester) => semester.identificador.toString() === selectedId)

    if (selectedSemester) {
      setCurrentSemester(selectedSemester)
      localStorage.setItem('id-semester', selectedId)
    }
  }

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
              value={currentSemester?.identificador?.toString() || ''}
              onChange={handleChange}
              label="Selecciona el semestre"
            >
              {semesters?.map((semester) => (
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
