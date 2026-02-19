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
            <h2 className="text-4xl md:text-5xl font-bold text-slate-50 mb-4">
              About <span className="theme-dark:text-amber-400 theme-light:text-sky-600">Me</span>
            </h2>
            <div className="w-24 h-1 theme-dark:bg-amber-400 theme-light:bg-sky-600 mx-auto"></div>
          </div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="space-y-6">
              <p className="text-slate-400 text-lg leading-relaxed">
                Hello! I'm Khizar Hayat, a MERN Stack Developer with a strong foundation
                in modern web technologies. I specialize in building full-stack applications
                from the ground up, from responsive frontends to robust backend systems.
              </p>
              <p className="text-slate-400 text-lg leading-relaxed">
                I leverage HTML5, CSS, JavaScript, React.js, Node.js, MongoDB, and Express.js
                to create scalable, performant solutions. I also integrate AI-powered coding
                tools to streamline development and deliver high-quality code efficiently.
              </p>
              <p className="text-slate-400 text-lg leading-relaxed">
                When I'm not building applications, I'm exploring new frameworks, contributing
                on GitHub, or refining my craft with the latest industry practices.
              </p>
            </div>

            {/* Skills Card */}
            <div className="relative">
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl hover:bg-white/10 transition-all duration-300">
                <h3 className="text-2xl font-bold text-slate-50 mb-6">
                  Skills & Technologies
                </h3>
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

