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

function stopAmbientNodes(ambientRef) {
  if (!ambientRef.current) return

  const { source, lfo, gain, audioCtx } = ambientRef.current
  const now = audioCtx.currentTime

  gain.gain.cancelScheduledValues(now)
  gain.gain.setValueAtTime(gain.gain.value || 0.02, now)
  gain.gain.linearRampToValueAtTime(0.0001, now + 0.25)

  try {
    source.stop(now + 0.28)
  } catch {
    // Source may already be stopped.
  }
  try {
    lfo.stop(now + 0.28)
  } catch {
    // Oscillator may already be stopped.
  }

  ambientRef.current = null
}

export function SoundProvider({ children }) {
  const [enabled, setEnabled] = useState(() => localStorage.getItem(STORAGE_KEY) === 'true')
  const audioCtxRef = useRef(null)
  const ambientRef = useRef(null)
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

  const startAmbient = useCallback((options = {}) => {
    const { force = false } = options
    const ctx = ensureAudioCtx()
    if (!ctx) return false
    if ((ctx.state !== 'running' && !unlocked) || (!enabled && !force)) return false
    if (ambientRef.current) return true

    const bufferSize = ctx.sampleRate * 2
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const output = noiseBuffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i += 1) {
      output[i] = (Math.random() * 2 - 1) * 0.45
    }

    const source = ctx.createBufferSource()
    source.buffer = noiseBuffer
    source.loop = true

    const highpass = ctx.createBiquadFilter()
    highpass.type = 'highpass'
    highpass.frequency.value = 120
    highpass.Q.value = 0.65

    const lowpass = ctx.createBiquadFilter()
    lowpass.type = 'lowpass'
    lowpass.frequency.value = 980
    lowpass.Q.value = 0.55

    const gain = ctx.createGain()
    gain.gain.value = 0.0001

    const lfo = ctx.createOscillator()
    lfo.type = 'sine'
    lfo.frequency.value = 0.065

    const lfoGain = ctx.createGain()
    lfoGain.gain.value = 360

    source.connect(highpass)
    highpass.connect(lowpass)
    lowpass.connect(gain)
    gain.connect(ctx.destination)
    lfo.connect(lfoGain)
    lfoGain.connect(lowpass.frequency)

    const now = ctx.currentTime
    gain.gain.linearRampToValueAtTime(0.018, now + 1.1)

    source.start(now)
    lfo.start(now)

    ambientRef.current = { source, lfo, gain, audioCtx: ctx }
    return true
  }, [enabled, ensureAudioCtx, unlocked])

  const stopAmbient = useCallback(() => {
    stopAmbientNodes(ambientRef)
  }, [])

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

  useEffect(() => {
    if (!enabled) {
      stopAmbient()
    }
  }, [enabled, stopAmbient])

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

  const activateExperience = useCallback(async (options = {}) => {
    setEnabled(true)
    await unlock()
    const ctx = ensureAudioCtx()
    if (!ctx) return

    startAmbient({ force: true })

    const mode = options.mode || 'light'
    const isDarkMode = mode === 'dark'

    makeTone(ctx, {
      freq: isDarkMode ? 350 : 410,
      type: 'triangle',
      duration: 0.2,
      peak: 0.026,
      pan: -0.05,
    })
    makeTone(ctx, {
      freq: isDarkMode ? 540 : 620,
      type: 'sine',
      duration: 0.28,
      peak: 0.024,
      pan: 0.05,
    })
  }, [ensureAudioCtx, startAmbient, unlock])

  const value = useMemo(
    () => ({
      enabled,
      setEnabled,
      toggle: () => setEnabled((prev) => !prev),
      play,
      unlock,
      startAmbient,
      stopAmbient,
      activateExperience,
    }),
    [activateExperience, enabled, play, startAmbient, stopAmbient, unlock]
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
