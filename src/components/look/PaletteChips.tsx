import { getPalette } from '../../data/catalog'
import type { PaletteId } from '../../types/game.types'

interface PaletteChipsProps {
  paletteIds: readonly PaletteId[]
  showLabels?: boolean
}

/** Muestra de la paleta usada en un look. */
export function PaletteChips({ paletteIds, showLabels = false }: PaletteChipsProps) {
  return (
    <ul className="chips" aria-label="Paleta de colores">
      {paletteIds.map((id) => {
        const palette = getPalette(id)
        return (
          <li key={id} className="chips__item" title={palette.label}>
            <span className="chips__color" style={{ backgroundColor: palette.hex }} aria-hidden="true" />
            <span className={showLabels ? undefined : 'visually-hidden'}>{palette.label}</span>
          </li>
        )
      })}
    </ul>
  )
}
