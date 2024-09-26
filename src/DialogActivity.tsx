import { ActivityProps } from './PruebasActivity'
import { MenuItem, Button, TextField, Divider, FormControl, InputAdornment } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { useEffect, useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { AccountCircle } from '@mui/icons-material'

type DialogActivityProps = {
	activity: ActivityProps | null
	isVisible: boolean
	onHide: () => void
	onSave: () => void
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	isEditMode: boolean
	responsables: string[]
}

const DialogActivity = ({ activity, isVisible, onHide, onSave, onChange, isEditMode, responsables }: DialogActivityProps) => {
	const [fechaInicio, setFechaInicio] = useState<Dayjs | null>(dayjs(activity?.fechaInicio))
	const [fechaFin, setFechaFin] = useState<Dayjs | null>(dayjs(activity?.fechaFin))

	useEffect(() => {
		setFechaInicio(dayjs(activity?.fechaInicio))
		setFechaFin(dayjs(activity?.fechaFin))
	}, [activity])

	return (
		<FormControl
			className={`shadow-lg transform transition-transform ${isVisible ? 'translate-x-0 w-[35%] p-4' : 'translate-x-full w-[0%]'}`}
		>
			{activity && (
				<>
					<div className="flex justify-between items-center">
						{isEditMode ? (
							<TextField name="nombreActividad" onChange={onChange} label="Nombre de la Actividad"></TextField>
						) : (
							<h2 className="text-xl font-bold">{activity?.nombreActividad}</h2>
						)}
						<Button onClick={onHide}>X</Button>
					</div>
					<Divider color="black" />

					<h3 className="text-lg font-bold my-4">Duración</h3>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<DatePicker
							label="Fecha de Inicio"
							name="fechaInicio"
							className="mb-2 w-1/3"
							value={fechaInicio}
							format="DD/MM/YYYY"
							// onChange={onChange}
							disabled={!isEditMode}
						/>
					</LocalizationProvider>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<DatePicker
							label="Fecha de Fin"
							name="fechaFin"
							className="my-2 w-1/3"
							value={fechaFin}
							format="DD/MM/YYYY"
							// onChange={onChange}
							disabled={!isEditMode}
						/>
					</LocalizationProvider>

					<h3 className="text-lg font-bold mb-2">Descripción</h3>
					<TextField
						name="descripcion"
						value={activity.descripcion}
						onChange={onChange}
						variant="outlined"
						className="mb-4"
						disabled={!isEditMode}
						multiline
					/>

					<h3 className="text-lg font-bold mb-2">Responsable</h3>
					<div className="flex justify-between ">
						<p className="text-sm w-full">Persona asignada</p>
						{
							<TextField
								name="responsable"
								value={activity.responsable}
								onChange={onChange}
								label="Nombre del responsable"
								select
								fullWidth
								disabled={!isEditMode}
								slotProps={{
									input: {
										startAdornment: (
											<InputAdornment position="start">
												<AccountCircle />
											</InputAdornment>
										),
									},
								}}
								variant="standard"
							>
								{responsables.map((responsable, index) => (
									<MenuItem key={index} value={responsable}>
										{responsable}
									</MenuItem>
								))}
							</TextField>
						}
					</div>

					<h3 className="text-lg font-bold mb-2">Resultado</h3>
					<TextField
						name="resultado"
						value={activity.resultado}
						onChange={onChange}
						variant="outlined"
						className="mb-4"
						disabled={!isEditMode}
						multiline
					/>

					{isEditMode && (
						<Button variant="contained" className="w-1/3" size="small" onClick={onSave}>
							Guardar
						</Button>
					)}
				</>
			)}
		</FormControl>
	)
}

export default DialogActivity
