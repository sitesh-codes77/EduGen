import useWizardStore from '../store/useWizardStore'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useWizardStore()

  return (
    <button
      onClick={toggleTheme}
      title={isDark ? 'Switch to Dark Mode' :'Switch to Light Mode' }
      style={{
        width: '38px',
        height: '38px',
        borderRadius: '10px',
        backgroundColor: 'var(--card-2)',
        border: '1.5px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        color: isDark ? '#F59E0B' : '#475569',
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = isDark ? '#F59E0B' : '#0EA5E9'
        e.currentTarget.style.backgroundColor = isDark
          ? 'rgba(245,158,11,0.1)'
          : 'rgba(14,165,233,0.1)'
        e.currentTarget.style.color = isDark ? '#F59E0B' : '#0EA5E9'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.backgroundColor = 'var(--card-2)'
        e.currentTarget.style.color = isDark ? '#F59E0B' : '#475569'
      }}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}
