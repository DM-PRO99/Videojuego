import { useState } from 'react'

type ColorKind = 'primario' | 'secundario' | 'terciario'

interface WheelColor {
  name: string
  hex: string
  kind: ColorKind
}

/** Círculo cromático tradicional (rojo-amarillo-azul), en el sentido de las agujas del reloj. */
const WHEEL_COLORS: readonly WheelColor[] = [
  { name: 'Amarillo', hex: '#fde047', kind: 'primario' },
  { name: 'Amarillo verdoso', hex: '#bfdc4c', kind: 'terciario' },
  { name: 'Verde', hex: '#5cc46b', kind: 'secundario' },
  { name: 'Azul verdoso', hex: '#3fb3b0', kind: 'terciario' },
  { name: 'Azul', hex: '#4f8fe0', kind: 'primario' },
  { name: 'Azul violeta', hex: '#6f6fd8', kind: 'terciario' },
  { name: 'Violeta', hex: '#9a63d1', kind: 'secundario' },
  { name: 'Rojo violeta', hex: '#c95bb0', kind: 'terciario' },
  { name: 'Rojo', hex: '#ee5d6c', kind: 'primario' },
  { name: 'Rojo anaranjado', hex: '#f47b4f', kind: 'terciario' },
  { name: 'Naranja', hex: '#f89c3c', kind: 'secundario' },
  { name: 'Amarillo anaranjado', hex: '#fbc13e', kind: 'terciario' },
]

const CENTER = 110
const OUTER_RADIUS = 100
const INNER_RADIUS = 46
const SEGMENT_DEGREES = 360 / WHEEL_COLORS.length
const HALF_WHEEL = WHEEL_COLORS.length / 2

function polarPoint(radius: number, degrees: number): string {
  // -90° para que el primer color quede arriba.
  const radians = ((degrees - 90) * Math.PI) / 180
  return `${(CENTER + radius * Math.cos(radians)).toFixed(2)} ${(CENTER + radius * Math.sin(radians)).toFixed(2)}`
}

function segmentPath(index: number): string {
  const start = index * SEGMENT_DEGREES - SEGMENT_DEGREES / 2
  const end = start + SEGMENT_DEGREES
  return [
    `M ${polarPoint(OUTER_RADIUS, start)}`,
    `A ${OUTER_RADIUS} ${OUTER_RADIUS} 0 0 1 ${polarPoint(OUTER_RADIUS, end)}`,
    `L ${polarPoint(INNER_RADIUS, end)}`,
    `A ${INNER_RADIUS} ${INNER_RADIUS} 0 0 0 ${polarPoint(INNER_RADIUS, start)}`,
    'Z',
  ].join(' ')
}

function wrapIndex(index: number): number {
  return (index + WHEEL_COLORS.length) % WHEEL_COLORS.length
}

function colorAt(index: number): WheelColor {
  const color = WHEEL_COLORS[wrapIndex(index)]
  if (!color) throw new Error(`Índice de color inválido: ${index}`)
  return color
}

function ColorTag({ color }: { color: WheelColor }) {
  return (
    <span className="wheel__tag">
      <span className="chips__color" style={{ backgroundColor: color.hex }} aria-hidden="true" />
      {color.name}
    </span>
  )
}

export function ColorWheel() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const selected = colorAt(selectedIndex)
  const complementaryIndex = wrapIndex(selectedIndex + HALF_WHEEL)
  const analogousIndexes = [wrapIndex(selectedIndex - 1), wrapIndex(selectedIndex + 1)]

  const getSegmentClass = (index: number): string => {
    if (index === selectedIndex) return 'wheel__segment is-selected'
    if (index === complementaryIndex || analogousIndexes.includes(index)) return 'wheel__segment is-related'
    return 'wheel__segment'
  }

  return (
    <div className="wheel">
      <svg className="wheel__svg" viewBox="0 0 220 220" role="group" aria-label="Círculo cromático interactivo">
        {WHEEL_COLORS.map((color, index) => (
          <path
            key={color.name}
            d={segmentPath(index)}
            fill={color.hex}
            className={getSegmentClass(index)}
            role="button"
            tabIndex={0}
            aria-label={`${color.name}, color ${color.kind}`}
            aria-pressed={index === selectedIndex}
            onClick={() => setSelectedIndex(index)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                setSelectedIndex(index)
              }
            }}
          />
        ))}
        <circle cx={CENTER} cy={CENTER} r={INNER_RADIUS - 8} fill={selected.hex} />
      </svg>

      <div className="wheel__info" aria-live="polite">
        <p className="wheel__hint">Toca un color para ver con cuáles combina.</p>
        <p>
          <strong>{selected.name}</strong> es un color {selected.kind}.
        </p>
        <p>
          Complementario (opuesto): <ColorTag color={colorAt(complementaryIndex)} />
        </p>
        <p>
          Análogos (vecinos):{' '}
          {analogousIndexes.map((index) => (
            <ColorTag key={index} color={colorAt(index)} />
          ))}
        </p>
      </div>
    </div>
  )
}
