import { useState } from 'react'
import './OnboardingModal.css'

const STEPS = [
  {
    id: 'welcome',
    showLogo: true,
    headline: 'The maintenance log you\'ll actually keep.',
    body: 'Voice logging. Smart reminders. OEM specs built in. Klyp takes 10 seconds to log a service — and makes sure you never skip one.',
    cta: 'Get Started →',
  },
  {
    id: 'features',
    headline: 'How it works',
    features: [
      { icon: '🗣️', title: 'Say it, we log it', desc: 'Tap the mic, say what you did. Klyp parses your service and logs it instantly.' },
      { icon: '📅', title: 'Smart due dates', desc: 'Tracks by mileage AND time — whichever comes first. We tell you the exact date and days remaining.' },
      { icon: '📋', title: 'Your car\'s full story', desc: 'A verified service history you can share when you sell. Buyers love it.' },
    ],
    cta: 'Next →',
  },
  {
    id: 'notifications',
    emoji: '🔔',
    headline: 'Stay ahead of service.',
    body: 'Get a heads-up before anything is due — not after. We\'ll say exactly how many miles and days you have left.',
    cta: 'Enable Notifications',
    ctaSecondary: 'Maybe Later',
  },
]

export default function OnboardingModal({ onDone }) {
  const [step, setStep] = useState(0)
  const current = STEPS[step]

  const handleCta = async () => {
    if (step < STEPS.length - 1) {
      setStep(s => s + 1)
      return
    }
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission()
    }
    onDone()
  }

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-modal">
        <div className="onboarding-progress">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`onboarding-dot${i === step ? ' active' : i < step ? ' done' : ''}`}
            />
          ))}
        </div>

        {current.showLogo && (
          <div className="onboarding-logo-wrap">
            <img src="/wheelsup/logo-mark.png" className="onboarding-logo-img" alt="Klyp" />
            <span className="onboarding-wordmark">Klyp</span>
          </div>
        )}

        {current.emoji && (
          <div className="onboarding-emoji">{current.emoji}</div>
        )}

        <h2 className="onboarding-headline">{current.headline}</h2>

        {current.body && (
          <p className="onboarding-body">{current.body}</p>
        )}

        {current.features && (
          <div className="onboarding-features">
            {current.features.map(f => (
              <div key={f.title} className="onboarding-feature">
                <span className="onboarding-feature-icon">{f.icon}</span>
                <div className="onboarding-feature-text">
                  <div className="onboarding-feature-title">{f.title}</div>
                  <div className="onboarding-feature-desc">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="onboarding-actions">
          <button className="onboarding-cta" onClick={handleCta}>
            {current.cta}
          </button>
          {current.ctaSecondary && (
            <button className="onboarding-skip" onClick={onDone}>
              {current.ctaSecondary}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
