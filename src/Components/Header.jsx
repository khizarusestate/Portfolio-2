import { useState, useEffect, useRef } from 'react'

const navItems = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const isNavigatingRef = useRef(false)
  const navUnlockTimerRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
      if (isNavigatingRef.current) return

      const scrollPosition = window.scrollY + window.innerHeight * 0.35
      let currentSection = 'home'

      navItems.forEach((item) => {
        const section = document.querySelector(item.href)
        if (section && scrollPosition >= section.offsetTop) {
          currentSection = item.href.slice(1)
        }
      })

      setActiveSection(currentSection)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (href) => {
    const element = document.querySelector(href)
    if (element) {
      isNavigatingRef.current = true
      if (navUnlockTimerRef.current) {
        clearTimeout(navUnlockTimerRef.current)
      }
      navUnlockTimerRef.current = setTimeout(() => {
        isNavigatingRef.current = false
      }, 900)

      setActiveSection(href.slice(1))
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMobileMenuOpen(false)
    }
  }

  const handleDownloadResume = () => {
    const link = document.createElement('a')
    link.href = '/myresume.pdf'
    link.download = 'Khizar-Hayat-Resume.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  useEffect(() => {
    return () => {
      if (navUnlockTimerRef.current) {
        clearTimeout(navUnlockTimerRef.current)
      }
    }
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'backdrop-blur-xl border-b border-white/10'
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={handleDownloadResume}
            className="cv-cta group cursor-pointer relative inline-flex items-center gap-2 overflow-hidden rounded-full px-5 py-2.5 font-semibold tracking-[0.02em] transition-all duration-300 focus-visible:outline-none"
          >
            <span className="cv-cta-shine" aria-hidden="true"></span>
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
                d="M12 4v10m0 0l4-4m-4 4l-4-4M5 19h14"
              />
            </svg>
            <span className="relative z-10">Download CV</span>
          </button>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = activeSection === item.href.slice(1)

              return (
                <li key={item.name}>
                  <button
                    onClick={() => scrollToSection(item.href)}
                    className={`transition-colors duration-300 relative group cursor-pointer ${
                      isActive
                        ? 'active-nav-tab inline-flex items-center font-semibold'
                        : 'text-slate-400 hover:text-slate-50'
                    }`}
                  >
                    {isActive ? (
                      <span className="active-tab-shell">
                        <span className="active-tab-glow" aria-hidden="true"></span>
                        <span className="active-tab-ring active-tab-ring-1" aria-hidden="true"></span>
                        <span className="active-tab-ring active-tab-ring-2" aria-hidden="true"></span>
                        <span className="relative z-10 inline-block bg-gradient-to-r from-blue-900 via-sky-700 to-cyan-600 theme-dark:from-slate-100 theme-dark:via-amber-300 theme-dark:to-amber-500 bg-clip-text text-transparent">
                          {item.name}
                        </span>
                      </span>
                    ) : (
                      item.name
                    )}
                  </button>
                </li>
              )
            })}
          </ul>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-slate-50 p-2 cursor-pointer"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-white/10">
            <ul className="flex flex-col space-y-4 pt-4">
              {navItems.map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => scrollToSection(item.href)}
                    className={`transition-colors duration-300 w-full text-left cursor-pointer ${
                      activeSection === item.href.slice(1)
                        ? 'inline-block bg-gradient-to-r from-blue-900 via-sky-700 to-cyan-600 theme-dark:from-slate-100 theme-dark:via-amber-300 theme-dark:to-amber-500 bg-clip-text text-transparent font-semibold'
                        : 'text-slate-400 hover:text-slate-50'
                    }`}
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </header>
  )
}
