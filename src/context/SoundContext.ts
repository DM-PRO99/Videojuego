import { createContext } from 'react'
import type { SoundEffect } from '../lib/soundEngine'
import type { SoundSettings } from '../lib/soundSettings'

export interface SoundContextValue {
  settings: SoundSettings
  toggleMusic: () => void
  toggleEffects: () => void
  playEffect: (effect: SoundEffect) => void
}

export const SoundContext = createContext<SoundContextValue | undefined>(undefined)
