import { describe, expect, test } from 'vitest'
import { ACCESSORIES } from '../data/catalog'
import type { DiaryEntry, GameProgress, Look } from '../types/game.types'
import {
  evaluateAchievements,
  getNewlyUnlockedIds,
  getUnlockedIds,
  isAccessoryUnlocked,
} from './achievements'
import { EMPTY_PROGRESS } from './storage'

const BASE_LOOK: Look = {
  occasionId: 'libre',
  topId: 'camiseta',
  bottomId: 'jeans',
  shoesId: 'tenis',
  colors: { top: 'blancos', bottom: 'negros', shoes: 'blancos' },
  accessoryIds: [],
}

let entryCount = 0

function createEntry(lookChanges: Partial<Look> = {}, note = 'Me gusta'): DiaryEntry {
  entryCount += 1
  return {
    id: `entry-${entryCount}`,
    createdAt: '2026-10-12T10:00:00.000Z',
    name: 'Look de prueba',
    look: { ...BASE_LOOK, ...lookChanges },
    note,
    rating: 4,
    emotionId: 'segura',
  }
}

function getUnlocked(progress: GameProgress) {
  return getUnlockedIds(evaluateAchievements(progress))
}

describe('evaluateAchievements', () => {
  test('unlocks nothing when the diary is empty', () => {
    expect(getUnlocked(EMPTY_PROGRESS)).toEqual([])
  })

  test('unlocks primer-diario with a school look that has a note', () => {
    const entries = [createEntry({ occasionId: 'clases' })]
    expect(getUnlocked({ ...EMPTY_PROGRESS, entries })).toEqual(['primer-diario'])
  })

  test('does not unlock primer-diario when the look is for another occasion', () => {
    const entries = [createEntry({ occasionId: 'amigos' })]
    expect(getUnlocked({ ...EMPTY_PROGRESS, entries })).not.toContain('primer-diario')
  })

  test('unlocks cada-momento only after sport, friends and event looks', () => {
    const twoOccasions = [createEntry({ occasionId: 'deporte' }), createEntry({ occasionId: 'amigos' })]
    expect(getUnlocked({ ...EMPTY_PROGRESS, entries: twoOccasions })).not.toContain('cada-momento')

    const threeOccasions = [...twoOccasions, createEntry({ occasionId: 'evento' })]
    expect(getUnlocked({ ...EMPTY_PROGRESS, entries: threeOccasions })).toContain('cada-momento')
  })

  test('unlocks maestra-colores with one complementary and one analogous look', () => {
    const entries = [
      createEntry({ colors: { top: 'rosas', bottom: 'verdes', shoes: 'blancos' } }),
      createEntry({ colors: { top: 'azules', bottom: 'verdes', shoes: 'negros' } }),
    ]
    expect(getUnlocked({ ...EMPTY_PROGRESS, entries })).toContain('maestra-colores')
  })

  test('ignores the hidden bottom color of a dress when judging colors', () => {
    const entries = [
      createEntry({
        topId: 'vestido',
        bottomId: null,
        colors: { top: 'rosas', bottom: 'verdes', shoes: 'blancos' },
      }),
    ]
    const status = evaluateAchievements({ ...EMPTY_PROGRESS, entries }).find(
      (item) => item.id === 'maestra-colores',
    )
    expect(status?.current).toBe(0)
  })

  test('requires five entries and the final reflection for mi-voz', () => {
    const entries = Array.from({ length: 5 }, () => createEntry())
    expect(getUnlocked({ ...EMPTY_PROGRESS, entries })).not.toContain('mi-voz')

    const finalReflection = { authorName: 'Ana', text: 'Mi estilo', completedAt: '2026-10-12' }
    expect(getUnlocked({ ...EMPTY_PROGRESS, entries, finalReflection })).toContain('mi-voz')
  })
})

describe('getNewlyUnlockedIds', () => {
  test('returns only the achievements unlocked by the latest change', () => {
    const before: GameProgress = { ...EMPTY_PROGRESS, entries: [createEntry({ occasionId: 'clases' })] }
    const after: GameProgress = { ...before, quizCompleted: true }
    expect(getNewlyUnlockedIds(before, after)).toEqual(['mente-curiosa'])
  })
})

describe('isAccessoryUnlocked', () => {
  const hat = ACCESSORIES.find((accessory) => accessory.id === 'sombrero')!
  const watch = ACCESSORIES.find((accessory) => accessory.id === 'reloj')!

  test('keeps bonus accessories locked until cada-momento is unlocked', () => {
    expect(isAccessoryUnlocked(hat, [])).toBe(false)
    expect(isAccessoryUnlocked(hat, ['cada-momento'])).toBe(true)
  })

  test('always allows the basic accessories', () => {
    expect(isAccessoryUnlocked(watch, [])).toBe(true)
  })
})
