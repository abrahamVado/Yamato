import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// Global styles
import '@/styles/yamato.scss'
import '@/styles/bootsland.scss'

createRoot(document.getElementById('root')).render(<App />)
