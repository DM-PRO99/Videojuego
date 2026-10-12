import { HARMONY_INFO } from '../../lib/colorHarmony'
import type { HarmonyId } from '../../types/game.types'

interface HarmonyBadgeProps {
  harmony: HarmonyId
  showDescription?: boolean
}

export function HarmonyBadge({ harmony, showDescription = false }: HarmonyBadgeProps) {
  const { icon, label, description } = HARMONY_INFO[harmony]

  return (
    <p className="harmony" aria-live="polite">
      <span className="harmony__badge">
        <span aria-hidden="true">{icon}</span> Combinación: {label}
      </span>
      {showDescription && <span className="harmony__description">{description}</span>}
    </p>
  )
}
