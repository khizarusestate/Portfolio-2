import { useState, useEffect, useRef } from 'react'
const navItems = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Portfolio', href: '#projects' },
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

  useEffect(() => {
    return () => {
      if (navUnlockTimerRef.current) {
        clearTimeout(navUnlockTimerRef.current)
      }
    }
  }, [])

  return (
    <header
      className={`premium-header fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'backdrop-blur-xl border-b border-white/10 theme-dark:bg-black/80 theme-light:bg-white/80'
          : 'backdrop-blur-xl border-b border-white/10/0 md:backdrop-blur-none md:border-b-0 md:bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-6 py-3 md:py-4">
        <div className="flex items-center gap-4">
          {/* CV button - left */}
          <div className="flex items-center">
            <button
              onClick={handleDownloadResume}
              className="cv-cta magnetic-btn group cursor-pointer relative inline-flex items-center gap-1.5 sm:gap-2 overflow-hidden rounded-full px-3 py-2 text-xs sm:px-5 sm:py-2.5 sm:text-sm font-semibold tracking-[0.02em] transition-all duration-300 focus-visible:outline-none"
              onMouseMove={handleMagneticMove}
              onMouseLeave={handleMagneticLeave}
            >
              <span className="cv-cta-shine" aria-hidden="true"></span>
              <svg
                className="relative z-10 h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform duration-300 group-hover:translate-y-0.5"
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
          </div>

          {/* Spacer to push nav to the right */}
          <div className="hidden md:block flex-1" />

          {/* Desktop Navigation - right glass pill with icons */}
          <div className="hidden md:flex items-center nav-shell rounded-full backdrop-blur-xl px-4 py-1.5 theme-dark:bg-slate-950/40 theme-light:bg-slate-900/90">
            <ul className="flex items-center gap-3">
              {navItems.map((item) => {
                const isActive = activeSection === item.href.slice(1)

                const renderIcon = () => {
                  switch (item.href) {
                    case '#home':
                      return (
                        <svg
                          className="h-4.5 w-4.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            d="M4 11L12 4L20 11V20C20 20.5523 19.5523 21 19 21H14.5C14.2239 21 14 20.7761 14 20.5V15.5C14 14.9477 13.5523 14.5 13 14.5H11C10.4477 14.5 10 14.9477 10 15.5V20.5C10 20.7761 9.77614 21 9.5 21H5C4.44772 21 4 20.5523 4 20V11Z"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )
                    case '#about':
                      return (
                        <svg
                          className="h-4.5 w-4.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            d="M12 12C13.933 12 15.5 10.433 15.5 8.5C15.5 6.567 13.933 5 12 5C10.067 5 8.5 6.567 8.5 8.5C8.5 10.433 10.067 12 12 12Z"
                            strokeWidth="1.6"
                          />
                          <path
                            d="M6.25 19C7.21447 17.2744 9.03042 16.125 11.0312 16.125H12.9688C14.9696 16.125 16.7855 17.2744 17.75 19"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                          />
                        </svg>
                      )
                    case '#projects':
                      return (
                        <svg
                          className="h-4.5 w-4.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <rect x="4" y="4.5" width="7" height="7" rx="2" strokeWidth="1.6" />
                          <rect x="13" y="4.5" width="7" height="5" rx="2" strokeWidth="1.6" />
                          <rect x="13" y="11.5" width="7" height="8" rx="2" strokeWidth="1.6" />
                          <rect x="4" y="13.5" width="7" height="6" rx="2" strokeWidth="1.6" />
                        </svg>
                      )
                    case '#contact':
                      return (
                        <svg
                          className="h-4.5 w-4.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <rect
                            x="3.5"
                            y="5"
                            width="17"
                            height="14"
                            rx="2.3"
                            strokeWidth="1.6"
                          />
                          <path
                            d="M5 7L11.3551 11.5704C11.7375 11.8566 12.2625 11.8566 12.6449 11.5704L19 7"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )
                    default:
                      return null
                  }
                }

                return (
                  <li key={item.name}>
                    <button
                      onClick={() => scrollToSection(item.href)}
                      className={`nav-item group relative flex flex-col items-center gap-1 cursor-pointer text-sm font-medium tracking-wide transition-colors duration-300 ${
                        isActive
                          ? 'active-nav-tab inline-flex items-center'
                          : 'theme-dark:text-slate-300/90 theme-dark:hover:text-slate-50 theme-light:text-slate-100 theme-light:hover:text-white'
                      }`}
                    >
                      {isActive ? (
                        <span className="active-tab-shell flex flex-col items-center gap-1">
                          <span className="active-tab-glow" aria-hidden="true"></span>
                          <span className="active-tab-ring active-tab-ring-1" aria-hidden="true"></span>
                          <span className="active-tab-ring active-tab-ring-2" aria-hidden="true"></span>
                          <span className="relative z-10 flex flex-col items-center gap-1">
                            <span className="inline-flex h-5 w-5 items-center justify-center">
                              {renderIcon()}
                            </span>
                            <span className="text-[0.6rem] uppercase tracking-[0.18em]">
                              {item.name}
                            </span>
                          </span>
                        </span>
                      ) : (
                        <span className="relative z-10 flex flex-col items-center gap-1">
                          <span className="inline-flex h-5 w-5 items-center justify-center">
                            {renderIcon()}
                          </span>
                          <span className="text-[0.6rem] uppercase tracking-[0.18em] opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 text-slate-300/90 theme-light:text-slate-100">
                            {item.name}
                          </span>
                        </span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Mobile Menu Button - far right */}
          <div className="flex items-center gap-3 ml-auto md:hidden">
            <button
              onClick={() => {
                setIsMobileMenuOpen(!isMobileMenuOpen)
              }}
              className="text-slate-50 p-2 cursor-pointer rounded-full border border-white/15 bg-white/5 backdrop-blur"
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

        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-white/10">
            <div className="pt-4 space-y-4">
              <ul className="flex flex-col space-y-3 pt-2">
                {navItems.map((item, idx) => (
                  <li
                    key={item.name}
                    style={{ '--stagger-delay': `${80 + idx * 80}ms` }}
                    className="reveal-stagger"
                  >
                    <button
                      onClick={() => scrollToSection(item.href)}
                      className={`transition-colors duration-300 w-full text-left cursor-pointer ${
                        activeSection === item.href.slice(1)
                          ? 'active-nav-tab inline-flex items-center font-semibold'
                          : 'text-slate-400 hover:text-slate-50'
                      }`}
                    >
                      {activeSection === item.href.slice(1) ? (
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
                ))}
              </ul>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
