// Web Audio API sound synthesis — no audio files required

function getCtx() {
  if (!window._klutchAudioCtx) {
    window._klutchAudioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  return window._klutchAudioCtx
}

// Race car flyby: engine roar that sweeps in pitch then fades
export function playCarFlyby() {
  try {
    const ctx = getCtx()
    const now = ctx.currentTime

    // Master gain
    const master = ctx.createGain()
    master.gain.setValueAtTime(0, now)
    master.gain.linearRampToValueAtTime(0.35, now + 0.08)
    master.gain.linearRampToValueAtTime(0.28, now + 0.35)
    master.gain.linearRampToValueAtTime(0, now + 0.75)
    master.connect(ctx.destination)

    // Engine oscillator — low rumble sweeping up then down
    const osc1 = ctx.createOscillator()
    osc1.type = 'sawtooth'
    osc1.frequency.setValueAtTime(80, now)
    osc1.frequency.linearRampToValueAtTime(220, now + 0.25)
    osc1.frequency.linearRampToValueAtTime(140, now + 0.55)
    osc1.frequency.linearRampToValueAtTime(90, now + 0.75)

    // Distortion for engine grit
    const dist = ctx.createWaveShaper()
    const curve = new Float32Array(256)
    for (let i = 0; i < 256; i++) {
      const x = (i * 2) / 256 - 1
      curve[i] = (Math.PI + 300) * x / (Math.PI + 300 * Math.abs(x))
    }
    dist.curve = curve

    // High harmonic layer
    const osc2 = ctx.createOscillator()
    osc2.type = 'sawtooth'
    osc2.frequency.setValueAtTime(160, now)
    osc2.frequency.linearRampToValueAtTime(440, now + 0.25)
    osc2.frequency.linearRampToValueAtTime(280, now + 0.55)

    const gain2 = ctx.createGain()
    gain2.gain.setValueAtTime(0.15, now)
    gain2.gain.linearRampToValueAtTime(0, now + 0.75)

    // Low rumble
    const osc3 = ctx.createOscillator()
    osc3.type = 'square'
    osc3.frequency.setValueAtTime(40, now)
    osc3.frequency.linearRampToValueAtTime(55, now + 0.3)
    osc3.frequency.linearRampToValueAtTime(35, now + 0.75)

    const gain3 = ctx.createGain()
    gain3.gain.setValueAtTime(0.2, now)
    gain3.gain.linearRampToValueAtTime(0, now + 0.75)

    osc1.connect(dist)
    dist.connect(master)
    osc2.connect(gain2)
    gain2.connect(master)
    osc3.connect(gain3)
    gain3.connect(master)

    osc1.start(now)
    osc2.start(now)
    osc3.start(now)
    osc1.stop(now + 0.75)
    osc2.stop(now + 0.75)
    osc3.stop(now + 0.75)
  } catch (_) {
    // Audio not supported — fail silently
  }
}

// Tire burnout: white noise burst + rubber squeal
export function playBurnout() {
  try {
    const ctx = getCtx()
    const now = ctx.currentTime

    const master = ctx.createGain()
    master.gain.setValueAtTime(0, now)
    master.gain.linearRampToValueAtTime(0.4, now + 0.04)
    master.gain.setValueAtTime(0.4, now + 0.3)
    master.gain.exponentialRampToValueAtTime(0.001, now + 0.9)
    master.connect(ctx.destination)

    // White noise (tire smoke/screech texture)
    const bufferSize = ctx.sampleRate * 0.9
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1
    const noise = ctx.createBufferSource()
    noise.buffer = buffer

    // Bandpass filter — focus on the screech frequency
    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.setValueAtTime(1800, now)
    bp.frequency.linearRampToValueAtTime(3200, now + 0.35)
    bp.frequency.linearRampToValueAtTime(1200, now + 0.9)
    bp.Q.value = 3.5

    // Squeal oscillator
    const squeal = ctx.createOscillator()
    squeal.type = 'sine'
    squeal.frequency.setValueAtTime(900, now)
    squeal.frequency.linearRampToValueAtTime(1400, now + 0.15)
    squeal.frequency.linearRampToValueAtTime(800, now + 0.6)
    squeal.frequency.linearRampToValueAtTime(600, now + 0.9)

    const squealGain = ctx.createGain()
    squealGain.gain.setValueAtTime(0.15, now)
    squealGain.gain.linearRampToValueAtTime(0.22, now + 0.15)
    squealGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9)

    noise.connect(bp)
    bp.connect(master)
    squeal.connect(squealGain)
    squealGain.connect(master)

    noise.start(now)
    squeal.start(now)
    noise.stop(now + 0.9)
    squeal.stop(now + 0.9)
  } catch (_) {
    // Audio not supported — fail silently
  }
}
