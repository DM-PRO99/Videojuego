export type ScreenId =
  | 'home'
  | 'menu'
  | 'creator'
  | 'diary'
  | 'learn'
  | 'achievements'
  | 'farewell'

export type OccasionId = 'clases' | 'deporte' | 'amigos' | 'evento' | 'libre'
export type TopId = 'camiseta' | 'blusa' | 'camisa' | 'sueter' | 'blazer' | 'vestido'
export type BottomId = 'jeans' | 'falda' | 'pantalon'
export type ShoesId = 'tenis' | 'escolares' | 'sandalias' | 'botines'
export type PaletteId = 'blancos' | 'negros' | 'azules' | 'rosas' | 'verdes' | 'neutros'
export type AccessoryId =
  | 'diadema'
  | 'aretes'
  | 'bolso'
  | 'reloj'
  | 'gafas'
  | 'pulseras'
  | 'sombrero'
  | 'collar'
  | 'bufanda'
export type EmotionId = 'tranquila' | 'segura' | 'creativa' | 'elegante'
export type HarmonyId = 'neutra' | 'monocromatica' | 'analoga' | 'complementaria' | 'contraste'
export type AchievementId =
  | 'primer-diario'
  | 'cada-momento'
  | 'maestra-colores'
  | 'mi-voz'
  | 'mente-curiosa'

export type GarmentSlot = 'top' | 'bottom' | 'shoes'
export type LookColors = Record<GarmentSlot, PaletteId>

export interface Look {
  occasionId: OccasionId
  topId: TopId
  /** null cuando la prenda superior es un vestido. */
  bottomId: BottomId | null
  shoesId: ShoesId
  colors: LookColors
  accessoryIds: readonly AccessoryId[]
}

/** Look en construcción: las elecciones pendientes son null. */
export interface LookDraft {
  occasionId: OccasionId | null
  topId: TopId | null
  bottomId: BottomId | null
  shoesId: ShoesId | null
  colors: LookColors
  accessoryIds: readonly AccessoryId[]
}

export interface DiaryEntry {
  id: string
  /** Fecha ISO 8601. */
  createdAt: string
  name: string
  look: Look
  note: string
  /** 1 a 5 estrellas. */
  rating: number
  emotionId: EmotionId
}

export type DiaryEntryInput = Omit<DiaryEntry, 'id' | 'createdAt'>

export interface FinalReflection {
  authorName: string
  text: string
  completedAt: string
}

export interface GameProgress {
  entries: readonly DiaryEntry[]
  finalReflection: FinalReflection | null
  quizCompleted: boolean
}

export interface GameState extends GameProgress {
  screen: ScreenId
}
