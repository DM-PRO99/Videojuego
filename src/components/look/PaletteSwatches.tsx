import { PALETTES } from '../../data/catalog'
import type { PaletteId } from '../../types/game.types'

interface PaletteSwatchesProps {
  legend: string
  selectedId: PaletteId
  onSelect: (id: PaletteId) => void
}

export function PaletteSwatches({ legend, selectedId, onSelect }: PaletteSwatchesProps) {
  return (
    <fieldset className="swatches">
      <legend className="swatches__legend">{legend}</legend>
      <div className="swatches__items">
        {PALETTES.map((palette) => (
          <button
            key={palette.id}
            type="button"
            className="swatch"
            aria-pressed={palette.id === selectedId}
            onClick={() => onSelect(palette.id)}
          >
            <span className="swatch__color" style={{ backgroundColor: palette.hex }} aria-hidden="true" />
            <span className="swatch__label">{palette.label}</span>
          </button>
        ))}
      </div>
    </fieldset>
  )
}
