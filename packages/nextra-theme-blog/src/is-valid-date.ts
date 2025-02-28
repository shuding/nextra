'use no memo'

const DATE_RE = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2})?(:\d{2}\.\d{3}Z)?$/
const DATE_RE_WITH_SLASH = /^\d{4}\/\d{1,2}\/\d{1,2}( \d{1,2}:\d{1,2})?$/

export const isValidDate = (date: string): boolean =>
  DATE_RE.test(date) || DATE_RE_WITH_SLASH.test(date)
