import { useScrollAnimation } from "../hooks/useScrollAnimation";

export default function About() {
  const [sectionRef, isVisible] = useScrollAnimation({ threshold: 0.2 });

  const skillCategories = [
    {
      category: "Frontend",
      skills: ["HTML5", "CSS", "JavaScript", "React.js", "Tailwind CSS"],
    },
    {
      category: "Backend",
      skills: ["Node.js", "Express.js", "MongoDB", "REST APIs"],
    },
    {
      category: "Desktop & Tools",
      skills: [
        "Electron.js",
        "GitHub",
        "AI Coding",
        "Version Control",
        "Performance Optimization",
      ],
    },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className={`min-h-screen flex items-center justify-center py-20 relative transition-opacity duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Background - Theme Aware */}
      <div className="absolute inset-0 theme-dark:bg-gradient-to-b theme-dark:from-black theme-dark:via-gray-950 theme-dark:to-black theme-light:bg-gradient-to-b theme-light:from-sky-50 theme-light:via-blue-50 theme-light:to-cyan-50"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Section Title - Option 7 */}
          <div className="text-center mb-16">
            <h2
              className={`text-4xl md:text-5xl font-bold text-slate-50 mb-4 ${isVisible ? "reveal-stagger" : "opacity-0"}`}
              style={{ "--stagger-delay": "90ms" }}
            >
              About{" "}
              <span className="theme-dark:text-amber-400 theme-light:text-sky-600">
                Me
              </span>
            </h2>
            <div className="w-24 h-1 theme-dark:bg-amber-400 theme-light:bg-sky-600 mx-auto"></div>
          </div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Text Content */}
            <div className="space-y-6">
              <p
                className={`text-slate-400 text-lg leading-relaxed ${isVisible ? "reveal-stagger" : "opacity-0"}`}
                style={{ "--stagger-delay": "180ms" }}
              >
                With expertise in full-stack development, I transform complex
                business requirements into elegant, scalable web solutions. I'm
                passionate about architecting clean, maintainable code across
                the entire application stack.
              </p>
              <p
                className={`text-slate-400 text-lg leading-relaxed ${isVisible ? "reveal-stagger" : "opacity-0"}`}
                style={{ "--stagger-delay": "260ms" }}
              >
                I specialize in building high-performance frontends with React
                and Tailwind CSS, paired with robust backend architectures using
                Node, Express, and MongoDB. I also develop cross-platform
                desktop applications using Electron.js. My focus is always on
                delivering production-grade applications.
              </p>
            </div>

            {/* Skills Card */}
            <div
              className={`relative ${isVisible ? "reveal-stagger" : "opacity-0"}`}
              style={{ "--stagger-delay": "250ms" }}
            >
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl hover:bg-white/10 transition-all duration-300">
                <h3 className="text-2xl font-bold text-slate-50 mb-6">
                  Skills & Technologies
                </h3>
                <div className="space-y-6">
                  {skillCategories.map((category, idx) => (
                    <div key={category.category}>
                      <h4 className="text-sm font-semibold text-slate-200 mb-3 uppercase tracking-[0.12em] theme-dark:text-amber-300 theme-light:text-sky-400">
                        {category.category}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {category.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1.5 theme-dark:bg-amber-500/15 theme-dark:border-amber-400/25 theme-light:bg-sky-500/15 theme-light:border-sky-400/25 border rounded-lg text-slate-100 text-xs font-medium backdrop-blur-sm hover:scale-105 transition-transform duration-300 cursor-default"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
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
  );
}
