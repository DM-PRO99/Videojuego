import type { Look } from '../types/game.types'

export type LessonId = 'color' | 'silueta' | 'responsable' | 'identidad'

export interface LessonExample {
  caption: string
  look: Look
}

export interface Lesson {
  id: LessonId
  icon: string
  title: string
  intro: string
  points: readonly string[]
  examples?: readonly LessonExample[]
}

export interface QuizQuestion {
  id: string
  question: string
  options: readonly string[]
  correctIndex: number
  explanation: string
}

export const LESSONS: readonly Lesson[] = [
  {
    id: 'color',
    icon: '🎨',
    title: 'Círculo cromático',
    intro: 'El círculo cromático ordena los colores y nos ayuda a combinarlos.',
    points: [
      'Primarios: rojo, amarillo y azul. No se obtienen mezclando otros colores.',
      'Secundarios: naranja, verde y violeta. Nacen al mezclar dos primarios.',
      'Análogos: colores vecinos en el círculo, como azul y verde. Se ven suaves y armoniosos.',
      'Complementarios: colores opuestos, como rosa (rojo claro) y verde. Crean contraste y energía.',
      'Los blancos, negros y tonos neutros combinan con todo.',
    ],
  },
  {
    id: 'silueta',
    icon: '🧥',
    title: 'Tipos de silueta',
    intro: 'La silueta es la forma que dibuja tu ropa. El secreto está en el equilibrio.',
    points: [
      'Si arriba llevas algo amplio (suéter, blazer), abajo elige algo más recto o ajustado.',
      'Si abajo llevas volumen (falda plisada, pantalón ancho), arriba funciona algo sencillo.',
      'Un vestido ya equilibra arriba y abajo por sí solo.',
    ],
    examples: [
      {
        caption: 'Amplio arriba + recto abajo',
        look: {
          occasionId: 'libre',
          topId: 'sueter',
          bottomId: 'jeans',
          shoesId: 'tenis',
          colors: { top: 'verdes', bottom: 'azules', shoes: 'blancos' },
          accessoryIds: [],
        },
      },
      {
        caption: 'Sencillo arriba + volumen abajo',
        look: {
          occasionId: 'libre',
          topId: 'camiseta',
          bottomId: 'falda',
          shoesId: 'botines',
          colors: { top: 'blancos', bottom: 'rosas', shoes: 'negros' },
          accessoryIds: [],
        },
      },
    ],
  },
  {
    id: 'responsable',
    icon: '🌿',
    title: 'Moda responsable',
    intro: 'Vestir bien también es cuidar el planeta y lo que ya tenemos.',
    points: [
      'Reutiliza: una misma prenda puede servir para muchas ocasiones.',
      'Combina lo que ya tienes antes de pedir algo nuevo.',
      'Cuida tu ropa: lávala y guárdala bien para que dure más.',
      'Intercambia o dona las prendas que ya no usas.',
    ],
  },
  {
    id: 'identidad',
    icon: '💎',
    title: 'Estilo e identidad',
    intro: 'La ropa es una forma de decir quiénes somos sin usar palabras.',
    points: [
      'No existe un estilo correcto: existe el tuyo.',
      'Fíjate en cómo te sientes con cada look, no solo en cómo se ve.',
      'Tu estilo puede cambiar contigo, y eso está bien.',
    ],
  },
]

export const QUIZ_QUESTIONS: readonly QuizQuestion[] = [
  {
    id: 'primarios',
    question: '¿Cuáles son los colores primarios?',
    options: ['Verde, naranja y violeta', 'Rojo, amarillo y azul', 'Blanco, negro y gris'],
    correctIndex: 1,
    explanation: 'Rojo, amarillo y azul: de ellos nacen todos los demás.',
  },
  {
    id: 'complementarios',
    question: 'Los colores complementarios son los que están…',
    options: ['Uno al lado del otro', 'Opuestos en el círculo cromático', 'En la misma familia'],
    correctIndex: 1,
    explanation: 'Están frente a frente en el círculo, por eso contrastan tanto.',
  },
  {
    id: 'analogos',
    question: '¿Qué pareja de colores es análoga?',
    options: ['Azul y verde', 'Rosa y verde', 'Rojo y verde'],
    correctIndex: 0,
    explanation: 'Azul y verde son vecinos en el círculo cromático.',
  },
  {
    id: 'silueta',
    question: 'Si llevas un suéter amplio, ¿qué lo equilibra mejor?',
    options: ['Otra prenda muy amplia abajo', 'Unos jeans rectos', 'No importa la parte de abajo'],
    correctIndex: 1,
    explanation: 'Amplio arriba y recto abajo mantiene el equilibrio de la silueta.',
  },
  {
    id: 'responsable',
    question: '¿Cuál es una práctica de moda responsable?',
    options: [
      'Usar cada prenda una sola vez',
      'Comprar ropa nueva cada semana',
      'Combinar y cuidar las prendas que ya tengo',
    ],
    correctIndex: 2,
    explanation: 'Reutilizar y cuidar la ropa hace que dure más y genera menos residuos.',
  },
]
