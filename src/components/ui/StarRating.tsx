const MAX_STARS = 5
const STAR_VALUES = Array.from({ length: MAX_STARS }, (_, index) => index + 1)

interface StarRatingProps {
  value: number
  /** Sin onChange, las estrellas son solo de lectura. */
  onChange?: (value: number) => void
  label?: string
}

export function StarRating({ value, onChange, label = 'Calificación' }: StarRatingProps) {
  if (!onChange) {
    return (
      <span className="stars" role="img" aria-label={`${label}: ${value} de ${MAX_STARS} estrellas`}>
        {STAR_VALUES.map((star) => (
          <span key={star} className={star <= value ? 'stars__star is-on' : 'stars__star'}>
            ★
          </span>
        ))}
      </span>
    )
  }

  return (
    <div className="stars" role="radiogroup" aria-label={label}>
      {STAR_VALUES.map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={star === value}
          aria-label={`${star} ${star === 1 ? 'estrella' : 'estrellas'}`}
          className={star <= value ? 'stars__star stars__star--button is-on' : 'stars__star stars__star--button'}
          onClick={() => onChange(star)}
        >
          ★
        </button>
      ))}
    </div>
  )
}
