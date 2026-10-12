import { memo } from 'react'
import { getPalette } from '../../data/catalog'
import { isDress } from '../../lib/look'
import type { LookDraft } from '../../types/game.types'
import { AccessoryPiece, Bottom, OUTLINE, SKIN, Shoes, Top, armPoint } from './garments'

const HAIR = '#5b4636'
const BASE_LAYER = '#ebe6f5'

export type PreviewLook = Pick<
  LookDraft,
  'topId' | 'bottomId' | 'shoesId' | 'colors' | 'accessoryIds'
>

interface LookPreviewProps {
  look: PreviewLook
  label?: string
  size?: 'sm' | 'md' | 'lg'
}

function Mannequin() {
  const arms = (['left', 'right'] as const).map((side) => ({
    side,
    shoulder: armPoint(side, 0),
    hand: armPoint(side, 1),
  }))

  return (
    <g>
      <circle cx={100} cy={46} r={31} fill={HAIR} />
      <path d="M70 46 Q64 84 76 96 L124 96 Q136 84 130 46 Z" fill={HAIR} />
      {[79, 105].map((x) => (
        <rect key={x} x={x} y={178} width={16} height={144} rx={7} fill={SKIN} stroke={OUTLINE} strokeWidth={1} />
      ))}
      <rect x={93} y={70} width={14} height={18} fill={SKIN} stroke={OUTLINE} strokeWidth={1} />
      {arms.map(({ side, shoulder, hand }) => (
        <g key={side} strokeLinecap="round">
          <line x1={shoulder.x} y1={shoulder.y} x2={hand.x} y2={hand.y} stroke={OUTLINE} strokeWidth={15} />
          <line x1={shoulder.x} y1={shoulder.y} x2={hand.x} y2={hand.y} stroke={SKIN} strokeWidth={13} />
        </g>
      ))}
      <path d="M68 88 Q100 80 132 88 L129 184 L128 214 L72 214 L71 184 Z" fill={BASE_LAYER} stroke={OUTLINE} strokeWidth={1} />
      <circle cx={100} cy={50} r={26} fill={SKIN} stroke={OUTLINE} strokeWidth={1} />
      <path d="M74 46 Q82 22 100 24 Q118 22 126 46 Q112 34 100 36 Q88 34 74 46 Z" fill={HAIR} />
      <circle cx={90} cy={51} r={2.4} fill={OUTLINE} />
      <circle cx={110} cy={51} r={2.4} fill={OUTLINE} />
      <path d="M92 61 Q100 68 108 61" fill="none" stroke={OUTLINE} strokeWidth={2} strokeLinecap="round" />
    </g>
  )
}

function LookPreviewComponent({ look, label = 'Vista previa del look', size = 'md' }: LookPreviewProps) {
  const { topId, bottomId, shoesId, colors, accessoryIds } = look
  const showBottom = bottomId !== null && !isDress(topId)

  return (
    <svg
      className={`look-preview look-preview--${size}`}
      viewBox="0 0 200 350"
      role="img"
      aria-label={label}
    >
      <ellipse cx={100} cy={334} rx={62} ry={8} fill="rgba(59, 63, 92, 0.12)" />
      <Mannequin />
      {shoesId && <Shoes shoesId={shoesId} palette={getPalette(colors.shoes)} />}
      {showBottom && <Bottom bottomId={bottomId} palette={getPalette(colors.bottom)} />}
      {topId && <Top topId={topId} palette={getPalette(colors.top)} />}
      {accessoryIds.map((accessoryId) => (
        <AccessoryPiece key={accessoryId} accessoryId={accessoryId} />
      ))}
    </svg>
  )
}

export const LookPreview = memo(LookPreviewComponent)
