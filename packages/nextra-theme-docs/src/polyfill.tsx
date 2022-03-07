if (typeof window !== 'undefined') {
  let onResize
  let resizeTimer: any

  const addResizingClass = () => {
    document.body.classList.add('resizing')
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
      document.body.classList.remove('resizing')
    }, 200)
  }

  if (window.visualViewport) {
    onResize = () => {
      const vh = window.visualViewport.height
      document.documentElement.style.setProperty('--vh', `${vh}px`)
      addResizingClass()
    }
    onResize()
    window.visualViewport.addEventListener('resize', onResize)
  } else {
    onResize = () => {
      const vh = window.innerHeight
      document.documentElement.style.setProperty('--vh', `${vh}px`)
      addResizingClass()
    }
    onResize()
    window.addEventListener('resize', onResize)
  }
}
