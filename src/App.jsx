import Header from './Components/Header'
import Home from './Components/Home'
import About from './Components/About'
import Portfolio from './Components/Portfolio'
import Contact from './Components/Contact'

export default function App() {
  return (
    <div className="bg-[#060606] text-white overflow-x-hidden">
      <Header />
      <Home />
      <About />
      <Portfolio />
      <Contact />
      
      {/* Footer - Optional */}
      <footer className="bg-black/50 border-t border-white/10 py-8 px-6 md:px-[8%]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[11px] md:text-[12px] text-white/40 tracking-[2px] uppercase font-['Exo_2']">
            © 2026 Khizar Hayat. All rights reserved.
          </p>
          <p className="text-[11px] md:text-[12px] text-white/30 tracking-[1px] font-['Exo_2']">
            Crafted with precision and passion
          </p>
        </div>
      </footer>
    </div>
  )
}
