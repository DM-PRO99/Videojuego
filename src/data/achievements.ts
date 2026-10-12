import type { AchievementId } from '../types/game.types'

export interface AchievementInfo {
  id: AchievementId
  icon: string
  title: string
  level: string
  task: string
  reward?: string
}

export const REQUIRED_DIARY_ENTRIES = 5

export const ACHIEVEMENTS: readonly AchievementInfo[] = [
  {
    id: 'primer-diario',
    icon: '🏅',
    title: '¡Comienza mi diario!',
    level: 'Nivel 1 · Primeros pasos',
    task: 'Crea un look para un día de clases y escribe tu primera nota.',
  },
  {
    id: 'cada-momento',
    icon: '🎭',
    title: 'Estilo para cada momento',
    level: 'Nivel 2 · Explorando estilos',
    task: 'Guarda looks para deporte, salida con amigos y evento especial.',
    reward: 'Desbloquea sombrero, collar y bufanda.',
  },
  {
    id: 'maestra-colores',
    icon: '🎨',
    title: 'Maestra/o de colores',
    level: 'Nivel 3 · El color de mi estilo',
    task: 'Guarda un look con colores complementarios y otro con colores análogos.',
  },
  {
    id: 'mi-voz',
    icon: '🌟',
    title: 'Mi estilo, mi voz',
    level: 'Nivel 4 · Soy yo: mi identidad',
    task: `Completa ${REQUIRED_DIARY_ENTRIES} entradas en el diario y escribe tu reflexión final.`,
    reward: 'Certificado virtual de finalización.',
  },
  {
    id: 'mente-curiosa',
    icon: '📝',
    title: 'Mente curiosa',
    level: 'Reto extra',
    task: 'Completa la práctica rápida en Aprender de Moda.',
  },
]
