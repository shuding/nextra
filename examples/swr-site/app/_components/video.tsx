'use client'

import type { FC, ReactNode } from 'react'
import { useCallback, useEffect, useRef } from 'react'
import { useInView } from 'react-intersection-observer'

export const Video: FC<{ src: string; caption?: ReactNode; ratio: number }> = ({
  src,
  caption,
  ratio
}) => {
  const [inViewRef, inView] = useInView({ threshold: 1 })
  const videoRef = useRef<HTMLVideoElement>(null)

  const setRefs = useCallback(
    // @ts-expect-error -- fixme
    node => {
      // Ref's from useRef needs to have the node assigned to `current`
      videoRef.current = node
      // Callback refs, like the one from `useInView`, is a function that takes the node as an argument
      inViewRef(node)

      node.addEventListener('click', function (this: HTMLVideoElement) {
        if (this.paused) {
          this.play()
        } else {
          this.pause()
        }
      })
    },
    [inViewRef]
  )

  useEffect(() => {
    if (!videoRef.current) {
      return
    }

    if (inView) {
      videoRef.current.play()
    } else {
      videoRef.current.pause()
    }
  }, [inView])

  return (
    <div style={{ position: 'relative', margin: '2rem 1rem' }}>
      <div style={{ paddingBottom: ratio * 100 + '%' }} />
      <video
        style={{ position: 'absolute', top: 0, left: 0 }}
        loop
        muted
        autoPlay
        playsInline
        ref={setRefs}
      >
        <source src={src} type="video/mp4" />
      </video>
      {caption && (
        <figcaption style={{ fontSize: '.9rem', textAlign: 'center' }}>
          {caption}
        </figcaption>
      )}
    </div>
  )
}
