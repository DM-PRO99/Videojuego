import { Button } from '../components/ui/Button'
import { ScreenLayout } from '../components/ui/ScreenLayout'
import { useGame } from '../hooks/useGame'

export function FarewellScreen() {
  const { state, navigate } = useGame()

  return (
    <ScreenLayout
      centered
      title="Tu estilo crece contigo"
      subtitle="Gracias por jugar"
      actions={
        <Button icon="🔄" size="lg" onClick={() => navigate('home')}>
          Volver a empezar
        </Button>
      }
    >
      <p className="farewell__icon" aria-hidden="true">
        🌟
      </p>
      <p className="farewell__text">
        Tu diario guarda {state.entries.length} {state.entries.length === 1 ? 'look' : 'looks'} y
        seguirá aquí cuando vuelvas.
      </p>
    </ScreenLayout>
  )
}
