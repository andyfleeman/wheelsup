import { useAuth } from '../contexts/AuthContext'
import './LoginPage.css'

const FEATURES = [
  { icon: '🗣️', text: 'Say it, we log it' },
  { icon: '📅', text: 'Smart reminders before anything is due' },
  { icon: '🔧', text: 'OEM specs for 300+ models, built in' },
]

export default function LoginPage() {
  const { login } = useAuth()

  return (
    <div className="login-page">
      <div className="login-content">
        <div className="login-logo">
          <svg viewBox="0 0 80 80" width="80" height="80" xmlns="http://www.w3.org/2000/svg" className="login-logo-hex">
            <defs>
              <linearGradient id="hexbg" x1="0" y1="0" x2="0.6" y2="1">
                <stop offset="0%" stopColor="#1e88e5"/>
                <stop offset="100%" stopColor="#1148a0"/>
              </linearGradient>
            </defs>
            <polygon points="40,3 74,22 74,58 40,77 6,58 6,22" fill="url(#hexbg)"/>
            <polygon points="40,14 63,27 63,53 40,66 17,53 17,27" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"/>
            <path d="M26 19 L26 61 M26 40 L48 19 M26 40 L51 61"
                  stroke="white" strokeWidth="7.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        </div>
        <h1 className="login-wordmark">Klyp</h1>
        <p className="login-tagline">The maintenance log you'll actually keep.</p>

        <div className="login-features">
          {FEATURES.map(f => (
            <div key={f.text} className="login-feature">
              <span className="login-feature-icon">{f.icon}</span>
              <span className="login-feature-text">{f.text}</span>
            </div>
          ))}
        </div>

        <button className="google-btn" onClick={login}>
          <svg width="20" height="20" viewBox="0 0 48 48" className="google-icon">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.29-8.16 2.29-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Continue with Google
        </button>

        <div className="login-footer">
          Free &nbsp;·&nbsp; No ads &nbsp;·&nbsp; Private
        </div>
      </div>
    </div>
  )
}
