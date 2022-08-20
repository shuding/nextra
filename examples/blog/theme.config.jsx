/* eslint sort-keys: error */
export default {
  darkMode: true,
  footer: (
    <small style={{ display: 'block', marginTop: '8rem' }}>
      <abbr
        title="This site and all its content are licensed under a Creative Commons Attribution-NonCommercial 4.0 International License."
        style={{ cursor: 'help' }}
      >
        CC BY-NC 4.0
      </abbr>{' '}
      <time>{new Date().getFullYear()}</time> © Shu Ding.
      <a href="/feed.xml">RSS</a>
      <style jsx>{`
        a {
          float: right;
        }
        @media screen and (max-width: 480px) {
          article {
            padding-top: 2rem;
            padding-bottom: 4rem;
          }
        }
      `}</style>
    </small>
  ),
}
