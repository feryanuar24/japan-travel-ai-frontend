import React from 'react'

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  title?: React.ReactNode
}

export const Card: React.FC<CardProps> = ({ title, children, className = '', ...rest }) => {
  return (
    <div className={`rounded-lg border border-border bg-surface p-4 ${className}`} {...rest}>
      {title ? <div className="mb-2 text-sm font-semibold">{title}</div> : null}
      <div>{children}</div>
    </div>
  )
}

export default Card
