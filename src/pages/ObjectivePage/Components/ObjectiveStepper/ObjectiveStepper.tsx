import { Box, Step, StepConnector, StepLabel, Stepper, styled } from '@mui/material'
import React from 'react'

const steps = ['Seleccionar un proyecto', 'Datos del objetivo', 'Valor porcentual del objetivo']

const CustomConnector = styled(StepConnector)(() => ({
  '&.MuiStepConnector-root': {
    top: 12,
    left: 'calc(-50% + 12px)',
    right: 'calc(50% + 12px)',
  },
  '& .MuiStepConnector-line': {
    borderColor: '#E0E0E0',
    borderTopWidth: 4,
  },
  '&.Mui-active .MuiStepConnector-line': {
    borderColor: '#01D016',
  },
  '&.Mui-completed .MuiStepConnector-line': {
    borderColor: '#01D016',
  },
}))

const CustomStepIconRoot = styled('div')<{
  ownerState: { active?: boolean; completed?: boolean }
}>(({ theme, ownerState }) => ({
  backgroundColor: ownerState.completed ? '#01D016' : theme.palette.grey[300],
  zIndex: 1,
  color: '#fff',
  width: 24,
  height: 24,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    backgroundColor: '#01D016',
  }),
}))

const CustomStepIcon = (props: { icon: React.ReactNode; active?: boolean; completed?: boolean }) => {
  const { icon, active, completed } = props

  return <CustomStepIconRoot ownerState={{ completed, active }}>{icon}</CustomStepIconRoot>
}

const ObjectiveStepper = ({
  activeStep,
  renderStepContent,
}: {
  activeStep: number
  renderStepContent: (step: number) => React.ReactNode
}) => {
  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} alternativeLabel connector={<CustomConnector />}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel
              StepIconComponent={(props) => <CustomStepIcon icon={index + 1} active={props.active} completed={props.completed} />}
            ></StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ mt: 2, mb: 2 }}>{renderStepContent(activeStep)}</Box>
    </Box>
  )
}

export default ObjectiveStepper
