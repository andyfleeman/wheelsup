import { useState, useRef, useEffect } from 'react'
import './VoiceLogger.css'

// ── Service label map ──────────────────────────────────────────────────────
const SERVICE_LABELS = {
  oil_change:          'Oil Change',
  tire_rotation:       'Tire Rotation',
  air_filter:          'Engine Air Filter',
  cabin_air_filter:    'Cabin Air Filter',
  battery:             'Battery',
  brake_fluid:         'Brake Fluid',
  transmission_fluid:  'Transmission Fluid',
  coolant_flush:       'Coolant Flush',
  spark_plugs:         'Spark Plugs',
  wiper_blades:        'Wiper Blades',
}

// ── SVG icons (inline, no external deps) ─────────────────────────────────
function MicIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="2" width="6" height="13" rx="3" />
      <path d="M5 10a7 7 0 0 0 14 0" />
      <line x1="12" y1="17" x2="12" y2="21" />
      <line x1="9" y1="21" x2="15" y2="21" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="2,6 5,9 10,3" />
    </svg>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────
function formatMileageDisplay(miles, useMetric) {
  if (miles == null) return null
  if (useMetric) {
    return Math.round(miles * 1.60934).toLocaleString() + ' km'
  }
  return Number(miles).toLocaleString() + ' mi'
}

function buildGeminiPrompt(transcript) {
  return `You are a vehicle service record parser. Extract which maintenance services were performed and the current mileage from this voice input.

Available service IDs and their common names:
- oil_change: oil change, changed oil, oil and filter, lube
- tire_rotation: tire rotation, rotated tires, rotated
- air_filter: air filter, engine air filter
- cabin_air_filter: cabin filter, cabin air filter, interior filter
- battery: battery, new battery, replaced battery
- brake_fluid: brake fluid
- transmission_fluid: transmission fluid, tranny fluid
- coolant_flush: coolant flush, coolant, antifreeze flush
- spark_plugs: spark plugs, plugs, tune up, tune-up
- wiper_blades: wiper blades, wipers, new wipers

Return ONLY valid JSON, no markdown, no other text:
{"services": ["service_id1", "service_id2"], "mileage": 157246}

If no mileage is mentioned, use null for mileage.
Match service mentions loosely (e.g. "oil" matches oil_change, "tires" matches tire_rotation).

Voice input: "${transcript}"`
}

// ── States ────────────────────────────────────────────────────────────────
const STATE = {
  IDLE:       'idle',
  LISTENING:  'listening',
  PROCESSING: 'processing',
  REVIEW:     'review',
  ERROR:      'error',
}

// ── Component ─────────────────────────────────────────────────────────────
export default function VoiceLogger({ active, onConfirm, onClose, currentMileage, useMetric }) {
  const [uiState,  setUiState]  = useState(STATE.IDLE)
  const [errorMsg, setErrorMsg] = useState('')
  const [parsed,   setParsed]   = useState(null)   // { services, mileage }
  const recognitionRef = useRef(null)

  // Reset to idle whenever the panel is hidden
  useEffect(() => {
    if (!active) {
      stopRecognition()
      setUiState(STATE.IDLE)
      setErrorMsg('')
      setParsed(null)
    }
  }, [active])

  function stopRecognition() {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop() } catch (_) {}
      recognitionRef.current = null
    }
  }

  // ── Start listening ──────────────────────────────────────────────────────
  function handleMicPress() {
    // Guard: API key
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY
    if (!apiKey) {
      setErrorMsg('Voice logging requires a Gemini API key')
      setUiState(STATE.ERROR)
      return
    }

    // Guard: browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setErrorMsg('Voice input not supported on this device')
      setUiState(STATE.ERROR)
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognitionRef.current = recognition

    recognition.onstart = () => setUiState(STATE.LISTENING)

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      handleTranscript(transcript)
    }

    recognition.onerror = (event) => {
      // 'no-speech' is a common benign error; treat others as real errors
      if (event.error === 'no-speech') {
        setErrorMsg("We didn't hear anything. Try again.")
      } else {
        setErrorMsg("Couldn't capture audio. Try again.")
      }
      setUiState(STATE.ERROR)
    }

    recognition.onend = () => {
      // If we're still in LISTENING state here, no result came through
      setUiState(prev => prev === STATE.LISTENING ? STATE.ERROR : prev)
      if (uiState === STATE.LISTENING) {
        setErrorMsg("We didn't hear anything. Try again.")
      }
    }

    recognition.start()
  }

  // ── Send transcript to Gemini ────────────────────────────────────────────
  async function handleTranscript(transcript) {
    setUiState(STATE.PROCESSING)

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: buildGeminiPrompt(transcript) }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      })

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`)
      }

      const data = await response.json()
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text

      if (!rawText) {
        throw new Error('Empty response from Gemini')
      }

      const result = JSON.parse(rawText)

      // Validate services list
      if (!Array.isArray(result.services) || result.services.length === 0) {
        setErrorMsg('No services detected. Try again.')
        setUiState(STATE.ERROR)
        return
      }

      // If mileage was not spoken, fall back to currentMileage prop
      const resolvedMileage = (result.mileage != null) ? result.mileage : (currentMileage ?? null)

      setParsed({ services: result.services, mileage: resolvedMileage })
      setUiState(STATE.REVIEW)

    } catch (err) {
      console.error('[VoiceLogger] Gemini error:', err)
      setErrorMsg("Couldn't parse that. Try again.")
      setUiState(STATE.ERROR)
    }
  }

  // ── Confirm / reset helpers ──────────────────────────────────────────────
  function handleConfirm() {
    if (parsed) {
      onConfirm({ services: parsed.services, mileage: parsed.mileage })
    }
    reset()
  }

  function reset() {
    stopRecognition()
    setUiState(STATE.IDLE)
    setErrorMsg('')
    setParsed(null)
  }

  function handleClose() {
    reset()
    onClose?.()
  }

  // ── Render nothing when not active ──────────────────────────────────────
  if (!active) return null

  const mileageDisplay = parsed ? formatMileageDisplay(parsed.mileage, useMetric) : null

  // ── UI ───────────────────────────────────────────────────────────────────
  return (
    <div className="vl-overlay" onClick={handleClose}>
      <div className="vl-sheet" onClick={e => e.stopPropagation()}>
        <div className="vl-handle" />

        {/* ── IDLE / LISTENING: mic button + coaching prompt ── */}
        {(uiState === STATE.IDLE || uiState === STATE.LISTENING) && (
          <>
            <button
              className={`vl-mic-btn${uiState === STATE.LISTENING ? ' listening' : ''}`}
              onClick={uiState === STATE.IDLE ? handleMicPress : undefined}
              aria-label={uiState === STATE.LISTENING ? 'Listening…' : 'Start voice logging'}
              disabled={uiState === STATE.LISTENING}
            >
              <MicIcon />
            </button>

            {uiState === STATE.LISTENING && (
              <div className="vl-status">
                <span className="vl-status-dot" />
                Listening…
              </div>
            )}

            <div className="vl-coaching">
              <div className="vl-coaching-label">Say</div>
              <div className="vl-coaching-text">
                Services performed and mileage.
              </div>
              <div className="vl-coaching-example">
                "Oil change and tire rotation at 157,246 miles"
              </div>
            </div>

            {uiState === STATE.IDLE && (
              <div className="vl-actions">
                <button className="vl-cancel-btn" onClick={handleClose}>Cancel</button>
                <button className="vl-confirm-btn" onClick={handleMicPress}>Tap to Speak</button>
              </div>
            )}
          </>
        )}

        {/* ── PROCESSING spinner ── */}
        {uiState === STATE.PROCESSING && (
          <div className="vl-processing">
            <div className="vl-spinner" aria-label="Analyzing" />
            <div className="vl-processing-text">Analyzing…</div>
          </div>
        )}

        {/* ── REVIEW: parsed result card ── */}
        {uiState === STATE.REVIEW && parsed && (
          <>
            <div className="vl-result">
              <div className="vl-result-header">Detected services</div>

              <div className="vl-result-card">
                {parsed.services.map((id, i) => (
                  <div key={id} className="vl-service-row">
                    <div className="vl-check-icon"><CheckIcon /></div>
                    <span>{SERVICE_LABELS[id] ?? id}</span>
                  </div>
                ))}

                {mileageDisplay && (
                  <>
                    <div className="vl-divider" />
                    <div className="vl-mileage-row">
                      <span className="vl-mileage-label">Mileage</span>
                      <span>{mileageDisplay}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="vl-actions">
              <button className="vl-cancel-btn" onClick={reset}>Try Again</button>
              <button className="vl-confirm-btn" onClick={handleConfirm}>Confirm</button>
            </div>
          </>
        )}

        {/* ── ERROR ── */}
        {uiState === STATE.ERROR && (
          <>
            <div className="vl-error">
              <div className="vl-error-text">{errorMsg}</div>
            </div>

            <div className="vl-actions">
              <button className="vl-cancel-btn" onClick={handleClose}>Cancel</button>
              {/* Don't show Try Again for hard blocks (unsupported / no API key) */}
              {errorMsg !== 'Voice input not supported on this device' &&
               errorMsg !== 'Voice logging requires a Gemini API key' && (
                <button className="vl-confirm-btn" onClick={reset}>Try Again</button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
