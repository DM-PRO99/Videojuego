import { useId, useState, type FormEvent } from 'react'
import { Button } from '../../components/ui/Button'
import { OptionGrid } from '../../components/ui/OptionGrid'
import { StarRating } from '../../components/ui/StarRating'
import { EMOTIONS } from '../../data/catalog'
import type { EmotionId } from '../../types/game.types'

const MAX_NAME_LENGTH = 40
const MAX_NOTE_LENGTH = 400

export interface SaveLookValues {
  name: string
  note: string
  rating: number
  emotionId: EmotionId
}

interface FormErrors {
  name?: string
  note?: string
  rating?: string
  emotionId?: string
}

interface SaveLookFormProps {
  onSave: (values: SaveLookValues) => void
}

export function SaveLookForm({ onSave }: SaveLookFormProps) {
  const [name, setName] = useState('')
  const [note, setNote] = useState('')
  const [rating, setRating] = useState(0)
  const [emotionId, setEmotionId] = useState<EmotionId | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})
  const nameId = useId()
  const noteId = useId()

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    const trimmedName = name.trim()
    const trimmedNote = note.trim()
    const newErrors: FormErrors = {}
    if (!trimmedName) newErrors.name = 'Ponle un nombre a tu look.'
    if (!trimmedNote) newErrors.note = 'Cuéntanos por qué te gusta o cómo te sientes.'
    if (rating === 0) newErrors.rating = 'Elige de 1 a 5 estrellas.'
    if (!emotionId) newErrors.emotionId = 'Elige la emoción que más se parece a la tuya.'
    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0 || !emotionId) return
    onSave({ name: trimmedName, note: trimmedNote, rating, emotionId })
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <div className="form__field">
        <label htmlFor={nameId}>👗 Nombre del look</label>
        <input
          id={nameId}
          type="text"
          value={name}
          maxLength={MAX_NAME_LENGTH}
          placeholder="Ej.: Lunes con energía"
          aria-invalid={Boolean(errors.name)}
          onChange={(event) => setName(event.target.value)}
        />
        {errors.name && <p className="form__error">{errors.name}</p>}
      </div>

      <div className="form__field">
        <label htmlFor={noteId}>✍️ ¿Por qué te gusta? ¿Cómo te sientes usándolo?</label>
        <textarea
          id={noteId}
          rows={4}
          value={note}
          maxLength={MAX_NOTE_LENGTH}
          placeholder="Si elegiste los colores por una razón, cuéntala aquí."
          aria-invalid={Boolean(errors.note)}
          onChange={(event) => setNote(event.target.value)}
        />
        {errors.note && <p className="form__error">{errors.note}</p>}
      </div>

      <div className="form__field">
        <OptionGrid
          legend="¿Cómo te hace sentir?"
          hint="No hay respuestas incorrectas: lo que cuenta es tu sinceridad."
          options={EMOTIONS}
          selectedIds={emotionId ? [emotionId] : []}
          onSelect={setEmotionId}
        />
        {errors.emotionId && <p className="form__error">{errors.emotionId}</p>}
      </div>

      <div className="form__field">
        <span className="form__label">⭐ Calificación emocional</span>
        <StarRating value={rating} onChange={setRating} label="Calificación emocional" />
        {errors.rating && <p className="form__error">{errors.rating}</p>}
      </div>

      <Button type="submit" icon="💾" size="lg">
        Guardar en el diario
      </Button>
    </form>
  )
}
