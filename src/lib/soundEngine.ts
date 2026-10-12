/** Música y efectos generados con la Web Audio API: no dependen de archivos de audio. */

export type SoundEffect = 'click' | 'success' | 'achievement'

interface Tone {
  frequency: number
  /** Segundos desde el inicio del sonido. */
  startOffset: number
  duration: number
  type?: OscillatorType
}

const NOTES = {
  F2: 87.31, G2: 98.0, A2: 110.0, C3: 130.81,
  A4: 440.0, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46,
  G5: 783.99, A5: 880.0, C6: 1046.5,
} as const

type NoteName = keyof typeof NOTES

const EFFECTS_VOLUME = 0.18
const MUSIC_VOLUME = 0.07
const ATTACK_SECONDS = 0.012
const SILENCE = 0.0001

const EFFECTS: Record<SoundEffect, readonly Tone[]> = {
  click: [{ frequency: NOTES.A5, startOffset: 0, duration: 0.08, type: 'sine' }],
  success: [
    { frequency: NOTES.C5, startOffset: 0, duration: 0.14 },
    { frequency: NOTES.E5, startOffset: 0.09, duration: 0.14 },
    { frequency: NOTES.G5, startOffset: 0.18, duration: 0.24 },
  ],
  achievement: [
    { frequency: NOTES.C5, startOffset: 0, duration: 0.16 },
    { frequency: NOTES.E5, startOffset: 0.12, duration: 0.16 },
    { frequency: NOTES.G5, startOffset: 0.24, duration: 0.16 },
    { frequency: NOTES.C6, startOffset: 0.36, duration: 0.5 },
  ],
}

/** Melodía en bucle: cuatro compases (Do, La menor, Fa, Sol) de ocho pasos. */
const MELODY: readonly (NoteName | null)[] = [
  'E5', 'G5', 'C6', 'G5', 'E5', 'G5', 'D5', null,
  'C5', 'E5', 'A5', 'E5', 'C5', 'E5', 'D5', null,
  'A4', 'C5', 'F5', 'C5', 'A4', 'C5', 'G5', null,
  'B4', 'D5', 'G5', 'D5', 'B4', 'D5', 'E5', null,
]
const BASS_BY_BAR: readonly NoteName[] = ['C3', 'A2', 'F2', 'G2']
const STEPS_PER_BAR = 8
const BASS_EVERY_STEPS = 4
const STEP_SECONDS = 0.3
const SCHEDULER_INTERVAL_MS = 100
const SCHEDULE_AHEAD_SECONDS = 0.35

class SoundEngine {
  private context: AudioContext | null = null
  private effectsOutput: GainNode | null = null
  private musicOutput: GainNode | null = null
  private musicTimer: number | null = null
  private nextStepTime = 0
  private stepIndex = 0

  /** Los navegadores solo permiten crear audio tras una interacción del usuario. */
  private getContext(): AudioContext | null {
    if (typeof AudioContext === 'undefined') return null

    if (!this.context) {
      this.context = new AudioContext()
      this.effectsOutput = this.createOutput(this.context, EFFECTS_VOLUME)
      this.musicOutput = this.createOutput(this.context, MUSIC_VOLUME)
    }
    if (this.context.state === 'suspended') void this.context.resume()
    return this.context
  }

  private createOutput(context: AudioContext, volume: number): GainNode {
    const output = context.createGain()
    output.gain.value = volume
    output.connect(context.destination)
    return output
  }

  private playTone(context: AudioContext, output: GainNode, tone: Tone, startTime: number) {
    const start = startTime + tone.startOffset
    const end = start + tone.duration
    const oscillator = context.createOscillator()
    const envelope = context.createGain()

    oscillator.type = tone.type ?? 'triangle'
    oscillator.frequency.value = tone.frequency
    envelope.gain.setValueAtTime(SILENCE, start)
    envelope.gain.exponentialRampToValueAtTime(1, start + ATTACK_SECONDS)
    envelope.gain.exponentialRampToValueAtTime(SILENCE, end)

    oscillator.connect(envelope).connect(output)
    oscillator.start(start)
    oscillator.stop(end + 0.02)
  }

  playEffect(effect: SoundEffect) {
    const context = this.getContext()
    if (!context || !this.effectsOutput) return

    for (const tone of EFFECTS[effect]) {
      this.playTone(context, this.effectsOutput, tone, context.currentTime)
    }
  }

  startMusic() {
    const context = this.getContext()
    if (!context || this.musicTimer !== null) return

    this.nextStepTime = context.currentTime + 0.05
    this.musicTimer = window.setInterval(() => this.scheduleMusic(), SCHEDULER_INTERVAL_MS)
    this.scheduleMusic()
  }

  stopMusic() {
    if (this.musicTimer === null) return
    window.clearInterval(this.musicTimer)
    this.musicTimer = null
  }

  /** Programa con antelación los pasos próximos para que el ritmo no dependa del temporizador. */
  private scheduleMusic() {
    const context = this.context
    const output = this.musicOutput
    if (!context || !output) return

    while (this.nextStepTime < context.currentTime + SCHEDULE_AHEAD_SECONDS) {
      const melodyNote = MELODY[this.stepIndex]
      if (melodyNote) {
        const tone = { frequency: NOTES[melodyNote], startOffset: 0, duration: STEP_SECONDS * 1.6 }
        this.playTone(context, output, tone, this.nextStepTime)
      }

      if (this.stepIndex % BASS_EVERY_STEPS === 0) {
        const bassNote = BASS_BY_BAR[Math.floor(this.stepIndex / STEPS_PER_BAR)]
        if (bassNote) {
          const tone: Tone = {
            frequency: NOTES[bassNote],
            startOffset: 0,
            duration: STEP_SECONDS * BASS_EVERY_STEPS,
            type: 'sine',
          }
          this.playTone(context, output, tone, this.nextStepTime)
        }
      }

      this.stepIndex = (this.stepIndex + 1) % MELODY.length
      this.nextStepTime += STEP_SECONDS
    }
  }
}

export const soundEngine = new SoundEngine()
