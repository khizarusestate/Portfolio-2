"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { ExternalLink, Download } from "lucide-react";

const PROJECTS = [
  {
    id: "aurelia",
    name: "Aurelia",
    tagline: "Luxury Hotel Experience",
    description: "Premium hotel booking platform with seamless reservations",
    color: "#DAA400",
    colorRgb: "218,164,0",
    tech: ["React", "Tailwind", "Node.js", "MongoDB"],
    link: "#view-project",
    status: "Live",
    desktopImage: "/assets/Aurelia Desktop.png",
    phoneImage: "/assets/Aurelia Phone.png",
    year: "2026",
  },
  {
    id: "butt",
    name: "Butt Foods",
    tagline: "Fast Food Revolution",
    description: "Chef-driven fast food delivery with real-time tracking",
    color: "#FFA500",
    colorRgb: "255,165,0",
    tech: ["React", "Express", "MongoDB", "Payment API"],
    link: "#view-project",
    status: "Live",
    desktopImage: "/assets/Butt Foods Dextop.png",
    phoneImage: "/assets/Buut Foods Mobile.png",
    year: "2026",
  },
  {
    id: "forge",
    name: "The Forge",
    tagline: "Fitness Reimagined",
    description: "Complete gym management and workout tracking platform",
    color: "#EF4444",
    colorRgb: "239,68,68",
    tech: ["React", "Tailwind", "Next.js", "Firebase"],
    link: "#view-project",
    status: "Live",
    desktopImage: "/assets/The Forge Desktop.png",
    phoneImage: "/assets/The Forge Mobile].png",
    year: "2026",
  },
  {
    id: "face",
    name: "Face Detection",
    tagline: "AI Vision System",
    description: "Advanced face recognition powered by machine learning",
    color: "#10B981",
    colorRgb: "16,185,129",
    tech: ["React", "TensorFlow", "Python", "WebRTC"],
    link: "#view-project",
    status: "Live",
    desktopImage: "/assets/FaceDetectionAppDesktop.png",
    phoneImage: "/assets/FaceDetectionAppMobile.png",
    year: "2026",
  },
  {
    id: "tabify",
    name: "Tabify",
    tagline: "Coffee Shop Management",
    description: "Desktop POS system for café and restaurant operations",
    color: "#3B82F6",
    colorRgb: "59,130,246",
    tech: ["Electron", "Node.js", "SQLite", "IPC"],
    link: "#download-project",
    status: "Desktop App",
    image: "/assets/Tabify-1.png",
    year: "2026",
    isDownload: true,
  },
];

// ─── Project Card with Enhanced Design ─────────────────────────────────────
function ProjectCard({ project, index, onHover }) {
  const cardRef = useRef(null);
  const contentRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Preload images
  useEffect(() => {
    const desktopImg = new Image();
    const phoneImg = new Image();
    
    let loadedCount = 0;
    const totalImages = project.phoneImage ? 2 : 1;
    
    const handleLoad = () => {
      loadedCount++;
      if (loadedCount === totalImages) {
        setImageLoaded(true);
      }
    };
    
    desktopImg.src = project.desktopImage || project.image;
    desktopImg.onload = handleLoad;
    desktopImg.onerror = handleLoad;
    
    if (project.phoneImage) {
      phoneImg.src = project.phoneImage;
      phoneImg.onload = handleLoad;
      phoneImg.onerror = handleLoad;
    }
  }, [project.desktopImage, project.phoneImage, project.image]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientY - rect.top - rect.height / 2) / 25;
    const y = (e.clientX - rect.left - rect.width / 2) / 25;

    setRotation({ x, y });
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHover(project);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
    onHover(null);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.8,
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
      viewport={{ once: true, margin: "-100px" }}
      className="relative h-[400px] md:h-[500px] rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer group shadow-2xl hover:shadow-[0_20px_40px_-15px_rgba(6,182,212,0.3)] transition-all duration-500"
      style={{
        perspective: "1400px",
        background: `linear-gradient(135deg, ${project.color}15, transparent)`,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 3D Card Container */}
      <div
        style={{
          transform: isHovered
            ? `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) translateZ(30px)`
            : "perspective(1000px) rotateX(0) rotateY(0) translateZ(0)",
          transition: "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
        className="w-full h-full"
      >
        {/* Background Images */}
        <div className="absolute inset-0">
          {/* Gradient Overlay */}
          <motion.div 
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${project.color}30, transparent, ${project.color}20)`,
            }}
            animate={{
              opacity: isHovered ? 0.3 : 0.1,
            }}
            transition={{ duration: 0.6 }}
          />
          
          {project.phoneImage ? (
            <>
              {/* Desktop Image */}
              <motion.div
                className="absolute inset-0 bg-cover bg-center rounded-t-2xl md:rounded-t-3xl"
                style={{
                  backgroundImage: imageLoaded ? `url('${project.desktopImage || project.image}')` : "none",
                  backgroundColor: imageLoaded ? "transparent" : "rgba(255,255,255,0.05)",
                  backgroundPosition: isHovered
                    ? `${(mousePos.x / 480) * 8}% ${(mousePos.y / 480) * 8}%`
                    : "center",
                  filter: isHovered ? "brightness(0.8) saturate(1.2)" : "brightness(0.6) saturate(0.8)",
                  clipPath: isHovered ? "polygon(0 0, 55% 0, 55% 100%, 0 100%)" : "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                  borderRight: isHovered ? "2px solid rgba(255,255,255,0.3)" : "none",
                }}
                transition={{ duration: 0.5 }}
              />
              {/* Phone Image */}
              <motion.div
                className="absolute inset-0 bg-cover bg-center rounded-t-2xl md:rounded-t-3xl"
                style={{
                  backgroundImage: imageLoaded ? `url('${project.phoneImage}')` : "none",
                  backgroundColor: imageLoaded ? "transparent" : "rgba(255,255,255,0.05)",
                  backgroundPosition: isHovered
                    ? `${(mousePos.x / 480) * 8}% ${(mousePos.y / 480) * 8}%`
                    : "center",
                  filter: isHovered ? "brightness(0.8) saturate(1.2)" : "brightness(0.6) saturate(0.8)",
                  clipPath: isHovered ? "polygon(55% 0, 100% 0, 100% 100%, 55% 100%)" : "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)",
                  borderLeft: isHovered ? "2px solid rgba(255,255,255,0.3)" : "none",
                }}
                transition={{ duration: 0.5 }}
              />
              {/* Divider Line */}
              <motion.div
                className="absolute top-0 bottom-0 left-[55%] w-0.5 bg-white/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
            </>
          ) : (
            <motion.div
              className="absolute inset-0 bg-cover bg-center rounded-t-2xl md:rounded-t-3xl"
              style={{
                backgroundImage: imageLoaded ? `url('${project.desktopImage || project.image}')` : "none",
                backgroundColor: imageLoaded ? "transparent" : "rgba(255,255,255,0.05)",
                backgroundPosition: isHovered
                  ? `${(mousePos.x / 480) * 12}% ${(mousePos.y / 480) * 12}%`
                  : "center",
                filter: isHovered ? "brightness(0.8) saturate(1.2)" : "brightness(0.6) saturate(0.8)",
              }}
              transition={{ duration: 0.5 }}
            />
          )}
        </div>

        {/* Image loaded indicator */}
        {!imageLoaded && (
          <motion.div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-white/5 to-white/0">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
          </motion.div>
        )}

        {/* Advanced Blur Overlay */}
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{
            background: isHovered
              ? `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, 
                  rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.95) 100%)`
              : "linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.85) 100%)",
            backdropFilter: isHovered ? "blur(2px)" : "blur(0px)",
          }}
        />

        {/* Colored Glow Accent */}
        <motion.div
          className="absolute top-0 right-0 w-64 md:w-80 h-64 md:h-80 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${project.color}44, transparent 70%)`,
            filter: "blur(50px)",
            opacity: isHovered ? 0.4 : 0.15,
            x: isHovered ? -40 : 0,
            y: isHovered ? -40 : 0,
          }}
          transition={{ duration: 0.4 }}
        />

        {/* Premium Border */}
        <div
          className="absolute inset-0 rounded-xl md:rounded-[20px] pointer-events-none transition-all duration-300"
          style={{
            border: `1.5px solid ${project.color}${isHovered ? "88" : "33"}`,
            boxShadow: isHovered
              ? `0 0 30px ${project.color}44, inset 0 0 40px ${project.color}22`
              : `0 0 20px ${project.color}22, inset 0 0 20px ${project.color}11`,
          }}
        />

        {/* Content Container */}
        <div className="absolute inset-0 flex flex-col justify-between p-4 md:p-8 z-10">
          {/* Top Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
            transition={{ duration: 0.3, delay: isHovered ? 0.1 : 0 }}
          >
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: project.color }}
              />
              <span className="text-[10px] md:text-[11px] font-bold tracking-[2px] md:tracking-[3px] text-white/60 uppercase">
                {project.year}
              </span>
            </div>
          </motion.div>

          {/* Bottom Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-gradient-to-t from-black/80 via-black/60 to-transparent">
            {/* Year Badge */}
            <motion.div
              className="absolute top-4 left-4 md:top-6 md:left-6"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: project.color }}
                />
                <span className="text-[10px] md:text-[11px] font-bold tracking-[2px] md:tracking-[3px] text-white/60 uppercase">
                  {project.year}
                </span>
              </div>
            </motion.div>

            {/* Project Name */}
            <motion.h3
              className="font-['Anton'] text-[28px] md:text-[40px] leading-[1.1] mb-2 md:mb-3 tracking-[-0.5px]"
              style={{ color: "rgb(234,234,234)" }}
              animate={{
                scale: isHovered ? 1.05 : 1,
                color: isHovered ? project.color : "rgb(234,234,234)",
                y: isHovered ? -8 : 0,
              }}
              transition={{ duration: 0.4 }}
            >
              {project.name}
            </motion.h3>

            {/* Tagline */}
            <motion.p
              className="text-[11px] md:text-[13px] tracking-[1px] md:tracking-[1.5px] text-white/50 uppercase mb-3 md:mb-4 font-semibold"
              animate={{
                opacity: isHovered ? 1 : 0.7,
                color: isHovered ? `${project.color}ee` : "rgba(255,255,255,0.4)",
              }}
              transition={{ duration: 0.4 }}
            >
              {project.tagline}
            </motion.p>

            {/* Description - Only on Hover */}
            <motion.p
              className="text-[11px] md:text-[13px] text-white/60 leading-[1.5] md:leading-[1.6] mb-4 md:mb-6 max-w-sm"
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: isHovered ? 1 : 0,
                height: isHovered ? "auto" : 0,
                marginBottom: isHovered ? "1rem" : "0",
              }}
              transition={{ duration: 0.4, delay: isHovered ? 0.1 : 0 }}
            >
              {project.description}
            </motion.p>

            {/* Tech Stack */}
            <motion.div
              className="flex flex-wrap gap-2 md:gap-3 mb-4 md:mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0.8 }}
              transition={{ duration: 0.4 }}
            >
              {project.tech.slice(0, isHovered ? 4 : 3).map((tech, i) => (
                <motion.span
                  key={tech}
                  className="text-[9px] md:text-[10px] px-3 md:px-4 py-1.5 md:py-2 rounded-full font-semibold tracking-[0.5px] md:tracking-[1px] uppercase transition-all duration-300"
                  style={{
                    background: isHovered
                      ? `${project.color}25`
                      : `rgba(${project.colorRgb},0.12)`,
                    border: `1px solid ${project.color}${isHovered ? "66" : "33"}`,
                    color: `${project.color}ee`,
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: isHovered ? 0.15 + i * 0.06 : 0,
                  }}
                  whileHover={{ scale: 1.1, y: -2 }}
                >
                  {tech}
                </motion.span>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[10px] md:text-[12px] font-bold tracking-[1.5px] md:tracking-[2px] uppercase px-4 md:px-8 py-2.5 md:py-3.5 rounded-xl transition-all duration-400 shadow-lg"
              style={{
                background: isHovered ? project.color : "rgba(255,255,255,0.05)",
                border: `2px solid ${project.color}${isHovered ? "00" : "44"}`,
                color: isHovered ? "#060606" : project.color,
                boxShadow: isHovered ? `0 10px 25px -5px ${project.color}40` : "none",
              }}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              {project.isDownload ? (
                <>
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Download size={14} />
                  </motion.div>
                  Download
                </>
              ) : (
                <>
                  <motion.div
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ExternalLink size={14} />
                  </motion.div>
                  View Project
                </>
              )}
            </motion.a>

            {/* Status Badge */}
            <motion.div
              className="absolute top-4 right-4 md:top-6 md:right-6 text-[9px] md:text-[11px] font-bold tracking-[1.5px] md:tracking-[2px] uppercase px-3 md:px-4 py-1.5 md:py-2 rounded-full backdrop-blur-md"
              style={{
                background: `${project.color}25`,
                border: `1px solid ${project.color}55`,
                color: project.color,
                boxShadow: `0 4px 15px -3px ${project.color}30`,
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: isHovered ? 1 : 0.8, scale: 1 }}
              transition={{
                duration: 0.4,
                delay: isHovered ? 0.2 : 0,
              }}
            >
              {project.status}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────
export default function Portfolio() {
  const [orbPos, setOrbPos] = useState({ x: 0, y: 0 });
  const [activeProject, setActiveProject] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setOrbPos({ x: e.clientX - 250, y: e.clientY - 250 });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      id="portfolio"
      className="relative min-h-screen w-full bg-[#060606] overflow-hidden text-[rgb(234,234,234)] py-16 md:py-32 px-4 md:px-[8%]"
      ref={containerRef}
    >
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(20px); }
        }
      `}</style>

      {/* Animated Grid Background */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 80px),
            repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 80px)
          `,
        }}
      />

      {/* Dynamic Glow Orb - Desktop only */}
      <motion.div
        className="hidden md:block fixed w-[600px] h-[600px] rounded-full pointer-events-none z-[15]"
        style={{
          left: orbPos.x,
          top: orbPos.y,
          background: activeProject
            ? `radial-gradient(circle, ${activeProject.color}44, transparent 50%)`
            : "radial-gradient(circle, rgba(255,255,255,0.05), transparent 50%)",
          filter: "blur(80px)",
          opacity: activeProject ? 0.4 : 0.2,
        }}
        animate={{
          opacity: activeProject ? 0.4 : 0.2,
        }}
        transition={{ duration: 0.4 }}
      />

      {/* Top-Left Accent Glow */}
      <div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, rgba(74,222,128,0.08), transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* Top-Right Accent Glow */}
      <div
        className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, rgba(59,130,246,0.05), transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="relative z-20">
        {/* Section Header */}
        <motion.div
          className="mb-12 md:mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
        >
          <motion.div
            className="flex items-center gap-3 mb-4 md:mb-6"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <span className="w-6 md:w-8 h-px bg-gradient-to-r from-white/40 to-transparent" />
            <span className="text-[8px] md:text-[10px] tracking-[3px] md:tracking-[4px] text-white/30 uppercase font-['Exo_2'] font-semibold">
              03 — Featured Work
            </span>
          </motion.div>

          <motion.h1
            className="font-['Anton'] text-[40px] md:text-[72px] leading-[1.05] tracking-[-1px] md:tracking-[-1.5px] mb-3 md:mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            viewport={{ once: true }}
          >
            <span className="bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
              PORTFOLIO
            </span>
          </motion.h1>

          <motion.p
            className="text-white/40 text-[11px] md:text-[14px] max-w-2xl leading-relaxed font-['Exo_2']"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
          >
            A curated collection of digital experiences designed and developed to solve real problems, deliver value, and push creative boundaries.
          </motion.p>

          <div
            className="h-px mt-4 md:mt-6"
            style={{
              background:
                "linear-gradient(to right, rgba(255,255,255,0.3), rgba(255,255,255,0.05))",
            }}
          />
        </motion.div>

        {/* Projects Grid - Responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-12">
          {PROJECTS.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              onHover={setActiveProject}
            />
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          className="mt-12 md:mt-24 pt-8 md:pt-12 border-t border-white/10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <p className="text-white/50 font-['Exo_2'] text-[11px] md:text-[13px] mb-4 md:mb-6">
            Want to see more work or discuss a project?
          </p>
          <motion.a
            href="#contact"
            className="inline-flex items-center gap-2 text-white font-['Anton'] text-[12px] md:text-[14px] tracking-[1.5px] md:tracking-[2px] uppercase"
            whileHover={{ gap: "12px", x: 4 }}
            whileTap={{ scale: 0.95 }}
          >
            Get in Touch
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              →
            </motion.span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
