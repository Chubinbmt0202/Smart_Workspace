import { useState } from 'react'
import { LoginPage } from './pages/LoginPage'
import { Home } from './pages/Home'
import { signOutFirebase } from './services/firebase'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () =>
      localStorage.getItem('isLoggedIn') === 'true' &&
      Boolean(localStorage.getItem('email')) &&
      Boolean(localStorage.getItem('userId'))
  )

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = async () => {
    try {
      await signOutFirebase()
    } catch (error) {
      console.error('Failed to sign out from Firebase:', error)
    }
    localStorage.removeItem('email')
    localStorage.removeItem('userId')
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('password')
    localStorage.removeItem('displayName')
    localStorage.removeItem('photoURL')
    setIsLoggedIn(false)
  }

  return isLoggedIn ? <Home onLogout={handleLogout} /> : <LoginPage onLogin={handleLogin} />
}

export default App
