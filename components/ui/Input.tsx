import React from 'react'

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string | null
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...rest }) => {
  return (
    <label className="block">
      {label && <span className="text-sm text-text-secondary mb-1 block">{label}</span>}
      <input
        className={`w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 ${className}`}
        {...rest}
      />
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </label>
  )
}

export default Input
