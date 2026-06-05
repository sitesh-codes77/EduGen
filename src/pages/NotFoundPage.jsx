import { useNavigate, Link } from 'react-router-dom'
import { NotebookText, ChevronRight } from 'lucide-react'
import ThemeToggle from '../components/ThemeToggle'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--canvas)', color: 'var(--text-1)', paddingTop: '60px' }}>
      {/* ── Navbar ── */}
      <nav style={{ backgroundColor: 'var(--nav-bg)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <NotebookText size={22} color="#0EA5E9" />
            <span style={{ fontWeight: 800, fontSize: '1.25rem', color: '#0EA5E9', letterSpacing: '-0.02em' }}>
              EduGen
            </span>
          </div>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => navigate('/login')}
              style={{ backgroundColor: '#0EA5E9', border: '1.5px solid #0EA5E9', color: '#fff', borderRadius: '999px', padding: '8px 24px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', transition: 'all 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0 20px rgba(14,165,233,0.6)' }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none' }}>
              Login <ChevronRight size={13} />
            </button>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* ── Main 404 Container ── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2.5rem 1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          
          {/* 404 Text */}
          <h1 style={{ 
            fontSize: 'clamp(6rem, 14vw, 10rem)', 
            fontWeight: 900, 
            color: '#6366F1', 
            lineHeight: 0.95, 
            margin: 0, 
            letterSpacing: '-0.04em' 
          }}>
            404
          </h1>
          
          {/* Indigo divider line */}
          <div style={{ 
            height: '4px', 
            width: '64px', 
            borderRadius: '4px', 
            backgroundColor: '#6366F1', 
            margin: '1.75rem 0' 
          }}></div>
          
          {/* Page Not Found */}
          <p style={{ 
            fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', 
            fontWeight: 800, 
            color: 'var(--text-1)', 
            margin: 0, 
            letterSpacing: '-0.02em' 
          }}>
            Page Not Found
          </p>
          
          {/* Description */}
          <p style={{ 
            fontSize: 'clamp(0.875rem, 2.5vw, 1rem)', 
            marginTop: '1.25rem', 
            color: 'var(--text-3)', 
            maxWidth: '460px', 
            lineHeight: 1.6, 
            marginRight: 'auto', 
            marginLeft: 'auto' 
          }}>
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          
          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '2.25rem' }}>
            <Link
              to="/"
              style={{
                backgroundColor: 'var(--text-1)',
                color: 'var(--canvas)',
                padding: '12px 30px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.92rem',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                display: 'inline-block',
                cursor: 'pointer',
                border: '1.5px solid var(--text-1)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(0.975)'
                e.currentTarget.style.backgroundColor = 'var(--text-2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none'
                e.currentTarget.style.backgroundColor = 'var(--text-1)'
              }}
            >
              Return Home
            </Link>
            
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              style={{
                backgroundColor: 'transparent',
                border: '1.5px solid var(--border)',
                color: 'var(--text-2)',
                padding: '12px 30px',
                borderRadius: '8px',
                fontWeight: 650,
                fontSize: '0.92rem',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                display: 'inline-block',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(0.975)'
                e.currentTarget.style.borderColor = 'var(--text-2)'
                e.currentTarget.style.color = 'var(--text-1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none'
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.color = 'var(--text-2)'
              }}
            >
              Contact support
            </a>
          </div>
          
        </div>
      </div>
    </div>
  )
}
