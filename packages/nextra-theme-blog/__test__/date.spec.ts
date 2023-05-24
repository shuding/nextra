import { describe, expect, it } from 'vitest'
import { isValidDate } from '../src/utils/date'

describe('date', () => {
  describe('isValidDate()', () => {
    it('should be valid', () => {
      expect(isValidDate('2022-07-28')).toBe(true)
      expect(isValidDate('2022-07-28T10:40')).toBe(true)

      expect(isValidDate('2022/10/1')).toBe(true)
      expect(isValidDate('2016/5/3 10:10')).toBe(true)
      expect(isValidDate('2022-07-29T20:49:45.112Z')).toBe(true)
    })
    it('should be invalid', () => {
      expect(isValidDate('2022-07-28 10:40')).toBe(false)
    })
  })
})
