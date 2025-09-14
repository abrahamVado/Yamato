import React from 'react'
import ReactDOM from 'react-dom/client'

// Your scaffold already has these:
import RootLayout from './app/layout'
import Home from './app/page'

// Global styles get pulled in by RootLayout (it imports "@/styles/app.scss"),
// but importing here is also fine if you prefer:
// import './styles/app.scss'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RootLayout>
      <Home />
    </RootLayout>
  </React.StrictMode>
)
