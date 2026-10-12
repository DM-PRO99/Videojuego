import { useSound } from '../../hooks/useSound'

interface SoundToggleProps {
  label: string
  iconOn: string
  iconOff: string
  isOn: boolean
  onToggle: () => void
}

function SoundToggle({ label, iconOn, iconOff, isOn, onToggle }: SoundToggleProps) {
  return (
    <button
      type="button"
      className="sound-toggle"
      aria-pressed={isOn}
      aria-label={label}
      title={`${label}: ${isOn ? 'activado' : 'desactivado'}`}
      onClick={onToggle}
    >
      <span aria-hidden="true">{isOn ? iconOn : iconOff}</span>
    </button>
  )
}

export function SoundControls() {
  const { settings, toggleMusic, toggleEffects } = useSound()

  return (
    <div className="sound-controls" role="group" aria-label="Sonido">
      <SoundToggle
        label="Música"
        iconOn="🎵"
        iconOff="🔇"
        isOn={settings.musicEnabled}
        onToggle={toggleMusic}
      />
      <SoundToggle
        label="Efectos de sonido"
        iconOn="🔊"
        iconOff="🔈"
        isOn={settings.effectsEnabled}
        onToggle={toggleEffects}
      />
    </div>
  )
}
