import { classNames } from 'app/functions'
import React, { FC, ReactNode } from 'react'

import Dots from '../Dots'
import Loader from '../Loader'

export type ButtonColor = 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error' | 'default'
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'default'
export type ButtonVariant = 'outlined' | 'filled' | 'empty'

// const DIMENSIONS = {
//   xs: 'px-2 h-[28px] !border',
//   sm: 'px-3 h-[36px]',
//   md: 'px-4 h-[52px]',
//   lg: 'px-6 h-[60px]',
// }

const SIZE = {
  xs: 'btn-xs',
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
}

const FILLED = {
  default: 'btn',
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  accent: 'btn-accent',
  info: 'btn-info',
  success: 'btn-success',
  warning: 'btn-warning',
  error: 'btn-error',
}

const OUTLINED = {
  default: 'btn btn-outline',
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  accent: 'btn-accent',
  info: 'btn-info',
  success: 'btn-success',
  warning: 'btn-warning',
  error: 'btn-error',
}

const EMPTY = {
  default: 'btn btn-ghost',
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  accent: 'btn-accent',
  info: 'btn-info',
  success: 'btn-success',
  warning: 'btn-warning',
  error: 'btn-error',
}

const VARIANT = {
  outlined: OUTLINED,
  filled: FILLED,
  empty: EMPTY,
}

type Button = React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>> & {
  Dotted: FC<DottedButtonProps>
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  startIcon?: ReactNode
  endIcon?: ReactNode
  color?: ButtonColor
  size?: ButtonSize
  variant?: ButtonVariant
  fullWidth?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = '',
      color = 'default',
      size = 'md',
      variant = 'filled',
      startIcon = undefined,
      endIcon = undefined,
      fullWidth = false,
      loading,
      disabled,
      ...rest
    },
    ref
  ) => {
    return (
      <button
        {...rest}
        ref={ref}
        disabled={disabled || loading}
        className={classNames(
          VARIANT[variant]['default'],
          // @ts-ignore TYPE NEEDS FIXING
          VARIANT[variant][color],
          // @ts-ignore TYPE NEEDS FIXING
          SIZE[size],
          // @ts-ignore TYPE NEEDS FIXING
          // variant !== 'empty' ? DIMENSIONS[size] : '',
          fullWidth ? 'w-full' : '',
          // 'font-bold flex items-center justify-center gap-1',
          className
        )}
      >
        {loading ? (
          <Loader stroke="currentColor" />
        ) : (
          <>
            {startIcon && startIcon}
            {children}
            {endIcon && endIcon}
          </>
        )}
      </button>
    )
  }
)

export function ButtonError({
  error,
  disabled,
  ...rest
}: {
  error?: boolean
  disabled?: boolean
} & ButtonProps) {
  if (error) {
    return <Button color="error" size="lg" disabled={disabled} {...rest} />
  } else {
    return <Button color="error" disabled={disabled} size="lg" {...rest} />
  }
}

interface DottedButtonProps extends ButtonProps {
  pending: boolean
}

export const ButtonDotted: FC<DottedButtonProps> = ({ pending, children, ...rest }) => {
  const buttonText = pending ? <Dots>{children}</Dots> : children
  return (
    <Button {...rest} {...(pending && { disabled: true })}>
      {buttonText}
    </Button>
  )
}

export default Button
