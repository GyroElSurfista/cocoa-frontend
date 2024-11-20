import React, { useState, useEffect } from 'react'
import IconUser from '../../../../assets/icon-user.svg'
import Checkbox from '@mui/material/Checkbox'

interface RowInformationUserProps {
  userName: string
  companyName: string
  userId: number
  planillaDate: string
  isReadOnly: boolean
  asistenciaData?: {
    valor: boolean
    identificadorMotiv: number | null
    faltas?: number
  }
  onChangeAsistencia: (userId: number, valor: boolean, identificadorMotiv: number | null) => void
  onValidationChange: (userId: number, isValid: boolean) => void // Validación para el padre
}

type Motivo = 'Licencia' | 'Imprevisto' | 'Injustificado'

const motivosMap: Record<Motivo, number> = {
  Licencia: 1,
  Imprevisto: 2,
  Injustificado: 3,
}

export const RowInformationUser: React.FC<RowInformationUserProps> = ({
  userName,
  companyName,
  userId,
  planillaDate,
  isReadOnly,
  asistenciaData,
  onChangeAsistencia,
  onValidationChange,
}) => {
  const [isChecked, setIsChecked] = useState(asistenciaData?.valor || false)
  const [motivo, setMotivo] = useState<string>(
    asistenciaData?.identificadorMotiv
      ? Object.keys(motivosMap).find((key) => motivosMap[key as Motivo] === asistenciaData.identificadorMotiv) || 'Motivo de Inasistencia'
      : 'Motivo de Inasistencia'
  )

  const isGivenBaja = asistenciaData?.faltas >= 3

  // Actualizar validación al cambiar estado
  useEffect(() => {
    const isValid = isChecked || (!isChecked && motivo !== 'Motivo de Inasistencia')
    onValidationChange(userId, isValid) // Notifica al padre sobre la validez
  }, [isChecked, motivo, userId, onValidationChange])

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked
    setIsChecked(checked)
    onChangeAsistencia(userId, checked, checked ? null : motivosMap[motivo as Motivo] || null)
    setMotivo('Motivo de Inasistencia')
  }

  const handleMotivoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMotivo = event.target.value
    setMotivo(selectedMotivo)
    onChangeAsistencia(userId, isChecked, motivosMap[selectedMotivo as Motivo] || null)
  }

  return (
    <div className={`flex h-11 ${isGivenBaja ? 'py-2' : ''}`}>
      <div className={`flex items-center ${isGivenBaja ? 'bg-[#FFC3CC]' : ''}`}>
        <img className="w-[25px] h-[25px] mx-2" src={IconUser} alt="User Icon" />
        <h3 className="w-[220px] mr-4">
          {userName} {companyName}
        </h3>
      </div>

      {!isGivenBaja ? (
        <div className="w-auto border-x-2 border-[#c6caff] flex items-center">
          <Checkbox className="pt-0" checked={isChecked} onChange={handleCheckboxChange} disabled={isReadOnly} />
        </div>
      ) : (
        <div className="flex items-center justify-end w-full pr-4 bg-[#FFC3CC] py-1">
          <span className="text-[#A70920] font-semibold">Socio dado de baja por inasistencias</span>
        </div>
      )}

      {!isChecked && !isGivenBaja && (
        <div className="flex items-center">
          <h3 className="mx-3">Motivo:</h3>
          <select
            name="motivo"
            value={motivo}
            onChange={handleMotivoChange}
            disabled={isReadOnly}
            className="inline-flex items-center px-1 py-0 gap-1 rounded-md border-[0.5px] border-[#FFC3CC] bg-[#FFDEE3] text-[#A70920] h-7"
          >
            <option value="Motivo de Inasistencia">Motivo de Inasistencia</option>
            <option value="Licencia">Licencia</option>
            <option value="Imprevisto">Imprevisto</option>
            <option value="Injustificado">Injustificado</option>
          </select>
        </div>
      )}

      {/* Div final para mensajes */}
      <div className="flex justify-end w-full pr-4 items-center">
        {!isChecked && motivo === 'Motivo de Inasistencia' && (
          <p className="text-red-500 font-semibold ">Debe verificar la asistencia antes de guardar la planilla</p>
        )}
      </div>
    </div>
  )
}
