import { useEffect, useRef, useState } from 'react'
import { useTheme } from '../context/ThemeContext'

export default function CustomCursor() {
  const cursorRef = useRef(null)
  const [isHovering, setIsHovering] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [trail, setTrail] = useState([])
  const { isDark } = useTheme()

  useEffect(() => {
    const MAX_TRAIL = 12
    let rafId = null

    const handleMouseMove = (e) => {
      const newPos = { x: e.clientX, y: e.clientY }
      setMousePos(newPos)

      // Update cursor position smoothly
      if (cursorRef.current) {
        cursorRef.current.style.left = newPos.x + 'px'
        cursorRef.current.style.top = newPos.y + 'px'
      }

      // Add to trail with timestamp
      setTrail((prev) => {
        const newTrail = [{ ...newPos, id: Date.now() + Math.random() }, ...prev]
        return newTrail.slice(0, MAX_TRAIL)
      })
    }

    const handlePointerOver = (e) => {
      if (e.target.closest('button, a, [role="button"], input, textarea, .cursor-pointer')) {
        setIsHovering(true)
      }
    }

    const handlePointerOut = (e) => {
      if (!e.target.closest('button, a, [role="button"], input, textarea, .cursor-pointer')) {
        setIsHovering(false)
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('pointerover', handlePointerOver)
    document.addEventListener('pointerout', handlePointerOut)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('pointerover', handlePointerOver)
      document.removeEventListener('pointerout', handlePointerOut)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  const cursorColor = isDark 
    ? '#fbbf24' // Amber/Gold for dark theme
    : '#2563eb' // Blue for light theme

  const trailColor = isDark
    ? 'rgba(251, 191, 36, 0.4)' // Amber trail for dark
    : 'rgba(59, 130, 246, 0.5)' // Blue trail for light

  const glowColor = isDark
    ? 'rgba(251, 191, 36, 0.6)' // Amber glow
    : 'rgba(59, 130, 246, 0.6)' // Blue glow

  return (
    <>
      {/* Beautiful cursor trail particles */}
      {trail.map((point, index) => {
        const size = 8 - index * 0.6
        const opacity = (trail.length - index) / trail.length * 0.7
        return (
          <div
            key={point.id}
            className="hidden lg:block fixed pointer-events-none z-[9998]"
            style={{
              left: point.x,
              top: point.y,
              width: `${size}px`,
              height: `${size}px`,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${trailColor}, transparent)`,
              boxShadow: `0 0 ${size * 2}px ${trailColor}`,
              transform: 'translate(-50%, -50%)',
              opacity: opacity,
              transition: 'all 0.15s ease-out',
            }}
          />
        )
      })}

      {/* Main cursor - beautiful arrow pointer */}
      <div
        ref={cursorRef}
        className={`hidden lg:block fixed pointer-events-none z-[9999] transition-all duration-300 ${
          isHovering ? 'scale-125' : 'scale-100'
        }`}
        style={{
          left: mousePos.x,
          top: mousePos.y,
          transform: `translate(-50%, -50%) ${isHovering ? 'scale(1.25)' : 'scale(1)'}`,
        }}
      >
        {/* Outer glow ring */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: isHovering ? '50px' : '30px',
            height: isHovering ? '50px' : '30px',
            background: `radial-gradient(circle, ${glowColor}40, transparent 70%)`,
            boxShadow: `0 0 ${isHovering ? '25px' : '15px'} ${glowColor}`,
            transition: 'all 0.3s ease-out',
          }}
        />

        {/* Cursor arrow - beautiful pointer */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10"
          style={{
            filter: `drop-shadow(0 0 6px ${glowColor}) drop-shadow(0 0 12px ${glowColor}80)`,
          }}
        >
          {/* Arrow pointer shape */}
          <path
            d="M2 2L8.5 15L10.5 10.5L15 8.5L2 2Z"
            fill={cursorColor}
            stroke={isDark ? 'rgba(251, 191, 36, 0.5)' : 'rgba(59, 130, 246, 0.5)'}
            strokeWidth="0.5"
          />
          {/* Inner highlight */}
          <path
            d="M2 2L8.5 15L10.5 10.5L15 8.5L2 2Z"
            fill={isDark ? 'rgba(251, 191, 36, 0.2)' : 'rgba(59, 130, 246, 0.2)'}
            style={{ filter: 'blur(1px)' }}
          />
        </svg>

        {/* Hover effect - expanding ring */}
        {isHovering && (
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full animate-ping"
            style={{
              width: '35px',
              height: '35px',
              border: `2px solid ${cursorColor}`,
              opacity: 0.4,
            }}
          />
        )}
      </div>
    </>
  )
}
