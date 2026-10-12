export interface GridOption<Id extends string> {
  id: Id
  label: string
  icon: string
  disabled?: boolean
  /** Texto corto bajo la etiqueta, por ejemplo por qué está bloqueada. */
  note?: string
}

interface OptionGridProps<Id extends string> {
  legend: string
  options: readonly GridOption<Id>[]
  selectedIds: readonly Id[]
  onSelect: (id: Id) => void
  hint?: string
}

export function OptionGrid<Id extends string>({
  legend,
  options,
  selectedIds,
  onSelect,
  hint,
}: OptionGridProps<Id>) {
  return (
    <fieldset className="option-grid">
      <legend className="option-grid__legend">{legend}</legend>
      {hint && <p className="option-grid__hint">{hint}</p>}
      <div className="option-grid__items">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            className="option"
            aria-pressed={selectedIds.includes(option.id)}
            disabled={option.disabled}
            onClick={() => onSelect(option.id)}
          >
            <span className="option__icon" aria-hidden="true">
              {option.icon}
            </span>
            <span className="option__label">{option.label}</span>
            {option.note && <span className="option__note">{option.note}</span>}
          </button>
        ))}
      </div>
    </fieldset>
  )
}
