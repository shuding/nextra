import { getScrollBehavior } from '../utils'

describe('getScrollBehavior', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('should return "instant" when prefers-reduced-motion matches', () => {
    const matchMedia = vi.fn().mockReturnValue({ matches: true })
    vi.stubGlobal('window', { matchMedia })

    expect(getScrollBehavior()).toBe('instant')
    expect(matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)')
  })

  it('should return "smooth" when prefers-reduced-motion does not match', () => {
    const matchMedia = vi.fn().mockReturnValue({ matches: false })
    vi.stubGlobal('window', { matchMedia })

    expect(getScrollBehavior()).toBe('smooth')
  })

  it('should return "smooth" when window is undefined', () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    vi.stubGlobal('window', undefined)

    expect(getScrollBehavior()).toBe('smooth')
  })
})
