import { getPalette } from '../data/catalog'
import type { HarmonyId, PaletteId } from '../types/game.types'

const FULL_CIRCLE_DEGREES = 360
const ANALOGOUS_MAX_DEGREES = 60
const COMPLEMENTARY_MIN_DEGREES = 150

export interface HarmonyInfo {
  label: string
  icon: string
  description: string
}

export const HARMONY_INFO: Record<HarmonyId, HarmonyInfo> = {
  neutra: {
    label: 'Neutra',
    icon: '🤍',
    description: 'Solo blancos, negros y neutros: una base tranquila que combina con todo.',
  },
  monocromatica: {
    label: 'Un color protagonista',
    icon: '🎯',
    description: 'Un solo color acompañado de neutros: sencillo y ordenado.',
  },
  analoga: {
    label: 'Análoga',
    icon: '🌊',
    description: 'Colores vecinos en el círculo cromático: armonía suave.',
  },
  complementaria: {
    label: 'Complementaria',
    icon: '⚡',
    description: 'Colores opuestos en el círculo cromático: contraste con energía.',
  },
  contraste: {
    label: 'Contraste libre',
    icon: '🎈',
    description: 'Colores separados sin ser opuestos: una mezcla atrevida y divertida.',
  },
}

function hueDistance(hueA: number, hueB: number): number {
  const difference = Math.abs(hueA - hueB) % FULL_CIRCLE_DEGREES
  return Math.min(difference, FULL_CIRCLE_DEGREES - difference)
}

function getPairDistances(hues: readonly number[]): number[] {
  return hues.flatMap((hue, index) =>
    hues.slice(index + 1).map((otherHue) => hueDistance(hue, otherHue)),
  )
}

/** Clasifica la combinación de colores de un look según el círculo cromático. */
export function getHarmony(paletteIds: readonly PaletteId[]): HarmonyId {
  const hues = [...new Set(paletteIds)]
    .map((id) => getPalette(id).hue)
    .filter((hue): hue is number => hue !== null)

  if (hues.length === 0) return 'neutra'
  if (hues.length === 1) return 'monocromatica'

  const distances = getPairDistances(hues)
  if (distances.some((distance) => distance >= COMPLEMENTARY_MIN_DEGREES)) return 'complementaria'
  if (distances.every((distance) => distance <= ANALOGOUS_MAX_DEGREES)) return 'analoga'
  return 'contraste'
}
