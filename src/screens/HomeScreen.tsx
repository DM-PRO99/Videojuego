import { LookPreview, type PreviewLook } from '../components/look/LookPreview'
import { Button } from '../components/ui/Button'
import { ScreenLayout } from '../components/ui/ScreenLayout'
import { PROJECT_INFO } from '../data/projectInfo'
import { useGame } from '../hooks/useGame'

const COVER_LOOK: PreviewLook = {
  topId: 'blazer',
  bottomId: 'falda',
  shoesId: 'botines',
  colors: { top: 'rosas', bottom: 'verdes', shoes: 'negros' },
  accessoryIds: ['diadema', 'bolso'],
}

export function HomeScreen() {
  const { navigate } = useGame()

  return (
    <ScreenLayout
      centered
      title={PROJECT_INFO.title}
      subtitle={PROJECT_INFO.tagline}
      actions={
        <Button icon="➡️" size="lg" onClick={() => navigate('menu')}>
          Empezar el juego
        </Button>
      }
    >
      <div className="cover">
        <LookPreview look={COVER_LOOK} size="lg" label="Ilustración de presentación del juego" />
        <dl className="cover__credits">
          <div>
            <dt>Autor</dt>
            <dd>{PROJECT_INFO.author}</dd>
          </div>
          <div>
            <dt>Grado</dt>
            <dd>{PROJECT_INFO.grade}</dd>
          </div>
          <div>
            <dt>Materia</dt>
            <dd>{PROJECT_INFO.subject}</dd>
          </div>
        </dl>
      </div>
    </ScreenLayout>
  )
}
