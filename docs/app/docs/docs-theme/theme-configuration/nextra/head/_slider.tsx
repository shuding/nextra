'use client'

import { useEffect, useState } from 'react'

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

function hexToRgb(hex: `#${string}`): string {
  const bigint = parseInt(hex.slice(1), 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `${r},${g},${b}`
}

export function BackgroundColor() {
  const [value, setValue] = useState('')
  useEffect(() => {
    const color = getComputedStyle(document.body).getPropertyValue(
      '--nextra-bg'
    )
    setValue(color)
  }, [])

  return (
    <div className="flex h-6 items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={e => {
          const { value } = e.target
          e.target.nextSibling!.textContent = value
          document.documentElement.style.setProperty(
            '--nextra-bg',
            hexToRgb(value as `#${string}`)
          )
        }}
      />
      <label className="text-sm text-gray-500 w-18" />
    </div>
  )
}
