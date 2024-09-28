'use client'

export function Hue() {
  return (
    <div className="flex h-6 items-center gap-2">
      <input
        type="range"
        min="0"
        max="360"
        step="1"
        onChange={e => {
          const value = `${e.target.value}deg`
          e.target.nextSibling!.textContent = value
          document.documentElement.style.setProperty(
            '--nextra-primary-hue',
            value
          )
        }}
      />
      <label className="text-sm text-gray-500 w-14" />
    </div>
  )
}

export function Saturation() {
  return (
    <div className="flex h-6 items-center gap-2">
      <input
        type="range"
        min="0"
        max="100"
        step="1"
        onChange={e => {
          const value = `${e.target.value}%`
          e.target.nextSibling!.textContent = value
          document.documentElement.style.setProperty(
            '--nextra-primary-saturation',
            value
          )
        }}
      />
      <label className="text-sm text-gray-500 w-14" />
    </div>
  )
}
