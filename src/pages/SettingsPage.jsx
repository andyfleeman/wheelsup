import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useUserPrefs } from '../contexts/UserPrefsContext'
import { getUserProfile, saveUserProfile } from '../services/db'
import { fromMiles, toMiles, distUnit } from '../utils/units'
import './SettingsPage.css'

export default function SettingsPage({ onBack }) {
  const { user, logout } = useAuth()
  const { prefs, updatePref } = useUserPrefs()
  const [displayName, setDisplayName]         = useState('')
  const [defaultOilInterval, setDefaultOilInterval] = useState('')
  const [alertDays, setAlertDays]             = useState('')
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUserProfile(user.uid).then(p => {
      setDisplayName(p.displayName || '')
      setDefaultOilInterval(p.defaultOilInterval ? fromMiles(p.defaultOilInterval, prefs.useMetric) : '')
      setAlertDays(p.alertDays || '')
      setLoading(false)
    })
  }, [user.uid])

  const handleSave = async () => {
    setSaving(true)
    await saveUserProfile(user.uid, {
      displayName:        displayName.trim() || null,
      defaultOilInterval: defaultOilInterval ? toMiles(Number(defaultOilInterval), prefs.useMetric) : null,
      alertDays:          alertDays ? Number(alertDays) : null,
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="settings-page">
      <div className="settings-header">
        <button className="settings-back-btn" onClick={onBack}>←</button>
        <h2>Settings</h2>
      </div>

      {loading ? (
        <div className="settings-loading">Loading...</div>
      ) : (
        <div className="settings-body">

          <div className="settings-section">
            <div className="settings-section-title">Profile</div>
            <div className="settings-group">
              <label className="settings-row">
                <span className="settings-row-label">Display Name</span>
                <input
                  className="settings-input"
                  type="text"
                  placeholder={user.email?.split('@')[0] || 'Your name'}
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                />
              </label>
              <div className="settings-hint">Shown in your garage greeting. Defaults to your email username.</div>

              <div className="settings-row settings-row-readonly">
                <span className="settings-row-label">Email</span>
                <span className="settings-row-value">{user.email}</span>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <div className="settings-section-title">Preferences</div>
            <div className="settings-group">
              <label className="settings-row">
                <span className="settings-row-label">Oil Change Interval</span>
                <div className="settings-input-wrap">
                  <input
                    className="settings-input settings-input-short"
                    type="number"
                    placeholder="5000"
                    value={defaultOilInterval}
                    onChange={e => setDefaultOilInterval(e.target.value)}
                    min="500"
                    step="500"
                  />
                  <span className="settings-unit">{distUnit(prefs.useMetric)}</span>
                </div>
              </label>
              <div className="settings-hint">Your preferred oil change frequency. App default is {prefs.useMetric ? '8,000 km' : '5,000 mi'}.</div>

              <label className="settings-row">
                <span className="settings-row-label">Alert Window</span>
                <div className="settings-input-wrap">
                  <input
                    className="settings-input settings-input-short"
                    type="number"
                    placeholder="30"
                    value={alertDays}
                    onChange={e => setAlertDays(e.target.value)}
                    min="1"
                    max="365"
                  />
                  <span className="settings-unit">days before</span>
                </div>
              </label>
              <div className="settings-hint">How far ahead to surface upcoming service warnings.</div>
            </div>
          </div>

          <div className="settings-section">
            <div className="settings-section-title">App</div>
            <div className="settings-group">
              <div className="settings-row settings-row-toggle">
                <div>
                  <span className="settings-row-label">Sound Effects</span>
                  <div className="settings-hint settings-hint-inline">Play audio cues when adding vehicles and logging service</div>
                </div>
                <button
                  className={`settings-toggle${prefs.soundsEnabled ? ' settings-toggle--on' : ''}`}
                  onClick={() => updatePref('soundsEnabled', !prefs.soundsEnabled)}
                  aria-pressed={prefs.soundsEnabled}
                >
                  <span className="settings-toggle-knob" />
                </button>
              </div>

              <div className="settings-row settings-row-toggle">
                <div>
                  <span className="settings-row-label">Units</span>
                  <div className="settings-hint settings-hint-inline">Oil capacity display — quarts or liters</div>
                </div>
                <div className="settings-unit-toggle">
                  <button
                    className={`settings-unit-btn${!prefs.useMetric ? ' settings-unit-btn--active' : ''}`}
                    onClick={() => updatePref('useMetric', false)}
                  >Imperial</button>
                  <button
                    className={`settings-unit-btn${prefs.useMetric ? ' settings-unit-btn--active' : ''}`}
                    onClick={() => updatePref('useMetric', true)}
                  >Metric</button>
                </div>
              </div>
            </div>
          </div>

          <button
            className={`settings-save-btn${saved ? ' settings-save-btn--saved' : ''}`}
            onClick={handleSave}
            disabled={saving}
          >
            {saved ? '✓ Saved' : saving ? 'Saving…' : 'Save Changes'}
          </button>

          <div className="settings-section settings-section-account">
            <div className="settings-section-title">Account</div>
            <div className="settings-group">
              <button className="settings-signout-btn" onClick={logout}>
                Sign Out
              </button>
            </div>
          </div>

          <div className="settings-about">
            <div className="settings-about-logo">
              <svg viewBox="0 0 40 40" width="26" height="26" xmlns="http://www.w3.org/2000/svg">
                <polygon points="20,2 37,11 37,29 20,38 3,29 3,11" fill="#c62828"/>
                <polygon points="20,9 30,15 30,25 20,31 10,25 10,15" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
                <path d="M13 10 L13 30 M13 20 L23 10 M13 20 L25 30"
                      stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
              <span className="settings-about-name">Klutch</span>
            </div>
            <div className="settings-about-tagline">Your garage. Never miss a service.</div>
            <div className="settings-about-version">v1.0 · Vehicle Maintenance Tracker</div>
          </div>

        </div>
      )}
    </div>
  )
}
