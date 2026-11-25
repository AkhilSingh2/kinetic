import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/fraunces/400-italic.css'
import '@fontsource/fraunces/500.css'
import '@fontsource/fraunces/500-italic.css'
import '@fontsource/fraunces/600.css'
import '@fontsource/outfit/300.css'
import '@fontsource/outfit/400.css'
import '@fontsource/outfit/500.css'
import '@fontsource/ibm-plex-mono/400.css'
import 'lenis/dist/lenis.css'
import './styles/tokens.css'
import './styles/global.css'
import './styles/home.css'
import './styles/pages.css'
import App from './App'

const root = document.getElementById('root')
if (!root) throw new Error('Root element missing')

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
