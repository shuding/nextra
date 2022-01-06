if (typeof window !== 'undefined') {
  let onResize
  if (window.visualViewport) {
    onResize = () => {
      const vh = window.visualViewport.height
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }
    window.visualViewport.addEventListener('resize', onResize)
    onResize()
  } else {
    onResize = () => {
      const vh = window.innerHeight
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }
    window.addEventListener('resize', onResize)
    onResize()
  }
}
