import { useMemo } from 'react'
import { useTheme } from '../context/ThemeContext'

export default function ParticleBackground() {
  const { isDark } = useTheme()
  const particles = useMemo(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    const count = isMobile ? 25 : 55
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: 18 + Math.random() * 18,
      delay: Math.random() * 5,
      opacity: 0.18 + Math.random() * 0.3,
    }))
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Animated gradient orbs */}
      <div
        className={`absolute w-[520px] h-[520px] -top-40 -left-40 rounded-full opacity-15 animate-float-slow ${
          isDark ? 'bg-amber-500' : 'bg-blue-400'
        } max-md:opacity-8`}
        style={{ animationDuration: '22s' }}
      />
      <div
        className={`absolute w-[340px] h-[340px] top-1/2 -right-28 rounded-full opacity-12 animate-float-slow ${
          isDark ? 'bg-amber-400' : 'bg-indigo-400'
        } max-md:hidden`}
        style={{ animationDuration: '26s', animationDelay: '-5s' }}
      />
      <div
        className={`absolute w-[260px] h-[260px] bottom-0 left-1/3 rounded-full opacity-10 animate-float-slow ${
          isDark ? 'bg-amber-300' : 'bg-blue-300'
        } max-md:opacity-6`}
        style={{ animationDuration: '20s', animationDelay: '-8s' }}
      />
      
      {/* Floating particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className={`absolute rounded-full animate-particle-float ${
            isDark ? 'bg-amber-300/40' : 'bg-blue-500/50'
          }`}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            opacity: p.opacity,
          }}
        />
      ))}
      
      {/* Shimmer overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br from-transparent ${isDark ? 'via-amber-500/5' : 'via-sky-500/5'} to-transparent animate-shimmer`} />
    </div>
  )
}
