import { SvgIcon } from '@mui/material'
import { IconProps } from './entregableIcon'

const PlaniEvaIcon = ({ fill = 'currentColor', ...props }: IconProps) => {
  return (
    <SvgIcon {...props}>
      <svg xmlns="http://www.w3.org/2000/svg" width="19" height="20" viewBox="0 0 19 20" fill="none">
        <g clipPath="url(#clip0_1827_5890)">
          <path
            d="M3.95833 17.9167H15.0417C15.9149 17.9167 16.625 17.2066 16.625 16.3334V4.45837C16.625 3.58517 15.9149 2.87504 15.0417 2.87504H13.4583C13.4583 2.66508 13.3749 2.46371 13.2265 2.31525C13.078 2.16678 12.8766 2.08337 12.6667 2.08337H6.33333C6.12337 2.08337 5.92201 2.16678 5.77354 2.31525C5.62507 2.46371 5.54167 2.66508 5.54167 2.87504H3.95833C3.08512 2.87504 2.375 3.58517 2.375 4.45837V16.3334C2.375 17.2066 3.08512 17.9167 3.95833 17.9167ZM3.95833 4.45837H5.54167V6.04171H13.4583V4.45837H15.0417V16.3334H3.95833V4.45837Z"
            fill={fill}
          />
          <ellipse cx="15.4377" cy="15.9375" rx="3.20625" ry="3.20625" fill="white" />
          <path
            d="M15.4375 12.375C13.4731 12.375 11.875 13.9731 11.875 15.9375C11.875 17.9019 13.4731 19.5 15.4375 19.5C17.4019 19.5 19 17.9019 19 15.9375C19 13.9731 17.4019 12.375 15.4375 12.375ZM15.4375 18.7875C13.8661 18.7875 12.5875 17.5089 12.5875 15.9375C12.5875 14.3661 13.8661 13.0875 15.4375 13.0875C17.0089 13.0875 18.2875 14.3661 18.2875 15.9375C18.2875 17.5089 17.0089 18.7875 15.4375 18.7875Z"
            fill={fill}
          />
          <path
            d="M14.7244 16.5028L13.9054 15.6852L13.4023 16.1897L14.7251 17.5096L17.1141 15.1206L16.6104 14.6168L14.7244 16.5028Z"
            fill={fill}
          />
        </g>
        <defs>
          <clipPath id="clip0_1827_5890">
            <rect width="19" height="19" fill="white" transform="translate(0 0.5)" />
          </clipPath>
        </defs>
      </svg>
    </SvgIcon>
  )
}

export default PlaniEvaIcon