import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// Global styles
import '@/styles/yamato.scss'
import '@/styles/bootsland.scss'

// Providers
import { ThemeProvider } from '@/providers/ThemeProvider.jsx'
import { I18nProvider } from '@/providers/I18nProvider.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <I18nProvider defaultLang="en">
        <App />
      </I18nProvider>
    </ThemeProvider>
  </React.StrictMode>
)
