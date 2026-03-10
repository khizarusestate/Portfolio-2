import { useScrollAnimation } from '../hooks/useScrollAnimation'

export default function About() {
  const [sectionRef, isVisible] = useScrollAnimation({ threshold: 0.2 })
  const skills = [
    'HTML5',
    'CSS',
    'JavaScript',
    'Tailwind CSS',
    'React.js',
    'Node.js',
    'MongoDB',
    'Express.js',
    'GitHub',
    'AI Coding',
  ]

  return (
    <section
      id="about"
      ref={sectionRef}
      className={`min-h-screen flex items-center justify-center py-20 relative transition-opacity duration-1000 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Background - Theme Aware */}
      <div className="absolute inset-0 theme-dark:bg-gradient-to-b theme-dark:from-black theme-dark:via-gray-950 theme-dark:to-black theme-light:bg-gradient-to-b theme-light:from-sky-50 theme-light:via-blue-50 theme-light:to-cyan-50"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Section Title - Option 7 */}
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold text-slate-50 mb-4 ${isVisible ? 'reveal-stagger' : 'opacity-0'}`} style={{ '--stagger-delay': '90ms' }}>
              About <span className="theme-dark:text-amber-400 theme-light:text-sky-600">Me</span>
            </h2>
            <div className="w-24 h-1 theme-dark:bg-amber-400 theme-light:bg-sky-600 mx-auto"></div>
          </div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Text Content */}
            <div className="space-y-6">
              <p
                className={`text-slate-400 text-lg leading-relaxed ${isVisible ? 'reveal-stagger' : 'opacity-0'}`}
                style={{ '--stagger-delay': '180ms' }}
              >
                I'm a self-taught MERN developer who enjoys turning ideas into fast,
                modern web apps. From responsive UIs to clean backend APIs, I like
                owning the full flow of a project.
              </p>
              <p
                className={`text-slate-400 text-lg leading-relaxed ${isVisible ? 'reveal-stagger' : 'opacity-0'}`}
                style={{ '--stagger-delay': '260ms' }}
              >
                Recently I've been focusing on building premium-feel frontends with
                React and Tailwind, while keeping Node, Express, and MongoDB
                structured and production-ready behind the scenes.
              </p>
              <div
                className={`grid sm:grid-cols-2 gap-4 ${isVisible ? 'reveal-stagger' : 'opacity-0'}`}
                style={{ '--stagger-delay': '340ms' }}
              >
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4">
                  <h3 className="text-sm font-semibold text-slate-100 mb-2 uppercase tracking-[0.16em]">
                    What I do
                  </h3>
                  <ul className="space-y-1.5 text-sm text-slate-400">
                    <li>Landing pages & marketing sites</li>
                    <li>Full-stack MERN dashboards</li>
                    <li>UI polish, animation & UX</li>
                  </ul>
                </div>
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4">
                  <h3 className="text-sm font-semibold text-slate-100 mb-2 uppercase tracking-[0.16em]">
                    Currently
                  </h3>
                  <ul className="space-y-1.5 text-sm text-slate-400">
                    <li>Improving performance & code quality</li>
                    <li>Learning advanced React patterns</li>
                    <li>Open to MERN freelance work</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Skills Card */}
            <div
              className={`relative ${isVisible ? 'reveal-stagger' : 'opacity-0'}`}
              style={{ '--stagger-delay': '250ms' }}
            >
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl hover:bg-white/10 transition-all duration-300">
                <h3 className="text-2xl font-bold text-slate-50 mb-4">
                  Skills & Technologies
                </h3>
                <p className="text-sm text-slate-400 mb-4">
                  Tools I use to design, build, and ship full-stack products:
                </p>
                <div className="flex flex-wrap gap-3">
                  {skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 theme-dark:bg-amber-500/20 theme-dark:border-amber-400/30 theme-light:bg-sky-500/20 theme-light:border-sky-400/30 border rounded-full text-slate-50 text-sm font-medium backdrop-blur-sm hover:scale-110 transition-transform duration-300 cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 theme-dark:bg-amber-400/20 theme-light:bg-sky-400/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 theme-dark:bg-amber-300/20 theme-light:bg-sky-300/20 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
