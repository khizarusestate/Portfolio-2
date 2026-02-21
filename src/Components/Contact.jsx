import { useState } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

export default function Contact() {
  const [sectionRef, isVisible] = useScrollAnimation({ threshold: 0.2 })
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [submitState, setSubmitState] = useState('idle')
  const [statusMessage, setStatusMessage] = useState('')

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

  const handleChange = (e) => {
    if (submitState !== 'idle') {
      setSubmitState('idle')
      setStatusMessage('')
    }

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitState('submitting')
    setStatusMessage('')

    try {
      const isEmailValid = /\S+@\S+\.\S+/.test(formData.email)
      if (!isEmailValid) {
        throw new Error('Please enter a valid email address.')
      }

      const response = await fetch('https://portfolio2-server.vercel.app/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      let payload = null
      try {
        payload = await response.json()
      } catch {
        payload = null
      }

      if (!response.ok) {
        if (response.status >= 500) {
          throw new Error('Server error. Please try again in a moment.')
        }
        throw new Error(payload?.message || 'Unable to send your message. Please check your details.')
      }

      setSubmitState('success')
      setStatusMessage(payload?.message || 'Thanks! Your message has been sent successfully.')
      setFormData({ name: '', email: '', message: '' })
    } catch (error) {
      const isConnectionError =
        error?.name === 'TypeError' ||
        /network|fetch|failed/i.test(error?.message || '')

      setSubmitState('error')
      setStatusMessage(
        isConnectionError
          ? 'Connection error. Please check if server is running on localhost:5000.'
          : error.message || 'Unable to send your message. Please try again.'
      )
    }
  }

  const socialLinks = [
    {
      name: 'GitHub',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      ),
      url: 'https://github.com/khizarusestate',
    },
    {
      name: 'LinkedIn',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
      url: 'https://www.linkedin.com/in/khizar-hayat-5a604938b',
    },
    {
      name: 'Email',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      url: 'mailto:khizarusestate@gmail.com',
    },
  ]

  return (
    <section
      id="contact"
      ref={sectionRef}
      className={`scroll-mt-28 md:scroll-mt-32 min-h-screen flex items-center justify-center py-20 relative transition-opacity duration-1000 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Background - Theme Aware */}
      <div className="absolute inset-0 theme-dark:bg-gradient-to-b theme-dark:from-black theme-dark:via-gray-950 theme-dark:to-black theme-light:bg-gradient-to-b theme-light:from-sky-50 theme-light:via-blue-50 theme-light:to-cyan-50"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Section Title - Option 7 */}
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold text-slate-50 mb-4 ${isVisible ? 'reveal-stagger' : 'opacity-0'}`} style={{ '--stagger-delay': '80ms' }}>
              Get In <span className="theme-dark:text-amber-400 theme-light:text-sky-600">Touch</span>
            </h2>
            <div className="w-24 h-1 theme-dark:bg-amber-400 theme-light:bg-sky-600 mx-auto mb-4"></div>
            <p className={`text-slate-400 text-lg max-w-2xl mx-auto ${isVisible ? 'reveal-stagger' : 'opacity-0'}`} style={{ '--stagger-delay': '190ms' }}>
              Have a project in mind or just want to chat? Feel free to reach
              out!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className={`backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl ${isVisible ? 'reveal-stagger' : 'opacity-0'}`} style={{ '--stagger-delay': '250ms' }}>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-slate-400 mb-2 font-medium"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-slate-50 placeholder-slate-500 theme-dark:focus:border-amber-400 theme-dark:focus:ring-amber-400/20 theme-light:focus:border-sky-600 theme-light:focus:ring-sky-600/20 focus:outline-none focus:ring-2 transition-all duration-300"
                    placeholder="Your Name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-slate-400 mb-2 font-medium"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-slate-50 placeholder-slate-500 theme-dark:focus:border-amber-400 theme-dark:focus:ring-amber-400/20 theme-light:focus:border-sky-600 theme-light:focus:ring-sky-600/20 focus:outline-none focus:ring-2 transition-all duration-300"
                    placeholder="you@gmail.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-slate-400 mb-2 font-medium"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-slate-50 placeholder-slate-500 theme-dark:focus:border-amber-400 theme-dark:focus:ring-amber-400/20 theme-light:focus:border-sky-600 theme-light:focus:ring-sky-600/20 focus:outline-none focus:ring-2 transition-all duration-300 resize-none"
                    placeholder="Your Message"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitState === 'submitting'}
                  className={`magnetic-btn group relative w-full px-8 py-4 border-2 border-slate-400/30 rounded-full font-semibold text-slate-50 backdrop-blur-sm bg-white/5 overflow-hidden transition-all duration-300 ${
                    submitState === 'submitting'
                      ? 'opacity-70 cursor-not-allowed'
                      : 'hover:bg-white/15 theme-dark:hover:border-amber-300/80 theme-light:hover:border-sky-500/80 theme-dark:hover:shadow-[0_14px_36px_rgba(251,191,36,0.45)] theme-light:hover:shadow-[0_14px_36px_rgba(14,165,233,0.42)] hover:-translate-y-0.5'
                  }`}
                  onMouseMove={handleMagneticMove}
                  onMouseLeave={handleMagneticLeave}
                  onClick={(e) => {
                    if (submitState === 'submitting') return
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
                >
                  <span className="relative z-10 inline-flex items-center gap-2">
                    {submitState === 'submitting' && (
                      <span className="inline-block h-4 w-4 rounded-full border-2 border-slate-50/30 border-t-slate-50 animate-spin"></span>
                    )}
                    {submitState === 'submitting' ? 'Sending...' : 'Send Message'}
                  </span>
                </button>

                {statusMessage && (
                  <p
                    className={`text-sm ${
                      submitState === 'success'
                        ? 'text-emerald-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {statusMessage}
                  </p>
                )}
              </form>
            </div>

            {/* Social Links & Info */}
            <div className={`space-y-8 ${isVisible ? 'reveal-stagger' : 'opacity-0'}`} style={{ '--stagger-delay': '360ms' }}>
              {/* Social Links */}
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
                <h3 className="text-2xl font-bold text-slate-50 mb-6">
                  Connect With Me
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/15 theme-dark:hover:border-amber-300/70 theme-light:hover:border-sky-500/70 theme-dark:hover:shadow-[0_12px_30px_rgba(251,191,36,0.34)] theme-light:hover:shadow-[0_12px_30px_rgba(14,165,233,0.32)] hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer"
                    >
                      <div className="theme-dark:text-amber-400 theme-light:text-sky-600 group-hover:scale-105 transition-transform duration-300">
                        {social.icon}
                      </div>
                      <span className="text-slate-400 group-hover:text-slate-50 font-medium">
                        {social.name}
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
                <h3 className="text-2xl font-bold text-slate-50 mb-6">
                  Let's Work Together
                </h3>
                <p className="text-slate-400 leading-relaxed mb-4">
                  I'm always open to discussing new projects, creative ideas, or
                  opportunities to be part of your vision.
                </p>
                <div className="space-y-3">
                  <a
                    href="mailto:khizarusestate@gmail.com"
                    className="group flex items-start gap-3 theme-dark:text-slate-300 theme-light:text-sky-700 hover:text-slate-200 transition-all duration-300 p-3 rounded-lg border border-transparent hover:bg-white/5 theme-dark:hover:border-amber-400/40 theme-light:hover:border-sky-600/40"
                  >
                    <svg
                      className="w-5 h-5 mt-0.5 shrink-0 theme-dark:text-amber-400 theme-light:text-sky-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="min-w-0 break-all group-hover:underline">Mail me</span>
                  </a>
                  <a
                    href="tel:+923277522098"
                    className="group flex items-start gap-3 theme-dark:text-slate-300 theme-light:text-sky-700 hover:text-slate-200 transition-all duration-300 p-3 rounded-lg border border-transparent hover:bg-white/5 theme-dark:hover:border-amber-400/40 theme-light:hover:border-sky-600/40"
                  >
                    <svg
                      className="w-5 h-5 mt-0.5 shrink-0 theme-dark:text-amber-400 theme-light:text-sky-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h2.28a2 2 0 011.9 1.37l1.1 3.3a2 2 0 01-.45 2.08l-1.27 1.27a16 16 0 006.36 6.36l1.27-1.27a2 2 0 012.08-.45l3.3 1.1A2 2 0 0121 18.72V21a2 2 0 01-2 2h-1C9.72 23 1 14.28 1 4V3h2z"
                      />
                    </svg>
                    <span className="min-w-0 break-words group-hover:underline">Contact me</span>
                  </a>
                  <a
                    href="https://maps.google.com/?q=Gujranwala+Punjab+Pakistan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-3 theme-dark:text-slate-300 theme-light:text-sky-700 hover:text-slate-200 transition-all duration-300 p-3 rounded-lg border border-transparent hover:bg-white/5 theme-dark:hover:border-amber-400/40 theme-light:hover:border-sky-600/40"
                  >
                    <svg
                      className="w-5 h-5 mt-0.5 shrink-0 theme-dark:text-amber-400 theme-light:text-sky-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="min-w-0 break-words group-hover:underline">Visit me</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
