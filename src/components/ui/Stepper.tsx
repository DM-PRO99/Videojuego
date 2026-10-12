interface StepperProps {
  steps: readonly string[]
  currentIndex: number
}

export function Stepper({ steps, currentIndex }: StepperProps) {
  return (
    <ol className="stepper" aria-label="Pasos para crear tu look">
      {steps.map((step, index) => {
        const status = index < currentIndex ? 'is-done' : index === currentIndex ? 'is-current' : ''
        return (
          <li
            key={step}
            className={`stepper__step ${status}`.trim()}
            aria-current={index === currentIndex ? 'step' : undefined}
          >
            <span className="stepper__number" aria-hidden="true">
              {index < currentIndex ? '✓' : index + 1}
            </span>
            <span className="stepper__label">{step}</span>
          </li>
        )
      })}
    </ol>
  )
}
