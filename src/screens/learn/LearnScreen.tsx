import { useState } from 'react'
import { ColorWheel } from '../../components/learn/ColorWheel'
import { LookPreview } from '../../components/look/LookPreview'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { ScreenLayout } from '../../components/ui/ScreenLayout'
import { LESSONS, type Lesson, type LessonId } from '../../data/lessons'
import { useGame } from '../../hooks/useGame'
import { useSound } from '../../hooks/useSound'
import { QuickPractice } from './QuickPractice'

function LessonContent({ lesson }: { lesson: Lesson }) {
  return (
    <Card className="lesson">
      <h2 className="section-title">
        <span aria-hidden="true">{lesson.icon}</span> {lesson.title}
      </h2>
      <p className="lesson__intro">{lesson.intro}</p>
      {lesson.id === 'color' && <ColorWheel />}
      {lesson.examples && (
        <div className="lesson__examples">
          {lesson.examples.map((example) => (
            <figure key={example.caption} className="lesson__example">
              <LookPreview look={example.look} size="sm" label={example.caption} />
              <figcaption>{example.caption}</figcaption>
            </figure>
          ))}
        </div>
      )}
      <ul className="lesson__points">
        {lesson.points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </Card>
  )
}

export function LearnScreen() {
  const { state, navigate, completeQuiz } = useGame()
  const [activeLessonId, setActiveLessonId] = useState<LessonId>('color')
  const [isPracticing, setIsPracticing] = useState(false)

  const { playEffect } = useSound()

  const activeLesson = LESSONS.find((lesson) => lesson.id === activeLessonId)

  const handleQuizComplete = () => {
    // Solo la primera vez desbloquea el logro "Mente curiosa".
    playEffect(state.quizCompleted ? 'success' : 'achievement')
    completeQuiz()
  }

  return (
    <ScreenLayout
      title="Aprender de Moda"
      subtitle="Ideas sencillas para combinar mejor"
      actions={
        <>
          {!isPracticing && (
            <Button icon="📝" onClick={() => setIsPracticing(true)}>
              Práctica rápida{state.quizCompleted ? ' ✓' : ''}
            </Button>
          )}
          <Button variant="ghost" icon="🏠" onClick={() => navigate('menu')}>
            Menú
          </Button>
        </>
      }
    >
      {isPracticing ? (
        <QuickPractice onComplete={handleQuizComplete} onExit={() => setIsPracticing(false)} />
      ) : (
        <>
          <div className="tabs" role="tablist" aria-label="Lecciones">
            {LESSONS.map((lesson) => (
              <button
                key={lesson.id}
                type="button"
                role="tab"
                className="tabs__tab"
                aria-selected={lesson.id === activeLessonId}
                onClick={() => setActiveLessonId(lesson.id)}
              >
                <span aria-hidden="true">{lesson.icon}</span> {lesson.title}
              </button>
            ))}
          </div>
          {activeLesson && <LessonContent lesson={activeLesson} />}
        </>
      )}
    </ScreenLayout>
  )
}
