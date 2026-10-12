import { Button } from '../components/ui/Button'
import { ScreenLayout } from '../components/ui/ScreenLayout'
import { useGame } from '../hooks/useGame'
import type { ScreenId } from '../types/game.types'

interface MenuSection {
  screen: ScreenId
  icon: string
  title: string
  description: string
  tone: 'pink' | 'mint' | 'yellow' | 'lilac'
}

const MENU_SECTIONS: readonly MenuSection[] = [
  {
    screen: 'creator',
    icon: '👗',
    title: 'Crear Look',
    description: 'Elige ocasión, prendas, colores y accesorios.',
    tone: 'pink',
  },
  {
    screen: 'diary',
    icon: '📖',
    title: 'Mi Diario',
    description: 'Revisa tus looks y cómo te hicieron sentir.',
    tone: 'lilac',
  },
  {
    screen: 'learn',
    icon: '🎨',
    title: 'Aprender',
    description: 'Colores, siluetas, moda responsable e identidad.',
    tone: 'mint',
  },
  {
    screen: 'achievements',
    icon: '⭐',
    title: 'Logros',
    description: 'Mira tus medallas y los retos que faltan.',
    tone: 'yellow',
  },
]

export function MenuScreen() {
  const { state, achievements, unlockedAchievementIds, navigate } = useGame()

  return (
    <ScreenLayout
      title="¡Te damos la bienvenida!"
      subtitle="¿Qué quieres hacer hoy?"
      actions={
        <Button variant="ghost" icon="👋" onClick={() => navigate('farewell')}>
          Terminar por hoy
        </Button>
      }
    >
      <p className="menu__progress">
        <span>📖 {state.entries.length} looks en tu diario</span>
        <span>
          ⭐ {unlockedAchievementIds.length} de {achievements.length} logros
        </span>
      </p>
      <ul className="menu">
        {MENU_SECTIONS.map((section) => (
          <li key={section.screen}>
            <button
              type="button"
              className={`menu__item card card--${section.tone}`}
              onClick={() => navigate(section.screen)}
            >
              <span className="menu__icon" aria-hidden="true">
                {section.icon}
              </span>
              <span className="menu__title">{section.title}</span>
              <span className="menu__description">{section.description}</span>
            </button>
          </li>
        ))}
      </ul>
    </ScreenLayout>
  )
}
