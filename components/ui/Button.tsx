import React from 'react'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  className = '',
  children,
  ...rest
}) => {
  const base = 'inline-flex items-center justify-center rounded-md py-2 px-4 text-sm font-medium transition-shadow duration-200 ease-in-out'

  const variants: Record<string, string> = {
    primary: `bg-primary text-white hover:bg-primary-600`,
    secondary: `bg-surface text-text border border-border`,
    danger: `bg-danger text-white`,
    ghost: `bg-transparent text-text`,
  }

  const classes = `${base} ${variants[variant] ?? variants.primary} ${className}`

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  )
}

export default Button
