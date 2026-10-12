# Mi Diario de Estilo

Videojuego educativo para crear looks, guardarlos en un diario virtual con reflexiones personales y aprender conceptos básicos de moda.

## Cómo ejecutarlo

```bash
npm install
npm run dev        # servidor de desarrollo
npm run build      # verificación de tipos + compilación a dist/
npm test           # pruebas unitarias
```

## Stack

React 19, TypeScript (modo estricto), Vite y Vitest. Sin backend: el progreso se guarda en `localStorage`.

## Estructura

```
src/
├── components/
│   ├── ui/        # Componentes genéricos: Button, Card, Modal, OptionGrid, StarRating, Stepper…
│   ├── look/      # Maniquí SVG, prendas, paletas y armonía de color
│   └── learn/     # Círculo cromático interactivo
├── context/       # Estado global (reducer + provider)
├── data/          # Catálogo de prendas, logros, lecciones y datos de portada
├── hooks/         # useGame
├── lib/           # Lógica pura: armonía de color, logros, guardado, fechas
├── screens/       # Las 7 pantallas del juego
├── styles/        # Tokens de diseño y estilos
└── types/         # Tipos compartidos
```

## Personalización

- **Portada** (autor, grado, materia): `src/data/projectInfo.ts`
- **Prendas, colores, accesorios y ocasiones**: `src/data/catalog.ts`
- **Logros y niveles**: `src/data/achievements.ts` (reglas en `src/lib/achievements.ts`)
- **Lecciones y preguntas**: `src/data/lessons.ts`
- **Colores y tipografías**: variables CSS en `src/styles/global.css`
