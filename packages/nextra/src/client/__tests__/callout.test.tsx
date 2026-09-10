import { render } from '@testing-library/react'
import { Callout } from '../components/callout.js'

vi.mock('../icons/index.js', () => ({
  GitHubCautionIcon: () => null,
  GitHubImportantIcon: () => null,
  GitHubNoteIcon: () => null,
  GitHubTipIcon: () => null,
  GitHubWarningIcon: () => null
}))

describe('Callout', () => {
  it('uses purple-700 for important callouts so inline code meets 4.5:1', () => {
    const { container } = render(
      <Callout type="important">
        Remember to set <code>NODE_ENV</code>.
      </Callout>
    )
    const callout = container.querySelector('.nextra-callout')
    expect(callout).toBeTruthy()
    expect(callout!.className).toContain('x:text-purple-700')
    expect(callout!.className).not.toContain('x:text-purple-600')
  })
})
