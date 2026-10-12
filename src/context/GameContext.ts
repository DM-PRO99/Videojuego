import { createContext } from 'react'
import type { AchievementStatus } from '../lib/achievements'
import type {
  AchievementId,
  DiaryEntry,
  DiaryEntryInput,
  GameState,
  ScreenId,
} from '../types/game.types'

export interface GameContextValue {
  state: GameState
  achievements: readonly AchievementStatus[]
  unlockedAchievementIds: readonly AchievementId[]
  navigate: (screen: ScreenId) => void
  addEntry: (input: DiaryEntryInput) => DiaryEntry
  deleteEntry: (entryId: string) => void
  saveReflection: (authorName: string, text: string) => void
  completeQuiz: () => void
}

export const GameContext = createContext<GameContextValue | undefined>(undefined)
