import 'nextra-theme-docs/style.css'
import Prism from 'prism-react-renderer/prism'
;(typeof global !== 'undefined' ? global : window).Prism = Prism

// Scala extends Java in Prism.
require('prismjs/components/prism-java')
require('prismjs/components/prism-scala')

export default function Nextra({ Component, pageProps }) {
  return <Component {...pageProps} />
}
