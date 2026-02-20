import { useRef } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

export default function Home() {
  const heroRef = useRef(null)
  const [sectionRef] = useScrollAnimation({ threshold: 0.2 })

  const handleMagneticMove = (e) => {
    const btn = e.currentTarget
    const rect = btn.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10
    btn.style.setProperty('--mx', `${x}px`)
    btn.style.setProperty('--my', `${y}px`)
  }

  const handleMagneticLeave = (e) => {
    const btn = e.currentTarget
    btn.style.setProperty('--mx', '0px')
    btn.style.setProperty('--my', '0px')
  }

  return (
    <section
      id="home"
      ref={(node) => {
        heroRef.current = node
        if (sectionRef.current !== node) {
          sectionRef.current = node
        }
      }}
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* Animated Background Gradient - Theme Aware */}
      <div className="absolute inset-0 theme-dark:bg-gradient-to-br theme-dark:from-black theme-dark:via-gray-950 theme-dark:to-black theme-light:bg-gradient-to-br theme-light:from-sky-50 theme-light:via-blue-50 theme-light:to-cyan-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(30,58,138,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.15),transparent_50%)]"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Hero Content - Option 7: Cool white + subtle blue */}
      <div className="container mx-auto px-6 pt-16 md:pt-0 text-center relative z-10">
        <div className="space-y-6 animate-fade-in">
          {/* Greeting */}
          <p
            className="theme-dark:text-amber-400 theme-light:text-sky-600 text-lg md:text-xl font-light tracking-wider reveal-stagger"
            style={{ '--stagger-delay': '80ms' }}
          >
            Hi, my name is
          </p>

          {/* Name */}
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-slate-50 reveal-stagger"
            style={{ '--stagger-delay': '190ms' }}
          >
            <span className="inline-block bg-gradient-to-r from-blue-900 via-sky-700 to-cyan-600 theme-dark:from-slate-100 theme-dark:via-amber-300 theme-dark:to-amber-500 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(15,23,42,0.28)]">
              Khizar Hayat
            </span>
          </h1>

          {/* Title */}
          <h2
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-slate-400 reveal-stagger"
            style={{ '--stagger-delay': '320ms' }}
          >
            I'm a{' '}
            <span className="theme-dark:text-amber-400 theme-light:text-sky-600">
              MERN Stack Developer
            </span>
          </h2>

          {/* Description */}
          <p
            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed reveal-stagger"
            style={{ '--stagger-delay': '460ms' }}
          >
            I build full-stack web applications using MongoDB, Express, React, and Node.js.
            Passionate about crafting scalable solutions and leveraging AI-powered tools
            to deliver clean, efficient, and user-centric digital experiences.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 reveal-stagger"
            style={{ '--stagger-delay': '620ms' }}
          >
            <button
              onClick={(e) => {
                const element = document.querySelector('#projects')
                element?.scrollIntoView({ behavior: 'smooth' })
                // Ripple effect
                const button = e.currentTarget
                const ripple = document.createElement('span')
                const rect = button.getBoundingClientRect()
                const size = Math.max(rect.width, rect.height)
                const x = e.clientX - rect.left - size / 2
                const y = e.clientY - rect.top - size / 2
                
                ripple.style.width = ripple.style.height = size + 'px'
                ripple.style.left = x + 'px'
                ripple.style.top = y + 'px'
                ripple.classList.add('ripple')
                
                button.appendChild(ripple)
                setTimeout(() => ripple.remove(), 600)
              }}
              className="hero-cta hero-cta-primary magnetic-btn group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-8 py-4 font-semibold tracking-[0.02em] transition-all duration-300 cursor-pointer"
              onMouseMove={handleMagneticMove}
              onMouseLeave={handleMagneticLeave}
            >
              <span className="hero-cta-sheen" aria-hidden="true"></span>
              <span className="relative z-10">View My Work</span>
              <svg
                className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.9} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              onClick={() => {
                const element = document.querySelector('#contact')
                element?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="hero-cta hero-cta-secondary magnetic-btn group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-8 py-4 font-semibold tracking-[0.02em] transition-all duration-300 cursor-pointer"
              onMouseMove={handleMagneticMove}
              onMouseLeave={handleMagneticLeave}
            >
              <span className="hero-cta-sheen" aria-hidden="true"></span>
              <span className="relative z-10">Get In Touch</span>
              <svg
                className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.9}
                  d="M4 12h16m0 0l-5-5m5 5l-5 5"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-slate-400/40 rounded-full flex justify-center">
            <div className="w-1 h-3 theme-dark:bg-amber-400/70 theme-light:bg-sky-600/70 rounded-full mt-2 animate-scroll"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
