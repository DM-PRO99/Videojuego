import { describe, expect, test } from 'vitest'
import { getHarmony } from './colorHarmony'

describe('getHarmony', () => {
  test('returns neutra when only whites, blacks and neutrals are used', () => {
    expect(getHarmony(['blancos', 'negros', 'neutros'])).toBe('neutra')
  })

  test('returns monocromatica when one color is combined with neutrals', () => {
    expect(getHarmony(['azules', 'blancos', 'azules'])).toBe('monocromatica')
  })

  test('returns analoga for neighbouring colors', () => {
    expect(getHarmony(['azules', 'verdes', 'blancos'])).toBe('analoga')
  })

  test('returns complementaria for opposite colors', () => {
    expect(getHarmony(['rosas', 'verdes', 'negros'])).toBe('complementaria')
  })

  test('returns contraste for colors that are neither neighbours nor opposites', () => {
    expect(getHarmony(['azules', 'rosas'])).toBe('contraste')
  })

  test('returns complementaria when any pair of three colors is opposite', () => {
    expect(getHarmony(['azules', 'rosas', 'verdes'])).toBe('complementaria')
  })
})
