import { useId, useState, type FormEvent } from 'react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import type { FinalReflection } from '../../types/game.types'

const MAX_REFLECTION_LENGTH = 800

interface FinalReflectionFormProps {
  reflection: FinalReflection | null
  onSave: (authorName: string, text: string) => void
}

export function FinalReflectionForm({ reflection, onSave }: FinalReflectionFormProps) {
  const [authorName, setAuthorName] = useState(reflection?.authorName ?? '')
  const [text, setText] = useState(reflection?.text ?? '')
  const [showError, setShowError] = useState(false)
  const [justSaved, setJustSaved] = useState(false)
  const nameId = useId()
  const textId = useId()

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const isValid = authorName.trim().length > 0 && text.trim().length > 0
    setShowError(!isValid)
    setJustSaved(isValid)
    if (isValid) onSave(authorName.trim(), text.trim())
  }

  return (
    <Card tone="yellow">
      <h2 className="section-title">🌟 Mi reflexión final</h2>
      <p>
        ¿Cómo ha cambiado tu forma de elegir ropa? ¿Qué te hace sentir bien vestida/o? ¿Qué dice tu
        estilo de ti?
      </p>
      <form className="form" onSubmit={handleSubmit} noValidate>
        <div className="form__field">
          <label htmlFor={nameId}>Tu nombre (para el certificado)</label>
          <input
            id={nameId}
            type="text"
            value={authorName}
            maxLength={60}
            onChange={(event) => setAuthorName(event.target.value)}
          />
        </div>
        <div className="form__field">
          <label htmlFor={textId}>Tu reflexión</label>
          <textarea
            id={textId}
            rows={5}
            value={text}
            maxLength={MAX_REFLECTION_LENGTH}
            onChange={(event) => setText(event.target.value)}
          />
        </div>
        {showError && <p className="form__error">Escribe tu nombre y tu reflexión para guardarla.</p>}
        {justSaved && <p className="form__success">¡Reflexión guardada! Revisa tus logros. 🌟</p>}
        <Button type="submit" icon="💾">
          {reflection ? 'Actualizar reflexión' : 'Guardar reflexión'}
        </Button>
      </form>
    </Card>
  )
}
