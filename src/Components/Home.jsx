import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Code, Briefcase, Mail, ChevronDown, Download, Terminal, Palette, Globe } from "lucide-react";


const TOTAL = 110;
const CONNECT_DIST = 130;
const MOUSE_DIST = 160;

export default function Home() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animRef = useRef(null);
  const cursorRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Custom cursor
  useEffect(() => {
    if (isMobile) return;

    const cursor = cursorRef.current;
    const dot = document.querySelector('.cursor-dot');

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (cursor) {
        cursor.style.transform = `translate(${e.clientX - 12}px, ${e.clientY - 12}px)`;
      }
      if (dot) {
        dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };

    const handleMouseEnter = () => {
      if (cursor) cursor.style.opacity = '1';
      if (dot) dot.style.opacity = '1';
    };

    const handleMouseLeave = () => {
      if (cursor) cursor.style.opacity = '0';
      if (dot) dot.style.opacity = '0';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const hero = canvas.parentElement;

    const resize = () => {
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
      mouseRef.current = {
        x: canvas.width * 0.65,
        y: canvas.height * 0.5,
      };
    };

    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e) => {
      const r = hero.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - r.left,
        y: e.clientY - r.top,
      };
    };

    hero.addEventListener("mousemove", onMouseMove);

    const particles = Array.from({ length: TOTAL }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.4 + 0.4,
      opacity: Math.random() * 0.5 + 0.15,
    }));

    const draw = () => {
      const { x: mx, y: my } = mouseRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < TOTAL; i++) {
        const p = particles[i];

        const dx = p.x - mx;
        const dy = p.y - my;
        const d = Math.sqrt(dx * dx + dy * dy);

        if (d < MOUSE_DIST) {
          const force = ((MOUSE_DIST - d) / MOUSE_DIST) * 0.018;
          p.vx += (dx / d) * force;
          p.vy += (dy / d) * force;
        }

        p.vx *= 0.98;
        p.vy *= 0.98;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220,220,220,${p.opacity})`;
        ctx.fill();

        for (let j = i + 1; j < TOTAL; j++) {
          const q = particles[j];
          const ex = p.x - q.x;
          const ey = p.y - q.y;
          const ed = Math.sqrt(ex * ex + ey * ey);

          if (ed < CONNECT_DIST) {
            const alpha = (1 - ed / CONNECT_DIST) * 0.18;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(200,200,200,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        if (d < MOUSE_DIST) {
          const alpha = (1 - d / MOUSE_DIST) * 0.35;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mx, my);
          ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      hero.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animRef.current);
    };
  }, [isMobile]);

  return (
    <>
      <style>{`
        /* Custom Scrollbar Styles */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #06b6d4, #8b5cf6);
          border-radius: 4px;
          transition: all 0.3s ease;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #0891b2, #7c3aed);
        }
        ::-webkit-scrollbar-corner {
          background: rgba(255, 255, 255, 0.05);
        }
        
        /* Firefox scrollbar */
        * {
          scrollbar-width: thin;
          scrollbar-color: #06b6d4 rgba(255, 255, 255, 0.05);
        }
      `}</style>
      <section
        id="home"
        className="h-screen w-screen bg-[#060606] relative overflow-hidden flex items-center pt-16 md:pt-0"
      >
      {/* Custom Cursor */}
      {!isMobile && (
        <>
          <div
            ref={cursorRef}
            className="fixed w-6 h-6 pointer-events-none z-[9999] transition-transform duration-100 ease-out"
            style={{ opacity: 0 }}
          >
            <div className="relative w-full h-full">
              <div className="absolute inset-0 border-2 border-cyan-400 rounded-full animate-pulse" />
              <div className="absolute inset-1 bg-cyan-400/20 rounded-full" />
              <div className="absolute inset-2 border border-cyan-300 rounded-full" />
            </div>
          </div>
          <div
            className="fixed w-1 h-1 bg-cyan-400 rounded-full pointer-events-none z-[9998] transition-transform duration-75 ease-out cursor-dot"
            style={{ opacity: 0 }}
          />
        </>
      )}

      {!isMobile && (
        <canvas ref={canvasRef} className="absolute inset-0 z-[1]" />
      )}

      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 70% 50%, transparent 30%, #060606 100%)",
        }}
      />

      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, #060606 0%, transparent 40%)",
        }}
      />

      <div
        className="absolute inset-0 z-[3] opacity-[0.025] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url('https://grainy-gradients.vercel.app/noise.svg')",
        }}
      />

      {/* Download CV Button */}
      <motion.div
        className="fixed top-6 left-6 z-20"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2, duration: 0.6 }}
      >
        <a
          href="/CV.pdf"
          download="CV.pdf"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-sm border border-cyan-400/30 rounded-lg text-white hover:from-cyan-500/40 hover:to-purple-500/40 hover:border-cyan-400/50 transition-all duration-300 group shadow-lg hover:shadow-cyan-500/25 hover:scale-105"
        >
          <Download size={16} className="transition-transform duration-300 group-hover:translate-y-1" />
          <span className="text-sm font-medium transition-all duration-300 group-hover:tracking-wider">Download CV</span>
        </a>
      </motion.div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between w-full h-full px-6 md:px-[8%]">
        <motion.article
          className="w-full lg:w-1/2 py-12 md:py-20"
          initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: 1.6 }}
        >
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            className="text-white/60 font-['Exo_2'] text-sm md:text-base tracking-wider uppercase"
          >
            Hello, I'm
          </motion.div>
          
          <motion.h1 
            className="text-[48px] md:text-[76px] text-white font-bold leading-tight"
            style={{ fontFamily: "Anton, sans-serif" }}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2, duration: 0.8 }}
          >
            KHIZAR HAYAT
          </motion.h1>

          <motion.div
            className="text-xl md:text-2xl text-white/80 font-['Exo_2']"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 0.6 }}
          >
            Software Engineer & Creative Developer
          </motion.div>

          <motion.p
            className="text-base md:text-lg text-white/60 font-['Exo_2'] max-w-lg leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.4, duration: 0.6 }}
          >
            Passionate about creating exceptional digital experiences with modern technologies. 
            Specialized in React, Node.js, and crafting intuitive user interfaces that delight and inspire.
          </motion.p>

          <motion.div
            className="flex gap-4 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.6, duration: 0.6 }}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-sm border border-cyan-400/30 rounded-lg flex items-center justify-center text-white hover:from-cyan-500/30 hover:to-blue-500/30 transition-all duration-300 hover:scale-110 group">
              <Code size={20} className="group-hover:rotate-12 transition-transform" />
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-400/30 rounded-lg flex items-center justify-center text-white hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 hover:scale-110 group">
              <Terminal size={20} className="group-hover:rotate-12 transition-transform" />
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-400/30 rounded-lg flex items-center justify-center text-white hover:from-green-500/30 hover:to-emerald-500/30 transition-all duration-300 hover:scale-110 group">
              <Globe size={20} className="group-hover:rotate-12 transition-transform" />
            </div>
          </motion.div>
        </div>
      </motion.article>

        {/* Right Side Content */}
        <motion.div
          className="w-full lg:w-1/2 py-12 md:py-20 lg:pl-12"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 2 }}
        >
          <div className="space-y-8">

            {/* Achievement Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3, duration: 0.6 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-white/80 font-['Exo_2']">Core Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {['React', 'Node.js', 'TypeScript', 'Tailwind', 'MongoDB'].map((tech, index) => (
                  <motion.span
                    key={tech}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 3.1 + index * 0.1, duration: 0.4 }}
                    className="px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-xs text-white/80 font-['Exo_2'] hover:bg-white/20 transition-colors"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.5, duration: 0.6 }}
              className="pt-4"
            >
              <p className="text-white/60 font-['Exo_2'] text-sm leading-relaxed">
                Let's build something amazing together! I'm always excited to take on new challenges and create innovative solutions.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 right-8 text-white/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 0.6 }}
      >
        <ChevronDown size={24} className="animate-bounce" />
      </motion.div>
    </section>
    </>
  );
}