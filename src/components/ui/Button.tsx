import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  icon?: string
  variant?: ButtonVariant
  size?: 'md' | 'lg'
}

export function Button({
  children,
  icon,
  variant = 'primary',
  size = 'md',
  type = 'button',
  className = '',
  ...buttonProps
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`btn btn--${variant} btn--${size} ${className}`.trim()}
      {...buttonProps}
    >
      {icon && (
        <span className="btn__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </button>
  )
}
