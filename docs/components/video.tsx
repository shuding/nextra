import type { FC } from 'react'

export const Video: FC<{ src: string }> = ({ src }) => {
  return (
    <video
      muted
      autoPlay
      playsInline
      loop
      controls
      className="x:focus-visible:nextra-focus mt-6 rounded-xl border dark:border-zinc-800"
    >
      <source src={src} type="video/mp4" />
    </video>
  )
}
