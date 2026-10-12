import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { QUIZ_QUESTIONS } from '../../data/lessons'

interface QuickPracticeProps {
  onComplete: () => void
  onExit: () => void
}

export function QuickPractice({ onComplete, onExit }: QuickPracticeProps) {
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [correctCount, setCorrectCount] = useState(0)

  const question = QUIZ_QUESTIONS[questionIndex]
  const hasAnswered = selectedIndex !== null

  if (!question) {
    return (
      <Card tone="yellow" className="quiz">
        <h2 className="section-title">¡Práctica completada! 🎉</h2>
        <p>
          Acertaste {correctCount} de {QUIZ_QUESTIONS.length}. Lo importante es que sigues
          aprendiendo.
        </p>
        <Button icon="🎨" onClick={onExit}>
          Volver a las lecciones
        </Button>
      </Card>
    )
  }

  const handleAnswer = (optionIndex: number) => {
    if (hasAnswered) return
    setSelectedIndex(optionIndex)
    if (optionIndex === question.correctIndex) setCorrectCount((count) => count + 1)
  }

  const handleNext = () => {
    const isLastQuestion = questionIndex === QUIZ_QUESTIONS.length - 1
    if (isLastQuestion) onComplete()
    setQuestionIndex((index) => index + 1)
    setSelectedIndex(null)
  }

  const getOptionClass = (optionIndex: number): string => {
    if (!hasAnswered) return 'quiz__option'
    if (optionIndex === question.correctIndex) return 'quiz__option is-correct'
    if (optionIndex === selectedIndex) return 'quiz__option is-wrong'
    return 'quiz__option'
  }

  return (
    <Card className="quiz">
      <p className="quiz__counter">
        Pregunta {questionIndex + 1} de {QUIZ_QUESTIONS.length}
      </p>
      <h2 className="section-title">{question.question}</h2>
      <ul className="quiz__options">
        {question.options.map((option, optionIndex) => (
          <li key={option}>
            <button
              type="button"
              className={getOptionClass(optionIndex)}
              disabled={hasAnswered}
              onClick={() => handleAnswer(optionIndex)}
            >
              {option}
            </button>
          </li>
        ))}
      </ul>
      <div aria-live="polite">
        {hasAnswered && (
          <p className="quiz__feedback">
            {selectedIndex === question.correctIndex ? '✅ ¡Muy bien! ' : '💡 Casi. '}
            {question.explanation}
          </p>
        )}
      </div>
      {hasAnswered && (
        <Button icon="➡️" onClick={handleNext}>
          Continuar
        </Button>
      )}
    </Card>
  )
}
