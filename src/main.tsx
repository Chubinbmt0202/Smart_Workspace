import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import App from './App'
import '@radix-ui/themes/styles.css'
import { Theme } from '@radix-ui/themes'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Theme style={{ height: '100%' }}>
    <App />
    </Theme>
  </StrictMode>,
)
