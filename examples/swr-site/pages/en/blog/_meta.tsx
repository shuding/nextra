import Authors, { Author } from '@components/authors'
import { useConfig } from 'nextra-theme-docs'

export default {
  '*': {
    theme: {
      breadcrumb: true,
      topContent: function TopContent() {
        const config = useConfig()
        return (
          <>
            <h1>{config.frontMatter.title}</h1>
            <Authors date={config.frontMatter.date}>
              {config.frontMatter.authors.map(author => (
                <Author
                  key={author.name}
                  name={author.name}
                  link={author.link}
                />
              ))}
            </Authors>
          </>
        )
      }
    }
  }
}
