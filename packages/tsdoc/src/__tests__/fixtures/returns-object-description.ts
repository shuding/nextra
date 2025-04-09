/** Type B */
type B = {
  /** Field c */
  c: number
  d: {
    /** Field e */
    e: string
  }
}

/** Function foo */
function foo() {
  // @ts-expect-error -- ignore
  const b: B = {}
  return {
    /** Field a */
    a: 0,
    /** Field b */
    b
  }
}

export default foo
