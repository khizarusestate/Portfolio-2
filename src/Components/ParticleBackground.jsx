import { useMemo } from 'react'
import { useTheme } from '../context/ThemeContext'

export default function ParticleBackground() {
  const { isDark } = useTheme()
  const particles = useMemo(() => 
    Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: 15 + Math.random() * 20,
      delay: Math.random() * 5,
      opacity: 0.2 + Math.random() * 0.4,
    })), []
  )

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Animated gradient orbs */}
      <div className={`absolute w-[600px] h-[600px] -top-48 -left-48 rounded-full opacity-20 animate-float-slow ${
        isDark ? 'bg-amber-500' : 'bg-blue-400'
      }`} style={{ animationDuration: '20s' }} />
      <div className={`absolute w-[400px] h-[400px] top-1/2 -right-32 rounded-full opacity-15 animate-float-slow ${
        isDark ? 'bg-amber-400' : 'bg-indigo-400'
      }`} style={{ animationDuration: '25s', animationDelay: '-5s' }} />
      <div className={`absolute w-[300px] h-[300px] bottom-0 left-1/3 rounded-full opacity-10 animate-float-slow ${
        isDark ? 'bg-amber-300' : 'bg-blue-300'
      }`} style={{ animationDuration: '18s', animationDelay: '-10s' }} />
      
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
