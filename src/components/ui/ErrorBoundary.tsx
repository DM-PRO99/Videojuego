import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error inesperado en el juego:', error, errorInfo)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <main className="screen screen--centered">
        <h1 className="screen__title">Algo salió mal 🙈</h1>
        <p>Tu diario sigue guardado. Recarga la página para continuar.</p>
        <button type="button" className="btn btn--primary btn--md" onClick={() => location.reload()}>
          Recargar
        </button>
      </main>
    )
  }
}
