import { useSound } from '../context/SoundContext'
import { useTheme } from '../context/ThemeContext'

export default function SoundToggle() {
  const { enabled, toggle, unlock, play } = useSound()
  const { isDark } = useTheme()

  const handleClick = async () => {
    await unlock()
    toggle()
    if (!enabled) {
      play('click', { mode: isDark ? 'dark' : 'light' })
    }
  }

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-8 right-24 z-50 w-14 h-14 rounded-full backdrop-blur-xl bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110 shadow-lg group cursor-pointer"
      aria-label={enabled ? 'Disable sound effects' : 'Enable sound effects'}
      title={enabled ? 'Sound: On' : 'Sound: Off'}
    >
      {enabled ? (
        <svg className="w-6 h-6 theme-dark:text-amber-300 theme-light:text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5 6 9H3v6h3l5 4V5Zm4.5 3.5a5 5 0 0 1 0 7m2.5-9.5a8 8 0 0 1 0 12" />
        </svg>
      ) : (
        <svg className="w-6 h-6 text-slate-400 theme-light:text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5 6 9H3v6h3l5 4V5Zm9 9-4-4m0 4 4-4" />
        </svg>
      )}
    </button>
  )
}
