const STORAGE_KEY = 'mi-diario-de-estilo:sonido'

export interface SoundSettings {
  musicEnabled: boolean
  effectsEnabled: boolean
}

export const DEFAULT_SOUND_SETTINGS: SoundSettings = {
  musicEnabled: true,
  effectsEnabled: true,
}

export function parseSoundSettings(raw: string | null): SoundSettings {
  if (!raw) return DEFAULT_SOUND_SETTINGS

  try {
    const data: unknown = JSON.parse(raw)
    if (typeof data !== 'object' || data === null) return DEFAULT_SOUND_SETTINGS

    const { musicEnabled, effectsEnabled } = data as Record<string, unknown>
    return {
      musicEnabled: musicEnabled !== false,
      effectsEnabled: effectsEnabled !== false,
    }
  } catch {
    return DEFAULT_SOUND_SETTINGS
  }
}

export function loadSoundSettings(): SoundSettings {
  try {
    return parseSoundSettings(localStorage.getItem(STORAGE_KEY))
  } catch {
    return DEFAULT_SOUND_SETTINGS
  }
}

export function saveSoundSettings(settings: SoundSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch (error) {
    console.error('No se pudieron guardar las preferencias de sonido:', error)
  }
}
