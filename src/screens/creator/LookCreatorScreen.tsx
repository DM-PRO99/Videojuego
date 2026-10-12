import { useMemo, useState } from 'react'
import { HarmonyBadge } from '../../components/look/HarmonyBadge'
import { LookPreview } from '../../components/look/LookPreview'
import { PaletteSwatches } from '../../components/look/PaletteSwatches'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Modal } from '../../components/ui/Modal'
import { OptionGrid, type GridOption } from '../../components/ui/OptionGrid'
import { ScreenLayout } from '../../components/ui/ScreenLayout'
import { Stepper } from '../../components/ui/Stepper'
import { ACHIEVEMENTS } from '../../data/achievements'
import { ACCESSORIES, BOTTOMS, OCCASIONS, SHOES, TOPS, findOption } from '../../data/catalog'
import { useGame } from '../../hooks/useGame'
import { useSound } from '../../hooks/useSound'
import { getNewlyUnlockedIds, isAccessoryUnlocked } from '../../lib/achievements'
import { getHarmony } from '../../lib/colorHarmony'
import { EMPTY_DRAFT, getUsedPaletteIds, hasAllGarments, isDress, toCompleteLook } from '../../lib/look'
import type {
  AccessoryId,
  AchievementId,
  GarmentSlot,
  LookDraft,
  PaletteId,
} from '../../types/game.types'
import { SaveLookForm, type SaveLookValues } from './SaveLookForm'

const STEPS = ['Ocasión', 'Ropa', 'Colores', 'Accesorios', 'Vista previa'] as const
const LAST_STEP_INDEX = STEPS.length - 1

function canLeaveStep(stepIndex: number, draft: LookDraft): boolean {
  if (stepIndex === 0) return draft.occasionId !== null
  if (stepIndex === 1) return hasAllGarments(draft)
  return true
}

function toggleAccessory(current: readonly AccessoryId[], id: AccessoryId): AccessoryId[] {
  return current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
}

export function LookCreatorScreen() {
  const { state, unlockedAchievementIds, addEntry, navigate } = useGame()
  const { playEffect } = useSound()
  const [draft, setDraft] = useState<LookDraft>(EMPTY_DRAFT)
  const [stepIndex, setStepIndex] = useState(0)
  const [newAchievementIds, setNewAchievementIds] = useState<readonly AchievementId[]>([])

  const occasion = findOption(OCCASIONS, draft.occasionId)
  const wearsDress = isDress(draft.topId)
  const harmony = getHarmony(getUsedPaletteIds(draft))

  const accessoryOptions = useMemo<GridOption<AccessoryId>[]>(
    () =>
      ACCESSORIES.map((accessory) => {
        const unlocked = isAccessoryUnlocked(accessory, unlockedAchievementIds)
        return {
          ...accessory,
          disabled: !unlocked,
          note: unlocked ? undefined : '🔒 Nivel 2',
        }
      }),
    [unlockedAchievementIds],
  )

  const updateDraft = (changes: Partial<LookDraft>) => {
    setDraft((previous) => ({ ...previous, ...changes }))
  }

  const setColor = (slot: GarmentSlot, paletteId: PaletteId) => {
    setDraft((previous) => ({ ...previous, colors: { ...previous.colors, [slot]: paletteId } }))
  }

  const handleRestart = () => {
    setDraft(EMPTY_DRAFT)
    setStepIndex(0)
  }

  const handleSave = (values: SaveLookValues) => {
    const look = toCompleteLook(draft)
    if (!look) return

    const entry = addEntry({ ...values, look })
    const unlockedNow = getNewlyUnlockedIds(state, { ...state, entries: [...state.entries, entry] })
    if (unlockedNow.length === 0) {
      playEffect('success')
      navigate('diary')
      return
    }
    playEffect('achievement')
    setNewAchievementIds(unlockedNow)
  }

  return (
    <ScreenLayout
      title="Creador de Looks"
      subtitle={occasion ? `${occasion.icon} ${occasion.label}` : 'Arma tu conjunto paso a paso'}
      actions={
        <>
          <Button variant="secondary" icon="🔄" onClick={handleRestart}>
            Volver a elegir
          </Button>
          <Button variant="ghost" icon="🏠" onClick={() => navigate('menu')}>
            Menú
          </Button>
        </>
      }
    >
      <Stepper steps={STEPS} currentIndex={stepIndex} />

      <div className="creator">
        <Card tone="lilac" className="creator__preview">
          <LookPreview look={draft} size="lg" label="Vista previa de tu look" />
          <HarmonyBadge harmony={harmony} />
        </Card>

        <Card className="creator__step">
          {stepIndex === 0 && (
            <OptionGrid
              legend="¿Para qué ocasión es tu look?"
              options={OCCASIONS}
              selectedIds={draft.occasionId ? [draft.occasionId] : []}
              onSelect={(occasionId) => updateDraft({ occasionId })}
              hint={occasion?.tip}
            />
          )}

          {stepIndex === 1 && (
            <>
              <OptionGrid
                legend="Prenda superior"
                options={TOPS}
                selectedIds={draft.topId ? [draft.topId] : []}
                onSelect={(topId) => updateDraft({ topId })}
                hint={occasion?.tip}
              />
              {wearsDress ? (
                <p className="creator__note">El vestido ya cubre la parte de abajo. 👗</p>
              ) : (
                <OptionGrid
                  legend="Prenda inferior"
                  options={BOTTOMS}
                  selectedIds={draft.bottomId ? [draft.bottomId] : []}
                  onSelect={(bottomId) => updateDraft({ bottomId })}
                />
              )}
              <OptionGrid
                legend="Calzado"
                options={SHOES}
                selectedIds={draft.shoesId ? [draft.shoesId] : []}
                onSelect={(shoesId) => updateDraft({ shoesId })}
              />
            </>
          )}

          {stepIndex === 2 && (
            <>
              <PaletteSwatches
                legend={wearsDress ? 'Color del vestido' : 'Color de la prenda superior'}
                selectedId={draft.colors.top}
                onSelect={(paletteId) => setColor('top', paletteId)}
              />
              {!wearsDress && (
                <PaletteSwatches
                  legend="Color de la prenda inferior"
                  selectedId={draft.colors.bottom}
                  onSelect={(paletteId) => setColor('bottom', paletteId)}
                />
              )}
              <PaletteSwatches
                legend="Color del calzado"
                selectedId={draft.colors.shoes}
                onSelect={(paletteId) => setColor('shoes', paletteId)}
              />
              <HarmonyBadge harmony={harmony} showDescription />
            </>
          )}

          {stepIndex === 3 && (
            <OptionGrid
              legend="Accesorios (elige los que quieras)"
              options={accessoryOptions}
              selectedIds={draft.accessoryIds}
              onSelect={(accessoryId) =>
                updateDraft({ accessoryIds: toggleAccessory(draft.accessoryIds, accessoryId) })
              }
              hint="Los accesorios son opcionales: a veces menos es más."
            />
          )}

          {stepIndex === LAST_STEP_INDEX && <SaveLookForm onSave={handleSave} />}

          <div className="creator__nav">
            <Button
              variant="secondary"
              icon="⬅️"
              disabled={stepIndex === 0}
              onClick={() => setStepIndex((index) => index - 1)}
            >
              Atrás
            </Button>
            {stepIndex < LAST_STEP_INDEX && (
              <Button
                icon="➡️"
                disabled={!canLeaveStep(stepIndex, draft)}
                onClick={() => setStepIndex((index) => index + 1)}
              >
                Siguiente
              </Button>
            )}
          </div>
        </Card>
      </div>

      <Modal
        isOpen={newAchievementIds.length > 0}
        onClose={() => navigate('diary')}
        title="¡Logro desbloqueado!"
        footer={
          <Button icon="📖" onClick={() => navigate('diary')}>
            Ver mi diario
          </Button>
        }
      >
        <ul className="unlocked">
          {ACHIEVEMENTS.filter((achievement) => newAchievementIds.includes(achievement.id)).map(
            (achievement) => (
              <li key={achievement.id} className="unlocked__item">
                <span className="unlocked__icon" aria-hidden="true">
                  {achievement.icon}
                </span>
                <span>
                  <strong>{achievement.title}</strong>
                  {achievement.reward && <span className="unlocked__reward">{achievement.reward}</span>}
                </span>
              </li>
            ),
          )}
        </ul>
      </Modal>
    </ScreenLayout>
  )
}
