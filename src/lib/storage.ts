import type { DiaryEntry, FinalReflection, GameProgress } from '../types/game.types'

const STORAGE_KEY = 'mi-diario-de-estilo:v1'

export const EMPTY_PROGRESS: GameProgress = {
  entries: [],
  finalReflection: null,
  quizCompleted: false,
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isDiaryEntry(value: unknown): value is DiaryEntry {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.createdAt === 'string' &&
    typeof value.name === 'string' &&
    typeof value.note === 'string' &&
    typeof value.rating === 'number' &&
    typeof value.emotionId === 'string' &&
    isRecord(value.look) &&
    isRecord(value.look.colors) &&
    Array.isArray(value.look.accessoryIds)
  )
}

function isFinalReflection(value: unknown): value is FinalReflection {
  return (
    isRecord(value) &&
    typeof value.authorName === 'string' &&
    typeof value.text === 'string' &&
    typeof value.completedAt === 'string'
  )
}

/** Convierte datos guardados (posiblemente dañados o antiguos) en un progreso válido. */
export function parseProgress(raw: string | null): GameProgress {
  if (!raw) return EMPTY_PROGRESS

  try {
    const data: unknown = JSON.parse(raw)
    if (!isRecord(data)) return EMPTY_PROGRESS

    return {
      entries: Array.isArray(data.entries) ? data.entries.filter(isDiaryEntry) : [],
      finalReflection: isFinalReflection(data.finalReflection) ? data.finalReflection : null,
      quizCompleted: data.quizCompleted === true,
    }
  } catch {
    return EMPTY_PROGRESS
  }
}

export function loadProgress(): GameProgress {
  try {
    return parseProgress(localStorage.getItem(STORAGE_KEY))
  } catch {
    // localStorage puede estar bloqueado (modo privado, políticas del navegador).
    return EMPTY_PROGRESS
  }
}

export function saveProgress(progress: GameProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch (error) {
    console.error('No se pudo guardar el progreso:', error)
  }
}
