import { useEffect, useRef, useState } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

function AnimatedNumber({ end, duration = 2000, suffix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          const startTime = Date.now()
          const startValue = 0

          const animate = () => {
            const now = Date.now()
            const elapsed = now - startTime
            const progress = Math.min(elapsed / duration, 1)

            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3)
            const current = Math.floor(startValue + (end - startValue) * easeOut)

            setCount(current)

            if (progress < 1) {
              requestAnimationFrame(animate)
            } else {
              setCount(end)
            }
          }

          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [end, duration, hasAnimated])

  return (
    <span ref={ref} className="inline-block">
      {count}
      {suffix}
    </span>
  )
}

export default function Stats() {
  const [sectionRef, isVisible] = useScrollAnimation({ threshold: 0.2 })
  const stats = [
    { number: 10, suffix: '+', label: 'Projects' },
    { number: 2, suffix: '+', label: 'Years of Experience' },
    { number: 7, suffix: '+', label: 'Technologies' },
  ]

  return (
    <section ref={sectionRef} className="py-20 relative">
      {/* Background - Theme Aware */}
      <div className="absolute inset-0 theme-dark:bg-gradient-to-b theme-dark:from-black theme-dark:via-gray-950 theme-dark:to-black theme-light:bg-gradient-to-b theme-light:from-sky-50 theme-light:via-blue-50 theme-light:to-cyan-50"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={`${stat.label}-${stat.number}`}
              className={`text-center backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 hover:scale-105 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
              style={{ transitionDelay: `${index * 110}ms` }}
            >
              <div className="text-5xl md:text-6xl font-bold theme-dark:text-amber-400 theme-light:text-sky-600 mb-2">
                <AnimatedNumber
                  key={`${stat.label}-${stat.number}`}
                  end={stat.number}
                  suffix={stat.suffix}
                />
              </div>
              <div className="text-slate-400 text-sm md:text-base font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
