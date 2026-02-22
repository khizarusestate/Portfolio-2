import { useState } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

function ShowcaseCard({ project, index }) {
  const [cardRef, isVisible] = useScrollAnimation({
    threshold: 0.2,
    rootMargin: '0px 0px -80px 0px',
  })
  const [desktopLoaded, setDesktopLoaded] = useState(false)
  const [mobileLoaded, setMobileLoaded] = useState(false)

  const handleTiltMove = (e) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    const rx = (0.5 - py) * 7
    const ry = (px - 0.5) * 9

    card.style.setProperty('--rx', `${rx}deg`)
    card.style.setProperty('--ry', `${ry}deg`)
    card.style.setProperty('--sx', `${px * 100}%`)
    card.style.setProperty('--sy', `${py * 100}%`)
  }

  const handleTiltLeave = (e) => {
    const card = e.currentTarget
    card.style.setProperty('--rx', '0deg')
    card.style.setProperty('--ry', '0deg')
    card.style.setProperty('--sx', '50%')
    card.style.setProperty('--sy', '50%')
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

  return (
    <article
      ref={cardRef}
      className={`project-tilt group grid lg:grid-cols-2 gap-10 items-center backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10 transition-all duration-300 hover:bg-white/[0.12] theme-dark:hover:border-amber-300/65 theme-light:hover:border-sky-500/65 theme-dark:hover:shadow-[0_16px_40px_rgba(251,191,36,0.26)] theme-light:hover:shadow-[0_16px_40px_rgba(14,165,233,0.24)] hover:-translate-y-0.5 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
      onMouseMove={handleTiltMove}
      onMouseLeave={handleTiltLeave}
    >
      <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
        <div className="relative rounded-2xl overflow-hidden border border-white/15 shadow-2xl transition-all duration-300 theme-dark:group-hover:shadow-[0_18px_42px_rgba(251,191,36,0.36)] theme-light:group-hover:shadow-[0_18px_42px_rgba(14,165,233,0.34)]">
          {!desktopLoaded && <div className="absolute inset-0 loading-shimmer"></div>}
          <img
            src={project.desktopImage}
            alt={`${project.title} desktop preview`}
            className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-[1.02] theme-dark:group-hover:drop-shadow-[0_16px_34px_rgba(251,191,36,0.34)] theme-light:group-hover:drop-shadow-[0_16px_34px_rgba(14,165,233,0.32)] ${
              desktopLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
            onLoad={() => setDesktopLoaded(true)}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-transparent opacity-55 group-hover:opacity-45 transition-opacity duration-300"></div>
        </div>

        <div className="relative w-32 md:w-40 -mt-20 ml-auto mr-4 md:mr-8 rounded-2xl overflow-hidden border border-white/20 shadow-2xl backdrop-blur bg-slate-950/40 transition-all duration-300 theme-dark:group-hover:shadow-[0_16px_34px_rgba(251,191,36,0.32)] theme-light:group-hover:shadow-[0_16px_34px_rgba(14,165,233,0.3)]">
          {!mobileLoaded && <div className="absolute inset-0 loading-shimmer"></div>}
          <img
            src={project.mobileImage}
            alt={`${project.title} mobile preview`}
            className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-[1.02] theme-dark:group-hover:drop-shadow-[0_14px_30px_rgba(251,191,36,0.3)] theme-light:group-hover:drop-shadow-[0_14px_30px_rgba(14,165,233,0.28)] ${
              mobileLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
            onLoad={() => setMobileLoaded(true)}
          />
        </div>
      </div>

      <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
        <p className="text-sm uppercase tracking-[0.25em] text-slate-400 mb-3">
          Featured Build
        </p>
        <h3 className="text-3xl md:text-4xl font-bold mb-4">
          <span className="theme-dark:text-amber-400 theme-light:text-sky-600">
            {project.title}
          </span>
        </h3>
        <p className="text-slate-400 text-lg leading-relaxed mb-6">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-8">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full border border-white/15 bg-white/5 text-slate-200 text-xs tracking-wide transition-all duration-300 hover:bg-white/10"
            >
              {tag}
            </span>
          ))}
        </div>

        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="magnetic-btn inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-slate-50 bg-white/10 border border-white/15 hover:bg-white/15 theme-dark:hover:border-amber-300/75 theme-light:hover:border-sky-500/75 theme-dark:hover:shadow-[0_14px_34px_rgba(251,191,36,0.36)] theme-light:hover:shadow-[0_14px_34px_rgba(14,165,233,0.34)] hover:-translate-y-0.5 transition-all duration-300"
          onMouseMove={handleMagneticMove}
          onMouseLeave={handleMagneticLeave}
        >
          View Live Project
          <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h4m0 0v4m0-4l-8 8"
            />
          </svg>
        </a>
      </div>
    </article>
  )
}

export default function Projects() {
  const [sectionRef, isVisible] = useScrollAnimation({ threshold: 0.1 })

  const projects = [
    {
      title: 'ButtFoods',
      description:
        'A clean food ordering experience with responsive layouts and smooth browsing flow tailored for both desktop and mobile users.',
      desktopImage: '/Assets/Projects/buttfoods-desktop.png',
      mobileImage: '/Assets/Projects/buttfoods-mobile.png',
      url: 'https://buttfoods.vercel.app/',
      tags: ['Responsive UI', 'Frontend', 'Production Deploy'],
    },
    {
      title: 'The Forge',
      description:
        'A modern brand-focused website with sharp visuals, conversion-first layout blocks, and polished interactions across breakpoints.',
      desktopImage: '/Assets/Projects/theforge-desktop.png',
      mobileImage: '/Assets/Projects/theforge-mobile.png',
      url: 'https://the-forge2.vercel.app/',
      tags: ['Modern Design', 'Landing Experience', 'Performance Ready'],
    },
    {
      title: 'Aurelia',
      description:
        'A premium style web experience combining strong visual hierarchy with mobile-first usability and refined presentation.',
      desktopImage: '/Assets/Projects/aurelia-desktop.png',
      mobileImage: '/Assets/Projects/aurelia-mobile.png',
      url: 'https://aurelia-livid.vercel.app/',
      tags: ['Mobile First', 'Elegant UI', 'Deploy Ready'],
    },
  ]

  return (
    <section
      id="projects"
      ref={sectionRef}
      className={`min-h-screen py-20 relative transition-opacity duration-1000 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="absolute inset-0 theme-dark:bg-gradient-to-b theme-dark:from-black theme-dark:via-gray-950 theme-dark:to-black theme-light:bg-gradient-to-b theme-light:from-sky-50 theme-light:via-blue-50 theme-light:to-cyan-50"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold text-slate-50 mb-4 ${isVisible ? 'reveal-stagger' : 'opacity-0'}`} style={{ '--stagger-delay': '90ms' }}>
            Featured{' '}
            <span className="theme-dark:text-amber-400 theme-light:text-sky-600">Projects</span>
          </h2>
          <div className="w-24 h-1 theme-dark:bg-amber-400 theme-light:bg-sky-600 mx-auto mb-4"></div>
          <p className={`text-slate-400 text-lg max-w-2xl mx-auto ${isVisible ? 'reveal-stagger' : 'opacity-0'}`} style={{ '--stagger-delay': '200ms' }}>
            Handpicked work with dedicated desktop and mobile showcases.
          </p>
        </div>

        <div className="space-y-10">
          {projects.map((project, index) => (
            <ShowcaseCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
