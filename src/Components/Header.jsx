import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu, X, ChevronRight } from "lucide-react";

const navLinks = ["Home", "About", "Portfolio", "Contact"];

export default function Header() {
  const [active, setActive] = useState("Home");
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // Scroll effect for header
      setScrolled(window.scrollY > 20);

      // Calculate scroll progress
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const progress = docHeight > 0 ? (scrolled / docHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (link) => {
    setActive(link);
    setMobileMenuOpen(false);
    
    // Smooth scroll to section
    const element = document.getElementById(link.toLowerCase());
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 z-[60]"
        style={{ width: `${scrollProgress}%` }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />

      <motion.nav
        className={`h-16 md:h-[70px] w-full fixed top-0 z-50 flex justify-between items-center px-6 md:px-8 transition-all duration-500 ${
          scrolled
            ? "bg-black/70 backdrop-blur-[18px] border-b border-white/[0.06] shadow-lg"
            : "bg-transparent"
        }`}
        initial={{ y: "-100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Logo */}
        <motion.div
          className="text-xl md:text-2xl font-bold text-white font-['Anton'] tracking-tight"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        />

        {/* Desktop Links */}
        <ul className="hidden md:flex gap-8 lg:gap-10">
          {navLinks.map((item, i) => (
            <motion.li
              key={item}
              className="relative cursor-pointer list-none"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 + i * 0.15, duration: 0.5 }}
            >
              <motion.button
                onClick={() => handleNavClick(item)}
                className={`font-['Exo_2'] font-semibold text-[13px] tracking-[2.5px] uppercase transition-colors duration-300 pb-1 relative ${
                  active === item
                    ? "text-[rgb(234,234,234)]"
                    : "text-[rgb(130,130,130)] hover:text-[rgb(234,234,234)]"
                }`}
                whileHover={{ y: -2 }}
              >
                {item}

                {/* Active / hover dot indicator */}
                <motion.span
                  className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-[4px] h-[4px] rounded-full bg-[rgb(234,234,234)]"
                  animate={{ scale: active === item ? 1 : 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                />
              </motion.button>
            </motion.li>
          ))}
        </ul>

        {/* Desktop CTA Button */}
        <motion.button
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.5 }}
          onClick={() => handleNavClick("Contact")}
          className="hidden md:flex items-center gap-2 font-['Exo_2'] font-bold text-[11px] tracking-[2px] uppercase px-4 md:px-6 py-2 rounded-lg border border-white/25 text-[rgb(234,234,234)] hover:bg-white/[0.08] hover:border-white/50 hover:scale-[1.04] transition-all duration-250 group"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.96 }}
        >
          Hire Me
          <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </motion.button>

        {/* Mobile Menu Button */}
        <motion.button
          className="md:hidden text-[rgb(234,234,234)] hover:text-white transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden fixed top-16 left-0 right-0 bg-black/95 backdrop-blur-lg border-b border-white/[0.06] z-40"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 py-4 space-y-3">
              {navLinks.map((item, i) => (
                <motion.button
                  key={item}
                  onClick={() => handleNavClick(item)}
                  className={`w-full text-left font-['Exo_2'] font-semibold text-[13px] tracking-[2px] uppercase py-3 px-4 rounded-lg transition-colors ${
                    active === item
                      ? "bg-white/10 text-[rgb(234,234,234)]"
                      : "text-[rgb(130,130,130)] hover:text-[rgb(234,234,234)] hover:bg-white/5"
                  }`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  {item}
                </motion.button>
              ))}
              <motion.button
                onClick={() => handleNavClick("Contact")}
                className="w-full mt-4 font-['Exo_2'] font-bold text-[11px] tracking-[2px] uppercase px-4 py-3 rounded-lg border border-white/25 text-[rgb(234,234,234)] hover:bg-white/[0.08] hover:border-white/50 transition-all"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                Hire Me
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

import { AnimatePresence } from "framer-motion";
