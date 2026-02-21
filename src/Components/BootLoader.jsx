import { useEffect, useMemo, useRef, useState } from 'react'

const CONTACT_API_URL = 'https://portfolio2-server.vercel.app/api/contact'
const ASSET_IMAGE = '/Assets/Projects/theforge-desktop.png'

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const TIP_ROTATION_MS = 5000
const MIN_TOTAL_LOADER_MS = 2400

function shuffleArray(items) {
  const next = [...items]
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = next[i]
    next[i] = next[j]
    next[j] = tmp
  }
  return next
}

function buildTipOrder(length, lastTipIndex = null) {
  const all = Array.from({ length }, (_, idx) => idx)
  if (length <= 1) return all

  let ordered = shuffleArray(all)
  if (lastTipIndex !== null && ordered[0] === lastTipIndex) {
    const swapIndex = ordered.findIndex((idx) => idx !== lastTipIndex)
    if (swapIndex > 0) {
      const temp = ordered[0]
      ordered[0] = ordered[swapIndex]
      ordered[swapIndex] = temp
    }
  }
  return ordered
}

function animateProgress(from, to, duration, onFrame) {
  return new Promise((resolve) => {
    const start = performance.now()

    const tick = (now) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = from + (to - from) * eased
      onFrame(current)
      if (progress < 1) {
        requestAnimationFrame(tick)
        return
      }
      resolve()
    }

    requestAnimationFrame(tick)
  })
}

function preloadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(true)
    image.onerror = () => reject(new Error('Asset image failed to load.'))
    image.src = src
  })
}

export default function BootLoader({ onComplete }) {
  const loaderRef = useRef(null)
  const cursorDotRef = useRef(null)
  const cursorRingRef = useRef(null)
  const cursorTrailsRef = useRef([])
  const [progress, setProgress] = useState(0)
  const [statusLine, setStatusLine] = useState('Loading data...')
  const [tipIndex, setTipIndex] = useState(0)
  const [isExiting, setIsExiting] = useState(false)
  const [flashMilestone, setFlashMilestone] = useState(null)
  const reachedMilestonesRef = useRef({
    33: false,
    66: false,
    99: false,
  })
  const tipOrderRef = useRef([])
  const tipCursorRef = useRef(0)

  const userTextRegistry = useMemo(
    () => [
      'Khizar Hayat',
      "I'm a MERN Stack Developer",
      'View My Work',
      'Get In Touch',
      'Connect With Me',
      "Let's Work Together",
      'Send Message',
    ],
    []
  )

  const tips = useMemo(
    () => [
      {
        tag: 'Tailwind',
        text: 'Extract repeated utility clusters into component classes to keep JSX easier to review.',
      },
      {
        tag: 'React',
        text: 'Memoize expensive derived values only after profiling confirms avoidable re-render cost.',
      },
      {
        tag: 'Performance',
        text: 'Debounce search and resize handlers so user input stays responsive on slower devices.',
      },
      {
        tag: 'DX',
        text: 'Keep API calls in small service helpers so UI components remain presentation-focused.',
      },
      {
        tag: 'Accessibility',
        text: 'Use semantic headings and landmark elements before adding animation and visual polish.',
      },
      {
        tag: 'State',
        text: 'Store minimal source-of-truth state and derive everything else from selectors.',
      },
      {
        tag: 'Testing',
        text: 'Cover edge cases first: loading, empty state, failure state, and retry path.',
      },
      {
        tag: 'Security',
        text: 'Validate user input on both client and server; never rely on frontend checks alone.',
      },
      {
        tag: 'Tailwind',
        text: 'Prefer design tokens via CSS variables to keep spacing and colors consistent.',
      },
      {
        tag: 'React',
        text: 'Split heavy sections with lazy loading so first paint is faster and smoother.',
      },
      {
        tag: 'Code Quality',
        text: 'Keep component files small; extract hooks when behavior starts repeating.',
      },
      {
        tag: 'Git',
        text: 'Write commit messages that explain intent, not just changed filenames.',
      },
    ],
    []
  )

  useEffect(() => {
    if (tips.length === 0) return undefined
    tipOrderRef.current = buildTipOrder(tips.length)
    tipCursorRef.current = 0
    setTipIndex(tipOrderRef.current[0])

    const intervalId = setInterval(() => {
      if (tipOrderRef.current.length === 0) return
      tipCursorRef.current += 1

      if (tipCursorRef.current >= tipOrderRef.current.length) {
        const lastIndex = tipOrderRef.current[tipOrderRef.current.length - 1]
        tipOrderRef.current = buildTipOrder(tips.length, lastIndex)
        tipCursorRef.current = 0
      }

      setTipIndex(tipOrderRef.current[tipCursorRef.current])
    }, TIP_ROTATION_MS)

    return () => clearInterval(intervalId)
  }, [tips.length])

  useEffect(() => {
    const thresholds = [33, 66, 99]
    for (const threshold of thresholds) {
      if (!reachedMilestonesRef.current[threshold] && progress >= threshold) {
        reachedMilestonesRef.current[threshold] = true
        setFlashMilestone(threshold)
        const timeoutId = setTimeout(() => setFlashMilestone(null), 460)
        return () => clearTimeout(timeoutId)
      }
    }
    return undefined
  }, [progress])

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return undefined

    let targetX = window.innerWidth * 0.5
    let targetY = window.innerHeight * 0.5
    let ringX = targetX
    let ringY = targetY
    const trails = Array.from({ length: 7 }, () => ({ x: targetX, y: targetY }))
    let isVisible = false
    let rafId = null

    const setCursorVisibility = (visible) => {
      const opacity = visible ? '1' : '0'
      if (cursorDotRef.current) cursorDotRef.current.style.opacity = opacity
      if (cursorRingRef.current) cursorRingRef.current.style.opacity = opacity
      cursorTrailsRef.current.forEach((el) => {
        if (el) el.style.opacity = visible ? '0.95' : '0'
      })
    }

    const syncParallax = () => {
      if (!loaderRef.current) return
      const nx = (targetX / window.innerWidth) * 2 - 1
      const ny = (targetY / window.innerHeight) * 2 - 1
      loaderRef.current.style.setProperty('--mx', nx.toFixed(4))
      loaderRef.current.style.setProperty('--my', ny.toFixed(4))
    }

    const animate = () => {
      ringX += (targetX - ringX) * 0.18
      ringY += (targetY - ringY) * 0.18

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`
      }
      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`
      }

      trails[0].x += (targetX - trails[0].x) * 0.42
      trails[0].y += (targetY - trails[0].y) * 0.42
      for (let i = 1; i < trails.length; i += 1) {
        trails[i].x += (trails[i - 1].x - trails[i].x) * 0.38
        trails[i].y += (trails[i - 1].y - trails[i].y) * 0.38
      }

      cursorTrailsRef.current.forEach((el, index) => {
        if (!el) return
        const trail = trails[index]
        const scale = 1 - index * 0.09
        el.style.transform = `translate3d(${trail.x}px, ${trail.y}px, 0) scale(${scale})`
      })

      rafId = requestAnimationFrame(animate)
    }

    const onMove = (event) => {
      targetX = event.clientX
      targetY = event.clientY
      syncParallax()
      if (!isVisible) {
        isVisible = true
        setCursorVisibility(true)
      }
    }

    const onLeave = () => {
      isVisible = false
      setCursorVisibility(false)
      if (loaderRef.current) {
        loaderRef.current.style.setProperty('--mx', '0')
        loaderRef.current.style.setProperty('--my', '0')
      }
    }

    setCursorVisibility(false)
    syncParallax()
    rafId = requestAnimationFrame(animate)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseleave', onLeave)

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      try {
        const bootStartedAt = performance.now()
        setStatusLine('Loading data...')
        await wait(140)

        const networkResponse = await fetch(CONTACT_API_URL, {
          method: 'GET',
          cache: 'no-store',
        })

        if (cancelled) return
        const backendReachable = typeof networkResponse.status === 'number'
        if (!backendReachable) {
          throw new Error('Backend is not reachable.')
        }

        await animateProgress(0, 33, 500, (value) => {
          if (!cancelled) setProgress(value)
        })

        if (cancelled) return
        setStatusLine('Loading data...')
        await wait(120)
        const textOk = userTextRegistry.every((text) => text.trim().length > 0)
        if (!textOk) {
          throw new Error('User data text validation failed.')
        }

        await animateProgress(33, 66, 560, (value) => {
          if (!cancelled) setProgress(value)
        })

        if (cancelled) return
        setStatusLine('Loading data...')
        await preloadImage(ASSET_IMAGE)

        if (cancelled) return
        await animateProgress(66, 99, 620, (value) => {
          if (!cancelled) setProgress(value)
        })

        if (cancelled) return
        const elapsed = performance.now() - bootStartedAt
        const minWaitRemaining = Math.max(0, MIN_TOTAL_LOADER_MS - elapsed)
        if (minWaitRemaining > 0) {
          await wait(minWaitRemaining)
        }

        if (cancelled) return
        setStatusLine('System ready. Launching experience...')
        await wait(180)
        setProgress(100)
        await wait(180)
        if (cancelled) return
        setIsExiting(true)
        await wait(460)
        if (!cancelled) onComplete?.()
      } catch (error) {
        if (cancelled) return
        setStatusLine(error.message || 'Loading data...')
      }
    }

    run()

    return () => {
      cancelled = true
    }
  }, [onComplete, userTextRegistry])

  const progressStage =
    progress >= 99 ? 'stage-3' : progress >= 66 ? 'stage-2' : progress >= 33 ? 'stage-1' : 'stage-0'

  return (
    <div ref={loaderRef} className={`boot-loader ${isExiting ? 'boot-loader-exit' : ''}`} role="status" aria-live="polite">
      <div className="boot-loader-bg" aria-hidden="true"></div>
      <div className="boot-loader-grid" aria-hidden="true"></div>
      <div className="boot-loader-orb boot-loader-orb-1" aria-hidden="true"></div>
      <div className="boot-loader-orb boot-loader-orb-2" aria-hidden="true"></div>

      <div className="boot-loader-tip-box">
        <p key={tipIndex} className="boot-loader-tip-text">
          <span className="boot-loader-tip-tag">{tips[tipIndex]?.tag}</span>{' '}
          <span>{tips[tipIndex]?.text}</span>
        </p>
      </div>

      <div className="boot-loader-progress-dock">
        <p className="boot-loader-live">{statusLine}</p>
        <div className={`boot-loader-progress-track ${progressStage}`} aria-hidden="true">
          <span className={`boot-loader-milestone m33 ${progress >= 33 ? 'is-hit' : ''} ${flashMilestone === 33 ? 'is-flash' : ''}`}></span>
          <span className={`boot-loader-milestone m66 ${progress >= 66 ? 'is-hit' : ''} ${flashMilestone === 66 ? 'is-flash' : ''}`}></span>
          <span className={`boot-loader-milestone m99 ${progress >= 99 ? 'is-hit' : ''} ${flashMilestone === 99 ? 'is-flash' : ''}`}></span>
          <span className="boot-loader-progress-glow"></span>
          <span
            className="boot-loader-progress-value"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          ></span>
          <span className="boot-loader-progress-inline">{Math.round(progress)}%</span>
        </div>
      </div>

      <div className="boot-loader-cursor-layer" aria-hidden="true">
        <span ref={cursorRingRef} className="boot-loader-cursor-ring"></span>
        <span ref={cursorDotRef} className="boot-loader-cursor-dot"></span>
        {Array.from({ length: 7 }).map((_, index) => (
          <span
            key={index}
            ref={(element) => {
              cursorTrailsRef.current[index] = element
            }}
            className="boot-loader-cursor-trail"
          ></span>
        ))}
      </div>
    </div>
  )
}
