import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { ScreenLayout } from '../components/ui/ScreenLayout'
import { ACHIEVEMENTS } from '../data/achievements'
import { PROJECT_INFO } from '../data/projectInfo'
import { useGame } from '../hooks/useGame'
import { formatDate } from '../lib/formatDate'

export function AchievementsScreen() {
  const { state, achievements, unlockedAchievementIds, navigate } = useGame()
  const { finalReflection } = state
  const hasCertificate = unlockedAchievementIds.includes('mi-voz') && finalReflection !== null

  return (
    <ScreenLayout
      title="Mis Logros"
      subtitle={`${unlockedAchievementIds.length} de ${achievements.length} medallas desbloqueadas`}
      actions={
        <>
          {hasCertificate && (
            <Button icon="🎓" onClick={() => navigate('farewell')}>
              Terminar el juego
            </Button>
          )}
          <Button variant="ghost" icon="🏠" onClick={() => navigate('menu')}>
            Menú
          </Button>
        </>
      }
    >
      <ul className="medals">
        {ACHIEVEMENTS.map((achievement) => {
          const status = achievements.find((item) => item.id === achievement.id)
          const unlocked = status?.unlocked ?? false
          return (
            <li key={achievement.id}>
              <Card tone={unlocked ? 'yellow' : 'plain'} className={unlocked ? 'medal' : 'medal is-locked'}>
                <span className="medal__icon" aria-hidden="true">
                  {unlocked ? achievement.icon : '🔒'}
                </span>
                <p className="medal__level">{achievement.level}</p>
                <h2 className="medal__title">{achievement.title}</h2>
                <p className="medal__task">{achievement.task}</p>
                {achievement.reward && <p className="medal__reward">🎁 {achievement.reward}</p>}
                {status && (
                  <progress
                    className="medal__progress"
                    value={status.current}
                    max={status.target}
                    aria-label={`Progreso: ${status.current} de ${status.target}`}
                  />
                )}
                <p className="medal__status">{unlocked ? '¡Desbloqueado!' : 'Por desbloquear'}</p>
              </Card>
            </li>
          )
        })}
      </ul>

      {hasCertificate && (
        <Card tone="mint" className="certificate">
          <p className="certificate__label">Certificado virtual de finalización</p>
          <p className="certificate__name">{finalReflection.authorName}</p>
          <p>
            completó <strong>{PROJECT_INFO.title}</strong> y descubrió que su estilo es su voz.
          </p>
          <p className="certificate__date">{formatDate(finalReflection.completedAt)}</p>
        </Card>
      )}
    </ScreenLayout>
  )
}
