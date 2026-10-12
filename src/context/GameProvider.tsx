import { useCallback, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import { evaluateAchievements, getUnlockedIds } from '../lib/achievements'
import { saveProgress } from '../lib/storage'
import type { DiaryEntry, DiaryEntryInput, ScreenId } from '../types/game.types'
import { GameContext, type GameContextValue } from './GameContext'
import { createInitialState, gameReducer } from './gameReducer'

interface GameProviderProps {
  children: ReactNode
}

export function GameProvider({ children }: GameProviderProps) {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState)
  const { entries, finalReflection, quizCompleted } = state

  useEffect(() => {
    saveProgress({ entries, finalReflection, quizCompleted })
  }, [entries, finalReflection, quizCompleted])

  const achievements = useMemo(
    () => evaluateAchievements({ entries, finalReflection, quizCompleted }),
    [entries, finalReflection, quizCompleted],
  )
  const unlockedAchievementIds = useMemo(() => getUnlockedIds(achievements), [achievements])

  const navigate = useCallback((screen: ScreenId) => {
    dispatch({ type: 'NAVIGATE', screen })
    window.scrollTo({ top: 0 })
  }, [])

  const addEntry = useCallback((input: DiaryEntryInput): DiaryEntry => {
    const entry: DiaryEntry = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    dispatch({ type: 'ADD_ENTRY', entry })
    return entry
  }, [])

  const deleteEntry = useCallback((entryId: string) => {
    dispatch({ type: 'DELETE_ENTRY', entryId })
  }, [])

  const saveReflection = useCallback((authorName: string, text: string) => {
    dispatch({
      type: 'SAVE_REFLECTION',
      reflection: { authorName, text, completedAt: new Date().toISOString() },
    })
  }, [])

  const completeQuiz = useCallback(() => {
    dispatch({ type: 'COMPLETE_QUIZ' })
  }, [])

  const value = useMemo<GameContextValue>(
    () => ({
      state,
      achievements,
      unlockedAchievementIds,
      navigate,
      addEntry,
      deleteEntry,
      saveReflection,
      completeQuiz,
    }),
    [
      state,
      achievements,
      unlockedAchievementIds,
      navigate,
      addEntry,
      deleteEntry,
      saveReflection,
      completeQuiz,
    ],
  )

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}
