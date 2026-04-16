import { useState } from "react";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

function ShowcaseCard({ project, index }) {
  const [cardRef, isVisible] = useScrollAnimation({
    threshold: 0.2,
    rootMargin: "0px 0px -80px 0px",
  });
  const desktopImages = project.desktopImages?.length
    ? project.desktopImages
    : [project.desktopImage];
  const [desktopLoaded, setDesktopLoaded] = useState(() =>
    desktopImages.map(() => false),
  );
  const [mobileLoaded, setMobileLoaded] = useState(false);
  const hasMobilePreview = Boolean(project.mobileImage);
  const hasUrl = Boolean(project.url);
  const hasDownload = Boolean(project.downloadUrl);
  const isGallery = desktopImages.length > 1;
  const isExternalDownload = Boolean(project.downloadUrl?.startsWith("http"));
  const downloadProps = isExternalDownload
    ? { target: "_blank", rel: "noopener noreferrer" }
    : { download: project.downloadFilename ?? "Tabify.exe" };

  const handleTiltMove = (e) => {
    if (window.innerWidth < 1024) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rx = (0.5 - py) * 7;
    const ry = (px - 0.5) * 9;

    card.style.setProperty("--rx", `${rx}deg`);
    card.style.setProperty("--ry", `${ry}deg`);
    card.style.setProperty("--sx", `${px * 100}%`);
    card.style.setProperty("--sy", `${py * 100}%`);
  };

  const handleTiltLeave = (e) => {
    const card = e.currentTarget;
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
    card.style.setProperty("--sx", "50%");
    card.style.setProperty("--sy", "50%");
  };

  const handleMagneticMove = (e) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
    btn.style.setProperty("--mx", `${x}px`);
    btn.style.setProperty("--my", `${y}px`);
  };

  const handleMagneticLeave = (e) => {
    const btn = e.currentTarget;
    btn.style.setProperty("--mx", "0px");
    btn.style.setProperty("--my", "0px");
  };

  const handleDesktopLoad = (idx) => {
    setDesktopLoaded((prev) => {
      if (prev[idx]) return prev;
      const next = [...prev];
      next[idx] = true;
      return next;
    });
  };

  return (
    <article
      ref={cardRef}
      className={`project-tilt group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:bg-white/10 theme-dark:hover:border-amber-300/80 theme-light:hover:border-sky-500/80 theme-dark:hover:shadow-[0_18px_42px_rgba(251,191,36,0.32)] theme-light:hover:shadow-[0_18px_42px_rgba(56,189,248,0.3)] hover:-translate-y-1 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      style={{ transitionDelay: `${index * 120}ms` }}
      onMouseMove={handleTiltMove}
      onMouseLeave={handleTiltLeave}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/18 via-transparent to-amber-400/18" />
      </div>
      <div
        className="pointer-events-none absolute -top-10 -left-6 h-24 w-24 rounded-full bg-sky-500/25 blur-3xl animate-particle-float"
        aria-hidden="true"
      ></div>
      <div
        className="pointer-events-none absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-amber-400/22 blur-3xl animate-float-slow"
        aria-hidden="true"
      ></div>

      <div className="relative">
        <div className="relative overflow-hidden rounded-t-3xl bg-slate-950/40">
          {isGallery ? (
            <div className="grid grid-cols-3 items-start gap-2 p-2">
              {desktopImages.map((image, idx) => (
                <div
                  key={`${project.title}-desktop-${idx}`}
                  className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/45"
                >
                  {!desktopLoaded[idx] && (
                    <div className="absolute inset-0 loading-shimmer"></div>
                  )}
                  <img
                    src={image}
                    alt={`${project.title} desktop preview ${idx + 1}`}
                    className={`w-full h-auto block transition-opacity duration-300 ${
                      desktopLoaded[idx] ? "opacity-100" : "opacity-0"
                    }`}
                    loading="lazy"
                    onLoad={() => handleDesktopLoad(idx)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <>
              {!desktopLoaded[0] && (
                <div className="absolute inset-0 loading-shimmer"></div>
              )}
              <img
                src={desktopImages[0]}
                alt={`${project.title} desktop preview`}
                className={`w-full h-auto block transition-opacity duration-300 ${
                  desktopLoaded[0] ? "opacity-100" : "opacity-0"
                }`}
                loading="lazy"
                onLoad={() => handleDesktopLoad(0)}
              />
            </>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/10 to-transparent" />

          {!project.hideProjectTag && (
            <div className="absolute bottom-4 left-4 flex items-center gap-2">
              <span className="inline-flex items-center justify-center rounded-full border border-white/20 bg-black/40 px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.18em] text-slate-200">
                Project {String(index + 1).padStart(2, "0")}
              </span>
            </div>
          )}

          {hasUrl && (
            <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-full bg-black/65 px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.18em] text-emerald-200 border border-emerald-400/60 shadow-lg">
              <span className="relative inline-flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400"></span>
              </span>
              Live
            </div>
          )}

          {hasMobilePreview && (
            <div className="absolute bottom-3 right-5 w-20 md:w-24 rounded-2xl overflow-hidden border border-white/25 shadow-xl backdrop-blur bg-slate-950/60">
              {!mobileLoaded && (
                <div className="absolute inset-0 loading-shimmer"></div>
              )}
              <img
                src={project.mobileImage}
                alt={`${project.title} mobile preview`}
                className={`w-full h-auto block transition-opacity duration-300 ${
                  mobileLoaded ? "opacity-100" : "opacity-0"
                }`}
                loading="lazy"
                onLoad={() => setMobileLoaded(true)}
              />
            </div>
          )}
        </div>

        <div className="pt-10 px-6 pb-6 md:px-7 md:pb-7">
          <h3 className="text-xl md:text-2xl font-semibold mb-2">
            <span className="theme-dark:text-slate-50 theme-light:text-slate-900">
              {project.title}
            </span>
          </h3>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-5">
            {project.description}
          </p>

          <div className="flex flex-wrap items-center gap-2 mb-5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full border border-white/15 bg-white/5 text-slate-200 text-[0.7rem] tracking-wide transition-all duration-300 group-hover:bg-white/10"
              >
                {tag}
              </span>
            ))}
          </div>

          {hasDownload ? (
            <a
              href={project.downloadUrl}
              {...downloadProps}
              className="hero-cta hero-cta-secondary magnetic-btn inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs md:text-sm font-semibold cursor-pointer"
              onMouseMove={handleMagneticMove}
              onMouseLeave={handleMagneticLeave}
            >
              <span className="hero-cta-sheen" aria-hidden="true"></span>
              <span className="relative z-10">Download App</span>
              <svg
                className="relative z-10 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M12 3v10m0 0l3-3m-3 3l-3-3m7 7H5"
                />
              </svg>
            </a>
          ) : hasUrl ? (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-cta hero-cta-secondary magnetic-btn inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs md:text-sm font-semibold cursor-pointer"
              onMouseMove={handleMagneticMove}
              onMouseLeave={handleMagneticLeave}
            >
              <span className="hero-cta-sheen" aria-hidden="true"></span>
              <span className="relative z-10">View Live Project</span>
              <svg
                className="relative z-10 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M13 7h4m0 0v4m0-4l-8 8"
                />
              </svg>
            </a>
          ) : (
            <div className="hero-cta hero-cta-secondary inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs md:text-sm font-semibold opacity-80 cursor-default">
              <span className="relative z-10">Case Study</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  const [sectionRef, isVisible] = useScrollAnimation({ threshold: 0.1 });

  const projects = [
    {
      title: "ButtFoods",
      description:
        "A clean food ordering experience with responsive layouts and smooth browsing flow tailored for both desktop and mobile users.",
      desktopImage: "/Assets/Projects/buttfoods-desktop.png",
      mobileImage: "/Assets/Projects/buttfoods-mobile.png",
      url: "https://buttfoods.vercel.app/",
      tags: ["Responsive UI", "Frontend", "Production Deploy"],
    },
    {
      title: "The Forge",
      description:
        "A modern brand-focused website with sharp visuals, conversion-first layout blocks, and polished interactions across breakpoints.",
      desktopImage: "/Assets/Projects/theforge-desktop.png",
      mobileImage: "/Assets/Projects/theforge-mobile.png",
      url: "https://the-forge2.vercel.app/",
      tags: ["Modern Design", "Landing Experience", "Performance Ready"],
    },
    {
      title: "Aurelia",
      description:
        "A premium style web experience combining strong visual hierarchy with mobile-first usability and refined presentation.",
      desktopImage: "/Assets/Projects/aurelia-desktop.png",
      mobileImage: "/Assets/Projects/aurelia-mobile.png",
      url: "https://aurelia-livid.vercel.app/",
      tags: ["Mobile First", "Elegant UI", "Deploy Ready"],
    },
    {
      title: "Tabify",
      description:
        "A coffee shop SaaS suite that centralizes billing, revenue tracking, and daily performance reports in one clean dashboard.",
      desktopImages: [
        "/Assets/Projects/Tabify-1.png",
        "/Assets/Projects/Tabify-2.png",
        "/Assets/Projects/Tabify-3.png",
      ],
      downloadUrl:
        "https://drive.google.com/file/d/1Vy8XnyajiG6FBrBH3JKAy_eENQDL4kky/view?usp=sharing",
      layout: "wide",
      hideProjectTag: true,
      tags: ["SaaS Dashboard", "Billing + Reports", "Revenue Insights"],
    },
    {
      title: "Face Detection App",
      description:
        "Real-time face detection and recognition system with enrollment capabilities and live recognition features. Built with advanced computer vision technology for accurate facial identification.",
      desktopImage: "/Assets/Projects/facedetection-desktop.png",
      url: "https://face-detection-app-five.vercel.app/",
      tags: ["Face Recognition", "Real-time Detection", "AI/ML"],
    },
  ];

  return (
    <section
      id="projects"
      ref={sectionRef}
      className={`min-h-screen py-20 relative transition-opacity duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="absolute inset-0 theme-dark:bg-gradient-to-b theme-dark:from-black theme-dark:via-gray-950 theme-dark:to-black theme-light:bg-gradient-to-b theme-light:from-sky-50 theme-light:via-blue-50 theme-light:to-cyan-50"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2
            className={`text-4xl md:text-5xl font-bold text-slate-50 mb-4 ${
              isVisible ? "reveal-stagger" : "opacity-0"
            }`}
            style={{ "--stagger-delay": "90ms" }}
          >
            Featured{" "}
            <span className="theme-dark:text-amber-400 theme-light:text-sky-600">
              Projects
            </span>
          </h2>
          <div className="w-24 h-1 theme-dark:bg-amber-400 theme-light:bg-sky-600 mx-auto mb-4"></div>
          <p
            className={`text-slate-400 text-lg max-w-2xl mx-auto ${
              isVisible ? "reveal-stagger" : "opacity-0"
            }`}
            style={{ "--stagger-delay": "200ms" }}
          >
            A selection of production-ready applications showcasing my expertise
            in full-stack development, intuitive UI design, and scalable
            architecture.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => (
            <div
              key={project.title}
              className={
                project.layout === "wide" ? "md:col-span-2 xl:col-span-3" : ""
              }
            >
              <ShowcaseCard project={project} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
