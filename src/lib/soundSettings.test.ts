import { describe, expect, test } from 'vitest'
import { DEFAULT_SOUND_SETTINGS, parseSoundSettings } from './soundSettings'

describe('parseSoundSettings', () => {
  test('returns the defaults when nothing is stored', () => {
    expect(parseSoundSettings(null)).toEqual(DEFAULT_SOUND_SETTINGS)
  })

  test('returns the defaults when the stored value is corrupted', () => {
    expect(parseSoundSettings('{no es json')).toEqual(DEFAULT_SOUND_SETTINGS)
    expect(parseSoundSettings('"texto"')).toEqual(DEFAULT_SOUND_SETTINGS)
  })

  test('keeps the options the player turned off', () => {
    const stored = JSON.stringify({ musicEnabled: false, effectsEnabled: true })
    expect(parseSoundSettings(stored)).toEqual({ musicEnabled: false, effectsEnabled: true })
  })

  test('treats missing options as enabled', () => {
    expect(parseSoundSettings('{"effectsEnabled":false}')).toEqual({
      musicEnabled: true,
      effectsEnabled: false,
    })
  })
})
