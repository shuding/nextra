import { render, screen } from '@testing-library/react'
import { Select } from '../components/select.js'

describe('Select', () => {
  beforeAll(() => {
    vi.stubGlobal(
      'ResizeObserver',
      vi.fn(() => ({
        observe: vi.fn(),
        disconnect: vi.fn(),
        unobserve: vi.fn()
      }))
    )
  })

  afterAll(() => {
    vi.unstubAllGlobals()
  })

  const defaultProps = {
    options: [
      { id: 'light', name: 'Light' },
      { id: 'dark', name: 'Dark' }
    ],
    value: 'light',
    onChange: vi.fn(),
    selectedOption: 'Light'
  }

  it('forwards aria-label to the listbox button', () => {
    render(<Select {...defaultProps} aria-label="Custom label" />)
    const button = screen.getByRole('button', { name: 'Custom label' })
    expect(button.getAttribute('aria-label')).toBe('Custom label')
  })

  it('renders no aria-label attribute when the prop is omitted', () => {
    render(<Select {...defaultProps} />)
    const button = screen.getByRole('button')
    expect(button.getAttribute('aria-label')).toBeNull()
  })
})
