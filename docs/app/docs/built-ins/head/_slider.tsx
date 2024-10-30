'use client'

import { ComponentProps, useCallback, useEffect, useState } from 'react'

export function Slider({ cssVar, max }: { cssVar: string; max: number }) {
  const handleChange: NonNullable<ComponentProps<'input'>['onChange']> =
    useCallback(
      e => {
        const value = `${e.target.value}${max === 360 ? 'deg' : '%'}`
        e.target.nextSibling!.textContent = value
        document.documentElement.style.setProperty(cssVar, value)
      },
      [cssVar]
    )

  return (
    <div className="flex h-6 items-center gap-2">
      <input
        type="range"
        className="w-28"
        onChange={handleChange}
        step="1"
        min="0"
        max={max}
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
      <label className="text-sm text-gray-500 w-20" />
    </div>
  )
}
