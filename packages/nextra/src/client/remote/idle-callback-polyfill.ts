/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

if (typeof window !== 'undefined') {
  window.requestIdleCallback ||= cb => {
    const start = Date.now()
    return window.setTimeout(() => {
      cb({
        didTimeout: false,
        timeRemaining() {
          return Math.max(0, 50 - (Date.now() - start))
        }
      })
    }, 1)
  }

  window.cancelIdleCallback ||= clearTimeout
}
