import { getLogoLinkLabel } from '../utils'

describe('getLogoLinkLabel', () => {
  it('should return undefined when logo has text in <b>', () => {
    expect(getLogoLinkLabel(<b>Nextra</b>)).toBeUndefined()
  })

  it('should return undefined for fragment with svg and text', () => {
    const logo = (
      <>
        <svg>
          <path d="M0 0h24v24H0z" />
        </svg>
        <span>Chunks UI</span>
      </>
    )
    expect(getLogoLinkLabel(logo)).toBeUndefined()
  })

  it('should return undefined for nested elements with text', () => {
    const logo = (
      <div>
        <b>Nextra</b> <span>The Next Docs Builder</span>
      </div>
    )
    expect(getLogoLinkLabel(logo)).toBeUndefined()
  })

  it('should return undefined for plain string', () => {
    expect(getLogoLinkLabel('Nextra')).toBeUndefined()
  })

  it('should return "Home page" for svg without text', () => {
    const logo = (
      <svg>
        <path d="M0 0h24v24H0z" />
      </svg>
    )
    expect(getLogoLinkLabel(logo)).toBe('Home page')
  })

  it('should return "Home page" for whitespace-only string', () => {
    expect(getLogoLinkLabel('   ')).toBe('Home page')
  })

  it('should return "Home page" for null', () => {
    expect(getLogoLinkLabel(null)).toBe('Home page')
  })

  it('should return "Home page" for custom component', () => {
    // Text rendered inside a custom component cannot be detected statically,
    // so the fallback is kept (same as previous behavior).
    const MyLogo = () => <span>Acme</span>
    expect(getLogoLinkLabel(<MyLogo />)).toBe('Home page')
  })
})
