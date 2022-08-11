import { Heading } from 'nextra'

export function getHeadingText(heading: Heading) {
  return heading.value || ''
}
