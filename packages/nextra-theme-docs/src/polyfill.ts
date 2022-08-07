import { IS_BROWSER } from './constants'

if (IS_BROWSER) {
  let resizeTimer: any

  const addResizingClass = () => {
    document.body.classList.add('resizing')
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
      document.body.classList.remove('resizing')
    }, 200)
  }

  window.addEventListener('resize', addResizingClass)
}
