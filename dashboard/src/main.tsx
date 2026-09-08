import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/manrope'
import '@fontsource-variable/noto-sans-sc'
import '@fontsource-variable/jetbrains-mono'
import './index.css'
import App from './App'
import { installChunkRecovery } from './lib/chunk-recovery'

installChunkRecovery()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
