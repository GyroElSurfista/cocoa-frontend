import { useState, useEffect } from 'react'
import IconUser from '../../../../assets/icon-user.svg'
import Checkbox from '@mui/material/Checkbox'
import axios from 'axios'
import { Snackbar, SnackbarContent } from '@mui/material'

interface RowInformationUserProps {
  userName: string
  companyName: string
  userId: number // Necesitamos este identificador para el envío al backend
  planillaDate: string // Pasar la fecha de la planilla
}

type Motivo = 'Licencia' | 'Imprevisto' | 'Injustificado'

const motivosMap: Record<Motivo, number> = {
  Licencia: 1,
  Imprevisto: 2,
  Injustificado: 3,
}

export const RowInformationUser: React.FC<RowInformationUserProps> = ({ userName, companyName, userId, planillaDate }) => {
  const [isChecked, setIsChecked] = useState(true)
  const [motivo, setMotivo] = useState<string>('Motivo de Inasistencia')
  const [isMotivoEditable, setIsMotivoEditable] = useState(true)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')

  // Nueva solicitud para el segundo endpoint
  useEffect(() => {
    const fetchGrupoEmpresaData = async () => {
      try {
        const payload = {
          identificadorGrupoEmpre: 1,
          fecha: planillaDate, // Usamos la fecha proporcionada
        }

        const response = await axios.post('https://cocoabackend.onrender.com/api/grupo-empresa/asistencia', payload)

        console.log('Respuesta del endpoint grupo-empresa:', response.data)
      } catch (error) {
        console.error('Error al obtener datos del grupo-empresa:', error)
      }
    }

    fetchGrupoEmpresaData()
  }, [planillaDate]) // Se ejecuta al montar el componente o si cambia la fecha

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked)
  }

  const handleMotivoChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMotivo = event.target.value as Motivo
    setMotivo(selectedMotivo)

    if (selectedMotivo in motivosMap) {
      const identificadorMotiv = motivosMap[selectedMotivo]

      const payload = {
        identificadorUsuar: userId,
        fecha: planillaDate,
        valor: true,
        identificadorMotiv,
      }

      console.log('Enviando inasistencia:', payload)

      try {
        const response = await axios.post('https://cocoabackend.onrender.com/api/asistencias-inasistencia', payload)

        if (response.status === 201) {
          setSnackbarMessage('Inasistencia registrada correctamente')
          setSnackbarOpen(true)
          setIsMotivoEditable(false)
        }
      } catch (error) {
        console.error('Error al registrar la inasistencia', error)
        setSnackbarMessage('Error al registrar la inasistencia')
        setSnackbarOpen(true)
      }
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false)
  }

  return (
    <div className="flex h-11">
      <div className="flex">
        <img className="w-[25px] h-[25px] mx-2" src={IconUser} alt="User Icon" />
        <h3 className="w-full mr-4">
          {userName} {companyName}
        </h3>
      </div>

      <div className="w-auto border-x-2 border-[#c6caff]">
        <Checkbox className="pt-0" checked={isChecked} onChange={handleCheckboxChange} />
      </div>

      {!isChecked && (
        <div className="flex">
          <h3 className="mx-3">Motivo:</h3>
          <select
            name="motivo"
            value={motivo}
            onChange={handleMotivoChange}
            className="inline-flex items-center px-1 py-0 gap-1 rounded-md border-[0.5px] border-[#FFC3CC] bg-[#FFDEE3] text-[#A70920] h-7"
            disabled={!isMotivoEditable}
          >
            <option value="Motivo de Inasistencia" className="bg-[#FFF0F2] border-b border-[#FFDEE3]">
              Motivo de Inasistencia
            </option>
            <option value="Licencia" className="bg-[#FFF0F2] border-b border-[#FFDEE3]">
              Licencia
            </option>
            <option value="Imprevisto" className="bg-[#FFF0F2] border-b border-[#FFC3CC]">
              Imprevisto
            </option>
            <option value="Injustificado" className="bg-[#FFF0F2]">
              Injustificado
            </option>
          </select>
        </div>
      )}

      <Snackbar
        open={snackbarOpen}
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
            background: '#D3FFD2',
            color: '#00A407',
          }}
          message={snackbarMessage}
        />
      </Snackbar>
    </div>
  )
}
