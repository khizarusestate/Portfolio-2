import { useState, useEffect } from 'react'

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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)

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
      setActiveSection(href.slice(1))
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/10'
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => {
              const element = document.querySelector('#home')
              element?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="text-2xl font-bold theme-dark:text-amber-400 theme-light:text-sky-600 cursor-pointer transition-all duration-300 theme-dark:hover:drop-shadow-[0_0_10px_rgba(251,191,36,0.45)] theme-light:hover:drop-shadow-[0_0_10px_rgba(14,165,233,0.45)]"
          >
            KH
          </button>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => scrollToSection(item.href)}
                  className={`transition-colors duration-300 relative group cursor-pointer ${
                    activeSection === item.href.slice(1)
                      ? 'inline-block bg-gradient-to-r from-blue-900 via-sky-700 to-cyan-600 theme-dark:from-slate-100 theme-dark:via-amber-300 theme-dark:to-amber-500 bg-clip-text text-transparent font-semibold'
                      : 'text-slate-400 hover:text-slate-50'
                  }`}
                >
                  {item.name}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-900 via-sky-700 to-cyan-600 theme-dark:from-slate-100 theme-dark:via-amber-300 theme-dark:to-amber-500 transition-all duration-300 ${
                      activeSection === item.href.slice(1) ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  ></span>
                </button>
              </li>
            ))}
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
