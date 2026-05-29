import { createContext, useContext, useState, useCallback } from 'react'

const DEFAULTS = { soundsEnabled: true, useMetric: false }

function loadPrefs() {
  try {
    const stored = localStorage.getItem('klyp_prefs')
    return stored ? { ...DEFAULTS, ...JSON.parse(stored) } : { ...DEFAULTS }
  } catch {
    return { ...DEFAULTS }
  }
}

const UserPrefsContext = createContext(null)

export function UserPrefsProvider({ children }) {
  const [prefs, setPrefs] = useState(loadPrefs)

  const updatePref = useCallback((key, value) => {
    setPrefs(prev => {
      const next = { ...prev, [key]: value }
      try { localStorage.setItem('klyp_prefs', JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  return (
    <UserPrefsContext.Provider value={{ prefs, updatePref }}>
      {children}
    </UserPrefsContext.Provider>
  )
}

export function useUserPrefs() {
  return useContext(UserPrefsContext)
}
