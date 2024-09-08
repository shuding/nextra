if (typeof window !== 'undefined') {
  let timer = 0

  function addResizingClass() {
    document.body.classList.add('resizing')
    clearTimeout(timer)
    timer = window.setTimeout(() => {
      document.body.classList.remove('resizing')
    }, 200)
  }

  window.addEventListener('resize', addResizingClass)
}
