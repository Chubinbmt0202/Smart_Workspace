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

  return isLoggedIn ? <Home /> : <LoginPage onLogin={handleLogin} />
}

export default App
