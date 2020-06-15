import { MDXProvider } from '@mdx-js/react'
import slugify from '@sindresorhus/slugify'
import Link from 'next/link'
import Highlight, { defaultProps } from 'prism-react-renderer'

const THEME = {
  plain: {
    color: "#000",
    backgroundColor: "transparent"
  },
  styles: [{
    types: ["keyword"],
    style: {
      color: "#ff0078",
      fontWeight: "bold"
    }
  }, {
    types: ["comment"],
    style: {
      color: "#999",
      fontStyle: "italic"
    }
  }, {
    types: ["string", "url"],
    style: {
      color: "#028265"
    }
  }, {
    types: ["variable"],
    style: {
      color: "#c6c5fe"
    }
  }, {
    types: ["builtin", "char", "constant"],
    style: {
      color: "#000"
    }
  }, {
    types: ["attr-name"],
    style: {
      color: "#d9931e",
      fontStyle: "normal"
    }
  }, {
    types: ["punctuation", "operator"],
    style: {
      color: "#333"
    }
  }, {
    types: ["number", "function"],
    style: {
      color: "#0076ff"
    }
  }, {
    types: ["boolean", "regex"],
    style: {
      color: "#d9931e"
    }
  }]
}

// h2 with an achor link
const H2 = ({ children, ...props }) => {
  const slug = slugify(children || '')
  return <h2 {...props}>
    <a id={slug} href={'#' + slug} className="text-current no-underline no-outline">{children}</a>
  </h2>
}

const A = ({ children, ...props }) => {
  const isExternal = props.href?.startsWith('https://')
  if (isExternal) {
    return <a target="_blank" {...props}>{children}</a>
  }
  return <Link href={props.href}><a {...props}>{children}</a></Link>
}

const Code = ({ children, className, highlight, ...props }) => {
  if (!className) return <code {...props}>{children}</code>

  const highlightedLines = highlight ? highlight.split(',').map(Number) : []

  // https://mdxjs.com/guides/syntax-highlighting#all-together
  const language = className.replace(/language-/, '')
  return <Highlight {...defaultProps} code={children.trim()} language={language} theme={THEME}>
    {({className, style, tokens, getLineProps, getTokenProps}) => (
      <code className={className} style={{ ...style }}>
        {tokens.map((line, i) => (
          <div key={i} {...getLineProps({line, key: i})} style={
            highlightedLines.includes(i + 1) ? {
              background: '#cce0f5',
              margin: '0 -1rem',
              padding: '0 1rem'
            } : null
          }>
            {line.map((token, key) => (
              <span key={key} {...getTokenProps({token, key})} />
            ))}
          </div>
        ))}
      </code>
    )}
  </Highlight>
}

const components = {
  h2: H2,
  a: A,
  code: Code
}

export default ({ children }) => {
  return <MDXProvider components={components}>{children}</MDXProvider>
}
