import { Card } from '../../components/ui/Card'
import { EMOTIONS } from '../../data/catalog'
import type { DiaryEntry } from '../../types/game.types'

interface EmotionSummaryProps {
  entries: readonly DiaryEntry[]
}

function getAverageRating(entries: readonly DiaryEntry[]): number {
  if (entries.length === 0) return 0
  return entries.reduce((total, entry) => total + entry.rating, 0) / entries.length
}

/** Resume qué emociones aparecen en el diario y cuánto bienestar generan. */
export function EmotionSummary({ entries }: EmotionSummaryProps) {
  return (
    <Card tone="mint">
      <h2 className="section-title">Mis emociones</h2>
      <ul className="emotions">
        {EMOTIONS.map((emotion) => {
          const emotionEntries = entries.filter((entry) => entry.emotionId === emotion.id)
          return (
            <li key={emotion.id} className="emotions__item">
              <span className="emotions__icon" aria-hidden="true">
                {emotion.icon}
              </span>
              <span className="emotions__label">{emotion.label}</span>
              <span className="emotions__count">
                {emotionEntries.length} {emotionEntries.length === 1 ? 'look' : 'looks'}
              </span>
              {emotionEntries.length > 0 && (
                <span className="emotions__average">
                  ★ {getAverageRating(emotionEntries).toFixed(1)}
                </span>
              )}
            </li>
          )
        })}
      </ul>
    </Card>
  )
}
