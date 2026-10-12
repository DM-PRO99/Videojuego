import { ACHIEVEMENTS, REQUIRED_DIARY_ENTRIES } from '../data/achievements'
import type {
  Accessory,
} from '../data/catalog'
import type {
  AchievementId,
  DiaryEntry,
  GameProgress,
  HarmonyId,
  OccasionId,
} from '../types/game.types'
import { getHarmony } from './colorHarmony'
import { getUsedPaletteIds } from './look'

export interface AchievementStatus {
  id: AchievementId
  unlocked: boolean
  current: number
  target: number
}

interface Progress {
  current: number
  target: number
}

const EXPLORER_OCCASIONS: readonly OccasionId[] = ['deporte', 'amigos', 'evento']
const COLOR_MASTER_HARMONIES: readonly HarmonyId[] = ['complementaria', 'analoga']

function countMatching<T>(items: readonly T[], isMatch: (item: T) => boolean): number {
  return items.filter(isMatch).length
}

function hasHarmony(entries: readonly DiaryEntry[], harmony: HarmonyId): boolean {
  return entries.some((entry) => getHarmony(getUsedPaletteIds(entry.look)) === harmony)
}

const RULES: Record<AchievementId, (progress: GameProgress) => Progress> = {
  'primer-diario': ({ entries }) => ({
    current: entries.some(
      (entry) => entry.look.occasionId === 'clases' && entry.note.trim().length > 0,
    )
      ? 1
      : 0,
    target: 1,
  }),
  'cada-momento': ({ entries }) => ({
    current: countMatching(EXPLORER_OCCASIONS, (occasionId) =>
      entries.some((entry) => entry.look.occasionId === occasionId),
    ),
    target: EXPLORER_OCCASIONS.length,
  }),
  'maestra-colores': ({ entries }) => ({
    current: countMatching(COLOR_MASTER_HARMONIES, (harmony) => hasHarmony(entries, harmony)),
    target: COLOR_MASTER_HARMONIES.length,
  }),
  'mi-voz': ({ entries, finalReflection }) => ({
    current: Math.min(entries.length, REQUIRED_DIARY_ENTRIES) + (finalReflection ? 1 : 0),
    target: REQUIRED_DIARY_ENTRIES + 1,
  }),
  'mente-curiosa': ({ quizCompleted }) => ({
    current: quizCompleted ? 1 : 0,
    target: 1,
  }),
}

export function evaluateAchievements(progress: GameProgress): AchievementStatus[] {
  return ACHIEVEMENTS.map(({ id }) => {
    const { current, target } = RULES[id](progress)
    return { id, current, target, unlocked: current >= target }
  })
}

export function getUnlockedIds(statuses: readonly AchievementStatus[]): AchievementId[] {
  return statuses.filter((status) => status.unlocked).map((status) => status.id)
}

/** Logros que se desbloquean al pasar de un progreso a otro. */
export function getNewlyUnlockedIds(before: GameProgress, after: GameProgress): AchievementId[] {
  const alreadyUnlocked = new Set(getUnlockedIds(evaluateAchievements(before)))
  return getUnlockedIds(evaluateAchievements(after)).filter((id) => !alreadyUnlocked.has(id))
}

export function isAccessoryUnlocked(
  accessory: Accessory,
  unlockedIds: readonly AchievementId[],
): boolean {
  return (
    accessory.requiresAchievement === undefined ||
    unlockedIds.includes(accessory.requiresAchievement)
  )
}
