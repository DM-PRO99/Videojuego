import { useContext } from 'react'
import { SoundContext, type SoundContextValue } from '../context/SoundContext'

export function useSound(): SoundContextValue {
  const context = useContext(SoundContext)
  if (!context) throw new Error('useSound debe usarse dentro de SoundProvider')
  return context
}
