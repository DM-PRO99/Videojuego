import type { Look, LookDraft, PaletteId, TopId } from '../types/game.types'

export const EMPTY_DRAFT: LookDraft = {
  occasionId: null,
  topId: null,
  bottomId: null,
  shoesId: null,
  colors: { top: 'rosas', bottom: 'azules', shoes: 'blancos' },
  accessoryIds: [],
}

/** Un vestido cubre arriba y abajo, así que no lleva prenda inferior. */
export function isDress(topId: TopId | null): boolean {
  return topId === 'vestido'
}

export function hasAllGarments(draft: LookDraft): boolean {
  if (!draft.topId || !draft.shoesId) return false
  return isDress(draft.topId) || draft.bottomId !== null
}

export function toCompleteLook(draft: LookDraft): Look | null {
  const { occasionId, topId, shoesId } = draft
  if (!occasionId || !topId || !shoesId || !hasAllGarments(draft)) return null

  return {
    occasionId,
    topId,
    bottomId: isDress(topId) ? null : draft.bottomId,
    shoesId,
    colors: draft.colors,
    accessoryIds: draft.accessoryIds,
  }
}

/** Paletas visibles en el look, sin repetir. */
export function getUsedPaletteIds(look: Pick<LookDraft, 'topId' | 'colors'>): PaletteId[] {
  const { top, bottom, shoes } = look.colors
  const visible = isDress(look.topId) ? [top, shoes] : [top, bottom, shoes]
  return [...new Set(visible)]
}
