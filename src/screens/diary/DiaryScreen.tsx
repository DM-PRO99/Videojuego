import { useState } from 'react'
import { HarmonyBadge } from '../../components/look/HarmonyBadge'
import { LookPreview } from '../../components/look/LookPreview'
import { PaletteChips } from '../../components/look/PaletteChips'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Modal } from '../../components/ui/Modal'
import { ScreenLayout } from '../../components/ui/ScreenLayout'
import { StarRating } from '../../components/ui/StarRating'
import { REQUIRED_DIARY_ENTRIES } from '../../data/achievements'
import { ACCESSORIES, EMOTIONS, OCCASIONS, findOption } from '../../data/catalog'
import { useGame } from '../../hooks/useGame'
import { getHarmony } from '../../lib/colorHarmony'
import { formatDate } from '../../lib/formatDate'
import { getUsedPaletteIds } from '../../lib/look'
import type { DiaryEntry } from '../../types/game.types'
import { EmotionSummary } from './EmotionSummary'
import { FinalReflectionForm } from './FinalReflectionForm'

function getAccessoryLabels(entry: DiaryEntry): string {
  const labels = entry.look.accessoryIds.map((id) => findOption(ACCESSORIES, id)?.label ?? id)
  return labels.length > 0 ? labels.join(', ') : 'Sin accesorios'
}

interface EntryCardProps {
  entry: DiaryEntry
  onOpen: (entryId: string) => void
}

function EntryCard({ entry, onOpen }: EntryCardProps) {
  const occasion = findOption(OCCASIONS, entry.look.occasionId)
  const emotion = findOption(EMOTIONS, entry.emotionId)

  return (
    <button type="button" className="entry card card--plain" onClick={() => onOpen(entry.id)}>
      <LookPreview look={entry.look} size="sm" label={`Look ${entry.name}`} />
      <span className="entry__info">
        <span className="entry__date">📅 {formatDate(entry.createdAt)}</span>
        <span className="entry__name">{entry.name}</span>
        <span className="entry__occasion">
          {occasion?.icon} {occasion?.label}
        </span>
        <span className="entry__note">{entry.note}</span>
        <span className="entry__mood">
          <span title={emotion?.label}>{emotion?.icon}</span>
          <StarRating value={entry.rating} />
        </span>
      </span>
    </button>
  )
}

export function DiaryScreen() {
  const { state, navigate, deleteEntry, saveReflection } = useGame()
  const [openEntryId, setOpenEntryId] = useState<string | null>(null)

  const { entries, finalReflection } = state
  const newestFirst = [...entries].reverse()
  const openEntry = entries.find((entry) => entry.id === openEntryId)
  const missingEntries = REQUIRED_DIARY_ENTRIES - entries.length

  const handleDelete = (entryId: string) => {
    deleteEntry(entryId)
    setOpenEntryId(null)
  }

  return (
    <ScreenLayout
      title="Mi Diario Virtual"
      subtitle="Cada look cuenta algo de ti"
      actions={
        <>
          <Button icon="➕" onClick={() => navigate('creator')}>
            Nuevo Look
          </Button>
          <Button variant="ghost" icon="🏠" onClick={() => navigate('menu')}>
            Menú
          </Button>
        </>
      }
    >
      {entries.length === 0 ? (
        <Card tone="lilac" className="empty">
          <p className="empty__icon" aria-hidden="true">
            📖
          </p>
          <p>Tu diario está esperando su primera página. ¡Crea tu primer look!</p>
        </Card>
      ) : (
        <>
          <EmotionSummary entries={entries} />
          <ul className="entries">
            {newestFirst.map((entry) => (
              <li key={entry.id}>
                <EntryCard entry={entry} onOpen={setOpenEntryId} />
              </li>
            ))}
          </ul>
          {missingEntries > 0 ? (
            <p className="diary__goal">
              Te {missingEntries === 1 ? 'falta 1 entrada' : `faltan ${missingEntries} entradas`} para
              escribir tu reflexión final. 🌟
            </p>
          ) : (
            <FinalReflectionForm reflection={finalReflection} onSave={saveReflection} />
          )}
        </>
      )}

      <Modal
        isOpen={openEntry !== undefined}
        onClose={() => setOpenEntryId(null)}
        title={openEntry?.name ?? ''}
        footer={
          openEntry && (
            <Button variant="danger" icon="🗑️" onClick={() => handleDelete(openEntry.id)}>
              Borrar entrada
            </Button>
          )
        }
      >
        {openEntry && (
          <div className="entry-detail">
            <LookPreview look={openEntry.look} size="md" label={`Look ${openEntry.name}`} />
            <dl className="entry-detail__data">
              <dt>📅 Fecha</dt>
              <dd>{formatDate(openEntry.createdAt)}</dd>
              <dt>👗 Ocasión</dt>
              <dd>{findOption(OCCASIONS, openEntry.look.occasionId)?.label}</dd>
              <dt>🎨 Paleta</dt>
              <dd>
                <PaletteChips paletteIds={getUsedPaletteIds(openEntry.look)} showLabels />
                <HarmonyBadge harmony={getHarmony(getUsedPaletteIds(openEntry.look))} />
              </dd>
              <dt>💍 Accesorios</dt>
              <dd>{getAccessoryLabels(openEntry)}</dd>
              <dt>✍️ Nota personal</dt>
              <dd className="entry-detail__note">{openEntry.note}</dd>
              <dt>⭐ Cómo me sentí</dt>
              <dd className="entry__mood">
                {findOption(EMOTIONS, openEntry.emotionId)?.icon}{' '}
                {findOption(EMOTIONS, openEntry.emotionId)?.label}
                <StarRating value={openEntry.rating} />
              </dd>
            </dl>
          </div>
        )}
      </Modal>
    </ScreenLayout>
  )
}
