import type { Palette } from '../../data/catalog'
import type { AccessoryId, BottomId, ShoesId, TopId } from '../../types/game.types'

/** Piezas SVG del maniquí. Todas comparten el lienzo de 200 × 350. */

export const OUTLINE = '#3b3f5c'
export const SKIN = '#f3c9a8'
const GOLD = '#e8b94a'
const ACCENT = '#e87aa4'
const CANVAS_WIDTH = 200
const LEFT_FOOT_X = 87
const RIGHT_FOOT_X = 113
const FEET_X = [LEFT_FOOT_X, RIGHT_FOOT_X] as const

const SHOULDER = { x: 70, y: 96 }
const HAND = { x: 46, y: 184 }
const SHORT_SLEEVE = 0.34
const LONG_SLEEVE = 0.9

type Side = 'left' | 'right'
const SIDES: readonly Side[] = ['left', 'right']

interface GarmentProps {
  palette: Palette
}

/** Punto sobre el brazo: 0 = hombro, 1 = mano. */
export function armPoint(side: Side, fraction: number): { x: number; y: number } {
  const x = SHOULDER.x + (HAND.x - SHOULDER.x) * fraction
  const y = SHOULDER.y + (HAND.y - SHOULDER.y) * fraction
  return { x: side === 'left' ? x : CANVAS_WIDTH - x, y }
}

function Sleeves({ palette, length }: GarmentProps & { length: number }) {
  return (
    <>
      {SIDES.map((side) => {
        const start = armPoint(side, 0)
        const end = armPoint(side, length)
        return (
          <g key={side} strokeLinecap="round">
            <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke={OUTLINE} strokeWidth={20} />
            <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke={palette.hex} strokeWidth={17} />
          </g>
        )
      })}
    </>
  )
}

const TORSO_PATH = 'M68 88 Q100 80 132 88 L129 184 L71 184 Z'
const DRESS_PATH = 'M68 88 Q100 80 132 88 L126 150 L150 262 L50 262 L74 150 Z'
const LONG_SLEEVED_TOPS: readonly TopId[] = ['camisa', 'sueter', 'blazer']

function TopDetails({ topId, palette }: GarmentProps & { topId: TopId }) {
  const detail = { stroke: palette.detailHex, strokeWidth: 2, fill: 'none', strokeLinecap: 'round' as const }

  switch (topId) {
    case 'camiseta':
      return <path d="M90 85 Q100 96 110 85" {...detail} fill={SKIN} />
    case 'blusa':
      return (
        <>
          <path d="M88 85 Q94 98 100 88 Q106 98 112 85" {...detail} fill="#ffffff" />
          <path d="M74 176 Q81 170 88 176 Q95 170 100 176 Q107 170 114 176 Q121 170 127 176" {...detail} />
        </>
      )
    case 'camisa':
      return (
        <>
          <path d="M88 84 L100 98 L112 84 L106 82 L100 90 L94 82 Z" {...detail} fill="#ffffff" />
          <line x1={100} y1={98} x2={100} y2={184} {...detail} />
          {[114, 134, 154].map((y) => (
            <circle key={y} cx={100} cy={y} r={2} fill={palette.detailHex} />
          ))}
        </>
      )
    case 'sueter':
      return (
        <>
          <path d="M88 84 Q100 96 112 84" {...detail} strokeWidth={5} />
          <rect x={71} y={172} width={58} height={12} rx={3} fill={palette.detailHex} opacity={0.55} />
          <path d="M84 110 L84 164 M100 110 L100 164 M116 110 L116 164" {...detail} strokeDasharray="5 5" />
        </>
      )
    case 'blazer':
      return (
        <>
          <path d="M88 84 L100 132 L112 84 Z" fill="#ffffff" stroke={OUTLINE} strokeWidth={1} />
          <path d="M88 84 L78 104 L100 136 Z M112 84 L122 104 L100 136 Z" fill={palette.detailHex} />
          <line x1={100} y1={136} x2={100} y2={184} {...detail} />
          <circle cx={105} cy={150} r={2.5} fill={palette.detailHex} />
        </>
      )
    case 'vestido':
      return (
        <>
          <path d="M90 85 Q100 96 110 85" {...detail} fill={SKIN} />
          <path d="M74 150 Q100 158 126 150" {...detail} />
          <path d="M82 170 L72 258 M100 172 L100 260 M118 170 L128 258" {...detail} />
        </>
      )
  }
}

export function Top({ topId, palette }: GarmentProps & { topId: TopId }) {
  const sleeveLength = LONG_SLEEVED_TOPS.includes(topId) ? LONG_SLEEVE : SHORT_SLEEVE

  return (
    <g>
      <path
        d={topId === 'vestido' ? DRESS_PATH : TORSO_PATH}
        fill={palette.hex}
        stroke={OUTLINE}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <Sleeves palette={palette} length={sleeveLength} />
      <TopDetails topId={topId} palette={palette} />
    </g>
  )
}

const LEG_PATHS: Record<Exclude<BottomId, 'falda'>, readonly string[]> = {
  jeans: ['M72 180 L100 180 L99 312 L77 312 Z', 'M100 180 L128 180 L123 312 L101 312 Z'],
  pantalon: ['M71 180 L100 180 L100 314 L68 314 Z', 'M100 180 L129 180 L132 314 L100 314 Z'],
}

export function Bottom({ bottomId, palette }: GarmentProps & { bottomId: BottomId }) {
  const shape = { fill: palette.hex, stroke: OUTLINE, strokeWidth: 1.5, strokeLinejoin: 'round' as const }
  const detail = { stroke: palette.detailHex, strokeWidth: 2, fill: 'none', strokeLinecap: 'round' as const }

  if (bottomId === 'falda') {
    return (
      <g>
        <path d="M72 180 L128 180 L144 250 L56 250 Z" {...shape} />
        <path d="M84 186 L74 248 M96 186 L92 248 M108 186 L110 248 M120 186 L128 248" {...detail} />
      </g>
    )
  }

  return (
    <g>
      {LEG_PATHS[bottomId].map((path) => (
        <path key={path} d={path} {...shape} />
      ))}
      {bottomId === 'jeans' ? (
        <path
          d="M78 196 Q86 204 94 196 M106 196 Q114 204 122 196 M81 300 L96 300 M104 300 L120 300"
          {...detail}
          strokeDasharray="3 3"
        />
      ) : (
        <path d="M85 192 L84 308 M115 192 L116 308" {...detail} />
      )}
    </g>
  )
}

export function Shoes({ shoesId, palette }: GarmentProps & { shoesId: ShoesId }) {
  const shape = { fill: palette.hex, stroke: OUTLINE, strokeWidth: 1.5 }

  return (
    <g>
      {FEET_X.map((footX) => {
        switch (shoesId) {
          case 'tenis':
            return (
              <g key={footX}>
                <rect x={footX - 12} y={312} width={24} height={16} rx={7} {...shape} />
                <rect x={footX - 12} y={324} width={24} height={5} rx={2.5} fill="#ffffff" stroke={OUTLINE} strokeWidth={1} />
                <path d={`M${footX - 4} 316 L${footX + 4} 316 M${footX - 4} 320 L${footX + 4} 320`} stroke={palette.detailHex} strokeWidth={1.5} />
              </g>
            )
          case 'escolares':
            return (
              <g key={footX}>
                <ellipse cx={footX} cy={322} rx={13} ry={8} {...shape} />
                <path d={`M${footX - 9} 318 L${footX + 9} 318`} stroke={palette.detailHex} strokeWidth={2.5} strokeLinecap="round" />
              </g>
            )
          case 'sandalias':
            return (
              <g key={footX}>
                <ellipse cx={footX} cy={322} rx={10} ry={6} fill={SKIN} stroke={OUTLINE} strokeWidth={1} />
                <rect x={footX - 12} y={326} width={24} height={4} rx={2} {...shape} />
                <path d={`M${footX - 9} 318 L${footX + 9} 324 M${footX + 9} 318 L${footX - 9} 324`} stroke={palette.detailHex} strokeWidth={3} strokeLinecap="round" />
              </g>
            )
          case 'botines':
            return (
              <g key={footX}>
                <rect x={footX - 11} y={292} width={22} height={36} rx={5} {...shape} />
                <rect x={footX - 13} y={324} width={26} height={5} rx={2} fill={palette.detailHex} />
              </g>
            )
        }
      })}
    </g>
  )
}

export function AccessoryPiece({ accessoryId }: { accessoryId: AccessoryId }) {
  const leftWrist = armPoint('left', 0.82)
  const rightWrist = armPoint('right', 0.82)
  const rightHand = armPoint('right', 1)

  switch (accessoryId) {
    case 'diadema':
      return <path d="M75 42 Q100 12 125 42" fill="none" stroke={ACCENT} strokeWidth={5} strokeLinecap="round" />
    case 'aretes':
      return (
        <g fill={GOLD} stroke={OUTLINE} strokeWidth={0.8}>
          <circle cx={74} cy={60} r={3.5} />
          <circle cx={126} cy={60} r={3.5} />
        </g>
      )
    case 'gafas':
      return (
        <g fill="rgba(255,255,255,0.45)" stroke={OUTLINE} strokeWidth={2}>
          <circle cx={90} cy={50} r={8} />
          <circle cx={110} cy={50} r={8} />
          <line x1={98} y1={50} x2={102} y2={50} />
        </g>
      )
    case 'bolso':
      return (
        <g stroke={OUTLINE} strokeWidth={1.5}>
          <path d={`M${rightHand.x - 8} ${rightHand.y + 10} Q${rightHand.x} ${rightHand.y - 8} ${rightHand.x + 8} ${rightHand.y + 10}`} fill="none" />
          <rect x={rightHand.x - 14} y={rightHand.y + 8} width={28} height={22} rx={5} fill={ACCENT} />
          <circle cx={rightHand.x} cy={rightHand.y + 17} r={2.5} fill={GOLD} />
        </g>
      )
    case 'reloj':
      return (
        <g stroke={OUTLINE} strokeWidth={1}>
          <rect x={leftWrist.x - 9} y={leftWrist.y - 3} width={18} height={6} rx={2} fill="#7d8099" transform={`rotate(15 ${leftWrist.x} ${leftWrist.y})`} />
          <circle cx={leftWrist.x} cy={leftWrist.y} r={5} fill="#ffffff" />
        </g>
      )
    case 'pulseras':
      return (
        <g strokeWidth={3} strokeLinecap="round">
          <line x1={rightWrist.x - 8} y1={rightWrist.y - 4} x2={rightWrist.x + 8} y2={rightWrist.y} stroke={GOLD} />
          <line x1={rightWrist.x - 7} y1={rightWrist.y + 2} x2={rightWrist.x + 9} y2={rightWrist.y + 6} stroke="#8fdcb9" />
        </g>
      )
    case 'sombrero':
      return (
        <g fill="#f4dfa5" stroke={OUTLINE} strokeWidth={1.5}>
          <ellipse cx={100} cy={32} rx={44} ry={9} />
          <path d="M78 32 Q78 6 100 6 Q122 6 122 32 Z" />
          <path d="M78 27 L122 27" stroke={ACCENT} strokeWidth={4} />
        </g>
      )
    case 'collar':
      return (
        <g fill="none" stroke={GOLD} strokeWidth={2}>
          <path d="M88 86 Q100 110 112 86" />
          <circle cx={100} cy={99} r={3.5} fill={GOLD} stroke={OUTLINE} strokeWidth={0.8} />
        </g>
      )
    case 'bufanda':
      return (
        <g fill="#b9a4e8" stroke={OUTLINE} strokeWidth={1.5} strokeLinejoin="round">
          <rect x={84} y={76} width={32} height={14} rx={6} />
          <path d="M106 88 L118 88 L120 128 L108 128 Z" />
        </g>
      )
  }
}
