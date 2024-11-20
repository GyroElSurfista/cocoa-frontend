import { SvgIcon, SvgIconProps } from '@mui/material'

interface GoalIconProps extends SvgIconProps {
  fill?: string
}

export default function CheckIcon({ fill = 'currentColor', ...props }: GoalIconProps) {
  return (
    <SvgIcon {...props}>
      <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
        <g id="bx-checkbox-checked.svg">
          <path
            id="Vector"
            d="M4.40746 2.43591C3.31995 2.43591 2.43555 3.32032 2.43555 4.40783V14.2674C2.43555 15.3549 3.31995 16.2393 4.40746 16.2393H14.267C15.3546 16.2393 16.239 15.3549 16.239 14.2674V4.40783C16.239 3.32032 15.3546 2.43591 14.267 2.43591H4.40746ZM4.40746 14.2674V4.40783H14.267L14.269 14.2674H4.40746Z"
            fill={fill}
          />
          <path
            id="Vector_2"
            d="M8.34489 9.95934L7.06557 8.7698L5.68359 10.1081L8.35278 12.5855L12.9913 8.23259L11.6034 6.90173L8.34489 9.95934Z"
            fill={fill}
          />
        </g>
      </svg>
    </SvgIcon>
  )
}
