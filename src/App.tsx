import { useState } from 'react'
import { LoginPage } from './pages/LoginPage'
import { Home } from './pages/Home'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem('isLoggedIn') === 'true' && Boolean(localStorage.getItem('email'))
  )

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('email')
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('password')
    setIsLoggedIn(false)
  }

  return isLoggedIn ? <Home onLogout={handleLogout} /> : <LoginPage onLogin={handleLogin} />
}

export default App
