import { useState, useEffect } from 'react'

export default function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const updateScrollProgress = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100
      setScrollProgress(Math.min(100, Math.max(0, progress)))
    }

    window.addEventListener('scroll', updateScrollProgress)
    updateScrollProgress() // Initial calculation

    return () => window.removeEventListener('scroll', updateScrollProgress)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-1 theme-dark:bg-black/50 theme-light:bg-slate-900/50">
      <div
        className="h-full theme-dark:bg-gradient-to-r theme-dark:from-amber-400 theme-dark:to-amber-300 theme-light:bg-gradient-to-r theme-light:from-sky-400 theme-light:to-sky-300 transition-all duration-300 ease-out"
        style={{ width: `${scrollProgress}%` }}
      ></div>
    </div>
  )
}
