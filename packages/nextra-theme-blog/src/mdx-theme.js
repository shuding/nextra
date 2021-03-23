import ReactDOMServer from 'react-dom/server'
import { createContext, useContext } from 'react'
import { MDXProvider } from '@mdx-js/react'
import Slugger from 'github-slugger'
import Link from 'next/link'
import React from 'react'
import Highlight, { defaultProps } from 'prism-react-renderer'

const THEME = {
  plain: {
    color: '#000',
    backgroundColor: 'transparent'
  },
  styles: [
    {
      types: ['keyword'],
      style: {
        color: '#ff0078',
        fontWeight: 'bold'
      }
    },
    {
      types: ['comment'],
      style: {
        color: '#999',
        fontStyle: 'italic'
      }
    },
    {
      types: ['string', 'url', 'attr-value'],
      style: {
        color: '#028265'
      }
    },
    {
      types: ['variable', 'language-javascript'],
      style: {
        color: '#c6c5fe'
      }
    },
    {
      types: ['builtin', 'char', 'constant'],
      style: {
        color: '#000'
      }
    },
    {
      types: ['attr-name'],
      style: {
        color: '#d9931e',
        fontStyle: 'normal'
      }
    },
    {
      types: ['punctuation', 'operator'],
      style: {
        color: '#333'
      }
    },
    {
      types: ['number', 'function', 'tag'],
      style: {
        color: '#0076ff'
      }
    },
    {
      types: ['boolean', 'regex'],
      style: {
        color: '#d9931e'
      }
    }
  ]
}

// Anchor links

const SluggerContext = createContext()

const HeaderLink = ({ tag: Tag, children, ...props }) => {
  const slugger = useContext(SluggerContext)
  const slug = slugger.slug(ReactDOMServer.renderToStaticMarkup(children) || '')
  return (
    <Tag {...props}>
      <span className="subheading-anchor" id={slug} />
      <a href={'#' + slug} className="subheading">
        {children}
        <span className="anchor-icon" aria-hidden>
          #
        </span>
      </a>
    </Tag>
  )
}

const H2 = ({ children, ...props }) => {
  return (
    <HeaderLink tag="h2" {...props}>
      {children}
    </HeaderLink>
  )
}

const H3 = ({ children, ...props }) => {
  return (
    <HeaderLink tag="h3" {...props}>
      {children}
    </HeaderLink>
  )
}

const H4 = ({ children, ...props }) => {
  return (
    <HeaderLink tag="h4" {...props}>
      {children}
    </HeaderLink>
  )
}

const H5 = ({ children, ...props }) => {
  return (
    <HeaderLink tag="h5" {...props}>
      {children}
    </HeaderLink>
  )
}

const H6 = ({ children, ...props }) => {
  return (
    <HeaderLink tag="h6" {...props}>
      {children}
    </HeaderLink>
  )
}

const A = ({ children, ...props }) => {
  const isExternal = props.href && props.href.startsWith('https://')
  if (isExternal) {
    return (
      <a target="_blank" rel="noopener" {...props}>
        {children}
      </a>
    )
  }
  return (
    <Link href={props.href}>
      <a {...props}>{children}</a>
    </Link>
  )
}

const Code = ({ children, className, highlight, ...props }) => {
  if (!className) return <code {...props}>{children}</code>

  const highlightedLines = highlight ? highlight.split(',').map(Number) : []

  // https://mdxjs.com/guides/syntax-highlighting#all-together
  const language = className.replace(/language-/, '')
  return (
    <Highlight
      {...defaultProps}
      code={children.trim()}
      language={language}
      theme={THEME}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <code className={className} style={{ ...style }}>
          {tokens.map((line, i) => (
            <div
              key={i}
              {...getLineProps({ line, key: i })}
              style={
                highlightedLines.includes(i + 1)
                  ? {
                      background: '#cce0f5',
                      margin: '0 -1rem',
                      padding: '0 1rem'
                    }
                  : null
              }
            >
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </code>
      )}
    </Highlight>
  )
}

const components = {
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  a: A,
  code: Code
}

export default ({ children }) => {
  const slugger = new Slugger()
  return <SluggerContext.Provider value={slugger}>
    <MDXProvider components={components}>{children}</MDXProvider>
  </SluggerContext.Provider>
}
