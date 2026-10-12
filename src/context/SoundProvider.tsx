import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { soundEngine, type SoundEffect } from '../lib/soundEngine'
import { loadSoundSettings, saveSoundSettings, type SoundSettings } from '../lib/soundSettings'
import { SoundContext, type SoundContextValue } from './SoundContext'

const CLICKABLE_SELECTOR = 'button, [role="button"], [role="tab"]'

interface SoundProviderProps {
  children: ReactNode
}

export function SoundProvider({ children }: SoundProviderProps) {
  const [settings, setSettings] = useState<SoundSettings>(loadSoundSettings)
  // Los listeners globales leen las preferencias actuales sin volver a registrarse.
  const settingsRef = useRef(settings)
  const hasInteractedRef = useRef(false)

  useEffect(() => {
    settingsRef.current = settings
    saveSoundSettings(settings)
  }, [settings])

  useEffect(() => {
    if (!settings.musicEnabled) soundEngine.stopMusic()
    else if (hasInteractedRef.current) soundEngine.startMusic()
  }, [settings.musicEnabled])

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      // El audio solo puede empezar después del primer gesto del usuario.
      hasInteractedRef.current = true
      if (settingsRef.current.musicEnabled) soundEngine.startMusic()

      const clickable = event.target instanceof Element && event.target.closest(CLICKABLE_SELECTOR)
      if (clickable && settingsRef.current.effectsEnabled) soundEngine.playEffect('click')
    }

    // En pestañas ocultas el navegador ralentiza los temporizadores y la música se entrecorta.
    const handleVisibilityChange = () => {
      if (document.hidden) soundEngine.stopMusic()
      else if (settingsRef.current.musicEnabled && hasInteractedRef.current) soundEngine.startMusic()
    }

    document.addEventListener('click', handleClick, true)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('click', handleClick, true)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      soundEngine.stopMusic()
    }
  }, [])

  const toggleMusic = useCallback(() => {
    setSettings((previous) => ({ ...previous, musicEnabled: !previous.musicEnabled }))
  }, [])

  const toggleEffects = useCallback(() => {
    setSettings((previous) => ({ ...previous, effectsEnabled: !previous.effectsEnabled }))
  }, [])

  const playEffect = useCallback((effect: SoundEffect) => {
    if (settingsRef.current.effectsEnabled) soundEngine.playEffect(effect)
  }, [])

  const value = useMemo<SoundContextValue>(
    () => ({ settings, toggleMusic, toggleEffects, playEffect }),
    [settings, toggleMusic, toggleEffects, playEffect],
  )

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
}
