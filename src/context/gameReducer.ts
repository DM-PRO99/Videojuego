import { loadProgress } from '../lib/storage'
import type { DiaryEntry, FinalReflection, GameState, ScreenId } from '../types/game.types'

export type GameAction =
  | { type: 'NAVIGATE'; screen: ScreenId }
  | { type: 'ADD_ENTRY'; entry: DiaryEntry }
  | { type: 'DELETE_ENTRY'; entryId: string }
  | { type: 'SAVE_REFLECTION'; reflection: FinalReflection }
  | { type: 'COMPLETE_QUIZ' }

export function createInitialState(): GameState {
  return { ...loadProgress(), screen: 'home' }
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'NAVIGATE':
      return { ...state, screen: action.screen }
    case 'ADD_ENTRY':
      return { ...state, entries: [...state.entries, action.entry] }
    case 'DELETE_ENTRY':
      return { ...state, entries: state.entries.filter((entry) => entry.id !== action.entryId) }
    case 'SAVE_REFLECTION':
      return { ...state, finalReflection: action.reflection }
    case 'COMPLETE_QUIZ':
      return { ...state, quizCompleted: true }
  }
}
