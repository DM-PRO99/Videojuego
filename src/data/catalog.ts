import type {
  AccessoryId,
  AchievementId,
  BottomId,
  EmotionId,
  OccasionId,
  PaletteId,
  ShoesId,
  TopId,
} from '../types/game.types'

export interface CatalogOption<Id extends string> {
  id: Id
  label: string
  icon: string
}

export interface Occasion extends CatalogOption<OccasionId> {
  tip: string
}

export interface Palette extends CatalogOption<PaletteId> {
  hex: string
  /** Color para costuras y detalles sobre la prenda. */
  detailHex: string
  /** Posición en el círculo cromático (grados). null = neutro. */
  hue: number | null
}

export interface Accessory extends CatalogOption<AccessoryId> {
  /** Logro necesario para desbloquearlo. */
  requiresAchievement?: AchievementId
}

export const OCCASIONS: readonly Occasion[] = [
  {
    id: 'clases',
    label: 'Día de clases',
    icon: '🎒',
    tip: 'Busca ropa cómoda y ordenada que te deje moverte y concentrarte.',
  },
  {
    id: 'deporte',
    label: 'Actividad deportiva',
    icon: '⚽',
    tip: 'Prendas ligeras y tenis: lo importante es moverte con libertad.',
  },
  {
    id: 'amigos',
    label: 'Salida con amigos',
    icon: '🧋',
    tip: 'Es tu momento para jugar con colores y accesorios que te gusten.',
  },
  {
    id: 'evento',
    label: 'Evento especial',
    icon: '🎉',
    tip: 'Un blazer, un vestido o unos botines dan un toque más arreglado.',
  },
  {
    id: 'libre',
    label: 'Look libre',
    icon: '🦋',
    tip: 'Sin reglas: combina lo que más te represente.',
  },
]

export const TOPS: readonly CatalogOption<TopId>[] = [
  { id: 'camiseta', label: 'Camiseta', icon: '👕' },
  { id: 'blusa', label: 'Blusa', icon: '👚' },
  { id: 'camisa', label: 'Camisa', icon: '👔' },
  { id: 'sueter', label: 'Suéter', icon: '🧶' },
  { id: 'blazer', label: 'Blazer', icon: '🧥' },
  { id: 'vestido', label: 'Vestido', icon: '👗' },
]

export const BOTTOMS: readonly CatalogOption<BottomId>[] = [
  { id: 'jeans', label: 'Jeans', icon: '👖' },
  { id: 'falda', label: 'Falda plisada', icon: '🩱' },
  { id: 'pantalon', label: 'Pantalón', icon: '🩳' },
]

export const SHOES: readonly CatalogOption<ShoesId>[] = [
  { id: 'tenis', label: 'Tenis', icon: '👟' },
  { id: 'escolares', label: 'Zapatos escolares', icon: '👞' },
  { id: 'sandalias', label: 'Sandalias', icon: '👡' },
  { id: 'botines', label: 'Botines', icon: '👢' },
]

export const PALETTES: readonly Palette[] = [
  { id: 'blancos', label: 'Blancos', icon: '🤍', hex: '#fbfbfd', detailHex: '#c9cbdb', hue: null },
  { id: 'negros', label: 'Negros', icon: '🖤', hex: '#2e2f3d', detailHex: '#7d8099', hue: null },
  { id: 'azules', label: 'Azules', icon: '💙', hex: '#7fb2e8', detailHex: '#4d7fb8', hue: 210 },
  { id: 'rosas', label: 'Rosas', icon: '🩷', hex: '#f6a8c6', detailHex: '#d16f97', hue: 330 },
  { id: 'verdes', label: 'Verdes', icon: '💚', hex: '#8fdcb9', detailHex: '#55a886', hue: 150 },
  { id: 'neutros', label: 'Tonos neutros', icon: '🤎', hex: '#dcc7a8', detailHex: '#a88f6b', hue: null },
]

export const ACCESSORIES: readonly Accessory[] = [
  { id: 'diadema', label: 'Diadema', icon: '🎀' },
  { id: 'aretes', label: 'Aretes', icon: '💎' },
  { id: 'bolso', label: 'Bolso', icon: '👜' },
  { id: 'reloj', label: 'Reloj', icon: '⌚' },
  { id: 'gafas', label: 'Gafas', icon: '👓' },
  { id: 'pulseras', label: 'Pulseras', icon: '📿' },
  { id: 'sombrero', label: 'Sombrero', icon: '👒', requiresAchievement: 'cada-momento' },
  { id: 'collar', label: 'Collar', icon: '🪙', requiresAchievement: 'cada-momento' },
  { id: 'bufanda', label: 'Bufanda', icon: '🧣', requiresAchievement: 'cada-momento' },
]

export const EMOTIONS: readonly CatalogOption<EmotionId>[] = [
  { id: 'tranquila', label: 'Tranquila', icon: '😊' },
  { id: 'segura', label: 'Segura', icon: '💪' },
  { id: 'creativa', label: 'Creativa', icon: '✨' },
  { id: 'elegante', label: 'Elegante', icon: '🥰' },
]

export function findOption<Id extends string, Option extends CatalogOption<Id>>(
  options: readonly Option[],
  id: Id | null,
): Option | undefined {
  return options.find((option) => option.id === id)
}

export function getPalette(id: PaletteId): Palette {
  const palette = findOption(PALETTES, id)
  if (!palette) throw new Error(`Paleta desconocida: ${id}`)
  return palette
}
