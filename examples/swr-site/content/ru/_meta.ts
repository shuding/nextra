import meta from '../en/_meta'

export default {
  index: meta.index,
  docs: {
    ...meta.docs,
    title: 'Документация'
  },
  examples: {
    ...meta.examples,
    title: 'Примеры'
  },
  blog: {
    ...meta.blog,
    title: 'Блог'
  }
}
