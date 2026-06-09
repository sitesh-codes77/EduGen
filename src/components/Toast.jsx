import { useEffect, useState } from 'react'
import { X, AlertCircle, CheckCircle2, Info } from 'lucide-react'

const ICONS = {
  error:   { Icon: AlertCircle,   color: '#EF4444', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.3)' },
  success: { Icon: CheckCircle2,  color: '#10B981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.3)' },
  info:    { Icon: Info,          color: '#0EA5E9', bg: 'rgba(14,165,233,0.1)',  border: 'rgba(14,165,233,0.3)' },
}

export function Toast({ message, type = 'error', onClose, duration = 45000 }) {
  const [visible, setVisible] = useState(false)
  const { Icon, color, bg, border } = ICONS[type] || ICONS.error

  useEffect(() => {
    // mount animation
    const t1 = setTimeout(() => setVisible(true), 10)
    const t2 = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300)
    }, duration)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [duration, onClose])

  return (
    <div
      style={{
        position: 'fixed',
        top: '4.5rem',
        left: '50%',
        transform: `translateX(-50%) translateY(${visible ? '0' : '-20px'})`,
        opacity: visible ? 1 : 0,
        transition: 'transform 0.3s ease, opacity 0.3s ease',
        zIndex: 9999,
        backgroundColor: 'var(--card)',
        border: `1.5px solid ${border}`,
        borderRadius: '12px',
        padding: '1rem 1.25rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
        maxWidth: '480px',
        width: 'calc(100vw - 3rem)',
      }}
    >
      <div style={{ backgroundColor: bg, borderRadius: '8px', padding: '6px', flexShrink: 0 }}>
        <Icon size={18} color={color} />
      </div>
      <p style={{ color: 'var(--text-1)', fontSize: '0.875rem', lineHeight: 1.55, flex: 1 }}>
        {message}
      </p>
      <button
        onClick={() => { setVisible(false); setTimeout(onClose, 300) }}
        style={{
          background: 'none', border: 'none', color: 'var(--text-3)',
          cursor: 'pointer', padding: '2px', flexShrink: 0,
        }}
      >
        <X size={15} />
      </button>
    </div>
  )
}

/** Simple hook-free toast manager — used from WizardPage */
export function useToast() {
  const [toasts, setToasts] = useState([])

  const showToast = (message, type = 'error') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
  }

  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id))

  const ToastContainer = () => (
    <div style={{ position: 'fixed', top: '4.5rem', left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', zIndex: 9999, pointerEvents: 'none' }}>
      {toasts.map((t) => (
        <div key={t.id} style={{ pointerEvents: 'auto' }}>
          <Toast message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
        </div>
      ))}
    </div>
  )

  return { showToast, ToastContainer }
}
