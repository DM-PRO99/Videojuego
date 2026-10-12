import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  tone?: 'plain' | 'pink' | 'mint' | 'yellow' | 'lilac'
  className?: string
}

export function Card({ children, tone = 'plain', className = '' }: CardProps) {
  return <div className={`card card--${tone} ${className}`.trim()}>{children}</div>
}
