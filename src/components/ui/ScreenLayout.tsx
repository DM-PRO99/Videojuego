import type { ReactNode } from 'react'

interface ScreenLayoutProps {
  title: string
  subtitle?: string
  children: ReactNode
  /** Botones de navegación de la pantalla. */
  actions?: ReactNode
  centered?: boolean
}

export function ScreenLayout({
  title,
  subtitle,
  children,
  actions,
  centered = false,
}: ScreenLayoutProps) {
  return (
    <main className={`screen ${centered ? 'screen--centered' : ''}`.trim()}>
      <header className="screen__header">
        <h1 className="screen__title">{title}</h1>
        {subtitle && <p className="screen__subtitle">{subtitle}</p>}
      </header>
      <div className="screen__body">{children}</div>
      {actions && <nav className="screen__actions" aria-label="Navegación">{actions}</nav>}
    </main>
  )
}
