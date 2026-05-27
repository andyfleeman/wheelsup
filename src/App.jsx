import { useState } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import LoginPage from './pages/LoginPage'
import GaragePage from './pages/GaragePage'
import AddVehiclePage from './pages/AddVehiclePage'
import VehicleDashboard from './pages/VehicleDashboard'
import './App.css'

function AppRouter() {
  const { user } = useAuth()
  const [view, setView] = useState('garage')
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [editingVehicle, setEditingVehicle] = useState(null)

  if (user === undefined) {
    return <div className="loading-screen">Loading...</div>
  }

  if (!user) return <LoginPage />

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
      <VehicleDashboard
        vehicle={selectedVehicle}
        onBack={() => { setSelectedVehicle(null); setView('garage') }}
        onEdit={() => { setEditingVehicle(selectedVehicle); setView('add') }}
      />
    )
  }

  return (
    <GaragePage
      onSelectVehicle={v => { setSelectedVehicle(v); setView('dashboard') }}
      onAddVehicle={() => { setEditingVehicle(null); setView('add') }}
    />
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  )
}
