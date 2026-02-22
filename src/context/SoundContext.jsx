import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

const STORAGE_KEY = 'portfolio-sound-enabled'
const SoundContext = createContext(null)

function envelopeGain(gainNode, audioCtx, attack, decay, sustain, release, peak = 0.08) {
  const now = audioCtx.currentTime
  gainNode.gain.cancelScheduledValues(now)
  gainNode.gain.setValueAtTime(0.0001, now)
  gainNode.gain.linearRampToValueAtTime(peak, now + attack)
  gainNode.gain.linearRampToValueAtTime(peak * sustain, now + attack + decay)
  gainNode.gain.linearRampToValueAtTime(0.0001, now + attack + decay + release)
}

function makeTone(audioCtx, {
  freq = 440,
  type = 'sine',
  duration = 0.2,
  peak = 0.07,
  detune = 0,
  pan = 0,
}) {
  const osc = audioCtx.createOscillator()
  const gain = audioCtx.createGain()
  const panner = audioCtx.createStereoPanner()

  osc.type = type
  osc.frequency.value = freq
  osc.detune.value = detune
  panner.pan.value = pan

  osc.connect(gain)
  gain.connect(panner)
  panner.connect(audioCtx.destination)

  envelopeGain(gain, audioCtx, 0.01, 0.04, 0.52, Math.max(0.08, duration - 0.05), peak)

  const now = audioCtx.currentTime
  osc.start(now)
  osc.stop(now + duration)
}

export function SoundProvider({ children }) {
  const [enabled, setEnabled] = useState(() => localStorage.getItem(STORAGE_KEY) === 'true')
  const audioCtxRef = useRef(null)
  const [unlocked, setUnlocked] = useState(false)

  const ensureAudioCtx = useCallback(() => {
    if (typeof window === 'undefined') return null
    if (!audioCtxRef.current) {
      const Ctor = window.AudioContext || window.webkitAudioContext
      if (!Ctor) return null
      audioCtxRef.current = new Ctor()
    }
    return audioCtxRef.current
  }, [])

  const unlock = useCallback(async () => {
    const ctx = ensureAudioCtx()
    if (!ctx) return
    if (ctx.state === 'suspended') {
      try {
        await ctx.resume()
      } catch {
        return
      }
    }
    setUnlocked(true)
  }, [ensureAudioCtx])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, enabled ? 'true' : 'false')
  }, [enabled])

  useEffect(() => {
    const onFirstInput = () => {
      unlock()
      window.removeEventListener('pointerdown', onFirstInput)
      window.removeEventListener('touchstart', onFirstInput)
      window.removeEventListener('keydown', onFirstInput)
    }
    window.addEventListener('pointerdown', onFirstInput, { passive: true })
    window.addEventListener('touchstart', onFirstInput, { passive: true })
    window.addEventListener('keydown', onFirstInput)
    return () => {
      window.removeEventListener('pointerdown', onFirstInput)
      window.removeEventListener('touchstart', onFirstInput)
      window.removeEventListener('keydown', onFirstInput)
    }
  }, [unlock])

  const play = useCallback((name, options = {}) => {
    if (!enabled) return
    const ctx = ensureAudioCtx()
    if (!ctx || (ctx.state !== 'running' && !unlocked)) return

    const mode = options.mode || 'light'
    const isDarkMode = mode === 'dark'

    switch (name) {
      case 'milestone': {
        makeTone(ctx, {
          freq: isDarkMode ? 460 : 520,
          type: 'triangle',
          duration: 0.16,
          peak: 0.035,
          pan: 0.08,
        })
        makeTone(ctx, {
          freq: isDarkMode ? 690 : 780,
          type: 'sine',
          duration: 0.13,
          peak: 0.026,
          pan: -0.08,
        })
        break
      }
      case 'complete': {
        makeTone(ctx, {
          freq: isDarkMode ? 390 : 440,
          type: 'sine',
          duration: 0.22,
          peak: 0.035,
          pan: -0.05,
        })
        makeTone(ctx, {
          freq: isDarkMode ? 585 : 660,
          type: 'triangle',
          duration: 0.26,
          peak: 0.03,
          pan: 0.05,
        })
        break
      }
      case 'theme-toggle': {
        makeTone(ctx, {
          freq: isDarkMode ? 300 : 680,
          type: 'triangle',
          duration: 0.14,
          peak: 0.03,
        })
        makeTone(ctx, {
          freq: isDarkMode ? 510 : 920,
          type: 'sine',
          duration: 0.1,
          peak: 0.02,
        })
        break
      }
      case 'click': {
        makeTone(ctx, {
          freq: isDarkMode ? 260 : 360,
          type: 'square',
          duration: 0.08,
          peak: 0.018,
        })
        break
      }
      default:
        break
    }
  }, [enabled, ensureAudioCtx, unlocked])

  const value = useMemo(
    () => ({
      enabled,
      setEnabled,
      toggle: () => setEnabled((prev) => !prev),
      play,
      unlock,
    }),
    [enabled, play, unlock]
  )

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
}

export function useSound() {
  const ctx = useContext(SoundContext)
  if (!ctx) {
    throw new Error('useSound must be used within SoundProvider')
  }
  return ctx
}
