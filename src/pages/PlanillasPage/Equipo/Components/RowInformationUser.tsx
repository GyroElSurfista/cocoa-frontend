// RowInformationUser.tsx

import React, { useState } from 'react'
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
  }
  onChangeAsistencia: (userId: number, valor: boolean, identificadorMotiv: number | null) => void
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
}) => {
  const [isChecked, setIsChecked] = useState(asistenciaData?.identificadorMotiv === null)
  const [motivo, setMotivo] = useState<string>(
    asistenciaData?.identificadorMotiv
      ? Object.keys(motivosMap).find((key) => motivosMap[key as Motivo] === asistenciaData.identificadorMotiv) || 'Motivo de Inasistencia'
      : 'Motivo de Inasistencia'
  )

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked
    setIsChecked(checked)
    onChangeAsistencia(userId, checked, checked ? null : motivosMap[motivo as Motivo] || null)
  }

  const handleMotivoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMotivo = event.target.value
    setMotivo(selectedMotivo)
    onChangeAsistencia(userId, isChecked, motivosMap[selectedMotivo as Motivo] || null)
  }

  return (
    <div className="flex h-11">
      <div className="flex">
        <img className="w-[25px] h-[25px] mx-2" src={IconUser} alt="User Icon" />
        <h3 className="w-[220px] mr-4">
          {userName} {companyName}
        </h3>
      </div>

      <div className="w-auto border-x-2 border-[#c6caff]">
        <Checkbox className="pt-0" checked={isChecked} onChange={handleCheckboxChange} disabled={isReadOnly} />
      </div>

      {!isChecked && (
        <div className="flex">
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
    </div>
  )
}
