import { useState } from 'react'
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

// Definimos un tipo que contiene las claves válidas
type Motivo = 'Licencia' | 'Imprevisto' | 'Injustificado'

// Mapeo de identificador de motivos
const motivosMap: Record<Motivo, number> = {
  Licencia: 1,
  Imprevisto: 2,
  Injustificado: 3,
}

export const RowInformationUser: React.FC<RowInformationUserProps> = ({ userName, companyName, userId, planillaDate }) => {
  const [isChecked, setIsChecked] = useState(true)
  const [motivo, setMotivo] = useState<string>('Motivo de Inasistencia')
  const [isMotivoEditable, setIsMotivoEditable] = useState(true) // Para hacer el select ineditable después de seleccionar un motivo
  const [snackbarOpen, setSnackbarOpen] = useState(false) // Controlar la apertura del Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState('') // Mensaje para el Snackbar

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked)
  }

  const handleMotivoChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMotivo = event.target.value as Motivo // Cast the selected value as 'Motivo'
    setMotivo(selectedMotivo)

    // Solo hacemos la solicitud si el motivo seleccionado es válido
    if (selectedMotivo in motivosMap) {
      const identificadorMotiv = motivosMap[selectedMotivo]

      // Crear el payload para la solicitud
      const payload = {
        identificadorUsuar: userId,
        fecha: planillaDate, // Asegurarse de que la fecha esté en formato 'YYYY-MM-DD'
        valor: true,
        identificadorMotiv,
      }

      console.log('Enviando inasistencia:', payload)

      try {
        const response = await axios.post('https://cocoabackend.onrender.com/api/asistencias-inasistencia', payload)

        if (response.status === 201) {
          // Mostrar mensaje de éxito y deshabilitar el select
          setSnackbarMessage('Inasistencia registrada correctamente')
          setSnackbarOpen(true)
          setIsMotivoEditable(false) // Deshabilitar el select
        }
      } catch (error) {
        console.error('Error al registrar la inasistencia', error)
        setSnackbarMessage('Error al registrar la inasistencia')
        setSnackbarOpen(true)
      }
    }
  }

  // Manejar el cierre del Snackbar
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
            disabled={!isMotivoEditable} // Deshabilitar el select si ya se seleccionó un motivo
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

      {/* Snackbar para mostrar mensajes */}
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
