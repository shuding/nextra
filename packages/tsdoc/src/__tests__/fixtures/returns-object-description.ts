type B = {
  /** C */
  c: {
    /** D */
    d: string
  }
}

function foo() {
  // @ts-expect-error -- ignore
  const b: B = {}
  return {
    /** A */
    a: 1,
    /** B */
    b
  }
}

export default foo
