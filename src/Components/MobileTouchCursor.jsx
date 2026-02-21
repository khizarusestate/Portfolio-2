import { useEffect, useRef, useState } from 'react'
import { useTheme } from '../context/ThemeContext'

export default function MobileTouchCursor() {
  const ringRef = useRef(null)
  const dotRef = useRef(null)
  const trailRefs = useRef([])
  const [enabled, setEnabled] = useState(false)
  const [active, setActive] = useState(false)
  const { isDark } = useTheme()

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches
    setEnabled(isTouchDevice)
    return undefined
  }, [])

  useEffect(() => {
    if (!enabled) return undefined

    let targetX = window.innerWidth * 0.5
    let targetY = window.innerHeight * 0.5
    let ringX = targetX
    let ringY = targetY
    let isTouching = false
    let lastMoveTs = 0
    let lastX = targetX
    let lastY = targetY
    let speed = 0
    const trails = Array.from({ length: 7 }, () => ({ x: targetX, y: targetY }))
    let hideTimer = null
    let rafId = null

    const setOpacity = (show) => {
      const opacity = show ? '1' : '0'
      if (ringRef.current) ringRef.current.style.opacity = opacity
      if (dotRef.current) dotRef.current.style.opacity = opacity
      trailRefs.current.forEach((node) => {
        if (node) node.style.opacity = show ? '0.95' : '0'
      })
    }

    const pokeVisible = () => {
      setActive(true)
      setOpacity(true)
      if (hideTimer) clearTimeout(hideTimer)
    }

    const queueHide = () => {
      if (hideTimer) clearTimeout(hideTimer)
      hideTimer = setTimeout(() => {
        setOpacity(false)
        setActive(false)
      }, 420)
    }

    const onTouchStart = (event) => {
      const touch = event.touches[0]
      if (!touch) return
      isTouching = true
      targetX = touch.clientX
      targetY = touch.clientY
      lastX = targetX
      lastY = targetY
      lastMoveTs = performance.now()
      speed = 0
      pokeVisible()
    }

    const onTouchMove = (event) => {
      const touch = event.touches[0]
      if (!touch) return
      const now = performance.now()
      const dx = touch.clientX - lastX
      const dy = touch.clientY - lastY
      const dt = Math.max(8, now - lastMoveTs)
      const velocity = Math.sqrt(dx * dx + dy * dy) / dt
      speed = Math.min(1.8, speed * 0.55 + velocity * 1.25)
      targetX = touch.clientX
      targetY = touch.clientY
      lastX = targetX
      lastY = targetY
      lastMoveTs = now
      pokeVisible()
    }

    const onTouchEnd = () => {
      isTouching = false
      queueHide()
    }

    const animate = () => {
      ringX += (targetX - ringX) * 0.22
      ringY += (targetY - ringY) * 0.22

      const ringScale = 1 + Math.min(0.55, speed * 0.28)
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) scale(${ringScale})`
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`
      }

      trails[0].x += (targetX - trails[0].x) * 0.44
      trails[0].y += (targetY - trails[0].y) * 0.44
      for (let i = 1; i < trails.length; i += 1) {
        trails[i].x += (trails[i - 1].x - trails[i].x) * 0.36
        trails[i].y += (trails[i - 1].y - trails[i].y) * 0.36
      }

      trailRefs.current.forEach((node, idx) => {
        if (!node) return
        const scale = 1 - idx * 0.1
        node.style.transform = `translate3d(${trails[idx].x}px, ${trails[idx].y}px, 0) scale(${scale})`
      })

      speed *= isTouching ? 0.92 : 0.86
      rafId = requestAnimationFrame(animate)
    }

    setOpacity(false)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('touchcancel', onTouchEnd, { passive: true })
    rafId = requestAnimationFrame(animate)

    return () => {
      if (hideTimer) clearTimeout(hideTimer)
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('touchcancel', onTouchEnd)
    }
  }, [enabled])

  if (!enabled) return null

  const tone = isDark
    ? {
        '--mt-primary': '#fbbf24',
        '--mt-secondary': '#fde68a',
        '--mt-glow': 'rgba(251, 191, 36, 0.5)',
      }
    : {
        '--mt-primary': '#0ea5e9',
        '--mt-secondary': '#7dd3fc',
        '--mt-glow': 'rgba(14, 165, 233, 0.45)',
      }

  return (
    <div
      className={`mobile-touch-cursor ${active ? 'is-active' : ''}`}
      style={tone}
      aria-hidden="true"
    >
      <span ref={ringRef} className="mobile-touch-cursor-ring"></span>
      <span ref={dotRef} className="mobile-touch-cursor-dot"></span>
      {Array.from({ length: 7 }).map((_, index) => (
        <span
          key={index}
          ref={(node) => {
            trailRefs.current[index] = node
          }}
          className="mobile-touch-cursor-trail"
        ></span>
      ))}
    </div>
  )
}
