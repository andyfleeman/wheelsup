import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { UserPrefsProvider } from './contexts/UserPrefsContext'
import LoginPage from './pages/LoginPage'
import GaragePage from './pages/GaragePage'
import AddVehiclePage from './pages/AddVehiclePage'
import VehicleDashboard from './pages/VehicleDashboard'
import SettingsPage from './pages/SettingsPage'
import OnboardingModal from './components/OnboardingModal'
import './App.css'

function AppRouter() {
  const { user } = useAuth()
  const [view, setView] = useState('garage')
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [editingVehicle, setEditingVehicle] = useState(null)
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    if (user && !localStorage.getItem('klyp_onboarded')) {
      setShowOnboarding(true)
    }
  }, [user])

  const handleOnboardingDone = () => {
    localStorage.setItem('klyp_onboarded', '1')
    setShowOnboarding(false)
  }

  if (user === undefined) {
    return <div className="loading-screen">Loading...</div>
  }

  if (!user) return <LoginPage />

  if (view === 'settings') {
    return <SettingsPage onBack={() => setView('garage')} />
  }

  if (view === 'add') {
    return (
      <AddVehiclePage
        existing={editingVehicle}
        onSaved={() => {
          setEditingVehicle(null)
          setView(editingVehicle ? 'dashboard' : 'garage')
        }}
        onCancel={() => {
          setEditingVehicle(null)
          setView(editingVehicle ? 'dashboard' : 'garage')
        }}
      />
    )
  }

  if (view === 'dashboard' && selectedVehicle) {
    return (
      <>
        <VehicleDashboard
          vehicle={selectedVehicle}
          onBack={() => { setSelectedVehicle(null); setView('garage') }}
          onEdit={() => { setEditingVehicle(selectedVehicle); setView('add') }}
          onVehicleUpdate={updated => setSelectedVehicle(updated)}
        />
        {showOnboarding && <OnboardingModal onDone={handleOnboardingDone} />}
      </>
    )
  }

  return (
    <>
      <GaragePage
        onSelectVehicle={v => { setSelectedVehicle(v); setView('dashboard') }}
        onAddVehicle={() => { setEditingVehicle(null); setView('add') }}
        onSettings={() => setView('settings')}
      />
      {showOnboarding && <OnboardingModal onDone={handleOnboardingDone} />}
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <UserPrefsProvider>
        <AppRouter />
      </UserPrefsProvider>
    </AuthProvider>
  )
}
