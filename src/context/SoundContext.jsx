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

function makeNoiseBurst(audioCtx, {
  duration = 0.04,
  peak = 0.016,
  highpassFreq = 1100,
  lowpassFreq = 6200,
}) {
  const frameCount = Math.max(1, Math.floor(audioCtx.sampleRate * duration))
  const noiseBuffer = audioCtx.createBuffer(1, frameCount, audioCtx.sampleRate)
  const output = noiseBuffer.getChannelData(0)
  for (let i = 0; i < frameCount; i += 1) {
    output[i] = Math.random() * 2 - 1
  }

  const source = audioCtx.createBufferSource()
  source.buffer = noiseBuffer

  const highpass = audioCtx.createBiquadFilter()
  highpass.type = 'highpass'
  highpass.frequency.value = highpassFreq

  const lowpass = audioCtx.createBiquadFilter()
  lowpass.type = 'lowpass'
  lowpass.frequency.value = lowpassFreq

  const gain = audioCtx.createGain()
  const now = audioCtx.currentTime
  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.exponentialRampToValueAtTime(peak, now + 0.006)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)

  source.connect(highpass)
  highpass.connect(lowpass)
  lowpass.connect(gain)
  gain.connect(audioCtx.destination)

  source.start(now)
  source.stop(now + duration + 0.005)
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
      case 'click': {
        makeNoiseBurst(ctx, {
          duration: 0.032,
          peak: isDarkMode ? 0.02 : 0.018,
          highpassFreq: isDarkMode ? 1200 : 1400,
          lowpassFreq: 6500,
        })
        makeTone(ctx, {
          freq: isDarkMode ? 430 : 510,
          type: 'triangle',
          duration: 0.075,
          peak: 0.02,
          pan: -0.04,
          detune: -4,
        })
        makeTone(ctx, {
          freq: isDarkMode ? 900 : 1030,
          type: 'sine',
          duration: 0.11,
          peak: 0.015,
          pan: 0.04,
          detune: 3,
        })
        break
      }
      case 'reveal': {
        makeNoiseBurst(ctx, {
          duration: 0.048,
          peak: isDarkMode ? 0.014 : 0.012,
          highpassFreq: 900,
          lowpassFreq: 5400,
        })
        makeTone(ctx, {
          freq: isDarkMode ? 500 : 560,
          type: 'sine',
          duration: 0.18,
          peak: 0.016,
          pan: -0.05,
        })
        makeTone(ctx, {
          freq: isDarkMode ? 760 : 860,
          type: 'triangle',
          duration: 0.22,
          peak: 0.014,
          pan: 0.05,
          detune: 6,
        })
        makeTone(ctx, {
          freq: isDarkMode ? 1080 : 1240,
          type: 'sine',
          duration: 0.13,
          peak: 0.008,
          pan: 0,
        })
        break
      }
      case 'theme-toggle':
        makeNoiseBurst(ctx, {
          duration: 0.028,
          peak: 0.012,
          highpassFreq: 1300,
          lowpassFreq: 7000,
        })
        makeTone(ctx, {
          freq: isDarkMode ? 480 : 560,
          type: 'triangle',
          duration: 0.1,
          peak: 0.014,
        })
        break
      default:
        break
    }
  }, [enabled, ensureAudioCtx, unlocked])

  const activateExperience = useCallback(async (options = {}) => {
    setEnabled(true)
    await unlock()
    play('click', options)
  }, [play, unlock])

  const value = useMemo(
    () => ({
      enabled,
      setEnabled,
      toggle: () => setEnabled((prev) => !prev),
      play,
      unlock,
      activateExperience,
    }),
    [activateExperience, enabled, play, unlock]
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
