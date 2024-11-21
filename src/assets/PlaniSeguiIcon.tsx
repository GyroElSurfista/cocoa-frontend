import { SvgIcon } from '@mui/material'
import { IconProps } from './entregableIcon'

const PlaniSeguiIcon = ({ fill = 'currentColor', ...props }: IconProps) => {
  return (
    <SvgIcon {...props}>
      <svg xmlns="http://www.w3.org/2000/svg" width="19" height="20" viewBox="0 0 19 20" fill="none">
        <path
          d="M3.16699 6.04163H11.8753V7.62496H3.16699V6.04163ZM3.16699 9.20829H11.8753V10.7916H3.16699V9.20829ZM3.16699 12.375H8.70866V13.9583H3.16699V12.375ZM15.2787 10.2311L11.8745 13.6282L10.8517 12.6061L9.73228 13.7263L11.8745 15.867L16.3965 11.3521L15.2787 10.2311Z"
          fill={fill}
        />
      </svg>
    </SvgIcon>
  )
}

export default PlaniSeguiIcon
