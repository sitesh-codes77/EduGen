import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import useWizardStore from './store/useWizardStore'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import WizardPage from './pages/WizardPage'
import NotFoundPage from './pages/NotFoundPage'
import './index.css'

function App() {
  const isDark = useWizardStore((s) => s.isDark)

  // Sync html class whenever isDark changes
  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [isDark])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/generator" element={<WizardPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
