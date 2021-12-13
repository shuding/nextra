import { Heading } from 'nextra'

export default function getHeadingText(heading: Heading) {
  if (Array.isArray(heading.children) && heading.children.length === 1) {
    const content = heading.children[0]
    if (content.type === 'text') return content.value
  }
  return ''
}
