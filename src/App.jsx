import { useEffect, useState } from 'react'
import Header from './Components/Header'
import Home from './Components/Home'
import About from './Components/About'
import Stats from './Components/Stats'
import Projects from './Components/Projects'
import Contact from './Components/Contact'
import ScrollProgress from './Components/ScrollProgress'
import ThemeToggle from './Components/ThemeToggle'
import CustomCursor from './Components/CustomCursor'
import MobileTouchCursor from './Components/MobileTouchCursor'
import ParticleBackground from './Components/ParticleBackground'
import BootLoader from './Components/BootLoader'

export default function App() {
  const [isBootLoading, setIsBootLoading] = useState(true)
  const [isAppEntering, setIsAppEntering] = useState(false)

  useEffect(() => {
    if (!isAppEntering) return undefined
    const timeoutId = setTimeout(() => setIsAppEntering(false), 560)
    return () => clearTimeout(timeoutId)
  }, [isAppEntering])

  if (isBootLoading) {
    return (
      <BootLoader
        onComplete={() => {
          setIsBootLoading(false)
          setIsAppEntering(true)
        }}
      />
    )
  }

  return (
    <div className={`relative min-h-screen ${isAppEntering ? 'app-content-enter' : ''}`}>
      <CustomCursor />
      <MobileTouchCursor />
      <ScrollProgress />
      <Header />
      <ThemeToggle />
      <ParticleBackground />
      <main className="relative z-10">
        <Home />
        <About />
        <Stats />
        <Projects />
        <Contact />
      </main>

      {/* Footer */}
      <footer className="border-t theme-dark:border-white/10 theme-light:border-slate-300/20 theme-dark:bg-black/80 theme-light:bg-white/80 backdrop-blur-xl py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="theme-dark:text-slate-400 theme-light:text-slate-600">
            (c) {new Date().getFullYear()} Khizar Hayat. Built with React & Tailwind CSS.
          </p>
        </div>
      </footer>
    </div>
  )
}
